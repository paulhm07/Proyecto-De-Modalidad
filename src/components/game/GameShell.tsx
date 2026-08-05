"use client";

/**
 * GameShell — Contenedor AAA inmersivo para mini-juegos.
 * -------------------------------------------------------
 * Provee:
 *  - Fondo temático (gradiente + siluetas decorativas + partículas ambientales)
 *  - Layout flexible con header sticky
 *  - Capa de partículas ambientales (estrellas/motivos flotantes)
 *  - Botón "Salir" estilizado integrado
 *
 * Uso:
 *   <GameShell theme="math" onSalir={...}>
 *     <GameHUD ... />
 *     <div className="...">contenido del juego</div>
 *   </GameShell>
 */

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

export type ShellTheme = "math" | "language" | "fun" | "kitchen" | "forest" | "sky";

interface ThemeConfig {
  bg: string; // gradient classes
  silhouettes: React.ReactNode;
  particleColor: string;
  particleShape: "circle" | "square" | "star";
  particleCount: number;
}

const SIL = {
  // Patrones decorativos sutiles de fondo
  kitchen: (
    <>
      {/* Olla de cobre difuminada */}
      <div className="absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-gradient-to-br from-orange-700/20 to-amber-900/10 blur-3xl" />
      {/* Pan difuminado */}
      <div className="absolute right-10 top-10 h-32 w-48 rounded-full bg-gradient-to-br from-amber-600/15 to-yellow-800/5 blur-2xl" />
      {/* Vegetales */}
      <div className="absolute bottom-10 right-1/4 h-24 w-24 rounded-full bg-gradient-to-br from-red-700/15 to-green-900/10 blur-2xl" />
    </>
  ),
  math: (
    <>
      <div className="absolute right-10 top-1/4 text-9xl font-black text-white/[0.04] select-none">×</div>
      <div className="absolute left-10 bottom-1/4 text-9xl font-black text-white/[0.04] select-none">÷</div>
      <div className="absolute right-1/4 bottom-10 text-8xl font-black text-white/[0.03] select-none">+</div>
      <div className="absolute left-1/3 top-10 text-7xl font-black text-white/[0.03] select-none">=</div>
    </>
  ),
  language: (
    <>
      <div className="absolute left-10 top-1/4 text-9xl font-black text-white/[0.04] select-none">á</div>
      <div className="absolute right-10 bottom-1/4 text-9xl font-black text-white/[0.04] select-none">é</div>
      <div className="absolute right-1/4 top-10 text-7xl font-black text-white/[0.03] select-none">í</div>
      <div className="absolute left-1/3 bottom-10 text-8xl font-black text-white/[0.03] select-none">ó</div>
    </>
  ),
  fun: (
    <>
      <div className="absolute right-1/4 top-10 text-8xl select-none opacity-[0.05]">✦</div>
      <div className="absolute left-10 bottom-1/3 text-7xl select-none opacity-[0.04]">★</div>
      <div className="absolute right-10 top-1/3 text-9xl select-none opacity-[0.04]">✧</div>
      <div className="absolute left-1/4 bottom-10 text-6xl select-none opacity-[0.03]">✦</div>
    </>
  ),
  forest: (
    <>
      <div className="absolute -left-10 bottom-0 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-700/15 to-green-900/5 blur-3xl" />
      <div className="absolute -right-10 top-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-lime-700/10 to-emerald-900/5 blur-3xl" />
    </>
  ),
  sky: (
    <>
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-gradient-to-b from-sky-400/15 to-transparent blur-3xl" />
      <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-gradient-to-b from-cyan-300/10 to-transparent blur-3xl" />
    </>
  ),
};

