"use client";

interface RunicCoinProps {
  size?: number;
  className?: string;
}

/**
 * "Moneda rúnica de Saber" — a 3D-textured gold coin with rune dashes around
 * the rim and an embossed open-book + "+" relief in the center.
 */
export function RunicCoin({ size = 28, className = "" }: RunicCoinProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Moneda rúnica de Saber"
      role="img"
    >
      <defs>
        <radialGradient id="rc-face" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="35%" stopColor="#fde047" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <linearGradient id="rc-rim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="rc-book" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="100%" stopColor="#fcd34d" />
        </linearGradient>
        <filter id="rc-emboss" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="b" />
          <feSpecularLighting in="b" surfaceScale="2" specularConstant="0.8" specularExponent="20" lightingColor="#fff8d0" result="s">
            <feDistantLight azimuth="225" elevation="55" />
          </feSpecularLighting>
          <feComposite in="s" in2="SourceAlpha" operator="in" result="spec" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="spec" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer rim ring (the coin edge with 3D depth) */}
      <circle cx="32" cy="33" r="29" fill="url(#rc-rim)" />
      <circle cx="32" cy="32" r="29" fill="url(#rc-face)" stroke="#92400e" strokeWidth="1.2" />

      {/* Rune dashes around the rim */}
      <g stroke="#7c2d12" strokeWidth="1.8" strokeLinecap="round" opacity="0.85">
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const x1 = 32 + Math.cos(a) * 25.5;
          const y1 = 32 + Math.sin(a) * 25.5;
          const x2 = 32 + Math.cos(a) * 22.5;
          const y2 = 32 + Math.sin(a) * 22.5;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {/* Inner ring */}
      <circle cx="32" cy="32" r="20" fill="none" stroke="#b45309" strokeWidth="0.8" opacity="0.6" />

      {/* Embossed open book + "+" relief */}
      <g filter="url(#rc-emboss)">
        {/* Open book */}
        <path
          d="M32 22 C 27 19, 21 19, 18 21 L 18 42 C 21 40, 27 40, 32 43 C 37 40, 43 40, 46 42 L 46 21 C 43 19, 37 19, 32 22 Z"
          fill="url(#rc-book)"
          stroke="#92400e"
          strokeWidth="0.9"
        />
        {/* Center spine */}
        <line x1="32" y1="22" x2="32" y2="43" stroke="#92400e" strokeWidth="0.9" />
        {/* Page lines */}
        <path d="M21 25 L 30 23.5" stroke="#b45309" strokeWidth="0.5" opacity="0.7" />
        <path d="M21 28 L 30 26.5" stroke="#b45309" strokeWidth="0.5" opacity="0.7" />
        <path d="M21 31 L 30 29.5" stroke="#b45309" strokeWidth="0.5" opacity="0.7" />
        <path d="M34 23.5 L 43 25" stroke="#b45309" strokeWidth="0.5" opacity="0.7" />
        <path d="M34 26.5 L 43 28" stroke="#b45309" strokeWidth="0.5" opacity="0.7" />
        <path d="M34 29.5 L 43 31" stroke="#b45309" strokeWidth="0.5" opacity="0.7" />

        {/* "+" embossed above the book */}
        <g stroke="#7c2d12" strokeWidth="2.4" strokeLinecap="round">
          <line x1="32" y1="11" x2="32" y2="17" />
          <line x1="29" y1="14" x2="35" y2="14" />
        </g>
      </g>

      {/* Top gloss highlight */}
      <ellipse cx="24" cy="20" rx="10" ry="5" fill="rgba(255,255,255,0.45)" />
      <ellipse cx="40" cy="46" rx="6" ry="2.5" fill="rgba(255,255,255,0.18)" />
    </svg>
  );
}
