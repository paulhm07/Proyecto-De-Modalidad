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
    // Piratas Mugiwara (One Piece)
    case "luffy": return <LuffySVG />;
    case "zoro": return <ZoroSVG />;
    case "nami": return <NamiSVG />;
    case "usopp": return <UsoppSVG />;
    case "sanji": return <SanjiSVG />;
    case "chopper": return <ChopperSVG />;
    case "robin": return <RobinSVG />;
    case "franky": return <FrankySVG />;
    case "brook": return <BrookSVG />;
    case "jinbe": return <JinbeSVG />;
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

// ============================================================
// ===== PIRATAS MUGIWARA (One Piece) =====
// ============================================================

// LUFFY - Sombrero de paja, chaqueta roja, pantalón azul, cicatriz bajo el ojo
function LuffySVG() {
  return (
    <g>
      <CuerpoBase pielSide="#f5c08c" pielBottom="#d99a5e" piernaColor="#1e3a8a" piernaDark="#1e293b" brazoLado="#f5c08c" />
      {/* Chaleco rojo abierto */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
      {/* Camiseta blanca interior */}
      <path d="M 86 116 L 100 134 L 114 116 L 114 140 L 86 140 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      {/* Botones dorados del chaleco */}
      <circle cx="76" cy="128" r="2" fill="#fbbf24" />
      <circle cx="76" cy="142" r="2" fill="#fbbf24" />
      <circle cx="76" cy="156" r="2" fill="#fbbf24" />
      {/* Cinturón amarillo */}
      <rect x="70" y="158" width="60" height="8" rx="2" fill="#fbbf24" stroke="#ca8a04" strokeWidth="1" />
      {/* Cabeza */}
      <CabezaBase
        pielSide="#f5c08c"
        pielBottom="#d99a5e"
        ojos={
          <>
            <circle cx="84" cy="78" r="6" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="116" cy="78" r="6" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="85" cy="79" r="3.5" fill="#1e293b" />
            <circle cx="117" cy="79" r="3.5" fill="#1e293b" />
            <circle cx="86" cy="77" r="1.3" fill="#ffffff" />
            <circle cx="118" cy="77" r="1.3" fill="#ffffff" />
          </>
        }
        boca={
          <>
            {/* Sonrisa grande de Luffy */}
            <path d="M 80 92 Q 100 108 120 92 Q 100 100 80 92 Z" fill="#7a1a1a" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M 84 94 Q 100 104 116 94" fill="#ffffff" stroke="none" />
          </>
        }
      />
      {/* Cicatriz bajo el ojo izquierdo */}
      <path d="M 84 86 L 84 90 M 82 88 L 86 88" stroke="#7a1a1a" strokeWidth="1.2" strokeLinecap="round" />
      {/* Pelo negro */}
      <path d="M 58 46 Q 60 26 100 24 Q 140 26 142 46 L 142 54 Q 100 48 58 54 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
      <path d="M 64 44 Q 72 50 80 46 Q 88 50 96 46 Q 104 50 112 46 Q 120 50 128 44 L 128 52 Q 100 56 64 52 Z" fill="#334155" />
      {/* Sombrero de paja */}
      <g>
        {/* Ala del sombrero */}
        <ellipse cx="100" cy="34" rx="48" ry="8" fill="#eab308" stroke="#a16207" strokeWidth="1.5" />
        <ellipse cx="100" cy="33" rx="46" ry="5" fill="#facc15" />
        {/* Cinta roja alrededor */}
        <rect x="56" y="32" width="88" height="6" rx="2" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
        {/* Copa del sombrero */}
        <path d="M 72 34 Q 72 14 100 12 Q 128 14 128 34 Z" fill="#facc15" stroke="#a16207" strokeWidth="1.5" />
        {/* Detalle de trenza (líneas) */}
        <path d="M 78 22 L 122 22 M 78 26 L 122 26" stroke="#a16207" strokeWidth="0.8" opacity="0.5" />
      </g>
    </g>
  );
}

// ZORO - Pelo verde, tres katanas, sash verde, banda negra
function ZoroSVG() {
  return (
    <g>
      <CuerpoBase pielSide="#f5c08c" pielBottom="#d99a5e" piernaColor="#1e293b" piernaDark="#0f172a" brazoLado="#f5c08c" />
      {/* Camiseta blanca abierta */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Cuerpo abierto (pecho) */}
      <path d="M 86 116 L 100 130 L 114 116" fill="#f5c08c" />
      {/* Haramaki verde (faja) */}
      <rect x="70" y="150" width="60" height="16" rx="2" fill="#16a34a" stroke="#15803d" strokeWidth="1.5" />
      {/* Detalle del tejido */}
      <line x1="74" y1="158" x2="126" y2="158" stroke="#15803d" strokeWidth="0.8" opacity="0.6" />
      {/* Cabeza */}
      <CabezaBase
        pielSide="#f5c08c"
        pielBottom="#d99a5e"
        ojos={
          <>
            <ellipse cx="82" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <ellipse cx="118" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="83" cy="80" r="3.5" fill="#1e293b" />
            <circle cx="119" cy="80" r="3.5" fill="#1e293b" />
            {/* Ojo izquierdo con cicatriz */}
            <path d="M 76 72 L 80 78" stroke="#7a1a1a" strokeWidth="1.2" strokeLinecap="round" />
          </>
        }
        boca={<path d="M 88 96 L 112 96" stroke="#7a4422" strokeWidth="2.8" strokeLinecap="round" fill="none" />}
      />
      {/* Pelo verde corto */}
      <path d="M 58 46 Q 60 24 100 22 Q 140 24 142 46 L 142 52 Q 100 46 58 52 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
      <path d="M 64 42 Q 70 50 78 44 Q 86 50 94 44 Q 102 50 110 44 Q 118 50 126 42 L 128 50 Q 100 54 64 50 Z" fill="#22c55e" />
      {/* Banda negra (en la cabeza) */}
      <rect x="58" y="52" width="84" height="6" rx="1" fill="#0f172a" />
      {/* Tres katanas (dos a la derecha, una a la izquierda) */}
      <g>
        {/* Katana 1 (espalda, derecha) */}
        <line x1="128" y1="170" x2="148" y2="100" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <rect x="124" y="166" width="10" height="16" rx="2" fill="#1e293b" />
        {/* Katana 2 (espalda, derecha, paralela) */}
        <line x1="132" y1="170" x2="152" y2="104" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
        <rect x="128" y="166" width="10" height="16" rx="2" fill="#dc2626" />
        {/* Katana 3 (espalda, izquierda) */}
        <line x1="72" y1="170" x2="52" y2="100" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <rect x="66" y="166" width="10" height="16" rx="2" fill="#1e293b" />
      </g>
    </g>
  );
}

// NAMI - Pelo naranja largo, top azul con rayas, tatuaje de mandarina
function NamiSVG() {
  return (
    <g>
      <CuerpoBase pielSide="#f5c08c" pielBottom="#d99a5e" piernaColor="#1e3a8a" piernaDark="#1e293b" brazoLado="#f5c08c" />
      {/* Top azul con rayas blancas */}
      <rect x="70" y="116" width="60" height="44" rx="5" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1.5" />
      {/* Rayas blancas horizontales */}
      <rect x="70" y="122" width="60" height="4" fill="#f8fafc" />
      <rect x="70" y="134" width="60" height="4" fill="#f8fafc" />
      <rect x="70" y="146" width="60" height="4" fill="#f8fafc" />
      {/* Falda naranja corta */}
      <rect x="70" y="158" width="60" height="14" rx="3" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
      {/* Cabeza */}
      <CabezaBase
        pielSide="#f5c08c"
        pielBottom="#d99a5e"
        ojos={
          <>
            <ellipse cx="82" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <ellipse cx="118" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="83" cy="80" r="3.5" fill="#ca8a04" />
            <circle cx="119" cy="80" r="3.5" fill="#ca8a04" />
            <circle cx="84" cy="78" r="1.3" fill="#ffffff" />
            <circle cx="120" cy="78" r="1.3" fill="#ffffff" />
          </>
        }
        boca={<path d="M 88 94 Q 100 100 112 94" stroke="#7a4422" strokeWidth="2.5" strokeLinecap="round" fill="none" />}
      />
      {/* Pelo naranja largo */}
      <path d="M 56 46 Q 58 22 100 20 Q 142 22 144 46 L 148 116 L 130 116 L 132 50 Q 100 44 68 50 L 70 116 L 52 116 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
      {/* Flequillo */}
      <path d="M 62 44 Q 72 52 82 46 Q 92 52 100 46 Q 108 52 118 46 Q 128 52 138 44 L 138 52 Q 100 56 62 52 Z" fill="#fb923c" />
      {/* Tatuaje de mandarina en el hombro */}
      <circle cx="58" cy="130" r="6" fill="#ea580c" stroke="#9a3412" strokeWidth="1" opacity="0.85" />
      <path d="M 54 130 L 62 130 M 58 126 L 58 134" stroke="#9a3412" strokeWidth="0.8" />
    </g>
  );
}

// USOPP - Nariz larga, overoles blancos, tirachinas, gafas
function UsoppSVG() {
  return (
    <g>
      <CuerpoBase pielSide="#a16207" pielBottom="#78350f" piernaColor="#4a5568" piernaDark="#2d3748" brazoLado="#a16207" />
      {/* Overoles blancos con tirantes */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Bandas azules en pecho */}
      <rect x="70" y="116" width="60" height="14" rx="3" fill="#2563eb" />
      <rect x="74" y="120" width="14" height="6" fill="#1e3a8a" />
      <rect x="112" y="120" width="14" height="6" fill="#1e3a8a" />
      {/* Tirantes */}
      <rect x="80" y="116" width="8" height="56" fill="#4a5568" />
      <rect x="112" y="116" width="8" height="56" fill="#4a5568" />
      {/* Cabeza */}
      <CabezaBase
        pielSide="#a16207"
        pielBottom="#78350f"
        ojos={
          <>
            <circle cx="84" cy="74" r="5" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="116" cy="74" r="5" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="85" cy="75" r="3" fill="#1e293b" />
            <circle cx="117" cy="75" r="3" fill="#1e293b" />
          </>
        }
        boca={<path d="M 90 98 Q 100 102 110 98" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />}
      />
      {/* Nariz larga (pinocchio style) */}
      <path d="M 100 80 L 100 104 Q 104 108 100 110 Q 96 108 100 104" fill="#a16207" stroke="#78350f" strokeWidth="1.2" />
      <ellipse cx="100" cy="100" rx="4" ry="10" fill="#a16207" stroke="#78350f" strokeWidth="1.2" />
      {/* Pelo negro rizado */}
      <path d="M 56 48 Q 56 24 100 22 Q 144 24 144 48 L 144 54 Q 100 48 56 54 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
      <g fill="#0f172a">
        <circle cx="64" cy="42" r="5" />
        <circle cx="76" cy="38" r="5" />
        <circle cx="88" cy="36" r="5" />
        <circle cx="100" cy="34" r="5" />
        <circle cx="112" cy="36" r="5" />
        <circle cx="124" cy="38" r="5" />
        <circle cx="136" cy="42" r="5" />
      </g>
      {/* Gafas en la frente */}
      <circle cx="84" cy="56" r="7" fill="none" stroke="#1e293b" strokeWidth="2" />
      <circle cx="116" cy="56" r="7" fill="none" stroke="#1e293b" strokeWidth="2" />
      <line x1="91" y1="56" x2="109" y2="56" stroke="#1e293b" strokeWidth="2" />
      {/* Tirachinas (honda) en la mano */}
      <g>
        <path d="M 44 158 Q 36 150 32 140" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="40" y="156" width="8" height="12" rx="2" fill="#78350f" />
        <line x1="36" y1="148" x2="32" y2="140" stroke="#1e293b" strokeWidth="1" />
        <line x1="40" y1="146" x2="32" y2="140" stroke="#1e293b" strokeWidth="1" />
      </g>
    </g>
  );
}

// SANJI - Rubio con pelo tapando un ojo, traje negro, corbata
function SanjiSVG() {
  return (
    <g>
      <CuerpoBase pielSide="#f5c08c" pielBottom="#d99a5e" piernaColor="#1e293b" piernaDark="#0f172a" brazoLado="#1e293b" />
      {/* Traje negro */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#0f172a" stroke="#000000" strokeWidth="1.5" />
      {/* Camisa amarilla interior */}
      <path d="M 88 116 L 100 138 L 112 116 Z" fill="#facc15" />
      {/* Corbata negra */}
      <path d="M 96 116 L 104 116 L 102 130 L 100 138 L 98 130 Z" fill="#000000" />
      {/* Botones del saco */}
      <circle cx="84" cy="130" r="1.5" fill="#475569" />
      <circle cx="84" cy="140" r="1.5" fill="#475569" />
      <circle cx="116" cy="130" r="1.5" fill="#475569" />
      <circle cx="116" cy="140" r="1.5" fill="#475569" />
      {/* Cabeza */}
      <CabezaBase
        pielSide="#f5c08c"
        pielBottom="#d99a5e"
        ojos={
          <>
            {/* Solo ojo derecho visible (izquierdo tapado por pelo) */}
            <ellipse cx="118" cy="78" rx="6" ry="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <circle cx="119" cy="80" r="3.5" fill="#1e293b" />
            <circle cx="120" cy="78" r="1.3" fill="#ffffff" />
            {/* Ceja rizada característica */}
            <path d="M 110 68 Q 116 64 122 68 Q 126 70 122 72" stroke="#ca8a04" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        }
        boca={<path d="M 90 96 Q 100 100 110 96" stroke="#7a4422" strokeWidth="2.5" strokeLinecap="round" fill="none" />}
      />
      {/* Pelo rubio cubriendo ojo izquierdo */}
      <path d="M 56 46 Q 58 24 100 22 Q 142 24 144 46 L 144 56 Q 100 50 56 56 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      {/* Mechón lateral cubriendo ojo izquierdo */}
      <path d="M 56 46 Q 56 70 72 84 Q 80 86 82 80 Q 74 72 70 60 Q 64 50 56 46 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
      <path d="M 64 44 Q 74 52 84 46 Q 94 52 104 46 Q 114 52 124 46 Q 134 52 144 44 L 144 52 Q 100 56 64 52 Z" fill="#facc15" />
      {/* Cigarro (sin encender, para niños) */}
      <rect x="108" y="96" width="14" height="2.5" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
      <rect x="120" y="95.5" width="3" height="3.5" rx="1" fill="#fbbf24" />
    </g>
  );
}

// CHOPPER - Reno azul con gorro rosa, hocico, cornamenta
function ChopperSVG() {
  return (
    <g>
      {/* Piernas cortas marrones */}
      <rect x="82" y="178" width="14" height="32" rx="3" fill="#92400e" />
      <rect x="104" y="178" width="14" height="32" rx="3" fill="#92400e" />
      {/* Zapatos negros */}
      <ellipse cx="89" cy="212" rx="12" ry="6" fill="#1e293b" />
      <ellipse cx="111" cy="212" rx="12" ry="6" fill="#1e293b" />
      {/* Brazos marrones */}
      <rect x="56" y="128" width="16" height="44" rx="4" fill="#92400e" />
      <rect x="128" y="128" width="16" height="44" rx="4" fill="#92400e" />
      {/* Pezuñas */}
      <rect x="54" y="168" width="20" height="8" rx="2" fill="#1e293b" />
      <rect x="126" y="168" width="20" height="8" rx="2" fill="#1e293b" />
      {/* Cuerpo rosado (overol) */}
      <rect x="72" y="128" width="56" height="52" rx="8" fill="#f472b6" stroke="#be185d" strokeWidth="1.5" />
      {/* Botones blancos del overol */}
      <circle cx="84" cy="140" r="2.5" fill="#f8fafc" stroke="#be185d" strokeWidth="0.8" />
      <circle cx="116" cy="140" r="2.5" fill="#f8fafc" stroke="#be185d" strokeWidth="0.8" />
      {/* Cabeza (cráneo azul de reno) */}
      <rect x="62" y="44" width="76" height="64" rx="12" fill="#3b82f6" stroke="#1e40af" strokeWidth="1.5" />
      {/* Hocico claro */}
      <ellipse cx="100" cy="96" rx="22" ry="14" fill="#dbeafe" stroke="#1e40af" strokeWidth="1.2" />
      {/* Nariz azul */}
      <ellipse cx="100" cy="92" rx="6" ry="5" fill="#1e40af" />
      {/* Cornamenta pequeña */}
      <g fill="#78350f" stroke="#451a03" strokeWidth="1">
        <path d="M 70 44 Q 60 28 56 18 Q 62 22 66 30 Q 64 20 68 14 Q 72 22 72 32 Z" />
        <path d="M 130 44 Q 140 28 144 18 Q 138 22 134 30 Q 136 20 132 14 Q 128 22 128 32 Z" />
      </g>
      {/* Orejas de reno */}
      <ellipse cx="60" cy="60" rx="8" ry="12" fill="#3b82f6" stroke="#1e40af" strokeWidth="1" transform="rotate(-30 60 60)" />
      <ellipse cx="140" cy="60" rx="8" ry="12" fill="#3b82f6" stroke="#1e40af" strokeWidth="1" transform="rotate(30 140 60)" />
      {/* Gorro rosa con cruz médica */}
      <path d="M 64 50 Q 64 28 100 24 Q 136 28 136 50 L 136 58 Q 100 52 64 58 Z" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
      {/* Cruz blanca médica */}
      <rect x="94" y="32" width="12" height="4" fill="#ffffff" />
      <rect x="98" y="28" width="4" height="12" fill="#ffffff" />
      {/* Ojos grandes */}
      <circle cx="82" cy="72" r="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="118" cy="72" r="8" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="83" cy="73" r="5" fill="#1e293b" />
      <circle cx="119" cy="73" r="5" fill="#1e293b" />
      <circle cx="84" cy="71" r="2" fill="#ffffff" />
      <circle cx="120" cy="71" r="2" fill="#ffffff" />
      {/* Mejillas rosadas */}
      <circle cx="72" cy="86" r="5" fill="#f9a8d4" opacity="0.6" />
      <circle cx="128" cy="86" r="5" fill="#f9a8d4" opacity="0.6" />
      {/* Sonrisa */}
      <path d="M 88 96 Q 100 104 112 96" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>
  );
}

// ROBIN - Pelo negro largo, gafas de sol naranjas, traje morado
function RobinSVG() {
  return (
    <g>
      <CuerpoBase pielSide="#f5c08c" pielBottom="#d99a5e" piernaColor="#1e293b" piernaDark="#0f172a" brazoLado="#7c3aed" />
      {/* Traje morado */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#7c3aed" stroke="#5b21b6" strokeWidth="1.5" />
      {/* Cuello en V */}
      <path d="M 86 116 L 100 132 L 114 116" fill="#f5c08c" />
      {/* Cinturón dorado */}
      <rect x="70" y="156" width="60" height="8" rx="2" fill="#fbbf24" stroke="#ca8a04" strokeWidth="1" />
      <rect x="94" y="155" width="12" height="10" rx="1" fill="#ca8a04" />
      {/* Cabeza */}
      <CabezaBase
        pielSide="#f5c08c"
        pielBottom="#d99a5e"
        ojos={
          <>
            {/* Gafas de sol naranjas (características) */}
            <rect x="70" y="72" width="60" height="12" rx="4" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
            <line x1="100" y1="74" x2="100" y2="82" stroke="#c2410c" strokeWidth="1.5" />
            {/* Brillo de las gafas */}
            <ellipse cx="80" cy="76" rx="6" ry="2" fill="#fdba74" opacity="0.7" />
            <ellipse cx="120" cy="76" rx="6" ry="2" fill="#fdba74" opacity="0.7" />
          </>
        }
        boca={<path d="M 90 96 L 110 96" stroke="#7a4422" strokeWidth="2.5" strokeLinecap="round" fill="none" />}
      />
      {/* Pelo negro largo */}
      <path d="M 54 46 Q 56 22 100 20 Q 144 22 146 46 L 150 120 L 130 120 L 132 50 Q 100 44 68 50 L 70 120 L 50 120 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
      {/* Flequillo recto */}
      <path d="M 60 46 L 140 46 L 140 54 Q 100 48 60 54 Z" fill="#334155" />
      <path d="M 60 48 L 140 48" stroke="#0f172a" strokeWidth="1.5" />
    </g>
  );
}

// FRANKY - Pelo azul, gafas, cuerpo metálico, brazos grandes, estrellas
function FrankySVG() {
  return (
    <g>
      {/* Piernas metálicas (speedo negro) */}
      <rect x="78" y="168" width="20" height="48" rx="3" fill="#0891b2" />
      <rect x="78" y="168" width="6" height="48" rx="2" fill="#0e7490" />
      <rect x="102" y="168" width="20" height="48" rx="3" fill="#0891b2" />
      <rect x="116" y="168" width="6" height="48" rx="2" fill="#0e7490" />
      {/* Zapatos negros */}
      <rect x="74" y="208" width="28" height="10" rx="3" fill="#1e293b" />
      <rect x="98" y="208" width="28" height="10" rx="3" fill="#1e293b" />
      {/* Brazos metálicos grandes */}
      <rect x="44" y="116" width="26" height="56" rx="5" fill="#0891b2" stroke="#0e7490" strokeWidth="1.5" />
      <rect x="44" y="116" width="8" height="56" rx="3" fill="#0e7490" />
      <rect x="130" y="116" width="26" height="56" rx="5" fill="#0891b2" stroke="#0e7490" strokeWidth="1.5" />
      <rect x="148" y="116" width="8" height="56" rx="3" fill="#0e7490" />
      {/* Guantes metálicos */}
      <rect x="44" y="166" width="26" height="12" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
      <rect x="130" y="166" width="26" height="12" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
      {/* Torso metálico (camisa hawaiana abierta) */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#22d3ee" stroke="#0e7490" strokeWidth="1.5" />
      {/* Patrón de camisa (estrellas y triángulos) */}
      <g fill="#fbbf24" opacity="0.9">
        <path d="M 80 128 L 82 132 L 86 132 L 83 135 L 84 139 L 80 137 L 76 139 L 77 135 L 74 132 L 78 132 Z" />
        <path d="M 112 144 L 114 148 L 118 148 L 115 151 L 116 155 L 112 153 L 108 155 L 109 151 L 106 148 L 110 148 Z" />
      </g>
      <g fill="#ec4899" opacity="0.9">
        <path d="M 92 130 L 96 136 L 88 136 Z" />
        <path d="M 120 130 L 124 136 L 116 136 Z" />
      </g>
      {/* Speedo negro */}
      <rect x="84" y="160" width="32" height="12" rx="3" fill="#0f172a" stroke="#000000" strokeWidth="1" />
      {/* Estrellas azules en los brazos (tatuajes) */}
      <g fill="#3b82f6">
        <path d="M 50 130 L 52 134 L 56 134 L 53 137 L 54 141 L 50 139 L 46 141 L 47 137 L 44 134 L 48 134 Z" />
        <path d="M 138 130 L 140 134 L 144 134 L 141 137 L 142 141 L 138 139 L 134 141 L 135 137 L 132 134 L 136 134 Z" />
      </g>
      {/* Cabeza */}
      <CabezaBase
        pielSide="#f5c08c"
        pielBottom="#d99a5e"
        ojos={
          <>
            {/* Gafas de sol Frankie (estrella amarilla) */}
            <rect x="68" y="72" width="64" height="14" rx="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <path d="M 96 76 L 98 80 L 102 80 L 99 82 L 100 86 L 96 84 L 92 86 L 93 82 L 90 80 L 94 80 Z" fill="#1e293b" />
          </>
        }
        boca={<path d="M 86 96 Q 100 104 114 96" stroke="#7a4422" strokeWidth="2.8" strokeLinecap="round" fill="none" />}
      />
      {/* Pelo azul estilo "pompadour" (hacia adelante) */}
      <path d="M 56 46 Q 54 20 100 14 Q 146 20 144 46 L 144 30 Q 100 24 56 30 Z" fill="#0ea5e9" stroke="#0284c7" strokeWidth="1.5" />
      <path d="M 56 30 Q 56 8 100 6 Q 144 8 144 30 L 144 36 Q 100 30 56 36 Z" fill="#38bdf8" />
      {/* mechones frontales puntiagudos */}
      <path d="M 60 30 L 56 10 L 70 26 Z" fill="#0ea5e9" stroke="#0284c7" strokeWidth="1" />
      <path d="M 140 30 L 144 10 L 130 26 Z" fill="#0ea5e9" stroke="#0284c7" strokeWidth="1" />
    </g>
  );
}

// BROOK - Esqueleto con afro negro, traje negro, violín
function BrookSVG() {
  return (
    <g>
      {/* Piernas (hueso) */}
      <rect x="82" y="168" width="14" height="44" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="104" y="168" width="14" height="44" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Zapatos negros */}
      <rect x="76" y="208" width="24" height="10" rx="3" fill="#1e293b" />
      <rect x="100" y="208" width="24" height="10" rx="3" fill="#1e293b" />
      {/* Brazos (hueso) */}
      <rect x="54" y="120" width="14" height="48" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="132" y="120" width="14" height="48" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Traje negro con esqueleto visible */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#1e293b" stroke="#000000" strokeWidth="1.5" />
      {/* Costillas (hueso visible) */}
      <g stroke="#f8fafc" strokeWidth="2" fill="none">
        <path d="M 82 126 Q 100 130 118 126" />
        <path d="M 82 134 Q 100 138 118 134" />
        <path d="M 82 142 Q 100 146 118 142" />
      </g>
      <line x1="100" y1="120" x2="100" y2="160" stroke="#f8fafc" strokeWidth="2" />
      {/* Cabeza calavera (cráneo blanco) */}
      <ellipse cx="100" cy="75" rx="40" ry="42" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Cuencas de los ojos (negras profundas) */}
      <ellipse cx="84" cy="74" rx="9" ry="11" fill="#0f172a" stroke="#000000" strokeWidth="1.5" />
      <ellipse cx="116" cy="74" rx="9" ry="11" fill="#0f172a" stroke="#000000" strokeWidth="1.5" />
      {/* Brillo en los ojos */}
      <circle cx="86" cy="71" r="2" fill="#f8fafc" opacity="0.8" />
      <circle cx="118" cy="71" r="2" fill="#f8fafc" opacity="0.8" />
      {/* Nariz (agujero triangular) */}
      <path d="M 96 88 L 104 88 L 100 96 Z" fill="#0f172a" />
      {/* Dientes (sonrisa con separaciones) */}
      <rect x="84" y="98" width="32" height="10" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <g stroke="#cbd5e1" strokeWidth="1">
        <line x1="90" y1="98" x2="90" y2="108" />
        <line x1="96" y1="98" x2="96" y2="108" />
        <line x1="104" y1="98" x2="104" y2="108" />
        <line x1="110" y1="98" x2="110" y2="108" />
      </g>
      {/* Afro negro gigante */}
      <g fill="#0f172a" stroke="#000000" strokeWidth="1.5">
        <ellipse cx="100" cy="40" rx="56" ry="34" />
        <ellipse cx="60" cy="50" rx="22" ry="18" />
        <ellipse cx="140" cy="50" rx="22" ry="18" />
        <ellipse cx="100" cy="20" rx="40" ry="20" />
      </g>
      {/* Textura del afro (círculos pequeños) */}
      <g fill="#1e293b" opacity="0.6">
        <circle cx="56" cy="36" r="4" />
        <circle cx="70" cy="22" r="4" />
        <circle cx="100" cy="14" r="4" />
        <circle cx="130" cy="22" r="4" />
        <circle cx="144" cy="36" r="4" />
        <circle cx="48" cy="52" r="4" />
        <circle cx="152" cy="52" r="4" />
      </g>
      {/* Violín (en la mano derecha) */}
      <g transform="rotate(-15 152 150)">
        <ellipse cx="152" cy="150" rx="12" ry="20" fill="#92400e" stroke="#451a03" strokeWidth="1.5" />
        <line x1="152" y1="130" x2="152" y2="170" stroke="#451a03" strokeWidth="1" />
        <line x1="149" y1="130" x2="149" y2="170" stroke="#451a03" strokeWidth="0.6" />
        <line x1="155" y1="130" x2="155" y2="170" stroke="#451a03" strokeWidth="0.6" />
        <rect x="150" y="116" width="4" height="20" rx="1" fill="#451a03" />
      </g>
      {/* Arco del violín */}
      <line x1="160" y1="140" x2="180" y2="160" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
      <line x1="160" y1="140" x2="180" y2="160" stroke="#f8fafc" strokeWidth="0.8" />
    </g>
  );
}

// JINBE - Hombre-pez azul, kimono, bigote, corpulento
function JinbeSVG() {
  return (
    <g>
      {/* Piernas azules */}
      <rect x="78" y="168" width="20" height="48" rx="3" fill="#1e40af" />
      <rect x="78" y="168" width="6" height="48" rx="2" fill="#1e3a8a" />
      <rect x="102" y="168" width="20" height="48" rx="3" fill="#1e40af" />
      <rect x="116" y="168" width="6" height="48" rx="2" fill="#1e3a8a" />
      {/* Sandalias */}
      <rect x="74" y="208" width="28" height="8" rx="2" fill="#78350f" />
      <rect x="98" y="208" width="28" height="8" rx="2" fill="#78350f" />
      {/* Brazos azules corpulentos */}
      <rect x="46" y="116" width="24" height="56" rx="5" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1.5" />
      <rect x="130" y="116" width="24" height="56" rx="5" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1.5" />
      {/* Manos azules (tatuaje de Sol) */}
      <rect x="46" y="166" width="24" height="12" rx="3" fill="#1e40af" />
      <rect x="130" y="166" width="24" height="12" rx="3" fill="#1e40af" />
      {/* Tatuaje del Sol (pirata Gyojin) en mano */}
      <circle cx="58" cy="172" r="5" fill="#0f172a" />
      <g stroke="#0f172a" strokeWidth="1.2" fill="none">
        <line x1="58" y1="164" x2="58" y2="167" />
        <line x1="58" y1="177" x2="58" y2="180" />
        <line x1="50" y1="172" x2="53" y2="172" />
        <line x1="63" y1="172" x2="66" y2="172" />
      </g>
      {/* Kimono tradicional (floreado) */}
      <rect x="70" y="116" width="60" height="56" rx="5" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
      {/* Patrón de flores (círculos amarillos) */}
      <g fill="#fbbf24" opacity="0.85">
        <circle cx="80" cy="128" r="3" />
        <circle cx="110" cy="134" r="3" />
        <circle cx="92" cy="150" r="3" />
        <circle cx="118" cy="158" r="3" />
        <circle cx="78" cy="160" r="3" />
      </g>
      {/* Obi (cinturón amarillo) */}
      <rect x="70" y="156" width="60" height="10" rx="2" fill="#fbbf24" stroke="#ca8a04" strokeWidth="1" />
      {/* Solapa del kimono (V) */}
      <path d="M 84 116 L 100 138 L 116 116" fill="#7f1d1d" stroke="#991b1b" strokeWidth="1" />
      {/* Cabeza azul (Gyojin) */}
      <rect x="60" y="40" width="80" height="70" rx="10" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1.5" />
      <rect x="60" y="40" width="80" height="6" rx="3" fill="#3b82f6" opacity="0.6" />
      {/* Orejas puntiagudas (aletas) */}
      <path d="M 56 64 L 48 54 L 56 76 Z" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1.2" />
      <path d="M 144 64 L 152 54 L 144 76 Z" fill="#1e40af" stroke="#1e3a8a" strokeWidth="1.2" />
      {/* Branquias (a los lados del cuello) */}
      <g stroke="#0f172a" strokeWidth="1.2" fill="none">
        <path d="M 64 100 Q 60 104 64 108" />
        <path d="M 68 100 Q 64 104 68 108" />
        <path d="M 136 100 Q 140 104 136 108" />
        <path d="M 132 100 Q 136 104 132 108" />
      </g>
      {/* Ojos */}
      <ellipse cx="82" cy="74" rx="7" ry="9" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
      <ellipse cx="118" cy="74" rx="7" ry="9" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
      <circle cx="83" cy="76" r="4" fill="#0f172a" />
      <circle cx="119" cy="76" r="4" fill="#0f172a" />
      <circle cx="84" cy="74" r="1.5" fill="#ffffff" />
      <circle cx="120" cy="74" r="1.5" fill="#ffffff" />
      {/* Cejas severas */}
      <path d="M 74 64 L 90 68" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 126 64 L 110 68" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Bigote tradicional (ondulado) */}
      <path d="M 80 96 Q 90 100 100 96 Q 110 100 120 96" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 76 98 Q 84 104 90 100" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 124 98 Q 116 104 110 100" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Pelo negro (moño samurai) */}
      <path d="M 58 46 Q 60 26 100 24 Q 140 26 142 46 L 142 52 Q 100 46 58 52 Z" fill="#0f172a" stroke="#000000" strokeWidth="1" />
      {/* Coleta (moño arriba) */}
      <ellipse cx="100" cy="20" rx="14" ry="8" fill="#0f172a" stroke="#000000" strokeWidth="1.5" />
      <rect x="96" y="22" width="8" height="10" fill="#0f172a" />
      {/* Cinta del moño */}
      <rect x="88" y="18" width="24" height="3" rx="1" fill="#dc2626" />
    </g>
  );
}
