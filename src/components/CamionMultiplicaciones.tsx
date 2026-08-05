"use client";

/* ============================================================
   El Camión de las Multiplicaciones — Versión AAA
   ------------------------------------------------------------
   Mecánica pedagógica (conservada):
   1. Un cliente del mercado pide N cajitas con M ítems cada una.
   2. El niño arrastra (o toca) N cajitas desde la pila al camión.
   3. Cada cajita muestra visualmente M ítems (emoji) en su interior.
   4. Al presionar "¡Despachar!" se valida:
      - Si cargó exactamente N cajitas → celebración + operación formal.
      - Si cargó de más o de menos → feedback pedagógico.
   5. Avance por 10 niveles hasta "¡Transportista Experto!" 🏆.

   Capa AAA (nueva):
   - GameShell + GameIntro + GameHUD + GameOverlay (infraestructura unificada)
   - Camión SVG hiperdetallado con cabina, parabrisas, ruedas cromadas,
     toldo de mercado, caja metálica, faros y humo animado.
   - Animación de despacho: sacudida + giro de ruedas + humo + salida.
   - Cajitas SVG con textura de cartón corrugado.
   - Cliente SVG (vendedor del mercado con sombrero y delantal).
   - Puntos +15 por cajita, +50 bonus por despacho perfecto.
   - Combo x2, x3... por despachos seguidos sin error.
   - Timer 90s por nivel, 3 vidas, racha.
   - FloatingScore + ParticleBurst + SFX sintetizados.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Hand,
  Package,
  RefreshCw,
  Undo2,
  Truck as TruckIcon,
} from "lucide-react";
import { nivelesCamion, type NivelCamion } from "@/data/camionMultiplicaciones";
import { Confetti } from "@/components/Toasts";
import {
  GameShell,
  GameHUD,
  GameIntro,
  GameOverlay,
  useGameAudio,
  FloatingScore,
  ParticleBurst,
  nextScoreId,
  type FloatingScoreItem,
  type BurstConfig,
} from "@/components/game";

/* ----------------------- Tipos y constantes ----------------------- */

type Estado =
  | "intro"
  | "cargando"
  | "verificando"
  | "celebrando"
  | "completado"
  | "gameover";

type ProductoVisual = NivelCamion["producto_visual"];

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
const EXTRAS_PILA = 4;
const TIMER_MS = 90_000;
const PUNTOS_POR_CAJITA = 15;
const BONUS_DESPACHO_PERFECTO = 50;
const VIDAS_MAXIMAS = 3;
const TEMA_COLOR = "#22d3ee"; // cyan

/* ----------------------- Cajita (SVG cartón) ----------------------- */

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
      className={`group relative grid shrink-0 select-none place-items-center overflow-hidden rounded-lg border-2 shadow-md transition ${sz.box} ${
        cargada
          ? "border-emerald-400"
          : "border-amber-800/70 hover:border-orange-400 hover:shadow-lg"
      } ${draggable ? "cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95" : ""}`}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      aria-label={`Cajita ${index + 1} con ${cantidad} ${PRODUCTO_NOMBRE[producto]}`}
      title={`Cajita con ${cantidad} ${PRODUCTO_NOMBRE[producto]}`}
    >
      {/* Fondo cartón (gradiente marrón) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: cargada
            ? "linear-gradient(135deg, #fde68a 0%, #fbbf24 50%, #d97706 100%)"
            : "linear-gradient(135deg, #fcd34d 0%, #d97706 60%, #78350f 100%)",
        }}
      />
      {/* Líneas de corrugado */}
      <svg
        aria-hidden
        viewBox="0 0 60 60"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-30"
      >
        {[10, 20, 30, 40, 50].map((y) => (
          <line key={y} x1="0" y1={y} x2="60" y2={y} stroke="#78350f" strokeWidth="0.5" />
        ))}
      </svg>
      {/* Solapa superior abierta */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/4"
        style={{
          background: "linear-gradient(180deg, rgba(120,53,15,0.4) 0%, transparent 100%)",
        }}
      />
      {/* Highlight superior izquierdo */}
      <div
        aria-hidden
        className="absolute left-0 top-0 h-1/2 w-1/2 rounded-tl-md"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 60%)",
        }}
      />
      {/* Productos emoji */}
      <div className="relative z-10 grid w-full place-items-center" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cantidad }).map((_, i) => (
          <span
            key={i}
            className={`${sz.emoji} leading-none flex items-center justify-center drop-shadow`}
          >
            {emoji}
          </span>
        ))}
      </div>
      {/* Sombra inferior */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/4"
        style={{
          background: "linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)",
        }}
      />
      {/* Badge "cargada" */}
      {cargada && (
        <div className="absolute -right-1 -top-1 z-20 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-[9px] font-black text-white shadow">
          ✓
        </div>
      )}
    </div>
  );
}

/* ----------------------- Camión SVG hiperdetallado ----------------------- */

