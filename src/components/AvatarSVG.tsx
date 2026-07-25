"use client";
import type { AvatarConfig } from "@/lib/types";

interface AvatarSVGProps {
  config?: Pick<AvatarConfig, "cuerpo" | "ojos" | "boca" | "cabello" | "ropa" | "accesorio"> | null;
  size?: number;
  className?: string;
}

// Paletas de piel con 3 paradas para volumen 3D + tono de sombra + rubor
const CUERPO_GRADIENTS: Record<string, { hi: string; mid: string; lo: string; cheek: string; shadow: string }> = {
  "cuerpo-claro": { hi: "#fff2db", mid: "#ffd9a8", lo: "#e0a878", cheek: "#ff8fa3", shadow: "#b87b4e" },
  "cuerpo-medio": { hi: "#f4cb95", mid: "#d99a5e", lo: "#b5763f", cheek: "#c64a5e", shadow: "#8a5226" },
  "cuerpo-oscuro": { hi: "#c9854f", mid: "#a35e30", lo: "#7a4422", cheek: "#5e2a35", shadow: "#4a2a16" },
  "cuerpo-verde": { hi: "#d4f9b0", mid: "#9ee070", lo: "#6bb842", cheek: "#3a8a4a", shadow: "#3a7a2a" },
};

const ROPA_COLORS: Record<string, { hi: string; mid: string; lo: string }> = {
  "ropa-basica": { hi: "#5eead4", mid: "#2dd4bf", lo: "#0d9488" },
  "ropa-uniforme": { hi: "#5470a8", mid: "#3b4d7a", lo: "#1e293b" },
  "ropa-capucha": { hi: "#cbd5e1", mid: "#9ca3af", lo: "#4b5563" },
  "ropa-capas": { hi: "#f87171", mid: "#ef4444", lo: "#991b1b" },
  "ropa-arcoiris": { hi: "#f87171", mid: "#facc15", lo: "#a855f7" },
};

