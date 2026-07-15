"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Heart,
  RefreshCw,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { Confetti } from "@/components/Toasts";

/* ============================================================
   Alimenta al Monstruo — Minijuego de matemáticas (drag & drop)
   ------------------------------------------------------------
   Mecánica:
   1. Se muestra una multiplicación o división (ej: 24 ÷ 3 = ?)
   2. El monstruo está arriba con la boca abierta (zona DROP)
   3. Tres botones con números están abajo (DRAG SOURCE)
   4. El niño arrastra la respuesta correcta al monstruo
      (en móvil: toca el botón y luego toca el monstruo)
   5. Acierto → monstruo mastica + 10 pts + auto-avance
   6. Fallo → monstruo se sacude + vibra + pierde 1 vida
   7. 10 rondas, 3 vidas
   ============================================================ */

type Estado = "jugando" | "acertando" | "fallando" | "completado";

interface Pregunta {
  texto: string;
  respuesta: number;
  opciones: number[];
}

const TOTAL_RONDAS = 10;

// Banco de palabras del monstruo según estado
const FRASES = {
  hambre: ["¡Tengo hambre! 🤤", "Dame comida... 🍽️", "¡Ñam, ñam! 😋"],
  recibiendo: ["¡Aquí, aquí! 👄", "¡Dame la respuesta! 😋"],
  comiendo: ["¡Ñam ñam! 😋", "¡Qué rico! 🤤", "¡Delicioso! 😍"],
  no_le_gusta: ["¡Esa no me gusta! 😤", "¡Bleh! 🤢", "¡Inténta otra! 😖"],
};

