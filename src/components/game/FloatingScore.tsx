"use client";

/**
 * FloatingScore — Texto flotante "+10" / "¡Combo x3!" que se eleva
 * y se desvanece. Componente único controlado por key para reiniciar animación.
 */

import { useEffect, useState } from "react";

export interface FloatingScoreItem {
  id: number;
  x: number; // % horizontal
  y: number; // % vertical
  text: string;
  color?: string;
  icon?: string;
}

let _idCounter = 0;
export function nextScoreId() {
  _idCounter += 1;
  return _idCounter;
}

export function FloatingScore({ item }: { item: FloatingScoreItem }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setT(1));
    return () => cancelAnimationFrame(raf);
  }, [item.id]);

  const color = item.color ?? "#fbbf24";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-[80] select-none"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        transform: `translate(-50%, ${t ? -60 : 0}px) scale(${t ? 1.1 : 0.6})`,
        opacity: t ? 0 : 1,
        transition:
          "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.9s ease-out",
      }}
    >
      <div
        className="flex items-center gap-1 whitespace-nowrap text-2xl font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-3xl"
        style={{ color, textShadow: `0 0 12px ${color}99` }}
      >
        {item.icon && <span className="text-3xl">{item.icon}</span>}
        <span>{item.text}</span>
      </div>
    </div>
  );
}
