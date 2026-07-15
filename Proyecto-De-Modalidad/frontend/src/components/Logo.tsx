interface LogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
}

/**
 * Logo de EducaPlay
 * --------------------------------------------------
 * Usa el isotipo 2.5D Claymorphism blanco (generado con IA)
 * sobre fondos oscuros. El PNG tiene fondo gris carbón que
 * se elimina con `mix-blend-mode: lighten` (solo queda el
 * blanco del isotipo sobre el fondo oscuro del header/login).
 * El wordmark "EducaPlay" se mantiene con degradado de texto.
 */
export function Logo({ size = 40, withText = true, className = "" }: LogoProps) {
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
