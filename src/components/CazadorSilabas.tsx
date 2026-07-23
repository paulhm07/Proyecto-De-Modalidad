"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Heart,
  RefreshCw,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { Confetti } from "@/components/Toasts";

/* ============================================================
   Cazador de Sílabas — Minijuego de Lengua (globos en movimiento)
   ------------------------------------------------------------
   Mecánica:
   1. Se muestra una palabra objetivo separada en sílabas
   2. Globos con sílabas suben verticalmente desde abajo
   3. El niño debe reventar (tocar) los globos en el ORDEN CORRECTO
   4. Acierto → globo explota + avanza progreso + 10 pts
   5. Error → vibra + sacude palabra + reinicia progreso + -1 vida
   6. Palabra completada → +20 bonus + nueva palabra
   7. 8 rondas, 3 vidas
   ============================================================ */

type Estado = "jugando" | "completado";

interface PalabraEntry {
  word: string;
  syllables: string[];
}

const BANCO_PALABRAS: PalabraEntry[] = [
  { word: "PLÁTANO", syllables: ["PLÁ", "TA", "NO"] },
  { word: "MARIPOSA", syllables: ["MA", "RI", "PO", "SA"] },
  { word: "ELEFANTE", syllables: ["E", "LE", "FAN", "TE"] },
  { word: "JIRAFA", syllables: ["JI", "RA", "FA"] },
  { word: "TORTUGA", syllables: ["TOR", "TU", "GA"] },
  { word: "PELOTA", syllables: ["PE", "LO", "TA"] },
  { word: "GUITARRA", syllables: ["GUI", "TA", "RRA"] },
  { word: "VENTANA", syllables: ["VEN", "TA", "NA"] },
];

const TOTAL_RONDAS = 8;
const COLORES = ["red", "blue", "green", "yellow", "purple"] as const;
type ColorGlobo = (typeof COLORES)[number];

interface Globo {
  id: number;
  silaba: string;
  x: number;
  y: number;
  speed: number;
  color: ColorGlobo;
  popping?: boolean;
}

// Recursos gráficos de globos (claymorphic, fondo blanco → mix-blend-multiply)
const MAPA_IMAGENES: Record<ColorGlobo, string> = {
  red: "/syllable-game/balloon_red.png",
  blue: "/syllable-game/balloon_blue.png",
  green: "/syllable-game/balloon_green.png",
  yellow: "/syllable-game/balloon_yellow.png",
  purple: "/syllable-game/balloon_purple.png",
};

let globoIdCounter = 0;