export function AvatarSVG({ config, size = 200, className = "" }: AvatarSVGProps) {
  const c = config ?? ({} as AvatarConfig);
  const cuerpoKey = c.cuerpo ?? "cuerpo-claro";
  const g = CUERPO_GRADIENTS[cuerpoKey] ?? CUERPO_GRADIENTS["cuerpo-claro"];
  const ropaKey = c.ropa ?? "ropa-basica";
  const rc = ROPA_COLORS[ropaKey] ?? ROPA_COLORS["ropa-basica"];
  const uid = `${cuerpoKey}-${ropaKey}`.replace(/[^a-z0-9-]/gi, "");
  // viewBox es 240×280 (más alto que ancho): calculamos alto proporcional para que se vea el cuerpo completo
  const w = size;
  const h = Math.round(size * (280 / 240));

  return (
    <svg width={w} height={h} viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Avatar del estudiante">
      <defs>
        {/* Volumetric skin: highlight top-left → mid → shadow bottom-right */}
        <radialGradient id={`skin-${uid}`} cx="36%" cy="28%" r="82%">
          <stop offset="0%" stopColor={g.hi} />
          <stop offset="48%" stopColor={g.mid} />
          <stop offset="100%" stopColor={g.lo} />
        </radialGradient>
        {/* Specular gloss (clay shine on top-left of head) */}
        <radialGradient id={`gloss-${uid}`} cx="32%" cy="22%" r="34%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        {/* Rim/backlight on right edge of head */}
        <radialGradient id={`rim-${uid}`} cx="80%" cy="52%" r="42%">
          <stop offset="0%" stopColor="rgba(255,235,200,0)" />
          <stop offset="78%" stopColor="rgba(255,235,200,0)" />
          <stop offset="94%" stopColor="rgba(255,228,185,0.55)" />
          <stop offset="100%" stopColor="rgba(255,228,185,0)" />
        </radialGradient>
        {/* Clothing gradients — one per ropa type, referenced by RopaLayer as url(#cloth-ropa-*) */}
        <linearGradient id="cloth-ropa-basica" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={ROPA_COLORS["ropa-basica"].hi} /><stop offset="55%" stopColor={ROPA_COLORS["ropa-basica"].mid} /><stop offset="100%" stopColor={ROPA_COLORS["ropa-basica"].lo} /></linearGradient>
        <linearGradient id="cloth-ropa-uniforme" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={ROPA_COLORS["ropa-uniforme"].hi} /><stop offset="55%" stopColor={ROPA_COLORS["ropa-uniforme"].mid} /><stop offset="100%" stopColor={ROPA_COLORS["ropa-uniforme"].lo} /></linearGradient>
        <linearGradient id="cloth-ropa-capucha" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={ROPA_COLORS["ropa-capucha"].hi} /><stop offset="55%" stopColor={ROPA_COLORS["ropa-capucha"].mid} /><stop offset="100%" stopColor={ROPA_COLORS["ropa-capucha"].lo} /></linearGradient>
        <linearGradient id="cloth-ropa-capas" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={ROPA_COLORS["ropa-capas"].hi} /><stop offset="55%" stopColor={ROPA_COLORS["ropa-capas"].mid} /><stop offset="100%" stopColor={ROPA_COLORS["ropa-capas"].lo} /></linearGradient>
        {/* Rainbow (special) */}
        <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" /><stop offset="20%" stopColor="#f97316" /><stop offset="40%" stopColor="#facc15" />
          <stop offset="60%" stopColor="#22c55e" /><stop offset="80%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        {/* Soft ground shadow */}
        <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(30,15,40,0.35)" /><stop offset="70%" stopColor="rgba(30,15,40,0.12)" /><stop offset="100%" stopColor="rgba(30,15,40,0)" /></radialGradient>
        {/* Neck shadow (head casts on neck) */}
        <linearGradient id="neckShadow" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="rgba(0,0,0,0.4)" /><stop offset="100%" stopColor="rgba(0,0,0,0)" /></linearGradient>
        {/* Iris gradient */}
        <radialGradient id="irisGrad" cx="50%" cy="38%" r="62%"><stop offset="0%" stopColor="#7a3a8e" /><stop offset="70%" stopColor="#3d1a4a" /><stop offset="100%" stopColor="#1a0a22" /></radialGradient>
        {/* Mohawk fire gradient */}
        <linearGradient id="mohawkGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fbbf24" /><stop offset="50%" stopColor="#f97316" /><stop offset="100%" stopColor="#dc2626" /></linearGradient>
        {/* Crown gold */}
        <linearGradient id="crownGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fde047" /><stop offset="100%" stopColor="#ca8a04" /></linearGradient>
        <linearGradient id="crownShine" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="rgba(255,255,255,0)" /><stop offset="50%" stopColor="rgba(255,255,255,0.7)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" /></linearGradient>
        {/* Sunglasses dark */}
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#312e81" /><stop offset="100%" stopColor="#0d0826" /></linearGradient>
      </defs>

      {/* ===== Ground shadow ===== */}
      <ellipse cx="120" cy="266" rx="72" ry="11" fill="url(#shadowGrad)" />

      {/* ===== Back hair (behind body) ===== */}
      <CabelloBackLayer clave={c.cabello ?? "cabello-nada"} />

      {/* ===== Body: torso + arm stubs (rounded bean shape) ===== */}
      {/* Arms (behind torso) */}
      <ellipse cx="58" cy="232" rx="20" ry="34" fill={`url(#skin-${uid})`} stroke={g.shadow} strokeWidth="1.8" />
      <ellipse cx="182" cy="232" rx="20" ry="34" fill={`url(#skin-${uid})`} stroke={g.shadow} strokeWidth="1.8" />
      {/* Arm gloss */}
      <ellipse cx="54" cy="222" rx="6" ry="14" fill="rgba(255,255,255,0.22)" />
      <ellipse cx="186" cy="222" rx="6" ry="14" fill="rgba(255,255,255,0.18)" />

      {/* Torso (rounded trapezoid) */}
      <path d="M72 276 Q70 200 96 184 L144 184 Q170 200 168 276 Z" fill={`url(#skin-${uid})`} stroke={g.shadow} strokeWidth="1.8" />
      {/* Torso shadow under chin */}
      <path d="M72 276 Q70 200 96 184 L144 184 Q170 200 168 276 Z" fill="url(#shadowGrad)" opacity="0.45" />

      {/* ===== Clothing on torso ===== */}
      <RopaLayer clave={ropaKey} />

      {/* ===== Neck ===== */}
      <path d="M104 150 L104 192 Q104 202 120 204 L120 204 Q136 202 136 192 L136 150 Z" fill={`url(#skin-${uid})`} />
      <path d="M104 150 L104 168 Q120 178 136 168 L136 150 Z" fill="url(#neckShadow)" />
      <path d="M108 152 L108 180" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />

      {/* ===== Head (egg-shaped, slightly taller) ===== */}
      <ellipse cx="120" cy="100" rx="66" ry="72" fill={`url(#skin-${uid})`} stroke={g.shadow} strokeWidth="2" />
      {/* Rim light */}
      <ellipse cx="120" cy="100" rx="66" ry="72" fill={`url(#rim-${uid})`} />
      {/* Specular gloss */}
      <ellipse cx="120" cy="100" rx="66" ry="72" fill={`url(#gloss-${uid})`} />

      {/* Ears (small, on sides) */}
      <ellipse cx="56" cy="108" rx="9" ry="13" fill={`url(#skin-${uid})`} stroke={g.shadow} strokeWidth="1.5" />
      <ellipse cx="184" cy="108" rx="9" ry="13" fill={`url(#skin-${uid})`} stroke={g.shadow} strokeWidth="1.5" />
      <ellipse cx="56" cy="108" rx="4" ry="6" fill={g.shadow} opacity="0.35" />
      <ellipse cx="184" cy="108" rx="4" ry="6" fill={g.shadow} opacity="0.35" />

      {/* Cheeks (soft blush) */}
      <ellipse cx="76" cy="120" rx="13" ry="8.5" fill={g.cheek} opacity="0.55" />
      <ellipse cx="164" cy="120" rx="13" ry="8.5" fill={g.cheek} opacity="0.55" />
      <ellipse cx="73" cy="116" rx="5" ry="2.5" fill="rgba(255,255,255,0.45)" />
      <ellipse cx="161" cy="116" rx="5" ry="2.5" fill="rgba(255,255,255,0.45)" />

      {/* ===== Front hair ===== */}
      <CabelloFrontLayer clave={c.cabello ?? "cabello-nada"} />

      {/* ===== Face features ===== */}
      <OjosLayer clave={c.ojos ?? "ojos-normales"} />
      {/* Tiny nose hint */}
      <path d="M118 108 Q116 116 120 118 Q124 116 122 108" fill="none" stroke={g.shadow} strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      <BocaLayer clave={c.boca ?? "boca-sonrisa"} />

      {/* ===== Accessories (front-most) ===== */}
      <AccesorioLayer clave={c.accesorio ?? "accesorio-nada"} />

      {/* Subtle outline pop */}
      <ellipse cx="120" cy="100" rx="66" ry="72" fill="none" stroke="rgba(45,20,55,0.16)" strokeWidth="1" />
    </svg>
  );
}

