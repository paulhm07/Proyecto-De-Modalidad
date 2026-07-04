"use client";

interface EssenceCrystalProps {
  size?: number;
  className?: string;
  tint?: "violet" | "cyan" | "rose";
}

/**
 * "Cristal de Esencia" — a multifaceted 3D gem with prism facets,
 * inner glow, and a sparkle highlight.
 */
export function EssenceCrystal({
  size = 28,
  className = "",
  tint = "violet",
}: EssenceCrystalProps) {
  const palette = {
    violet: { light: "#c4b5fd", mid: "#8b5cf6", dark: "#5b21b6", deep: "#3b0764" },
    cyan: { light: "#a5f3ff", mid: "#22d3ee", dark: "#0e7490", deep: "#083344" },
    rose: { light: "#fecdd3", mid: "#fb7185", dark: "#be123c", deep: "#4c0519" },
  }[tint];

  const id = `ec-${tint}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Cristal de Esencia"
      role="img"
    >
      <defs>
        <linearGradient id={`${id}-top`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={palette.light} />
        </linearGradient>
        <linearGradient id={`${id}-left`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.mid} />
          <stop offset="100%" stopColor={palette.dark} />
        </linearGradient>
        <linearGradient id={`${id}-right`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.light} />
          <stop offset="100%" stopColor={palette.dark} />
        </linearGradient>
        <linearGradient id={`${id}-bottom`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.dark} />
          <stop offset="100%" stopColor={palette.deep} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={palette.light} stopOpacity="0.6" />
          <stop offset="100%" stopColor={palette.deep} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer glow halo */}
      <ellipse cx="32" cy="34" rx="26" ry="28" fill={`url(#${id}-glow)`} />

      {/* Gem silhouette — multifaceted crystal */}
      {/* Top crown facet */}
      <polygon points="20,12 44,12 38,6 26,6" fill={`url(#${id}-top)`} stroke={palette.deep} strokeWidth="0.6" />
      {/* Upper facets */}
      <polygon points="20,12 32,12 26,6" fill={palette.light} opacity="0.85" stroke={palette.deep} strokeWidth="0.4" />
      <polygon points="32,12 44,12 38,6" fill={palette.mid} opacity="0.7" stroke={palette.deep} strokeWidth="0.4" />

      {/* Pavilion (body) facets */}
      <polygon points="20,12 32,12 32,52" fill={`url(#${id}-left)`} stroke={palette.deep} strokeWidth="0.5" />
      <polygon points="32,12 44,12 32,52" fill={`url(#${id}-right)`} stroke={palette.deep} strokeWidth="0.5" />

      {/* Bottom keel */}
      <polygon points="20,12 32,52 44,12" fill="none" stroke={palette.deep} strokeWidth="0.4" opacity="0.5" />
      <polygon points="26,30 32,52 38,30" fill={`url(#${id}-bottom)`} opacity="0.55" />

      {/* Inner facet lines for sparkle */}
      <line x1="32" y1="12" x2="32" y2="52" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
      <line x1="20" y1="12" x2="32" y2="30" stroke="#ffffff" strokeWidth="0.35" opacity="0.4" />
      <line x1="44" y1="12" x2="32" y2="30" stroke="#ffffff" strokeWidth="0.35" opacity="0.4" />

      {/* Specular sparkle highlight */}
      <polygon points="24,10 29,10 26,7" fill="#ffffff" opacity="0.85" />
      <circle cx="24" cy="20" r="1.6" fill="#ffffff" opacity="0.8" />
      {/* Twinkle cross */}
      <g stroke="#ffffff" strokeWidth="0.6" opacity="0.7" strokeLinecap="round">
        <line x1="40" y1="22" x2="40" y2="28" />
        <line x1="37" y1="25" x2="43" y2="25" />
      </g>
    </svg>
  );
}
