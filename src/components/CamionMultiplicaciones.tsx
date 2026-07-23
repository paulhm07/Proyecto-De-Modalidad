"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Hand,
  PartyPopper,
  RefreshCw,
  Sparkles,
  Truck as TruckIcon,
  Trophy,
  Undo2,
  Package,
} from "lucide-react";
import { nivelesCamion, type NivelCamion } from "@/data/camionMultiplicaciones";
import { Confetti } from "@/components/Toasts";

/* ============================================================
   El Camión de las Multiplicaciones — Minijuego educativo
   ------------------------------------------------------------
   Mecánica:
   1. Un cliente del mercado pide N cajitas con M ítems cada una.
   2. El niño arrastra (o toca) N cajitas desde la pila al camión.
   3. Cada cajita muestra visualmente M ítems (emoji) en su interior.
   4. Al presionar "¡Despachar camión!" se valida:
      - Si cargó exactamente N cajitas → celebración + operación formal.
      - Si cargó de más o de menos → feedback pedagógico.
   5. Avance por 10 niveles hasta "¡Transportista Experto!" 🏆.
   ============================================================ */

type Estado =
  | "presentacion"
  | "cargando"
  | "verificando"
  | "celebrando"
  | "completado";

type ProductoVisual = NivelCamion["producto_visual"];

const AVATARES_CLIENTES = [
  "👵", "👨‍🦱", "🧒", "👩‍🦰", "🧑‍🦱", "👴", "👧", "🧔", "🧓", "👨",
];

const PRODUCTO_EMOJI: Record<ProductoVisual, string> = {
  "cajas de nancites": "🫐",
  "sacos de café": "☕",
  "pacas de rosquillas": "🍩",
  "cajas de pitahayas": "🍈",
  "sacos de frijoles": "🫘",
  "cajas de cuajadas": "🧀",
  "sacos de cacao": "🍫",
  "cajas de pan de leche": "🥖",
};

const PRODUCTO_NOMBRE: Record<ProductoVisual, string> = {
  "cajas de nancites": "nancites",
  "sacos de café": "café",
  "pacas de rosquillas": "rosquillas",
  "cajas de pitahayas": "pitahayas",
  "sacos de frijoles": "frijoles",
  "cajas de cuajadas": "cuajadas",
  "sacos de cacao": "cacao",
  "cajas de pan de leche": "pan de leche",
};

const TOTAL_NIVELES = nivelesCamion.length;

// Cuántas cajitas extra hay en la pila (para permitir "pasarse" o quedarse corto)
const EXTRAS_PILA = 4;

/* ----------------------- Cajita ----------------------- */

type CajitaSize = "sm" | "md" | "lg";

const SIZE_MAP: Record<CajitaSize, { box: string; emoji: string }> = {
  lg: { box: "w-16 h-16 sm:w-20 sm:h-20 p-1 gap-0.5", emoji: "text-sm sm:text-base" },
  md: { box: "w-12 h-12 sm:w-14 sm:h-14 p-0.5 gap-0.5", emoji: "text-[10px] sm:text-xs" },
  sm: { box: "w-9 h-9 p-0.5 gap-0", emoji: "text-[8px]" },
};