export function CazadorSilabas() {
  const [estado, setEstado] = useState<Estado>("jugando");
  const [ronda, setRonda] = useState(1);
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [palabraActual, setPalabraActual] = useState<PalabraEntry>(
    () => BANCO_PALABRAS[0]
  );
  const [silabaIndex, setSilabaIndex] = useState(0);
  const [globos, setGlobos] = useState<Globo[]>([]);
  const [feedback, setFeedback] = useState<{
    msg: string;
    tipo: "ok" | "err";
  } | null>(null);
  const [confettiOn, setConfettiOn] = useState(false);
  const [sacudiendo, setSacudiendo] = useState(false);

  const areaRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const spawnRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const corriendoRef = useRef(true);
  const palabraActualRef = useRef(palabraActual);
  const silabaIndexRef = useRef(silabaIndex);
  const audioCtxRef = useRef<AudioContext | null>(null);

  palabraActualRef.current = palabraActual;
  silabaIndexRef.current = silabaIndex;

  // ===== Audio con Web Audio API =====
  const getAudio = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return audioCtxRef.current;
  };

  const tocarTono = useCallback(
    (freq: number, duracion: number, tipo: OscillatorType = "sine", delay = 0) => {
      const ctx = getAudio();
      if (!ctx) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = tipo;
        osc.frequency.value = freq;
        const t = ctx.currentTime + delay;
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + duracion);
        osc.start(t);
        osc.stop(t + duracion);
      } catch {
        /* noop */
      }
    },
    []
  );

  const tocarPop = useCallback(() => {
    const ctx = getAudio();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      /* noop */
    }
  }, []);

  const tocarExito = useCallback(() => {
    [523, 659, 784].forEach((f, i) => tocarTono(f, 0.15, "sine", i * 0.1));
  }, [tocarTono]);

  const tocarError = useCallback(() => {
    tocarTono(150, 0.3, "sawtooth", 0);
  }, [tocarTono]);

  const tocarVictoria = useCallback(() => {
    [523, 659, 784, 1047].forEach((f, i) =>
      tocarTono(f, 0.2, "sine", i * 0.12)
    );
  }, [tocarTono]);

  const vibrar = useCallback((patron: number[]) => {
    if (typeof window !== "undefined") {
      try {
        navigator.vibrate?.(patron);
      } catch {
        /* noop */
      }
    }
  }, []);

  // ===== Generar un globo =====
  const spawnGlobo = useCallback(() => {
    if (!corriendoRef.current || !areaRef.current) return;
    const anchoArea = areaRef.current.offsetWidth;
    if (anchoArea === 0) return;

    // 50% probabilidad: sílaba correcta; 50%: distractor
    const silabasActuales = palabraActualRef.current.syllables;
    const idx = silabaIndexRef.current;
    let silaba: string;
    if (idx < silabasActuales.length && Math.random() < 0.5) {
      silaba = silabasActuales[idx];
    } else {
      const rw = BANCO_PALABRAS[Math.floor(Math.random() * BANCO_PALABRAS.length)];
      silaba = rw.syllables[Math.floor(Math.random() * rw.syllables.length)];
    }

    const color = COLORES[Math.floor(Math.random() * COLORES.length)];
    const x = Math.random() * (anchoArea - 90);
    const speed = 1.2 + Math.random() * 1.3; // apto para niños

    setGlobos((prev) => [
      ...prev,
      {
        id: ++globoIdCounter,
        silaba,
        x,
        y: areaRef.current!.offsetHeight,
        speed,
        color,
      },
    ]);
  }, []);

  // ===== Loop de movimiento =====
  useEffect(() => {
    const mover = () => {
      if (!corriendoRef.current) return;
      setGlobos((prev) => {
        const altura = areaRef.current?.offsetHeight ?? 400;
        return prev
          .map((g) => ({ ...g, y: g.y - g.speed }))
          .filter((g) => g.y > -130 || g.popping); // mantener popping hasta que se elimine
      });
      animRef.current = requestAnimationFrame(mover);
    };
    animRef.current = requestAnimationFrame(mover);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // ===== Loop de spawn =====
  useEffect(() => {
    corriendoRef.current = true;
    const tick = () => {
      spawnGlobo();
      spawnRef.current = setTimeout(tick, 1500);
    };
    spawnRef.current = setTimeout(tick, 500);
    return () => {
      corriendoRef.current = false;
      if (spawnRef.current) clearTimeout(spawnRef.current);
    };
  }, [spawnGlobo]);

  // ===== Reventar un globo =====
  const reventarGlobo = useCallback(
    (globo: Globo) => {
      if (globo.popping) return;
      tocarPop();

      // Marcar como popping (animación de explosión)
      setGlobos((prev) =>
        prev.map((g) => (g.id === globo.id ? { ...g, popping: true } : g))
      );

      // Eliminar después de la animación
      setTimeout(() => {
        setGlobos((prev) => prev.filter((g) => g.id !== globo.id));
      }, 300);

      // Validar sílaba
      const esperada = palabraActual.syllables[silabaIndex];
      if (globo.silaba === esperada) {
        // ACIERTO
        const nuevoIndex = silabaIndex + 1;
        setPuntos((p) => p + 10);
        setSilabaIndex(nuevoIndex);
        setFeedback({ msg: "✓ ¡Bien! Sigue", tipo: "ok" });
        tocarExito();

        if (nuevoIndex >= palabraActual.syllables.length) {
          // ¡Palabra completada!
          setPuntos((p) => p + 20);
          setFeedback({
            msg: "🎉 ¡Palabra completada! +20 bonus",
            tipo: "ok",
          });
          setTimeout(() => {
            const nuevaRonda = ronda + 1;
            if (nuevaRonda > TOTAL_RONDAS) {
              setEstado("completado");
              tocarVictoria();
              setConfettiOn(true);
              corriendoRef.current = false;
            } else {
              setRonda(nuevaRonda);
              const nuevaPalabra =
                BANCO_PALABRAS[Math.floor(Math.random() * BANCO_PALABRAS.length)];
              setPalabraActual(nuevaPalabra);
              setSilabaIndex(0);
              setFeedback(null);
            }
          }, 1200);
        }
      } else {
        // ERROR
        const nuevasVidas = vidas - 1;
        setVidas(nuevasVidas);
        setFeedback({
          msg: "✗ Sílaba incorrecta. ¡Empieza de nuevo!",
          tipo: "err",
        });
        setSilabaIndex(0);
        setSacudiendo(true);
        tocarError();
        vibrar([200, 100, 200, 100, 200]);
        setTimeout(() => setSacudiendo(false), 400);

        if (nuevasVidas <= 0) {
          setTimeout(() => {
            setEstado("completado");
            tocarVictoria();
            corriendoRef.current = false;
          }, 800);
        }
      }
    },
    [palabraActual, silabaIndex, vidas, tocarExito, tocarError, tocarPop, tocarVictoria, vibrar, ronda]
  );

  const reiniciar = useCallback(() => {
    setEstado("jugando");
    setRonda(1);
    setPuntos(0);
    setVidas(3);
    setPalabraActual(BANCO_PALABRAS[Math.floor(Math.random() * BANCO_PALABRAS.length)]);
    setSilabaIndex(0);
    setGlobos([]);
    setFeedback(null);
    setConfettiOn(false);
    corriendoRef.current = true;
  }, []);

  // ===== Pantalla de completado =====
  if (estado === "completado") {
    const mensaje =
      puntos >= 80
        ? "¡Excelente! Eres un cazador de sílabas 🏆"
        : puntos >= 50
        ? "¡Muy bien! Formaste muchas palabras 🎉"
        : "¡Sigue practicando! Los globos te esperan 💪";
    return (
      <div className="relative flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-cyan-50 to-sky-50 p-6 text-center">
        {confettiOn && <Confetti />}
        <div className="text-7xl">🏆</div>
        <h2 className="mt-4 font-display text-2xl font-bold text-blue-700">
          ¡Juego terminado!
        </h2>
        <p className="mt-2 max-w-md text-blue-900/70">{mensaje}</p>
        <div className="mt-6 flex items-center gap-6 rounded-2xl bg-white/70 px-8 py-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Star className="text-amber-500" size={28} fill="currentColor" />
            <span className="text-2xl font-bold text-blue-700">{puntos}</span>
          </div>
          <div className="h-8 w-px bg-blue-200" />
          <div className="flex items-center gap-2">
            <Heart className="text-rose-500" size={24} fill="currentColor" />
            <span className="text-xl font-bold text-rose-600">{vidas}</span>
          </div>
        </div>
        <button
          onClick={reiniciar}
          className="mt-8 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-500 px-8 py-3 font-bold text-white shadow-lg transition hover:scale-105 active:scale-95"
        >
          <RefreshCw size={18} strokeWidth={2.5} />
          Jugar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-gradient-to-b from-blue-100 via-sky-100 to-cyan-100">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 bg-white/60 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 text-amber-500">
          <Star size={20} fill="currentColor" />
          <span className="font-bold">{puntos}</span>
        </div>
        <span className="text-sm font-semibold text-blue-700/70">
          Ronda {ronda}/{TOTAL_RONDAS}
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              size={18}
              className={i < vidas ? "text-rose-500" : "text-rose-200"}
              fill="currentColor"
            />
          ))}
        </div>
      </div>

      {/* Palabra objetivo + progreso */}
      <div className="bg-white/80 px-4 py-3 text-center">
        <p className="text-xs font-semibold text-gray-500">
          Forma esta palabra (toca los globos en orden):
        </p>
        <p
          className={`mt-1 font-display text-3xl font-bold tracking-wide ${
            sacudiendo ? "animate-[shake_0.4s_ease] text-rose-600" : "text-violet-600"
          }`}
        >
          {palabraActual.syllables.join(" - ")}
        </p>
        <p className="mt-1 text-sm font-bold text-green-600">
          {palabraActual.syllables
            .map((s, i) => (i < silabaIndex ? `✓${s}` : "___"))
            .join(" - ")}
        </p>
      </div>

      {/* Área de juego */}
      <div
        ref={areaRef}
        className="relative h-[440px] w-full overflow-hidden"
      >
        {globos.map((globo) => (
          <button
            key={globo.id}
            onClick={() => reventarGlobo(globo)}
            className={`absolute cursor-pointer select-none transition-none ${
              globo.popping ? "animate-[globo-pop_0.3s_ease_forwards]" : ""
            }`}
            style={{
              left: `${globo.x}px`,
              top: `${globo.y}px`,
              width: "90px",
              height: "110px",
            }}
            aria-label={`Globo con sílaba ${globo.silaba}`}
          >
            {/* Globo (imagen claymorphic) con sílaba sobrepuesta */}
            <div className="relative h-[100px] w-[90px]">
              <img
                src={MAPA_IMAGENES[globo.color]}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full object-contain mix-blend-multiply"
                draggable={false}
              />
              <span
                className="absolute inset-0 flex items-center justify-center pb-2 text-xl font-black text-white"
                style={{
                  textShadow:
                    "2px 2px 4px rgba(0,0,0,0.65), 0 0 3px rgba(0,0,0,0.5)",
                }}
              >
                {globo.silaba}
              </span>
            </div>
            {/* Cordel */}
            <div
              className="absolute bottom-0 left-1/2 h-3 w-0.5 -translate-x-1/2 bg-gray-500"
            />
          </button>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`mx-4 mb-4 rounded-xl px-4 py-2 text-center font-bold ${
            feedback.tipo === "ok"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      <style jsx>{`
        @keyframes globo-pop {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.8; }
          100% { transform: scale(0.3); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-12px); }
          50% { transform: translateX(12px); }
          75% { transform: translateX(-8px); }
        }
      `}</style>
    </div>
  );
}
