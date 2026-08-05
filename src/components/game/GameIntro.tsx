"use client";

/**
 * GameIntro — Pantalla de presentación narrativa AAA reutilizable.
 * --------------------------------------------------------------
 * Muestra: ícono grande animado, título épico del juego, descripción
 * breve de la mecánica, "cómo jugar" en 3 pasos, y botón grande
 * "¡Jugar!" con efecto glossy multi-capa.
 *
 * Animación de entrada escalonada (stagger).
 */

import { useEffect, useState } from "react";
import { Play, Sparkles } from "lucide-react";

export interface GameIntroProps {
  icono: React.ReactNode;
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
  pasos?: string[]; // cómo jugar (3 pasos idealmente)
  temaColor?: string; // hex del color principal
  onJugar: () => void;
}

export function GameIntro({
  icono,
  titulo,
  subtitulo,
  descripcion,
  pasos = [],
  temaColor = "#fbbf24",
  onJugar,
}: GameIntroProps) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 100),
      setTimeout(() => setStep(2), 300),
      setTimeout(() => setStep(3), 500),
      setTimeout(() => setStep(4), 700),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        {/* Ícono grande animado */}
        <div
          className="mx-auto mb-6 grid h-32 w-32 place-items-center rounded-3xl border-2 transition-all duration-700 sm:h-40 sm:w-40"
          style={{
            borderColor: `${temaColor}66`,
            background: `radial-gradient(circle at 30% 30%, ${temaColor}33, transparent 70%)`,
            boxShadow: `0 0 50px ${temaColor}55, inset 0 0 30px ${temaColor}22`,
            transform: step >= 1 ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(-20deg)",
            opacity: step >= 1 ? 1 : 0,
          }}
        >
          <div
            className="animate-float"
            style={{ filter: `drop-shadow(0 8px 16px ${temaColor}88)` }}
          >
            {icono}
          </div>
        </div>

        {/* Título */}
        <h1
          className="text-center text-4xl font-black tracking-tight transition-all duration-700 sm:text-5xl"
          style={{
            color: temaColor,
            textShadow: `0 0 30px ${temaColor}77, 0 4px 0 rgba(0,0,0,0.4)`,
            transform: step >= 2 ? "translateY(0)" : "translateY(20px)",
            opacity: step >= 2 ? 1 : 0,
          }}
        >
          {titulo}
        </h1>

        {subtitulo && (
          <p
            className="mt-2 text-center text-lg font-bold text-white/70 transition-all duration-700 sm:text-xl"
            style={{
              transform: step >= 2 ? "translateY(0)" : "translateY(15px)",
              opacity: step >= 2 ? 1 : 0,
            }}
          >
            {subtitulo}
          </p>
        )}

        {descripcion && (
          <p
            className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-white/60 transition-all duration-700 sm:text-base"
            style={{
              transform: step >= 3 ? "translateY(0)" : "translateY(15px)",
              opacity: step >= 3 ? 1 : 0,
            }}
          >
            {descripcion}
          </p>
        )}

        {/* Cómo jugar */}
        {pasos.length > 0 && (
          <div
            className="mx-auto mt-6 grid max-w-md gap-2 transition-all duration-700"
            style={{
              transform: step >= 3 ? "translateY(0)" : "translateY(15px)",
              opacity: step >= 3 ? 1 : 0,
            }}
          >
            <div className="mb-1 flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-white/40">
              <Sparkles size={13} style={{ color: temaColor }} />
              Cómo jugar
            </div>
            {pasos.map((paso, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm"
              >
                <div
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-black"
                  style={{
                    background: `${temaColor}22`,
                    color: temaColor,
                    border: `1.5px solid ${temaColor}66`,
                  }}
                >
                  {i + 1}
                </div>
                <span className="text-sm font-semibold text-white/85">
                  {paso}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Botón Jugar — glossy multi-capa */}
        <div
          className="mt-8 flex justify-center transition-all duration-700"
          style={{
            transform: step >= 4 ? "scale(1)" : "scale(0.7)",
            opacity: step >= 4 ? 1 : 0,
          }}
        >
          <button
            onClick={onJugar}
            className="group relative overflow-hidden rounded-2xl px-10 py-4 text-lg font-black text-white shadow-2xl transition active:scale-95"
            style={{
              background: `linear-gradient(180deg, ${temaColor} 0%, ${temaColor}cc 50%, ${temaColor}99 100%)`,
              boxShadow: `0 8px 0 ${temaColor}66, 0 12px 30px ${temaColor}55, inset 0 2px 0 rgba(255,255,255,0.4)`,
            }}
          >
            {/* sheen */}
            <span
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)",
                transform: "translateX(-100%)",
                animation: "sheen 2.5s ease-in-out infinite",
              }}
            />
            <span className="relative flex items-center gap-2">
              <Play size={20} fill="currentColor" />
              ¡Jugar!
            </span>
            <style jsx>{`
              @keyframes sheen {
                0%, 100% { transform: translateX(-100%); }
                50% { transform: translateX(100%); }
              }
            `}</style>
          </button>
        </div>
      </div>
    </div>
  );
}