const THEMES: Record<ShellTheme, ThemeConfig> = {
  math: {
    bg: "bg-[radial-gradient(ellipse_at_top,_#0a1a3a_0%,_#07061f_50%,_#04030f_100%)]",
    silhouettes: SIL.math,
    particleColor: "#22d3ee",
    particleShape: "circle",
    particleCount: 18,
  },
  language: {
    bg: "bg-[radial-gradient(ellipse_at_top,_#2a0a2a_0%,_#1a0720_50%,_#0a040f_100%)]",
    silhouettes: SIL.language,
    particleColor: "#fb7185",
    particleShape: "star",
    particleCount: 18,
  },
  fun: {
    bg: "bg-[radial-gradient(ellipse_at_top,_#3a1a0a_0%,_#1f0a07_50%,_#0f0504_100%)]",
    silhouettes: SIL.fun,
    particleColor: "#fbbf24",
    particleShape: "star",
    particleCount: 20,
  },
  kitchen: {
    bg: "bg-[radial-gradient(ellipse_at_top,_#3a2a1a_0%,_#2a1a10_50%,_#1a0f08_100%)]",
    silhouettes: SIL.kitchen,
    particleColor: "#fbbf24",
    particleShape: "circle",
    particleCount: 14,
  },
  forest: {
    bg: "bg-[radial-gradient(ellipse_at_top,_#0a3a2a_0%,_#072a1a_50%,_#041f0f_100%)]",
    silhouettes: SIL.forest,
    particleColor: "#34d399",
    particleShape: "circle",
    particleCount: 16,
  },
  sky: {
    bg: "bg-[radial-gradient(ellipse_at_top,_#0a2a4a_0%,_#07203a_50%,_#04152a_100%)]",
    silhouettes: SIL.sky,
    particleColor: "#7dd3fc",
    particleShape: "circle",
    particleCount: 20,
  },
};

interface AmbientParticle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

function AmbientParticles({
  count,
  color,
  shape,
}: {
  count: number;
  color: string;
  shape: "circle" | "square" | "star";
}) {
  const particles = useMemo<AmbientParticle[]>(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 5,
      duration: 6 + Math.random() * 8,
      delay: -Math.random() * 10,
      drift: (Math.random() - 0.5) * 40,
    }));
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: color,
              borderRadius: shape === "circle" ? "9999px" : shape === "square" ? "1px" : "0",
              opacity: 0.4,
              boxShadow: `0 0 ${p.size * 2}px ${color}`,
              "--drift": `${p.drift}px`,
              animation: `ambient-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            } as React.CSSProperties
          }
        >
          {shape === "star" && (
            <svg viewBox="0 0 10 10" className="h-full w-full">
              <polygon
                points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5"
                fill={color}
              />
            </svg>
          )}
        </div>
      ))}
      <style jsx>{`
        @keyframes ambient-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(var(--drift), -30px) scale(1.3);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}

export interface GameShellProps {
  theme?: ShellTheme;
  onSalir?: () => void;
  children: React.ReactNode;
  className?: string;
  /** Si true, no renderiza el overlay de partículas ambientales */
  noParticles?: boolean;
}

export function GameShell({
  theme = "fun",
  onSalir,
  children,
  className = "",
  noParticles = false,
}: GameShellProps) {
  const t = THEMES[theme];
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`relative min-h-[calc(100vh-56px)] w-full overflow-hidden ${t.bg} ${className}`}
    >
      {/* Siluetas decorativas de fondo */}
      <div className="pointer-events-none absolute inset-0">{t.silhouettes}</div>
      {/* Partículas ambientales */}
      {mounted && !noParticles && (
        <AmbientParticles
          count={t.particleCount}
          color={t.particleColor}
          shape={t.particleShape}
        />
      )}
      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.5)_100%)]" />
      {/* Botón salir flotante */}
      {onSalir && (
        <button
          onClick={onSalir}
          className="fixed left-3 top-[64px] z-50 flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-3 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white/20 active:scale-95 sm:left-4 sm:top-[72px]"
          aria-label="Salir del minijuego y volver al inicio"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Salir
        </button>
      )}
      {/* Contenido */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export { THEMES as SHELL_THEMES };
