"use client";
import type { AvatarConfig } from "@/lib/types";

interface AvatarSVGProps {
  config?: Pick<AvatarConfig, "cuerpo" | "ojos" | "boca" | "cabello" | "ropa" | "accesorio"> | null;
  size?: number;
  className?: string;
}

/**
 * Personaje Bloque 3D estilo Roblox / Minecraft
 * - Cabeza cúbica con cara (ojos + boca)
 * - Torso rectangular con ropa
 * - Brazos y piernas articulados (bloques)
 * - Accesorios: gorros, capas, visores, audífonos
 * - Sombra proyectada en el piso
 */

// Paletas de piel 3D (cara superior, lateral, sombra inferior)
const CUERPO_GRADIENTS: Record<string, { top: string; side: string; bottom: string; face: string }> = {
  "cuerpo-claro": { top: "#ffe0bd", side: "#f5c08c", bottom: "#d99a5e", face: "#ffd9a8" },
  "cuerpo-medio": { top: "#e6b87a", side: "#c68a4a", bottom: "#9a6230", face: "#d99a5e" },
  "cuerpo-oscuro": { top: "#a06a3c", side: "#7a4a26", bottom: "#52301a", face: "#8a5530" },
  "cuerpo-verde": { top: "#b8e878", side: "#7ec040", bottom: "#4a8a20", face: "#9ee060" },
};

// Paletas de ropa 3D (frente, lateral, sombra)
const ROPA_COLORS: Record<string, { front: string; side: string; dark: string; accent: string }> = {
  "ropa-basica": { front: "#2dd4bf", side: "#14b8a6", dark: "#0d9488", accent: "#5eead4" },
  "ropa-uniforme": { front: "#3b4d7a", side: "#2a3858", dark: "#1e293b", accent: "#93c5fd" },
  "ropa-capucha": { front: "#64748b", side: "#475569", dark: "#334155", accent: "#cbd5e1" },
  "ropa-capas": { front: "#ef4444", side: "#dc2626", dark: "#991b1b", accent: "#fca5a5" },
  "ropa-arcoiris": { front: "#a855f7", side: "#9333ea", dark: "#7e22ce", accent: "#facc15" },
};

// Paletas de cabello 3D
const CABELLO_COLORS: Record<string, { top: string; side: string; dark: string }> = {
  "cabello-nada": { top: "transparent", side: "transparent", dark: "transparent" },
  "cabello-corto": { top: "#5a3825", side: "#3e2616", dark: "#2a1810" },
  "cabello-largo": { top: "#7a4a2a", side: "#5a3418", dark: "#3e2210" },
  "cabello-mohawk": { top: "#f97316", side: "#ea580c", dark: "#c2410c" },
  "cabello-corona": { top: "#fbbf24", side: "#f59e0b", dark: "#d97706" },
  "cabello-gorro-graduacion": { top: "#1e293b", side: "#0f172a", dark: "#020617" },
};

