"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowRight,
  BookOpen,
  Bus as BusIcon,
  Check,
  Hand,
  MapPin,
  PartyPopper,
  RefreshCw,
  RotateCcw,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { nivelesBus, type NivelBus } from "@/data/busLetras";
import {
  GameShell,
  GameHUD,
  GameIntro,
  GameOverlay,
  useGameAudio,
  FloatingScore,
  type FloatingScoreItem,
  ParticleBurst,
  type BurstConfig,
  nextScoreId,
} from "@/components/game";
import { Confetti } from "@/components/Toasts";

/* ============================================================
   El Bus de las Letras — Versión AAA
   ------------------------------------------------------------
   Mecánica conservada (sin alterar la pedagogía):
   1. Un bus escolar nicaragüense recorre una ruta. En cada parada
      espera un pasajero con una consigna de Lengua y Literatura.
   2. Debajo del bus se muestran las palabras del enunciado como
      tarjetas "boarding pass" clickeables, o 4 pronombres.
   3. El niño toca para seleccionar y presiona "¡Subir al bus!".
   4. Si es correcto → celebración + confeti + el pasajero "se sube".
   5. Si no coincide → feedback_error pedagógico y vuelve a selección.
   6. Avance por 10 niveles → "¡Conductor Experto!".
   ============================================================ */

type Estado =
  | "presentacion"
  | "seleccionando"
  | "verificando"
  | "celebrando"
  | "completado";

const TOTAL_NIVELES = nivelesBus.length;
const PUNTOS_ACIERTO = 20;
const PUNTOS_BONUS_PERFECTO = 50;
const VIDAS_MAX = 3;

/* ----------------------- Helpers ----------------------- */

