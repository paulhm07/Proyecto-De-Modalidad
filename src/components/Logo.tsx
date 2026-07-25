interface LogoProps {
  size?: number;
  withText?: boolean;
  variant?: "isotipo" | "horizontal";
  className?: string;
}

/**
 * Logo de Mundilex
 * --------------------------------------------------
 * Isotipo SVG inline: un globo (Mundi = mundo del saber) con
 * meridianos y paralelos, envuelto por un anillo orbital cósmico
 * y una chispa dorada. Se renderiza como SVG vectorial para
 * mantenerse nítido a cualquier tamaño y sin depender de PNG.
 *
 * Variantes:
 *  - "isotipo" (por defecto): marca + wordmark "Mundilex" a la derecha.
 *  - "horizontal": igual que isotipo con texto (mantiene la API usada
 *    por el Header). El wordmark usa degradado de texto.
 */
export function Logo({
  size = 40,
  withText = true,
  variant = "isotipo",
  className = "",
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        role="img"
        aria-label="Mundilex"
        className="select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
      >
        <defs>
          <radialGradient id="mundi-globe" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="45%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#7c3aed" />
          </radialGradient>
          <linearGradient id="mundi-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
          <linearGradient id="mundi-spark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        {/* Orbital ring (tilted ellipse) */}
        <g transform="rotate(-22 32 32)">
          <ellipse
            cx="32"
            cy="32"
            rx="29"
            ry="11"
            fill="none"
            stroke="url(#mundi-ring)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.95"
          />
        </g>

        {/* Globe */}
        <circle cx="32" cy="32" r="17.5" fill="url(#mundi-globe)" />
        <circle
          cx="32"
          cy="32"
          r="17.5"
          fill="none"
          stroke="#e0f2fe"
          strokeOpacity="0.55"
          strokeWidth="1"
        />

        {/* Meridians */}
        <ellipse
          cx="32"
          cy="32"
          rx="7"
          ry="17.5"
          fill="none"
          stroke="#e0f2fe"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
        <ellipse
          cx="32"
          cy="32"
          rx="14"
          ry="17.5"
          fill="none"
          stroke="#e0f2fe"
          strokeOpacity="0.32"
          strokeWidth="1"
        />

        {/* Parallels (latitudes) */}
        <line
          x1="15"
          y1="32"
          x2="49"
          y2="32"
          stroke="#e0f2fe"
          strokeOpacity="0.45"
          strokeWidth="1"
        />
        <path
          d="M 17 24 Q 32 21 47 24"
          fill="none"
          stroke="#e0f2fe"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
        <path
          d="M 17 40 Q 32 43 47 40"
          fill="none"
          stroke="#e0f2fe"
          strokeOpacity="0.3"
          strokeWidth="1"
        />

        {/* Golden sparkle (knowledge spark) */}
        <path
          d="M 50 12 L 52.2 18.8 L 59 21 L 52.2 23.2 L 50 30 L 47.8 23.2 L 41 21 L 47.8 18.8 Z"
          fill="url(#mundi-spark)"
        />
      </svg>

      {withText && (
        <span
          className={`font-display font-bold tracking-tight ${
            variant === "horizontal" ? "text-xl" : "text-xl sm:text-2xl"
          }`}
        >
          <span className="bg-gradient-to-r from-cyan-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
            Mundi
          </span>
          <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
            lex
          </span>
        </span>
      )}
    </div>
  );
}
