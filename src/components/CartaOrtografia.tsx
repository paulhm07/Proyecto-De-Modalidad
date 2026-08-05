"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  Hand,
  Mail,
  Mailbox,
  RotateCcw,
  Send,
  Sparkles,
  Stamp,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  cartasPorNivel,
  totalNivelesCarta,
  type Carta,
} from "@/data/cartaOrtografia";
import { Confetti } from "@/components/Toasts";
import { useApp } from "@/context/AppContext";
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

/* ============================================================
   La Carta Mal Enviada — Minijuego educativo AAA
   ------------------------------------------------------------
   Mecánica:
   1. El niño es "cartero" en la oficina de correos nicaragüense.
      Para cada nivel aparecen 4 sobres.
   2. Toca un sobre para abrirlo y leer el texto_mostrado.
   3. Decide: "✓ Está bien" (la carta se sella y se va al buzón)
      o "✗ Tiene error" (se abre un mini-formulario de corrección).
   4. Si la decisión es correcta:
      - "✓ Está bien" + la carta NO tenía error → se sella con ✓ verde.
      - "✗ Tiene error" + la carta SÍ tenía error → aparece el formulario
        con la corrección_correcta como referencia y la regla_ortografica
        como pista. El niño escribe la corrección y presiona "Sellá".
        Si coincide (case-insensitive, trim) → se sella con ✓ verde.
   5. Si la decisión o la corrección es incorrecta → se muestra
      feedback_error pedagógico, pierde 1 vida y la carta queda abierta.
   6. Cuando las 4 cartas del nivel están selladas → confeti y avanza
      al siguiente nivel. Nivel perfecto (4/4 sin fallos) = +75 bonus.
   7. Al completar nivel 10 → "¡Cartero Experto!" 🏆.
   ============================================================ */

type Estado =
  | "presentacion"
  | "jugando"
  | "celebrando"
  | "completado"
  | "gameOver";

type EstadoCarta =
  | "sin_abrir"
  | "abierta"
  | "corrigiendo"
  | "sellada_correcta";

const TOTAL_NIVELES = totalNivelesCarta; // 10
const CARTAS_POR_NIVEL = 4;
const TOTAL_CARTAS = TOTAL_NIVELES * CARTAS_POR_NIVEL; // 40
const PUNTOS_CARTA = 25;
const PUNTOS_BONUS_PERFECTO = 75;
const VIDAS_MAX = 3;
const TEMA_COLOR = "#a855f7"; // violeta

/* ----------------------- Helpers ----------------------- */

// Normaliza una cadena para comparar (minúsculas, sin signos de puntuación
// en los extremos, sin dobles espacios). No toca signos de apertura
// ¡ ¿ ni de cierre ! ? porque son parte de la corrección que se enseña.
function normalizar(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

// ¿La carta tiene realmente un error ortográfico?
function cartaTieneError(c: Carta): boolean {
  return normalizar(c.texto_mostrado) !== normalizar(c.correccion_correcta);
}

function etiquetaTipo(c: Carta): string {
  if (c.tipo_error === "uso_b_v") return "Uso de b y v";
  if (c.tipo_error === "clasificacion_acentos") return "Acentos";
  if (c.tipo_error === "signos_apertura") return "Signos ¡ ¿";
  return "Ortografía";
}

// Multiplicador de combo: a partir de 3 seguidas, sube cada 3.
function comboMultiplicador(racha: number): number {
  if (racha < 3) return 1;
  return Math.min(Math.floor(racha / 3) + 1, 5);
}

/* ----------------------- Defs SVG compartidos (gradientes y texturas) ----------------------- */

function SobreDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <linearGradient id="carta-body-closed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <linearGradient id="carta-body-open" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="100%" stopColor="#fef3c7" />
        </linearGradient>
        <linearGradient id="carta-body-sealed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d1fae5" />
          <stop offset="100%" stopColor="#a7f3d0" />
        </linearGradient>
        <linearGradient id="carta-body-error" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fee2e2" />
          <stop offset="100%" stopColor="#fecaca" />
        </linearGradient>
        <linearGradient id="carta-flap-closed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0c89c" />
          <stop offset="100%" stopColor="#c89a5e" />
        </linearGradient>
        <linearGradient id="carta-flap-open" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="carta-flap-sealed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="carta-flap-error" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        {/* Textura sutil de papel (puntos micro) */}
        <pattern
          id="carta-paper-texture"
          x="0"
          y="0"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <rect width="5" height="5" fill="transparent" />
          <circle cx="1.2" cy="1.2" r="0.35" fill="#000" opacity="0.04" />
          <circle cx="3.5" cy="3.8" r="0.3" fill="#000" opacity="0.03" />
          <circle cx="4.2" cy="1.5" r="0.25" fill="#000" opacity="0.025" />
        </pattern>
        {/* Textura de madera para el estante */}
        <pattern
          id="carta-wood-texture"
          x="0"
          y="0"
          width="40"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <rect width="40" height="8" fill="#92400e" />
          <path d="M 0 4 Q 10 2 20 4 T 40 4" stroke="#78350f" strokeWidth="0.6" fill="none" opacity="0.5" />
          <path d="M 0 6 Q 15 5 25 6 T 40 6" stroke="#451a03" strokeWidth="0.4" fill="none" opacity="0.4" />
        </pattern>
      </defs>
    </svg>
  );
}

/* ----------------------- Estante de madera decorativo ----------------------- */

