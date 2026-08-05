"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Hand,
  PartyPopper,
  RefreshCw,
  Scissors,
  ShoppingCart,
  Sparkles,
  Store,
  Undo2,
} from "lucide-react";
import { nivelesPulperia, type NivelPulperia } from "@/data/pulperiaFracciones";
import {
  GameShell,
  GameHUD,
  GameIntro,
  GameOverlay,
  useGameAudio,
  FloatingScore,
  ParticleBurst,
  type FloatingScoreItem,
  type BurstConfig,
  nextScoreId,
} from "@/components/game";

/* ============================================================
   La Pulpería de Fracciones — Minijuego educativo AAA
   ------------------------------------------------------------
   Mecánica:
   1. Llega un cliente y pide una fracción de un producto.
   2. El niño corta el producto en `denominador_cortes` partes.
   3. Arrastra (o toca) `numerador_pedido` partes a la canasta.
   4. Entrega el pedido. Si acierta, celebra y avanza de nivel.

   Sistema AAA:
   - GameShell (kitchen) + GameHUD (math) + GameIntro + GameOverlay
   - Vidas (3 corazones), Timer (60s/nivel), Combo (racha 3+ → x2..x5)
   - Puntos +10/pieza correcta, +50 bonus nivel perfecto
   - FloatingScore + ParticleBurst + sfx (cut, coin, success, error, combo, victory)
   - SVG hiperdetallado: sandía, pastel, piña, cuajada, jabón + abuela + canasta
   ============================================================ */

type Estado =
  | "presentacion"
  | "cortando"
  | "arrastrando"
  | "verificando"
  | "celebrando"
  | "completado";

type ObjetoVisual = NivelPulperia["objeto_visual"];

const OBJETO_NOMBRE: Record<ObjetoVisual, string> = {
  sandía: "Sandía",
  "pastel de tres leches": "Pastel de tres leches",
  piña: "Piña",
  cuajada: "Cuajada",
  "barra de jabón de lavar": "Jabón de lavar",
};

const TOTAL_NIVELES = nivelesPulperia.length;
const VIDAS_MAX = 3;
const TIMER_MS = 60_000;
const PUNTOS_PIEZA = 10;
const PUNTOS_BONUS_PERFECTO = 50;
const TEMA_COLOR = "#fb7185";

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

/* ============================================================
   SVG del producto — Hiperdetallado
   ============================================================ */

interface PiezaProps {
  objeto: ObjetoVisual;
  indice: number;
  total: number;
  cortesHechos: boolean;
  oculta: boolean;
  draggable: boolean;
  onClick: () => void;
  onDragStart: () => void;
}

