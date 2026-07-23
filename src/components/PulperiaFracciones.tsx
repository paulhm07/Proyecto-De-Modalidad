"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Hand,
  PartyPopper,
  RefreshCw,
  Scissors,
  ShoppingCart,
  Sparkles,
  Store,
  Trophy,
  Undo2,
} from "lucide-react";
import { nivelesPulperia, type NivelPulperia } from "@/data/pulperiaFracciones";
import { Confetti } from "@/components/Toasts";

/* ============================================================
   La Pulpería de Fracciones — Minijuego educativo
   ------------------------------------------------------------
   Mecánica:
   1. Llega un cliente y pide una fracción de un producto.
   2. El niño corta el producto en `denominador_cortes` partes.
   3. Arrastra (o toca) `numerador_pedido` partes a la canasta.
   4. Entrega el pedido. Si acierta, celebra y avanza de nivel.
   ============================================================ */

type Estado =
  | "presentacion"
  | "cortando"
  | "arrastrando"
  | "verificando"
  | "celebrando"
  | "completado";

type ObjetoVisual = NivelPulperia["objeto_visual"];

const AVATARES_CLIENTES = [
  "👵", "👨‍🦱", "🧒", "👩‍🦰", "🧑‍🦱", "👴", "👧", "🧔", "🧓", "👨",
];

const OBJETO_EMOJI: Record<ObjetoVisual, string> = {
  sandía: "🍉",
  "pastel de tres leches": "🍰",
  piña: "🍍",
  cuajada: "🧀",
  "barra de jabón de lavar": "🧼",
};

const OBJETO_NOMBRE: Record<ObjetoVisual, string> = {
  sandía: "Sandía",
  "pastel de tres leches": "Pastel de tres leches",
  piña: "Piña",
  cuajada: "Cuajada",
  "barra de jabón de lavar": "Jabón de lavar",
};

const TOTAL_NIVELES = nivelesPulperia.length;

/* ----------------------- Helpers geométricos ----------------------- */

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function pieSlicePath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const p1 = polar(cx, cy, r, a1);
  const p2 = polar(cx, cy, r, a2);
  const largeArc = a2 - a1 > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
}

/* ----------------------- Fracción visual ----------------------- */

