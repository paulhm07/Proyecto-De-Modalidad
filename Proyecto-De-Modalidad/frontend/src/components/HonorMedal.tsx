"use client";

interface HonorMedalProps {
  size?: number;
  className?: string;
}

/**
 * "Medalla de Honor" — a small golden medal with a ribbon that sparkles.
 * Sits next to the current user's name in the ranking.
 */
export function HonorMedal({ size = 22, className = "" }: HonorMedalProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-sparkle ${className}`}
      aria-label="Medalla de Honor"
      role="img"
    >
      <defs>
        <linearGradient id="hm-ribbon-l" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="hm-ribbon-r" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
        <radialGradient id="hm-medal" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="45%" stopColor="#fde047" />
          <stop offset="80%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
      </defs>

      {/* Ribbons */}
      <path d="M11 2 L 16 14 L 13 14 L 8 4 Z" fill="url(#hm-ribbon-l)" stroke="#0e7490" strokeWidth="0.5" />
      <path d="M21 2 L 16 14 L 19 14 L 24 4 Z" fill="url(#hm-ribbon-r)" stroke="#9f1239" strokeWidth="0.5" />

      {/* Medal body */}
      <circle cx="16" cy="20" r="9" fill="url(#hm-medal)" stroke="#78350f" strokeWidth="0.8" />
      {/* Inner ring */}
      <circle cx="16" cy="20" r="6.5" fill="none" stroke="#b45309" strokeWidth="0.6" opacity="0.6" />

      {/* Star engraving */}
      <path
        d="M16 15 L 17.3 18.5 L 21 18.7 L 18.1 21 L 19 24.5 L 16 22.5 L 13 24.5 L 13.9 21 L 11 18.7 L 14.7 18.5 Z"
        fill="#b45309"
        opacity="0.75"
        stroke="#78350f"
        strokeWidth="0.3"
      />

      {/* Specular highlight */}
      <ellipse cx="13" cy="17" rx="2" ry="3" fill="rgba(255,255,255,0.6)" />

      {/* Sparkle cross */}
      <g stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" opacity="0.9">
        <line x1="22" y1="13" x2="22" y2="17" />
        <line x1="20" y1="15" x2="24" y2="15" />
      </g>
    </svg>
  );
}