function limpiar(token: string): string {
  return token
    .replace(/^[.,;:!¡¿()"']+/, "")
    .replace(/[.,;:!¡¿()"']+$/, "");
}

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map(limpiar)
    .filter(Boolean)
    .join(" ");
}

function esNivelPronombres(tipo: NivelBus["tipo_ejercicio"]): boolean {
  return tipo === "pronombre_el_ella" || tipo === "pronombre_ellos_ellas";
}

function tokenizarEnunciado(enunciado: string): string[] {
  return enunciado
    .split(/\s+/)
    .map((t) => limpiar(t))
    .filter(Boolean);
}

function mezclar<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ============================================================
   SVG: Palmera decorativa
   ============================================================ */
function Palmera({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 140" aria-hidden className={className}>
      <path
        d="M 38 140 Q 36 90 40 50 Q 42 30 44 18"
        stroke="#92400e"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 36 120 L 44 120 M 36 100 L 44 100 M 37 80 L 45 80 M 38 60 L 46 60"
        stroke="#78350f"
        strokeWidth="1.5"
      />
      <g fill="#16a34a" stroke="#15803d" strokeWidth="1">
        <path d="M 42 20 Q 10 5 0 25 Q 18 28 42 24 Z" />
        <path d="M 42 20 Q 74 5 80 25 Q 62 28 42 24 Z" />
        <path d="M 42 18 Q 30 -5 8 -2 Q 24 14 42 22 Z" />
        <path d="M 42 18 Q 54 -5 76 -2 Q 60 14 42 22 Z" />
        <path d="M 42 16 Q 42 -8 30 -10 Q 36 8 42 20 Z" />
        <path d="M 42 16 Q 42 -8 54 -10 Q 48 8 42 20 Z" />
      </g>
      <circle cx="36" cy="26" r="3" fill="#92400e" />
      <circle cx="48" cy="28" r="3" fill="#92400e" />
    </svg>
  );
}

/* ============================================================
   SVG: Letrero / Poste de Parada (estilizado)
   ============================================================ */
function ParadaPoste({ texto }: { texto: string }) {
  return (
    <div className="flex justify-center">
      <div className="relative inline-flex flex-col items-center">
        {/* Techo colorido */}
        <div className="h-2 w-28 rounded-t-full bg-gradient-to-r from-rose-400 via-amber-400 to-cyan-400 shadow-md" />
        {/* Cartel */}
        <div className="relative rounded-xl border-2 border-rose-500/80 bg-white/95 px-4 py-2 shadow-[0_8px_18px_rgba(244,63,94,0.25)] sm:px-5 sm:py-2.5">
          <div className="flex items-center justify-center gap-1.5">
            <BusIcon size={13} className="text-rose-600" strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 sm:text-xs">
              Parada
            </span>
          </div>
          <p className="max-w-[200px] text-center text-sm font-bold leading-tight text-rose-950 sm:text-base">
            {texto}
          </p>
          {/* LED dot */}
          <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
        </div>
        {/* Poste */}
        <div className="h-8 w-2 rounded-b bg-amber-700 sm:h-10" />
        <div className="h-2 w-6 rounded-full bg-amber-900/80 shadow" />
      </div>
    </div>
  );
}

/* ============================================================
   SVG: Banca de parada
   ============================================================ */
function BancaSVG() {
  return (
    <svg viewBox="0 0 80 40" aria-hidden className="h-8 w-24">
      <rect x="6" y="14" width="68" height="5" rx="2" fill="#b45309" />
      <rect x="10" y="19" width="4" height="14" fill="#92400e" />
      <rect x="66" y="19" width="4" height="14" fill="#92400e" />
      <rect x="6" y="6" width="68" height="3" rx="1.5" fill="#d97706" />
    </svg>
  );
}

/* ============================================================
   SVG: Bus escolar hiperdetallado
   ============================================================ */

interface BusSVGProps {
  letrero: string;
  puertaAbierta: boolean;
  enMovimiento: boolean;
  celebrando: boolean;
}

function BusSVG({ letrero, puertaAbierta, enMovimiento, celebrando }: BusSVGProps) {
  // Rayos de las ruedas (rotan con animación CSS cuando el bus se mueve)
  return (
    <svg
      viewBox="0 0 380 220"
      className="w-full drop-shadow-[0_14px_22px_rgba(0,0,0,0.35)]"
      aria-hidden
    >
      <defs>
        <linearGradient id="busBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="busTopStripe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <linearGradient id="windowGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <linearGradient id="windshield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <radialGradient id="headlight" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="60%" stopColor="#fde047" />
          <stop offset="100%" stopColor="rgba(253,224,71,0)" />
        </radialGradient>
        <linearGradient id="doorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Sombra */}
      <ellipse cx="190" cy="206" rx="170" ry="8" fill="#000000" opacity="0.18" />

      {/* Humo del escape (solo cuando está en movimiento) */}
      {enMovimiento && (
        <g opacity="0.55">
          <circle cx="22" cy="172" r="6" fill="#cbd5e1">
            <animate
              attributeName="cx"
              from="22"
              to="2"
              dur="0.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.6"
              to="0"
              dur="0.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              from="4"
              to="10"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="22" cy="172" r="5" fill="#e2e8f0">
            <animate
              attributeName="cx"
              from="22"
              to="2"
              dur="0.8s"
              begin="0.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.5"
              to="0"
              dur="0.8s"
              begin="0.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              from="3"
              to="9"
              dur="0.8s"
              begin="0.4s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      )}

      {/* Cuerpo principal del bus */}
      <rect
        x="20"
        y="50"
        width="280"
        height="110"
        rx="18"
        fill="url(#busBody)"
        stroke="#b45309"
        strokeWidth="3"
      />

      {/* Techo (rosa coral) */}
      <rect
        x="20"
        y="50"
        width="280"
        height="16"
        rx="8"
        fill="url(#busTopStripe)"
        opacity="0.95"
      />

      {/* Letrero LED superior con el nombre de la parada */}
      <rect
        x="60"
        y="34"
        width="220"
        height="22"
        rx="6"
        fill="#0f172a"
        stroke="#1e293b"
        strokeWidth="2"
      />
      <rect
        x="62"
        y="36"
        width="216"
        height="18"
        rx="4"
        fill="#064e3b"
        opacity="0.85"
      />
      <text
        x="170"
        y="50"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill="#34d399"
        fontFamily="ui-monospace, monospace"
        style={{ letterSpacing: "1px" }}
      >
        {letrero.length > 28 ? letrero.slice(0, 27) + "…" : letrero}
      </text>

      {/* Ventanas (gradiente cyan con reflejos) */}
      {[36, 92, 148, 204].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y="74"
            width="48"
            height="32"
            rx="5"
            fill="url(#windowGrad)"
            stroke="#0e7490"
            strokeWidth="1.5"
          />
          {/* Reflejo diagonal */}
          <polygon
            points={`${x + 4},${74} ${x + 18},${74} ${x + 8},${106} ${x + 4},${106}`}
            fill="#ffffff"
            opacity="0.32"
          />
          <rect
            x={x + 3}
            y="76"
            width="14"
            height="5"
            rx="2"
            fill="#ecfeff"
            opacity="0.7"
          />
        </g>
      ))}

      {/* Banda decorativa con texto ESCUELA */}
      <rect x="20" y="128" width="280" height="14" fill="#dc2626" opacity="0.85" />
      <text
        x="160"
        y="139"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill="#fff"
        fontFamily="Fredoka, system-ui, sans-serif"
        style={{ letterSpacing: "2px" }}
      >
        ESCUELA
      </text>

      {/* Cabina delantera (mismo amarillo) */}
      <path
        d="M 300 78 L 300 160 L 360 160 L 360 120 Q 360 78 320 78 Z"
        fill="url(#busBody)"
        stroke="#b45309"
        strokeWidth="3"
      />
      {/* Parabrisas (gradiente cyan) */}
      <path
        d="M 312 88 L 322 88 Q 348 88 348 120 L 348 124 L 312 124 Z"
        fill="url(#windshield)"
        stroke="#0e7490"
        strokeWidth="1.5"
      />
      <polygon points="316,90 326,90 318,122 314,122" fill="#ffffff" opacity="0.32" />

      {/* Puerta del bus (se abre cuando puertaAbierta) */}
      <g>
        {/* Marco */}
        <rect
          x="244"
          y="92"
          width="22"
          height="68"
          rx="2"
          fill="#1f2937"
          opacity="0.35"
        />
        {/* Hoja izquierda (fija) */}
        <rect
          x="244"
          y="92"
          width="10"
          height="68"
          rx="2"
          fill="url(#doorGrad)"
          stroke="#92400e"
          strokeWidth="1.5"
        />
        <line
          x1="249"
          y1="96"
          x2="249"
          y2="156"
          stroke="#92400e"
          strokeWidth="1"
          opacity="0.7"
        />
        {/* Hoja derecha (deslizable cuando puertaAbierta) */}
        <g
          style={{
            transform: puertaAbierta ? "translateX(14px)" : "translateX(0)",
            transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <rect
            x="256"
            y="92"
            width="10"
            height="68"
            rx="2"
            fill="url(#doorGrad)"
            stroke="#92400e"
            strokeWidth="1.5"
          />
          <line
            x1="261"
            y1="96"
            x2="261"
            y2="156"
            stroke="#92400e"
            strokeWidth="1"
            opacity="0.7"
          />
        </g>
        {/* Manijas */}
        <circle cx="253" cy="124" r="1.5" fill="#451a03" />
        <circle cx="259" cy="124" r="1.5" fill="#451a03" />
      </g>

      {/* Faro delantero */}
      <circle cx="352" cy="148" r="5" fill="url(#headlight)" stroke="#d97706" strokeWidth="1" />
      {celebrando && (
        <circle cx="352" cy="148" r="12" fill="#fde047" opacity="0.4">
          <animate
            attributeName="r"
            from="5"
            to="14"
            dur="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.6"
            to="0"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Luz de freno/direccional trasera */}
      <rect x="20" y="138" width="6" height="10" rx="2" fill="#dc2626" />

      {/* Escape */}
      <rect x="14" y="166" width="14" height="6" rx="2" fill="#374151" />

      {/* Ruedas con rayos que giran */}
      <g>
        {/* Rueda trasera */}
        <circle cx="80" cy="170" r="22" fill="#111827" />
        <circle cx="80" cy="170" r="18" fill="#1f2937" />
        <g
          style={{
            transformOrigin: "80px 170px",
            animation: enMovimiento
              ? "wheelSpin 0.6s linear infinite"
              : "none",
          }}
        >
          <circle cx="80" cy="170" r="9" fill="#9ca3af" />
          {[0, 45, 90, 135].map((deg) => (
            <rect
              key={deg}
              x="78.5"
              y="153"
              width="3"
              height="34"
              rx="1"
              fill="#6b7280"
              transform={`rotate(${deg} 80 170)`}
            />
          ))}
        </g>
        <circle cx="80" cy="170" r="3" fill="#374151" />

        {/* Rueda delantera */}
        <circle cx="300" cy="170" r="22" fill="#111827" />
        <circle cx="300" cy="170" r="18" fill="#1f2937" />
        <g
          style={{
            transformOrigin: "300px 170px",
            animation: enMovimiento
              ? "wheelSpin 0.6s linear infinite"
              : "none",
          }}
        >
          <circle cx="300" cy="170" r="9" fill="#9ca3af" />
          {[0, 45, 90, 135].map((deg) => (
            <rect
              key={deg}
              x="298.5"
              y="153"
              width="3"
              height="34"
              rx="1"
              fill="#6b7280"
              transform={`rotate(${deg} 300 170)`}
            />
          ))}
        </g>
        <circle cx="300" cy="170" r="3" fill="#374151" />
      </g>

      {/* Check verde al celebrar */}
      {celebrando && (
        <g className="animate-bounce-in">
          <circle
            cx="180"
            cy="18"
            r="18"
            fill="#10b981"
            stroke="#047857"
            strokeWidth="2.5"
          />
          <path
            d="M 170 18 L 178 26 L 190 12"
            stroke="white"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}

      <style jsx>{`
        @keyframes wheelSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </svg>
  );
}

/* ============================================================
   SVG: Pasajero estilizado (no emoji)
   ============================================================ */
interface PasajeroSVGProps {
  emoji: string; // se conserva el emoji del nivel para mapear a un SVG
  estado: "idle" | "caminando" | "subido";
}

function PasajeroSVG({ emoji, estado }: PasajeroSVGProps) {
  // Mapeo simple emoji → paleta de colores del personaje
  const paleta = (() => {
    switch (emoji) {
      case "🧒":
        return { piel: "#fcd9b6", pelo: "#7c2d12", ropa: "#0d9488" };
      case "👵":
        return { piel: "#f5d0a9", pelo: "#d1d5db", ropa: "#9333ea" };
      case "🧑":
        return { piel: "#fcd9b6", pelo: "#1f2937", ropa: "#0369a1" };
      case "👨":
        return { piel: "#fcd9b6", pelo: "#111827", ropa: "#15803d" };
      case "👩":
        return { piel: "#fde2c4", pelo: "#92400e", ropa: "#db2777" };
      case "👧":
        return { piel: "#fcd9b6", pelo: "#b45309", ropa: "#f59e0b" };
      case "👫":
        return { piel: "#fcd9b6", pelo: "#1f2937", ropa: "#0ea5e9" };
      case "🧓":
        return { piel: "#f5d0a9", pelo: "#e5e7eb", ropa: "#7c2d12" };
      case "🦊":
        return { piel: "#fb923c", pelo: "#ea580c", ropa: "#fef3c7" };
      case "🐰":
        return { piel: "#f9fafb", pelo: "#f9fafb", ropa: "#fbbf24" };
      default:
        return { piel: "#fcd9b6", pelo: "#1f2937", ropa: "#0ea5e9" };
    }
  })();

  const esPareja = emoji === "👫";

  return (
    <svg
      viewBox="0 0 100 130"
      className="h-full w-full"
      aria-hidden
      style={{
        animation:
          estado === "idle"
            ? "pasajeroIdle 2.4s ease-in-out infinite"
            : estado === "caminando"
              ? "pasajeroCamina 0.4s ease-in-out infinite"
              : "none",
        transformOrigin: "bottom center",
      }}
    >
      {/* Sombra */}
      <ellipse cx="50" cy="124" rx="22" ry="3.5" fill="#000000" opacity="0.18" />

      {esPareja ? (
        <>
          {/* Persona 1 (izq) */}
          <g transform="translate(-12,0)">
            {/* Piernas */}
            <rect x="36" y="92" width="6" height="24" rx="2" fill="#1e3a8a" />
            <rect x="44" y="92" width="6" height="24" rx="2" fill="#1e3a8a" />
            {/* Zapatos */}
            <ellipse cx="39" cy="118" rx="5" ry="2.5" fill="#111827" />
            <ellipse cx="47" cy="118" rx="5" ry="2.5" fill="#111827" />
            {/* Cuerpo */}
            <rect x="34" y="58" width="18" height="38" rx="6" fill={paleta.ropa} />
            {/* Brazos */}
            <rect x="28" y="60" width="6" height="22" rx="3" fill={paleta.piel} />
            <rect x="52" y="60" width="6" height="22" rx="3" fill={paleta.piel} />
            {/* Cabeza */}
            <circle cx="43" cy="46" r="13" fill={paleta.piel} />
            {/* Pelo */}
            <path
              d="M 30 44 Q 30 30 43 30 Q 56 30 56 44 L 54 40 Q 50 36 43 36 Q 36 36 32 40 Z"
              fill={paleta.pelo}
            />
            {/* Ojos */}
            <circle cx="40" cy="46" r="1.6" fill="#111827" />
            <circle cx="46" cy="46" r="1.6" fill="#111827" />
            {/* Sonrisa */}
            <path
              d="M 40 50 Q 43 53 46 50"
              stroke="#9d174d"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Persona 2 (der) */}
          <g transform="translate(14,0)">
            <rect x="36" y="92" width="6" height="24" rx="2" fill="#7c2d12" />
            <rect x="44" y="92" width="6" height="24" rx="2" fill="#7c2d12" />
            <ellipse cx="39" cy="118" rx="5" ry="2.5" fill="#111827" />
            <ellipse cx="47" cy="118" rx="5" ry="2.5" fill="#111827" />
            <rect x="34" y="58" width="18" height="38" rx="6" fill="#db2777" />
            <rect x="28" y="60" width="6" height="22" rx="3" fill="#fcd9b6" />
            <rect x="52" y="60" width="6" height="22" rx="3" fill="#fcd9b6" />
            <circle cx="43" cy="46" r="13" fill="#fcd9b6" />
            <path
              d="M 30 44 Q 30 30 43 30 Q 56 30 56 44 L 54 40 Q 50 36 43 36 Q 36 36 32 40 Z"
              fill="#92400e"
            />
            <circle cx="40" cy="46" r="1.6" fill="#111827" />
            <circle cx="46" cy="46" r="1.6" fill="#111827" />
            <path
              d="M 40 50 Q 43 53 46 50"
              stroke="#9d174d"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </>
      ) : (
        <>
          {/* Piernas */}
          <rect x="40" y="92" width="8" height="26" rx="3" fill="#1e3a8a" />
          <rect x="52" y="92" width="8" height="26" rx="3" fill="#1e3a8a" />
          {/* Zapatos */}
          <ellipse cx="44" cy="120" rx="6" ry="3" fill="#111827" />
          <ellipse cx="56" cy="120" rx="6" ry="3" fill="#111827" />
          {/* Cuerpo */}
          <rect x="36" y="58" width="28" height="40" rx="8" fill={paleta.ropa} />
          {/* Cuello */}
          <rect x="46" y="52" width="8" height="8" fill={paleta.piel} />
          {/* Brazos */}
          <rect x="28" y="60" width="8" height="24" rx="4" fill={paleta.piel} />
          <rect x="64" y="60" width="8" height="24" rx="4" fill={paleta.piel} />
          {/* Cabeza */}
          <circle cx="50" cy="42" r="15" fill={paleta.piel} />
          {/* Pelo */}
          <path
            d="M 35 42 Q 35 24 50 24 Q 65 24 65 42 L 62 36 Q 56 30 50 30 Q 44 30 38 36 Z"
            fill={paleta.pelo}
          />
          {/* Ojos */}
          <circle cx="45" cy="42" r="2" fill="#111827" />
          <circle cx="55" cy="42" r="2" fill="#111827" />
          <circle cx="45.5" cy="41.5" r="0.6" fill="#fff" />
          <circle cx="55.5" cy="41.5" r="0.6" fill="#fff" />
          {/* Mejillas */}
          <circle cx="42" cy="47" r="2" fill="#fb7185" opacity="0.4" />
          <circle cx="58" cy="47" r="2" fill="#fb7185" opacity="0.4" />
          {/* Sonrisa */}
          <path
            d="M 45 48 Q 50 53 55 48"
            stroke="#9d174d"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}

      <style jsx>{`
        @keyframes pasajeroIdle {
          0%,
          100% {
            transform: rotate(-1.5deg) translateY(0);
          }
          50% {
            transform: rotate(1.5deg) translateY(-2px);
          }
        }
        @keyframes pasajeroCamina {
          0%,
          100% {
            transform: translateY(0) rotate(-2deg);
          }
          50% {
            transform: translateY(-4px) rotate(2deg);
          }
        }
      `}</style>
    </svg>
  );
}

/* ============================================================
   Componente principal
   ============================================================ */
export function BusLetras() {
  const [nivelIdx, setNivelIdx] = useState(0);
  const [estado, setEstado] = useState<Estado>("presentacion");
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [pasajerosTransportados, setPasajerosTransportados] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  // AAA: stats y audio
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(VIDAS_MAX);
  const [racha, setRacha] = useState(0);
  const [rachaMaxima, setRachaMaxima] = useState(0);
  const [erroresNivel, setErroresNivel] = useState(0);
  const [muted, setMuted] = useState(false);
  const [aciertos, setAciertos] = useState(0);

  // Animación bus: movimiento entre paradas
  const [busEnMovimiento, setBusEnMovimiento] = useState(false);
  // El bus arranca con la puerta abierta en la primera parada
  const [puertaAbierta, setPuertaAbierta] = useState(true);
  const [nivelCambiando, setNivelCambiando] = useState(false);

  // FloatingScore + ParticleBurst
  const [scores, setScores] = useState<FloatingScoreItem[]>([]);
  const [bursts, setBursts] = useState<(BurstConfig & { id: number })[]>([]);
  const busRef = useRef<HTMLDivElement | null>(null);

  const sfx = useGameAudio();

  // Ref para timeouts internos
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

  // Mutear / desmutear
  useEffect(() => {
    sfx.setMuted(muted);
  }, [muted, sfx]);

  const nivel = nivelesBus[nivelIdx];
  const esPronombres = esNivelPronombres(nivel.tipo_ejercicio);

  const tokensEnunciado = useMemo(
    () => tokenizarEnunciado(nivel.enunciado),
    [nivel],
  );

  const opcionesPronombres = useMemo(
    () =>
      esPronombres
        ? mezclar([nivel.palabra_correcta, ...nivel.distractores])
        : [],
    // Se mezcla una sola vez por nivel (no recalcular al cambiar selección)
    [nivel.nivel, nivel.palabra_correcta, nivel.distractores, esPronombres],
  );

  /* ---- Helper: mostrar FloatingScore ---- */
  const mostrarScore = useCallback(
    (text: string, color: string, offsetX = 50, offsetY = 30) => {
      // Posición relativa al bus
      const el = busRef.current;
      const rect = el?.getBoundingClientRect();
      const parentRect = el?.parentElement?.getBoundingClientRect();
      if (!rect || !parentRect) {
        const item: FloatingScoreItem = {
          id: nextScoreId(),
          x: offsetX,
          y: offsetY,
          text,
          color,
        };
        setScores((p) => [...p, item]);
        programar(
          () => setScores((p) => p.filter((s) => s.id !== item.id)),
          950,
        );
        return;
      }
      const xPct =
        ((rect.left - parentRect.left + rect.width * (offsetX / 100)) /
          parentRect.width) *
        100;
      const yPct =
        ((rect.top - parentRect.top + rect.height * (offsetY / 100)) /
          parentRect.height) *
        100;
      const item: FloatingScoreItem = {
        id: nextScoreId(),
        x: xPct,
        y: yPct,
        text,
        color,
      };
      setScores((p) => [...p, item]);
      programar(
        () => setScores((p) => p.filter((s) => s.id !== item.id)),
        950,
      );
    },
    [programar],
  );

  /* ---- Helper: explosión de partículas en la puerta del bus ---- */
  const explosionPuerta = useCallback(() => {
    const el = busRef.current;
    const rect = el?.getBoundingClientRect();
    // Puerta del bus está aproximadamente en x≈70% del ancho, y≈80% del alto
    const x = rect ? rect.left + rect.width * 0.7 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height * 0.78 : window.innerHeight / 2;
    const id = Date.now() + Math.random();
    setBursts((p) => [
      ...p,
      {
        id,
        x,
        y,
        count: 18,
        power: 1.3,
        colors: ["#fbbf24", "#fb7185", "#22d3ee", "#34d399", "#ffffff"],
      },
    ]);
    programar(
      () => setBursts((p) => p.filter((b) => b.id !== id)),
      1000,
    );
  }, [programar]);

  /* ---- Transición: celebrando → siguiente nivel o completado ---- */
  useEffect(() => {
    if (estado !== "celebrando") return;
    const t = setTimeout(() => {
      if (nivelIdx + 1 >= TOTAL_NIVELES) {
        sfx.victory();
        setEstado("completado");
      } else {
        // Animación de movimiento del bus a la siguiente parada
        setPuertaAbierta(false);
        setBusEnMovimiento(true);
        setNivelCambiando(true);
        sfx.whoosh();
        setTimeout(() => {
          setNivelIdx((n) => n + 1);
          setSeleccionadas([]);
          setFeedback(null);
          setErroresNivel(0);
          setBusEnMovimiento(false);
          setNivelCambiando(false);
          // El bus llegó → abrir puerta
          setTimeout(() => {
            setPuertaAbierta(true);
            sfx.whoosh();
          }, 250);
          setEstado("presentacion");
        }, 900);
      }
    }, 2600);
    return () => clearTimeout(t);
  }, [estado, nivelIdx, sfx]);

  /* ---- Validación ---- */
  const validar = useCallback((): boolean => {
    if (seleccionadas.length === 0) return false;
    if (esPronombres) {
      if (seleccionadas.length !== 1) return false;
      return (
        normalizar(opcionesPronombres[seleccionadas[0]]) ===
        normalizar(nivel.palabra_correcta)
      );
    }
    const frase = [...seleccionadas]
      .sort((a, b) => a - b)
      .map((i) => tokensEnunciado[i])
      .join(" ");
    return normalizar(frase) === normalizar(nivel.palabra_correcta);
  }, [
    seleccionadas,
    esPronombres,
    opcionesPronombres,
    nivel.palabra_correcta,
    tokensEnunciado,
  ]);

  /* ---- Acciones ---- */
  const empezar = useCallback(() => {
    sfx.click();
    if (!puertaAbierta) {
      setPuertaAbierta(true);
      sfx.whoosh();
    }
    setEstado("seleccionando");
    setFeedback(null);
  }, [sfx, puertaAbierta]);

  const toggleSeleccion = useCallback(
    (i: number) => {
      if (estado !== "seleccionando") return;
      sfx.click();
      setFeedback(null);
      if (esPronombres) {
        setSeleccionadas((p) => (p.includes(i) ? [] : [i]));
        return;
      }
      setSeleccionadas((p) =>
        p.includes(i) ? p.filter((x) => x !== i) : [...p, i],
      );
    },
    [estado, esPronombres, sfx],
  );

  const subirAlBus = useCallback(() => {
    if (estado !== "seleccionando") return;
    if (seleccionadas.length === 0) return;
    setEstado("verificando");
    sfx.whoosh();
    const correcto = validar();
    programar(() => {
      if (correcto) {
        // Cerrar puerta (animación de subida)
        setPuertaAbierta(false);
        sfx.coin();

        // Calcular puntos
        const nuevaRacha = racha + 1;
        const comboMult = nuevaRacha >= 3 ? Math.min(nuevaRacha - 1, 5) : 1;
        const puntosBase = PUNTOS_ACIERTO;
        const puntosGanados = puntosBase * comboMult;
        const bonusPerfecto = erroresNivel === 0 ? PUNTOS_BONUS_PERFECTO : 0;
        const totalGanado = puntosGanados + bonusPerfecto;

        setPuntos((v) => v + totalGanado);
        setRacha(nuevaRacha);
        setRachaMaxima((m) => Math.max(m, nuevaRacha));
        setAciertos((v) => v + 1);
        setPasajerosTransportados((v) => v + 1);

        // FloatingScore en el bus
        mostrarScore(`+${puntosGanados}`, "#fbbf24", 50, 30);
        if (bonusPerfecto > 0) {
          programar(() => {
            mostrarScore(`+${bonusPerfecto} ¡Perfecto!`, "#34d399", 50, 15);
          }, 250);
        }
        if (comboMult > 1) {
          programar(() => {
            mostrarScore(`¡Combo x${comboMult}!`, "#fb923c", 30, 45);
          }, 450);
        }

        // Explosión en la puerta
        programar(() => {
          explosionPuerta();
        }, 300);

        // Sonidos
        if (erroresNivel === 0) {
          sfx.success();
        }
        if (nuevaRacha >= 3) {
          programar(() => sfx.combo(nuevaRacha), 500);
        }

        sfx.vibrate(30);

        setEstado("celebrando");
      } else {
        // Error
        sfx.error();
        sfx.vibrate([20, 40, 20]);
        setVidas((v) => Math.max(0, v - 1));
        setRacha(0);
        setErroresNivel((e) => e + 1);
        setFeedback(nivel.feedback_error);
        mostrarScore("✗", "#f43f5e", 50, 30);
        setEstado("seleccionando");

        // Si se quedó sin vidas → terminar
        if (vidas - 1 <= 0) {
          programar(() => {
            setEstado("completado");
          }, 1200);
        }
      }
    }, 550);
  }, [
    estado,
    seleccionadas.length,
    validar,
    nivel.feedback_error,
    programar,
    sfx,
    racha,
    erroresNivel,
    vidas,
    mostrarScore,
    explosionPuerta,
  ]);

  const limpiarSeleccion = useCallback(() => {
    sfx.click();
    setSeleccionadas([]);
    setFeedback(null);
  }, [sfx]);

  const reiniciarJuego = useCallback(() => {
    sfx.click();
    setNivelIdx(0);
    setEstado("presentacion");
    setSeleccionadas([]);
    setPasajerosTransportados(0);
    setFeedback(null);
    setPuntos(0);
    setVidas(VIDAS_MAX);
    setRacha(0);
    setRachaMaxima(0);
    setErroresNivel(0);
    setAciertos(0);
    setPuertaAbierta(true);
    setBusEnMovimiento(false);
    setNivelCambiando(false);
  }, [sfx]);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  /* ---- Derivados ---- */
  const esPresentacion = estado === "presentacion";
  const esSeleccionando = estado === "seleccionando";
  const esVerificando = estado === "verificando";
  const esCelebrando = estado === "celebrando";
  const puedeSubir = esSeleccionando && seleccionadas.length > 0;

  const onSalir = () => {
    // El wrapper ya gestiona la salida real; aquí delegamos.
    // Mantenemos compatibilidad: buscamos el botón Salir del wrapper.
    const btn = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Salir del minijuego y volver al inicio"]',
    );
    btn?.click();
  };

  /* ===================== RENDER: Pantalla de presentación inicial ===================== */
  if (estado === "presentacion" && nivelIdx === 0 && !busEnMovimiento) {
    return (
      <GameShell theme="sky" onSalir={onSalir}>
        <GameIntro
          icono={<span className="text-7xl">🚌</span>}
          titulo="El Bus de las Letras"
          subtitulo="Subí al pasajero correcto en cada parada"
          descripcion="Un bus escolar nicaragüense recorre 10 paradas. En cada una espera un pasajero con una consigna de Lengua y Literatura. ¡Identificá la palabra correcta y subila al bus!"
          pasos={[
            "Leé la consigna del pasajero",
            "Identificá la palabra correcta",
            "Tocala para seleccionarla",
            "¡Subila al bus y ganá puntos!",
          ]}
          temaColor="#fb7185"
          onJugar={empezar}
        />
      </GameShell>
    );
  }

  /* ===================== RENDER: Pantalla final (victoria o derrota) ===================== */
  if (estado === "completado") {
    const esVictoria = aciertos > 0 && vidas > 0;
    return (
      <GameShell theme="sky">
        <GameOverlay
          tipo={esVictoria ? "victoria" : "derrota"}
          titulo={esVictoria ? "¡Conductor Experto!" : "¡Buen intento!"}
          subtitulo={
            esVictoria
              ? `Transportaste ${pasajerosTransportados} pasajeros con éxito en el bus escolar.`
              : "Te quedaste sin vidas. ¡Intentalo de nuevo!"
          }
          stats={{
            puntos,
            rachaMaxima,
            aciertos,
            total: TOTAL_NIVELES,
          }}
          onReiniciar={reiniciarJuego}
          onSalir={onSalir}
          temaColor="#fb7185"
        />
      </GameShell>
    );
  }

  /* ===================== RENDER: Jugando ===================== */
  return (
    <GameShell theme="sky" onSalir={onSalir}>
      {/* HUD superior */}
      <GameHUD
        theme="language"
        nivel={nivel.nivel}
        totalNiveles={TOTAL_NIVELES}
        puntos={puntos}
        vidas={vidas}
        racha={racha}
        muted={muted}
        onToggleMute={toggleMute}
        icono={<BusIcon size={18} strokeWidth={2.5} />}
      />

      {/* Contenedor principal */}
      <div className="relative mx-auto max-w-5xl px-3 pb-8 pt-4 sm:px-5 sm:pt-6">
        {/* Palmeras a los lados (desktop) */}
        <Palmera className="pointer-events-none absolute -left-2 bottom-2 z-0 hidden h-56 w-32 -rotate-6 opacity-70 sm:block lg:h-72 lg:w-40" />
        <Palmera className="pointer-events-none absolute -right-2 bottom-2 z-0 hidden h-56 w-32 rotate-6 opacity-70 sm:block lg:h-72 lg:w-40" />

        {/* FloatingScores */}
        {scores.map((s) => (
          <FloatingScore key={s.id} item={s} />
        ))}

        {/* ParticleBursts */}
        {bursts.map((b) => (
          <ParticleBurst key={b.id} burst={b} />
        ))}

        {/* ===================== Pantalla: presentación del nivel ===================== */}
        {esPresentacion ? (
          <div className="animate-bounce-in relative z-10 rounded-3xl border-2 border-rose-500/30 bg-white/85 p-6 text-center shadow-xl backdrop-blur-md sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Parada {nivel.nivel} de {TOTAL_NIVELES}
            </p>
            <h2 className="mt-1 flex items-center justify-center gap-1.5 text-2xl font-black text-rose-950 sm:text-3xl">
              <MapPin size={22} className="text-rose-500" strokeWidth={2.5} />
              {nivel.parada}
            </h2>

            {/* Pasajero SVG estilizado */}
            <div className="mx-auto my-5 flex h-32 w-32 items-end justify-center rounded-full bg-gradient-to-br from-amber-100 to-rose-100 shadow-inner sm:h-36 sm:w-36">
              <div className="h-28 w-28 sm:h-32 sm:w-32">
                <PasajeroSVG emoji={nivel.avatar_pasajero} estado="idle" />
              </div>
            </div>

            <p className="text-base font-bold text-rose-900 sm:text-lg">
              “¡Buenas! Vengo esperando el bus.”
            </p>
            {/* Bocadillo glowing con la consigna */}
            <div className="relative mx-auto mt-3 max-w-md rounded-2xl border-2 border-rose-400/70 bg-rose-50 px-4 py-3 shadow-[0_0_22px_rgba(251,113,133,0.35)]">
              <div className="absolute -left-2 top-5 h-4 w-4 rotate-45 border-b-2 border-l-2 border-rose-400/70 bg-rose-50" />
              <p className="text-sm font-semibold text-rose-700 sm:text-base">
                <Sparkles
                  size={14}
                  className="mr-1 inline"
                  strokeWidth={2.5}
                />
                {nivel.consigna_para_nino}
              </p>
            </div>

            <button
              onClick={empezar}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-fuchsia-500 py-3.5 text-base font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-95 sm:w-auto sm:px-10"
            >
              <Sparkles size={18} strokeWidth={2.5} /> ¡Recoger al pasajero!
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          /* ===================== Pantalla: jugando ===================== */
          <div className="relative z-10 grid gap-4 lg:grid-cols-2">
            {/* ============ Columna izquierda: escena (pasajero + bus) ============ */}
            <div className="flex flex-col gap-4">
              {/* Pasajero con bocadillo */}
              <div className="rounded-3xl border-2 border-rose-300/60 bg-white/85 p-4 shadow-lg backdrop-blur-md sm:p-5">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-20 w-16 shrink-0 items-end justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-rose-100 shadow-inner transition-all duration-700 ease-out sm:h-24 sm:w-20 ${
                      esCelebrando
                        ? "translate-x-8 -translate-y-2 scale-50 opacity-0"
                        : ""
                    }`}
                    aria-label="Pasajero esperando el bus"
                  >
                    <div className="h-16 w-14 sm:h-20 sm:w-16">
                      <PasajeroSVG
                        emoji={nivel.avatar_pasajero}
                        estado={esCelebrando ? "subido" : "idle"}
                      />
                    </div>
                  </div>
                  <div className="relative flex-1 rounded-2xl border-2 border-rose-400/70 bg-rose-50 px-4 py-3 shadow-[0_0_18px_rgba(251,113,133,0.3)]">
                    <div className="absolute -left-2 top-5 h-4 w-4 rotate-45 border-b-2 border-l-2 border-rose-400/70 bg-rose-50" />
                    <p className="text-base font-semibold leading-snug text-rose-950 sm:text-lg">
                      {nivel.consigna_para_nino}
                    </p>
                  </div>
                </div>
                <p className="mt-3 flex items-center justify-center gap-1 text-center text-xs font-semibold text-rose-700/80 sm:text-sm">
                  <MapPin size={12} strokeWidth={2.5} /> Parada:{" "}
                  <span className="font-bold text-rose-800">{nivel.parada}</span>
                </p>
              </div>

              {/* Letrero de parada + banca */}
              <div className="flex items-end justify-center gap-3">
                <div className="hidden sm:block">
                  <BancaSVG />
                </div>
                <ParadaPoste texto={nivel.parada} />
              </div>

              {/* Bus SVG hiperdetallado */}
              <div
                ref={busRef}
                className="relative rounded-3xl border-2 border-amber-400/50 bg-white/70 p-3 shadow-lg backdrop-blur-md sm:p-4"
                style={{
                  transform: nivelCambiando
                    ? "translateX(-40px)"
                    : "translateX(0)",
                  transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <BusSVG
                  letrero={nivel.parada}
                  puertaAbierta={puertaAbierta}
                  enMovimiento={busEnMovimiento}
                  celebrando={esCelebrando}
                />
                <p className="mt-1 text-center text-xs font-semibold text-rose-700/70">
                  {esCelebrando
                    ? "¡Pasajero a bordo! 🎉"
                    : puertaAbierta
                      ? "Puerta abierta — esperando pasajeros…"
                      : "Bus escolar listo para partir…"}
                </p>
              </div>
            </div>

            {/* ============ Columna derecha: palabras + feedback + botones ============ */}
            <div className="flex flex-col gap-4">
              {/* Tarjetas de palabra (estilo boarding pass) */}
              <div className="rounded-3xl border-2 border-rose-300/60 bg-white/85 p-4 shadow-lg backdrop-blur-md sm:p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-sm font-bold text-rose-950 sm:text-base">
                    <BookOpen
                      size={16}
                      className="text-rose-600"
                      strokeWidth={2.5}
                    />
                    {esPronombres
                      ? "¿Qué pronombre usamos?"
                      : "Oración del pasajero"}
                  </h3>
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                    {seleccionadas.length} selec.
                  </span>
                </div>

                {/* Enunciado (siempre visible) */}
                <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-2 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-rose-600/70">
                    Enunciado
                  </p>
                  <p className="text-base font-semibold text-rose-950 sm:text-lg">
                    {resaltarPalabraCorrecta(
                      nivel.enunciado,
                      nivel.palabra_correcta,
                      esCelebrando,
                    )}
                  </p>
                </div>

                {!esPronombres && (
                  <p className="mb-3 text-center text-xs font-semibold text-rose-700/80 sm:text-sm">
                    <Hand
                      size={13}
                      className="mr-1 inline"
                      strokeWidth={2.5}
                    />
                    Tocá la palabra (o palabras) correcta y luego{" "}
                    <b>“Subir al bus”</b>.
                  </p>
                )}
                {esPronombres && (
                  <p className="mb-3 text-center text-xs font-semibold text-rose-700/80 sm:text-sm">
                    <Hand
                      size={13}
                      className="mr-1 inline"
                      strokeWidth={2.5}
                    />
                    Elegí el pronombre correcto y luego{" "}
                    <b>“Subir al bus”</b>.
                  </p>
                )}

                {/* Lista de palabras / opciones (estilo boarding pass) */}
                {esPronombres ? (
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {opcionesPronombres.map((opcion, i) => {
                      const sel = seleccionadas.includes(i);
                      return (
                        <BoardingPass
                          key={i}
                          texto={opcion}
                          seleccionada={sel}
                          seleccionable={esSeleccionando}
                          onClick={() => toggleSeleccion(i)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {tokensEnunciado.map((palabra, i) => {
                      const sel = seleccionadas.includes(i);
                      return (
                        <BoardingPass
                          key={i}
                          texto={palabra}
                          seleccionada={sel}
                          seleccionable={esSeleccionando}
                          onClick={() => toggleSeleccion(i)}
                          compacta
                        />
                      );
                    })}
                  </div>
                )}

                {/* Frase construida (preview) */}
                {seleccionadas.length > 0 && (
                  <div className="mt-3 rounded-xl bg-rose-50/80 px-3 py-2 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-rose-600/70">
                      Subiendo al bus:
                    </p>
                    <p className="text-base font-bold text-rose-900 sm:text-lg">
                      {esPronombres
                        ? opcionesPronombres[seleccionadas[0]]
                        : [...seleccionadas]
                            .sort((a, b) => a - b)
                            .map((i) => tokensEnunciado[i])
                            .join(" ")}
                    </p>
                  </div>
                )}
              </div>

              {/* Feedback de error */}
              {feedback && esSeleccionando && (
                <div className="animate-bounce-in rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-3 shadow-md">
                  <p className="flex items-start gap-2 text-sm font-semibold text-amber-900">
                    <span className="text-lg">💡</span>
                    <span>{feedback}</span>
                  </p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={subirAlBus}
                  disabled={!puedeSubir || esVerificando}
                  aria-label="Subir al bus la selección actual"
                  className={`group relative flex-1 overflow-hidden rounded-2xl py-3.5 text-base font-black shadow-md transition active:scale-95 ${
                    puedeSubir
                      ? "text-white hover:shadow-lg"
                      : "cursor-not-allowed bg-rose-200/70 text-rose-400/70"
                  }`}
                  style={
                    puedeSubir
                      ? {
                          background:
                            "linear-gradient(180deg, #fb7185 0%, #f43f5e 55%, #e11d48 100%)",
                          boxShadow:
                            "0 6px 0 #be123c, 0 10px 24px rgba(244,63,94,0.45), inset 0 2px 0 rgba(255,255,255,0.4)",
                        }
                      : undefined
                  }
                >
                  {/* sheen */}
                  {puedeSubir && (
                    <span
                      className="pointer-events-none absolute inset-0 opacity-60"
                      style={{
                        background:
                          "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)",
                        transform: "translateX(-100%)",
                        animation: "sheen-bus 2.4s ease-in-out infinite",
                      }}
                    />
                  )}
                  {esVerificando ? (
                    <span className="relative flex items-center justify-center gap-2">
                      <RefreshCw
                        size={18}
                        className="animate-spin"
                        strokeWidth={2.5}
                      />{" "}
                      Revisando…
                    </span>
                  ) : (
                    <span className="relative flex items-center justify-center gap-2">
                      <UserCheck size={18} strokeWidth={2.5} /> ¡Subir al bus!
                    </span>
                  )}
                  <style jsx>{`
                    @keyframes sheen-bus {
                      0%,
                      100% {
                        transform: translateX(-100%);
                      }
                      50% {
                        transform: translateX(100%);
                      }
                    }
                  `}</style>
                </button>

                {seleccionadas.length > 0 && esSeleccionando && (
                  <button
                    onClick={limpiarSeleccion}
                    className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-rose-300 bg-white py-3.5 px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-50 active:scale-95 sm:text-base"
                    aria-label="Limpiar la selección de palabras"
                  >
                    <RotateCcw size={16} strokeWidth={2.5} /> Limpiar
                  </button>
                )}

                {esCelebrando && (
                  <button
                    disabled
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-lime-500 py-3.5 text-base font-bold text-white shadow-md"
                  >
                    <PartyPopper size={18} strokeWidth={2.5} /> ¡Bien hecho!
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Overlay de celebración */}
        {esCelebrando && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-24 sm:pt-32">
            <div className="animate-bounce-in rounded-3xl border-2 border-emerald-300 bg-white/95 px-6 py-4 shadow-2xl">
              <p className="text-center text-sm font-bold uppercase tracking-wide text-emerald-700">
                ¡Pasajero a bordo!
              </p>
              <p className="mt-1 text-center text-2xl font-black text-emerald-900 sm:text-3xl">
                {nivel.palabra_correcta}
              </p>
              <p className="mt-1 text-center text-xs font-semibold text-emerald-700 sm:text-sm">
                ¡Muy bien! El pasajero subió al bus.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confeti al celebrar */}
      {esCelebrando && <Confetti duracionMs={2600} cantidad={48} />}
    </GameShell>
  );
}

/* ============================================================
   BoardingPass — tarjeta de palabra estilo pase de abordar
   ============================================================ */
interface BoardingPassProps {
  texto: string;
  seleccionada: boolean;
  seleccionable: boolean;
  onClick: () => void;
  compacta?: boolean;
}

function BoardingPass({
  texto,
  seleccionada,
  seleccionable,
  onClick,
  compacta,
}: BoardingPassProps) {
  const style: CSSProperties = seleccionada
    ? {
        background:
          "linear-gradient(135deg, #fb7185 0%, #f43f5e 60%, #e11d48 100%)",
        boxShadow:
          "0 8px 18px rgba(244,63,94,0.5), 0 0 22px rgba(251,113,133,0.55), inset 0 2px 0 rgba(255,255,255,0.45)",
        transform: "translateY(-4px) scale(1.05)",
      }
    : {
        background:
          "linear-gradient(135deg, #fff 0%, #fef2f2 60%, #ffe4e6 100%)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      };

  return (
    <button
      onClick={onClick}
      disabled={!seleccionable}
      aria-pressed={seleccionada}
      aria-label={`Palabra ${texto}${seleccionada ? " (seleccionada)" : ""}`}
      className={`group relative select-none overflow-hidden rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all duration-200 sm:text-lg ${
        compacta ? "px-3.5" : "px-6 py-3"
      } ${
        seleccionada
          ? "border-rose-200 text-white"
          : "border-rose-300/70 text-rose-950 hover:border-rose-400 hover:bg-rose-50"
      } ${seleccionable ? "cursor-pointer active:scale-95" : "cursor-default"}`}
      style={style}
    >
      {/* Perforación lateral (estilo boarding pass) */}
      <span
        className={`absolute left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${
          seleccionada ? "bg-white/40" : "bg-rose-200"
        }`}
      />
      <span
        className={`absolute right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${
          seleccionada ? "bg-white/40" : "bg-rose-200"
        }`}
      />
      {/* Icono maletín */}
      <span
        className={`mr-1.5 inline-block align-middle ${
          seleccionada ? "text-white/90" : "text-rose-400"
        }`}
      >
        <svg width="13" height="11" viewBox="0 0 24 20" fill="none">
          <rect
            x="3"
            y="6"
            width="18"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="2.2"
            fill={seleccionada ? "rgba(255,255,255,0.2)" : "none"}
          />
          <path
            d="M9 6V4h6v2"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="none"
          />
        </svg>
      </span>
      <span className="align-middle">{texto}</span>
      {/* Check al seleccionar */}
      {seleccionada && (
        <span className="ml-1.5 inline-block align-middle">
          <Check size={14} strokeWidth={3} className="text-white" />
        </span>
      )}
    </button>
  );
}

/* ============================================================
   Helper: resalta la palabra correcta en el enunciado al celebrar
   ============================================================ */
function resaltarPalabraCorrecta(
  enunciado: string,
  palabraCorrecta: string,
  celebrando: boolean,
): React.ReactNode {
  if (!celebrando) return enunciado;

  // Normalizar para búsqueda insensible a mayúsculas/puntuación
  const tokens = enunciado.split(/(\s+)/); // conserva espacios
  const correctasNorm = normalizar(palabraCorrecta)
    .split(" ")
    .filter(Boolean);

  if (correctasNorm.length === 0) return enunciado;

  // Para 1 palabra: marcar el primer token que coincida
  if (correctasNorm.length === 1) {
    return tokens.map((tok, i) => {
      if (normalizar(tok) === correctasNorm[0]) {
        return (
          <mark
            key={i}
            className="rounded bg-emerald-200 px-1 font-bold text-emerald-900 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
          >
            {tok}
          </mark>
        );
      }
      return tok;
    });
  }

  // Para múltiples palabras: marcar todos los tokens que coincidan
  return tokens.map((tok, i) => {
    if (correctasNorm.includes(normalizar(tok))) {
      return (
        <mark
          key={i}
          className="rounded bg-emerald-200 px-1 font-bold text-emerald-900 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
        >
          {tok}
        </mark>
      );
    }
    return tok;
  });
}
