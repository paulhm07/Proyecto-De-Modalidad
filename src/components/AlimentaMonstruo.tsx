"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Cookie, MousePointerClick } from "lucide-react";
import {
  GameShell,
  GameHUD,
  GameIntro,
  GameOverlay,
  useGameAudio,
  FloatingScore,
  type FloatingScoreItem,
  ParticleBurst,
  type BurstConfig,
  nextScoreId,
} from "@/components/game";

/* ============================================================
   Alimenta al Monstruo — Minijuego AAA de matemáticas
   ------------------------------------------------------------
   Mecánica:
   1. Se muestra una multiplicación o división (ej: 24 ÷ 3 = ?)
   2. El monstruo está arriba con la boca abierta (zona DROP)
   3. Tres botones-galleta están abajo (DRAG SOURCE)
   4. El niño arrastra la respuesta correcta al monstruo
      (en móvil: toca el botón y luego toca el monstruo)
   5. Acierto → monstruo mastica + puntos + auto-avance
   6. Fallo → monstruo se sacude + vibra + pierde 1 vida
   7. 10 rondas, 3 vidas, combo, timer 15s
   ============================================================ */

type Estado = "intro" | "jugando" | "acertando" | "fallando" | "completado" | "derrota";

interface Pregunta {
  texto: string;
  respuesta: number;
  opciones: number[];
}