export function AvatarSVG({ config, size = 200, className = "" }: AvatarSVGProps) {
  const c = config ?? ({} as AvatarConfig);
  const cuerpoKey = c.cuerpo ?? "cuerpo-claro";
  const sg = CUERPO_GRADIENTS[cuerpoKey] ?? CUERPO_GRADIENTS["cuerpo-claro"];
  const ropaKey = c.ropa ?? "ropa-basica";
  const rc = ROPA_COLORS[ropaKey] ?? ROPA_COLORS["ropa-basica"];
  const cabelloKey = c.cabello ?? "cabello-nada";
  const cg = CABELLO_COLORS[cabelloKey] ?? CABELLO_COLORS["cabello-nada"];
  const ojosKey = c.ojos ?? "ojos-normales";
  const bocaKey = c.boca ?? "boca-sonrisa";
  const accesorioKey = c.accesorio ?? "accesorio-nada";

  const uid = `${cuerpoKey}-${ropaKey}-${cabelloKey}`.replace(/[^a-z0-9-]/gi, "");

  // viewBox amplio para incluir cuerpo completo + sombra
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Avatar del personaje"
    >
      <defs>
        {/* Gradientes de piel 3D para la cara */}
        <linearGradient id={`face-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={sg.top} />
          <stop offset="60%" stopColor={sg.face} />
          <stop offset="100%" stopColor={sg.side} />
        </linearGradient>
        {/* Gradiente para el cuerpo (brazos/piernas) */}
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={sg.side} />
          <stop offset="50%" stopColor={sg.face} />
          <stop offset="100%" stopColor={sg.side} />
        </linearGradient>
        {/* Gradiente para ropa frontal */}
        <linearGradient id={`ropa-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={rc.side} />
          <stop offset="50%" stopColor={rc.front} />
          <stop offset="100%" stopColor={rc.side} />
        </linearGradient>
        {/* Sombra del piso */}
        <radialGradient id={`shadow-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ===== Sombra proyectada en el piso ===== */}
      <ellipse cx="100" cy="228" rx="52" ry="9" fill={`url(#shadow-${uid})`} />

      {/* ===== Piernas (dos bloques) ===== */}
      {/* Pierna izquierda */}
      <g>
        <rect x="78" y="168" width="20" height="48" rx="3" fill={sg.side} />
        <rect x="78" y="168" width="6" height="48" rx="2" fill={sg.bottom} opacity="0.5" />
        {/* Zapato */}
        <rect x="76" y="208" width="24" height="10" rx="2" fill="#1e293b" />
        <rect x="76" y="208" width="24" height="3" rx="1" fill="#334155" />
      </g>
      {/* Pierna derecha */}
      <g>
        <rect x="102" y="168" width="20" height="48" rx="3" fill={sg.face} />
        <rect x="116" y="168" width="6" height="48" rx="2" fill={sg.side} opacity="0.6" />
        {/* Zapato */}
        <rect x="100" y="208" width="24" height="10" rx="2" fill="#1e293b" />
        <rect x="100" y="208" width="24" height="3" rx="1" fill="#334155" />
      </g>

      {/* ===== Torso (bloque con ropa) ===== */}
      <g>
        {/* Cuerpo base (brazos detrás del torso) */}
        {/* Brazo izquierdo */}
        <rect x="48" y="118" width="22" height="52" rx="4" fill={sg.side} />
        <rect x="48" y="118" width="6" height="52" rx="2" fill={sg.bottom} opacity="0.5" />
        {/* Mano izquierda */}
        <rect x="48" y="166" width="22" height="10" rx="3" fill={sg.face} />
        {/* Brazo derecho */}
        <rect x="130" y="118" width="22" height="52" rx="4" fill={sg.face} />
        <rect x="146" y="118" width="6" height="52" rx="2" fill={sg.side} opacity="0.6" />
        {/* Mano derecha */}
        <rect x="130" y="166" width="22" height="10" rx="3" fill={sg.face} />

        {/* Torso con ropa */}
        <rect x="70" y="116" width="60" height="56" rx="5" fill={`url(#ropa-${uid})`} stroke={rc.dark} strokeWidth="1.5" />
        {/* Detalle de la camiseta (cuello) */}
        <RopaLayer clave={ropaKey} colors={rc} />
        {/* Línea de sombra inferior del torso */}
        <rect x="70" y="166" width="60" height="6" rx="2" fill={rc.dark} opacity="0.4" />
      </g>

      {/* ===== Cuello ===== */}
      <rect x="90" y="104" width="20" height="14" rx="2" fill={sg.side} />
      <rect x="90" y="104" width="20" height="4" rx="1" fill={sg.bottom} opacity="0.5" />

      {/* ===== Cabeza cúbica 3D ===== */}
      <g>
        {/* Cara frontal (con degradado de volumen) */}
        <rect x="60" y="40" width="80" height="70" rx="6" fill={`url(#face-${uid})`} stroke={sg.bottom} strokeWidth="1.2" />
        {/* Borde superior brillante */}
        <rect x="60" y="40" width="80" height="6" rx="3" fill={sg.top} opacity="0.6" />
        {/* Borde lateral oscuro (volumen 3D) */}
        <rect x="134" y="46" width="6" height="64" rx="2" fill={sg.side} opacity="0.55" />
        {/* Borde inferior oscuro */}
        <rect x="60" y="104" width="80" height="6" rx="3" fill={sg.side} opacity="0.4" />

        {/* Orejas (bloques pequeños a los lados) */}
        <rect x="54" y="68" width="8" height="14" rx="3" fill={sg.side} />
        <rect x="138" y="68" width="8" height="14" rx="3" fill={sg.side} />

        {/* ===== Ojos ===== */}
        <OjosLayer clave={ojosKey} />

        {/* ===== Boca ===== */}
        <BocaLayer clave={bocaKey} sg={sg} />
      </g>

      {/* ===== Cabello (capa superior de la cabeza) ===== */}
      {cabelloKey !== "cabello-nada" && (
        <CabelloLayer clave={cabelloKey} colors={cg} />
      )}

      {/* ===== Accesorios ===== */}
      <AccesorioLayer clave={accesorioKey} />

      {/* ===== Capa de héroe (detrás de los brazos, sobre el torso) ===== */}
      {ropaKey === "ropa-capas" && (
        <g>
          {/* Capa ondulada detrás */}
          <path
            d="M 56 118 Q 100 110 144 118 L 150 175 Q 130 168 100 172 Q 70 168 50 175 Z"
            fill={rc.dark}
            opacity="0.85"
          />
          <path
            d="M 56 118 Q 100 112 144 118 L 144 122 Q 100 116 56 122 Z"
            fill={rc.accent}
            opacity="0.7"
          />
        </g>
      )}
    </svg>
  );
}

/* ===== Capa de ropa: detalles sobre el torso ===== */
function RopaLayer({ clave, colors }: { clave: string; colors: { front: string; side: string; dark: string; accent: string } }) {
  switch (clave) {
    case "ropa-uniforme":
      // Uniforme escolar: camisa + corbata
      return (
        <g>
          {/* Cuello en V de la camisa */}
          <path d="M 90 116 L 100 132 L 110 116 Z" fill="#f8fafc" />
          {/* Corbata */}
          <path d="M 96 130 L 104 130 L 102 148 L 98 148 Z" fill={colors.accent} />
          <rect x="96" y="148" width="8" height="14" rx="1" fill={colors.accent} opacity="0.8" />
          {/* Botones */}
          <circle cx="100" cy="156" r="1.5" fill={colors.dark} />
          <circle cx="100" cy="164" r="1.5" fill={colors.dark} />
        </g>
      );
    case "ropa-capas":
      // Emblema de héroe en el pecho
      return (
        <g>
          <path d="M 100 130 L 110 138 L 100 158 L 90 138 Z" fill={colors.accent} stroke={colors.dark} strokeWidth="1" />
          <text x="100" y="148" textAnchor="middle" fontSize="12" fontWeight="900" fill={colors.dark}>M</text>
        </g>
      );
    case "ropa-capucha":
      // Bolsillo de sudadera + cordones
      return (
        <g>
          <rect x="78" y="140" width="44" height="18" rx="3" fill={colors.dark} opacity="0.35" />
          <path d="M 92 118 L 92 140 M 108 118 L 108 140" stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="92" cy="142" r="2" fill={colors.accent} />
          <circle cx="108" cy="142" r="2" fill={colors.accent} />
        </g>
      );
    case "ropa-arcoiris":
      // Franjas arcoíris
      return (
        <g>
          <rect x="70" y="118" width="60" height="9" fill="#ef4444" opacity="0.9" />
          <rect x="70" y="127" width="60" height="9" fill="#f97316" opacity="0.9" />
          <rect x="70" y="136" width="60" height="9" fill="#facc15" opacity="0.9" />
          <rect x="70" y="145" width="60" height="9" fill="#22c55e" opacity="0.9" />
          <rect x="70" y="154" width="60" height="9" fill="#3b82f6" opacity="0.9" />
          <rect x="70" y="163" width="60" height="9" fill="#a855f7" opacity="0.9" />
        </g>
      );
    case "ropa-basica":
    default:
      // Camiseta básica: franja horizontal + cuello
      return (
        <g>
          <rect x="70" y="128" width="60" height="8" rx="2" fill={colors.accent} opacity="0.55" />
          <path d="M 90 116 L 100 124 L 110 116" fill="none" stroke={colors.dark} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
  }
}

/* ===== Capa de ojos ===== */
function OjosLayer({ clave }: { clave: string }) {
  switch (clave) {
    case "ojos-cerrados":
      // Ojos cerrados (relajados)
      return (
        <g stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M 74 78 Q 82 82 90 78" />
          <path d="M 110 78 Q 118 82 126 78" />
        </g>
      );
    case "ojos-felices":
      // Ojos felices (arco invertido)
      return (
        <g stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" fill="none">
          <path d="M 74 82 Q 82 74 90 82" />
          <path d="M 110 82 Q 118 74 126 82" />
        </g>
      );
    case "ojos-grandes":
      // Ojos estilo anime grandes
      return (
        <g>
          <ellipse cx="82" cy="78" rx="9" ry="11" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
          <ellipse cx="118" cy="78" rx="9" ry="11" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="83" cy="80" r="5" fill="#1e293b" />
          <circle cx="119" cy="80" r="5" fill="#1e293b" />
          <circle cx="85" cy="77" r="1.8" fill="#ffffff" />
          <circle cx="121" cy="77" r="1.8" fill="#ffffff" />
        </g>
      );
    case "ojos-estrella":
      // Ojos con brillo de estrella
      return (
        <g>
          <circle cx="82" cy="78" r="6" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
          <circle cx="118" cy="78" r="6" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
          <path d="M 82 73 L 83 77 L 87 78 L 83 79 L 82 83 L 81 79 L 77 78 L 81 77 Z" fill="#ffffff" />
          <path d="M 118 73 L 119 77 L 123 78 L 119 79 L 118 83 L 117 79 L 113 78 L 117 77 Z" fill="#ffffff" />
        </g>
      );
    case "ojos-corazon":
      // Ojos en forma de corazón
      return (
        <g fill="#ef4444" stroke="#991b1b" strokeWidth="1.2">
          <path d="M 82 82 C 76 76 76 72 80 72 C 82 72 82 74 82 74 C 82 74 82 72 84 72 C 88 72 88 76 82 82 Z" />
          <path d="M 118 82 C 112 76 112 72 116 72 C 118 72 118 74 118 74 C 118 74 118 72 120 72 C 124 72 124 76 118 82 Z" />
        </g>
      );
    case "ojos-normales":
    default:
      // Ojos normales redondos
      return (
        <g>
          <circle cx="82" cy="78" r="5" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="118" cy="78" r="5" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="83" cy="79" r="3" fill="#1e293b" />
          <circle cx="119" cy="79" r="3" fill="#1e293b" />
          <circle cx="84" cy="77" r="1.2" fill="#ffffff" />
          <circle cx="120" cy="77" r="1.2" fill="#ffffff" />
        </g>
      );
  }
}

/* ===== Capa de boca ===== */
function BocaLayer({ clave, sg }: { clave: string; sg: { top: string; side: string; bottom: string; face: string } }) {
  switch (clave) {
    case "boca-serio":
      // Boca seria recta
      return (
        <path d="M 86 96 L 114 96" stroke="#7a4422" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      );
    case "boca-gran-sonrisa":
      // Gran sonrisa abierta con dientes
      return (
        <g>
          <path d="M 82 92 Q 100 112 118 92 Z" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="88" y="92" width="24" height="5" rx="1" fill="#ffffff" />
          <line x1="94" y1="92" x2="94" y2="97" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="100" y1="92" x2="100" y2="97" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="106" y1="92" x2="106" y2="97" stroke="#cbd5e1" strokeWidth="0.8" />
        </g>
      );
    case "boca-lengua":
      // Sonrisa traviesa con lengua
      return (
        <g>
          <path d="M 84 92 Q 100 106 116 92" stroke="#7a4422" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <ellipse cx="104" cy="104" rx="6" ry="5" fill="#f87171" stroke="#dc2626" strokeWidth="1" />
          <line x1="104" y1="100" x2="104" y2="107" stroke="#dc2626" strokeWidth="1" />
        </g>
      );
    case "boca-sonrisa":
    default:
      // Sonrisa suave
      return (
        <path d="M 86 94 Q 100 104 114 94" stroke="#7a4422" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      );
  }
}

/* ===== Capa de cabello ===== */
function CabelloLayer({ clave, colors }: { clave: string; colors: { top: string; side: string; dark: string } }) {
  switch (clave) {
    case "cabello-corto":
      // Cabello corto en bloques sobre la cabeza
      return (
        <g>
          <path d="M 58 46 Q 60 28 100 26 Q 140 28 142 46 L 142 54 Q 100 48 58 54 Z" fill={colors.top} stroke={colors.dark} strokeWidth="1" />
          {/* Flequillo */}
          <path d="M 70 44 Q 80 52 92 46 Q 100 50 108 46 Q 120 52 130 44 L 130 50 Q 100 54 70 50 Z" fill={colors.side} />
        </g>
      );
    case "cabello-largo":
      // Cabello largo cayendo a los lados
      return (
        <g>
          <path d="M 56 46 Q 58 24 100 22 Q 142 24 144 46 L 144 110 Q 140 114 134 110 L 134 60 Q 100 52 66 60 L 66 110 Q 60 114 56 110 Z" fill={colors.top} stroke={colors.dark} strokeWidth="1" />
          {/* Flequillo */}
          <path d="M 68 44 Q 84 54 100 48 Q 116 54 132 44 L 132 52 Q 100 58 68 52 Z" fill={colors.side} />
        </g>
      );
    case "cabello-mohawk":
      // Cresta Mohawk de colores fuego
      return (
        <g>
          {/* Base */}
          <rect x="90" y="30" width="20" height="14" rx="2" fill={colors.dark} />
          {/* Cresta */}
          <path d="M 92 30 L 96 14 L 100 28 L 104 14 L 108 30 Z" fill={colors.top} stroke={colors.dark} strokeWidth="1" />
          <path d="M 96 14 L 100 28 L 104 14" fill={colors.side} />
        </g>
      );
    case "cabello-corona":
      // Corona dorada
      return (
        <g>
          <path d="M 64 40 L 70 22 L 80 36 L 100 18 L 120 36 L 130 22 L 136 40 Z" fill={colors.top} stroke={colors.dark} strokeWidth="1.5" />
          {/* Joyas */}
          <circle cx="80" cy="34" r="3" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
          <circle cx="100" cy="26" r="3.5" fill="#3b82f6" stroke="#1e40af" strokeWidth="0.8" />
          <circle cx="120" cy="34" r="3" fill="#22c55e" stroke="#166534" strokeWidth="0.8" />
          {/* Banda */}
          <rect x="62" y="38" width="76" height="6" rx="1" fill={colors.side} stroke={colors.dark} strokeWidth="1" />
        </g>
      );
    case "cabello-gorro-graduacion":
      // Gorro de graduación
      return (
        <g>
          {/* Banda */}
          <rect x="60" y="38" width="80" height="10" rx="2" fill={colors.side} />
          {/* Placa superior (cuadrado rotado) */}
          <path d="M 100 18 L 140 32 L 100 46 L 60 32 Z" fill={colors.top} stroke={colors.dark} strokeWidth="1.5" />
          {/* Borla */}
          <circle cx="100" cy="18" r="3" fill={colors.dark} />
          <path d="M 100 18 L 100 10 M 100 18 L 106 12 M 100 18 L 94 12" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="100" cy="8" r="2.5" fill="#fbbf24" />
        </g>
      );
    default:
      return null;
  }
}

/* ===== Capa de accesorios ===== */
function AccesorioLayer({ clave }: { clave: string }) {
  switch (clave) {
    case "accesorio-gafas":
      // Gafas redondas
      return (
        <g stroke="#1e293b" strokeWidth="2" fill="rgba(255,255,255,0.3)">
          <circle cx="82" cy="78" r="11" />
          <circle cx="118" cy="78" r="11" />
          <line x1="93" y1="78" x2="107" y2="78" />
        </g>
      );
    case "accesorio-gafas-sol":
      // Gafas de sol
      return (
        <g>
          <rect x="70" y="72" width="22" height="12" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
          <rect x="108" y="72" width="22" height="12" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
          <line x1="92" y1="78" x2="108" y2="78" stroke="#0f172a" strokeWidth="2" />
          {/* Reflejo */}
          <rect x="73" y="74" width="6" height="3" rx="1" fill="#60a5fa" opacity="0.6" />
          <rect x="111" y="74" width="6" height="3" rx="1" fill="#60a5fa" opacity="0.6" />
        </g>
      );
    case "accesorio-mascara":
      // Máscara de superhéroe
      return (
        <g>
          <path d="M 66 72 Q 100 66 134 72 L 134 88 Q 100 82 66 88 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1.5" />
          {/* Ventanas para los ojos */}
          <ellipse cx="82" cy="78" rx="6" ry="4" fill="#ffffff" />
          <ellipse cx="118" cy="78" rx="6" ry="4" fill="#ffffff" />
          <ellipse cx="82" cy="78" rx="3" ry="3" fill="#1e293b" />
          <ellipse cx="118" cy="78" rx="3" ry="3" fill="#1e293b" />
        </g>
      );
    case "accesorio-varita":
      // Varita mágica en la mano derecha
      return (
        <g>
          <line x1="140" y1="160" x2="170" y2="120" stroke="#92400e" strokeWidth="3" strokeLinecap="round" />
          <path d="M 170 120 L 178 112 M 170 120 L 174 108 M 170 120 L 162 112 M 170 120 L 166 132" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="170" cy="120" r="4" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
        </g>
      );
    case "accesorio-estrella":
      // Estrella compañera flotando
      return (
        <g>
          <path d="M 160 56 L 164 66 L 175 67 L 167 74 L 170 85 L 160 79 L 150 85 L 153 74 L 145 67 L 156 66 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
          {/* Brillos */}
          <circle cx="158" cy="68" r="1.5" fill="#ffffff" />
          {/* Línea de conexión */}
          <path d="M 150 80 Q 140 90 130 95" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2 2" fill="none" opacity="0.6" />
        </g>
      );
    case "accesorio-nada":
    default:
      return null;
  }
}
