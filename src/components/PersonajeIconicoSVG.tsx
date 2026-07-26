"use client";

interface PersonajeIconicoSVGProps {
  personajeId: string;
  size?: number;
  className?: string;
}

/**
 * Renderiza personajes icónicos en estilo bloque 3D Roblox/Minecraft.
 * Cada personaje tiene un cuerpo base humanoide (cabeza cúbica, torso, extremidades)
 * con colores y detalles distintivos.
 *
 * Personajes: Goku, Naruto, Pikachu, Eren, Mario, Master Chief, Sora,
 * Spider-Man, Batman, Luke, Eleven, Mickey.
 */
export function PersonajeIconicoSVG({ personajeId, size = 200, className = "" }: PersonajeIconicoSVGProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={`Personaje ${personajeId}`}
    >
      <defs>
        <radialGradient id="ps-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Sombra del piso */}
      <ellipse cx="100" cy="228" rx="52" ry="9" fill="url(#ps-shadow)" />
      {/* Render del personaje específico */}
      {renderPersonaje(personajeId)}
    </svg>
  );
}

function renderPersonaje(id: string) {
  switch (id) {
    case "goku": return <GokuSVG />;
    case "naruto": return <NarutoSVG />;
    case "pikachu": return <PikachuSVG />;
    case "eren": return <ErenSVG />;
    case "mario": return <MarioSVG />;
    case "master-chief": return <MasterChiefSVG />;
    case "sora": return <SoraSVG />;
    case "spiderman": return <SpiderManSVG />;
    case "batman": return <BatmanSVG />;
    case "luke": return <LukeSVG />;
    case "eleven": return <ElevenSVG />;
    case "mickey": return <MickeySVG />;
    default: return <GokuSVG />;
  }
}

// ===== Cuerpo base reutilizable (piernas, brazos, torso) =====
function CuerpoBase({
  pielTop = "#ffe0bd", pielSide = "#f5c08c", pielBottom = "#d99a5e",
  piernaColor = "#1e293b", piernaDark = "#0f172a",
  brazoLado = "#f5c08c",
}: {
  pielTop?: string; pielSide?: string; pielBottom?: string;
  piernaColor?: string; piernaDark?: string; brazoLado?: string;
}) {
  return (
    <g>
      {/* Piernas */}
      <rect x="78" y="168" width="20" height="48" rx="3" fill={piernaColor} />
      <rect x="78" y="168" width="6" height="48" rx="2" fill={piernaDark} opacity="0.6" />
      <rect x="102" y="168" width="20" height="48" rx="3" fill={piernaColor} />
      <rect x="116" y="168" width="6" height="48" rx="2" fill={piernaDark} opacity="0.6" />
      {/* Zapatos */}
      <rect x="76" y="208" width="24" height="10" rx="2" fill="#1e293b" />
      <rect x="100" y="208" width="24" height="10" rx="2" fill="#1e293b" />
      {/* Brazos */}
      <rect x="48" y="118" width="22" height="52" rx="4" fill={brazoLado} />
      <rect x="48" y="166" width="22" height="10" rx="3" fill={pielTop} />
      <rect x="130" y="118" width="22" height="52" rx="4" fill={brazoLado} />
      <rect x="130" y="166" width="22" height="10" rx="3" fill={pielTop} />
      {/* Cuello */}
      <rect x="90" y="104" width="20" height="14" rx="2" fill={pielSide} />
    </g>
  );
}

// ===== Cabeza base reutilizable =====
function CabezaBase({
  pielTop = "#ffe0bd", pielSide = "#f5c08c", pielBottom = "#d99a5e",
  ojos, boca,
}: {
  pielTop?: string; pielSide?: string; pielBottom?: string;
  ojos?: React.ReactNode; boca?: React.ReactNode;
}) {
  return (
    <g>
      <rect x="60" y="40" width="80" height="70" rx="6" fill={pielSide} stroke={pielBottom} strokeWidth="1.2" />
      <rect x="60" y="40" width="80" height="6" rx="3" fill={pielTop} opacity="0.6" />
      <rect x="134" y="46" width="6" height="64" rx="2" fill={pielBottom} opacity="0.4" />
      {/* Orejas */}
      <rect x="54" y="68" width="8" height="14" rx="3" fill={pielSide} />
      <rect x="138" y="68" width="8" height="14" rx="3" fill={pielSide} />
      {ojos}
      {boca}
    </g>
  );
}