function Fraccion({
  num,
  den,
  className = "",
}: {
  num: string | number;
  den: string | number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex flex-col items-center align-middle mx-1 leading-none ${className}`}
    >
      <span className="font-bold text-lg sm:text-xl">{num}</span>
      <span className="block w-full border-t-[3px] border-current my-0.5" />
      <span className="font-bold text-lg sm:text-xl">{den}</span>
    </span>
  );
}

/** Convierte "Hola $\frac{1}{2}$ porfa" en nodos React con fracción visual. */
function renderFrase(frase: string): React.ReactNode[] {
  const partes: React.ReactNode[] = [];
  const regex = /\$\\frac\{(\d+)\}\{(\d+)\}\$/g;
  let ultimo = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = regex.exec(frase)) !== null) {
    if (m.index > ultimo) {
      partes.push(<span key={`t-${k++}`}>{frase.slice(ultimo, m.index)}</span>);
    }
    partes.push(<Fraccion key={`f-${k++}`} num={m[1]} den={m[2]} />);
    ultimo = regex.lastIndex;
  }
  if (ultimo < frase.length) {
    partes.push(<span key={`t-${k++}`}>{frase.slice(ultimo)}</span>);
  }
  return partes;
}

/* ----------------------- SVG del producto ----------------------- */

/** Dibuja una sola pieza (circular o rectangular) del producto. */
function PiezaProducto({
  objeto,
  indice,
  total,
  cortesHechos,
  oculta,
  draggable,
  onClick,
  onDragStart,
}: {
  objeto: ObjetoVisual;
  indice: number;
  total: number;
  cortesHechos: boolean;
  oculta: boolean;
  draggable: boolean;
  onClick: () => void;
  onDragStart: () => void;
}) {
  const delayCorte = `${indice * 110}ms`;
  const estiloCorte: React.CSSProperties = {
    opacity: cortesHechos ? 1 : 0,
    transition: "opacity 0.45s ease",
    transitionDelay: delayCorte,
  };
  const estiloGrupo: React.CSSProperties = {
    opacity: oculta ? 0 : 1,
    transition: "opacity 0.35s ease",
    cursor: draggable && !oculta ? "grab" : "default",
    pointerEvents: oculta ? "none" : "auto",
  };

  let contenido: React.ReactNode = null;

  if (objeto === "sandía") {
    const a1 = indice * (360 / total);
    const a2 = (indice + 1) * (360 / total);
    contenido = (
      <>
        {/* Cascá verde (radio exterior) */}
        <path d={pieSlicePath(100, 100, 92, a1, a2)} fill="#16a34a" />
        {/* Pulpa rosada (radio interior) */}
        <path d={pieSlicePath(100, 100, 78, a1, a2)} fill="#fb7185" />
        {/* Brillo sutil de la pulpa */}
        <path
          d={pieSlicePath(100, 100, 78, a1, a2)}
          fill="none"
          stroke="#fda4af"
          strokeWidth={2}
          opacity={0.55}
        />
        {/* Semillas */}
        {semillasSandia(indice, total, a1, a2)}
        {/* Borde de corte */}
        <path
          d={pieSlicePath(100, 100, 92, a1, a2)}
          fill="none"
          stroke="#14532d"
          strokeWidth={1.8}
          style={estiloCorte}
        />
      </>
    );
  } else if (objeto === "cuajada") {
    const a1 = indice * (360 / total);
    const a2 = (indice + 1) * (360 / total);
    contenido = (
      <>
        <path d={pieSlicePath(100, 100, 90, a1, a2)} fill="#fef3c7" />
        {/* Capa tostada superior */}
        <path d={pieSlicePath(100, 100, 90, a1, a2)} fill="#fcd34d" opacity={0.45} />
        {/* Textura de la cuajada */}
        <path
          d={pieSlicePath(100, 100, 90, a1, a2)}
          fill="none"
          stroke="#d97706"
          strokeWidth={1}
          opacity={0.35}
        />
        {/* Borde de corte */}
        <path
          d={pieSlicePath(100, 100, 90, a1, a2)}
          fill="none"
          stroke="#92400e"
          strokeWidth={1.8}
          style={estiloCorte}
        />
      </>
    );
  } else if (objeto === "pastel de tres leches") {
    const stripW = 160 / total;
    const x = 20 + indice * stripW;
    const yTop = 45;
    const alto = 120;
    contenido = (
      <>
        {/* Bizcocho abajo */}
        <rect x={x} y={yTop + alto * 0.62} width={stripW} height={alto * 0.38} fill="#fcd34d" />
        {/* Crema del medio */}
        <rect x={x} y={yTop + alto * 0.3} width={stripW} height={alto * 0.32} fill="#fff7ed" />
        {/* Bizcocho arriba */}
        <rect x={x} y={yTop} width={stripW} height={alto * 0.3} fill="#fde68a" />
        {/* Glaseado blanco encima */}
        <rect x={x} y={yTop - 4} width={stripW} height={8} fill="#ffffff" rx={2} />
        {/* Cereza en el pedazo central */}
        {indice === Math.floor(total / 2) && (
          <>
            <circle cx={x + stripW / 2} cy={yTop - 8} r={6} fill="#dc2626" />
            <path
              d={`M ${x + stripW / 2} ${yTop - 14} q 4 -4 8 -2`}
              fill="none"
              stroke="#16a34a"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </>
        )}
        {/* Borde de corte */}
        <rect
          x={x}
          y={yTop}
          width={stripW}
          height={alto}
          fill="none"
          stroke="#92400e"
          strokeWidth={1.8}
          style={estiloCorte}
        />
      </>
    );
  } else if (objeto === "piña") {
    const stripW = 150 / total;
    const x = 25 + indice * stripW;
    const yTop = 55;
    const alto = 120;
    contenido = (
      <>
        {/* Cuerpo amarillo */}
        <rect x={x} y={yTop} width={stripW} height={alto} fill="#fde047" rx={2} />
        {/* Patrón de rombos marrones */}
        {Array.from({ length: 4 }).map((_, r) =>
          Array.from({ length: Math.max(1, Math.ceil(total / 2)) }).map((_, c) => {
            const cx = x + 6 + c * 10;
            const cy = yTop + 12 + r * 28;
            if (cx < x || cx > x + stripW - 4) return null;
            return (
              <path
                key={`r-${r}-${c}`}
                d={`M ${cx} ${cy - 4} L ${cx + 4} ${cy} L ${cx} ${cy + 4} L ${cx - 4} ${cy} Z`}
                fill="#92400e"
                opacity={0.55}
              />
            );
          }),
        )}
        {/* Hojas de la corona (solo en los pedazos de los extremos y centro) */}
        {(indice === 0 || indice === total - 1 || indice === Math.floor(total / 2)) && (
          <path
            d={`M ${x + stripW / 2} ${yTop} L ${x + stripW / 2 - 6} ${yTop - 22} L ${x + stripW / 2} ${yTop - 14} L ${x + stripW / 2 + 6} ${yTop - 22} Z`}
            fill="#16a34a"
          />
        )}
        {/* Borde de corte */}
        <rect
          x={x}
          y={yTop}
          width={stripW}
          height={alto}
          fill="none"
          stroke="#92400e"
          strokeWidth={1.8}
          style={estiloCorte}
        />
      </>
    );
  } else if (objeto === "barra de jabón de lavar") {
    const stripW = 160 / total;
    const x = 20 + indice * stripW;
    const yTop = 60;
    const alto = 80;
    contenido = (
      <>
        {/* Cuerpo del jabón (amarillo crema, jabón de lavar nicaragüense) */}
        <rect x={x} y={yTop} width={stripW} height={alto} fill="#fef08a" rx={6} />
        {/* Brillo superior */}
        <rect x={x} y={yTop} width={stripW} height={alto * 0.3} fill="#fef9c3" rx={6} />
        {/* Banda de etiqueta */}
        <rect x={x} y={yTop + alto * 0.4} width={stripW} height={alto * 0.2} fill="#b45309" opacity={0.75} />
        {stripW > 18 && (
          <text
            x={x + stripW / 2}
            y={yTop + alto * 0.55}
            textAnchor="middle"
            fontSize={7}
            fontWeight="bold"
            fill="#fff7ed"
            fontFamily="Fredoka, sans-serif"
          >
            JABÓN
          </text>
        )}
        {/* Borde de corte */}
        <rect
          x={x}
          y={yTop}
          width={stripW}
          height={alto}
          fill="none"
          stroke="#92400e"
          strokeWidth={1.8}
          style={estiloCorte}
        />
      </>
    );
  }

  return (
    <g
      style={estiloGrupo}
      onClick={() => {
        if (draggable && !oculta) onClick();
      }}
      onDragStart={(e) => {
        if (!draggable || oculta) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", String(indice));
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      {...(draggable && !oculta ? ({ draggable: true } as Record<string, unknown>) : {})}
    >
      {contenido}
    </g>
  );
}

/** Semillas de sandía distribuidas dentro de la pulpa de una rebanada. */
function semillasSandia(indice: number, total: number, a1: number, a2: number) {
  const cx = 100;
  const cy = 100;
  const midAngle = (a1 + a2) / 2;
  const sliceAngle = a2 - a1;
  const numSemillas = total <= 3 ? 3 : total <= 6 ? 2 : 1;
  return Array.from({ length: numSemillas }).map((_, s) => {
    const offset = (s - (numSemillas - 1) / 2) * (sliceAngle / (numSemillas + 1));
    const angle = midAngle + offset;
    const r = 52;
    const pos = polar(cx, cy, r, angle);
    return (
      <ellipse
        key={s}
        cx={pos.x}
        cy={pos.y}
        rx={2.4}
        ry={4}
        fill="#1f2937"
        transform={`rotate(${angle} ${pos.x} ${pos.y})`}
      />
    );
  });
}

/** Icono pequeño de una pieza para mostrar dentro de la canasta. */
function PiezaIcon({ objeto, indice, total }: { objeto: ObjetoVisual; indice: number; total: number }) {
  return (
    <svg viewBox="0 0 200 200" className="h-12 w-12 sm:h-14 sm:w-14 drop-shadow">
      <PiezaProducto
        objeto={objeto}
        indice={indice}
        total={total}
        cortesHechos
        oculta={false}
        draggable={false}
        onClick={() => {}}
        onDragStart={() => {}}
      />
    </svg>
  );
}

/* ----------------------- Componente principal ----------------------- */

export function PulperiaFracciones() {
  const [nivelIdx, setNivelIdx] = useState(0);
  const [estado, setEstado] = useState<Estado>("presentacion");
  const [cortesHechos, setCortesHechos] = useState(false);
  const [piezasEnCanasta, setPiezasEnCanasta] = useState<number[]>([]);
  const [ventasExitosas, setVentasExitosas] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [dragOverCanasta, setDragOverCanasta] = useState(false);
  const [cortandoAnim, setCortandoAnim] = useState(false);

  // Ref para timeouts internos (limpieza segura al desmontar)
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const programar = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timeoutsRef.current.delete(t);
      fn();
    }, ms);
    timeoutsRef.current.add(t);
  }, []);

  // Limpieza de todos los timeouts pendientes al desmontar
  useEffect(() => {
    const set = timeoutsRef.current;
    return () => {
      set.forEach((t) => clearTimeout(t));
      set.clear();
    };
  }, []);

  const nivel = nivelesPulperia[nivelIdx];
  const avatar = AVATARES_CLIENTES[nivelIdx % AVATARES_CLIENTES.length];
  const totalPiezas = nivel.denominador_cortes;

  /* ---- Transición: celebrando → siguiente nivel o completado ---- */
  useEffect(() => {
    if (estado !== "celebrando") return;
    const t = setTimeout(() => {
      if (nivelIdx + 1 >= TOTAL_NIVELES) {
        setEstado("completado");
      } else {
        setNivelIdx((n) => n + 1);
        setPiezasEnCanasta([]);
        setCortesHechos(false);
        setFeedback(null);
        setCortandoAnim(false);
        setEstado("presentacion");
      }
    }, 2800);
    return () => clearTimeout(t);
  }, [estado, nivelIdx]);

  /* ---- Acciones ---- */

  const empezarNivel = useCallback(() => {
    setEstado("cortando");
    setFeedback(null);
  }, []);

  const cortar = useCallback(() => {
    if (estado !== "cortando" || cortesHechos) return;
    setCortesHechos(true);
    setCortandoAnim(true);
    // Tras la animación de cortes, permitir arrastrar
    programar(() => {
      setEstado("arrastrando");
      setCortandoAnim(false);
    }, 1300);
  }, [estado, cortesHechos, programar]);

  const agregarACanasta = useCallback(
    (i: number) => {
      if (piezasEnCanasta.includes(i)) return;
      setPiezasEnCanasta((p) => [...p, i]);
      setFeedback(null);
    },
    [piezasEnCanasta],
  );

  const quitarDeCanasta = useCallback((i: number) => {
    setPiezasEnCanasta((p) => p.filter((x) => x !== i));
    setFeedback(null);
  }, []);

  const vaciarCanasta = useCallback(() => {
    setPiezasEnCanasta([]);
    setFeedback(null);
  }, []);

  const entregar = useCallback(() => {
    if (estado !== "arrastrando") return;
    setEstado("verificando");
    const correcto = piezasEnCanasta.length === nivel.numerador_pedido;
    // Pequeña pausa dramática
    programar(() => {
      if (correcto) {
        setVentasExitosas((v) => v + 1);
        setEstado("celebrando");
      } else {
        setFeedback(nivel.feedback_error);
        setEstado("arrastrando");
      }
    }, 450);
  }, [estado, piezasEnCanasta.length, nivel.numerador_pedido, nivel.feedback_error, programar]);

  const reiniciarJuego = useCallback(() => {
    setNivelIdx(0);
    setEstado("presentacion");
    setCortesHechos(false);
    setPiezasEnCanasta([]);
    setVentasExitosas(0);
    setFeedback(null);
    setCortandoAnim(false);
  }, []);

  /* ---- Drag handlers para la canasta ---- */
  const onDropCanasta = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverCanasta(false);
      const idx = Number(e.dataTransfer.getData("text/plain"));
      if (!Number.isNaN(idx)) agregarACanasta(idx);
    },
    [agregarACanasta],
  );

  /* ---- Derivados ---- */
  const progresoNivel = useMemo(
    () => ((nivelIdx + (estado === "celebrando" ? 1 : 0)) / TOTAL_NIVELES) * 100,
    [nivelIdx, estado],
  );
  const necesitaCortar = estado === "cortando" && !cortesHechos;
  const esPresentacion = estado === "presentacion";
  const esArrastrando = estado === "arrastrando";
  const esVerificando = estado === "verificando";
  const esCelebrando = estado === "celebrando";
  const puedeEntregar = esArrastrando && piezasEnCanasta.length > 0;
  const esCorrecto = esCelebrando;

  /* ===================== RENDER ===================== */

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-br from-amber-50 via-orange-100 to-rose-100 font-display">
      {/* Decoración de fondo: estantes de pulpería */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute left-4 top-20 text-7xl">🥫</div>
        <div className="absolute right-8 top-32 text-7xl">🧴</div>
        <div className="absolute left-10 bottom-24 text-7xl">🌽</div>
        <div className="absolute right-12 bottom-32 text-7xl">🥖</div>
        <div className="absolute left-1/3 top-10 text-6xl">🪅</div>
        <div className="absolute right-1/3 bottom-16 text-6xl">🍯</div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-3 py-4 sm:px-5 sm:py-6">
        {/* ===================== HUD superior ===================== */}
        <div className="mb-4 rounded-2xl border-2 border-orange-200 bg-white/70 p-3 shadow-md backdrop-blur sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-rose-400 text-white shadow sm:h-11 sm:w-11">
                <Store size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-orange-700/70">
                  La Pulpería
                </p>
                <p className="text-base font-bold text-orange-950 sm:text-lg">
                  Nivel {nivel.nivel} <span className="text-orange-600/60">de {TOTAL_NIVELES}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border-2 border-emerald-300 bg-emerald-50 px-3 py-1.5">
                <ShoppingCart size={15} className="text-emerald-600" strokeWidth={2.5} />
                <span className="text-sm font-bold text-emerald-800">
                  {ventasExitosas} <span className="hidden sm:inline">ventas</span>
                </span>
              </div>
            </div>
          </div>
          {/* Barra de progreso */}
          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-orange-200/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-all duration-700 ease-out"
              style={{ width: `${progresoNivel}%` }}
            />
          </div>
        </div>

        {/* ===================== Pantalla: completado ===================== */}
        {estado === "completado" ? (
          <PantallaCompletado onReiniciar={reiniciarJuego} ventas={ventasExitosas} />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {/* ============ Columna izquierda: producto + corte ============ */}
            <div className="rounded-3xl border-2 border-orange-200 bg-white/80 p-4 shadow-lg backdrop-blur sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-orange-950 sm:text-xl">
                  <span className="text-2xl">{OBJETO_EMOJI[nivel.objeto_visual]}</span>
                  {OBJETO_NOMBRE[nivel.objeto_visual]}
                </h2>
                <span className="rounded-full border-2 border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  {totalPiezas} pedazos
                </span>
              </div>

              {/* Zona del producto (SVG) */}
              <div className="relative mx-auto aspect-square w-full max-w-sm rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 p-2 shadow-inner">
                {/* Tabla de cortar */}
                <div className="absolute inset-2 rounded-xl border-2 border-amber-200/60" aria-hidden />
                <svg
                  viewBox="0 0 200 200"
                  className="relative h-full w-full"
                  onClick={necesitaCortar ? cortar : undefined}
                  role={necesitaCortar ? "button" : undefined}
                  aria-label={
                    necesitaCortar
                      ? `Cortar ${OBJETO_NOMBRE[nivel.objeto_visual]} en ${totalPiezas} partes`
                      : undefined
                  }
                >
                  {/* Plato sombra */}
                  <ellipse cx="100" cy="180" rx="80" ry="8" fill="#000000" opacity={0.08} />
                  {Array.from({ length: totalPiezas }).map((_, i) => (
                    <PiezaProducto
                      key={i}
                      objeto={nivel.objeto_visual}
                      indice={i}
                      total={totalPiezas}
                      cortesHechos={cortesHechos}
                      oculta={piezasEnCanasta.includes(i)}
                      draggable={esArrastrando}
                      onClick={() => agregarACanasta(i)}
                      onDragStart={() => {}}
                    />
                  ))}
                </svg>

                {/* Hint de cortar */}
                {necesitaCortar && (
                  <div className="pointer-events-none absolute inset-x-0 -bottom-1 flex justify-center">
                    <div className="animate-bounce rounded-full border-2 border-orange-300 bg-white px-3 py-1.5 text-xs font-bold text-orange-700 shadow sm:text-sm">
                      <Scissors size={13} className="mr-1 inline" strokeWidth={2.5} />
                      ¡Toca el {OBJETO_NOMBRE[nivel.objeto_visual].toLowerCase()} para cortarlo!
                    </div>
                  </div>
                )}
                {cortandoAnim && (
                  <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center">
                    <div className="rounded-full bg-orange-500/90 px-3 py-1 text-xs font-bold text-white shadow sm:text-sm">
                      ✂️ Cortando en {totalPiezas}…
                    </div>
                  </div>
                )}
              </div>

              {/* Instrucción dinámica */}
              <div className="mt-3 rounded-xl border-2 border-orange-200 bg-orange-50/70 px-3 py-2 text-center">
                {estado === "presentacion" && (
                  <p className="text-sm font-semibold text-orange-800">
                    Presiona <span className="font-bold">¡Atender!</span> para recibir al cliente.
                  </p>
                )}
                {estado === "cortando" && !cortesHechos && (
                  <p className="text-sm font-semibold text-orange-800">
                    Corta el producto en <b>{totalPiezas}</b> partes iguales.
                  </p>
                )}
                {cortesHechos && estado !== "celebrando" && (
                  <p className="text-sm font-semibold text-orange-800">
                    <Hand size={14} className="mr-1 inline" strokeWidth={2.5} />
                    Toca o arrastra <b>{nivel.numerador_pedido}</b> pedazo
                    {nivel.numerador_pedido === 1 ? "" : "s"} a la canasta del cliente.
                  </p>
                )}
                {estado === "celebrando" && (
                  <p className="text-sm font-bold text-emerald-700">
                    ¡Pedido entregado correctamente! 🎉
                  </p>
                )}
              </div>

              {/* Botón vaciar canasta */}
              {piezasEnCanasta.length > 0 && estado === "arrastrando" && (
                <button
                  onClick={vaciarCanasta}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-orange-300 bg-white py-2 text-sm font-bold text-orange-700 transition hover:bg-orange-50"
                >
                  <Undo2 size={14} strokeWidth={2.5} /> Vaciar canasta
                </button>
              )}
            </div>

            {/* ============ Columna derecha: cliente + canasta ============ */}
            <div className="flex flex-col gap-4">
              {/* Cliente con bocadillo */}
              <div className="rounded-3xl border-2 border-rose-200 bg-white/80 p-4 shadow-lg backdrop-blur sm:p-5">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100 text-4xl shadow-inner sm:h-20 sm:w-20 sm:text-5xl">
                    {avatar}
                  </div>
                  {/* Bocadillo de cómic */}
                  <div className="relative flex-1 rounded-2xl border-2 border-orange-300 bg-amber-50 px-4 py-3 shadow-sm">
                    {/* Cola del bocadillo */}
                    <div className="absolute -left-2 top-5 h-4 w-4 rotate-45 border-b-2 border-l-2 border-orange-300 bg-amber-50" />
                    <p className="text-base font-semibold leading-snug text-orange-950 sm:text-lg">
                      {renderFrase(nivel.frase_del_cliente)}
                    </p>
                  </div>
                </div>

                {/* Fracción pedida (grande, para reforzar) */}
                <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-orange-100/60 py-2">
                  <span className="text-sm font-semibold text-orange-800">El cliente quiere:</span>
                  <span className="inline-flex items-center text-orange-900">
                    <Fraccion num={nivel.numerador_pedido} den={nivel.denominador_cortes} className="text-orange-700" />
                  </span>
                </div>

                {nivel.es_equivalente_de && (
                  <p className="mt-2 text-center text-xs font-semibold text-emerald-700">
                    💡 Pista: {nivel.fraccion_plana} es lo mismo que {nivel.es_equivalente_de}
                  </p>
                )}
              </div>

              {/* Canasta del cliente (drop zone) */}
              <div
                onDragOver={(e) => {
                  if (estado === "arrastrando") {
                    e.preventDefault();
                    setDragOverCanasta(true);
                  }
                }}
                onDragLeave={() => setDragOverCanasta(false)}
                onDrop={onDropCanasta}
                className={`flex-1 rounded-3xl border-[3px] p-4 shadow-lg backdrop-blur transition-all sm:p-5 ${
                  dragOverCanasta
                    ? "border-emerald-400 bg-emerald-50/90 scale-[1.02]"
                    : estado === "arrastrando"
                    ? "border-dashed border-orange-400 bg-white/80"
                    : "border-orange-200 bg-white/70"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-sm font-bold text-orange-950 sm:text-base">
                    <ShoppingCart size={16} className="text-orange-600" strokeWidth={2.5} />
                    Canasta del cliente
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      piezasEnCanasta.length === nivel.numerador_pedido
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {piezasEnCanasta.length} / {nivel.numerador_pedido}
                  </span>
                </div>

                {piezasEnCanasta.length === 0 ? (
                  <div className="flex h-32 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 text-center">
                    <span className="text-3xl opacity-50">🧺</span>
                    <p className="text-xs font-semibold text-orange-600/70 sm:text-sm">
                      Arrastra aquí los pedazos
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-orange-50/50 p-3">
                    {piezasEnCanasta.map((i) => (
                      <button
                        key={i}
                        onClick={() => quitarDeCanasta(i)}
                        className="group relative rounded-xl bg-white p-1 shadow transition hover:scale-105 hover:bg-rose-50"
                        title="Quitar de la canasta"
                        aria-label={`Quitar pedazo ${i + 1} de la canasta`}
                      >
                        <PiezaIcon objeto={nivel.objeto_visual} indice={i} total={totalPiezas} />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white opacity-0 shadow transition group-hover:opacity-100">
                          ✕
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {piezasEnCanasta.length > 0 && (
                  <p className="mt-2 text-center text-xs font-semibold text-orange-600/70">
                    Toca un pedazo para regresarlo al producto
                  </p>
                )}
              </div>

              {/* Feedback de error */}
              {feedback && esArrastrando && (
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
                    onClick={empezarNivel}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-rose-400 py-3.5 text-base font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-95"
                  >
                    <Sparkles size={18} strokeWidth={2.5} /> ¡Atender al cliente!
                  </button>
                )}
                {(esArrastrando || esVerificando) && (
                  <button
                    onClick={entregar}
                    disabled={!puedeEntregar || esVerificando}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-bold shadow-md transition active:scale-95 ${
                      puedeEntregar
                        ? "bg-gradient-to-r from-emerald-400 to-lime-400 text-white hover:scale-[1.02] hover:shadow-lg"
                        : "cursor-not-allowed bg-orange-200 text-orange-500/70"
                    }`}
                  >
                    {esVerificando ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" strokeWidth={2.5} /> Revisando…
                      </>
                    ) : (
                      <>
                        <Check size={18} strokeWidth={2.5} /> Entregar pedido
                      </>
                    )}
                  </button>
                )}
                {esCelebrando && (
                  <button
                    disabled
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-lime-400 py-3.5 text-base font-bold text-white shadow-md"
                  >
                    <PartyPopper size={18} strokeWidth={2.5} /> ¡Bien hecho!
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confeti al celebrar */}
      {esCorrecto && <Confetti duracionMs={2800} cantidad={48} />}
    </div>
  );
}

/* ----------------------- Pantalla final ----------------------- */

function PantallaCompletado({
  onReiniciar,
  ventas,
}: {
  onReiniciar: () => void;
  ventas: number;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="animate-bounce-in rounded-3xl border-2 border-amber-300 bg-white/90 p-8 text-center shadow-2xl backdrop-blur">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg">
          <Trophy size={52} className="text-white animate-trophy-float" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-bold text-orange-950 sm:text-4xl">¡Pulpero Experto!</h2>
        <p className="mt-2 text-base font-semibold text-orange-700 sm:text-lg">
          Atendiste <span className="text-emerald-600">{ventas}</span> clientes con éxito en la
          pulpería de fracciones. 🎉
        </p>
        <p className="mt-1 text-sm font-medium text-orange-600/80">
          Aprendiste a partir sandías, pasteles, piñas, cuajadas y jabón en fracciones iguales.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-3xl">
          <span>🍉</span>
          <span>🍰</span>
          <span>🍍</span>
          <span>🧀</span>
          <span>🧼</span>
          <span>🏆</span>
        </div>

        <button
          onClick={onReiniciar}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-rose-400 py-3.5 text-base font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-95 sm:w-auto sm:px-8"
        >
          <RefreshCw size={18} strokeWidth={2.5} /> Jugar de nuevo
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