const TOTAL_RONDAS = 10;
const TIMER_MS = 15000;

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

  const opciones = new Set<number>([respuesta]);
  while (opciones.size < 3) {
    const offset = Math.floor(Math.random() * 7) - 3;
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
  const sfx = useGameAudio();
  const [estado, setEstado] = useState<Estado>("intro");
  const [ronda, setRonda] = useState(1);
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [racha, setRacha] = useState(0);
  const [rachaMaxima, setRachaMaxima] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [pregunta, setPregunta] = useState<Pregunta>(() => generarPregunta());
  const [fraseMonstruo, setFraseMonstruo] = useState(
    fraseAleatoria(FRASES.hambre)
  );
  const [feedback, setFeedback] = useState<{ msg: string; tipo: "ok" | "err" } | null>(null);
  const [botonSeleccionado, setBotonSeleccionado] = useState<number | null>(null);
  const [monstruoAnim, setMonstruoAnim] = useState<"idle" | "comiendo" | "sacudiendo">("idle");
  const [zonaActiva, setZonaActiva] = useState(false);
  const [timerMs, setTimerMs] = useState(TIMER_MS);
  const [muted, setMuted] = useState(false);
  const [floats, setFloats] = useState<FloatingScoreItem[]>([]);
  const [bursts, setBursts] = useState<(BurstConfig & { id: number })[]>([]);
  const burstIdRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sincroniza mute con el audio engine
  useEffect(() => {
    sfx.setMuted(muted);
  }, [muted, sfx]);

  // Timer countdown
  useEffect(() => {
    if (estado !== "jugando") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimerMs((t) => {
        if (t <= 100) {
          // Tiempo agotado
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleTimeout();
          return TIMER_MS;
        }
        if (t <= 2100 && t > 2000) sfx.tick();
        if (t <= 1100 && t > 1000) sfx.tick();
        return t - 100;
      });
    }, 100);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [estado, ronda]);

  const handleTimeout = useCallback(() => {
    if (estado !== "jugando") return;
    setEstado("fallando");
    const nuevasVidas = vidas - 1;
    setVidas(nuevasVidas);
    setRacha(0);
    setFeedback({ msg: "⏰ ¡Se acabó el tiempo! Intenta de nuevo 😖", tipo: "err" });
    setFraseMonstruo(fraseAleatoria(FRASES.no_le_gusta));
    setMonstruoAnim("sacudiendo");
    sfx.error();
    sfx.vibrate([60, 40, 60]);

    setTimeout(() => {
      setMonstruoAnim("idle");
      if (nuevasVidas <= 0) {
        setEstado("derrota");
        sfx.victory();
      } else {
        setFeedback(null);
        setEstado("jugando");
        setTimerMs(TIMER_MS);
      }
    }, 900);
  }, [estado, vidas, sfx]);

  const lanzarFloat = useCallback(
    (text: string, color: string, icon?: string, x = 50, y = 30) => {
      const id = nextScoreId();
      setFloats((f) => [...f, { id, x, y, text, color, icon }]);
      setTimeout(() => setFloats((f) => f.filter((it) => it.id !== id)), 950);
    },
    []
  );

  const lanzarBurst = useCallback(
    (x: number, y: number, count = 16, colors?: string[], power = 1.3) => {
      const id = ++burstIdRef.current;
      setBursts((b) => [...b, { id, x, y, count, colors, power }]);
      setTimeout(() => setBursts((b) => b.filter((it) => it.id !== id)), 950);
    },
    []
  );

  const siguienteRonda = useCallback(() => {
    if (ronda + 1 > TOTAL_RONDAS) {
      setEstado("completado");
      sfx.victory();
      return;
    }
    setRonda((r) => r + 1);
    setPregunta(generarPregunta());
    setFeedback(null);
    setBotonSeleccionado(null);
    setFraseMonstruo(fraseAleatoria(FRASES.hambre));
    setTimerMs(TIMER_MS);
    setEstado("jugando");
  }, [ronda, sfx]);

  const validar = useCallback(
    (valor: number) => {
      if (estado !== "jugando") return;
      setBotonSeleccionado(null);

      if (valor === pregunta.respuesta) {
        // ACIERTO
        setEstado("acertando");
        const nuevaRacha = racha + 1;
        const bonus = nuevaRacha >= 3 ? 30 : 10;
        setRacha(nuevaRacha);
        setRachaMaxima((m) => Math.max(m, nuevaRacha));
        setAciertos((a) => a + 1);
        setPuntos((p) => p + bonus);
        setFeedback({
          msg: `¡Correcto! +${bonus} puntos 😋`,
          tipo: "ok",
        });
        setFraseMonstruo(fraseAleatoria(FRASES.comiendo));
        setMonstruoAnim("comiendo");
        sfx.success();
        sfx.vibrate(30);
        lanzarFloat(`+${bonus}`, "#fbbf24", "⭐", 50, 25);
        lanzarBurst(
          typeof window !== "undefined" ? window.innerWidth / 2 : 400,
          200,
          18,
          ["#fbbf24", "#fb923c", "#ef4444", "#22d3ee"],
          1.4
        );
        if (nuevaRacha >= 3) {
          setTimeout(() => {
            sfx.combo(nuevaRacha);
            lanzarFloat(`¡Combo x${nuevaRacha}!`, "#fb923c", "🔥", 50, 40);
          }, 350);
        }

        setTimeout(() => {
          setMonstruoAnim("idle");
          siguienteRonda();
        }, 1200);
      } else {
        // FALLO
        setEstado("fallando");
        const nuevasVidas = vidas - 1;
        setVidas(nuevasVidas);
        setRacha(0);
        setFeedback({ msg: "¡Ups! Esa no era. Intenta de nuevo 😖", tipo: "err" });
        setFraseMonstruo(fraseAleatoria(FRASES.no_le_gusta));
        setMonstruoAnim("sacudiendo");
        sfx.error();
        sfx.vibrate([200, 100, 200, 100, 200]);

        setTimeout(() => {
          setMonstruoAnim("idle");
          if (nuevasVidas <= 0) {
            setEstado("derrota");
          } else {
            setFeedback(null);
            setEstado("jugando");
            setTimerMs(TIMER_MS);
          }
        }, 900);
      }
    },
    [estado, pregunta, vidas, racha, sfx, siguienteRonda, lanzarFloat, lanzarBurst]
  );

  const reiniciar = useCallback(() => {
    setEstado("jugando");
    setRonda(1);
    setPuntos(0);
    setVidas(3);
    setRacha(0);
    setRachaMaxima(0);
    setAciertos(0);
    setPregunta(generarPregunta());
    setFeedback(null);
    setBotonSeleccionado(null);
    setFraseMonstruo(fraseAleatoria(FRASES.hambre));
    setTimerMs(TIMER_MS);
  }, []);

  const empezar = useCallback(() => {
    sfx.click();
    reiniciar();
  }, [sfx, reiniciar]);

  // ===== Drag and Drop handlers =====
  const onDragStart = (e: React.DragEvent, valor: number) => {
    e.dataTransfer.setData("text/plain", String(valor));
    setZonaActiva(true);
    sfx.click();
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

  const onClickBoton = (valor: number) => {
    if (estado !== "jugando") return;
    setBotonSeleccionado(valor);
    setFraseMonstruo(fraseAleatoria(FRASES.recibiendo));
    sfx.click();
  };

  const onClickMonstruo = () => {
    if (botonSeleccionado !== null && estado === "jugando") {
      validar(botonSeleccionado);
    }
  };

  // ===== Pantalla Intro =====
  if (estado === "intro") {
    return (
      <GameShell theme="fun" onSalir={undefined}>
        <GameIntro
          icono={<Cookie size={80} className="text-amber-400" fill="currentColor" />}
          titulo="Alimenta al Monstruo"
          subtitulo="Dale de comer la galleta con la respuesta correcta"
          descripcion="El monstruo está hambriento y solo quiere la galleta con la respuesta correcta. ¡Rápido, antes de que se acabe el tiempo!"
          pasos={[
            "Mirá la operación matemática del cartel",
            "Elegí la galleta con la respuesta correcta",
            "Arrastrala (o toca y luego al monstruo)",
            "¡No le des galletas equivocadas!",
          ]}
          temaColor="#fbbf24"
          onJugar={empezar}
        />
      </GameShell>
    );
  }

  // ===== Pantalla Completado / Derrota =====
  if (estado === "completado" || estado === "derrota") {
    return (
      <GameShell theme="fun" onSalir={undefined}>
        <GameOverlay
          tipo={estado === "completado" ? "victoria" : "derrota"}
          titulo={estado === "completado" ? "¡Genial!" : "¡Te quedaste sin vidas!"}
          subtitulo={
            estado === "completado"
              ? "El monstruo quedó satisfecho 🎉"
              : "El monstruo sigue con hambre... ¡Inténtalo de nuevo!"
          }
          stats={{
            puntos,
            rachaMaxima,
            aciertos,
            total: TOTAL_RONDAS,
          }}
          temaColor="#fbbf24"
          onReiniciar={reiniciar}
          onSalir={() => {
            sfx.click();
            /* delegar al wrapper */
            const btn = document.querySelector(
              'button[aria-label="Salir del minijuego y volver al inicio"]'
            ) as HTMLButtonElement | null;
            btn?.click();
          }}
        />
      </GameShell>
    );
  }

  // ===== Pantalla de Juego =====
  return (
    <GameShell theme="fun" onSalir={undefined}>
      <GameHUD
        theme="fun"
        nivel={ronda}
        totalNiveles={TOTAL_RONDAS}
        puntos={puntos}
        vidas={vidas}
        vidasMaximas={3}
        racha={racha}
        timerMs={timerMs}
        timerTotalMs={TIMER_MS}
        icono={<Cookie size={18} />}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        onSalir={() => {
          const btn = document.querySelector(
            'button[aria-label="Salir del minijuego y volver al inicio"]'
          ) as HTMLButtonElement | null;
          btn?.click();
        }}
      />

      <div className="relative mx-auto max-w-3xl px-3 py-4 sm:px-6">
        {/* Zona del monstruo (DROP TARGET) */}
        <div
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={onClickMonstruo}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClickMonstruo();
            }
          }}
          aria-label="Monstruo hambriento. Arrastra aquí la galleta correcta."
          className={`relative mx-auto flex h-60 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 transition-all duration-300 sm:h-72 ${
            zonaActiva || botonSeleccionado !== null
              ? "scale-[1.02] border-amber-400/70 bg-amber-500/15 shadow-[0_0_40px_rgba(251,191,36,0.4)]"
              : "border-white/10 bg-white/[0.04]"
          }`}
        >
          {/* Bocadillo de diálogo */}
          <div
            className="mb-2 rounded-2xl border-2 px-4 py-1.5 text-sm font-bold backdrop-blur-md sm:text-base"
            style={{
              borderColor: "rgba(251,191,36,0.5)",
              background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,113,133,0.1))",
              color: "#fde68a",
              boxShadow: "0 0 18px rgba(251,191,36,0.3)",
            }}
          >
            {fraseMonstruo}
          </div>

          {/* Monstruo */}
          <div
            className={`relative transition-transform ${
              monstruoAnim === "comiendo"
                ? "animate-[monster-eat_0.6s_ease]"
                : monstruoAnim === "sacudiendo"
                ? "animate-[monster-shake_0.5s_ease]"
                : "animate-[monster-idle_3s_ease-in-out_infinite]"
            }`}
            style={{ filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.4))" }}
          >
            {/* Halo de luz detrás del monstruo */}
            <div
              className="absolute inset-0 -z-10 rounded-full blur-2xl"
              style={{
                background:
                  monstruoAnim === "comiendo"
                    ? "radial-gradient(circle, rgba(251,191,36,0.5), transparent 70%)"
                    : monstruoAnim === "sacudiendo"
                    ? "radial-gradient(circle, rgba(239,68,68,0.4), transparent 70%)"
                    : "radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%)",
              }}
            />
            <img
              src="/game-assets/monstruo_hambriento.png"
              alt="Monstruo morado hambriento con la boca abierta"
              className="h-40 w-40 select-none object-contain sm:h-52 sm:w-52"
              draggable={false}
            />
            {/* Dona de recompensa */}
            {monstruoAnim === "comiendo" && (
              <img
                src="/game-assets/dona_chispas.png"
                alt="Dona de recompensa"
                className="pointer-events-none absolute -right-2 -top-2 h-14 w-14 animate-[monster-eat_0.6s_ease] object-contain sm:h-16 sm:w-16"
                draggable={false}
              />
            )}
          </div>

          {/* Indicador de selección */}
          {botonSeleccionado !== null && (
            <div className="absolute bottom-3 flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg animate-pulse">
              <MousePointerClick size={12} />
              Toca al monstruo para alimentarlo
            </div>
          )}
        </div>

        {/* Cartel LED con la operación matemática */}
        <div className="mx-auto mt-5 max-w-md">
          <div
            className="relative overflow-hidden rounded-2xl border-2 px-6 py-5 text-center"
            style={{
              borderColor: "rgba(251,191,36,0.5)",
              background:
                "linear-gradient(180deg, rgba(20,12,5,0.95) 0%, rgba(40,25,8,0.95) 100%)",
              boxShadow:
                "0 0 30px rgba(251,191,36,0.35), inset 0 2px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Scanlines LED */}
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(251,191,36,0.3) 2px, rgba(251,191,36,0.3) 3px)",
              }}
            />
            <p
              className="relative font-display text-4xl font-black sm:text-5xl"
              style={{
                color: "#fde047",
                textShadow:
                  "0 0 12px rgba(251,191,36,0.8), 0 0 24px rgba(251,191,36,0.5), 0 2px 0 rgba(0,0,0,0.6)",
              }}
            >
              {pregunta.texto}
            </p>
          </div>
        </div>

        {/* Galletas de respuesta (DRAG SOURCE) */}
        <div className="mt-5 flex justify-center gap-4 px-4 pb-6 sm:gap-6">
          {pregunta.opciones.map((op, i) => (
            <button
              key={`${ronda}-${i}`}
              draggable
              onDragStart={(e) => onDragStart(e, op)}
              onDragEnd={onDragEnd}
              onClick={() => onClickBoton(op)}
              className={`group relative flex h-24 w-24 select-none items-center justify-center rounded-full transition-all hover:scale-110 hover:-rotate-3 active:scale-95 sm:h-28 sm:w-28 ${
                botonSeleccionado === op
                  ? "scale-110 ring-4 ring-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.6)]"
                  : ""
              }`}
              style={{
                boxShadow:
                  "0 8px 0 rgba(120,53,15,0.6), 0 14px 24px rgba(0,0,0,0.4), inset 0 3px 0 rgba(255,255,255,0.3)",
              }}
              aria-label={`Galleta con el número ${op}. Arrastra al monstruo.`}
            >
              {/* Glow halo */}
              <div
                className="absolute inset-0 -z-10 rounded-full blur-md transition-opacity group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle, rgba(251,191,36,0.4), transparent 70%)",
                  opacity: botonSeleccionado === op ? 1 : 0.5,
                }}
              />
              <img
                src="/game-assets/galleta_chispas.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full rounded-full object-cover"
                draggable={false}
              />
              {/* Brillo glossy superior */}
              <div
                className="pointer-events-none absolute left-2 right-2 top-2 h-1/3 rounded-full opacity-60"
                style={{
                  background:
                    "radial-gradient(ellipse at center top, rgba(255,255,255,0.7), transparent 70%)",
                }}
              />
              <span
                className="relative z-10 font-display text-3xl font-black sm:text-4xl"
                style={{
                  color: "#78350f",
                  textShadow:
                    "0 1px 2px rgba(255,255,255,0.9), 0 -1px 0 rgba(0,0,0,0.2)",
                }}
              >
                {op}
              </span>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mx-auto mb-4 max-w-md rounded-xl border-2 px-4 py-2.5 text-center font-bold backdrop-blur-md ${
              feedback.tipo === "ok"
                ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-200"
                : "border-red-400/50 bg-red-500/15 text-red-200"
            }`}
          >
            {feedback.msg}
          </div>
        )}
      </div>

      {/* FloatingScores */}
      {floats.map((f) => (
        <FloatingScore key={f.id} item={f} />
      ))}

      {/* ParticleBursts */}
      {bursts.map((b) => (
        <ParticleBurst key={b.id} burst={b} />
      ))}

      {/* Animaciones CSS locales */}
      <style jsx>{`
        @keyframes monster-eat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.25); }
          50% { transform: scale(0.9); }
          75% { transform: scale(1.15); }
        }
        @keyframes monster-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-12px) rotate(-4deg); }
          40% { transform: translateX(12px) rotate(4deg); }
          60% { transform: translateX(-8px) rotate(-2deg); }
          80% { transform: translateX(8px) rotate(2deg); }
        }
        @keyframes monster-idle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.02); }
        }
      `}</style>
    </GameShell>
  );
}