function CabelloBackLayer({ clave }: { clave: string }) {
  switch (clave) {
    case "cabello-largo": return (<g><path d="M52 108 Q48 168 58 200 L74 200 Q66 168 68 116 Z" fill="#3a2515" stroke="#2d1437" strokeWidth="1.5" /><path d="M188 108 Q192 168 182 200 L166 200 Q174 168 172 116 Z" fill="#3a2515" stroke="#2d1437" strokeWidth="1.5" /><path d="M54 116 Q52 152 60 184" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" /><path d="M186 116 Q188 152 180 184" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" /></g>);
    case "cabello-corto": return (<g><path d="M58 96 Q54 132 62 158" fill="#5a3a25" stroke="#2d1437" strokeWidth="1.5" /><path d="M182 96 Q186 132 178 158" fill="#5a3a25" stroke="#2d1437" strokeWidth="1.5" /></g>);
    default: return null;
  }
}

function CabelloFrontLayer({ clave }: { clave: string }) {
  switch (clave) {
    case "cabello-corto":
      return (<g>
        <path d="M54 100 Q52 44 120 38 Q188 44 186 100 Q180 76 162 68 Q150 86 128 82 Q120 88 112 82 Q90 86 78 68 Q60 76 54 100 Z" fill="#5a3a25" stroke="#2d1437" strokeWidth="2" strokeLinejoin="round" />
        <path d="M76 54 Q100 44 124 52" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M58 92 Q56 60 74 48" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Side strand */}
        <path d="M178 88 Q184 100 180 118" fill="none" stroke="#2d1437" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </g>);
    case "cabello-largo":
      return (<g>
        <path d="M50 104 Q48 38 120 32 Q192 38 190 104 Q184 72 164 62 Q150 82 128 78 Q120 84 112 78 Q90 82 76 62 Q56 72 50 104 Z" fill="#4a2c1a" stroke="#2d1437" strokeWidth="2" strokeLinejoin="round" />
        <path d="M72 48 Q100 38 126 48" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M52 96 Q50 56 72 42" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Front bangs strand */}
        <path d="M96 58 Q108 70 104 86" fill="#3a2515" stroke="#2d1437" strokeWidth="1.5" strokeLinejoin="round" />
      </g>);
    case "cabello-mohawk":
      return (<g>
        {/* Shaved sides (dark) */}
        <path d="M58 96 Q56 60 74 50 L86 52 Q78 70 76 96 Z" fill="#2d1437" stroke="#1a0a22" strokeWidth="1.5" />
        <path d="M182 96 Q184 60 166 50 L154 52 Q162 70 164 96 Z" fill="#2d1437" stroke="#1a0a22" strokeWidth="1.5" />
        {/* Mohawk crest (fire gradient) */}
        <path d="M104 70 Q102 28 120 14 Q138 28 136 70 L130 72 L125 66 L120 72 L115 66 L110 72 Z" fill="url(#mohawkGrad)" stroke="#2d1437" strokeWidth="2" strokeLinejoin="round" />
        <path d="M114 22 Q118 36 120 18" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M126 30 Q128 40 130 28" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />
      </g>);
    case "cabello-corona":
      return (<g>
        {/* Hair base */}
        <path d="M56 100 Q54 50 120 44 Q186 50 184 100 Q178 78 162 72 Q150 86 128 82 Q120 88 112 82 Q90 86 78 72 Q62 78 56 100 Z" fill="#6b4226" stroke="#2d1437" strokeWidth="2" strokeLinejoin="round" />
        {/* Crown */}
        <path d="M64 62 L80 28 L98 54 L120 18 L142 54 L160 28 L176 62 Q148 70 120 70 Q92 70 64 62 Z" fill="url(#crownGrad)" stroke="#854d0e" strokeWidth="2" strokeLinejoin="round" />
        <rect x="64" y="58" width="112" height="10" rx="2.5" fill="#eab308" stroke="#854d0e" strokeWidth="1.5" />
        <rect x="64" y="58" width="112" height="5" rx="2.5" fill="url(#crownShine)" />
        {/* Gems */}
        <circle cx="120" cy="40" r="5.5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.2" />
        <circle cx="92" cy="48" r="4.5" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1.2" />
        <circle cx="148" cy="48" r="4.5" fill="#22c55e" stroke="#14532d" strokeWidth="1.2" />
        <circle cx="120" cy="39" r="1.8" fill="white" opacity="0.95" />
        <circle cx="91" cy="47" r="1.4" fill="white" opacity="0.95" />
        <circle cx="147" cy="47" r="1.4" fill="white" opacity="0.95" />
      </g>);
    case "cabello-gorro-graduacion":
      return (<g>
        {/* Hair base */}
        <path d="M56 100 Q54 50 120 44 Q186 50 184 100 Q178 78 162 72 Q150 86 128 82 Q120 88 112 82 Q90 86 78 72 Q62 78 56 100 Z" fill="#2d1437" stroke="#1a0a22" strokeWidth="2" strokeLinejoin="round" />
        {/* Graduation cap band */}
        <rect x="62" y="52" width="116" height="18" rx="3" fill="#1f1147" stroke="#0d0826" strokeWidth="1.5" />
        {/* Cap top (diamond) */}
        <polygon points="120,16 184,52 120,88 56,52" fill="#1f1147" stroke="#0d0826" strokeWidth="1.5" strokeLinejoin="round" />
        <polygon points="120,16 184,52 120,52 56,52" fill="rgba(255,255,255,0.08)" />
        {/* Button + tassel */}
        <circle cx="120" cy="52" r="3.5" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.2" />
        <path d="M184 52 Q198 58 200 70 Q202 76 197 78" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
        <circle cx="200" cy="74" r="6" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.5" />
        <circle cx="198" cy="72" r="2" fill="rgba(255,255,255,0.7)" />
        <line x1="196" y1="76" x2="194" y2="84" stroke="#ca8a04" strokeWidth="1.2" />
        <line x1="200" y1="77" x2="200" y2="85" stroke="#ca8a04" strokeWidth="1.2" />
        <line x1="204" y1="76" x2="206" y2="84" stroke="#ca8a04" strokeWidth="1.2" />
      </g>);
    default:
      return null;
  }
}

