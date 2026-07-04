"use client";
import { Eye, Shirt, Glasses, User, Scissors } from "lucide-react";
import type { CategoriaAvatar } from "@/lib/types";

interface CategoryIconProps {
  categoria: CategoriaAvatar;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

/** Custom smiling mouth SVG (lucide has no standalone mouth icon) */
function MouthIcon({ size = 28, strokeWidth = 2.5, className = "" }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className={className}>
      {/* Upper lip line */}
      <path d="M4 13 Q 16 9, 28 13" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* Open smiling mouth body */}
      <path
        d="M6 13 Q 16 28, 26 13 Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Tongue hint */}
      <path d="M12 19 Q 16 24, 20 19" stroke="currentColor" strokeWidth={strokeWidth * 0.8} strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}

/** Friendly robot-style body icon (for CUERPO) */
function BodyIcon({ size = 28, strokeWidth = 2.5, className = "" }: { size?: number; strokeWidth?: number; className?: string }) {
  return <User size={size} strokeWidth={strokeWidth} className={className} />;
}

export function CategoryIcon({ categoria, size = 28, className = "", strokeWidth = 2.5 }: CategoryIconProps) {
  switch (categoria) {
    case "CUERPO":
      return <BodyIcon size={size} strokeWidth={strokeWidth} className={className} />;
    case "OJOS":
      return <Eye size={size} strokeWidth={strokeWidth} className={className} />;
    case "BOCA":
      return <MouthIcon size={size} strokeWidth={strokeWidth} className={className} />;
    case "CABELLO":
      return <Scissors size={size} strokeWidth={strokeWidth} className={className} />;
    case "ROPA":
      return <Shirt size={size} strokeWidth={strokeWidth} className={className} />;
    case "ACCESORIO":
      return <Glasses size={size} strokeWidth={strokeWidth} className={className} />;
    default:
      return <User size={size} strokeWidth={strokeWidth} className={className} />;
  }
}

export const CATEGORIAS_ORDER: CategoriaAvatar[] = [
  "CUERPO",
  "OJOS",
  "BOCA",
  "CABELLO",
  "ROPA",
  "ACCESORIO",
];

export const CATEGORIA_LABEL: Record<CategoriaAvatar, string> = {
  CUERPO: "Cuerpo",
  OJOS: "Ojos",
  BOCA: "Boca",
  CABELLO: "Pelo",
  ROPA: "Ropa",
  ACCESORIO: "Accesorios",
};
