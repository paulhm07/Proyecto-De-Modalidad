"use client";

/**
 * ParticleBurst — Explosión de partículas reutilizable.
 * Se renderiza en posición fija (x,y) y se desvanece.
 * Usa el mismo sistema de colores que Confetti.
 */

import { useEffect, useMemo, useState } from "react";

const COLORS = [
  "#f97316", "#f43f5e", "#fbbf24", "#10b981", "#14b8a6",
  "#d946ef", "#ef4444", "#ffffff", "#22d3ee", "#8b5cf6",
];

export interface BurstConfig {
  x: number; // px
  y: number; // px
  count?: number;
  colors?: string[];
  power?: number; // 1 = normal, 1.5 = fuerte
}

export function ParticleBurst({
  burst,
}: {
  burst: BurstConfig & { id: number };
}) {
  const [alive, setAlive] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setAlive(false), 900);
    return () => clearTimeout(t);
  }, [burst.id]);

  const particles = useMemo(() => {
    const n = burst.count ?? 14;
    const power = burst.power ?? 1;
    const cols = burst.colors ?? COLORS;
    return Array.from({ length: n }).map((_, i) => {
      const angle = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      const dist = (40 + Math.random() * 80) * power;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const size = 5 + Math.random() * 8;
      const color = cols[i % cols.length];
      const rot = Math.random() * 360;
      const round = Math.random() > 0.5;
      return { i, dx, dy, size, color, rot, round };
    });
  }, [burst.id, burst.count, burst.colors, burst.power]);

  if (!alive) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[95]"
      style={{ left: burst.x, top: burst.y }}
    >
      {particles.map((p) => (
        <div
          key={p.i}
          className="absolute"
          style={
            {
              width: `${p.size}px`,
              height: `${p.size * (p.round ? 1 : 1.5)}px`,
              background: p.color,
              borderRadius: p.round ? "9999px" : "2px",
              boxShadow: `0 0 6px ${p.color}aa`,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--rot": `${p.rot}deg`,
              animation: "burst-fly 0.9s cubic-bezier(0.22,1,0.36,1) forwards",
            } as React.CSSProperties
          }
        />
      ))}
      <style jsx>{`
        @keyframes burst-fly {
          0% {
            transform: translate(-50%, -50%) scale(0.4) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(
                calc(-50% + var(--dx)),
                calc(-50% + var(--dy))
              )
              scale(0.2) rotate(var(--rot));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