function OjosLayer({ clave }: { clave: string }) {
  switch (clave) {
    case "ojos-felices":
      return (<g stroke="#2d1437" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M82 100 Q94 86 106 100" />
        <path d="M134 100 Q146 86 158 100" />
      </g>);
    case "ojos-grandes":
      return (<g>
        {/* Eye whites */}
        <ellipse cx="94" cy="100" rx="15" ry="18" fill="white" stroke="#2d1437" strokeWidth="2.5" />
        <ellipse cx="146" cy="100" rx="15" ry="18" fill="white" stroke="#2d1437" strokeWidth="2.5" />
        {/* Iris (big) */}
        <ellipse cx="96" cy="103" rx="9" ry="12" fill="url(#irisGrad)" />
        <ellipse cx="148" cy="103" rx="9" ry="12" fill="url(#irisGrad)" />
        {/* Pupil */}
        <circle cx="96" cy="104" r="4" fill="#0a0410" />
        <circle cx="148" cy="104" r="4" fill="#0a0410" />
        {/* Highlights */}
        <circle cx="91" cy="96" r="3.5" fill="white" />
        <circle cx="143" cy="96" r="3.5" fill="white" />
        <circle cx="100" cy="108" r="1.8" fill="white" opacity="0.85" />
        <circle cx="152" cy="108" r="1.8" fill="white" opacity="0.85" />
        {/* Eyelashes */}
        <path d="M82 90 L78 86" stroke="#2d1437" strokeWidth="2" strokeLinecap="round" />
        <path d="M158 90 L162 86" stroke="#2d1437" strokeWidth="2" strokeLinecap="round" />
      </g>);
    case "ojos-corazon":
      return (<g>
        <path d="M94 92 C86 84 76 88 76 98 C76 108 94 120 94 120 C94 120 112 108 112 98 C112 88 102 84 94 92 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.8" />
        <path d="M146 92 C138 84 128 88 128 98 C128 108 146 120 146 120 C146 120 164 108 164 98 C164 88 154 84 146 92 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.8" />
        <circle cx="86" cy="92" r="2" fill="white" opacity="0.95" />
        <circle cx="138" cy="92" r="2" fill="white" opacity="0.95" />
      </g>);
    case "ojos-estrella":
      return (<g>
        <polygon points="94,84 98,96 110,97 100,105 103,118 94,111 85,118 88,105 78,97 90,96" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.8" strokeLinejoin="round" />
        <polygon points="146,84 150,96 162,97 152,105 155,118 146,111 137,118 140,105 130,97 142,96" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="91" cy="92" r="1.8" fill="white" opacity="0.95" />
        <circle cx="143" cy="92" r="1.8" fill="white" opacity="0.95" />
      </g>);
    case "ojos-cerrados":
      return (<g stroke="#2d1437" strokeWidth="3.5" fill="none" strokeLinecap="round">
        <path d="M82 104 Q94 110 106 104" />
        <path d="M134 104 Q146 110 158 104" />
      </g>);
    default: // ojos-normales
      return (<g>
        <ellipse cx="94" cy="100" rx="9" ry="12" fill="white" stroke="#2d1437" strokeWidth="2.5" />
        <ellipse cx="146" cy="100" rx="9" ry="12" fill="white" stroke="#2d1437" strokeWidth="2.5" />
        <ellipse cx="96" cy="102" rx="5.5" ry="7.5" fill="url(#irisGrad)" />
        <ellipse cx="148" cy="102" rx="5.5" ry="7.5" fill="url(#irisGrad)" />
        <circle cx="96" cy="103" r="2.5" fill="#0a0410" />
        <circle cx="148" cy="103" r="2.5" fill="#0a0410" />
        <circle cx="92" cy="97" r="2.5" fill="white" />
        <circle cx="144" cy="97" r="2.5" fill="white" />
        {/* Eyebrows */}
        <path d="M84 86 Q94 82 104 86" fill="none" stroke="#2d1437" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M136 86 Q146 82 156 86" fill="none" stroke="#2d1437" strokeWidth="2.2" strokeLinecap="round" />
      </g>);
  }
}