// ============================================================
// GOKU - Dragon Ball (gi naranja, pelo negro erizado)
// ============================================================
function GokuSVG() {
  return (
    <g>
      <CuerpoBase pielSide="#f5c08c" pielBottom="#d99a5e" piernaColor="#3b82f6" piernaDark="#1e40af" brazoLado="#f5c08c" />
      {/* Gi naranja (torso) */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
      {/* Camiseta azul interior */}
      <path d="M 88 116 L 100 132 L 112 116 Z" fill="#1e40af" />
      {/* Cinturón azul */}
      <rect x="70" y="158" width="60" height="8" rx="2" fill="#1e40af" />
      <rect x="96" y="158" width="8" height="8" fill="#3b82f6" />
      {/* Muñequeras */}
      <rect x="48" y="160" width="22" height="6" rx="2" fill="#1e40af" />
      <rect x="130" y="160" width="22" height="6" rx="2" fill="#1e40af" />
      {/* Cabeza */}
      <CabezaBase
        pielSide="#f5c08c"
        pielBottom="#d99a5e"
        ojos={
          <>
            <ellipse cx="82" cy="78" rx="7" ry="9" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <ellipse cx="118" cy="78" rx="7" ry="9" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="83" cy="80" r="4" fill="#1e293b" />
            <circle cx="119" cy="80" r="4" fill="#1e293b" />
            <circle cx="84" cy="77" r="1.5" fill="#ffffff" />
            <circle cx="120" cy="77" r="1.5" fill="#ffffff" />
          </>
        }
        boca={<path d="M 86 96 L 114 96" stroke="#7a4422" strokeWidth="2.8" strokeLinecap="round" fill="none" />}
      />
      {/* Pelo erizado negro (estilo Goku) */}
      <g fill="#1e293b" stroke="#0f172a" strokeWidth="1">
        <path d="M 58 46 Q 56 20 72 30 Q 70 14 84 26 Q 82 10 96 24 Q 100 8 104 24 Q 118 10 116 26 Q 130 14 128 30 Q 144 20 142 46 L 142 52 Q 100 46 58 52 Z" />
        {/* Picos adicionales */}
        <path d="M 68 30 L 64 14 L 74 26 Z" />
        <path d="M 84 26 L 82 8 L 92 22 Z" />
        <path d="M 100 24 L 100 4 L 108 22 Z" />
        <path d="M 116 26 L 118 8 L 110 22 Z" />
        <path d="M 132 30 L 136 14 L 126 26 Z" />
      </g>
    </g>
  );
}

// ============================================================
// NARUTO - rubio erizado, traje naranja, headband
// ============================================================
function NarutoSVG() {
  return (
    <g>
      <CuerpoBase pielSide="#f5c08c" pielBottom="#d99a5e" piernaColor="#f97316" piernaDark="#c2410c" brazoLado="#f5c08c" />
      {/* Traje naranja con negro */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
      {/* Bandas negras en hombros */}
      <rect x="70" y="116" width="60" height="8" rx="2" fill="#1e293b" />
      {/* Cremallera central */}
      <line x1="100" y1="124" x2="100" y2="170" stroke="#1e293b" strokeWidth="2" />
      {/* Cinturón */}
      <rect x="70" y="158" width="60" height="8" rx="2" fill="#1e293b" />
      {/* Cabeza */}
      <CabezaBase
        pielSide="#f5c08c"
        pielBottom="#d99a5e"
        ojos={
          <>
            <ellipse cx="82" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <ellipse cx="118" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="83" cy="79" r="3.5" fill="#1e40af" />
            <circle cx="119" cy="79" r="3.5" fill="#1e40af" />
            <circle cx="84" cy="77" r="1.3" fill="#ffffff" />
            <circle cx="120" cy="77" r="1.3" fill="#ffffff" />
            {/* Marca de bigote de zorro */}
            <path d="M 72 88 L 78 86 M 74 92 L 78 90" stroke="#1e293b" strokeWidth="1" />
            <path d="M 128 88 L 122 86 M 126 92 L 122 90" stroke="#1e293b" strokeWidth="1" />
          </>
        }
        boca={<path d="M 88 94 Q 100 100 112 94" stroke="#7a4422" strokeWidth="2.5" strokeLinecap="round" fill="none" />}
      />
      {/* Pelo rubio erizado */}
      <g fill="#fbbf24" stroke="#d97706" strokeWidth="1">
        <path d="M 58 46 Q 60 22 100 20 Q 140 22 142 46 L 142 50 Q 100 44 58 50 Z" />
        <path d="M 66 30 L 60 12 L 74 28 Z" />
        <path d="M 80 24 L 78 6 L 90 22 Z" />
        <path d="M 100 20 L 100 2 L 108 20 Z" />
        <path d="M 120 24 L 122 6 L 110 22 Z" />
        <path d="M 134 30 L 140 12 L 126 28 Z" />
      </g>
      {/* Headband (banda ninja) con placa metálica */}
      <rect x="58" y="50" width="84" height="10" rx="2" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1" />
      <rect x="86" y="51" width="28" height="8" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.8" />
      {/* Símbolo espiral */}
      <path d="M 100 55 Q 96 53 96 57 Q 96 60 100 58 Q 102 57 101 55" fill="none" stroke="#1e293b" strokeWidth="1.2" />
    </g>
  );
}

// ============================================================
// PIKACHU - amarillo, mejillas rojas, orejas puntiagudas
// ============================================================
function PikachuSVG() {
  return (
    <g>
      {/* Cuerpo amarillo (sin piernas separadas, cuerpo compacto) */}
      <rect x="78" y="168" width="20" height="48" rx="3" fill="#facc15" />
      <rect x="102" y="168" width="20" height="48" rx="3" fill="#facc15" />
      <rect x="78" y="168" width="6" height="48" rx="2" fill="#ca8a04" opacity="0.5" />
      <rect x="116" y="168" width="6" height="48" rx="2" fill="#ca8a04" opacity="0.5" />
      {/* Zapatos marrones */}
      <rect x="74" y="208" width="28" height="10" rx="3" fill="#78350f" />
      <rect x="98" y="208" width="28" height="10" rx="3" fill="#78350f" />
      {/* Brazos amarillos */}
      <rect x="48" y="118" width="22" height="52" rx="4" fill="#facc15" />
      <rect x="130" y="118" width="22" height="52" rx="4" fill="#facc15" />
      <rect x="48" y="166" width="22" height="10" rx="3" fill="#fde047" />
      <rect x="130" y="166" width="22" height="10" rx="3" fill="#fde047" />
      {/* Torso amarillo con rayas marrones */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
      {/* Rayas marrones en la espalda/torso */}
      <path d="M 80 130 L 86 128 M 80 138 L 86 136 M 114 128 L 120 130 M 114 136 L 120 138" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      {/* Cola rayo (detrás) */}
      <path d="M 145 150 L 165 120 L 160 140 L 175 110 L 170 145 L 180 130" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Cabeza amarilla */}
      <rect x="60" y="40" width="80" height="70" rx="8" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
      <rect x="60" y="40" width="80" height="6" rx="3" fill="#fde047" opacity="0.7" />
      {/* Orejas puntiagudas */}
      <path d="M 56 44 L 44 14 L 62 36 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
      <path d="M 48 24 L 44 14 L 54 26 Z" fill="#1e293b" />
      <path d="M 144 44 L 156 14 L 138 36 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
      <path d="M 152 24 L 156 14 L 146 26 Z" fill="#1e293b" />
      {/* Mejillas rojas */}
      <circle cx="72" cy="88" r="7" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
      <circle cx="128" cy="88" r="7" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
      {/* Ojos negros brillantes */}
      <circle cx="84" cy="76" r="6" fill="#1e293b" />
      <circle cx="116" cy="76" r="6" fill="#1e293b" />
      <circle cx="86" cy="74" r="2" fill="#ffffff" />
      <circle cx="118" cy="74" r="2" fill="#ffffff" />
      {/* Boca */}
      <path d="M 90 92 Q 95 96 100 92 Q 105 96 110 92" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 94 94 Q 100 98 106 94" fill="#7a4422" stroke="#7a4422" strokeWidth="1" />
      {/* Nariz */}
      <circle cx="100" cy="84" r="1.5" fill="#1e293b" />
    </g>
  );
}

// ============================================================
// EREN - Attack on Titan (capa verde, uniforme beige)
// ============================================================
function ErenSVG() {
  return (
    <g>
      <CuerpoBase pielSide="#f5c08c" pielBottom="#d99a5e" piernaColor="#a8a29e" piernaDark="#78716c" brazoLado="#e7e5e4" />
      {/* Uniforme beige */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#d6d3d1" stroke="#78716c" strokeWidth="1.5" />
      {/* Cinturón de cuero con hebilla */}
      <rect x="70" y="152" width="60" height="8" rx="2" fill="#451a03" />
      <rect x="94" y="151" width="12" height="10" rx="1" fill="#a8a29e" stroke="#1e293b" strokeWidth="1" />
      {/* Bolsillos */}
      <rect x="74" y="124" width="14" height="12" rx="1" fill="none" stroke="#78716c" strokeWidth="1" />
      <rect x="112" y="124" width="14" height="12" rx="1" fill="none" stroke="#78716c" strokeWidth="1" />
      {/* Cabeza */}
      <CabezaBase
        pielSide="#f5c08c"
        pielBottom="#d99a5e"
        ojos={
          <>
            <ellipse cx="82" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <ellipse cx="118" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="83" cy="80" r="3.5" fill="#16a34a" />
            <circle cx="119" cy="80" r="3.5" fill="#16a34a" />
            <circle cx="84" cy="78" r="1.3" fill="#ffffff" />
            <circle cx="120" cy="78" r="1.3" fill="#ffffff" />
          </>
        }
        boca={<path d="M 86 96 L 114 96" stroke="#7a4422" strokeWidth="2.5" strokeLinecap="round" fill="none" />}
      />
      {/* Pelo castaño */}
      <path d="M 58 46 Q 60 24 100 22 Q 140 24 142 46 L 142 54 Q 100 48 58 54 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
      <path d="M 68 44 Q 76 52 88 46 Q 100 50 112 46 Q 124 52 132 44 L 132 52 Q 100 56 68 52 Z" fill="#92400e" />
      {/* Capa verde del Cuerpo de Exploración */}
      <path d="M 50 118 Q 100 108 150 118 L 156 180 Q 130 170 100 174 Q 70 170 44 180 Z" fill="#166534" stroke="#14532d" strokeWidth="1.5" opacity="0.92" />
      {/* Emblema (alas de la libertad) */}
      <g fill="#ffffff" opacity="0.95">
        <path d="M 88 134 L 96 138 L 88 142 Z" />
        <path d="M 104 138 L 112 134 L 112 142 Z" />
        <line x1="96" y1="138" x2="104" y2="138" stroke="#ffffff" strokeWidth="2" />
      </g>
    </g>
  );
}

// ============================================================
// MARIO - rojo y azul, gorra con M, bigote
// ============================================================
function MarioSVG() {
  return (
    <g>
      {/* Piernas azules (overoles) */}
      <rect x="78" y="168" width="20" height="48" rx="3" fill="#1e40af" />
      <rect x="102" y="168" width="20" height="48" rx="3" fill="#1e40af" />
      {/* Zapatos marrones */}
      <rect x="72" y="208" width="32" height="10" rx="3" fill="#78350f" />
      <rect x="96" y="208" width="32" height="10" rx="3" fill="#78350f" />
      {/* Brazos rojos (camisa) */}
      <rect x="48" y="118" width="22" height="52" rx="4" fill="#dc2626" />
      <rect x="130" y="118" width="22" height="52" rx="4" fill="#dc2626" />
      {/* Guantes blancos */}
      <rect x="48" y="166" width="22" height="10" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="130" y="166" width="22" height="10" rx="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      {/* Overoles azules */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1.5" />
      {/* Camisa roja visible arriba */}
      <rect x="70" y="116" width="60" height="12" rx="3" fill="#dc2626" />
      {/* Tirantes */}
      <rect x="80" y="116" width="8" height="50" fill="#1e40af" />
      <rect x="112" y="116" width="8" height="50" fill="#1e40af" />
      {/* Botones dorados */}
      <circle cx="84" cy="138" r="3" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
      <circle cx="116" cy="138" r="3" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
      {/* Cabeza */}
      <CabezaBase
        pielSide="#ffe0bd"
        pielBottom="#d99a5e"
        ojos={
          <>
            <circle cx="84" cy="78" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="116" cy="78" r="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="85" cy="79" r="2.5" fill="#1e40af" />
            <circle cx="117" cy="79" r="2.5" fill="#1e40af" />
          </>
        }
        boca={
          <>
            {/* Bigote grande negro */}
            <path d="M 74 96 Q 82 100 92 96 Q 100 102 108 96 Q 118 100 126 96 Q 122 104 110 100 Q 100 106 90 100 Q 78 104 74 96 Z" fill="#1e293b" />
            {/* Nariz grande */}
            <ellipse cx="100" cy="90" rx="9" ry="7" fill="#ff8c5a" stroke="#c2410c" strokeWidth="1.2" />
          </>
        }
      />
      {/* Gorra roja con M */}
      <g>
        <path d="M 58 48 Q 60 22 100 20 Q 140 22 142 48 L 142 52 Q 100 46 58 52 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
        {/* Visera */}
        <path d="M 58 50 Q 100 44 142 50 L 148 56 Q 100 50 52 56 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
        {/* Círculo blanco con M */}
        <circle cx="100" cy="36" r="10" fill="#ffffff" stroke="#991b1b" strokeWidth="1.5" />
        <text x="100" y="42" textAnchor="middle" fontSize="14" fontWeight="900" fill="#dc2626" fontFamily="Arial, sans-serif">M</text>
      </g>
    </g>
  );
}

// ============================================================
// MASTER CHIEF - armadura verde, casco con visor dorado
// ============================================================
function MasterChiefSVG() {
  return (
    <g>
      {/* Piernas verdes blindadas */}
      <rect x="78" y="168" width="20" height="48" rx="3" fill="#15803d" />
      <rect x="78" y="168" width="6" height="48" rx="2" fill="#166534" />
      <rect x="102" y="168" width="20" height="48" rx="3" fill="#15803d" />
      <rect x="116" y="168" width="6" height="48" rx="2" fill="#166534" />
      {/* Botas */}
      <rect x="74" y="208" width="28" height="10" rx="2" fill="#14532d" />
      <rect x="98" y="208" width="28" height="10" rx="2" fill="#14532d" />
      {/* Rodilleras */}
      <rect x="78" y="190" width="20" height="8" rx="2" fill="#22c55e" />
      <rect x="102" y="190" width="20" height="8" rx="2" fill="#22c55e" />
      {/* Brazos blindados */}
      <rect x="48" y="118" width="22" height="52" rx="4" fill="#15803d" />
      <rect x="48" y="118" width="6" height="52" rx="2" fill="#166534" />
      <rect x="130" y="118" width="22" height="52" rx="4" fill="#15803d" />
      <rect x="146" y="118" width="6" height="52" rx="2" fill="#166534" />
      {/* Guantes */}
      <rect x="48" y="166" width="22" height="10" rx="3" fill="#22c55e" />
      <rect x="130" y="166" width="22" height="10" rx="3" fill="#22c55e" />
      {/* Torso blindado */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#15803d" stroke="#14532d" strokeWidth="1.5" />
      {/* Detalles de armadura */}
      <rect x="76" y="122" width="48" height="44" rx="3" fill="#16a34a" opacity="0.6" />
      <rect x="90" y="126" width="20" height="36" rx="2" fill="#14532d" opacity="0.4" />
      {/* Luz del pecho */}
      <circle cx="100" cy="138" r="4" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
      <circle cx="100" cy="138" r="2" fill="#fef9c3" />
      {/* Cuello */}
      <rect x="90" y="104" width="20" height="14" rx="2" fill="#14532d" />
      {/* Casco (cabeza blindada) */}
      <g>
        <rect x="60" y="40" width="80" height="70" rx="8" fill="#15803d" stroke="#14532d" strokeWidth="1.5" />
        <rect x="60" y="40" width="80" height="8" rx="4" fill="#22c55e" opacity="0.7" />
        <rect x="134" y="48" width="6" height="56" rx="2" fill="#14532d" opacity="0.5" />
        {/* Visor dorado */}
        <rect x="70" y="66" width="60" height="20" rx="4" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
        <rect x="70" y="66" width="60" height="6" rx="3" fill="#fde68a" opacity="0.8" />
        {/* Línea del visor */}
        <line x1="74" y1="76" x2="126" y2="76" stroke="#92400e" strokeWidth="0.8" opacity="0.6" />
        {/* Detalles laterales del casco */}
        <rect x="56" y="70" width="6" height="20" rx="2" fill="#14532d" />
        <rect x="138" y="70" width="6" height="20" rx="2" fill="#14532d" />
      </g>
    </g>
  );
}

// ============================================================
// SORA - Kingdom Hearts (pelo castaño erizado, llave espada)
// ============================================================
function SoraSVG() {
  return (
    <g>
      <CuerpoBase pielSide="#ffe0bd" pielBottom="#d99a5e" piernaColor="#1e293b" piernaDark="#0f172a" brazoLado="#ffe0bd" />
      {/* Traje negro con rojo */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
      {/* Panel rojo central */}
      <rect x="88" y="116" width="24" height="56" fill="#dc2626" />
      {/* Cinturón */}
      <rect x="70" y="158" width="60" height="6" rx="2" fill="#7f1d1d" />
      {/* Coronas en hombros */}
      <circle cx="58" cy="120" r="5" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
      <circle cx="142" cy="120" r="5" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
      {/* Cabeza */}
      <CabezaBase
        pielSide="#ffe0bd"
        pielBottom="#d99a5e"
        ojos={
          <>
            <ellipse cx="82" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <ellipse cx="118" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="83" cy="80" r="3.5" fill="#3b82f6" />
            <circle cx="119" cy="80" r="3.5" fill="#3b82f6" />
            <circle cx="84" cy="78" r="1.3" fill="#ffffff" />
            <circle cx="120" cy="78" r="1.3" fill="#ffffff" />
          </>
        }
        boca={<path d="M 88 94 Q 100 100 112 94" stroke="#7a4422" strokeWidth="2.5" strokeLinecap="round" fill="none" />}
      />
      {/* Pelo castaño erizado (estilo Sora) */}
      <g fill="#7c2d12" stroke="#451a03" strokeWidth="1">
        <path d="M 58 48 Q 60 22 100 18 Q 140 22 142 48 L 142 54 Q 100 46 58 54 Z" />
        {/* Picos característicos */}
        <path d="M 64 36 L 54 18 L 72 32 Z" />
        <path d="M 78 28 L 74 8 L 88 26 Z" />
        <path d="M 96 22 L 100 4 L 104 22 Z" />
        <path d="M 112 28 L 118 8 L 108 26 Z" />
        <path d="M 122 32 L 138 18 L 132 36 Z" />
      </g>
      {/* Collar con corona */}
      <path d="M 80 114 Q 100 120 120 114" stroke="#fbbf24" strokeWidth="2" fill="none" />
      <path d="M 96 118 L 100 124 L 104 118 L 100 112 Z" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
      {/* Llave Espada (en mano derecho) */}
      <g>
        <line x1="146" y1="160" x2="178" y2="110" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
        <line x1="146" y1="160" x2="178" y2="110" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        {/* Dientes de la llave */}
        <rect x="172" y="106" width="14" height="6" rx="1" fill="#fbbf24" stroke="#92400e" strokeWidth="1" transform="rotate(-35 179 109)" />
        <rect x="168" y="118" width="10" height="5" rx="1" fill="#fbbf24" stroke="#92400e" strokeWidth="1" transform="rotate(-35 173 120)" />
        {/* Empuñadura */}
        <circle cx="144" cy="162" r="4" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
      </g>
    </g>
  );
}

// ============================================================
// SPIDER-MAN - rojo y azul con telaraña
// ============================================================
function SpiderManSVG() {
  return (
    <g>
      {/* Piernas azules */}
      <rect x="78" y="168" width="20" height="48" rx="3" fill="#1e40af" />
      <rect x="102" y="168" width="20" height="48" rx="3" fill="#1e40af" />
      {/* Botas rojas */}
      <rect x="74" y="208" width="28" height="10" rx="2" fill="#dc2626" />
      <rect x="98" y="208" width="28" height="10" rx="2" fill="#dc2626" />
      {/* Brazos rojos */}
      <rect x="48" y="118" width="22" height="52" rx="4" fill="#dc2626" />
      <rect x="130" y="118" width="22" height="52" rx="4" fill="#dc2626" />
      {/* Guantes rojos */}
      <rect x="48" y="166" width="22" height="10" rx="3" fill="#991b1b" />
      <rect x="130" y="166" width="22" height="10" rx="3" fill="#991b1b" />
      {/* Torso rojo */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
      {/* Sección azul del torso */}
      <path d="M 70 158 Q 100 148 130 158 L 130 172 L 70 172 Z" fill="#1e40af" />
      {/* Telaraña en el torso */}
      <g stroke="#1e293b" strokeWidth="0.8" fill="none" opacity="0.8">
        <line x1="100" y1="116" x2="100" y2="158" />
        <path d="M 80 126 Q 100 124 120 126" />
        <path d="M 76 138 Q 100 136 124 138" />
        <path d="M 78 150 Q 100 148 122 150" />
      </g>
      {/* Araña en el pecho */}
      <g fill="#1e293b">
        <ellipse cx="100" cy="134" rx="4" ry="6" />
        <path d="M 96 130 L 88 124 M 96 134 L 86 132 M 96 138 L 88 140" stroke="#1e293b" strokeWidth="1.5" />
        <path d="M 104 130 L 112 124 M 104 134 L 114 132 M 104 138 L 112 140" stroke="#1e293b" strokeWidth="1.5" />
      </g>
      {/* Cuello */}
      <rect x="90" y="104" width="20" height="14" rx="2" fill="#dc2626" />
      {/* Máscara roja */}
      <g>
        <rect x="60" y="40" width="80" height="70" rx="8" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
        <rect x="60" y="40" width="80" height="6" rx="3" fill="#ef4444" opacity="0.7" />
        {/* Telaraña en la cara */}
        <g stroke="#1e293b" strokeWidth="0.7" fill="none" opacity="0.7">
          <path d="M 60 70 Q 100 60 140 70" />
          <path d="M 60 84 Q 100 74 140 84" />
          <path d="M 62 98 Q 100 88 138 98" />
          <line x1="80" y1="46" x2="78" y2="104" />
          <line x1="100" y1="44" x2="100" y2="104" />
          <line x1="120" y1="46" x2="122" y2="104" />
        </g>
        {/* Ojos blancos con borde negro (característicos) */}
        <path d="M 70 72 Q 82 64 94 74 Q 92 84 80 86 Q 70 82 70 72 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
        <path d="M 106 74 Q 118 64 130 72 Q 130 82 120 86 Q 108 84 106 74 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
        {/* Brillo en los ojos */}
        <ellipse cx="80" cy="74" rx="3" ry="2" fill="#bfdbfe" opacity="0.7" />
        <ellipse cx="120" cy="74" rx="3" ry="2" fill="#bfdbfe" opacity="0.7" />
      </g>
    </g>
  );
}

// ============================================================
// BATMAN - negro, capa, cornamenta
// ============================================================
function BatmanSVG() {
  return (
    <g>
      <CuerpoBase pielSide="#9ca3af" pielBottom="#4b5563" piernaColor="#1e293b" piernaDark="#0f172a" brazoLado="#374151" />
      {/* Traje gris oscuro */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#374151" stroke="#0f172a" strokeWidth="1.5" />
      {/* Símbolo de murciélago negro en el pecho */}
      <g fill="#0f172a">
        <ellipse cx="100" cy="138" rx="5" ry="7" />
        <path d="M 95 132 L 84 124 L 88 134 L 80 130 L 86 138 L 95 140 Z" />
        <path d="M 105 132 L 116 124 L 112 134 L 120 130 L 114 138 L 105 140 Z" />
        <path d="M 95 144 L 86 152 L 92 146 Z" />
        <path d="M 105 144 L 114 152 L 108 146 Z" />
      </g>
      {/* Cinturón amarillo con bolsas */}
      <rect x="70" y="158" width="60" height="8" rx="2" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
      <rect x="80" y="158" width="6" height="8" fill="#92400e" />
      <rect x="94" y="158" width="12" height="8" fill="#fde047" stroke="#92400e" strokeWidth="0.8" />
      <rect x="114" y="158" width="6" height="8" fill="#92400e" />
      {/* Cabeza gris */}
      <rect x="60" y="40" width="80" height="70" rx="6" fill="#9ca3af" stroke="#4b5563" strokeWidth="1.2" />
      {/* Máscara negra (cubre la cabeza excepto la zona de la cara) */}
      <path d="M 60 40 L 60 110 L 140 110 L 140 40 Z M 70 60 Q 70 100 100 100 Q 130 100 130 60 Z" fill="#0f172a" fillRule="evenodd" />
      {/* Cuernos (cornamenta) */}
      <path d="M 64 40 L 58 14 L 78 40 Z" fill="#0f172a" stroke="#000000" strokeWidth="1" />
      <path d="M 136 40 L 142 14 L 122 40 Z" fill="#0f172a" stroke="#000000" strokeWidth="1" />
      {/* Ojos blancos */}
      <ellipse cx="82" cy="76" rx="7" ry="5" fill="#ffffff" />
      <ellipse cx="118" cy="76" rx="7" ry="5" fill="#ffffff" />
      {/* Boca seria */}
      <path d="M 88 94 L 112 94" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Capa negra (detrás del cuerpo) */}
      <path d="M 44 118 Q 100 104 156 118 L 162 185 Q 130 175 100 180 Q 70 175 38 185 Z" fill="#0f172a" stroke="#000000" strokeWidth="1" opacity="0.95" />
      {/* Interior de la capa (oscuro) */}
      <path d="M 50 120 Q 100 110 150 120 L 150 124 Q 100 114 50 124 Z" fill="#1e293b" />
    </g>
  );
}

// ============================================================
// LUKE SKYWALKER - túnica blanca, sable de luz verde
// ============================================================
function LukeSVG() {
  return (
    <g>
      <CuerpoBase pielSide="#ffe0bd" pielBottom="#d99a5e" piernaColor="#e7e5e4" piernaDark="#a8a29e" brazoLado="#f5f5f4" />
      {/* Túnica blanca */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#f5f5f4" stroke="#a8a29e" strokeWidth="1.5" />
      {/* Líneas de la túnica */}
      <line x1="100" y1="116" x2="100" y2="172" stroke="#a8a29e" strokeWidth="1.5" />
      <path d="M 88 116 L 100 128 L 112 116" fill="none" stroke="#a8a29e" strokeWidth="1.5" />
      {/* Cinturón marrón */}
      <rect x="70" y="156" width="60" height="8" rx="2" fill="#78350f" />
      <rect x="94" y="155" width="12" height="10" rx="1" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
      {/* Cabeza */}
      <CabezaBase
        pielSide="#ffe0bd"
        pielBottom="#d99a5e"
        ojos={
          <>
            <ellipse cx="82" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <ellipse cx="118" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="83" cy="80" r="3.5" fill="#3b82f6" />
            <circle cx="119" cy="80" r="3.5" fill="#3b82f6" />
            <circle cx="84" cy="78" r="1.3" fill="#ffffff" />
            <circle cx="120" cy="78" r="1.3" fill="#ffffff" />
          </>
        }
        boca={<path d="M 88 94 Q 100 98 112 94" stroke="#7a4422" strokeWidth="2.5" strokeLinecap="round" fill="none" />}
      />
      {/* Pelo rubio */}
      <path d="M 58 46 Q 60 26 100 24 Q 140 26 142 46 L 142 54 Q 100 48 58 54 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      <path d="M 68 44 Q 80 52 92 48 Q 100 52 108 48 Q 120 52 132 44 L 132 52 Q 100 56 68 52 Z" fill="#facc15" />
      {/* Sable de luz verde (encendido) */}
      <g>
        {/* Mango */}
        <rect x="143" y="158" width="8" height="20" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1" transform="rotate(-30 147 168)" />
        {/* Hoja de luz verde */}
        <line x1="150" y1="152" x2="190" y2="100" stroke="#86efac" strokeWidth="7" strokeLinecap="round" opacity="0.9" />
        <line x1="150" y1="152" x2="190" y2="100" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
        <line x1="150" y1="152" x2="190" y2="100" stroke="#bbf7d0" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        {/* Brillo del sable */}
        <circle cx="170" cy="126" r="14" fill="#22c55e" opacity="0.2" />
      </g>
    </g>
  );
}

// ============================================================
// ELEVEN - Stranger Things (vestido rosa, pelo rapado)
// ============================================================
function ElevenSVG() {
  return (
    <g>
      <CuerpoBase pielSide="#ffe0bd" pielBottom="#d99a5e" piernaColor="#1e293b" piernaDark="#0f172a" brazoLado="#fbcfe8" />
      {/* Vestido rosa */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#f9a8d4" stroke="#be185d" strokeWidth="1.5" />
      {/* Cuadros del vestido */}
      <g stroke="#be185d" strokeWidth="0.6" opacity="0.4">
        <line x1="82" y1="116" x2="82" y2="172" />
        <line x1="94" y1="116" x2="94" y2="172" />
        <line x1="106" y1="116" x2="106" y2="172" />
        <line x1="118" y1="116" x2="118" y2="172" />
        <line x1="70" y1="130" x2="130" y2="130" />
        <line x1="70" y1="144" x2="130" y2="144" />
        <line x1="70" y1="158" x2="130" y2="158" />
      </g>
      {/* Cuello del vestido */}
      <path d="M 86 116 L 100 126 L 114 116" fill="none" stroke="#be185d" strokeWidth="1.5" />
      {/* Cabeza */}
      <CabezaBase
        pielSide="#ffe0bd"
        pielBottom="#d99a5e"
        ojos={
          <>
            <ellipse cx="82" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <ellipse cx="118" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="83" cy="80" r="3.5" fill="#4b5563" />
            <circle cx="119" cy="80" r="3.5" fill="#4b5563" />
            <circle cx="84" cy="78" r="1.3" fill="#ffffff" />
            <circle cx="120" cy="78" r="1.3" fill="#ffffff" />
          </>
        }
        boca={<path d="M 90 94 L 110 94" stroke="#7a4422" strokeWidth="2.5" strokeLinecap="round" fill="none" />}
      />
      {/* Pelo corto rapado castaño */}
      <path d="M 60 46 Q 62 30 100 28 Q 138 30 140 46 L 140 50 Q 100 44 60 50 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" opacity="0.85" />
      {/* Sangre de nariz (power activado) */}
      <path d="M 100 88 L 100 100 L 103 100" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="101" cy="100" r="1.5" fill="#dc2626" />
    </g>
  );
}

// ============================================================
// MICKEY MOUSE - negro, orejas redondas, pantalón corto rojo
// ============================================================
function MickeySVG() {
  return (
    <g>
      {/* Piernas negras finas */}
      <rect x="84" y="168" width="12" height="40" rx="3" fill="#0f172a" />
      <rect x="104" y="168" width="12" height="40" rx="3" fill="#0f172a" />
      {/* Zapatos amarillos grandes */}
      <ellipse cx="88" cy="214" rx="16" ry="8" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
      <ellipse cx="112" cy="214" rx="16" ry="8" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
      {/* Brazos negros finos */}
      <rect x="52" y="120" width="14" height="48" rx="4" fill="#0f172a" />
      <rect x="134" y="120" width="14" height="48" rx="4" fill="#0f172a" />
      {/* Guantes blancos */}
      <circle cx="59" cy="172" r="11" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="141" cy="172" r="11" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Líneas del guante */}
      <path d="M 54 168 L 64 168 M 136 168 L 146 168" stroke="#cbd5e1" strokeWidth="1" />
      {/* Torso negro */}
      <rect x="72" y="116" width="56" height="56" rx="8" fill="#0f172a" stroke="#000000" strokeWidth="1.5" />
      {/* Pantalón corto rojo con botones */}
      <rect x="70" y="150" width="60" height="22" rx="4" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
      <circle cx="80" cy="154" r="2" fill="#fbbf24" />
      <circle cx="120" cy="154" r="2" fill="#fbbf24" />
      {/* Cabeza negra redonda */}
      <circle cx="100" cy="75" r="38" fill="#0f172a" stroke="#000000" strokeWidth="1.5" />
      {/* Cara (más clara, óvalo) */}
      <ellipse cx="100" cy="82" rx="26" ry="22" fill="#fbcfe4" stroke="#be185d" strokeWidth="0.8" opacity="0.4" />
      <ellipse cx="100" cy="82" rx="26" ry="22" fill="#fff1f2" />
      {/* Orejas redondas grandes */}
      <circle cx="62" cy="48" r="16" fill="#0f172a" stroke="#000000" strokeWidth="1.5" />
      <circle cx="138" cy="48" r="16" fill="#0f172a" stroke="#000000" strokeWidth="1.5" />
      {/* Ojos (óvalos blancos con pupilas) */}
      <ellipse cx="88" cy="72" rx="7" ry="10" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
      <ellipse cx="112" cy="72" rx="7" ry="10" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="89" cy="74" r="4" fill="#1e293b" />
      <circle cx="113" cy="74" r="4" fill="#1e293b" />
      <circle cx="90" cy="72" r="1.5" fill="#ffffff" />
      <circle cx="114" cy="72" r="1.5" fill="#ffffff" />
      {/* Hocico (óvalo negro) */}
      <ellipse cx="100" cy="90" rx="7" ry="5" fill="#0f172a" />
      <circle cx="100" cy="88" r="2" fill="#ffffff" opacity="0.6" />
      {/* Sonrisa */}
      <path d="M 88 96 Q 100 106 112 96" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Mejillas rosadas */}
      <circle cx="78" cy="88" r="4" fill="#f9a8d4" opacity="0.5" />
      <circle cx="122" cy="88" r="4" fill="#f9a8d4" opacity="0.5" />
    </g>
  );
}
