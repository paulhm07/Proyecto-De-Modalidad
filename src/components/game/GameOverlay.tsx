"use client";

/**
 * GameOverlay — Pantalla final AAA (victoria o fin de juego).
 * ------------------------------------------------------------
 * Muestra: ícono grande, mensaje, stats (puntos, racha máxima,
 * precisión), y botones "Jugar de nuevo" / "Volver al inicio".
 * Animación de entrada escalonada + confetti opcional.
 */

import { useEffect, useState } from "react";
import { Home, RefreshCw, Trophy, Star, Target, Flame } from "lucide-react";
import { Confetti } from "@/components/Toasts";

export interface EndStats {
  puntos?: number;
  rachaMaxima?: number;
  aciertos?: number;
  total?: number;
}

export interface GameOverlayProps {
  tipo: "victoria" | "completado" | "derrota";
  titulo: string;
  subtitulo?: string;
  stats?: EndStats;
  onReiniciar: () => void;
  onSalir: () => void;
  temaColor?: string;
}

export function GameOverlay({
  tipo,
  titulo,
  subtitulo,
  stats,
  onReiniciar,
  onSalir,
  temaColor = "#fbbf24",
}: GameOverlayProps) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 100),
      setTimeout(() => setStep(2), 350),
      setTimeout(() => setStep(3), 600),
      setTimeout(() => setStep(4), 850),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const isWin = tipo === "victoria" || tipo === "completado";
  const iconColor = isWin ? temaColor : "#f43f5e";
  const Icon = isWin ? Trophy : Target;

  const precision =
    stats?.aciertos !== undefined && stats?.total
      ? Math.round((stats.aciertos / stats.total) * 100)
      : null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-md">
      {isWin && <Confetti duracionMs={5000} cantidad={60} />}
      <div
        className="relative mx-4 w-full max-w-md rounded-3xl border-2 p-6 text-center shadow-2xl sm:p-8"
        style={{
          borderColor: `${iconColor}55`,
          background: `linear-gradient(160deg, rgba(20,15,40,0.95) 0%, rgba(10,8,25,0.95) 100%)`,
          boxShadow: `0 0 60px ${iconColor}44, inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        {/* Ícono */}
        <div
          className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-full border-2 transition-all duration-500"
          style={{
            borderColor: `${iconColor}66`,
            background: `radial-gradient(circle, ${iconColor}33, transparent 70%)`,
            boxShadow: `0 0 40px ${iconColor}77`,
            transform: step >= 1 ? "scale(1)" : "scale(0)",
            opacity: step >= 1 ? 1 : 0,
          }}
        >
          <div className="animate-float">
            <Icon
              size={52}
              style={{ color: iconColor, filter: `drop-shadow(0 4px 8px ${iconColor}88)` }}
              fill="currentColor"
            />
          </div>
        </div>

        {/* Título */}
        <h2
          className="text-3xl font-black transition-all duration-500 sm:text-4xl"
          style={{
            color: iconColor,
            textShadow: `0 0 20px ${iconColor}66`,
            transform: step >= 2 ? "translateY(0)" : "translateY(15px)",
            opacity: step >= 2 ? 1 : 0,
          }}
        >
          {titulo}
        </h2>
        {subtitulo && (
          <p
            className="mt-2 text-sm font-semibold text-white/70 transition-all duration-500"
            style={{
              transform: step >= 2 ? "translateY(0)" : "translateY(10px)",
              opacity: step >= 2 ? 1 : 0,
            }}
          >
            {subtitulo}
          </p>
        )}

        {/* Stats */}
        {stats && (
          <div
            className="mt-5 grid grid-cols-2 gap-2 transition-all duration-500 sm:grid-cols-4"
            style={{
              transform: step >= 3 ? "translateY(0)" : "translateY(15px)",
              opacity: step >= 3 ? 1 : 0,
            }}
          >
            {stats.puntos !== undefined && (
              <StatChip
                icon={<Star size={14} fill="currentColor" />}
                label="Puntos"
                value={stats.puntos}
                color="#fbbf24"
              />
            )}
            {stats.rachaMaxima !== undefined && stats.rachaMaxima > 0 && (
              <StatChip
                icon={<Flame size={14} fill="currentColor" />}
                label="Racha"
                value={`x${stats.rachaMaxima}`}
                color="#fb923c"
              />
            )}
            {stats.aciertos !== undefined && (
              <StatChip
                icon={<Target size={14} />}
                label="Aciertos"
                value={`${stats.aciertos}/${stats.total ?? "?"}`}
                color="#22d3ee"
              />
            )}
            {precision !== null && (
              <StatChip
                icon={<Trophy size={14} />}
                label="Precisión"
                value={`${precision}%`}
                color="#a78bfa"
              />
            )}
          </div>
        )}

        {/* Botones */}
        <div
          className="mt-6 flex flex-col gap-2 transition-all duration-500 sm:flex-row"
          style={{
            transform: step >= 4 ? "translateY(0)" : "translateY(15px)",
            opacity: step >= 4 ? 1 : 0,
          }}
        >
          <button
            onClick={onReiniciar}
            className="group relative flex-1 overflow-hidden rounded-xl px-4 py-3 text-base font-black text-white shadow-lg transition active:scale-95"
            style={{
              background: `linear-gradient(180deg, ${temaColor} 0%, ${temaColor}cc 100%)`,
              boxShadow: `0 5px 0 ${temaColor}66, 0 8px 20px ${temaColor}44`,
            }}
          >
            <span className="relative flex items-center justify-center gap-2">
              <RefreshCw size={16} strokeWidth={2.5} />
              Jugar de nuevo
            </span>
          </button>
          <button
            onClick={onSalir}
            className="flex-1 rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-base font-black text-white/80 shadow-lg transition hover:bg-white/10 active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              <Home size={16} strokeWidth={2.5} />
              Inicio
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function StatChip({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="rounded-xl border bg-white/5 px-2 py-2 backdrop-blur-sm"
      style={{ borderColor: `${color}44` }}
    >
      <div
        className="mb-0.5 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide"
        style={{ color }}
      >
        {icon}
        {label}
      </div>
      <div className="text-lg font-black text-white">{value}</div>
    </div>
  );
}
