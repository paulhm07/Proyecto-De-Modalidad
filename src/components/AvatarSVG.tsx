"use client";
import type { AvatarConfig } from "@/lib/types";

interface AvatarSVGProps {
  config?: Pick<AvatarConfig, "cuerpo" | "ojos" | "boca" | "cabello" | "ropa" | "accesorio"> | null;
  size?: number;
  className?: string;
}

const CUERPO_GRADIENTS: Record<string, { light: string; mid: string; dark: string; cheek: string; shadow: string }> = {
  "cuerpo-claro": { light: "#fff0dc", mid: "#ffd9a8", dark: "#e0a878", cheek: "#ff8fa3", shadow: "#b87b4e" },
  "cuerpo-medio": { light: "#f4cb95", mid: "#d99a5e", dark: "#b5763f", cheek: "#c64a5e", shadow: "#8a5226" },
  "cuerpo-oscuro": { light: "#c9854f", mid: "#a35e30", dark: "#7a4422", cheek: "#5e2a35", shadow: "#4a2a16" },
  "cuerpo-verde": { light: "#d4f9b0", mid: "#9ee070", dark: "#6bb842", cheek: "#3a8a4a", shadow: "#3a7a2a" },
};
const ROPA_COLORS: Record<string, { light: string; dark: string }> = {
  "ropa-basica": { light: "#2dd4bf", dark: "#0d9488" },
  "ropa-uniforme": { light: "#3b4d7a", dark: "#1e293b" },
  "ropa-capucha": { light: "#9ca3af", dark: "#4b5563" },
  "ropa-capas": { light: "#ef4444", dark: "#991b1b" },
  "ropa-arcoiris": { light: "url(#rainbowGrad)", dark: "url(#rainbowGrad)" },
};

