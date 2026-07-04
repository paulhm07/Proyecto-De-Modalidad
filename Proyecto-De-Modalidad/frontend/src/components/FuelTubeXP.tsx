"use client";

interface FuelTubeXPProps {
  /** Current XP within the level (0-100) */
  value: number;
  /** Max value (default 100) */
  max?: number;
  /** Optional label shown to the left */
  label?: string;
  /** Optional level target shown to the right */
  targetLabel?: string;
}

/**
 * "Tubo de combustible de energía" — a glass fuel-tube that fills with
 * incandescent cyan liquid, a wavy meniscus, rising bubbles, and a top
 * gloss reflection on the casing.
 */
export function FuelTubeXP({
  value,
  max = 100,
  label,
  targetLabel,
}: FuelTubeXPProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div>
      {(label || targetLabel) && (
        <div className="mb-2 flex items-center justify-between text-xs font-bold">
          {label && (
            <span className="flex items-center gap-1.5 text-cyan-200">
              <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-glow" />
              {label}
            </span>
          )}
          {targetLabel && (
            <span className="text-cyan-100/70">
              {value}/{max} <span className="text-amber-300/80">⚡</span>
            </span>
          )}
        </div>
      )}

      <div className="fuel-tube" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div className="fuel-tube-track">
          <div className="fuel-liquid" style={{ width: `${pct}%` }}>
            {/* Rising bubbles (positioned within the liquid) */}
            <span className="fuel-bubble" style={{ left: "18%", animationDelay: "0s" }} />
            <span className="fuel-bubble" style={{ left: "42%", animationDelay: "0.9s" }} />
            <span className="fuel-bubble" style={{ left: "66%", animationDelay: "1.6s" }} />
            <span className="fuel-bubble" style={{ left: "84%", animationDelay: "0.4s" }} />
          </div>
          {/* Percentage readout centered over the tube */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-black tracking-wide text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {Math.round(pct)}%
            </span>
          </div>
        </div>
        {/* Glass casing top shine */}
        <div className="fuel-tube-shine" />
      </div>
    </div>
  );
}