function EstanteMaderaSVG({ className }: { className?: string }) {
  const filas = [
    { y: 8, count: 5 },
    { y: 48, count: 6 },
    { y: 88, count: 4 },
  ];
  return (
    <svg viewBox="0 0 240 130" className={className} aria-hidden>
      {filas.map((fila, fi) => (
        <g key={fi}>
          {/* Tabla de madera */}
          <rect
            x="4"
            y={fila.y + 24}
            width="232"
            height="6"
            rx="2"
            fill="url(#carta-wood-texture)"
          />
          {/* Sombra bajo la tabla */}
          <rect
            x="4"
            y={fila.y + 30}
            width="232"
            height="3"
            fill="#000"
            opacity="0.12"
          />
          {/* Sobres mini decorativos */}
          {Array.from({ length: fila.count }).map((_, i) => {
            const gap = 220 / fila.count;
            const x = 10 + i * gap;
            return (
              <g key={i} transform={`translate(${x},${fila.y})`}>
                <rect
                  width={gap - 8}
                  height="22"
                  rx="2"
                  fill="#fff7ed"
                  stroke="#b45309"
                  strokeWidth="0.8"
                />
                <path
                  d={`M 0 0 L ${(gap - 8) / 2} 12 L ${gap - 8} 0 Z`}
                  fill="#f59e0b"
                  opacity="0.8"
                />
                <rect
                  x={gap - 16}
                  y="3"
                  width="6"
                  height="6"
                  rx="0.5"
                  fill="#fcd34d"
                  stroke="#b45309"
                  strokeWidth="0.3"
                />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/* ----------------------- Sobre SVG hiperdetallado ----------------------- */

interface SobreSVGProps {
  abierto: boolean;
  sellada: boolean;
  errorFlash: boolean;
  activa: boolean;
  index: number;
}

function SobreSVG({
  abierto,
  sellada,
  errorFlash,
  activa,
  index,
}: SobreSVGProps) {
  const bodyFill = sellada
    ? "url(#carta-body-sealed)"
    : errorFlash
      ? "url(#carta-body-error)"
      : abierto
        ? "url(#carta-body-open)"
        : "url(#carta-body-closed)";
  const bodyStroke = sellada
    ? "#059669"
    : errorFlash
      ? "#dc2626"
      : "#b45309";
  const flapFill = sellada
    ? "url(#carta-flap-sealed)"
    : errorFlash
      ? "url(#carta-flap-error)"
      : abierto
        ? "url(#carta-flap-open)"
        : "url(#carta-flap-closed)";
  const flapStroke = sellada
    ? "#047857"
    : errorFlash
      ? "#991b1b"
      : "#92400e";

  return (
    <svg
      viewBox="0 0 140 112"
      className="w-full drop-shadow-lg transition-transform duration-300"
      aria-hidden
    >
      {/* Sombra inferior */}
      <ellipse cx="70" cy="106" rx="60" ry="5" fill="#000" opacity="0.18" />

      {/* Hoja asomando cuando está abierta (animación de deslizamiento) */}
      {abierto && !sellada && (
        <g
          style={{
            transform: "translateY(-7px)",
            transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <rect
            x="24"
            y="20"
            width="92"
            height="68"
            rx="3"
            fill="#ffffff"
            stroke="#e5e7eb"
            strokeWidth="0.6"
          />
          {/* Líneas de cuaderno en la hoja */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1="28"
              y1={30 + i * 9}
              x2="112"
              y2={30 + i * 9}
              stroke="#fde68a"
              strokeWidth="0.5"
              opacity="0.6"
            />
          ))}
          {/* Margen rojo */}
          <line
            x1="30"
            y1="22"
            x2="30"
            y2="86"
            stroke="#f87171"
            strokeWidth="0.8"
            opacity="0.5"
          />
          {/* Texto manuscrito simulado */}
          <text
            x="33"
            y="34"
            fontSize="5"
            fontStyle="italic"
            fill="#78350f"
            fontFamily="Georgia, serif"
            opacity="0.55"
          >
            Querido primo...
          </text>
        </g>
      )}

      {/* Cuerpo del sobre */}
      <rect
        x="8"
        y="26"
        width="124"
        height="74"
        rx="6"
        fill={bodyFill}
        stroke={bodyStroke}
        strokeWidth="2.5"
        style={{ transition: "fill 0.4s, stroke 0.4s" }}
      />
      {/* Textura de papel superpuesta */}
      <rect
        x="8"
        y="26"
        width="124"
        height="74"
        rx="6"
        fill="url(#carta-paper-texture)"
      />

      {/* Líneas de dirección manuscrita (cuando cerrado) */}
      {!abierto && !sellada && !errorFlash && (
        <>
          <text
            x="22"
            y="52"
            fontSize="6.5"
            fontStyle="italic"
            fill="#78350f"
            fontFamily="Georgia, serif"
            opacity="0.65"
          >
            Sr. Pérez
          </text>
          <line
            x1="22"
            y1="58"
            x2="98"
            y2="58"
            stroke="#92400e"
            strokeWidth="1"
            opacity="0.35"
            strokeDasharray="4 3"
          />
          <line
            x1="22"
            y1="66"
            x2="84"
            y2="66"
            stroke="#92400e"
            strokeWidth="1"
            opacity="0.35"
            strokeDasharray="4 3"
          />
          <line
            x1="22"
            y1="74"
            x2="90"
            y2="74"
            stroke="#92400e"
            strokeWidth="1"
            opacity="0.35"
            strokeDasharray="4 3"
          />
        </>
      )}

      {/* Sello postal nicaragüense (esquina superior derecha) */}
      <g transform="translate(102, 30)">
        {/* Borde perforado */}
        <rect
          width="22"
          height="20"
          rx="1"
          fill={sellada ? "#a7f3d0" : errorFlash ? "#fecaca" : "#fcd34d"}
          stroke={sellada ? "#047857" : errorFlash ? "#991b1b" : "#b45309"}
          strokeWidth="0.6"
          strokeDasharray="1.5 1.2"
        />
        {/* Volcán */}
        <path
          d="M 3 16 L 8 8 L 11 11 L 14 6 L 19 16 Z"
          fill={sellada ? "#047857" : "#92400e"}
          opacity="0.85"
        />
        {/* Sol */}
        <circle cx="16" cy="5" r="2.2" fill="#fbbf24" />
        {/* Lago */}
        <path
          d="M 3 16 Q 7 14.5 11 16 T 19 16"
          stroke={sellada ? "#0891b2" : "#0ea5e9"}
          strokeWidth="0.9"
          fill="none"
        />
        <text
          x="11"
          y="19.5"
          textAnchor="middle"
          fontSize="3.5"
          fontWeight="bold"
          fill={sellada ? "#047857" : "#92400e"}
          fontFamily="Fredoka, sans-serif"
        >
          NI
        </text>
      </g>

      {/* Solapa (cerrada = triángulo completo, abierta = plana arriba) */}
      <path
        d={
          abierto || sellada
            ? "M 8 30 L 70 22 L 132 30"
            : "M 8 30 L 70 58 L 132 30 Z"
        }
        fill={flapFill}
        stroke={flapStroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
        style={{ transition: "d 0.4s ease, fill 0.4s" }}
      />
      {/* Línea central de la solapa (pliegue) */}
      {abierto && !sellada && (
        <line
          x1="8"
          y1="30"
          x2="132"
          y2="30"
          stroke="#92400e"
          strokeWidth="0.8"
          opacity="0.4"
        />
      )}

      {/* Número de carta */}
      <text
        x="16"
        y="42"
        fontSize="9"
        fontWeight="bold"
        fill={sellada ? "#047857" : errorFlash ? "#991b1b" : "#92400e"}
        fontFamily="Fredoka, sans-serif"
        opacity="0.7"
      >
        #{index + 1}
      </text>

      {/* Sello verde de "ENVIADA" */}
      {sellada && (
        <g className="animate-bounce-in">
          <circle
            cx="70"
            cy="62"
            r="20"
            fill="#10b981"
            stroke="#047857"
            strokeWidth="3"
            opacity="0.93"
            transform="rotate(-12 70 62)"
          />
          <circle
            cx="70"
            cy="62"
            r="15"
            fill="none"
            stroke="#fff"
            strokeWidth="1.5"
            opacity="0.7"
            transform="rotate(-12 70 62)"
          />
          <path
            d="M 59 62 L 67 70 L 82 54"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="rotate(-12 70 62)"
          />
          <text
            x="70"
            y="90"
            textAnchor="middle"
            fontSize="6.5"
            fontWeight="bold"
            fill="#047857"
            fontFamily="Fredoka, sans-serif"
            letterSpacing="1"
          >
            ENVIADA
          </text>
        </g>
      )}

      {/* Sello rojo de error (flash transitorio) */}
      {errorFlash && (
        <g className="animate-bounce-in">
          <circle
            cx="70"
            cy="62"
            r="18"
            fill="#ef4444"
            stroke="#991b1b"
            strokeWidth="2.5"
            opacity="0.92"
            transform="rotate(12 70 62)"
          />
          <path
            d="M 62 54 L 78 70 M 78 54 L 62 70"
            stroke="white"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Pulso de carta activa */}
      {activa && !sellada && !errorFlash && (
        <rect
          x="4"
          y="22"
          width="132"
          height="82"
          rx="9"
          fill="none"
          stroke="#a855f7"
          strokeWidth="3"
          opacity="0.75"
          className="animate-pulse"
        />
      )}
    </svg>
  );
}

/* ----------------------- Sello cayendo (animación al sellar correcto) ----------------------- */

function SelloCayendoSVG() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
      {/* Flash de luz */}
      <div
        className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ animation: "carta-stamp-flash 0.7s ease-out forwards" }}
      />
      <svg
        viewBox="0 0 60 60"
        className="h-14 w-16 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
        style={{ animation: "carta-stamp-fall 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
        aria-hidden
      >
        {/* Círculo del sello */}
        <circle cx="30" cy="30" r="22" fill="#a855f7" stroke="#7e22ce" strokeWidth="3" />
        <circle cx="30" cy="30" r="17.5" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.6" />
        {/* Estrella decorativa arriba */}
        <path
          d="M 30 14 L 32 19 L 37 19.5 L 33.5 23 L 34.5 28 L 30 25.5 L 25.5 28 L 26.5 23 L 23 19.5 L 28 19 Z"
          fill="#fbbf24"
          opacity="0.9"
        />
        {/* Check */}
        <path
          d="M 21 32 L 28 39 L 40 25"
          stroke="white"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="30"
          y="49"
          textAnchor="middle"
          fontSize="4.5"
          fontWeight="bold"
          fill="white"
          fontFamily="Fredoka, sans-serif"
          letterSpacing="0.8"
        >
          APROBADO
        </text>
      </svg>
    </div>
  );
}

/* ----------------------- Buzón SVG clásico (caja postal roja) ----------------------- */

function BuzonSVG({ contadorNivel }: { contadorNivel: number }) {
  const lleno = contadorNivel >= CARTAS_POR_NIVEL;
  return (
    <svg
      viewBox="0 0 120 168"
      className="w-full drop-shadow-xl"
      aria-hidden
    >
      {/* Sombra */}
      <ellipse cx="60" cy="160" rx="44" ry="5" fill="#000" opacity="0.2" />

      {/* Poste de madera */}
      <rect x="55" y="126" width="10" height="36" fill="#78350f" rx="2" />
      <rect x="52" y="160" width="16" height="4" fill="#451a03" rx="2" />
      {/* Veta del poste */}
      <line x1="58" y1="130" x2="58" y2="158" stroke="#451a03" strokeWidth="0.6" opacity="0.5" />
      <line x1="62" y1="134" x2="62" y2="155" stroke="#451a03" strokeWidth="0.5" opacity="0.4" />

      {/* Cuerpo del buzón (cilindro rojo) */}
      <rect
        x="14"
        y="34"
        width="92"
        height="94"
        rx="8"
        fill={lleno ? "#16a34a" : "#dc2626"}
        stroke="#7f1d1d"
        strokeWidth="2.5"
        style={{ transition: "fill 0.5s" }}
      />
      {/* Brillo lateral */}
      <rect x="18" y="38" width="8" height="86" rx="4" fill="#fff" opacity="0.15" />

      {/* Techo semicilíndrico */}
      <path
        d="M 14 40 Q 60 8 106 40 Z"
        fill={lleno ? "#15803d" : "#b91c1c"}
        stroke="#7f1d1d"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Banda decorativa superior */}
      <rect x="14" y="38" width="92" height="6" fill="#7f1d1d" opacity="0.55" />
      <rect x="14" y="120" width="92" height="6" fill="#7f1d1d" opacity="0.55" />

      {/* Ranura para cartas */}
      <rect
        x="32"
        y="48"
        width="56"
        height="6"
        rx="2"
        fill="#450a0a"
        opacity="0.85"
      />
      <text
        x="60"
        y="44"
        textAnchor="middle"
        fontSize="6"
        fontWeight="bold"
        fill="#fef3c7"
        fontFamily="Fredoka, sans-serif"
        letterSpacing="1.5"
      >
        CORREOS
      </text>

      {/* Ventanilla con cartas */}
      <rect
        x="26"
        y="70"
        width="68"
        height="42"
        rx="4"
        fill="#fef3c7"
        stroke="#7f1d1d"
        strokeWidth="1.5"
        opacity="0.95"
      />
      {/* Cartitas dentro (proporcional a contadorNivel) */}
      {Array.from({ length: CARTAS_POR_NIVEL }).map((_, i) => {
        const x = 32 + i * 12;
        const yOff = (i % 2) * 3;
        const enviada = i < contadorNivel;
        return (
          <g key={i}>
            <rect
              x={x}
              y={74 + yOff}
              width="18"
              height="32"
              rx="1.5"
              fill={enviada ? "#10b981" : "#fcd34d"}
              stroke={enviada ? "#047857" : "#b45309"}
              strokeWidth="1"
              style={{ transition: "fill 0.4s" }}
            />
            {enviada && (
              <>
                <path
                  d={`M ${x + 2} ${76 + yOff} L ${x + 9} ${84 + yOff} L ${x + 16} ${76 + yOff}`}
                  fill="#34d399"
                  opacity="0.7"
                />
                <path
                  d={`M ${x + 5} ${90 + yOff} L ${x + 8} ${93 + yOff} L ${x + 13} ${88 + yOff}`}
                  stroke="white"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                />
              </>
            )}
          </g>
        );
      })}

      {/* Check verde cuando el buzón está lleno */}
      {lleno && (
        <g className="animate-bounce-in">
          <circle cx="60" cy="24" r="13" fill="#10b981" stroke="#047857" strokeWidth="2.5" />
          <path
            d="M 54 24 L 59 29 L 67 19"
            stroke="white"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
}

/* ----------------------- Botón glossy reutilizable ----------------------- */

function GlossyButton({
  onClick,
  children,
  variant,
  className = "",
  ariaLabel,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant: "verde" | "rojo" | "violeta";
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}) {
  const colores: Record<
    "verde" | "rojo" | "violeta",
    { grad: string; shadow: string; border: string }
  > = {
    verde: {
      grad: "linear-gradient(180deg, #34d399 0%, #10b981 50%, #059669 100%)",
      shadow:
        "0 6px 0 #047857, 0 10px 22px rgba(16,185,129,0.45), inset 0 2px 0 rgba(255,255,255,0.35)",
      border: "#047857",
    },
    rojo: {
      grad: "linear-gradient(180deg, #fb7185 0%, #ef4444 50%, #dc2626 100%)",
      shadow:
        "0 6px 0 #991b1b, 0 10px 22px rgba(239,68,68,0.45), inset 0 2px 0 rgba(255,255,255,0.35)",
      border: "#991b1b",
    },
    violeta: {
      grad: "linear-gradient(180deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)",
      shadow:
        "0 6px 0 #7e22ce, 0 10px 22px rgba(168,85,247,0.45), inset 0 2px 0 rgba(255,255,255,0.35)",
      border: "#7e22ce",
    },
  };
  const c = colores[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`group relative overflow-hidden rounded-2xl py-3.5 text-base font-black text-white shadow-lg transition active:scale-95 disabled:opacity-50 ${className}`}
      style={{ background: c.grad, boxShadow: c.shadow }}
    >
      {/* Sheen animado */}
      <span
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)",
          transform: "translateX(-100%)",
          animation: "carta-sheen 2.8s ease-in-out infinite",
        }}
      />
      <span className="relative flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}

/* ----------------------- Componente principal ----------------------- */

interface CartaState {
  carta: Carta;
  estado: EstadoCarta;
  textoInput: string;
  errorFlash: boolean;
}

interface CartaOrtografiaProps {
  onSalir?: () => void;
}

export function CartaOrtografia({ onSalir: onSalirProp }: CartaOrtografiaProps = {}) {
  const sfx = useGameAudio();
  const { setVista } = useApp();
  const onSalir = onSalirProp ?? (() => setVista("dashboard"));

  const [nivelIdx, setNivelIdx] = useState(0);
  const [estado, setEstado] = useState<Estado>("presentacion");
  const [cartasNivel, setCartasNivel] = useState<CartaState[]>(() =>
    cartasPorNivel(1).map((c) => ({
      carta: c,
      estado: "sin_abrir" as EstadoCarta,
      textoInput: "",
      errorFlash: false,
    })),
  );
  const [idxActiva, setIdxActiva] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [cartasEnviadasTotal, setCartasEnviadasTotal] = useState(0);

  // Estado AAA: puntos, vidas, racha, combo
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(VIDAS_MAX);
  const [racha, setRacha] = useState(0);
  const [rachaMaxima, setRachaMaxima] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [fallosNivel, setFallosNivel] = useState(0);
  const [muted, setMuted] = useState(false);

  // FX
  const [floatingScores, setFloatingScores] = useState<FloatingScoreItem[]>([]);
  const [bursts, setBursts] = useState<(BurstConfig & { id: number })[]>([]);
  const [selloCayendoIdx, setSelloCayendoIdx] = useState<number | null>(null);

  // Refs
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const envelopeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);

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

  // Sincronizar mute con audio
  useEffect(() => {
    sfx.setMuted(muted);
  }, [muted, sfx]);

  // Cargar las cartas de un nivel (llamado desde handlers, no desde effect)
  const cargarCartasDelNivel = useCallback((idx: number) => {
    const cartas = cartasPorNivel(idx + 1);
    setCartasNivel(
      cartas.map((c) => ({
        carta: c,
        estado: "sin_abrir" as EstadoCarta,
        textoInput: "",
        errorFlash: false,
      })),
    );
    setIdxActiva(null);
    setFeedback(null);
    setFallosNivel(0);
  }, []);

  const nivel = nivelIdx + 1;
  const selladasNivel = useMemo(
    () => cartasNivel.filter((c) => c.estado === "sellada_correcta").length,
    [cartasNivel],
  );

  /* ---- Transición: celebrando → siguiente nivel o completado ---- */
  useEffect(() => {
    if (estado !== "celebrando") return;
    const t = setTimeout(() => {
      if (nivelIdx + 1 >= TOTAL_NIVELES) {
        setEstado("completado");
        sfx.victory();
      } else {
        const newIdx = nivelIdx + 1;
        setNivelIdx(newIdx);
        cargarCartasDelNivel(newIdx);
        setEstado("jugando");
      }
    }, 2400);
    return () => clearTimeout(t);
  }, [estado, nivelIdx, sfx, cargarCartasDelNivel]);

  // ¿Todas las cartas del nivel están selladas? → celebrar
  // (el bonus de nivel perfecto se otorga en registrarAcierto)
  useEffect(() => {
    if (estado !== "jugando") return;
    if (cartasNivel.length === 0) return;
    if (selladasNivel === CARTAS_POR_NIVEL) {
      programar(() => {
        setEstado("celebrando");
        sfx.victory();
      }, 500);
    }
  }, [selladasNivel, cartasNivel.length, estado, programar, sfx]);

  // Game over cuando vidas === 0
  useEffect(() => {
    if (vidas <= 0 && estado === "jugando") {
      programar(() => {
        setEstado("gameOver");
        sfx.error();
      }, 600);
    }
  }, [vidas, estado, sfx, programar]);

  /* ---- FX helpers ---- */
  const agregarBurst = useCallback(
    (cx: number, cy: number, count: number, colors: string[], power: number) => {
      const id = nextScoreId();
      setBursts((prev) => [...prev, { id, x: cx, y: cy, count, colors, power }]);
      programar(
        () => setBursts((prev) => prev.filter((b) => b.id !== id)),
        1000,
      );
    },
    [programar],
  );

  const flashError = useCallback(
    (i: number) => {
      setCartasNivel((prev) =>
        prev.map((c, idx) => (idx === i ? { ...c, errorFlash: true } : c)),
      );
      programar(() => {
        setCartasNivel((prev) =>
          prev.map((c, idx) => (idx === i ? { ...c, errorFlash: false } : c)),
        );
      }, 650);
    },
    [programar],
  );

  /* ---- Acciones ---- */

  const empezar = useCallback(() => {
    sfx.click();
    setEstado("jugando");
    setFeedback(null);
  }, [sfx]);

  const abrirCarta = useCallback(
    (i: number) => {
      if (estado !== "jugando") return;
      sfx.whoosh();
      setCartasNivel((prev) =>
        prev.map((c, idx) => {
          if (idx === i) {
            if (c.estado === "sellada_correcta") return c;
            return { ...c, estado: "abierta" as EstadoCarta };
          }
          if (c.estado === "abierta" || c.estado === "corrigiendo") {
            return { ...c, estado: "sin_abrir" as EstadoCarta };
          }
          return c;
        }),
      );
      setIdxActiva(i);
      setFeedback(null);
    },
    [estado, sfx],
  );

  // Registrar acierto: suma puntos, racha, FX, audio, sello cayendo
  const registrarAcierto = useCallback(
    (i: number) => {
      setRacha((r) => {
        const nuevaRacha = r + 1;
        const mult = comboMultiplicador(nuevaRacha);
        const puntosGanados = PUNTOS_CARTA * mult;
        setPuntos((p) => p + puntosGanados);
        setRachaMaxima((m) => Math.max(m, nuevaRacha));

        // Audio
        sfx.chime();
        if (nuevaRacha >= 3) {
          programar(() => sfx.combo(nuevaRacha), 220);
        }
        sfx.vibrate(30);

        // FloatingScore + ParticleBurst en posición del sobre
        const btn = envelopeRefs.current[i];
        const area = gameAreaRef.current;
        if (btn && area) {
          const rect = btn.getBoundingClientRect();
          const ar = area.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const fx = ((cx - ar.left) / ar.width) * 100;
          const fy = ((cy - ar.top) / ar.height) * 100;
          const id = nextScoreId();
          const texto =
            mult > 1 ? `+${puntosGanados} ¡x${mult}!` : `+${puntosGanados}`;
          setFloatingScores((prev) => [
            ...prev,
            { id, x: fx, y: fy, text: texto, color: "#34d399" },
          ]);
          programar(
            () =>
              setFloatingScores((prev) => prev.filter((f) => f.id !== id)),
            1000,
          );
          agregarBurst(
            cx,
            cy,
            16,
            ["#34d399", "#a855f7", "#fbbf24", "#ffffff", "#6ee7b7"],
            1.3,
          );
        }
        return nuevaRacha;
      });

      setAciertos((a) => a + 1);
      setCartasEnviadasTotal((v) => v + 1);
      setIdxActiva(null);
      setFeedback(null);
      setCartasNivel((prev) =>
        prev.map((c, idx) =>
          idx === i ? { ...c, estado: "sellada_correcta" as EstadoCarta } : c,
        ),
      );

      // Bonus de nivel perfecto si este acierto completa el nivel sin fallos
      if (selladasNivel + 1 === CARTAS_POR_NIVEL && fallosNivel === 0) {
        setPuntos((p) => p + PUNTOS_BONUS_PERFECTO);
        const bonusId = nextScoreId();
        setFloatingScores((prev) => [
          ...prev,
          {
            id: bonusId,
            x: 50,
            y: 35,
            text: `¡NIVEL PERFECTO! +${PUNTOS_BONUS_PERFECTO}`,
            color: "#fbbf24",
            icon: "🏆",
          },
        ]);
        programar(
          () =>
            setFloatingScores((prev) =>
              prev.filter((f) => f.id !== bonusId),
            ),
          1400,
        );
      }

      // Sello cayendo
      setSelloCayendoIdx(i);
      programar(
        () => setSelloCayendoIdx((cur) => (cur === i ? null : cur)),
        800,
      );
    },
    [sfx, programar, agregarBurst, selladasNivel, fallosNivel],
  );

  // Registrar fallo: pierde vida, resetea racha, feedback, audio
  const registrarFallo = useCallback(
    (msg: string) => {
      setVidas((v) => Math.max(0, v - 1));
      setRacha(0);
      setFallosNivel((f) => f + 1);
      setFeedback(msg);
      sfx.error();
      sfx.vibrate([50, 30, 50]);
    },
    [sfx],
  );

  const decidir = useCallback(
    (i: number, diceError: boolean) => {
      if (estado !== "jugando") return;
      const cartaObj = cartasNivel[i]?.carta;
      if (!cartaObj) return;
      const tieneError = cartaTieneError(cartaObj);
      setIntentos((n) => n + 1);

      if (diceError) {
        // El niño dice "✗ Tiene error"
        if (tieneError) {
          // Correcto: abrir formulario de corrección
          sfx.click();
          setCartasNivel((prev) =>
            prev.map((c, idx) =>
              idx === i
                ? {
                    ...c,
                    estado: "corrigiendo" as EstadoCarta,
                    textoInput: cartaObj.texto_mostrado,
                  }
                : c,
            ),
          );
          setFeedback(null);
        } else {
          // Incorrecto: la carta no tenía error
          registrarFallo(cartaObj.feedback_error);
          flashError(i);
        }
      } else {
        // El niño dice "✓ Está bien"
        if (!tieneError) {
          // Correcto: sellar
          registrarAcierto(i);
        } else {
          // Incorrecto: la carta sí tenía error
          registrarFallo(cartaObj.feedback_error);
          flashError(i);
        }
      }
    },
    [estado, cartasNivel, sfx, registrarAcierto, registrarFallo, flashError],
  );

  const cambiarInput = useCallback((i: number, valor: string) => {
    setCartasNivel((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, textoInput: valor } : c)),
    );
  }, []);

  const corregir = useCallback(
    (i: number) => {
      if (estado !== "jugando") return;
      const cs = cartasNivel[i];
      if (!cs) return;
      setIntentos((n) => n + 1);
      const ok =
        normalizar(cs.textoInput) === normalizar(cs.carta.correccion_correcta);
      if (ok) {
        registrarAcierto(i);
      } else {
        registrarFallo(cs.carta.feedback_error);
        flashError(i);
      }
    },
    [estado, cartasNivel, registrarAcierto, registrarFallo, flashError],
  );

  const cancelarCorreccion = useCallback((i: number) => {
    sfx.click();
    setCartasNivel((prev) =>
      prev.map((c, idx) =>
        idx === i
          ? {
              ...c,
              estado: "abierta" as EstadoCarta,
              textoInput: "",
            }
          : c,
      ),
    );
    setFeedback(null);
  }, [sfx]);

  const reiniciarJuego = useCallback(() => {
    sfx.click();
    setNivelIdx(0);
    cargarCartasDelNivel(0);
    setEstado("jugando");
    setCartasEnviadasTotal(0);
    setPuntos(0);
    setVidas(VIDAS_MAX);
    setRacha(0);
    setRachaMaxima(0);
    setAciertos(0);
    setIntentos(0);
    setIdxActiva(null);
    setFeedback(null);
    setFallosNivel(0);
    setFloatingScores([]);
    setBursts([]);
    setSelloCayendoIdx(null);
  }, [sfx, cargarCartasDelNivel]);

  const toggleMute = useCallback(() => {
    sfx.click();
    setMuted((m) => !m);
  }, [sfx]);

  /* ---- Derivados ---- */
  const esPresentacion = estado === "presentacion";
  const esJugando = estado === "jugando";
  const esCelebrando = estado === "celebrando";
  const cartaActiva = idxActiva !== null ? cartasNivel[idxActiva] : null;

  /* ===================== RENDER ===================== */

  return (
    <GameShell theme="language">
      <SobreDefs />

      {/* HUD (oculto durante la presentación inicial) */}
      {!esPresentacion && estado !== "completado" && estado !== "gameOver" && (
        <GameHUD
          theme="language"
          nivel={nivel}
          totalNiveles={TOTAL_NIVELES}
          puntos={puntos}
          vidas={vidas}
          vidasMaximas={VIDAS_MAX}
          racha={racha}
          muted={muted}
          onToggleMute={toggleMute}
          icono={<Mail size={18} strokeWidth={2.5} />}
        />
      )}

      {/* ===================== Presentación (GameIntro) ===================== */}
      {esPresentacion ? (
        <GameIntro
          icono={
            <span className="text-7xl drop-shadow-[0_8px_16px_rgba(168,85,247,0.6)]">
              📮
            </span>
          }
          titulo="La Carta Mal Enviada"
          subtitulo="Revisá sobres y corregí errores de ortografía"
          descripcion="Sos el cartero de la oficina nicaragüense. Abrí cada sobre, leé con cuidado y decidí si la carta está bien o tiene error. ¡Sellá y enviá al buzón!"
          pasos={[
            "Abrí cada sobre del estante",
            "Decidí si la carta está bien o tiene error",
            "Si tiene error, escribí la corrección",
            "¡Sellá y enviá!",
          ]}
          temaColor={TEMA_COLOR}
          onJugar={empezar}
        />
      ) : (
        /* ===================== Pantalla: jugando / celebrando ===================== */
        <div
          ref={gameAreaRef}
          className="relative mx-auto max-w-5xl px-3 pb-6 pt-4 sm:px-5 sm:pt-6"
        >
          {/* Estante decorativo de fondo (desktop) */}
          <EstanteMaderaSVG className="pointer-events-none absolute -right-2 top-2 hidden h-28 w-48 opacity-20 lg:block" />

          <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
            {/* ============ Columna principal: cartas y formulario ============ */}
            <div className="flex flex-col gap-4">
              {/* Fila de 4 sobres */}
              <div className="rounded-3xl border-2 border-fuchsia-400/30 bg-white/10 p-4 shadow-xl backdrop-blur-xl sm:p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-sm font-bold text-fuchsia-100 sm:text-base">
                    <Mail size={16} className="text-fuchsia-300" strokeWidth={2.5} />
                    Sobres del nivel
                  </h3>
                  <span className="rounded-full border border-fuchsia-400/40 bg-fuchsia-500/20 px-2.5 py-0.5 text-xs font-bold text-fuchsia-100">
                    {selladasNivel}/{CARTAS_POR_NIVEL} selladas
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {cartasNivel.map((cs, i) => {
                    const sellada = cs.estado === "sellada_correcta";
                    const abierta =
                      cs.estado === "abierta" || cs.estado === "corrigiendo";
                    const activa = idxActiva === i && !sellada;
                    return (
                      <button
                        key={cs.carta.id}
                        ref={(el) => {
                          envelopeRefs.current[i] = el;
                        }}
                        onClick={() => abrirCarta(i)}
                        disabled={sellada || !esJugando}
                        aria-label={
                          sellada
                            ? `Carta ${i + 1} sellada y enviada`
                            : `Abrir carta ${i + 1}`
                        }
                        className={`group relative flex flex-col items-center rounded-2xl border-2 p-2 transition-all ${
                          sellada
                            ? "cursor-default border-emerald-400/50 bg-emerald-500/10"
                            : cs.errorFlash
                              ? "border-rose-400 bg-rose-500/15"
                              : activa
                                ? "border-fuchsia-400 bg-fuchsia-500/15 ring-2 ring-fuchsia-400/50"
                                : "border-amber-300/30 bg-amber-100/5 hover:border-amber-300/60 hover:bg-amber-100/10"
                        } ${esJugando && !sellada ? "cursor-pointer active:scale-95" : ""}`}
                      >
                        <SobreSVG
                          abierto={abierta}
                          sellada={sellada}
                          errorFlash={cs.errorFlash}
                          activa={activa}
                          index={i}
                        />
                        {/* Sello cayendo (animación) */}
                        {selloCayendoIdx === i && <SelloCayendoSVG />}
                        <p
                          className={`mt-1 text-[10px] font-bold uppercase tracking-wide sm:text-xs ${
                            sellada
                              ? "text-emerald-300"
                              : cs.errorFlash
                                ? "text-rose-300"
                                : abierta
                                  ? "text-amber-200"
                                  : "text-amber-100/70"
                          }`}
                        >
                          {sellada
                            ? "✓ Enviada"
                            : cs.errorFlash
                              ? "¡Error!"
                              : abierta
                                ? "Abierta"
                                : "Tocá para abrir"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Panel de la carta activa */}
              {cartaActiva && cartaActiva.estado !== "sellada_correcta" && (
                <div className="animate-bounce-in rounded-3xl border-2 border-fuchsia-400/30 bg-white/95 p-4 text-amber-950 shadow-2xl backdrop-blur-xl sm:p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                      Carta {cartaActiva.carta.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700/70">
                      {etiquetaTipo(cartaActiva.carta)}
                    </span>
                  </div>

                  {/* Hoja de carta: papel cuadriculado con margen rojo */}
                  <div
                    className="relative rounded-xl border border-amber-200 bg-white px-4 py-5 shadow-inner sm:px-6 sm:py-6"
                    style={{
                      clipPath:
                        "polygon(0% 1%, 99% 0%, 100% 99%, 1% 100%)",
                      backgroundImage:
                        "repeating-linear-gradient(transparent, transparent 27px, rgba(251,191,36,0.25) 27px, rgba(251,191,36,0.25) 28px)",
                    }}
                  >
                    {/* Margen rojo izquierdo */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-7 top-2 bottom-2 w-px bg-rose-400 opacity-60 sm:left-9"
                    />
                    {/* Agujero de carpeta decorativo */}
                    <div
                      aria-hidden
                      className="absolute left-2 top-4 h-2 w-2 rounded-full border border-amber-200 bg-amber-50"
                    />
                    <div
                      aria-hidden
                      className="absolute left-2 bottom-4 h-2 w-2 rounded-full border border-amber-200 bg-amber-50"
                    />
                    <p
                      className="relative pl-4 text-lg italic leading-8 text-amber-950 sm:text-xl sm:leading-9"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      {cartaActiva.carta.texto_mostrado}
                    </p>
                  </div>

                  {/* Estado: decidiendo */}
                  {cartaActiva.estado === "abierta" && (
                    <>
                      <p className="mt-4 text-center text-sm font-bold text-amber-900 sm:text-base">
                        <Hand
                          size={14}
                          className="mr-1 inline"
                          strokeWidth={2.5}
                        />
                        ¿Esta carta está bien escrita o tiene error?
                      </p>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <GlossyButton
                          variant="verde"
                          onClick={() => decidir(idxActiva ?? 0, false)}
                          className="flex-1 sm:text-lg"
                          ariaLabel="Marcar carta como bien escrita"
                        >
                          <Check size={20} strokeWidth={2.5} /> Está bien
                        </GlossyButton>
                        <GlossyButton
                          variant="rojo"
                          onClick={() => decidir(idxActiva ?? 0, true)}
                          className="flex-1 sm:text-lg"
                          ariaLabel="Marcar carta con error"
                        >
                          <X size={20} strokeWidth={2.5} /> Tiene error
                        </GlossyButton>
                      </div>
                    </>
                  )}

                  {/* Estado: corrigiendo */}
                  {cartaActiva.estado === "corrigiendo" && (
                    <div className="mt-4">
                      {/* Pista: regla ortográfica */}
                      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-3">
                        <p className="flex items-start gap-2 text-sm font-semibold text-amber-900 sm:text-base">
                          <BookOpen
                            size={16}
                            className="mt-0.5 shrink-0 text-amber-600"
                            strokeWidth={2.5}
                          />
                          <span>
                            <span className="font-bold text-amber-700">
                              Pista:{" "}
                            </span>
                            {cartaActiva.carta.regla_ortografica}
                          </span>
                        </p>
                      </div>

                      {/* Corrección de referencia */}
                      <div className="mt-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3">
                        <p className="flex items-start gap-2 text-sm font-semibold text-emerald-900 sm:text-base">
                          <Stamp
                            size={16}
                            className="mt-0.5 shrink-0 text-emerald-600"
                            strokeWidth={2.5}
                          />
                          <span>
                            <span className="font-bold text-emerald-700">
                              Corrección correcta (referencia):{" "}
                            </span>
                            <span className="font-bold">
                              {cartaActiva.carta.correccion_correcta}
                            </span>
                          </span>
                        </p>
                      </div>

                      {/* Input de corrección */}
                      <label
                        htmlFor="input-correccion"
                        className="mt-3 block text-sm font-bold text-amber-900 sm:text-base"
                      >
                        Escribí la carta corregida:
                      </label>
                      <input
                        id="input-correccion"
                        type="text"
                        value={cartaActiva.textoInput}
                        onChange={(e) =>
                          cambiarInput(idxActiva ?? 0, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") corregir(idxActiva ?? 0);
                        }}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        autoFocus
                        className="mt-2 w-full rounded-2xl border-2 border-fuchsia-300 bg-white px-4 py-3 text-base font-semibold text-amber-950 shadow-inner outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200 sm:text-lg"
                        placeholder="Escribí aquí la corrección…"
                        aria-label="Campo para escribir la corrección de la carta"
                      />

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <GlossyButton
                          variant="violeta"
                          onClick={() => corregir(idxActiva ?? 0)}
                          className="flex-1 sm:text-lg"
                          ariaLabel="Sellá y enviá la carta corregida"
                        >
                          <Stamp size={20} strokeWidth={2.5} /> Sellá
                        </GlossyButton>
                        <button
                          onClick={() =>
                            cancelarCorreccion(idxActiva ?? 0)
                          }
                          className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-amber-300 bg-white py-3.5 px-4 text-sm font-bold text-amber-700 transition hover:bg-amber-50 active:scale-95 sm:text-base"
                        >
                          <RotateCcw size={16} strokeWidth={2.5} /> Volver
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mensaje cuando no hay carta activa */}
              {!cartaActiva && esJugando && selladasNivel < CARTAS_POR_NIVEL && (
                <div className="rounded-3xl border-2 border-dashed border-fuchsia-400/30 bg-white/5 p-6 text-center backdrop-blur">
                  <p className="flex items-center justify-center gap-2 text-sm font-bold text-fuchsia-100 sm:text-base">
                    <Hand size={16} strokeWidth={2.5} />
                    Tocá un sobre arriba para abrir esa carta.
                  </p>
                </div>
              )}

              {/* Feedback de error */}
              {feedback && esJugando && (
                <div className="animate-bounce-in rounded-2xl border-2 border-rose-400/50 bg-rose-950/80 px-4 py-3 shadow-lg backdrop-blur">
                  <p className="flex items-start gap-2 text-sm font-semibold text-rose-100">
                    <TriangleAlert
                      size={18}
                      className="mt-0.5 shrink-0 text-rose-300"
                      strokeWidth={2.5}
                    />
                    <span>{feedback}</span>
                  </p>
                </div>
              )}
            </div>

            {/* ============ Columna derecha: buzón + tips ============ */}
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border-2 border-rose-400/30 bg-white/10 p-3 shadow-xl backdrop-blur-xl sm:p-4">
                <h3 className="mb-2 flex items-center justify-center gap-1.5 text-sm font-bold text-rose-100 sm:text-base">
                  <Mailbox size={16} className="text-rose-300" strokeWidth={2.5} />
                  Buzón de enviadas
                </h3>
                <BuzonSVG contadorNivel={selladasNivel} />
                <p className="mt-2 text-center text-xs font-semibold text-rose-100 sm:text-sm">
                  {selladasNivel}/{CARTAS_POR_NIVEL} cartas selladas este nivel
                </p>
                <p className="mt-0.5 text-center text-[11px] font-bold text-amber-200/70">
                  Total: {cartasEnviadasTotal}/{TOTAL_CARTAS}
                </p>
              </div>

              {/* Tip pedagógico */}
              <div className="hidden rounded-3xl border-2 border-fuchsia-400/20 bg-white/5 p-3 backdrop-blur lg:block">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-fuchsia-300">
                  <Sparkles size={12} strokeWidth={2.5} />
                  Tip del cartero
                </p>
                <p className="mt-1 text-xs font-semibold text-fuchsia-100/80">
                  No todas las cartas tienen error. Leé con calma antes de
                  decidir. ¡Cuidado con las trampas!
                </p>
              </div>

              {/* Stats compactas (combo) */}
              {racha >= 3 && (
                <div className="animate-bounce-in rounded-3xl border-2 border-orange-400/40 bg-orange-500/15 p-3 text-center backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-wide text-orange-300">
                    ¡Combo activo!
                  </p>
                  <p className="text-2xl font-black text-orange-200">
                    x{comboMultiplicador(racha)}
                  </p>
                  <p className="text-[11px] font-semibold text-orange-100/70">
                    {racha} cartas seguidas
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* FloatingScores */}
          {floatingScores.map((item) => (
            <FloatingScore key={item.id} item={item} />
          ))}

          {/* ParticleBursts */}
          {bursts.map((b) => (
            <ParticleBurst key={b.id} burst={b} />
          ))}
        </div>
      )}

      {/* ===================== Overlay de celebración entre niveles ===================== */}
      {esCelebrando && (
        <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
          <div className="animate-bounce-in rounded-3xl border-2 border-fuchsia-400/50 bg-black/85 px-8 py-6 text-center shadow-2xl backdrop-blur-xl">
            <p className="text-sm font-black uppercase tracking-wider text-fuchsia-300">
              ¡Nivel {nivel} completado!
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {CARTAS_POR_NIVEL} cartas selladas 🎉
            </p>
            <p className="mt-1 text-sm font-semibold text-fuchsia-200">
              {nivelIdx + 1 < TOTAL_NIVELES
                ? `Vamos al nivel ${nivel + 1}…`
                : "¡Último nivel completado!"}
            </p>
          </div>
          <Confetti duracionMs={2400} cantidad={48} />
        </div>
      )}

      {/* ===================== Overlay final: victoria o derrota ===================== */}
      {(estado === "completado" || estado === "gameOver") && (
        <GameOverlay
          tipo={estado === "completado" ? "victoria" : "derrota"}
          titulo={
            estado === "completado"
              ? "¡Cartero Experto!"
              : "¡Te quedaste sin vidas!"
          }
          subtitulo={
            estado === "completado"
              ? `Enviaste ${cartasEnviadasTotal} cartas con éxito desde la oficina de correos.`
              : `Llegaste al nivel ${nivel} con ${cartasEnviadasTotal} cartas enviadas. ¡Intentá de nuevo!`
          }
          stats={{
            puntos,
            rachaMaxima,
            aciertos,
            total: intentos,
          }}
          onReiniciar={reiniciarJuego}
          onSalir={onSalir}
          temaColor={TEMA_COLOR}
        />
      )}

      {/* Keyframes globales para animaciones AAA */}
      <style jsx global>{`
        @keyframes carta-stamp-fall {
          0% {
            transform: translateY(-130px) rotate(-25deg) scale(0.5);
            opacity: 0;
          }
          55% {
            transform: translateY(8px) rotate(8deg) scale(1.15);
            opacity: 1;
          }
          72% {
            transform: translateY(-5px) rotate(-3deg) scale(0.92);
          }
          86% {
            transform: translateY(3px) rotate(2deg) scale(1.05);
          }
          100% {
            transform: translateY(0) rotate(-8deg) scale(1);
            opacity: 1;
          }
        }
        @keyframes carta-stamp-flash {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
          }
          40% {
            opacity: 0.85;
            transform: translate(-50%, -50%) scale(1.6);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2.2);
          }
        }
        @keyframes carta-sheen {
          0%,
          100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </GameShell>
  );
}