function CamionSVG({
  dragOver,
  cajitasCargadas,
  gruposObjetivo,
  celebrando,
  verificando,
}: {
  dragOver: boolean;
  cajitasCargadas: number;
  gruposObjetivo: number;
  celebrando: boolean;
  verificando: boolean;
}) {
  const completo = cajitasCargadas === gruposObjetivo && gruposObjetivo > 0;
  const sePaso = cajitasCargadas > gruposObjetivo;
  const farosOn = celebrando || dragOver;
  const animating = celebrando || verificando;

  const colorBorde = sePaso
    ? "#f43f5e"
    : dragOver
    ? "#10b981"
    : completo
    ? "#10b981"
    : "#0e7490";

  return (
    <div
      className={`relative w-full ${animating ? "truck-animating" : ""} ${
        celebrando ? "truck-celebrating" : ""
      } ${verificando ? "truck-verifying" : ""}`}
    >
      <svg viewBox="0 0 360 230" className="w-full drop-shadow-2xl" aria-hidden>
        <defs>
          {/* Gradiente cabina */}
          <linearGradient id="cabinaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#155e75" />
          </linearGradient>
          {/* Gradiente ventana */}
          <linearGradient id="ventanaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="60%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          {/* Gradiente caja metálica */}
          <linearGradient id="cajaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={dragOver ? "#fef3c7" : "#fde68a"} />
            <stop offset="40%" stopColor={dragOver ? "#fde68a" : "#fbbf24"} />
            <stop offset="100%" stopColor={dragOver ? "#d97706" : "#92400e"} />
          </linearGradient>
          {/* Gradiente toldo */}
          <linearGradient id="toldoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
          {/* Gradiente rueda */}
          <radialGradient id="ruedaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="70%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          <radialGradient id="rimGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f3f4f6" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </radialGradient>
          {/* Glow faro */}
          <filter id="faroGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Gradiente metal highlight */}
          <linearGradient id="metalShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Sombra inferior */}
        <ellipse cx="180" cy="210" rx="160" ry="9" fill="#000000" opacity="0.35" />

        {/* Humo del escape (3 puffs) */}
        <g className="smoke-group">
          <circle className="smoke smoke-1" cx="240" cy="95" r="6" fill="#cbd5e1" opacity="0" />
          <circle className="smoke smoke-2" cx="246" cy="88" r="8" fill="#e2e8f0" opacity="0" />
          <circle className="smoke smoke-3" cx="254" cy="80" r="10" fill="#f1f5f9" opacity="0" />
        </g>

        {/* Tubería del escape */}
        <rect x="236" y="100" width="6" height="14" rx="2" fill="#475569" />
        <ellipse cx="239" cy="100" rx="4" ry="2" fill="#1e293b" />

        {/* === Caja de carga (atrás) === */}
        <g>
          {/* Cuerpo caja */}
          <rect
            x="20"
            y="60"
            width="220"
            height="110"
            rx="12"
            fill="url(#cajaGrad)"
            stroke={colorBorde}
            strokeWidth="3"
            style={{ transition: "stroke 0.25s" }}
          />
          {/* Techo más oscuro (borde superior) */}
          <rect x="20" y="60" width="220" height="16" rx="8" fill="#7c2d12" opacity="0.55" />
          {/* Divisiones decorativas verticales (paneles) */}
          <line x1="75" y1="76" x2="75" y2="170" stroke="#7c2d12" strokeWidth="1.2" opacity="0.3" />
          <line x1="130" y1="76" x2="130" y2="170" stroke="#7c2d12" strokeWidth="1.2" opacity="0.3" />
          <line x1="185" y1="76" x2="185" y2="170" stroke="#7c2d12" strokeWidth="1.2" opacity="0.3" />
          {/* Highlight metálico */}
          <rect x="30" y="78" width="200" height="6" fill="url(#metalShine)" opacity="0.5" />
          <rect x="30" y="120" width="200" height="3" fill="url(#metalShine)" opacity="0.25" />

          {/* Toldo del mercado con franjas coloridas (encima de la caja) */}
          <g>
            <path
              d="M 14 58 L 246 58 L 252 50 L 8 50 Z"
              fill="url(#toldoGrad)"
              stroke="#7c2d12"
              strokeWidth="1.5"
            />
            {/* Franjas coloridas */}
            {[
              { x: 18, c: "#fbbf24" },
              { x: 48, c: "#f43f5e" },
              { x: 78, c: "#10b981" },
              { x: 108, c: "#3b82f6" },
              { x: 138, c: "#fbbf24" },
              { x: 168, c: "#f43f5e" },
              { x: 198, c: "#10b981" },
              { x: 228, c: "#3b82f6" },
            ].map((s, i) => (
              <rect key={i} x={s.x} y="50" width="28" height="8" fill={s.c} opacity="0.85" />
            ))}
            {/* Onda del toldo (triángulos) */}
            <path
              d="M 8 58 L 20 70 L 32 58 L 44 70 L 56 58 L 68 70 L 80 58 L 92 70 L 104 58 L 116 70 L 128 58 L 140 70 L 152 58 L 164 70 L 176 58 L 188 70 L 200 58 L 212 70 L 224 58 L 236 70 L 248 58 Z"
              fill="url(#toldoGrad)"
              stroke="#7c2d12"
              strokeWidth="1"
            />
          </g>
        </g>

        {/* === Cabina === */}
        <g>
          {/* Cuerpo cabina */}
          <path
            d="M 240 80 L 240 170 L 340 170 L 340 120 Q 340 80 300 80 Z"
            fill="url(#cabinaGrad)"
            stroke="#0e7490"
            strokeWidth="3"
          />
          {/* Highlight metal cabina */}
          <path
            d="M 246 84 L 246 130 L 252 130 L 252 88 Q 258 84 268 84 Z"
            fill="rgba(255,255,255,0.25)"
          />
          {/* Parabrisas / ventana */}
          <rect x="252" y="92" width="78" height="32" rx="5" fill="url(#ventanaGrad)" stroke="#0c4a6e" strokeWidth="1.5" />
          {/* Reflejo del parabrisas */}
          <polygon points="256,96 270,96 264,120 256,120" fill="rgba(255,255,255,0.55)" />
          <polygon points="280,96 290,96 286,108 280,108" fill="rgba(255,255,255,0.3)" />
          {/* Detalle puerta */}
          <line x1="295" y1="130" x2="295" y2="170" stroke="#0e7490" strokeWidth="1.5" opacity="0.7" />
          <circle cx="305" cy="148" r="3" fill="#0e7490" />
          {/* Manija */}
          <rect x="288" y="146" width="6" height="3" rx="1" fill="#0e7490" />
          {/* Piso de la cabina */}
          <rect x="240" y="166" width="100" height="6" fill="#0e7490" opacity="0.5" />
        </g>

        {/* === Faros delanteros === */}
        <g>
          {/* Faro principal */}
          <circle
            cx="335"
            cy="155"
            r="5"
            fill={farosOn ? "#fef08a" : "#fde047"}
            filter={farosOn ? "url(#faroGlow)" : undefined}
            style={{ transition: "fill 0.2s" }}
          />
          {farosOn && (
            <circle cx="335" cy="155" r="9" fill="#fef08a" opacity="0.4" />
          )}
          {/* Luz de cruce */}
          <circle
            cx="335"
            cy="142"
            r="3"
            fill={farosOn ? "#fef08a" : "#facc15"}
            filter={farosOn ? "url(#faroGlow)" : undefined}
          />
        </g>

        {/* === Ruedas === */}
        <g className="wheel" style={{ transformOrigin: "75px 175px" }}>
          {/* Rueda trasera */}
          <circle cx="75" cy="175" r="20" fill="url(#ruedaGrad)" stroke="#0f172a" strokeWidth="2" />
          <circle cx="75" cy="175" r="12" fill="url(#rimGrad)" stroke="#475569" strokeWidth="1.5" />
          {/* Rayos */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <line
              key={deg}
              x1="75"
              y1="175"
              x2={75 + 10 * Math.cos((deg * Math.PI) / 180)}
              y2={175 + 10 * Math.sin((deg * Math.PI) / 180)}
              stroke="#475569"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
          <circle cx="75" cy="175" r="3" fill="#1e293b" />
        </g>

        <g className="wheel" style={{ transformOrigin: "295px 175px" }}>
          {/* Rueda delantera */}
          <circle cx="295" cy="175" r="20" fill="url(#ruedaGrad)" stroke="#0f172a" strokeWidth="2" />
          <circle cx="295" cy="175" r="12" fill="url(#rimGrad)" stroke="#475569" strokeWidth="1.5" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <line
              key={deg}
              x1="295"
              y1="175"
              x2={295 + 10 * Math.cos((deg * Math.PI) / 180)}
              y2={175 + 10 * Math.sin((deg * Math.PI) / 180)}
              stroke="#475569"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
          <circle cx="295" cy="175" r="3" fill="#1e293b" />
        </g>

        {/* === Contador flotante sobre la caja === */}
        <g>
          <rect
            x="95"
            y="32"
            width="80"
            height="28"
            rx="14"
            fill={completo ? "#10b981" : sePaso ? "#f43f5e" : "#fff7ed"}
            stroke={completo ? "#047857" : sePaso ? "#be123c" : "#92400e"}
            strokeWidth="2.5"
            style={{ transition: "fill 0.2s" }}
          />
          {/* Glow del badge */}
          {(completo || sePaso) && (
            <rect
              x="93"
              y="30"
              width="84"
              height="32"
              rx="16"
              fill="none"
              stroke={completo ? "#34d399" : "#fb7185"}
              strokeWidth="1.5"
              opacity="0.6"
            />
          )}
          <text
            x="135"
            y="51"
            textAnchor="middle"
            fontSize="15"
            fontWeight="bold"
            fill={completo || sePaso ? "#ffffff" : "#92400e"}
            fontFamily="Fredoka, sans-serif"
          >
            {cajitasCargadas} / {gruposObjetivo}
          </text>
        </g>
        {/* Conector contador→caja */}
        <line x1="135" y1="60" x2="135" y2="64" stroke="#92400e" strokeWidth="2" opacity="0.5" />
      </svg>

      {/* Estilos de animación del camión */}
      <style jsx>{`
        .truck-animating .wheel {
          animation: wheel-spin 0.4s linear infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        .truck-verifying {
          animation: truck-shake 0.18s ease-in-out infinite;
        }
        .truck-celebrating {
          animation: truck-dispatch 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .truck-celebrating .smoke-1 {
          animation: smoke-puff 1.6s ease-out 0.1s infinite;
        }
        .truck-celebrating .smoke-2 {
          animation: smoke-puff 1.6s ease-out 0.35s infinite;
        }
        .truck-celebrating .smoke-3 {
          animation: smoke-puff 1.6s ease-out 0.6s infinite;
        }
        @keyframes wheel-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes truck-shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-3px) rotate(-0.4deg); }
          75% { transform: translateX(3px) rotate(0.4deg); }
        }
        @keyframes truck-dispatch {
          0% { transform: translateX(0) rotate(0); }
          8% { transform: translateX(-4px) rotate(-0.6deg); }
          16% { transform: translateX(4px) rotate(0.6deg); }
          24% { transform: translateX(-3px) rotate(-0.3deg); }
          32% { transform: translateX(2px) rotate(0.3deg); }
          40% { transform: translateX(0) rotate(0); }
          100% { transform: translateX(140%) rotate(0); opacity: 0; }
        }
        @keyframes smoke-puff {
          0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
          30% { opacity: 0.8; transform: translate(-4px, -8px) scale(1); }
          100% { opacity: 0; transform: translate(-12px, -28px) scale(2); }
        }
      `}</style>
    </div>
  );
}

/* ----------------------- Cliente SVG (vendedor del mercado) ----------------------- */

function ClienteSVG() {
  return (
    <svg viewBox="0 0 100 120" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="sombreroGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="delantalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <radialGradient id="caraGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fde9c8" />
          <stop offset="100%" stopColor="#d4a574" />
        </radialGradient>
      </defs>
      {/* Sombrero de paja */}
      <ellipse cx="50" cy="20" rx="38" ry="6" fill="url(#sombreroGrad)" stroke="#92400e" strokeWidth="1" />
      <ellipse cx="50" cy="18" rx="20" ry="5" fill="url(#sombreroGrad)" stroke="#92400e" strokeWidth="1" />
      <path d="M 32 18 Q 32 8 50 6 Q 68 8 68 18 Z" fill="url(#sombreroGrad)" stroke="#92400e" strokeWidth="1" />
      {/* Cinta del sombrero */}
      <path d="M 33 17 Q 50 14 67 17 L 67 19 Q 50 16 33 19 Z" fill="#dc2626" />
      {/* Cara */}
      <circle cx="50" cy="40" r="14" fill="url(#caraGrad)" stroke="#92400e" strokeWidth="0.5" />
      {/* Ojos */}
      <circle cx="44" cy="38" r="1.5" fill="#1f2937" />
      <circle cx="56" cy="38" r="1.5" fill="#1f2937" />
      {/* Sonrisa */}
      <path d="M 44 46 Q 50 51 56 46" stroke="#7c2d12" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Cachetes sonrojados */}
      <circle cx="42" cy="44" r="2" fill="#fb7185" opacity="0.5" />
      <circle cx="58" cy="44" r="2" fill="#fb7185" opacity="0.5" />
      {/* Cuello */}
      <rect x="46" y="52" width="8" height="6" fill="#d4a574" />
      {/* Camisa (roja) */}
      <path d="M 30 60 Q 50 56 70 60 L 72 90 L 28 90 Z" fill="#dc2626" stroke="#7c2d12" strokeWidth="1" />
      {/* Delantal */}
      <path d="M 38 60 L 38 96 L 62 96 L 62 60 Z" fill="url(#delantalGrad)" stroke="#92400e" strokeWidth="1" opacity="0.95" />
      {/* Cordón del delantal */}
      <path d="M 38 60 Q 50 64 62 60" stroke="#92400e" strokeWidth="1.5" fill="none" />
      {/* Bolsillo del delantal */}
      <rect x="44" y="76" width="12" height="10" rx="1" fill="none" stroke="#92400e" strokeWidth="1" />
      {/* Brazo derecho (levantado, señalando) */}
      <path d="M 28 62 Q 18 56 14 48" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="14" cy="48" r="3.5" fill="url(#caraGrad)" stroke="#92400e" strokeWidth="0.5" />
      {/* Brazo izquierdo */}
      <path d="M 72 62 Q 80 70 78 80" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="78" cy="80" r="3.5" fill="url(#caraGrad)" stroke="#92400e" strokeWidth="0.5" />
      {/* Sombra inferior */}
      <ellipse cx="50" cy="104" rx="20" ry="3" fill="#000000" opacity="0.2" />
    </svg>
  );
}

