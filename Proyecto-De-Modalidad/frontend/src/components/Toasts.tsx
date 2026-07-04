"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useApp } from "@/context/AppContext";

/* ------------------------------ Toasts UI ------------------------------ */

const TOAST_STYLES = {
  exito: {
    container: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: <CheckCircle2 size={18} className="text-emerald-500" strokeWidth={2.5} />,
  },
  error: {
    container: "border-red-200 bg-red-50 text-red-800",
    icon: <AlertCircle size={18} className="text-red-500" strokeWidth={2.5} />,
  },
  info: {
    container: "border-orange-200 bg-orange-50 text-orange-800",
    icon: <Info size={18} className="text-orange-500" strokeWidth={2.5} />,
  },
} as const;

export function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="pointer-events-none fixed right-3 top-3 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((t) => {
        const s = TOAST_STYLES[t.tipo] ?? TOAST_STYLES.info;
        return (
          <div
            key={t.id}
            className={`animate-bounce-in pointer-events-auto flex items-start gap-2 rounded-2xl border-2 px-3.5 py-2.5 shadow-lg ${s.container}`}
            role="status"
          >
            <span className="mt-0.5 shrink-0">{s.icon}</span>
            <p className="flex-1 text-sm font-bold leading-snug">{t.mensaje}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ Confetti ------------------------------ */

const CONFETTI_COLORS = [
  "#f97316", // orange
  "#f43f5e", // rose
  "#fbbf24", // amber
  "#10b981", // emerald
  "#14b8a6", // teal
  "#d946ef", // fuchsia
  "#ef4444", // red
  "#ffffff",
];

interface ConfettiProps {
  duracionMs?: number;
  cantidad?: number;
}

export function Confetti({ duracionMs = 4000, cantidad = 36 }: ConfettiProps) {
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    setActivo(true);
    const t = setTimeout(() => setActivo(false), duracionMs);
    return () => clearTimeout(t);
  }, [duracionMs]);

  const particulas = useMemo(() => {
    return Array.from({ length: cantidad }).map((_, i) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 0.8;
      const duration = 2.4 + Math.random() * 2.2;
      const size = 6 + Math.random() * 10;
      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      const rounded = Math.random() > 0.5;
      return { id: i, left, delay, duration, size, color, rounded };
    });
  }, [cantidad]);

  if (!activo) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      {particulas.map((p) => (
        <div
          key={p.id}
          className="animate-confetti-fall absolute top-0"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * (p.rounded ? 1 : 1.6)}px`,
            background: p.color,
            borderRadius: p.rounded ? "9999px" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            boxShadow: `0 0 6px ${p.color}66`,
          }}
        />
      ))}
    </div>
  );
}