export function AvatarSVG({ config, size = 200, className = "" }: AvatarSVGProps) {
  const c = config ?? ({} as AvatarConfig);
  const cuerpoKey = c.cuerpo ?? "cuerpo-claro";
  const grad = CUERPO_GRADIENTS[cuerpoKey] ?? CUERPO_GRADIENTS["cuerpo-claro"];
  const gradId = `skin-${cuerpoKey}`;
  const ropaKey = c.ropa ?? "ropa-basica";

  return (
    <svg width={size} height={size} viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Avatar del estudiante">
      <defs>
        {/* 3D skin gradient: bright top-left → mid → dark bottom-right */}
        <radialGradient id={gradId} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor={grad.light} />
          <stop offset="45%" stopColor={grad.mid} />
          <stop offset="100%" stopColor={grad.dark} />
        </radialGradient>
        {/* Specular highlight for the head (glossy clay look) */}
        <radialGradient id={`gloss-${cuerpoKey}`} cx="30%" cy="20%" r="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        {/* Rim light (right edge backlight) */}
        <radialGradient id={`rim-${cuerpoKey}`} cx="78%" cy="55%" r="45%">
          <stop offset="0%" stopColor="rgba(255,235,200,0)" />
          <stop offset="75%" stopColor="rgba(255,235,200,0)" />
          <stop offset="92%" stopColor="rgba(255,225,180,0.45)" />
          <stop offset="100%" stopColor="rgba(255,225,180,0)" />
        </radialGradient>
        <linearGradient id="grad-ropa-basica" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={ROPA_COLORS["ropa-basica"].light} /><stop offset="100%" stopColor={ROPA_COLORS["ropa-basica"].dark} /></linearGradient>
        <linearGradient id="grad-ropa-uniforme" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={ROPA_COLORS["ropa-uniforme"].light} /><stop offset="100%" stopColor={ROPA_COLORS["ropa-uniforme"].dark} /></linearGradient>
        <linearGradient id="grad-ropa-capucha" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={ROPA_COLORS["ropa-capucha"].light} /><stop offset="100%" stopColor={ROPA_COLORS["ropa-capucha"].dark} /></linearGradient>
        <linearGradient id="grad-ropa-capas" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor={ROPA_COLORS["ropa-capas"].light} /><stop offset="100%" stopColor={ROPA_COLORS["ropa-capas"].dark} /></linearGradient>
        <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" /><stop offset="20%" stopColor="#f97316" /><stop offset="40%" stopColor="#facc15" />
          <stop offset="60%" stopColor="#22c55e" /><stop offset="80%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        {/* Soft ground shadow */}
        <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="rgba(30,15,40,0.32)" /><stop offset="70%" stopColor="rgba(30,15,40,0.12)" /><stop offset="100%" stopColor="rgba(30,15,40,0)" /></radialGradient>
        {/* Neck shadow (casts from head onto neck) */}
        <linearGradient id="neckShadow" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="rgba(0,0,0,0.35)" /><stop offset="100%" stopColor="rgba(0,0,0,0)" /></linearGradient>
        <radialGradient id="irisGrad" cx="50%" cy="38%" r="62%"><stop offset="0%" stopColor="#7a3a8e" /><stop offset="70%" stopColor="#3d1a4a" /><stop offset="100%" stopColor="#1a0a22" /></radialGradient>
        <radialGradient id="bodyShadow" cx="50%" cy="0%" r="70%"><stop offset="0%" stopColor="rgba(0,0,0,0.22)" /><stop offset="100%" stopColor="rgba(0,0,0,0)" /></radialGradient>
      </defs>

      {/* ===== Ground shadow ===== */}
      <ellipse cx="100" cy="210" rx="58" ry="9" fill="url(#shadowGrad)" />

      {/* ===== Back hair (behind body) ===== */}
      <CabelloBackLayer clave={c.cabello ?? "cabello-nada"} grad={grad} />

      {/* ===== Neck ===== */}
      <path d="M84 128 L84 156 Q84 164 92 166 L108 166 Q116 164 116 156 L116 128 Z" fill={`url(#${gradId})`} />
      {/* Neck shadow from head */}
      <path d="M84 128 L84 142 Q100 152 116 142 L116 128 Z" fill="url(#neckShadow)" />
      {/* Neck highlight */}
      <path d="M88 130 L88 150" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />

      {/* ===== Shoulders / torso silhouette (gives 3D body under clothes) ===== */}
      <path d="M44 220 Q44 178 72 164 L128 164 Q156 178 156 220 Z" fill={`url(#${gradId})`} stroke={grad.shadow} strokeWidth="1.5" />
      {/* Torso shadow (depth under chin) */}
      <path d="M44 220 Q44 178 72 164 L128 164 Q156 178 156 220 Z" fill="url(#bodyShadow)" />

      {/* ===== Clothing (on top of torso) ===== */}
      <RopaLayer clave={ropaKey} />

      {/* ===== Head (3D sphere) ===== */}
      <circle cx="100" cy="86" r="58" fill={`url(#${gradId})`} stroke={grad.shadow} strokeWidth="2" />
      {/* Rim light on right edge */}
      <circle cx="100" cy="86" r="58" fill={`url(#rim-${cuerpoKey})`} />
      {/* Specular gloss on top-left */}
      <circle cx="100" cy="86" r="58" fill={`url(#gloss-${cuerpoKey})`} />

      {/* Cheeks (soft blush, 3D placement) */}
      <ellipse cx="64" cy="100" rx="10" ry="6.5" fill={grad.cheek} opacity="0.5" />
      <ellipse cx="136" cy="100" rx="10" ry="6.5" fill={grad.cheek} opacity="0.5" />
      {/* Cheek gloss */}
      <ellipse cx="62" cy="97" rx="4" ry="2" fill="rgba(255,255,255,0.4)" />
      <ellipse cx="134" cy="97" rx="4" ry="2" fill="rgba(255,255,255,0.4)" />

      {/* ===== Front hair ===== */}
      <CabelloFrontLayer clave={c.cabello ?? "cabello-nada"} />

      {/* ===== Face features ===== */}
      <OjosLayer clave={c.ojos ?? "ojos-normales"} />
      <BocaLayer clave={c.boca ?? "boca-sonrisa"} />

      {/* ===== Accessories (front-most) ===== */}
      <AccesorioLayer clave={c.accesorio ?? "accesorio-nada"} />

      {/* ===== Subtle outline for claymorphism pop ===== */}
      <circle cx="100" cy="86" r="58" fill="none" stroke="rgba(45,20,55,0.18)" strokeWidth="1" />
    </svg>
  );
}