function fraseAleatoria(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generarPregunta(): Pregunta {
  const esMult = Math.random() < 0.5;
  let texto: string;
  let respuesta: number;

  if (esMult) {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    texto = `${a} × ${b} = ?`;
    respuesta = a * b;
  } else {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const dividendo = a * b;
    texto = `${dividendo} ÷ ${b} = ?`;
    respuesta = a;
  }

  // Generar 3 opciones: la correcta + 2 distractores cercanos
  const opciones = new Set<number>([respuesta]);
  while (opciones.size < 3) {
    const offset = Math.floor(Math.random() * 7) - 3; // -3..3
    const distractor = respuesta + offset;
    if (distractor > 0 && distractor !== respuesta) {
      opciones.add(distractor);
    }
  }

  return {
    texto,
    respuesta,
    opciones: [...opciones].sort(() => Math.random() - 0.5),
  };
}

export function AlimentaMonstruo() {
  const [estado, setEstado] = useState<Estado>("jugando");
  const [ronda, setRonda] = useState(1);
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [pregunta, setPregunta] = useState<Pregunta>(() => generarPregunta());
  const [fraseMonstruo, setFraseMonstruo] = useState(
    fraseAleatoria(FRASES.hambre)
  );
  const [feedback, setFeedback] = useState<{ msg: string; tipo: "ok" | "err" } | null>(null);
  const [botonSeleccionado, setBotonSeleccionado] = useState<number | null>(null);
  const [monstruoAnim, setMonstruoAnim] = useState<"idle" | "comiendo" | "sacudiendo">("idle");
  const [zonaActiva, setZonaActiva] = useState(false); // highlight del drop target
  const [confettiOn, setConfettiOn] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Audio con Web Audio API (sin MP3)
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
    (
      freq: number,
      duracion: number,
      tipo: OscillatorType = "sine",
      delay = 0
    ) => {
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
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + duracion);
        osc.start(t);
        osc.stop(t + duracion);
      } catch {
        /* noop */
      }
    },
    []
  );

  const tocarComer = useCallback(() => {
    // Secuencia ascendente DO-MI-SOL
    tocarTono(523, 0.1, "sine", 0);
    tocarTono(659, 0.1, "sine", 0.12);
    tocarTono(784, 0.15, "sine", 0.24);
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
    if (typeof window !== "undefined" && "navigator" in window) {
      try {
        navigator.vibrate?.(patron);
      } catch {
        /* noop */
      }
    }
  }, []);

  const siguienteRonda = useCallback(() => {
    if (ronda + 1 > TOTAL_RONDAS) {
      setEstado("completado");
      tocarVictoria();
      setConfettiOn(true);
      return;
    }
    setRonda((r) => r + 1);
    setPregunta(generarPregunta());
    setFeedback(null);
    setBotonSeleccionado(null);
    setFraseMonstruo(fraseAleatoria(FRASES.hambre));
    setEstado("jugando");
  }, [ronda, tocarVictoria]);

  const validar = useCallback(
    (valor: number) => {
      if (estado !== "jugando") return;
      setBotonSeleccionado(null);

      if (valor === pregunta.respuesta) {
        // ACIERTO
        setEstado("acertando");
        setPuntos((p) => p + 10);
        setFeedback({ msg: "¡Correcto! El monstruo está feliz 😋", tipo: "ok" });
        setFraseMonstruo(fraseAleatoria(FRASES.comiendo));
        setMonstruoAnim("comiendo");
        tocarComer();

        setTimeout(() => {
          setMonstruoAnim("idle");
          siguienteRonda();
        }, 1200);
      } else {
        // FALLO
        setEstado("fallando");
        const nuevasVidas = vidas - 1;
        setVidas(nuevasVidas);
        setFeedback({ msg: "¡Ups! Esa no era. Intenta de nuevo 😖", tipo: "err" });
        setFraseMonstruo(fraseAleatoria(FRASES.no_le_gusta));
        setMonstruoAnim("sacudiendo");
        tocarError();
        vibrar([200, 100, 200, 100, 200]);

        setTimeout(() => {
          setMonstruoAnim("idle");
          if (nuevasVidas <= 0) {
            setEstado("completado");
            tocarVictoria();
          } else {
            setFeedback(null);
            setEstado("jugando");
          }
        }, 800);
      }
    },
    [estado, pregunta, vidas, tocarComer, tocarError, tocarVictoria, vibrar, siguienteRonda]
  );

  const reiniciar = useCallback(() => {
    setEstado("jugando");
    setRonda(1);
    setPuntos(0);
    setVidas(3);
    setPregunta(generarPregunta());
    setFeedback(null);
    setBotonSeleccionado(null);
    setFraseMonstruo(fraseAleatoria(FRASES.hambre));
    setConfettiOn(false);
  }, []);

  // ===== Drag and Drop handlers =====
  const onDragStart = (e: React.DragEvent, valor: number) => {
    e.dataTransfer.setData("text/plain", String(valor));
    setZonaActiva(true);
  };

  const onDragEnd = () => setZonaActiva(false);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setZonaActiva(false);
    const valor = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (!isNaN(valor)) validar(valor);
  };

  // Click en botón (móvil: seleccionar y luego tocar monstruo)
  const onClickBoton = (valor: number) => {
    setBotonSeleccionado(valor);
    setFraseMonstruo(fraseAleatoria(FRASES.recibiendo));
  };

  const onClickMonstruo = () => {
    if (botonSeleccionado !== null) {
      validar(botonSeleccionado);
    }
  };

  // ===== Pantalla de completado =====
  if (estado === "completado") {
    const mensaje =
      puntos >= 80
        ? "¡Excelente! Eres un genio de las matemáticas 🏆"
        : puntos >= 50
        ? "¡Muy bien! El monstruo quedó satisfecho 🎉"
        : "¡Sigue practicando! El monstruo tendrá más hambre otra vez 💪";
    return (
      <div className="relative flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 p-6 text-center">
        {confettiOn && <Confetti />}
        <div className="flex items-end justify-center gap-2">
          <div className="text-6xl">🏆</div>
          <img
            src="/game-assets/dona_chispas.png"
            alt="Dona de recompensa"
            className="h-16 w-16 object-contain mix-blend-multiply"
            draggable={false}
          />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-orange-700">
          ¡Juego terminado!
        </h2>
        <p className="mt-2 max-w-md text-orange-900/70">{mensaje}</p>
        <div className="mt-6 flex items-center gap-6 rounded-2xl bg-white/70 px-8 py-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Star className="text-amber-500" size={28} fill="currentColor" />
            <span className="text-2xl font-bold text-orange-700">{puntos}</span>
          </div>
          <div className="h-8 w-px bg-orange-200" />
          <div className="flex items-center gap-2">
            <Heart className="text-rose-500" size={24} fill="currentColor" />
            <span className="text-xl font-bold text-rose-600">{vidas}</span>
          </div>
        </div>
        <button
          onClick={reiniciar}
          className="mt-8 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 px-8 py-3 font-bold text-white shadow-lg transition hover:scale-105 active:scale-95"
        >
          <RefreshCw size={18} strokeWidth={2.5} />
          Jugar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 bg-white/60 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 text-amber-600">
          <Star size={20} fill="currentColor" />
          <span className="font-bold">{puntos}</span>
        </div>
        <span className="text-sm font-semibold text-orange-700/70">
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

      {/* Zona del monstruo (DROP TARGET) */}
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onClickMonstruo}
        className={`relative mx-auto mt-4 flex h-64 cursor-pointer flex-col items-center justify-center rounded-3xl transition-all ${
          zonaActiva || botonSeleccionado !== null
            ? "scale-[1.02] bg-orange-200/40 ring-4 ring-orange-400/50"
            : "bg-orange-100/30"
        }`}
      >
        {/* Burbuja de diálogo */}
        <div className="mb-2 rounded-2xl border-2 border-orange-400 bg-white px-4 py-1.5 text-sm font-bold text-orange-700 shadow-sm">
          {fraseMonstruo}
        </div>

        {/* Monstruo (recurso gráfico claymorphic) */}
        <div
          className={`relative transition-transform ${
            monstruoAnim === "comiendo"
              ? "animate-[eat_0.6s_ease]"
              : monstruoAnim === "sacudiendo"
              ? "animate-[shake_0.5s_ease]"
              : ""
          }`}
          style={{ filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.2))" }}
        >
          <img
            src="/game-assets/monstruo_hambriento.png"
            alt="Monstruo morado hambriento con la boca abierta"
            className="h-44 w-44 select-none object-contain mix-blend-multiply sm:h-48 sm:w-48"
            draggable={false}
          />
          {/* Dona de recompensa que salta al comer correctamente */}
          {monstruoAnim === "comiendo" && (
            <img
              src="/game-assets/dona_chispas.png"
              alt="Dona de recompensa"
              className="pointer-events-none absolute -right-4 -top-2 h-14 w-14 animate-[eat_0.6s_ease] object-contain mix-blend-multiply"
              draggable={false}
            />
          )}
        </div>

        {/* Indicador de selección */}
        {botonSeleccionado !== null && (
          <div className="absolute bottom-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white animate-pulse">
            Toca al monstruo para alimentarlo
          </div>
        )}
      </div>

      {/* Pregunta */}
      <div className="mx-4 my-4 rounded-2xl bg-white/80 py-4 text-center shadow-sm">
        <p className="font-display text-4xl font-bold text-gray-800">
          {pregunta.texto}
        </p>
      </div>

      {/* Galletas de respuesta (DRAG SOURCE) */}
      <div className="flex justify-center gap-4 px-4 pb-4">
        {pregunta.opciones.map((op, i) => (
          <button
            key={`${ronda}-${i}`}
            draggable
            onDragStart={(e) => onDragStart(e, op)}
            onDragEnd={onDragEnd}
            onClick={() => onClickBoton(op)}
            className={`group relative flex h-28 w-28 select-none items-center justify-center rounded-full transition-all hover:scale-105 hover:-rotate-3 active:scale-95 ${
              botonSeleccionado === op ? "scale-105 ring-4 ring-amber-400" : ""
            }`}
            style={{
              boxShadow:
                "0 6px 0 rgba(180,83,9,0.35), 0 10px 18px rgba(0,0,0,0.18)",
            }}
            aria-label={`Galleta con el número ${op}. Arrastra al monstruo.`}
          >
            <img
              src="/game-assets/galleta_chispas.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full rounded-full object-cover mix-blend-multiply"
              draggable={false}
            />
            <span className="relative z-10 font-display text-3xl font-black text-amber-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              {op}
            </span>
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

      {/* Animaciones CSS locales */}
      <style jsx>{`
        @keyframes eat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(0.9); }
          75% { transform: scale(1.15); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-15px) rotate(-5deg); }
          40% { transform: translateX(15px) rotate(5deg); }
          60% { transform: translateX(-10px) rotate(-3deg); }
          80% { transform: translateX(10px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
