"use client";

interface HeroTrophyProps {
  size?: number;
  className?: string;
}

/**
 * "Trofeo del Saber" — a 3D gold-textured trophy holding an open book
 * (knowledge) and a ruler (mathematics), with laurel leaves, glow, and
 * specular highlights. Replaces the flat lucide Trophy icon.
 */
export function HeroTrophy({ size = 120, className = "" }: HeroTrophyProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Trofeo del Saber"
      role="img"
    >
      <defs>
        {/* Gold gradients */}
        <linearGradient id="ht-gold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff7d6" />
          <stop offset="25%" stopColor="#fde047" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="85%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="ht-gold-side" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="35%" stopColor="#f59e0b" />
          <stop offset="65%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <radialGradient id="ht-cup" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="40%" stopColor="#fde047" />
          <stop offset="75%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </radialGradient>
        <linearGradient id="ht-book" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
        <linearGradient id="ht-ruler" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        {/* Emboss filter for the book + ruler relief */}
        <filter id="ht-emboss" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.7" result="b" />
          <feSpecularLighting in="b" surfaceScale="2.5" specularConstant="0.9" specularExponent="18" lightingColor="#fff8d0" result="s">
            <feDistantLight azimuth="220" elevation="55" />
          </feSpecularLighting>
          <feComposite in="s" in2="SourceAlpha" operator="in" result="spec" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="spec" />
          </feMerge>
        </filter>
        {/* Soft outer glow */}
        <filter id="ht-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Glow halo behind the trophy */}
      <ellipse cx="64" cy="60" rx="46" ry="50" fill="rgba(251,191,36,0.25)" />

      <g filter="url(#ht-glow)">
        {/* ===== Left handle ===== */}
        <path
          d="M22 38 C 8 38, 6 58, 22 62 L 28 58 C 18 56, 18 44, 30 42 Z"
          fill="url(#ht-gold-side)"
          stroke="#78350f"
          strokeWidth="1"
        />
        {/* ===== Right handle ===== */}
        <path
          d="M106 38 C 120 38, 122 58, 106 62 L 100 58 C 110 56, 110 44, 98 42 Z"
          fill="url(#ht-gold-side)"
          stroke="#78350f"
          strokeWidth="1"
        />

        {/* ===== Cup body (the trophy bowl) ===== */}
        <path
          d="M30 30 L 98 30 L 92 70 C 92 80, 82 86, 64 86 C 46 86, 36 80, 36 70 Z"
          fill="url(#ht-cup)"
          stroke="#78350f"
          strokeWidth="1.4"
        />
        {/* Cup inner shadow + highlight */}
        <path
          d="M36 30 L 92 30 L 90 38 L 38 38 Z"
          fill="rgba(255,255,255,0.55)"
        />
        <path
          d="M64 30 L 64 84"
          stroke="rgba(180,100,20,0.25)"
          strokeWidth="1"
        />
        {/* Cup rim */}
        <ellipse cx="64" cy="30" rx="34" ry="6" fill="url(#ht-gold)" stroke="#78350f" strokeWidth="1.2" />
        <ellipse cx="64" cy="29" rx="28" ry="3.5" fill="rgba(120,53,15,0.4)" />

        {/* ===== Star engraving on the cup ===== */}
        <g fill="#b45309" opacity="0.7" stroke="#78350f" strokeWidth="0.4">
          <path d="M64 44 L 66 50 L 72 50 L 67.5 54 L 69 60 L 64 56.5 L 59 60 L 60.5 54 L 56 50 L 62 50 Z" />
        </g>

        {/* ===== Stem ===== */}
        <rect x="58" y="86" width="12" height="14" fill="url(#ht-gold)" stroke="#78350f" strokeWidth="1" />
        <ellipse cx="64" cy="86" rx="6" ry="2" fill="#78350f" opacity="0.4" />

        {/* ===== Base plate ===== */}
        <rect x="40" y="100" width="48" height="10" rx="2" fill="url(#ht-gold-side)" stroke="#78350f" strokeWidth="1.2" />
        <rect x="44" y="103" width="40" height="2" fill="rgba(255,255,255,0.5)" />

        {/* ===== Laurel leaves (left + right of base) ===== */}
        <g fill="url(#ht-gold)" stroke="#78350f" strokeWidth="0.5">
          <ellipse cx="32" cy="104" rx="6" ry="3" transform="rotate(-25 32 104)" />
          <ellipse cx="28" cy="100" rx="5" ry="2.5" transform="rotate(-40 28 100)" />
          <ellipse cx="96" cy="104" rx="6" ry="3" transform="rotate(25 96 104)" />
          <ellipse cx="100" cy="100" rx="5" ry="2.5" transform="rotate(40 100 100)" />
        </g>

        {/* ===== Open book held in front (knowledge) ===== */}
        <g filter="url(#ht-emboss)">
          {/* Book pages */}
          <path
            d="M48 56 C 54 53, 60 53, 64 56 C 68 53, 74 53, 80 56 L 80 70 C 74 67, 68 67, 64 70 C 60 67, 54 67, 48 70 Z"
            fill="url(#ht-book)"
            stroke="#92400e"
            strokeWidth="1"
          />
          {/* Center spine */}
          <line x1="64" y1="56" x2="64" y2="70" stroke="#92400e" strokeWidth="1" />
          {/* Page text lines */}
          <path d="M52 60 L 60 58.5" stroke="#b45309" strokeWidth="0.5" opacity="0.7" />
          <path d="M52 63 L 60 61.5" stroke="#b45309" strokeWidth="0.5" opacity="0.7" />
          <path d="M52 66 L 60 64.5" stroke="#b45309" strokeWidth="0.5" opacity="0.7" />
          <path d="M68 58.5 L 76 60" stroke="#b45309" strokeWidth="0.5" opacity="0.7" />
          <path d="M68 61.5 L 76 63" stroke="#b45309" strokeWidth="0.5" opacity="0.7" />
          <path d="M68 64.5 L 76 66" stroke="#b45309" strokeWidth="0.5" opacity="0.7" />

          {/* ===== Ruler held diagonally (mathematics) ===== */}
          <g transform="rotate(-22 64 76)">
            <rect x="42" y="73" width="44" height="6" rx="1" fill="url(#ht-ruler)" stroke="#92400e" strokeWidth="0.8" />
            {/* Tick marks */}
            {Array.from({ length: 9 }).map((_, i) => {
              const x = 45 + i * 4.7;
              const tall = i % 2 === 0;
              return (
                <line key={i} x1={x} y1={73} x2={x} y2={tall ? 79 : 77} stroke="#92400e" strokeWidth="0.6" />
              );
            })}
            {/* Ruler numbers hint */}
            <text x="48" y="77.5" fontSize="3.5" fill="#78350f" fontWeight="bold">1</text>
            <text x="67" y="77.5" fontSize="3.5" fill="#78350f" fontWeight="bold">5</text>
          </g>
        </g>

        {/* ===== Specular highlight on cup ===== */}
        <ellipse cx="50" cy="42" rx="6" ry="12" fill="rgba(255,255,255,0.45)" transform="rotate(-15 50 42)" />
        <ellipse cx="78" cy="44" rx="3" ry="8" fill="rgba(255,255,255,0.25)" transform="rotate(10 78 44)" />

        {/* Twinkle */}
        <g stroke="#ffffff" strokeWidth="1" opacity="0.8" strokeLinecap="round">
          <line x1="92" y1="22" x2="92" y2="28" />
          <line x1="89" y1="25" x2="95" y2="25" />
        </g>
        <circle cx="92" cy="25" r="1.5" fill="#ffffff" opacity="0.9" />
      </g>
    </svg>
  );
}
