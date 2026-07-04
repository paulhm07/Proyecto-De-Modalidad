import Image from "next/image";

interface LogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
}

export function Logo({ size = 40, withText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.svg"
        alt="EducaPlay"
        width={size}
        height={size}
        priority
        className="drop-shadow-sm"
      />
      {withText && (
        <span className="font-black tracking-tight text-xl sm:text-2xl">
          <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            Educa
          </span>
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            Play
          </span>
        </span>
      )}
    </div>
  );
}
