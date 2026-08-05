"use client";

/**
 * GameHUD — Barra superior AAA unificada para todos los mini-juegos.
 * --------------------------------------------------------------
 * Muestra: nivel actual / total, puntos, vidas (corazones), racha
 * (combo con flame), timer opcional con countdown, y barra de progreso.
 * Diseño glassmorphism con acentos neon según el tema del juego.
 */

import { Clock, Flame, Heart, Star, Trophy, Volume2, VolumeX } from "lucide-react";

export type HudTheme = "math" | "language" | "fun";

const THEME_STYLES: Record<
  HudTheme,
  {
    grad: string;
    glow: string;
    bar: string;
    ring: string;
    text: string;
  }
> = {
  math: {
    grad: "from-cyan-500/20 via-sky-500/15 to-blue-500/20",
    glow: "shadow-[0_0_22px_rgba(34,211,238,0.35)]",
    bar: "from-cyan-400 via-sky-400 to-blue-500",
    ring: "border-cyan-400/50",
    text: "text-cyan-100",
  },
  language: {
    grad: "from-fuchsia-500/20 via-rose-500/15 to-amber-500/20",
    glow: "shadow-[0_0_22px_rgba(251,113,133,0.35)]",
    bar: "from-fuchsia-400 via-rose-400 to-amber-400",
    ring: "border-fuchsia-400/50",
    text: "text-fuchsia-100",
  },
  fun: {
    grad: "from-amber-500/20 via-orange-500/15 to-rose-500/20",
    glow: "shadow-[0_0_22px_rgba(251,191,36,0.35)]",
    bar: "from-amber-400 via-orange-400 to-rose-400",
    ring: "border-amber-400/50",
    text: "text-amber-100",
  },
};

export interface GameHUDProps {
  theme?: HudTheme;
  nivel: number;
  totalNiveles: number;
  puntos?: number;
  vidas?: number;
  vidasMaximas?: number;
  racha?: number;
  timerMs?: number; // si > 0, muestra countdown
  timerTotalMs?: number;
  titulo?: string;
  icono?: React.ReactNode;
  muted?: boolean;
  onToggleMute?: () => void;
  onSalir?: () => void;
}

export function GameHUD({
  theme = "fun",
  nivel,
  totalNiveles,
  puntos,
  vidas,
  vidasMaximas = 3,
  racha,
  timerMs,
  timerTotalMs,
  icono,
  muted,
  onToggleMute,
  onSalir,
}: GameHUDProps) {
  const s = THEME_STYLES[theme];
  const progreso = Math.min(100, (nivel / totalNiveles) * 100);
  const timerPct =
    timerMs !== undefined && timerTotalMs && timerTotalMs > 0
      ? Math.max(0, Math.min(100, (timerMs / timerTotalMs) * 100))
      : null;
  const timerLow = timerPct !== null && timerPct < 30;

  return (
    <div
      className={`sticky top-0 z-40 w-full border-b ${s.ring} bg-gradient-to-r ${s.grad} ${s.glow} backdrop-blur-xl`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-5 sm:py-3">
        {/* Izquierda: nivel + titulo */}
        <div className="flex min-w-0 items-center gap-2.5">
          {onSalir && (
            <button
              onClick={onSalir}
              className="shrink-0 rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 text-xs font-bold text-white/90 transition hover:scale-105 hover:bg-white/20 active:scale-95"
              aria-label="Salir del juego"
            >
              ✕
            </button>
          )}
          {icono && (
            <div
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${s.ring} bg-white/10 ${s.text}`}
            >
              {icono}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-base font-black ${s.text} sm:text-lg`}>
                Nivel {nivel}
              </span>
              <span className="text-xs font-bold text-white/60">
                / {totalNiveles}
              </span>
            </div>
            {timerPct !== null && (
              <div className="mt-1 flex items-center gap-1">
                <Clock
                  size={11}
                  className={timerLow ? "text-red-400" : "text-white/60"}
                />
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/15 sm:w-24">
                  <div
                    className={`h-full rounded-full transition-[width] duration-200 linear ${
                      timerLow
                        ? "bg-red-500 animate-pulse"
                        : "bg-gradient-to-r from-emerald-400 to-cyan-400"
                    }`}
                    style={{ width: `${timerPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Centro: barra de progreso del nivel (desktop) */}
        <div className="hidden flex-1 items-center gap-2 px-3 md:flex">
          <div className="h-2 flex-1 overflow-hidden rounded-full border border-white/15 bg-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${s.bar} transition-[width] duration-500 ease-out`}
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>

        {/* Derecha: stats */}
        <div className="flex items-center gap-2 sm:gap-3">
          {puntos !== undefined && (
            <div className="flex items-center gap-1 rounded-lg border border-amber-300/40 bg-amber-500/15 px-2 py-1">
              <Star size={14} className="text-amber-300" fill="currentColor" />
              <span className="text-sm font-black text-amber-100">
                {puntos}
              </span>
            </div>
          )}
          {racha !== undefined && racha > 0 && (
            <div
              className={`flex items-center gap-1 rounded-lg border px-2 py-1 ${
                racha >= 3
                  ? "border-orange-300/60 bg-orange-500/25 animate-pulse"
                  : "border-orange-300/30 bg-orange-500/10"
              }`}
            >
              <Flame size={14} className="text-orange-300" fill="currentColor" />
              <span className="text-sm font-black text-orange-100">
                x{racha}
              </span>
            </div>
          )}
          {vidas !== undefined && (
            <div className="flex items-center gap-0.5">
              {Array.from({ length: vidasMaximas }).map((_, i) => (
                <Heart
                  key={i}
                  size={16}
                  className={
                    i < vidas
                      ? "text-rose-400 drop-shadow-[0_0_4px_rgba(244,63,94,0.6)]"
                      : "text-white/15"
                  }
                  fill={i < vidas ? "currentColor" : "none"}
                />
              ))}
            </div>
          )}
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              className="grid h-8 w-8 place-items-center rounded-lg border border-white/20 bg-white/10 text-white/80 transition hover:scale-105 hover:bg-white/20 active:scale-95"
              aria-label={muted ? "Activar sonido" : "Silenciar"}
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          )}
        </div>
      </div>
      {/* Barra de progreso móvil */}
      <div className="h-1 w-full bg-white/10 md:hidden">
        <div
          className={`h-full bg-gradient-to-r ${s.bar} transition-[width] duration-500`}
          style={{ width: `${progreso}%` }}
        />
      </div>
    </div>
  );
}

export { THEME_STYLES as HUD_THEME_STYLES };
export { Trophy };