function Cajita({
  producto,
  cantidad,
  cargada,
  draggable,
  onClick,
  onDragStart,
  size = "md",
  index,
}: {
  producto: ProductoVisual;
  cantidad: number;
  cargada?: boolean;
  draggable?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
  size?: CajitaSize;
  index: number;
}) {
  const emoji = PRODUCTO_EMOJI[producto];
  const cols = cantidad <= 3 ? cantidad : cantidad <= 6 ? 3 : 4;
  const sz = SIZE_MAP[size];

  return (
    <div
      role={draggable ? "button" : undefined}
      tabIndex={draggable ? 0 : undefined}
      onClick={draggable ? onClick : undefined}
      onKeyDown={(e) => {
        if (!draggable) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      onDragStart={(e) => {
        if (!draggable) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", String(index));
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.();
      }}
      {...(draggable ? ({ draggable: true } as Record<string, unknown>) : {})}
      className={`relative grid shrink-0 select-none place-items-center rounded-lg border-2 shadow-sm transition ${sz.box} ${
        cargada
          ? "border-emerald-500 bg-emerald-50"
          : "border-amber-700 bg-amber-100 hover:border-orange-500 hover:bg-amber-200"
      } ${draggable ? "cursor-grab active:cursor-grabbing hover:scale-105" : ""}`}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      aria-label={`Cajita ${index + 1} con ${cantidad} ${PRODUCTO_NOMBRE[producto]}`}
      title={`Cajita con ${cantidad} ${PRODUCTO_NOMBRE[producto]}`}
    >
      {Array.from({ length: cantidad }).map((_, i) => (
        <span key={i} className={`${sz.emoji} leading-none flex items-center justify-center`}>
          {emoji}
        </span>
      ))}
    </div>
  );
}

/* ----------------------- Camión SVG ----------------------- */

function CamionSVG({
  dragOver,
  cajitasCargadas,
  gruposObjetivo,
}: {
  dragOver: boolean;
  cajitasCargadas: number;
  gruposObjetivo: number;
}) {
  const completo = cajitasCargadas === gruposObjetivo && gruposObjetivo > 0;
  const sePaso = cajitasCargadas > gruposObjetivo;
  const colorBorde = sePaso
    ? "#f43f5e"
    : dragOver
    ? "#10b981"
    : completo
    ? "#10b981"
    : "#92400e";
  const colorRelleno = dragOver ? "#fef3c7" : "#fde68a";

  return (
    <svg viewBox="0 0 320 210" className="w-full drop-shadow-lg" aria-hidden>
      {/* Sombra */}
      <ellipse cx="160" cy="190" rx="140" ry="7" fill="#000000" opacity="0.12" />

      {/* Caja de carga (atrás) */}
      <rect
        x="20"
        y="55"
        width="200"
        height="100"
        rx="10"
        fill={colorRelleno}
        stroke={colorBorde}
        strokeWidth="3"
        style={{ transition: "fill 0.2s, stroke 0.2s" }}
      />
      {/* Techo de la caja (más oscuro) */}
      <rect x="20" y="55" width="200" height="14" rx="6" fill="#92400e" opacity="0.4" />
      {/* Divisiones decorativas verticales */}
      <line x1="80" y1="69" x2="80" y2="155" stroke="#92400e" strokeWidth="1" opacity="0.2" />
      <line x1="160" y1="69" x2="160" y2="155" stroke="#92400e" strokeWidth="1" opacity="0.2" />

      {/* Cabina (teal-600) */}
      <path
        d="M 220 80 L 220 155 L 305 155 L 305 115 Q 305 80 270 80 Z"
        fill="#0d9488"
        stroke="#0f766e"
        strokeWidth="3"
      />
      {/* Ventana */}
      <rect x="232" y="92" width="62" height="28" rx="4" fill="#99f6e4" />
      {/* Brillo de la ventana */}
      <rect x="234" y="94" width="20" height="10" rx="2" fill="#ccfbf1" opacity="0.7" />
      {/* Detalle de la puerta */}
      <line x1="265" y1="125" x2="265" y2="155" stroke="#0f766e" strokeWidth="1.5" opacity="0.6" />
      <circle cx="275" cy="135" r="2.5" fill="#0f766e" />
      {/* Faro delantero */}
      <circle cx="298" cy="145" r="4" fill="#fde047" />

      {/* Ruedas */}
      <circle cx="75" cy="160" r="18" fill="#1f2937" />
      <circle cx="75" cy="160" r="7" fill="#9ca3af" />
      <circle cx="245" cy="160" r="18" fill="#1f2937" />
      <circle cx="245" cy="160" r="7" fill="#9ca3af" />

      {/* Contador flotante sobre la caja de carga */}
      <g>
        <rect
          x="85"
          y="33"
          width="70"
          height="26"
          rx="13"
          fill={completo ? "#10b981" : sePaso ? "#f43f5e" : "#fff7ed"}
          stroke={completo ? "#047857" : sePaso ? "#be123c" : "#92400e"}
          strokeWidth="2"
          style={{ transition: "fill 0.2s" }}
        />
        <text
          x="120"
          y="51"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill={completo || sePaso ? "#ffffff" : "#92400e"}
          fontFamily="Fredoka, sans-serif"
        >
          {cajitasCargadas} / {gruposObjetivo}
        </text>
      </g>

      {/* Línea que "conecta" el contador con la caja */}
      <line x1="120" y1="59" x2="120" y2="55" stroke="#92400e" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

/* ----------------------- Toldos de mercado ----------------------- */

function ToldosMercado() {
  const colores = [
    "#f97316", // orange
    "#f43f5e", // rose
    "#fbbf24", // amber
    "#10b981", // emerald
    "#14b8a6", // teal
    "#f59e0b", // amber-dark
    "#ef4444", // red
    "#84cc16", // lime
  ];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 overflow-hidden sm:h-12"
    >
      <div className="flex h-full w-full">
        {colores.map((c, i) => (
          <div key={i} className="relative flex-1" style={{ backgroundColor: c }}>
            {/* Onda inferior (triángulos) */}
            <svg
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
              className="absolute -bottom-px left-0 h-6 w-full sm:h-8"
            >
              <polygon points="0,0 50,30 100,0" fill={c} />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------- Componente principal ----------------------- */

export function CamionMultiplicaciones() {
  const [nivelIdx, setNivelIdx] = useState(0);
  const [estado, setEstado] = useState<Estado>("presentacion");
  const [cajitasCargadas, setCajitasCargadas] = useState<number[]>([]);
  const [camionesDespachados, setCamionesDespachados] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [dragOverCamion, setDragOverCamion] = useState(false);

  // Ref para timeouts internos (limpieza segura al desmontar)
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const programar = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timeoutsRef.current.delete(t);
      fn();
    }, ms);
    timeoutsRef.current.add(t);
  }, []);

  useEffect(() => {
    const set = timeoutsRef.current;
    return () => {
      set.forEach((t) => clearTimeout(t));
      set.clear();
    };
  }, []);

  const nivel = nivelesCamion[nivelIdx];
  const avatar = AVATARES_CLIENTES[nivelIdx % AVATARES_CLIENTES.length];
  const totalPila = nivel.grupos + EXTRAS_PILA;
  const indicesPila = useMemo(
    () => Array.from({ length: totalPila }, (_, i) => i),
    [totalPila],
  );
  const cajitasEnPila = indicesPila.filter((i) => !cajitasCargadas.includes(i));

  /* ---- Transición: celebrando → siguiente nivel o completado ---- */
  useEffect(() => {
    if (estado !== "celebrando") return;
    const t = setTimeout(() => {
      if (nivelIdx + 1 >= TOTAL_NIVELES) {
        setEstado("completado");
      } else {
        setNivelIdx((n) => n + 1);
        setCajitasCargadas([]);
        setFeedback(null);
        setEstado("presentacion");
      }
    }, 2800);
    return () => clearTimeout(t);
  }, [estado, nivelIdx]);

  /* ---- Acciones ---- */

  const empezarCarga = useCallback(() => {
    setEstado("cargando");
    setFeedback(null);
  }, []);

  const cargarCajita = useCallback(
    (i: number) => {
      if (cajitasCargadas.includes(i)) return;
      setCajitasCargadas((p) => [...p, i]);
      setFeedback(null);
    },
    [cajitasCargadas],
  );

  const quitarCajita = useCallback((i: number) => {
    setCajitasCargadas((p) => p.filter((x) => x !== i));
    setFeedback(null);
  }, []);

  const vaciarCamion = useCallback(() => {
    setCajitasCargadas([]);
    setFeedback(null);
  }, []);

  const despachar = useCallback(() => {
    if (estado !== "cargando") return;
    setEstado("verificando");
    const correcto = cajitasCargadas.length === nivel.grupos;
    programar(() => {
      if (correcto) {
        setCamionesDespachados((v) => v + 1);
        setEstado("celebrando");
      } else {
        setFeedback(nivel.feedback_error);
        setEstado("cargando");
      }
    }, 450);
  }, [estado, cajitasCargadas.length, nivel.grupos, nivel.feedback_error, programar]);

  const reiniciarJuego = useCallback(() => {
    setNivelIdx(0);
    setEstado("presentacion");
    setCajitasCargadas([]);
    setCamionesDespachados(0);
    setFeedback(null);
  }, []);

  /* ---- Drag handlers para el camión ---- */
  const onDropCamion = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverCamion(false);
      const idx = Number(e.dataTransfer.getData("text/plain"));
      if (!Number.isNaN(idx)) cargarCajita(idx);
    },
    [cargarCajita],
  );

  /* ---- Derivados ---- */
  const progresoNivel = useMemo(
    () => ((nivelIdx + (estado === "celebrando" ? 1 : 0)) / TOTAL_NIVELES) * 100,
    [nivelIdx, estado],
  );
  const esPresentacion = estado === "presentacion";
  const esCargando = estado === "cargando";
  const esVerificando = estado === "verificando";
  const esCelebrando = estado === "celebrando";
  const puedeDespachar = esCargando && cajitasCargadas.length > 0;

  /* ---- Tamaños de cajitas según cantidad de grupos ---- */
  const sizePila: CajitaSize =
    nivel.grupos > 12 ? "sm" : nivel.grupos > 6 ? "md" : "lg";
  const sizeCamion: CajitaSize = nivel.grupos > 6 ? "sm" : "md";

  /* ===================== RENDER ===================== */

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-br from-amber-100 via-orange-200 to-rose-200 font-display">
      {/* Toldos de mercado arriba */}
      <ToldosMercado />

      {/* Decoración de fondo: mercado nicaragüense */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute left-4 top-24 text-7xl">🥭</div>
        <div className="absolute right-8 top-32 text-7xl">🌽</div>
        <div className="absolute left-10 bottom-24 text-7xl">🪅</div>
        <div className="absolute right-12 bottom-32 text-7xl">🥖</div>
        <div className="absolute left-1/3 top-12 text-6xl">☕</div>
        <div className="absolute right-1/3 bottom-16 text-6xl">🍫</div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-3 pb-6 pt-14 sm:px-5 sm:pt-16">
        {/* ===================== HUD superior ===================== */}
        <div className="mb-4 rounded-2xl border-2 border-teal-200 bg-white/70 p-3 shadow-md backdrop-blur sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow sm:h-11 sm:w-11">
                <TruckIcon size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-teal-700/70">
                  El Camión
                </p>
                <p className="text-base font-bold text-teal-950 sm:text-lg">
                  Nivel {nivel.nivel} <span className="text-teal-600/60">de {TOTAL_NIVELES}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border-2 border-lime-300 bg-lime-50 px-3 py-1.5">
                <Package size={15} className="text-lime-700" strokeWidth={2.5} />
                <span className="text-sm font-bold text-lime-800">
                  {camionesDespachados} <span className="hidden sm:inline">despachados</span>
                </span>
              </div>
            </div>
          </div>
          {/* Barra de progreso */}
          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-teal-200/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-lime-400 transition-all duration-700 ease-out"
              style={{ width: `${progresoNivel}%` }}
            />
          </div>
        </div>

        {/* ===================== Pantalla: completado ===================== */}
        {estado === "completado" ? (
          <PantallaCompletado onReiniciar={reiniciarJuego} camiones={camionesDespachados} />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* ============ Columna izquierda: cliente + camión ============ */}
            <div className="flex flex-col gap-4">
              {/* Cliente con bocadillo */}
              <div className="rounded-3xl border-2 border-rose-200 bg-white/80 p-4 shadow-lg backdrop-blur sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-rose-100 text-4xl shadow-inner sm:h-20 sm:w-20 sm:text-5xl">
                    {avatar}
                  </div>
                  <div className="relative flex-1 rounded-2xl border-2 border-teal-300 bg-amber-50 px-4 py-3 shadow-sm">
                    <div className="absolute -left-2 top-5 h-4 w-4 rotate-45 border-b-2 border-l-2 border-teal-300 bg-amber-50" />
                    <p className="text-base font-semibold leading-snug text-teal-950 sm:text-lg">
                      {nivel.frase_del_cliente}
                    </p>
                  </div>
                </div>

                {/* Encargo visual (sin revelar la respuesta) */}
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-teal-100/60 py-2">
                  <span className="text-sm font-semibold text-teal-800">Encargo:</span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1 text-base font-bold text-teal-900 shadow-sm">
                    {nivel.grupos} cajitas
                  </span>
                  <span className="text-sm font-bold text-teal-500">×</span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1 text-base font-bold text-teal-900 shadow-sm">
                    {nivel.elementos_por_grupo} {PRODUCTO_EMOJI[nivel.producto_visual]}
                  </span>
                </div>

                <p className="mt-2 text-center text-xs font-medium text-teal-700/70">
                  📍 {nivel.contexto_nicaraguense}
                </p>
              </div>

              {/* Camión + drop zone + cajitas cargadas */}
              <div
                onDragOver={(e) => {
                  if (esCargando) {
                    e.preventDefault();
                    setDragOverCamion(true);
                  }
                }}
                onDragLeave={() => setDragOverCamion(false)}
                onDrop={onDropCamion}
                className={`rounded-3xl border-[3px] p-4 shadow-lg backdrop-blur transition-all sm:p-5 ${
                  dragOverCamion
                    ? "border-emerald-400 bg-emerald-50/90 scale-[1.02]"
                    : esCargando
                    ? "border-dashed border-teal-400 bg-white/80"
                    : "border-teal-200 bg-white/70"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-sm font-bold text-teal-950 sm:text-base">
                    <TruckIcon size={16} className="text-teal-600" strokeWidth={2.5} />
                    Camión de carga
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      cajitasCargadas.length === nivel.grupos && nivel.grupos > 0
                        ? "bg-emerald-100 text-emerald-800"
                        : cajitasCargadas.length > nivel.grupos
                        ? "bg-rose-100 text-rose-800"
                        : "bg-teal-100 text-teal-800"
                    }`}
                  >
                    {cajitasCargadas.length} / {nivel.grupos} cajitas
                  </span>
                </div>

                {/* SVG del camión */}
                <div className="mx-auto w-full max-w-md">
                  <CamionSVG
                    dragOver={dragOverCamion}
                    cajitasCargadas={cajitasCargadas.length}
                    gruposObjetivo={nivel.grupos}
                  />
                </div>

                {/* Cajitas cargadas (dentro del camión) — scrollable si son muchas */}
                {cajitasCargadas.length === 0 ? (
                  <div className="mt-2 flex h-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50/40 text-center">
                    <span className="text-2xl opacity-50">📦</span>
                    <p className="text-xs font-semibold text-teal-600/70 sm:text-sm">
                      {esCargando
                        ? "Arrastrá (o tocá) las cajitas aquí"
                        : "Presioná ¡Empezar a cargar! para recibir el encargo"}
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 max-h-44 overflow-y-auto rounded-2xl bg-teal-50/60 p-2 sm:max-h-52">
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {cajitasCargadas.map((i) => (
                        <button
                          key={i}
                          onClick={() => quitarCajita(i)}
                          className="group relative rounded-lg bg-white p-0.5 shadow-sm transition hover:scale-105 hover:bg-rose-50"
                          title="Quitar del camión"
                          aria-label={`Quitar cajita ${i + 1} del camión`}
                        >
                          <Cajita
                            producto={nivel.producto_visual}
                            cantidad={nivel.elementos_por_grupo}
                            cargada
                            draggable={false}
                            index={i}
                            size={sizeCamion}
                          />
                          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white opacity-0 shadow transition group-hover:opacity-100">
                            ✕
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {cajitasCargadas.length > 0 && esCargando && (
                  <p className="mt-1.5 text-center text-xs font-semibold text-teal-600/70">
                    Toca una cajita para regresarla a la pila
                  </p>
                )}
              </div>
            </div>

            {/* ============ Columna derecha: pila + feedback + botones ============ */}
            <div className="flex flex-col gap-4">
              {/* Pila de cajitas disponibles */}
              <div className="rounded-3xl border-2 border-amber-300 bg-white/80 p-4 shadow-lg backdrop-blur sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-sm font-bold text-amber-950 sm:text-base">
                    <Package size={16} className="text-amber-700" strokeWidth={2.5} />
                    Pila de cajitas
                  </h3>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                    {cajitasEnPila.length} disponibles
                  </span>
                </div>

                <div className="mb-3 rounded-xl bg-amber-50/70 px-3 py-2 text-center text-xs font-semibold text-amber-800 sm:text-sm">
                  <Hand size={13} className="mr-1 inline" strokeWidth={2.5} />
                  Arrastrá (o tocá) <b>{nivel.grupos}</b> cajitas al camión. ¡Cada una trae{" "}
                  <b>{nivel.elementos_por_grupo}</b>{" "}
                  {PRODUCTO_NOMBRE[nivel.producto_visual]}!
                </div>

                <div
                  className="max-h-80 overflow-y-auto rounded-2xl bg-amber-50/50 p-2"
                  style={{
                    scrollbarWidth: "thin",
                  }}
                >
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {cajitasEnPila.length === 0 ? (
                      <p className="py-4 text-center text-sm font-semibold text-amber-700/70">
                        Todas las cajitas están en el camión
                      </p>
                    ) : (
                      cajitasEnPila.map((i) => (
                        <Cajita
                          key={i}
                          producto={nivel.producto_visual}
                          cantidad={nivel.elementos_por_grupo}
                          draggable={esCargando}
                          onClick={() => cargarCajita(i)}
                          onDragStart={() => {}}
                          index={i}
                          size={sizePila}
                        />
                      ))
                    )}
                  </div>
                </div>

                {cajitasCargadas.length > 0 && esCargando && (
                  <button
                    onClick={vaciarCamion}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-amber-300 bg-white py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-50"
                  >
                    <Undo2 size={14} strokeWidth={2.5} /> Vaciar camión
                  </button>
                )}
              </div>

              {/* Feedback de error */}
              {feedback && esCargando && (
                <div className="animate-bounce-in rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-3 shadow">
                  <p className="flex items-start gap-2 text-sm font-semibold text-amber-900">
                    <span className="text-lg">💡</span>
                    <span>{feedback}</span>
                  </p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-2">
                {esPresentacion && (
                  <button
                    onClick={empezarCarga}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 py-3.5 text-base font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-95"
                  >
                    <Sparkles size={18} strokeWidth={2.5} /> ¡Empezar a cargar!
                  </button>
                )}
                {(esCargando || esVerificando) && (
                  <button
                    onClick={despachar}
                    disabled={!puedeDespachar || esVerificando}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-bold shadow-md transition active:scale-95 ${
                      puedeDespachar
                        ? "bg-gradient-to-r from-lime-400 to-emerald-500 text-white hover:scale-[1.02] hover:shadow-lg"
                        : "cursor-not-allowed bg-teal-200 text-teal-500/70"
                    }`}
                  >
                    {esVerificando ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" strokeWidth={2.5} /> Revisando…
                      </>
                    ) : (
                      <>
                        <Check size={18} strokeWidth={2.5} /> ¡Despachar camión!
                      </>
                    )}
                  </button>
                )}
                {esCelebrando && (
                  <button
                    disabled
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-500 py-3.5 text-base font-bold text-white shadow-md"
                  >
                    <PartyPopper size={18} strokeWidth={2.5} /> ¡Bien hecho!
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Overlay de celebración con operación formal */}
        {esCelebrando && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-24 sm:pt-32">
            <div className="animate-bounce-in rounded-3xl border-2 border-emerald-300 bg-white/95 px-6 py-4 shadow-2xl">
              <p className="text-center text-sm font-bold uppercase tracking-wide text-emerald-700">
                ¡Camión despachado!
              </p>
              <p className="mt-1 text-center text-3xl font-bold text-emerald-900 sm:text-4xl">
                {nivel.operacion_formal}
              </p>
              <p className="mt-1 text-center text-xs font-semibold text-emerald-700 sm:text-sm">
                {nivel.grupos} cajitas × {nivel.elementos_por_grupo}{" "}
                {PRODUCTO_NOMBRE[nivel.producto_visual]} cada una
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confeti al celebrar */}
      {esCelebrando && <Confetti duracionMs={2800} cantidad={48} />}
    </div>
  );
}

/* ----------------------- Pantalla final ----------------------- */

function PantallaCompletado({
  onReiniciar,
  camiones,
}: {
  onReiniciar: () => void;
  camiones: number;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="animate-bounce-in rounded-3xl border-2 border-teal-300 bg-white/90 p-8 text-center shadow-2xl backdrop-blur">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-300 to-emerald-400 shadow-lg">
          <Trophy size={52} className="animate-trophy-float text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-bold text-teal-950 sm:text-4xl">
          ¡Transportista Experto!
        </h2>
        <p className="mt-2 text-base font-semibold text-teal-700 sm:text-lg">
          Despachaste <span className="text-emerald-600">{camiones}</span> camiones con éxito en el
          mercado nicaragüense. 🎉
        </p>
        <p className="mt-1 text-sm font-medium text-teal-600/80">
          Aprendiste a multiplicar cargando cajitas de nancites, café, rosquillas, pitahayas,
          frijoles, cuajadas, cacao y pan de leche.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-3xl">
          <span>🫐</span>
          <span>☕</span>
          <span>🍩</span>
          <span>🍈</span>
          <span>🫘</span>
          <span>🧀</span>
          <span>🍫</span>
          <span>🥖</span>
          <span>🏆</span>
        </div>

        <button
          onClick={onReiniciar}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 py-3.5 text-base font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-95 sm:w-auto sm:px-8"
        >
          <RefreshCw size={18} strokeWidth={2.5} /> Jugar de nuevo
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