/** Dibuja una sola pieza del producto (circular o rectangular) hiperdetallada. */
function PiezaProducto({
  objeto,
  indice,
  total,
  cortesHechos,
  oculta,
  draggable,
  onClick,
  onDragStart,
}: PiezaProps) {
  const delayCorte = `${indice * 110}ms`;
  const estiloCorte: React.CSSProperties = {
    opacity: cortesHechos ? 1 : 0,
    transition: "opacity 0.45s ease",
    transitionDelay: delayCorte,
  };
  const estiloGrupo: React.CSSProperties = {
    opacity: oculta ? 0 : 1,
    transition: "opacity 0.35s ease, transform 0.35s ease",
    cursor: draggable && !oculta ? "grab" : "default",
    pointerEvents: oculta ? "none" : "auto",
  };

  let contenido: React.ReactNode = null;

  if (objeto === "sandía") {
    const a1 = indice * (360 / total);
    const a2 = (indice + 1) * (360 / total);
    contenido = (
      <>
        <defs>
          <radialGradient id={`sand-pulp-${indice}`} cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#fecdd3" />
            <stop offset="55%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#be123c" />
          </radialGradient>
          <radialGradient id={`sand-rind-${indice}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="70%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </radialGradient>
          <linearGradient id={`sand-gloss-${indice}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Corteza verde con gradiente radial */}
        <path d={pieSlicePath(100, 100, 92, a1, a2)} fill={`url(#sand-rind-${indice})`} />
        {/* Rayas oscuras de la corteza */}
        {rayasCortezaSandia(indice, a1, a2)}
        {/* Pulpa rosa-roja con gradiente radial */}
        <path d={pieSlicePath(100, 100, 78, a1, a2)} fill={`url(#sand-pulp-${indice})`} />
        {/* Línea de transición pulpa-corteza */}
        <path
          d={pieSlicePath(100, 100, 78, a1, a2)}
          fill="none"
          stroke="#fda4af"
          strokeWidth={1.5}
          opacity={0.7}
        />
        {/* Patrón fibroso de la pulpa */}
        {fibrasSandia(indice, total, a1, a2)}
        {/* Brillo glossy superior */}
        <path d={pieSlicePath(100, 100, 78, a1, a2)} fill={`url(#sand-gloss-${indice})`} />
        {/* Semillas negras brillantes */}
        {semillasSandia(indice, total, a1, a2)}
        {/* Borde de corte oscuro */}
        <path
          d={pieSlicePath(100, 100, 92, a1, a2)}
          fill="none"
          stroke="#14532d"
          strokeWidth={2}
          style={estiloCorte}
        />
      </>
    );
  } else if (objeto === "cuajada") {
    const a1 = indice * (360 / total);
    const a2 = (indice + 1) * (360 / total);
    contenido = (
      <>
        <defs>
          <radialGradient id={`cua-grad-${indice}`} cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="55%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <pattern
            id={`cua-holes-${indice}`}
            x="0"
            y="0"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="3" r="1.4" fill="#92400e" opacity="0.4" />
            <circle cx="10" cy="9" r="1" fill="#78350f" opacity="0.5" />
          </pattern>
        </defs>
        {/* Cuerpo amarillo cremoso */}
        <path d={pieSlicePath(100, 100, 90, a1, a2)} fill={`url(#cua-grad-${indice})`} />
        {/* Patrón de agujeros */}
        <path d={pieSlicePath(100, 100, 90, a1, a2)} fill={`url(#cua-holes-${indice})`} />
        {/* Capa tostada superior (sombra interna) */}
        <path
          d={pieSlicePath(100, 100, 90, a1, a2)}
          fill="#92400e"
          opacity={0.18}
        />
        {/* Borde de corte */}
        <path
          d={pieSlicePath(100, 100, 90, a1, a2)}
          fill="none"
          stroke="#78350f"
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
        <defs>
          <linearGradient id={`cake-bizc-${indice}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id={`cake-crema-${indice}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
          <linearGradient id={`cake-dulce-${indice}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
        </defs>
        {/* Dulce de leche (base) */}
        <rect
          x={x}
          y={yTop + alto * 0.55}
          width={stripW}
          height={alto * 0.45}
          fill={`url(#cake-dulce-${indice})`}
        />
        {/* Bizcocho del medio */}
        <rect
          x={x}
          y={yTop + alto * 0.32}
          width={stripW}
          height={alto * 0.23}
          fill={`url(#cake-bizc-${indice})`}
        />
        {/* Crema blanca */}
        <rect
          x={x}
          y={yTop + alto * 0.18}
          width={stripW}
          height={alto * 0.14}
          fill={`url(#cake-crema-${indice})`}
        />
        {/* Bizcocho arriba */}
        <rect x={x} y={yTop} width={stripW} height={alto * 0.18} fill={`url(#cake-bizc-${indice})`} />
        {/* Glaseado blanco encima */}
        <rect x={x} y={yTop - 4} width={stripW} height={8} fill="#ffffff" rx={2} />
        {/* Cereza en el pedazo central */}
        {indice === Math.floor(total / 2) && (
          <>
            <defs>
              <radialGradient id="cherry-grad" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="55%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </radialGradient>
            </defs>
            <circle cx={x + stripW / 2} cy={yTop - 9} r={6.5} fill="url(#cherry-grad)" />
            <circle cx={x + stripW / 2 - 2} cy={yTop - 11} r={1.5} fill="#fecaca" opacity="0.8" />
            <path
              d={`M ${x + stripW / 2} ${yTop - 14} q 4 -4 8 -2`}
              fill="none"
              stroke="#16a34a"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </>
        )}
        {/* Brillo glossy superior */}
        <rect
          x={x + 1}
          y={yTop - 3}
          width={Math.max(2, stripW - 2)}
          height={4}
          fill="#ffffff"
          opacity={0.5}
          rx={1}
        />
        {/* Borde de corte */}
        <rect
          x={x}
          y={yTop}
          width={stripW}
          height={alto}
          fill="none"
          stroke="#7c2d12"
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
        <defs>
          <linearGradient id={`pin-grad-${indice}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="55%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
          <linearGradient id={`pin-gloss-${indice}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Cuerpo amarillo con gradiente */}
        <rect x={x} y={yTop} width={stripW} height={alto} fill={`url(#pin-grad-${indice})`} rx={2} />
        {/* Patrón de escamas diamantadas marrones */}
        {escamasPiña(indice, total, x, yTop, stripW, alto)}
        {/* Brillo glossy */}
        <rect
          x={x}
          y={yTop}
          width={stripW}
          height={alto * 0.35}
          fill={`url(#pin-gloss-${indice})`}
          rx={2}
        />
        {/* Hojas de la corona (solo en pedazos clave) */}
        {(indice === 0 || indice === total - 1 || indice === Math.floor(total / 2)) && (
          <>
            <defs>
              <linearGradient id={`pin-leaf-${indice}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>
            <path
              d={`M ${x + stripW / 2} ${yTop} L ${x + stripW / 2 - 7} ${yTop - 24} L ${x + stripW / 2 - 2} ${yTop - 16} L ${x + stripW / 2} ${yTop - 28} L ${x + stripW / 2 + 2} ${yTop - 16} L ${x + stripW / 2 + 7} ${yTop - 24} Z`}
              fill={`url(#pin-leaf-${indice})`}
              stroke="#14532d"
              strokeWidth={0.5}
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
          stroke="#713f12"
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
        <defs>
          <linearGradient id={`soap-grad-${indice}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="55%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id={`soap-gloss-${indice}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Cuerpo del jabón azul */}
        <rect x={x} y={yTop} width={stripW} height={alto} fill={`url(#soap-grad-${indice})`} rx={6} />
        {/* Brillo superior */}
        <rect
          x={x}
          y={yTop}
          width={stripW}
          height={alto * 0.35}
          fill={`url(#soap-gloss-${indice})`}
          rx={6}
        />
        {/* Burbujas */}
        {burbujasJabon(indice, x, yTop, stripW, alto)}
        {/* Banda de etiqueta */}
        <rect
          x={x}
          y={yTop + alto * 0.42}
          width={stripW}
          height={alto * 0.2}
          fill="#1e3a8a"
          opacity={0.85}
        />
        {stripW > 18 && (
          <text
            x={x + stripW / 2}
            y={yTop + alto * 0.55}
            textAnchor="middle"
            fontSize={7}
            fontWeight="bold"
            fill="#ffffff"
            fontFamily="Fredoka, sans-serif"
            letterSpacing="0.5"
          >
            JABÓN
          </text>
        )}
        {/* Brillo lateral */}
        <rect
          x={x + 1}
          y={yTop + 2}
          width={Math.max(1, stripW * 0.18)}
          height={alto - 4}
          fill="#ffffff"
          opacity={0.25}
          rx={2}
        />
        {/* Borde de corte */}
        <rect
          x={x}
          y={yTop}
          width={stripW}
          height={alto}
          fill="none"
          stroke="#1e3a8a"
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

/** Rayas verticales oscuras de la corteza de la sandía. */
function rayasCortezaSandia(indice: number, a1: number, a2: number) {
  const cx = 100;
  const cy = 100;
  const stripeCount = 2;
  return Array.from({ length: stripeCount }).map((_, s) => {
    const t = (s + 1) / (stripeCount + 1);
    const angle = a1 + (a2 - a1) * t;
    const p1 = polar(cx, cy, 80, angle);
    const p2 = polar(cx, cy, 92, angle);
    return (
      <line
        key={`stripe-${indice}-${s}`}
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke="#14532d"
        strokeWidth={2}
        opacity={0.6}
        strokeLinecap="round"
      />
    );
  });
}

/** Líneas fibrosas internas de la pulpa de sandía. */
function fibrasSandia(indice: number, total: number, a1: number, a2: number) {
  if (total > 6) return null;
  const midAngle = (a1 + a2) / 2;
  const p1 = polar(100, 100, 12, midAngle);
  const p2 = polar(100, 100, 72, midAngle);
  return (
    <line
      key={`fib-${indice}`}
      x1={p1.x}
      y1={p1.y}
      x2={p2.x}
      y2={p2.y}
      stroke="#fecdd3"
      strokeWidth={1}
      opacity={0.4}
    />
  );
}

/** Semillas negras brillantes distribuidas dentro de la pulpa de una rebanada. */
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
      <g key={`seed-${indice}-${s}`}>
        <ellipse
          cx={pos.x}
          cy={pos.y}
          rx={2.6}
          ry={4.2}
          fill="#1f2937"
          transform={`rotate(${angle} ${pos.x} ${pos.y})`}
        />
        {/* Brillo en la semilla */}
        <ellipse
          cx={pos.x - 0.6}
          cy={pos.y - 1}
          rx={0.7}
          ry={1.2}
          fill="#9ca3af"
          opacity={0.6}
          transform={`rotate(${angle} ${pos.x} ${pos.y})`}
        />
      </g>
    );
  });
}

/** Escamas diamantadas marrones sobre la piña. */
function escamasPiña(
  indice: number,
  total: number,
  x: number,
  yTop: number,
  stripW: number,
  alto: number,
) {
  const rows = 4;
  const cols = Math.max(1, Math.ceil(total / 2));
  return Array.from({ length: rows }).map((_, r) =>
    Array.from({ length: cols }).map((_, c) => {
      const cx = x + 6 + c * 10;
      const cy = yTop + 14 + r * 28;
      if (cx < x + 4 || cx > x + stripW - 4) return null;
      return (
        <g key={`esc-${indice}-${r}-${c}`}>
          <path
            d={`M ${cx} ${cy - 4} L ${cx + 4} ${cy} L ${cx} ${cy + 4} L ${cx - 4} ${cy} Z`}
            fill="#92400e"
            opacity={0.55}
          />
          <circle cx={cx} cy={cy} r={1.2} fill="#451a03" opacity={0.7} />
        </g>
      );
    }),
  );
}

/** Burbujas decorativas sobre el jabón de lavar. */
function burbujasJabon(
  indice: number,
  x: number,
  yTop: number,
  stripW: number,
  alto: number,
) {
  if (stripW < 16) return null;
  const bubbles = [
    { dx: 0.25, dy: 0.18, r: 2.5 },
    { dx: 0.6, dy: 0.12, r: 1.8 },
    { dx: 0.45, dy: 0.28, r: 1.4 },
  ];
  return bubbles.map((b, i) => (
    <g key={`bub-${indice}-${i}`}>
      <circle
        cx={x + stripW * b.dx}
        cy={yTop + alto * b.dy}
        r={b.r}
        fill="#ffffff"
        opacity={0.55}
      />
      <circle
        cx={x + stripW * b.dx - b.r * 0.3}
        cy={yTop + alto * b.dy - b.r * 0.3}
        r={b.r * 0.35}
        fill="#ffffff"
        opacity={0.85}
      />
    </g>
  ));
}

/** Tabla de madera con vetas — el soporte donde descansa el producto. */
function TablaMadera() {
  return (
    <>
      <defs>
        <linearGradient id="tabla-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <pattern id="vetas" x="0" y="0" width="200" height="6" patternUnits="userSpaceOnUse">
          <path d="M 0 3 Q 50 1 100 3 T 200 3" stroke="#451a03" strokeWidth="0.5" fill="none" opacity="0.4" />
          <path d="M 0 5 Q 60 4 120 5 T 200 5" stroke="#78350f" strokeWidth="0.4" fill="none" opacity="0.5" />
        </pattern>
      </defs>
      <rect x="0" y="170" width="200" height="22" fill="url(#tabla-grad)" rx="3" />
      <rect x="0" y="170" width="200" height="22" fill="url(#vetas)" rx="3" />
      <rect x="0" y="170" width="200" height="2" fill="#fbbf24" opacity="0.4" rx="1" />
      <rect x="0" y="188" width="200" height="4" fill="#451a03" opacity="0.6" rx="2" />
    </>
  );
}

/** Icono pequeño de una pieza para mostrar dentro de la canasta. */
function PiezaIcon({ objeto, indice, total }: { objeto: ObjetoVisual; indice: number; total: number }) {
  return (
    <svg viewBox="0 0 200 200" className="h-12 w-12 sm:h-14 sm:w-14 drop-shadow" aria-hidden>
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

/* ============================================================
   Cliente (abuela) — SVG estilizado
   ============================================================ */

function AbuelaSVG({ hablando = false }: { hablando?: boolean }) {
  return (
    <svg viewBox="0 0 120 140" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="pelo-grad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </radialGradient>
        <radialGradient id="piel-grad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <linearGradient id="blusa-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
      </defs>
      {/* Sombra */}
      <ellipse cx="60" cy="132" rx="32" ry="4" fill="#000000" opacity="0.2" />
      {/* Cuerpo (blusa) */}
      <path
        d="M 30 95 Q 30 80 45 78 L 75 78 Q 90 80 90 95 L 92 132 L 28 132 Z"
        fill="url(#blusa-grad)"
      />
      {/* Patrón floral de la blusa */}
      <circle cx="45" cy="105" r="2.5" fill="#fef3c7" opacity="0.85" />
      <circle cx="75" cy="110" r="2.5" fill="#fef3c7" opacity="0.85" />
      <circle cx="60" cy="118" r="2.5" fill="#fde047" opacity="0.85" />
      <circle cx="40" cy="120" r="1.8" fill="#fef3c7" opacity="0.7" />
      <circle cx="80" cy="100" r="1.8" fill="#fde047" opacity="0.7" />
      {/* Cuello */}
      <rect x="52" y="72" width="16" height="10" fill="url(#piel-grad)" />
      {/* Cabeza */}
      <circle cx="60" cy="50" r="28" fill="url(#piel-grad)" />
      {/* Pelo gris (moño + alrededor) */}
      <path
        d="M 32 50 Q 30 30 50 24 Q 60 18 70 24 Q 90 30 88 50 Q 86 38 76 35 Q 70 32 60 33 Q 50 32 44 35 Q 34 38 32 50 Z"
        fill="url(#pelo-grad)"
      />
      {/* Moño arriba */}
      <ellipse cx="60" cy="22" rx="12" ry="7" fill="url(#pelo-grad)" />
      <ellipse cx="60" cy="22" rx="8" ry="4" fill="#6b7280" opacity="0.5" />
      {/* Orejas + aretes */}
      <ellipse cx="33" cy="52" rx="3" ry="5" fill="url(#piel-grad)" />
      <ellipse cx="87" cy="52" rx="3" ry="5" fill="url(#piel-grad)" />
      <circle cx="33" cy="56" r="2" fill="#fde047" />
      <circle cx="87" cy="56" r="2" fill="#fde047" />
      {/* Cejas */}
      <path d="M 42 44 Q 47 42 52 44" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 68 44 Q 73 42 78 44" stroke="#6b7280" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Ojos amables */}
      <ellipse cx="47" cy="50" rx="2.5" ry="3" fill="#1f2937" />
      <ellipse cx="73" cy="50" rx="2.5" ry="3" fill="#1f2937" />
      <circle cx="47.8" cy="49" r="0.8" fill="#ffffff" />
      <circle cx="73.8" cy="49" r="0.8" fill="#ffffff" />
      {/* Mejillas rose */}
      <circle cx="42" cy="58" r="3.5" fill="#fb7185" opacity="0.4" />
      <circle cx="78" cy="58" r="3.5" fill="#fb7185" opacity="0.4" />
      {/* Sonrisa (cambia si está hablando) */}
      {hablando ? (
        <ellipse cx="60" cy="64" rx="6" ry="4" fill="#7f1d1d" />
      ) : (
        <path
          d="M 52 62 Q 60 68 68 62"
          stroke="#7f1d1d"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {/* Anteojos */}
      <circle cx="47" cy="50" r="7" stroke="#374151" strokeWidth="1.5" fill="none" opacity="0.7" />
      <circle cx="73" cy="50" r="7" stroke="#374151" strokeWidth="1.5" fill="none" opacity="0.7" />
      <line x1="54" y1="50" x2="66" y2="50" stroke="#374151" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}

/* ============================================================
   Canasta mimbre — SVG hiperdetallado
   ============================================================ */

function CanastaSVG({ llena = false }: { llena?: boolean }) {
  return (
    <svg viewBox="0 0 240 180" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="mimbre-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="55%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <pattern id="tejido" x="0" y="0" width="16" height="12" patternUnits="userSpaceOnUse">
          <rect width="16" height="12" fill="url(#mimbre-grad)" />
          <path d="M 0 6 Q 4 0 8 6 T 16 6" stroke="#451a03" strokeWidth="1.2" fill="none" opacity="0.7" />
          <path d="M 0 12 Q 4 6 8 12" stroke="#451a03" strokeWidth="1.2" fill="none" opacity="0.6" />
          <line x1="8" y1="0" x2="8" y2="12" stroke="#92400e" strokeWidth="0.6" opacity="0.5" />
        </pattern>
        <linearGradient id="asa-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>
      {/* Sombra */}
      <ellipse cx="120" cy="170" rx="100" ry="6" fill="#000000" opacity="0.25" />
      {/* Asa */}
      <path
        d="M 50 110 Q 50 50 120 50 Q 190 50 190 110"
        fill="none"
        stroke="url(#asa-grad)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M 50 110 Q 50 50 120 50 Q 190 50 190 110"
        fill="none"
        stroke="#92400e"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
        strokeDasharray="3 3"
      />
      {/* Cuerpo de la canasta */}
      <path
        d="M 30 105 Q 30 150 120 160 Q 210 150 210 105 Z"
        fill="url(#tejido)"
      />
      {/* Borde superior (labio) */}
      <ellipse cx="120" cy="105" rx="90" ry="14" fill="url(#mimbre-grad)" />
      <ellipse cx="120" cy="103" rx="86" ry="10" fill="#451a03" opacity="0.4" />
      <ellipse cx="120" cy="103" rx="82" ry="8" fill={llena ? "#fde68a" : "#78350f"} opacity={llena ? 0.6 : 0.7} />
      {/* Detalles del tejido vertical */}
      {Array.from({ length: 8 }).map((_, i) => {
        const x = 35 + i * 25;
        return (
          <line
            key={i}
            x1={x}
            y1={108}
            x2={x + 4}
            y2={155}
            stroke="#451a03"
            strokeWidth="1.2"
            opacity="0.4"
          />
        );
      })}
    </svg>
  );
}

/* ============================================================
   Componente principal
   ============================================================ */

export function PulperiaFracciones() {
  const sfx = useGameAudio();

  const [nivelIdx, setNivelIdx] = useState(0);
  const [estado, setEstado] = useState<Estado>("presentacion");
  const [cortesHechos, setCortesHechos] = useState(false);
  const [piezasEnCanasta, setPiezasEnCanasta] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [dragOverCanasta, setDragOverCanasta] = useState(false);
  const [cortandoAnim, setCortandoAnim] = useState(false);

  // AAA: puntos, vidas, racha, timer, mute
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(VIDAS_MAX);
  const [racha, setRacha] = useState(0);
  const [rachaMaxima, setRachaMaxima] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [huboErrorNivel, setHuboErrorNivel] = useState(false);
  const [timerMs, setTimerMs] = useState(TIMER_MS);
  const [muted, setMuted] = useState(false);
  const [scores, setScores] = useState<FloatingScoreItem[]>([]);
  const [bursts, setBursts] = useState<(BurstConfig & { id: number })[]>([]);

  // Refs
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const canastaRef = useRef<HTMLDivElement | null>(null);
  const tablaRef = useRef<HTMLDivElement | null>(null);

  const programar = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timeoutsRef.current.delete(t);
      fn();
    }, ms);
    timeoutsRef.current.add(t);
  }, []);

  // Limpieza al desmontar
  useEffect(() => {
    const set = timeoutsRef.current;
    return () => {
      set.forEach((t) => clearTimeout(t));
      set.clear();
    };
  }, []);

  // Sync mute con audio
  useEffect(() => {
    sfx.setMuted(muted);
  }, [muted, sfx]);

  const nivel = nivelesPulperia[nivelIdx];
  const totalPiezas = nivel.denominador_cortes;

  /* ---- Timer del nivel ---- */
  useEffect(() => {
    if (estado !== "cortando" && estado !== "arrastrando") return;
    const interval = setInterval(() => {
      setTimerMs((t) => {
        if (t <= 100) {
          clearInterval(interval);
          // Tiempo agotado: -1 vida, reiniciar nivel
          sfx.error();
          sfx.vibrate([20, 40, 20]);
          setVidas((v) => {
            const nv = v - 1;
            if (nv <= 0) {
              setEstado("completado");
            } else {
              // Reiniciar nivel
              setFeedback("⏰ Se acabó el tiempo. ¡Intentá de nuevo!");
              setCortesHechos(false);
              setPiezasEnCanasta([]);
              setEstado("cortando");
              setRacha(0);
              setHuboErrorNivel(true);
              programar(() => setFeedback(null), 2200);
            }
            return Math.max(0, nv);
          });
          return TIMER_MS;
        }
        return t - 100;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [estado, sfx, programar]);

  /* ---- Transición: celebrando → siguiente nivel o completado ---- */
  useEffect(() => {
    if (estado !== "celebrando") return;
    const t = setTimeout(() => {
      if (nivelIdx + 1 >= TOTAL_NIVELES) {
        sfx.victory();
        setEstado("completado");
      } else {
        setNivelIdx((n) => n + 1);
        setPiezasEnCanasta([]);
        setCortesHechos(false);
        setFeedback(null);
        setCortandoAnim(false);
        setHuboErrorNivel(false);
        setTimerMs(TIMER_MS);
        setEstado("presentacion");
      }
    }, 2400);
    return () => clearTimeout(t);
  }, [estado, nivelIdx, sfx]);

  /* ---- Spawn de FloatingScore ---- */
  const spawnScore = useCallback(
    (text: string, color: string, icon?: string, x = 50, y = 50) => {
      const id = nextScoreId();
      setScores((s) => [...s, { id, x, y, text, color, icon }]);
      programar(() => {
        setScores((s) => s.filter((it) => it.id !== id));
      }, 950);
    },
    [programar],
  );

  /* ---- Spawn de ParticleBurst ---- */
  const spawnBurst = useCallback(
    (x: number, y: number, count = 18, colors?: string[], power = 1.3) => {
      const id = nextScoreId();
      setBursts((b) => [...b, { id, x, y, count, colors, power }]);
      programar(() => {
        setBursts((b) => b.filter((it) => it.id !== id));
      }, 1000);
    },
    [programar],
  );

  /* ---- Acciones ---- */

  const empezarNivel = useCallback(() => {
    sfx.click();
    setEstado("cortando");
    setFeedback(null);
    setTimerMs(TIMER_MS);
  }, [sfx]);

  const cortar = useCallback(() => {
    if (estado !== "cortando" || cortesHechos) return;
    sfx.cut();
    sfx.vibrate(15);
    setCortesHechos(true);
    setCortandoAnim(true);
    programar(() => {
      setEstado("arrastrando");
      setCortandoAnim(false);
    }, 1300);
  }, [estado, cortesHechos, sfx, programar]);

  const agregarACanasta = useCallback(
    (i: number) => {
      if (piezasEnCanasta.includes(i)) return;
      sfx.coin();
      sfx.vibrate(20);
      setPiezasEnCanasta((p) => [...p, i]);
      setFeedback(null);
      // Floating score +10 desde la canasta
      if (canastaRef.current) {
        const r = canastaRef.current.getBoundingClientRect();
        const parent = canastaRef.current.parentElement?.getBoundingClientRect();
        if (parent) {
          const x = ((r.left + r.width / 2 - parent.left) / parent.width) * 100;
          const y = ((r.top + r.height / 2 - parent.top) / parent.height) * 100;
          spawnScore("+10", "#fbbf24", "✨", x, y);
        }
      }
      setPuntos((p) => p + PUNTOS_PIEZA);
    },
    [piezasEnCanasta, sfx, spawnScore],
  );

  const quitarDeCanasta = useCallback(
    (i: number) => {
      sfx.click();
      setPiezasEnCanasta((p) => p.filter((x) => x !== i));
      setPuntos((p) => Math.max(0, p - PUNTOS_PIEZA));
      setFeedback(null);
    },
    [sfx],
  );

  const vaciarCanasta = useCallback(() => {
    sfx.click();
    const n = piezasEnCanasta.length;
    setPiezasEnCanasta([]);
    setPuntos((p) => Math.max(0, p - n * PUNTOS_PIEZA));
    setFeedback(null);
  }, [piezasEnCanasta.length, sfx]);

  const entregar = useCallback(() => {
    if (estado !== "arrastrando") return;
    sfx.click();
    setEstado("verificando");
    const correcto = piezasEnCanasta.length === nivel.numerador_pedido;
    programar(() => {
      if (correcto) {
        // Acierto de nivel
        const nuevaRacha = racha + 1;
        const comboMult = nuevaRacha >= 3 ? Math.min(nuevaRacha - 1, 5) : 1;
        const bonus = !huboErrorNivel ? PUNTOS_BONUS_PERFECTO : 0;
        const ptsGanados = bonus * (comboMult > 1 ? comboMult : 1);

        setAciertos((a) => a + 1);
        setRacha(nuevaRacha);
        setRachaMaxima((rm) => Math.max(rm, nuevaRacha));

        // Spawn FloatingScores
        if (canastaRef.current) {
          const r = canastaRef.current.getBoundingClientRect();
          const parent = canastaRef.current.parentElement?.getBoundingClientRect();
          if (parent) {
            const x = ((r.left + r.width / 2 - parent.left) / parent.width) * 100;
            const y = ((r.top + r.height / 2 - parent.top) / parent.height) * 100;
            if (bonus > 0) {
              spawnScore("+50 ¡Perfecto!", "#10b981", "⭐", x, y - 5);
            }
            if (comboMult > 1) {
              spawnScore(`¡Combo x${comboMult}!`, "#fb923c", "🔥", x, y - 15);
            }
          }
        }

        if (bonus > 0) setPuntos((p) => p + bonus);

        // ParticleBurst sobre la canasta
        if (canastaRef.current) {
          const r = canastaRef.current.getBoundingClientRect();
          spawnBurst(
            r.left + r.width / 2,
            r.top + r.height / 2,
            20,
            ["#fb7185", "#fbbf24", "#10b981", "#22d3ee", "#ffffff"],
            1.4,
          );
        }

        // Audio
        sfx.success();
        sfx.vibrate(40);
        if (nuevaRacha >= 3) {
          programar(() => sfx.combo(nuevaRacha), 350);
        }

        setEstado("celebrando");
      } else {
        // Fallo
        sfx.error();
        sfx.vibrate([20, 40, 20]);
        setRacha(0);
        setHuboErrorNivel(true);
        setVidas((v) => {
          const nv = v - 1;
          if (nv <= 0) {
            programar(() => setEstado("completado"), 600);
          } else {
            programar(() => setEstado("arrastrando"), 600);
          }
          return Math.max(0, nv);
        });
        setFeedback(nivel.feedback_error);
      }
    }, 450);
  }, [
    estado,
    piezasEnCanasta.length,
    nivel.numerador_pedido,
    nivel.feedback_error,
    racha,
    huboErrorNivel,
    sfx,
    programar,
    spawnScore,
    spawnBurst,
  ]);

  const reiniciarJuego = useCallback(() => {
    sfx.click();
    setNivelIdx(0);
    setEstado("presentacion");
    setCortesHechos(false);
    setPiezasEnCanasta([]);
    setFeedback(null);
    setCortandoAnim(false);
    setPuntos(0);
    setVidas(VIDAS_MAX);
    setRacha(0);
    setRachaMaxima(0);
    setAciertos(0);
    setHuboErrorNivel(false);
    setTimerMs(TIMER_MS);
    setScores([]);
    setBursts([]);
  }, [sfx]);

  /* ---- Drag handlers ---- */
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
  const nivelNumero = nivel.nivel;
  const necesitaCortar = estado === "cortando" && !cortesHechos;
  const esPresentacion = estado === "presentacion";
  const esArrastrando = estado === "arrastrando";
  const esVerificando = estado === "verificando";
  const esCelebrando = estado === "celebrando";
  const esCompletado = estado === "completado";
  const puedeEntregar = esArrastrando && piezasEnCanasta.length > 0;
  const esVictoria = aciertos === TOTAL_NIVELES && vidas > 0;

  /* ===================== RENDER: Intro ===================== */
  if (esPresentacion && nivelIdx === 0) {
    return (
      <GameShell theme="kitchen" onSalir={undefined}>
        <GameIntro
          icono={
            <svg viewBox="0 0 100 100" className="h-20 w-20 sm:h-24 sm:w-24" aria-hidden>
              <defs>
                <radialGradient id="intro-melon" cx="40%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fecdd3" />
                  <stop offset="55%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#be123c" />
                </radialGradient>
              </defs>
              {/* Media sandía */}
              <path d="M 10 50 A 40 40 0 0 1 90 50 Z" fill="#16a34a" />
              <path d="M 18 50 A 32 32 0 0 1 82 50 Z" fill="url(#intro-melon)" />
              <path d="M 18 50 A 32 32 0 0 1 82 50" stroke="#fda4af" strokeWidth="2" fill="none" />
              {/* Semillas */}
              <ellipse cx="35" cy="60" rx="2" ry="3.5" fill="#1f2937" />
              <ellipse cx="50" cy="65" rx="2" ry="3.5" fill="#1f2937" />
              <ellipse cx="65" cy="60" rx="2" ry="3.5" fill="#1f2937" />
              <ellipse cx="42" cy="72" rx="2" ry="3.5" fill="#1f2937" />
              <ellipse cx="58" cy="72" rx="2" ry="3.5" fill="#1f2937" />
            </svg>
          }
          titulo="La Pulpería de Fracciones"
          subtitulo="Atiende a los clientes partiendo productos"
          descripcion="Llega un cliente y pide una fracción del producto. Cortá el producto en partes iguales y entregá la cantidad correcta en la canasta."
          pasos={[
            "Leé lo que pide el cliente",
            "Cortá el producto en partes iguales",
            "Arrastrá los pedazos a la canasta",
            "¡Atendé y ganá puntos!",
          ]}
          temaColor={TEMA_COLOR}
          onJugar={empezarNivel}
        />
      </GameShell>
    );
  }

  /* ===================== RENDER: Completado (overlay) ===================== */
  if (esCompletado) {
    return (
      <GameShell theme="kitchen" onSalir={undefined}>
        <div className="relative min-h-[calc(100vh-72px)]" />
        <GameOverlay
          tipo={esVictoria ? "victoria" : "derrota"}
          titulo={esVictoria ? "¡Pulpero Experto!" : "¡Volvé a intentarlo!"}
          subtitulo={
            esVictoria
              ? "Atendiste a todos los clientes con éxito 🎉"
              : "Se te acabaron las vidas. ¡La práctica hace al maestro!"
          }
          stats={{
            puntos,
            rachaMaxima,
            aciertos,
            total: TOTAL_NIVELES,
          }}
          onReiniciar={reiniciarJuego}
          onSalir={() => {
            const btn = document.querySelector<HTMLButtonElement>(
              'button[aria-label="Salir del minijuego y volver al inicio"]',
            );
            btn?.click();
          }}
          temaColor={TEMA_COLOR}
        />
      </GameShell>
    );
  }

  /* ===================== RENDER: Juego activo ===================== */
  return (
    <GameShell theme="kitchen" onSalir={undefined}>
      <GameHUD
        theme="math"
        nivel={nivelNumero}
        totalNiveles={TOTAL_NIVELES}
        puntos={puntos}
        vidas={vidas}
        vidasMaximas={VIDAS_MAX}
        racha={racha}
        timerMs={timerMs}
        timerTotalMs={TIMER_MS}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        onSalir={() => {
          const btn = document.querySelector<HTMLButtonElement>(
            'button[aria-label="Salir del minijuego y volver al inicio"]',
          );
          btn?.click();
        }}
        icono={<Store size={18} strokeWidth={2.5} />}
      />

      <div className="relative mx-auto max-w-5xl px-3 py-4 sm:px-5 sm:py-6">
        {/* Contenedor relativo para FloatingScore y ParticleBurst */}
        <div className="relative">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* ============ Columna izquierda: producto + corte ============ */}
            <div className="rounded-3xl border-2 border-orange-400/30 bg-white/10 p-4 shadow-lg backdrop-blur-md sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-orange-100 sm:text-xl">
                  <span className="text-2xl">🔪</span>
                  {OBJETO_NOMBRE[nivel.objeto_visual]}
                </h2>
                <span className="rounded-full border-2 border-amber-400/40 bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-200">
                  {totalPiezas} pedazos
                </span>
              </div>

              {/* Zona del producto (SVG hiperdetallado) */}
              <div
                ref={tablaRef}
                className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-b from-amber-950/40 to-orange-950/50 p-2 shadow-inner"
              >
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
                  {/* Tabla de madera */}
                  <TablaMadera />
                  {/* Plato sombra */}
                  <ellipse cx="100" cy="172" rx="78" ry="6" fill="#000000" opacity={0.4} />
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
                    <div className="animate-bounce rounded-full border-2 border-orange-300 bg-white/90 px-3 py-1.5 text-xs font-bold text-orange-700 shadow sm:text-sm">
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
              <div className="mt-3 rounded-xl border-2 border-orange-400/30 bg-orange-500/10 px-3 py-2 text-center">
                {estado === "cortando" && !cortesHechos && (
                  <p className="text-sm font-semibold text-orange-100">
                    Corta el producto en <b>{totalPiezas}</b> partes iguales.
                  </p>
                )}
                {cortesHechos && estado !== "celebrando" && (
                  <p className="text-sm font-semibold text-orange-100">
                    <Hand size={14} className="mr-1 inline" strokeWidth={2.5} />
                    Toca o arrastra <b>{nivel.numerador_pedido}</b> pedazo
                    {nivel.numerador_pedido === 1 ? "" : "s"} a la canasta del cliente.
                  </p>
                )}
                {estado === "celebrando" && (
                  <p className="text-sm font-bold text-emerald-300">
                    ¡Pedido entregado correctamente! 🎉
                  </p>
                )}
              </div>

              {/* Botón vaciar canasta */}
              {piezasEnCanasta.length > 0 && estado === "arrastrando" && (
                <button
                  onClick={vaciarCanasta}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-orange-400/40 bg-white/10 py-2 text-sm font-bold text-orange-200 transition hover:bg-white/20"
                >
                  <Undo2 size={14} strokeWidth={2.5} /> Vaciar canasta
                </button>
              )}
            </div>

            {/* ============ Columna derecha: cliente + canasta ============ */}
            <div className="flex flex-col gap-4">
              {/* Cliente (abuela) con bocadillo */}
              <div className="rounded-3xl border-2 border-rose-400/30 bg-white/10 p-4 shadow-lg backdrop-blur-md sm:p-5">
                <div className="flex items-start gap-3">
                  {/* Abuela SVG */}
                  <div
                    className="h-24 w-24 shrink-0 sm:h-28 sm:w-28"
                    style={{ filter: "drop-shadow(0 4px 12px rgba(251,113,133,0.4))" }}
                  >
                    <AbuelaSVG hablando={esPresentacion || esCelebrando} />
                  </div>
                  {/* Bocadillo glowing con glassmorphism */}
                  <div
                    className="relative flex-1 rounded-2xl border-2 px-4 py-3 backdrop-blur-md"
                    style={{
                      borderColor: `${TEMA_COLOR}66`,
                      background: `linear-gradient(135deg, rgba(251,113,133,0.18), rgba(251,191,36,0.10))`,
                      boxShadow: `0 0 22px ${TEMA_COLOR}44, inset 0 1px 0 rgba(255,255,255,0.18)`,
                    }}
                  >
                    {/* Cola del bocadillo */}
                    <div
                      className="absolute -left-2 top-5 h-4 w-4 rotate-45"
                      style={{
                        borderBottom: `2px solid ${TEMA_COLOR}66`,
                        borderLeft: `2px solid ${TEMA_COLOR}66`,
                        background: "rgba(251,113,133,0.18)",
                      }}
                    />
                    <p
                      className="text-base font-semibold leading-snug text-white sm:text-lg"
                      style={{ fontFamily: "Fredoka, sans-serif" }}
                    >
                      {renderFrase(nivel.frase_del_cliente)}
                    </p>
                  </div>
                </div>

                {/* Fracción pedida (grande, para reforzar) */}
                <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-orange-500/15 py-2">
                  <span className="text-sm font-semibold text-orange-200">El cliente quiere:</span>
                  <span className="inline-flex items-center text-orange-100">
                    <Fraccion
                      num={nivel.numerador_pedido}
                      den={nivel.denominador_cortes}
                      className="text-orange-200"
                    />
                  </span>
                </div>

                {nivel.es_equivalente_de && (
                  <p className="mt-2 text-center text-xs font-semibold text-emerald-300">
                    💡 Pista: {nivel.fraccion_plana} es lo mismo que {nivel.es_equivalente_de}
                  </p>
                )}
              </div>

              {/* Canasta del cliente (drop zone) */}
              <div
                ref={canastaRef}
                onDragOver={(e) => {
                  if (estado === "arrastrando") {
                    e.preventDefault();
                    setDragOverCanasta(true);
                  }
                }}
                onDragLeave={() => setDragOverCanasta(false)}
                onDrop={onDropCanasta}
                className={`relative flex-1 overflow-hidden rounded-3xl border-[3px] p-4 shadow-lg backdrop-blur-md transition-all sm:p-5 ${
                  dragOverCanasta
                    ? "border-emerald-400 bg-emerald-500/20 scale-[1.02]"
                    : estado === "arrastrando"
                      ? "border-dashed border-orange-400 bg-white/10"
                      : "border-orange-400/30 bg-white/10"
                }`}
              >
                {/* Fondo de canasta SVG */}
                <div className="pointer-events-none absolute inset-0 flex items-end justify-center opacity-30">
                  <div className="w-3/4">
                    <CanastaSVG llena={piezasEnCanasta.length > 0} />
                  </div>
                </div>

                <div className="relative mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-sm font-bold text-orange-100 sm:text-base">
                    <ShoppingCart size={16} className="text-orange-300" strokeWidth={2.5} />
                    Canasta del cliente
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      piezasEnCanasta.length === nivel.numerador_pedido
                        ? "bg-emerald-500/30 text-emerald-200"
                        : "bg-orange-500/25 text-orange-200"
                    }`}
                  >
                    {piezasEnCanasta.length} / {nivel.numerador_pedido}
                  </span>
                </div>

                <div className="relative min-h-[140px]">
                  {piezasEnCanasta.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-orange-400/30 bg-orange-500/5 text-center">
                      <span className="text-3xl opacity-60">🧺</span>
                      <p className="text-xs font-semibold text-orange-200/80 sm:text-sm">
                        Arrastra aquí los pedazos
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-orange-500/10 p-3">
                      {piezasEnCanasta.map((i) => (
                        <button
                          key={i}
                          onClick={() => quitarDeCanasta(i)}
                          className="group relative rounded-xl bg-white/15 p-1 shadow backdrop-blur-sm transition hover:scale-105 hover:bg-rose-500/20"
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
                </div>

                {piezasEnCanasta.length > 0 && (
                  <p className="relative mt-2 text-center text-xs font-semibold text-orange-200/70">
                    Toca un pedazo para regresarlo al producto
                  </p>
                )}
              </div>

              {/* Feedback de error */}
              {feedback && (esArrastrando || estado === "verificando") && (
                <div className="animate-bounce-in rounded-2xl border-2 border-amber-400/50 bg-amber-500/15 px-4 py-3 shadow backdrop-blur-md">
                  <p className="flex items-start gap-2 text-sm font-semibold text-amber-100">
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
                    aria-label="Atender al cliente y empezar a cortar el producto"
                    className="group relative flex-1 overflow-hidden rounded-2xl py-3.5 text-base font-black text-white shadow-lg transition active:scale-95"
                    style={{
                      background: `linear-gradient(180deg, ${TEMA_COLOR} 0%, ${TEMA_COLOR}cc 50%, ${TEMA_COLOR}99 100%)`,
                      boxShadow: `0 6px 0 ${TEMA_COLOR}66, 0 10px 24px ${TEMA_COLOR}55, inset 0 2px 0 rgba(255,255,255,0.4)`,
                    }}
                  >
                    {/* sheen */}
                    <span
                      className="pointer-events-none absolute inset-0 opacity-60"
                      style={{
                        background:
                          "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)",
                        transform: "translateX(-100%)",
                        animation: "sheen-pulperia 2.4s ease-in-out infinite",
                      }}
                    />
                    <span className="relative flex items-center justify-center gap-2">
                      <ShoppingCart size={18} strokeWidth={2.5} />
                      ¡Atender al cliente!
                    </span>
                    <style jsx>{`
                      @keyframes sheen-pulperia {
                        0%, 100% { transform: translateX(-100%); }
                        50% { transform: translateX(100%); }
                      }
                    `}</style>
                  </button>
                )}
                {(esArrastrando || esVerificando) && (
                  <button
                    onClick={entregar}
                    disabled={!puedeEntregar || esVerificando}
                    aria-label="Entregar el pedido al cliente"
                    className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-black shadow-lg transition active:scale-95 ${
                      puedeEntregar
                        ? "bg-gradient-to-r from-emerald-400 to-lime-400 text-white hover:scale-[1.02] hover:shadow-xl"
                        : "cursor-not-allowed bg-white/10 text-white/40"
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
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-lime-400 py-3.5 text-base font-black text-white shadow-lg"
                  >
                    <PartyPopper size={18} strokeWidth={2.5} /> ¡Bien hecho!
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Capa de FloatingScores (relativa al contenedor) */}
          {scores.map((s) => (
            <FloatingScore key={s.id} item={s} />
          ))}
        </div>
      </div>

      {/* Capa de ParticleBurst (fixed, en viewport coords) */}
      {bursts.map((b) => (
        <ParticleBurst key={b.id} burst={b} />
      ))}

      {/* Confetti al celebrar */}
      {esCelebrando && (
        <div className="pointer-events-none fixed inset-0 z-[60]">
          <ConfettiLocal cantidad={48} duracionMs={2200} />
        </div>
      )}
    </GameShell>
  );
}

/* ============================================================
   Confetti local (sin dependencia externa)
   ============================================================ */

function ConfettiLocal({ cantidad = 48, duracionMs = 2200 }: { cantidad?: number; duracionMs?: number }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), duracionMs);
    return () => clearTimeout(t);
  }, [duracionMs]);

  const colors = ["#fb7185", "#fbbf24", "#10b981", "#22d3ee", "#a78bfa", "#ffffff"];
  const pieces = useMemo(
    () =>
      Array.from({ length: cantidad }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.6 + Math.random() * 1.4,
        color: colors[i % colors.length],
        size: 6 + Math.random() * 8,
        rot: Math.random() * 360,
        round: Math.random() > 0.5,
      })),
    [cantidad, colors],
  );

  if (!show) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-[-20px]"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * 1.4}px`,
              background: p.color,
              borderRadius: p.round ? "9999px" : "1px",
              "--rot-end": `${p.rot}deg`,
              animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
            } as React.CSSProperties
          }
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(var(--rot-end));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