/* ----------------------- Mercado de fondo ----------------------- */

function MercadoFondo() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Puestos difuminados con toldos coloridos */}
      <div className="absolute -left-12 top-1/4 h-40 w-32 rounded-t-2xl bg-gradient-to-b from-rose-500/15 to-amber-700/10 blur-md" />
      <div className="absolute left-8 top-1/3 h-32 w-24 rounded-t-2xl bg-gradient-to-b from-emerald-500/15 to-emerald-900/10 blur-md" />
      <div className="absolute right-10 top-1/4 h-44 w-32 rounded-t-2xl bg-gradient-to-b from-orange-500/15 to-red-900/10 blur-md" />
      <div className="absolute -right-16 top-1/3 h-36 w-28 rounded-t-2xl bg-gradient-to-b from-amber-500/15 to-orange-900/10 blur-md" />
      <div className="absolute right-1/4 bottom-10 h-28 w-20 rounded-t-2xl bg-gradient-to-b from-lime-500/12 to-green-900/8 blur-md" />

      {/* Canastos y productos decorativos (silueta) */}
      <div className="absolute left-6 bottom-8 text-5xl opacity-[0.07]">🧺</div>
      <div className="absolute right-8 bottom-12 text-5xl opacity-[0.07]">🪅</div>
      <div className="absolute left-1/4 top-16 text-5xl opacity-[0.06]">🥭</div>
      <div className="absolute right-1/3 top-12 text-5xl opacity-[0.06]">🌽</div>
      <div className="absolute left-1/2 bottom-6 text-5xl opacity-[0.06]">☕</div>

      {/* Franja de toldos superior */}
      <div className="absolute inset-x-0 top-0 h-8 overflow-hidden sm:h-10">
        <div className="flex h-full w-full">
          {[
            "#f97316", "#f43f5e", "#fbbf24", "#10b981",
            "#14b8a6", "#f59e0b", "#ef4444", "#84cc16",
            "#f97316", "#f43f5e", "#fbbf24", "#10b981",
          ].map((c, i) => (
            <div key={i} className="relative flex-1" style={{ backgroundColor: c, opacity: 0.35 }}>
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="absolute -bottom-px left-0 h-5 w-full">
                <polygon points="0,0 50,30 100,0" fill={c} opacity="0.6" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------- Componente principal ----------------------- */

export function CamionMultiplicaciones() {
  const sfx = useGameAudio();

  const [nivelIdx, setNivelIdx] = useState(0);
  const [estado, setEstado] = useState<Estado>("intro");
  const [cajitasCargadas, setCajitasCargadas] = useState<number[]>([]);
  const [camionesDespachados, setCamionesDespachados] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [dragOverCamion, setDragOverCamion] = useState(false);
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(VIDAS_MAXIMAS);
  const [racha, setRacha] = useState(0);
  const [rachaMaxima, setRachaMaxima] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [muted, setMuted] = useState(false);
  const [timerMs, setTimerMs] = useState(TIMER_MS);
  const [tuvoErrorNivel, setTuvoErrorNivel] = useState(false);
  const [floats, setFloats] = useState<FloatingScoreItem[]>([]);
  const [bursts, setBursts] = useState<(BurstConfig & { id: number })[]>([]);

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

  // Ref para medir el centro del camión (para ParticleBurst)
  const truckRef = useRef<HTMLDivElement>(null);

  const nivel = nivelesCamion[nivelIdx];
  const totalPila = nivel.grupos + EXTRAS_PILA;
  const indicesPila = useMemo(
    () => Array.from({ length: totalPila }, (_, i) => i),
    [totalPila],
  );
  const cajitasEnPila = indicesPila.filter((i) => !cajitasCargadas.includes(i));

  /* ---- Timer: referencia de inicio y handler de fin (vía ref para evitar re-renders) ---- */
  const cargandoStartRef = useRef<number>(0);
  const handleTiempoAgotadoRef = useRef<() => void>(() => {});

  // Actualizar el handler de "tiempo agotado" tras cada render (sin causar re-render)
  useEffect(() => {
    handleTiempoAgotadoRef.current = () => {
      sfx.error();
      sfx.vibrate([60, 40, 60]);
      setRacha(0);
      setTuvoErrorNivel(true);
      setFeedback("⏰ ¡Se acabó el tiempo! Cargá las cajitas más rápido la próxima vez.");
      setVidas((v) => {
        const nv = v - 1;
        if (nv <= 0) {
          programar(() => setEstado("gameover"), 600);
        } else {
          // Reiniciar timer para dar otra oportunidad
          cargandoStartRef.current = Date.now();
          setTimerMs(TIMER_MS);
        }
        return Math.max(0, nv);
      });
    };
  });

  /* ---- Timer: countdown cada 200ms, maneja fin dentro del interval ---- */
  useEffect(() => {
    if (estado !== "cargando") return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - cargandoStartRef.current;
      const remaining = Math.max(0, TIMER_MS - elapsed);
      setTimerMs(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        // Disparar lógica de "tiempo agotado" fuera del cuerpo del effect
        handleTiempoAgotadoRef.current();
      }
    }, 200);
    return () => clearInterval(interval);
  }, [estado, nivelIdx]);

  /* ---- Transición celebrando → siguiente nivel o completado ---- */
  useEffect(() => {
    if (estado !== "celebrando") return;
    const t = setTimeout(() => {
      if (nivelIdx + 1 >= TOTAL_NIVELES) {
        sfx.victory();
        setEstado("completado");
      } else {
        setNivelIdx((n) => n + 1);
        setCajitasCargadas([]);
        setFeedback(null);
        setTuvoErrorNivel(false);
        // Reset timer para el nuevo nivel
        cargandoStartRef.current = Date.now();
        setTimerMs(TIMER_MS);
        setEstado("cargando");
      }
    }, 2700);
    return () => clearTimeout(t);
  }, [estado, nivelIdx]);

  /* ---- Helpers de UI: floats y bursts ---- */
  const addFloat = useCallback(
    (x: number, y: number, text: string, color?: string, icon?: string) => {
      const id = nextScoreId();
      setFloats((f) => [...f, { id, x, y, text, color, icon }]);
      programar(() => setFloats((f) => f.filter((it) => it.id !== id)), 1000);
    },
    [programar],
  );

  const triggerBurst = useCallback(
    (count?: number, power?: number) => {
      if (!truckRef.current) return;
      const r = truckRef.current.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const id = nextScoreId();
      setBursts((b) => [...b, {
        id,
        x,
        y,
        count: count ?? 22,
        power: power ?? 1.5,
        colors: ["#22d3ee", "#10b981", "#fbbf24", "#f97316", "#f43f5e", "#ffffff"],
      }]);
      programar(() => setBursts((b) => b.filter((it) => it.id !== id)), 1000);
    },
    [programar],
  );

  /* ---- Acciones ---- */

  const empezarJuego = useCallback(() => {
    sfx.click();
    sfx.vibrate(20);
    setNivelIdx(0);
    setCajitasCargadas([]);
    setCamionesDespachados(0);
    setPuntos(0);
    setVidas(VIDAS_MAXIMAS);
    setRacha(0);
    setRachaMaxima(0);
    setAciertos(0);
    setIntentos(0);
    setFeedback(null);
    setTuvoErrorNivel(false);
    setTimerMs(TIMER_MS);
    setEstado("cargando");
  }, [sfx]);

  const cargarCajita = useCallback(
    (i: number) => {
      if (estado !== "cargando") return;
      if (cajitasCargadas.includes(i)) return;
      setCajitasCargadas((p) => [...p, i]);
      setFeedback(null);
      sfx.whoosh();
      sfx.vibrate(15);
      // Float "+1" pequeño al cargar
      addFloat(28 + Math.random() * 10, 45 + Math.random() * 8, "+1", "#22d3ee", "📦");
    },
    [estado, cajitasCargadas, sfx, addFloat],
  );

  const quitarCajita = useCallback(
    (i: number) => {
      if (estado !== "cargando") return;
      setCajitasCargadas((p) => p.filter((x) => x !== i));
      setFeedback(null);
      sfx.pop();
    },
    [estado, sfx],
  );

  const vaciarCamion = useCallback(() => {
    if (estado !== "cargando") return;
    setCajitasCargadas([]);
    setFeedback(null);
    sfx.click();
  }, [estado, sfx]);

  const despachar = useCallback(() => {
    if (estado !== "cargando") return;
    if (cajitasCargadas.length === 0) return;
    setEstado("verificando");
    setIntentos((n) => n + 1);
    const correcto = cajitasCargadas.length === nivel.grupos;

    programar(() => {
      if (correcto) {
        // === Despacho correcto ===
        const nuevasCajitas = cajitasCargadas.length;
        const puntosCajitas = nuevasCajitas * PUNTOS_POR_CAJITA;
        const perfecto = !tuvoErrorNivel;
        const bonus = perfecto ? BONUS_DESPACHO_PERFECTO : 0;
        const nuevaRacha = racha + 1;
        const multiplicador = nuevaRacha >= 2 ? Math.min(nuevaRacha, 5) : 1;
        const totalGanado = (puntosCajitas + bonus) * multiplicador;

        setPuntos((p) => p + totalGanado);
        setCamionesDespachados((v) => v + 1);
        setRacha(nuevaRacha);
        setRachaMaxima((m) => Math.max(m, nuevaRacha));
        setAciertos((a) => a + 1);
        setEstado("celebrando");

        // SFX
        sfx.coin();
        programar(() => {
          if (perfecto) sfx.success();
        }, 180);
        if (nuevaRacha >= 2) {
          programar(() => sfx.combo(nuevaRacha), 320);
        }
        sfx.vibrate([40, 30, 60]);

        // Floats: "+15 × N" y "+50 BONUS!"
        addFloat(35, 38, `+${puntosCajitas}`, "#fbbf24", "⭐");
        if (perfecto) {
          programar(() => addFloat(60, 32, `+${bonus} BONUS!`, "#10b981", "✨"), 200);
          // ParticleBurst en el camión
          programar(() => triggerBurst(28, 1.8), 250);
        }
        if (multiplicador > 1) {
          programar(
            () => addFloat(45, 25, `¡COMBO x${multiplicador}!`, "#f97316", "🔥"),
            400,
          );
        }
      } else {
        // === Despacho incorrecto ===
        sfx.error();
        sfx.vibrate([60, 40, 60]);
        setRacha(0);
        setTuvoErrorNivel(true);
        setFeedback(nivel.feedback_error);
        setVidas((v) => {
          const nv = v - 1;
          if (nv <= 0) {
            programar(() => setEstado("gameover"), 500);
          } else {
            setEstado("cargando");
            // Reiniciar timer (da una oportunidad más)
            cargandoStartRef.current = Date.now();
            setTimerMs(TIMER_MS);
          }
          return Math.max(0, nv);
        });
      }
    }, 500);
  }, [
    estado,
    cajitasCargadas.length,
    nivel.grupos,
    nivel.feedback_error,
    tuvoErrorNivel,
    racha,
    sfx,
    programar,
    addFloat,
    triggerBurst,
  ]);

  const reiniciarJuego = useCallback(() => {
    sfx.click();
    setEstado("intro");
  }, [sfx]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const nm = !m;
      sfx.setMuted(nm);
      if (!nm) sfx.click();
      return nm;
    });
  }, [sfx]);

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
  const esIntro = estado === "intro";
  const esCargando = estado === "cargando";
  const esVerificando = estado === "verificando";
  const esCelebrando = estado === "celebrando";
  const esCompletado = estado === "completado";
  const esGameover = estado === "gameover";
  const puedeDespachar = esCargando && cajitasCargadas.length > 0;

  /* ---- Tamaños de cajitas según cantidad de grupos ---- */
  const sizePila: CajitaSize =
    nivel.grupos > 12 ? "sm" : nivel.grupos > 6 ? "md" : "lg";
  const sizeCamion: CajitaSize = nivel.grupos > 6 ? "sm" : "md";

  /* ===================== RENDER ===================== */

  // Pantalla de presentación inicial
  if (esIntro) {
    return (
      <GameShell theme="math">
        <GameIntro
          icono={<span className="text-7xl sm:text-8xl">🚛</span>}
          titulo="El Camión de las Multiplicaciones"
          subtitulo="Cargá cajitas y despachá pedidos"
          descripcion="Un cliente del mercado nicaragüense te pide N cajitas con M ítems cada una. ¡Cargá el camión correctamente y aprendé a multiplicar!"
          pasos={[
            "Leé cuántas cajitas pide el cliente",
            "Arrastrá las cajitas al camión",
            "Verificá que cada una tenga los ítems correctos",
            "¡Despachá y ganá puntos!",
          ]}
          temaColor={TEMA_COLOR}
          onJugar={empezarJuego}
        />
      </GameShell>
    );
  }

  // Pantalla final (victoria o derrota)
  if (esCompletado || esGameover) {
    return (
      <>
        <GameShell theme="math">
          <div className="min-h-[calc(100vh-120px)]" />
        </GameShell>
        <GameOverlay
          tipo={esCompletado ? "victoria" : "derrota"}
          titulo={esCompletado ? "¡Transportista Experto!" : "¡Se acabaron las vidas!"}
          subtitulo={
            esCompletado
              ? `Despachaste ${camionesDespachados} camiones con éxito en el mercado nicaragüense. 🎉`
              : `Llegaste al nivel ${nivelIdx + 1} de ${TOTAL_NIVELES}. ¡Intentalo de nuevo!`
          }
          stats={{
            puntos,
            rachaMaxima,
            aciertos,
            total: intentos,
          }}
          onReiniciar={reiniciarJuego}
          onSalir={reiniciarJuego}
          temaColor={TEMA_COLOR}
        />
      </>
    );
  }

  // Gameplay
  return (
    <GameShell theme="math">
      <GameHUD
        theme="math"
        nivel={nivelIdx + 1}
        totalNiveles={TOTAL_NIVELES}
        puntos={puntos}
        vidas={vidas}
        vidasMaximas={VIDAS_MAXIMAS}
        racha={racha}
        timerMs={timerMs}
        timerTotalMs={TIMER_MS}
        muted={muted}
        onToggleMute={toggleMute}
        icono={<TruckIcon size={18} strokeWidth={2.5} />}
      />

      {/* Fondos decorativos del mercado */}
      <MercadoFondo />

      <div className="relative z-10 mx-auto max-w-5xl px-3 pb-8 pt-4 sm:px-5 sm:pt-6">
        {/* Barra de progreso visual extra (debajo del HUD) */}
        <div className="mb-4 hidden h-1.5 w-full overflow-hidden rounded-full bg-white/10 md:block">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 transition-all duration-700 ease-out"
            style={{ width: `${progresoNivel}%` }}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* ============ Columna izquierda: cliente + camión ============ */}
          <div className="flex flex-col gap-4">
            {/* Cliente con bocadillo */}
            <div className="rounded-3xl border-2 border-cyan-400/40 bg-white/10 p-4 shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-md sm:p-5">
              <div className="flex items-start gap-3">
                {/* Avatar SVG del vendedor */}
                <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                  <div
                    className="absolute inset-0 rounded-2xl border-2 border-cyan-400/40"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 30%, rgba(34,211,238,0.25), rgba(8,145,178,0.1))",
                      boxShadow: "0 0 18px rgba(34,211,238,0.4)",
                    }}
                  />
                  <div className="relative h-full w-full">
                    <ClienteSVG />
                  </div>
                </div>

                {/* Bocadillo glowing */}
                <div className="relative flex-1">
                  <div
                    className="absolute -left-1.5 top-6 h-3.5 w-3.5 rotate-45 border-b-2 border-l-2 border-cyan-300/70"
                    style={{ background: "rgba(34,211,238,0.12)" }}
                  />
                  <div
                    className="relative rounded-2xl border-2 border-cyan-300/70 px-4 py-3 shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(34,211,238,0.12) 0%, rgba(14,116,144,0.18) 100%)",
                    }}
                  >
                    <p className="text-sm font-semibold leading-snug text-cyan-50 sm:text-base">
                      {nivel.frase_del_cliente}
                    </p>
                  </div>
                </div>
              </div>

              {/* Encargo visual (sin revelar la respuesta) */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 py-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300/80 sm:text-sm">
                  Encargo:
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-white/10 px-3 py-1 text-base font-black text-cyan-50 shadow">
                  {nivel.grupos} cajitas
                </span>
                <span className="text-base font-black text-cyan-400">×</span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-white/10 px-3 py-1 text-base font-black text-cyan-50 shadow">
                  {nivel.elementos_por_grupo} {PRODUCTO_EMOJI[nivel.producto_visual]}
                </span>
              </div>

              <p className="mt-2 text-center text-xs font-medium text-cyan-200/70">
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
              className={`rounded-3xl border-[3px] p-4 shadow-lg backdrop-blur-md transition-all sm:p-5 ${
                dragOverCamion
                  ? "border-emerald-400 bg-emerald-500/15 scale-[1.02] shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                  : esCargando
                  ? "border-dashed border-cyan-400/60 bg-white/10"
                  : "border-cyan-400/30 bg-white/5"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-sm font-black text-cyan-100 sm:text-base">
                  <TruckIcon size={16} className="text-cyan-300" strokeWidth={2.5} />
                  Camión de carga
                </h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                    cajitasCargadas.length === nivel.grupos && nivel.grupos > 0
                      ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/50"
                      : cajitasCargadas.length > nivel.grupos
                      ? "bg-rose-500/30 text-rose-200 border border-rose-400/50"
                      : "bg-cyan-500/20 text-cyan-100 border border-cyan-400/40"
                  }`}
                >
                  {cajitasCargadas.length} / {nivel.grupos} cajitas
                </span>
              </div>

              {/* SVG del camión */}
              <div ref={truckRef} className="mx-auto w-full max-w-md">
                <CamionSVG
                  dragOver={dragOverCamion}
                  cajitasCargadas={cajitasCargadas.length}
                  gruposObjetivo={nivel.grupos}
                  celebrando={esCelebrando}
                  verificando={esVerificando}
                />
              </div>

              {/* Cajitas cargadas (dentro del camión) — scrollable si son muchas */}
              {cajitasCargadas.length === 0 ? (
                <div className="mt-2 flex h-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-cyan-400/30 bg-cyan-500/5 text-center">
                  <span className="text-2xl opacity-50">📦</span>
                  <p className="text-xs font-semibold text-cyan-200/70 sm:text-sm">
                    Arrastrá (o tocá) las cajitas aquí
                  </p>
                </div>
              ) : (
                <div className="mt-2 max-h-44 overflow-y-auto rounded-2xl border border-cyan-400/20 bg-cyan-950/30 p-2 sm:max-h-52">
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {cajitasCargadas.map((i) => (
                      <button
                        key={i}
                        onClick={() => quitarCajita(i)}
                        className="group relative rounded-lg bg-white/5 p-0.5 shadow-sm transition hover:scale-105 hover:bg-rose-500/20"
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
                <p className="mt-1.5 text-center text-xs font-semibold text-cyan-200/70">
                  Toca una cajita para regresarla a la pila
                </p>
              )}
            </div>
          </div>

          {/* ============ Columna derecha: pila + feedback + botones ============ */}
          <div className="flex flex-col gap-4">
            {/* Pila de cajitas disponibles */}
            <div className="rounded-3xl border-2 border-amber-400/40 bg-white/10 p-4 shadow-lg backdrop-blur-md sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-sm font-black text-amber-200 sm:text-base">
                  <Package size={16} className="text-amber-300" strokeWidth={2.5} />
                  Pila de cajitas
                </h3>
                <span className="rounded-full bg-amber-500/25 px-2.5 py-0.5 text-xs font-black text-amber-100 border border-amber-400/40">
                  {cajitasEnPila.length} disponibles
                </span>
              </div>

              <div className="mb-3 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-center text-xs font-semibold text-amber-100 sm:text-sm">
                <Hand size={13} className="mr-1 inline" strokeWidth={2.5} />
                Arrastrá (o tocá) <b>{nivel.grupos}</b> cajitas al camión. ¡Cada una trae{" "}
                <b>{nivel.elementos_por_grupo}</b>{" "}
                {PRODUCTO_NOMBRE[nivel.producto_visual]}!
              </div>

              <div
                className="max-h-80 overflow-y-auto rounded-2xl border border-amber-400/20 bg-amber-950/20 p-2"
                style={{ scrollbarWidth: "thin" }}
              >
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {cajitasEnPila.length === 0 ? (
                    <p className="py-4 text-center text-sm font-semibold text-amber-200/70">
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
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-amber-400/40 bg-white/5 py-2 text-sm font-bold text-amber-200 transition hover:bg-amber-500/15 active:scale-95"
                >
                  <Undo2 size={14} strokeWidth={2.5} /> Vaciar camión
                </button>
              )}
            </div>

            {/* Feedback de error */}
            {feedback && (esCargando || esVerificando) && (
              <div className="animate-bounce-in rounded-2xl border-2 border-rose-400/50 bg-rose-500/15 px-4 py-3 shadow-lg backdrop-blur-sm">
                <p className="flex items-start gap-2 text-sm font-semibold text-rose-100">
                  <span className="text-lg">💡</span>
                  <span>{feedback}</span>
                </p>
              </div>
            )}

            {/* Botón Despachar — glossy cyan multi-capa con sheen */}
            <button
              onClick={despachar}
              disabled={!puedeDespachar || esVerificando || esCelebrando}
              aria-label="Despachar camión"
              className={`group relative overflow-hidden rounded-2xl py-4 text-base font-black shadow-2xl transition active:scale-95 ${
                puedeDespachar && !esVerificando
                  ? "text-white"
                  : "cursor-not-allowed text-cyan-100/40"
              }`}
              style={{
                background:
                  puedeDespachar && !esVerificando
                    ? "linear-gradient(180deg, #22d3ee 0%, #0891b2 50%, #0e7490 100%)"
                    : "linear-gradient(180deg, #155e75 0%, #0c4a6e 100%)",
                boxShadow:
                  puedeDespachar && !esVerificando
                    ? "0 8px 0 #0e7490, 0 12px 30px rgba(34,211,238,0.5), inset 0 2px 0 rgba(255,255,255,0.4)"
                    : "0 4px 0 #0c4a6e, inset 0 2px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Sheen animado */}
              {puedeDespachar && !esVerificando && (
                <span
                  className="pointer-events-none absolute inset-0 opacity-60"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)",
                    transform: "translateX(-100%)",
                    animation: "despachar-sheen 2s ease-in-out infinite",
                  }}
                />
              )}
              <span className="relative flex items-center justify-center gap-2">
                {esVerificando ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" strokeWidth={2.5} /> Revisando…
                  </>
                ) : esCelebrando ? (
                  <>¡Despachado! 🎉</>
                ) : (
                  <>
                    <Check size={18} strokeWidth={2.5} /> ¡Despachar camión!
                  </>
                )}
              </span>
              <style jsx>{`
                @keyframes despachar-sheen {
                  0%, 100% { transform: translateX(-100%); }
                  50% { transform: translateX(100%); }
                }
              `}</style>
            </button>

            {/* Pista de combo */}
            {racha >= 1 && (
              <div className="rounded-xl border border-orange-400/30 bg-orange-500/10 px-3 py-2 text-center text-xs font-bold text-orange-200">
                🔥 Racha: {racha} {racha >= 2 ? `(combo x${Math.min(racha, 5)}!)` : "— ¡seguid así!"}
              </div>
            )}
          </div>
        </div>

        {/* Overlay de celebración con operación formal */}
        {esCelebrando && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-24 sm:pt-32">
            <div className="animate-bounce-in rounded-3xl border-2 border-emerald-400/60 bg-gradient-to-br from-emerald-950/95 to-cyan-950/95 px-6 py-4 shadow-[0_0_40px_rgba(16,185,129,0.4)] backdrop-blur-md">
              <p className="text-center text-sm font-black uppercase tracking-wide text-emerald-300">
                ¡Camión despachado! 🚛💨
              </p>
              <p className="mt-1 text-center text-3xl font-black text-emerald-100 sm:text-4xl">
                {nivel.operacion_formal}
              </p>
              <p className="mt-1 text-center text-xs font-semibold text-emerald-300/80 sm:text-sm">
                {nivel.grupos} cajitas × {nivel.elementos_por_grupo}{" "}
                {PRODUCTO_NOMBRE[nivel.producto_visual]} cada una
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confeti al celebrar */}
      {esCelebrando && <Confetti duracionMs={2500} cantidad={42} />}

      {/* Floating scores */}
      {floats.map((f) => (
        <FloatingScore key={f.id} item={f} />
      ))}

      {/* Particle bursts */}
      {bursts.map((b) => (
        <ParticleBurst key={b.id} burst={b} />
      ))}
    </GameShell>
  );
}
