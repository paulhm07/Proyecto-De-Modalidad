interface LogoProps {
  size?: number;
  withText?: boolean;
  variant?: "isotipo" | "horizontal";
  className?: string;
}

/**
 * Logo de EducaPlay
 * --------------------------------------------------
 * Variantes:
 *  - "isotipo" (por defecto): muestra el isotipo 2.5D Claymorphism blanco
 *    + wordmark "EducaPlay" con degradado de texto. Ideal para el header.
 *  - "horizontal": muestra el logo horizontal completo (isotipo + wordmark)
 *    como una sola imagen PNG sobre fondos oscuros, usando mix-blend-lighten
 *    para eliminar el fondo gris carbón del PNG.
 */
export function Logo({
  size = 40,
  withText = true,
  variant = "isotipo",
  className = "",
}: LogoProps) {
  // Variante horizontal: una sola imagen PNG con isotipo + wordmark
  if (variant === "horizontal") {
    return (
      <img
        src="/app-icon/educaplay-logo-horizontal.png"
        alt="EducaPlay"
        style={{ height: `${size}px`, width: "auto" }}
        className={`select-none object-contain mix-blend-lighten drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] ${className}`}
        draggable={false}
      />
    );
  }

  // Variante isotipo (por defecto)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/app-icon/educaplay-icon-white.png"
        alt="EducaPlay"
        width={size}
        height={size}
        className="select-none object-contain mix-blend-lighten drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
        draggable={false}
      />
      {withText && (
        <span className="font-black tracking-tight text-xl sm:text-2xl">
          <span className="bg-gradient-to-r from-cyan-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
            Educa
          </span>
          <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
            Play
          </span>
        </span>
      )}
    </div>
  );
}