function BocaLayer({ clave }: { clave: string }) {
  switch (clave) {
    case "boca-gran-sonrisa":
      return (<g>
        <path d="M90 122 Q120 156 150 122 Q120 138 90 122 Z" fill="#7f1d1d" stroke="#2d1437" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M98 124 Q120 140 142 124 L142 127 Q120 143 98 127 Z" fill="white" />
        <path d="M110 138 Q120 148 130 138 Q130 146 120 146 Q110 146 110 138 Z" fill="#fb7185" />
      </g>);
    case "boca-lengua":
      return (<g>
        <path d="M98 122 Q120 134 142 122" fill="none" stroke="#2d1437" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="120" cy="138" rx="9" ry="7" fill="#fb7185" stroke="#2d1437" strokeWidth="1.8" />
        <line x1="120" y1="133" x2="120" y2="142" stroke="#be123c" strokeWidth="1.2" />
      </g>);
    case "boca-serio":
      return <line x1="106" y1="130" x2="134" y2="130" stroke="#2d1437" strokeWidth="3.5" strokeLinecap="round" />;
    default: // boca-sonrisa
      return <path d="M96 122 Q120 144 144 122" fill="none" stroke="#2d1437" strokeWidth="3.5" strokeLinecap="round" />;
  }
}

function AccesorioLayer({ clave }: { clave: string }) {
  switch (clave) {
    case "accesorio-gafas":
      return (<g>
        <circle cx="94" cy="100" r="18" fill="rgba(180,220,255,0.18)" stroke="#2d1437" strokeWidth="3" />
        <circle cx="146" cy="100" r="18" fill="rgba(180,220,255,0.18)" stroke="#2d1437" strokeWidth="3" />
        <path d="M112 100 Q120 94 128 100" fill="none" stroke="#2d1437" strokeWidth="3" />
        <line x1="76" y1="98" x2="66" y2="96" stroke="#2d1437" strokeWidth="3" strokeLinecap="round" />
        <line x1="164" y1="98" x2="174" y2="96" stroke="#2d1437" strokeWidth="3" strokeLinecap="round" />
        <path d="M86 92 Q88 90 90 90" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <path d="M138 92 Q140 90 142 90" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      </g>);
    case "accesorio-gafas-sol":
      return (<g>
        <rect x="76" y="84" width="36" height="28" rx="8" fill="url(#sunGrad)" stroke="#2d1437" strokeWidth="3" />
        <rect x="128" y="84" width="36" height="28" rx="8" fill="url(#sunGrad)" stroke="#2d1437" strokeWidth="3" />
        <path d="M112 92 Q120 86 128 92" fill="none" stroke="#2d1437" strokeWidth="3" />
        <path d="M82 90 L90 90" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M134 90 L142 90" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        {/* Bridge highlight */}
        <path d="M112 96 L128 96" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      </g>);
    case "accesorio-varita":
      return (<g>
        <line x1="178" y1="190" x2="206" y2="128" stroke="#92400e" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="180" y1="188" x2="204" y2="132" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="206,116 210,128 222,130 213,138 216,150 206,143 196,150 199,138 190,130 202,128" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="212" cy="120" r="2" fill="white" />
        <circle cx="198" cy="140" r="1.5" fill="white" />
        <circle cx="218" cy="140" r="1.5" fill="white" />
        <circle cx="188" cy="168" r="2" fill="#fde047" opacity="0.85" />
        <circle cx="198" cy="180" r="1.5" fill="#fde047" opacity="0.75" />
        {/* Sparkle trail */}
        <circle cx="170" cy="160" r="1.5" fill="#fde047" opacity="0.6" />
      </g>);
    case "accesorio-estrella":
      return (<g>
        <polygon points="40,168 46,182 60,184 50,193 53,207 40,199 27,207 30,193 20,184 34,182" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="42" cy="184" r="1.6" fill="#2d1437" />
        <circle cx="49" cy="184" r="1.6" fill="#2d1437" />
        <path d="M42 188 Q46 192 50 188" fill="none" stroke="#2d1437" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="43" cy="178" r="1.2" fill="white" opacity="0.95" />
        <circle cx="22" cy="160" r="1.8" fill="#fde047" opacity="0.75" />
        <circle cx="64" cy="160" r="1.5" fill="#fde047" opacity="0.7" />
      </g>);
    case "accesorio-mascara":
      return (<g fill="#1f1147" stroke="#2d1437" strokeWidth="2.2" strokeLinejoin="round">
        <path d="M68 94 Q68 80 84 80 L110 86 Q120 92 120 100 Q120 110 110 110 L84 104 Q68 104 68 94 Z" />
        <path d="M172 94 Q172 80 156 80 L130 86 Q120 92 120 100 Q120 110 130 110 L156 104 Q172 104 172 94 Z" />
        {/* Eye cutouts */}
        <ellipse cx="94" cy="100" rx="7" ry="9" fill="rgba(255,255,255,0.15)" stroke="none" />
        <ellipse cx="146" cy="100" rx="7" ry="9" fill="rgba(255,255,255,0.15)" stroke="none" />
      </g>);
    default:
      return null;
  }
}