function CabelloBackLayer({ clave, grad }: { clave: string; grad: typeof CUERPO_GRADIENTS[string] }) {
  switch (clave) {
    case "cabello-largo": return (<g><path d="M44 95 Q42 140 50 165 L62 165 Q56 140 58 100 Z" fill="#3a2515" stroke="#2d1437" strokeWidth="1.5" /><path d="M156 95 Q158 140 150 165 L138 165 Q144 140 142 100 Z" fill="#3a2515" stroke="#2d1437" strokeWidth="1.5" /><path d="M46 100 Q44 130 50 150" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" /><path d="M154 100 Q156 130 150 150" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" /></g>);
    default: return null;
  }
}

function CabelloFrontLayer({ clave }: { clave: string }) {
  switch (clave) {
    case "cabello-corto": return (<g><path d="M44 88 Q44 42 100 38 Q156 42 156 88 Q152 70 138 64 Q130 78 110 76 Q100 80 90 76 Q70 78 62 64 Q48 70 44 88 Z" fill="#5a3a25" stroke="#2d1437" strokeWidth="2" /><path d="M70 52 Q90 44 110 50" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" /><path d="M48 84 Q46 60 60 50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" /></g>);
    case "cabello-largo": return (<g><path d="M42 92 Q42 38 100 34 Q158 38 158 92 Q154 66 138 58 Q128 74 110 72 Q100 76 90 72 Q72 74 62 58 Q46 66 42 92 Z" fill="#4a2c1a" stroke="#2d1437" strokeWidth="2" /><path d="M68 50 Q90 42 112 48" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" /><path d="M46 86 Q44 58 62 46" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round" /></g>);
    case "cabello-mohawk": return (<g><defs><linearGradient id="mohawkGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fbbf24" /><stop offset="50%" stopColor="#f97316" /><stop offset="100%" stopColor="#dc2626" /></linearGradient></defs><path d="M88 60 Q90 22 100 14 Q110 22 112 60 L108 62 L104 58 L100 62 L96 58 L92 62 Z" fill="url(#mohawkGrad)" stroke="#2d1437" strokeWidth="2" /><path d="M52 86 Q50 70 58 64 L62 80 Z" fill="#3a2515" stroke="#2d1437" strokeWidth="1.5" /><path d="M148 86 Q150 70 142 64 L138 80 Z" fill="#3a2515" stroke="#2d1437" strokeWidth="1.5" /><path d="M96 20 Q98 30 100 18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" /></g>);
    case "cabello-corona": return (<g><defs><linearGradient id="crownGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fde047" /><stop offset="100%" stopColor="#ca8a04" /></linearGradient><linearGradient id="crownShine" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="rgba(255,255,255,0)" /><stop offset="50%" stopColor="rgba(255,255,255,0.6)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" /></linearGradient></defs><path d="M58 54 L72 24 L88 46 L100 18 L112 46 L128 24 L142 54 Q120 60 100 60 Q80 60 58 54 Z" fill="url(#crownGrad)" stroke="#854d0e" strokeWidth="2" strokeLinejoin="round" /><rect x="58" y="50" width="84" height="8" rx="2" fill="#eab308" stroke="#854d0e" strokeWidth="1.5" /><rect x="58" y="50" width="84" height="4" rx="2" fill="url(#crownShine)" /><circle cx="100" cy="34" r="4.5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" /><circle cx="78" cy="40" r="3.5" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1" /><circle cx="122" cy="40" r="3.5" fill="#22c55e" stroke="#14532d" strokeWidth="1" /><circle cx="100" cy="33" r="1.4" fill="white" opacity="0.9" /><circle cx="78" cy="39" r="1.1" fill="white" opacity="0.9" /><circle cx="122" cy="39" r="1.1" fill="white" opacity="0.9" /></g>);
    case "cabello-gorro-graduacion": return (<g><rect x="56" y="46" width="88" height="16" rx="3" fill="#1f1147" stroke="#0d0826" strokeWidth="1.5" /><polygon points="100,18 158,46 100,74 42,46" fill="#1f1147" stroke="#0d0826" strokeWidth="1.5" strokeLinejoin="round" /><polygon points="100,18 158,46 100,46 42,46" fill="rgba(255,255,255,0.08)" /><circle cx="100" cy="46" r="3" fill="#fbbf24" stroke="#854d0e" strokeWidth="1" /><path d="M156 46 Q168 50 170 60 Q172 64 168 66" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" /><circle cx="170" cy="64" r="5" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.5" /><circle cx="168" cy="62" r="1.5" fill="rgba(255,255,255,0.6)" /><line x1="167" y1="66" x2="165" y2="72" stroke="#ca8a04" strokeWidth="1" /><line x1="170" y1="67" x2="170" y2="74" stroke="#ca8a04" strokeWidth="1" /><line x1="173" y1="66" x2="175" y2="72" stroke="#ca8a04" strokeWidth="1" /></g>);
    default: return null;
  }
}

function OjosLayer({ clave }: { clave: string }) {
  switch (clave) {
    case "ojos-felices": return (<g stroke="#2d1437" strokeWidth="3.5" fill="none" strokeLinecap="round"><path d="M70 88 Q78 78 86 88" /><path d="M114 88 Q122 78 130 88" /></g>);
    case "ojos-grandes": return (<g><ellipse cx="78" cy="88" rx="12" ry="14" fill="white" stroke="#2d1437" strokeWidth="2.5" /><ellipse cx="122" cy="88" rx="12" ry="14" fill="white" stroke="#2d1437" strokeWidth="2.5" /><ellipse cx="80" cy="90" rx="7" ry="9" fill="url(#irisGrad)" /><ellipse cx="124" cy="90" rx="7" ry="9" fill="url(#irisGrad)" /><circle cx="76" cy="85" r="3" fill="white" /><circle cx="120" cy="85" r="3" fill="white" /><circle cx="83" cy="94" r="1.5" fill="white" opacity="0.8" /><circle cx="127" cy="94" r="1.5" fill="white" opacity="0.8" /></g>);
    case "ojos-corazon": return (<g><path d="M78 80 C73 74 66 76 66 82 C66 88 78 96 78 96 C78 96 90 88 90 82 C90 76 83 74 78 80 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" /><path d="M122 80 C117 74 110 76 110 82 C110 88 122 96 122 96 C122 96 134 88 134 82 C134 76 127 74 122 80 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" /><circle cx="73" cy="80" r="1.6" fill="white" opacity="0.9" /><circle cx="117" cy="80" r="1.6" fill="white" opacity="0.9" /></g>);
    case "ojos-estrella": return (<g><polygon points="78,74 81,82 89,83 83,89 85,97 78,93 71,97 73,89 67,83 75,82" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.5" strokeLinejoin="round" /><polygon points="122,74 125,82 133,83 127,89 129,97 122,93 115,97 117,89 111,83 119,82" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="76" cy="79" r="1.4" fill="white" opacity="0.9" /><circle cx="120" cy="79" r="1.4" fill="white" opacity="0.9" /></g>);
    case "ojos-cerrados": return (<g stroke="#2d1437" strokeWidth="3" fill="none" strokeLinecap="round"><path d="M70 90 Q78 94 86 90" /><path d="M114 90 Q122 94 130 90" /></g>);
    default: return (<g><ellipse cx="78" cy="88" rx="7" ry="9" fill="white" stroke="#2d1437" strokeWidth="2.2" /><ellipse cx="122" cy="88" rx="7" ry="9" fill="white" stroke="#2d1437" strokeWidth="2.2" /><ellipse cx="80" cy="90" rx="4" ry="5.5" fill="url(#irisGrad)" /><ellipse cx="124" cy="90" rx="4" ry="5.5" fill="url(#irisGrad)" /><circle cx="77" cy="86" r="2" fill="white" /><circle cx="121" cy="86" r="2" fill="white" /><circle cx="82" cy="92" r="1" fill="white" opacity="0.7" /><circle cx="126" cy="92" r="1" fill="white" opacity="0.7" /></g>);
  }
}

function BocaLayer({ clave }: { clave: string }) {
  switch (clave) {
    case "boca-gran-sonrisa": return (<g><path d="M76 106 Q100 132 124 106 Q100 118 76 106 Z" fill="#7f1d1d" stroke="#2d1437" strokeWidth="2" strokeLinejoin="round" /><path d="M82 108 Q100 120 118 108 L118 110 Q100 122 82 110 Z" fill="white" /><path d="M92 118 Q100 126 108 118 Q108 124 100 124 Q92 124 92 118 Z" fill="#fb7185" /></g>);
    case "boca-lengua": return (<g><path d="M84 106 Q100 116 116 106" fill="none" stroke="#2d1437" strokeWidth="2.8" strokeLinecap="round" /><ellipse cx="100" cy="118" rx="7" ry="6" fill="#fb7185" stroke="#2d1437" strokeWidth="1.5" /><line x1="100" y1="114" x2="100" y2="121" stroke="#be123c" strokeWidth="1" /></g>);
    case "boca-serio": return <line x1="90" y1="112" x2="110" y2="112" stroke="#2d1437" strokeWidth="3" strokeLinecap="round" />;
    default: return <path d="M82 106 Q100 122 118 106" fill="none" stroke="#2d1437" strokeWidth="3" strokeLinecap="round" />;
  }
}

function AccesorioLayer({ clave }: { clave: string }) {
  switch (clave) {
    case "accesorio-gafas": return (<g><circle cx="78" cy="88" r="14" fill="rgba(255,255,255,0.2)" stroke="#2d1437" strokeWidth="2.5" /><circle cx="122" cy="88" r="14" fill="rgba(255,255,255,0.2)" stroke="#2d1437" strokeWidth="2.5" /><path d="M92 88 Q100 84 108 88" fill="none" stroke="#2d1437" strokeWidth="2.5" /><line x1="64" y1="86" x2="56" y2="84" stroke="#2d1437" strokeWidth="2.5" strokeLinecap="round" /><line x1="136" y1="86" x2="144" y2="84" stroke="#2d1437" strokeWidth="2.5" strokeLinecap="round" /><path d="M72 82 Q74 80 76 80" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" /><path d="M116 82 Q118 80 120 80" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" /></g>);
    case "accesorio-gafas-sol": return (<g><defs><linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#312e81" /><stop offset="100%" stopColor="#0d0826" /></linearGradient></defs><rect x="64" y="76" width="28" height="22" rx="6" fill="url(#sunGrad)" stroke="#2d1437" strokeWidth="2.5" /><rect x="108" y="76" width="28" height="22" rx="6" fill="url(#sunGrad)" stroke="#2d1437" strokeWidth="2.5" /><path d="M92 84 Q100 80 108 84" fill="none" stroke="#2d1437" strokeWidth="2.5" /><path d="M68 80 L74 80" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" /><path d="M112 80 L118 80" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" /></g>);
    case "accesorio-varita": return (<g><line x1="148" y1="160" x2="172" y2="108" stroke="#92400e" strokeWidth="3.5" strokeLinecap="round" /><polygon points="172,98 175,108 185,109 177,116 180,126 172,120 164,126 167,116 159,109 169,108" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="178" cy="100" r="1.5" fill="white" /><circle cx="166" cy="118" r="1" fill="white" /><circle cx="184" cy="118" r="1" fill="white" /><circle cx="158" cy="140" r="1.5" fill="#fde047" opacity="0.8" /><circle cx="166" cy="150" r="1" fill="#fde047" opacity="0.7" /></g>);
    case "accesorio-estrella": return (<g><polygon points="38,140 42,150 52,151 44,158 47,168 38,162 29,168 32,158 24,151 34,150" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="35" cy="151" r="1.2" fill="#2d1437" /><circle cx="41" cy="151" r="1.2" fill="#2d1437" /><path d="M35 154 Q38 157 41 154" fill="none" stroke="#2d1437" strokeWidth="1" strokeLinecap="round" /><circle cx="36" cy="146" r="0.8" fill="white" opacity="0.9" /><circle cx="20" cy="135" r="1.2" fill="#fde047" opacity="0.7" /><circle cx="54" cy="135" r="1" fill="#fde047" opacity="0.7" /></g>);
    case "accesorio-mascara": return (<g fill="#1f1147" stroke="#2d1437" strokeWidth="2" strokeLinejoin="round"><path d="M58 80 Q58 70 70 70 L92 74 Q100 78 100 84 Q100 90 92 90 L70 86 Q58 86 58 80 Z" /><path d="M142 80 Q142 70 130 70 L108 74 Q100 78 100 84 Q100 90 108 90 L130 86 Q142 86 142 80 Z" /></g>);
    default: return null;
  }
}

function RopaLayer({ clave }: { clave: string }) {
  if (clave === "ropa-capas") return (<g><path d="M48 150 Q32 168 38 192 L162 192 Q168 168 152 150 Q130 162 100 162 Q70 162 48 150 Z" fill="url(#grad-ropa-capas)" stroke="#2d1437" strokeWidth="2.5" strokeLinejoin="round" /><path d="M62 138 Q54 158 56 178 L144 178 Q146 158 138 138 Q120 148 100 148 Q80 148 62 138 Z" fill="url(#grad-ropa-uniforme)" stroke="#2d1437" strokeWidth="2.5" /><polygon points="100,154 108,162 100,170 92,162" fill="#fbbf24" stroke="#854d0e" strokeWidth="1.5" /><polygon points="100,158 103,162 100,166 97,162" fill="#dc2626" /></g>);
  if (clave === "ropa-capucha") return (<g><path d="M50 145 Q40 165 44 188 L156 188 Q160 165 150 145 Q130 156 100 156 Q70 156 50 145 Z" fill="url(#grad-ropa-capucha)" stroke="#2d1437" strokeWidth="2.5" strokeLinejoin="round" /><path d="M60 138 Q52 158 54 178 L146 178 Q148 158 140 138 Q120 148 100 148 Q80 148 60 138 Z" fill="url(#grad-ropa-capucha)" stroke="#2d1437" strokeWidth="2.5" /><line x1="92" y1="152" x2="90" y2="172" stroke="#2d1437" strokeWidth="2.2" strokeLinecap="round" /><line x1="108" y1="152" x2="110" y2="172" stroke="#2d1437" strokeWidth="2.2" strokeLinecap="round" /><circle cx="90" cy="173" r="2.2" fill="#2d1437" /><circle cx="110" cy="173" r="2.2" fill="#2d1437" /><path d="M75 168 Q100 174 125 168 L122 178 L78 178 Z" fill="none" stroke="#2d1437" strokeWidth="1.8" opacity="0.6" /></g>);
  if (clave === "ropa-arcoiris") return (<g><path d="M62 138 Q54 158 56 178 L144 178 Q146 158 138 138 Q120 148 100 148 Q80 148 62 138 Z" fill="url(#rainbowGrad)" stroke="#2d1437" strokeWidth="2.5" /><path d="M90 138 L100 152 L110 138" fill="none" stroke="#2d1437" strokeWidth="2" /><path d="M100 162 C96 158 92 160 92 164 C92 168 100 174 100 174 C100 174 108 168 108 164 C108 160 104 158 100 162 Z" fill="white" stroke="#2d1437" strokeWidth="1.5" opacity="0.9" /></g>);
  if (clave === "ropa-uniforme") return (<g><path d="M62 138 Q54 158 56 178 L144 178 Q146 158 138 138 Q120 148 100 148 Q80 148 62 138 Z" fill="url(#grad-ropa-uniforme)" stroke="#2d1437" strokeWidth="2.5" /><path d="M88 138 L100 154 L112 138 L108 136 L100 148 L92 136 Z" fill="white" stroke="#2d1437" strokeWidth="1.5" /><path d="M96 148 L104 148 L106 158 L104 174 L100 178 L96 174 L94 158 Z" fill="#dc2626" stroke="#2d1437" strokeWidth="1.5" /></g>);
  return (<g><path d="M62 138 Q54 158 56 178 L144 178 Q146 158 138 138 Q120 148 100 148 Q80 148 62 138 Z" fill="url(#grad-ropa-basica)" stroke="#2d1437" strokeWidth="2.5" /><path d="M90 138 L100 152 L110 138" fill="none" stroke="#2d1437" strokeWidth="2" strokeLinecap="round" /><path d="M68 165 Q100 172 132 165" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round" /></g>);
}