function RopaLayer({ clave }: { clave: string }) {
  if (clave === "ropa-capas") {
    return (<g>
      {/* Cape behind */}
      <path d="M60 184 Q38 210 44 276 L196 276 Q202 210 180 184 Q150 200 120 200 Q90 200 60 184 Z" fill="url(#cloth-ropa-capas)" stroke="#2d1437" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M70 200 Q60 240 64 270" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Inner suit */}
      <path d="M80 184 Q72 210 74 276 L166 276 Q168 210 160 184 Q140 196 120 196 Q100 196 80 184 Z" fill="url(#cloth-ropa-uniforme)" stroke="#2d1437" strokeWidth="2.5" />
      {/* Star emblem */}
      <polygon points="120,210 125,224 140,225 128,234 132,249 120,240 108,249 112,234 100,225 115,224" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.8" strokeLinejoin="round" />
      {/* Belt */}
      <rect x="74" y="250" width="92" height="8" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.5" />
      <rect x="114" y="248" width="12" height="12" rx="2" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.2" />
    </g>);
  }
  if (clave === "ropa-capucha") {
    return (<g>
      {/* Hood drape */}
      <path d="M62 188 Q48 212 52 276 L188 276 Q192 212 178 188 Q150 202 120 202 Q90 202 62 188 Z" fill="url(#cloth-ropa-capucha)" stroke="#2d1437" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Inner shirt */}
      <path d="M82 184 Q74 210 76 276 L164 276 Q166 210 158 184 Q140 196 120 196 Q100 196 82 184 Z" fill="url(#cloth-ropa-capucha)" stroke="#2d1437" strokeWidth="2.5" />
      {/* Hood collar */}
      <path d="M76 188 Q120 200 164 188 L160 200 Q120 212 80 200 Z" fill="rgba(0,0,0,0.18)" />
      {/* Drawstrings */}
      <line x1="110" y1="196" x2="108" y2="224" stroke="#2d1437" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="130" y1="196" x2="132" y2="224" stroke="#2d1437" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="108" cy="228" r="3" fill="#2d1437" />
      <circle cx="132" cy="228" r="3" fill="#2d1437" />
      {/* Pocket */}
      <path d="M92 240 Q120 248 148 240 L146 264 Q120 270 94 264 Z" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinejoin="round" />
      {/* Highlight on shoulder */}
      <path d="M70 196 Q76 220 76 250" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
    </g>);
  }
  if (clave === "ropa-arcoiris") {
    return (<g>
      <path d="M80 184 Q72 210 74 276 L166 276 Q168 210 160 184 Q140 196 120 196 Q100 196 80 184 Z" fill="url(#rainbowGrad)" stroke="#2d1437" strokeWidth="2.5" />
      {/* Collar */}
      <path d="M104 184 L120 200 L136 184" fill="none" stroke="#2d1437" strokeWidth="2.5" strokeLinecap="round" />
      {/* Heart emblem */}
      <path d="M120 230 C112 222 104 226 104 236 C104 246 120 258 120 258 C120 258 136 246 136 236 C136 226 128 222 120 230 Z" fill="white" stroke="#2d1437" strokeWidth="1.8" opacity="0.95" />
      {/* Sparkles */}
      <circle cx="92" cy="220" r="1.8" fill="white" opacity="0.85" />
      <circle cx="150" cy="225" r="1.5" fill="white" opacity="0.85" />
      <circle cx="148" cy="258" r="1.5" fill="white" opacity="0.7" />
    </g>);
  }
  if (clave === "ropa-uniforme") {
    return (<g>
      <path d="M80 184 Q72 210 74 276 L166 276 Q168 210 160 184 Q140 196 120 196 Q100 196 80 184 Z" fill="url(#cloth-ropa-uniforme)" stroke="#2d1437" strokeWidth="2.5" />
      {/* White collar */}
      <path d="M104 184 L120 204 L136 184 L130 182 L120 196 L110 182 Z" fill="white" stroke="#2d1437" strokeWidth="1.8" strokeLinejoin="round" />
      {/* Red tie */}
      <path d="M114 200 L126 200 L130 216 L126 244 L120 252 L114 244 L110 216 Z" fill="#dc2626" stroke="#2d1437" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="118" y1="208" x2="122" y2="208" stroke="#7f1d1d" strokeWidth="1" />
      {/* Buttons */}
      <circle cx="120" cy="262" r="2.2" fill="#fbbf24" stroke="#854d0e" strokeWidth="0.8" />
      <circle cx="120" cy="272" r="2.2" fill="#fbbf24" stroke="#854d0e" strokeWidth="0.8" />
      {/* Shoulder highlight */}
      <path d="M84 196 Q80 220 80 250" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" strokeLinecap="round" />
    </g>);
  }
  // ropa-basica (default)
  return (<g>
    <path d="M80 184 Q72 210 74 276 L166 276 Q168 210 160 184 Q140 196 120 196 Q100 196 80 184 Z" fill="url(#cloth-ropa-basica)" stroke="#2d1437" strokeWidth="2.5" />
    {/* Collar V */}
    <path d="M104 184 L120 200 L136 184" fill="none" stroke="#2d1437" strokeWidth="2.2" strokeLinecap="round" />
    {/* Stripe pattern */}
    <path d="M76 230 Q120 240 164 230" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
    <path d="M74 252 Q120 262 166 252" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" strokeLinecap="round" />
    {/* Shoulder highlight */}
    <path d="M84 196 Q80 220 80 250" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
    {/* Small star emblem */}
    <polygon points="120,222 123,230 131,231 125,236 127,244 120,240 113,244 115,236 109,231 117,230" fill="#fde047" stroke="#854d0e" strokeWidth="1.2" strokeLinejoin="round" opacity="0.95" />
  </g>);
}
