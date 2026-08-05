"use client";

/**
 * ============================================================
 *  Cazador de Sílabas — Edición AAA
 *  ------------------------------------------------------------
 *  Mecánica conservada:
 *   1. Palabra objetivo separada en sílabas
 *   2. Globos con sílabas suben verticalmente
 *   3. Tocar en ORDEN correcto
 *   4. 8 rondas · 3 vidas · +10/+20/+30
 *
 *  Mejoras AAA:
 *   - GameShell + GameHUD + GameIntro + GameOverlay
 *   - useGameAudio (sfx unificados)
 *   - Combo x2..x5 (racha de palabras sin error)
 *   - Timer 20s por palabra
 *   - FloatingScore + ParticleBurst + Confetti + shockwave
 *   - Globos premium (gloss + brillo + cuerda SVG + sway)
 *   - LED syllable display + glassmorphism progress
 *   - Fondo cielo: nubes SVG + avioncito + arcoíris sutil
 * ============================================================
 */

import {
  useCallback,
  useEffect,
  Fragment,
  useRef,
  useState,
} from "react";
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
   Constantes
   ============================================================ */

type Estado = "intro" | "jugando" | "completado";
type Resultado = "victoria" | "derrota";

interface PalabraEntry {
  word: string;
  syllables: string[];
}

const BANCO_PALABRAS: PalabraEntry[] = [
  { word: "PLÁTANO", syllables: ["PLÁ", "TA", "NO"] },
  { word: "MARIPOSA", syllables: ["MA", "RI", "PO", "SA"] },
  { word: "ELEFANTE", syllables: ["E", "LE", "FAN", "TE"] },
  { word: "JIRAFA", syllables: ["JI", "RA", "FA"] },
  { word: "TORTUGA", syllables: ["TOR", "TU", "GA"] },
  { word: "PELOTA", syllables: ["PE", "LO", "TA"] },
  { word: "GUITARRA", syllables: ["GUI", "TA", "RRA"] },
  { word: "VENTANA", syllables: ["VEN", "TA", "NA"] },
];

const TOTAL_RONDAS = 8;
const VIDAS_MAX = 3;
const TIMER_MS = 20000;
const TIMER_LOW_MS = 5000;
const PUNTOS_SILABA = 10;
const PUNTOS_PALABRA = 20;
const PUNTOS_PALABRA_PERFECT = 30;
const COMBO_MAX = 5;

const COLORES = ["red", "blue", "green", "yellow", "purple"] as const;
type ColorGlobo = (typeof COLORES)[number];

const MAPA_IMAGENES: Record<ColorGlobo, string> = {
  red: "/syllable-game/balloon_red.png",
  blue: "/syllable-game/balloon_blue.png",
  green: "/syllable-game/balloon_green.png",
  yellow: "/syllable-game/balloon_yellow.png",
  purple: "/syllable-game/balloon_purple.png",
};

const COLOR_GLOBO: Record<ColorGlobo, string> = {
  red: "#f87171",
  blue: "#60a5fa",
  green: "#4ade80",
  yellow: "#facc15",
  purple: "#c084fc",
};

const TEMA_COLOR = "#fb7185";

interface Globo {
  id: number;
  silaba: string;
  x: number;
  y: number;
  speed: number;
  color: ColorGlobo;
  popping?: boolean;
  swayPhase: number;
  hue: number; // for slight color variation
}

let globoIdCounter = 0;

/* ============================================================
   Helpers
   ============================================================ */

function mezclar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ============================================================
   Sky Scene (nubes + avioncito + arcoíris)
   ============================================================ */

function NubeSVG({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 220 90"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <g fill="rgba(255,255,255,0.92)">
        <ellipse cx="55" cy="55" rx="38" ry="26" />
        <ellipse cx="100" cy="42" rx="44" ry="32" />
        <ellipse cx="150" cy="55" rx="38" ry="26" />
        <ellipse cx="110" cy="62" rx="58" ry="22" />
      </g>
      <g fill="rgba(255,255,255,0.6)">
        <ellipse cx="68" cy="35" rx="22" ry="13" />
        <ellipse cx="135" cy="32" rx="24" ry="14" />
      </g>
      <g fill="rgba(186,230,253,0.35)">
        <ellipse cx="110" cy="74" rx="58" ry="10" />
      </g>
    </svg>
  );
}

function AvionSVG() {
  return (
    <svg
      viewBox="0 0 110 44"
      aria-hidden="true"
      className="h-9 w-24 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
    >
      {/* Estela */}
      <path
        d="M0 22 Q 20 22, 30 22"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      {/* Fuselaje */}
      <ellipse cx="58" cy="22" rx="34" ry="6.5" fill="#f1f5f9" />
      {/* Cabina superior */}
      <ellipse cx="55" cy="17" rx="14" ry="4" fill="#cbd5e1" />
      {/* Nariz */}
      <ellipse cx="88" cy="22" rx="8" ry="5.5" fill="#94a3b8" />
      {/* Ala superior */}
      <path d="M48 22 L24 6 L34 22 L24 38 Z" fill="#64748b" />
      {/* Estabilizador */}
      <path d="M26 22 L14 10 L20 22 L14 34 Z" fill="#64748b" />
      {/* Ventanas */}
      <circle cx="52" cy="22" r="1.4" fill="#22d3ee" />
      <circle cx="60" cy="22" r="1.4" fill="#22d3ee" />
      <circle cx="68" cy="22" r="1.4" fill="#22d3ee" />
      <circle cx="76" cy="22" r="1.4" fill="#22d3ee" />
      {/* Luz parpadeante */}
      <circle cx="88" cy="22" r="2.2" fill="#ef4444">
        <animate
          attributeName="opacity"
          values="1;0.25;1"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </circle>
      {/* Helice */}
      <line
        x1="92"
        y1="14"
        x2="96"
        y2="30"
        stroke="#475569"
        strokeWidth="1.2"
        opacity="0.6"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 90 22"
          to="360 90 22"
          dur="0.2s"
          repeatCount="indefinite"
        />
      </line>
    </svg>
  );
}

function ArcoirisSVG() {
  return (
    <svg
      viewBox="0 0 400 200"
      aria-hidden="true"
      className="h-full w-full"
      preserveAspectRatio="xMidYMax slice"
    >
      <g fill="none" strokeWidth="7" opacity="0.32">
        <path d="M10 200 A 190 190 0 0 1 390 200" stroke="#ef4444" />
        <path d="M22 200 A 178 178 0 0 1 378 200" stroke="#f97316" />
        <path d="M34 200 A 166 166 0 0 1 366 200" stroke="#fbbf24" />
        <path d="M46 200 A 154 154 0 0 1 354 200" stroke="#22c55e" />
        <path d="M58 200 A 142 142 0 0 1 342 200" stroke="#06b6d4" />
        <path d="M70 200 A 130 130 0 0 1 330 200" stroke="#a855f7" />
      </g>
    </svg>
  );
}

function SkyScene() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Arcoíris sutil */}
      <div className="absolute -bottom-2 left-1/2 h-[280px] w-[680px] max-w-none -translate-x-1/2 opacity-70 sm:h-[360px] sm:w-[900px]">
        <ArcoirisSVG />
      </div>

      {/* Nube lejana superior izq */}
      <div
        className="absolute left-[-40px] top-[8%] h-16 w-40 opacity-80 sm:h-20 sm:w-52"
        style={{
          animation: "nube-drift 48s linear infinite",
        }}
      >
        <NubeSVG className="h-full w-full" />
      </div>
      {/* Nube media superior der */}
      <div
        className="absolute right-[-30px] top-[18%] h-14 w-36 opacity-70 sm:h-20 sm:w-48"
        style={{
          animation: "nube-drift-rev 60s linear infinite",
        }}
      >
        <NubeSVG className="h-full w-full" />
      </div>
      {/* Nube media */}
      <div
        className="absolute left-[10%] top-[40%] h-12 w-32 opacity-55 sm:h-16 sm:w-40"
        style={{
          animation: "nube-drift 70s linear infinite",
          animationDelay: "-12s",
        }}
      >
        <NubeSVG className="h-full w-full" />
      </div>
      {/* Nube lejana der */}
      <div
        className="absolute right-[15%] top-[60%] h-10 w-28 opacity-40 sm:h-14 sm:w-36"
        style={{
          animation: "nube-drift-rev 80s linear infinite",
          animationDelay: "-30s",
        }}
      >
        <NubeSVG className="h-full w-full" />
      </div>

      {/* Avioncito lejano */}
      <div
        className="absolute top-[14%]"
        style={{
          left: "-120px",
          animation: "avion-vuelo 32s linear infinite",
        }}
      >
        <AvionSVG />
      </div>

      <style jsx>{`
        @keyframes nube-drift {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(100vw + 280px));
          }
        }
        @keyframes nube-drift-rev {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100vw - 280px));
          }
        }
        @keyframes avion-vuelo {
          0% {
            transform: translate(0, 0) rotate(-2deg);
          }
          50% {
            transform: translate(50vw, 14px) rotate(1deg);
          }
          100% {
            transform: translate(calc(100vw + 160px), 0) rotate(-2deg);
          }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   GloboView — globo premium con gloss, brillo y cuerda SVG
   ============================================================ */

function GloboView({
  globo,
  onPop,
}: {
  globo: Globo;
  onPop: (g: Globo, btn: HTMLButtonElement) => void;
}) {
  return (
    <button
      onClick={(e) => onPop(globo, e.currentTarget)}
      className={`absolute cursor-pointer select-none ${
        globo.popping
          ? "animate-[globo-pop-aaa_0.45s_cubic-bezier(0.22,1,0.36,1)_forwards]"
          : "animate-[globo-sway_3.2s_ease-in-out_infinite]"
      }`}
      style={{
        left: `${globo.x}px`,
        top: `${globo.y}px`,
        width: "96px",
        height: "132px",
        animationDelay: globo.popping ? undefined : `${globo.swayPhase}s`,
      }}
      aria-label={`Globo con sílaba ${globo.silaba}. Tocá para reventarlo.`}
    >
      {/* Halo de brillo ambiental */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 -z-10 rounded-full opacity-50 blur-xl"
        style={{
          background: `radial-gradient(circle, ${COLOR_GLOBO[globo.color]}66 0%, transparent 70%)`,
        }}
      />

      {/* Imagen del globo + marco glossy */}
      <div className="relative h-[100px] w-[96px]">
        <img
          src={MAPA_IMAGENES[globo.color]}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          style={{
            filter: `drop-shadow(0 5px 10px rgba(0,0,0,0.4)) saturate(1.15) brightness(1.05)`,
          }}
        />
        {/* Brillo glossy superior */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 32% 22%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.18) 22%, transparent 48%)",
            borderRadius: "50% 50% 45% 45% / 55% 55% 40% 40%",
          }}
        />
        {/* Reflejo inferior */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-2 h-6 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.55) 0%, transparent 70%)",
          }}
        />
        {/* Sílaba blanca gigante centrada */}
        <span
          className="font-display absolute inset-0 flex items-center justify-center pb-3 text-2xl font-bold tracking-wide text-white sm:text-[1.7rem]"
          style={{
            textShadow:
              "0 2px 4px rgba(0,0,0,0.85), 0 0 14px rgba(0,0,0,0.55), 0 -1px 0 rgba(255,255,255,0.18), 1px 1px 0 rgba(0,0,0,0.4)",
          }}
        >
          {globo.silaba}
        </span>
      </div>

      {/* Cuerda SVG curva animada */}
      <svg
        viewBox="0 0 20 32"
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1 left-1/2 h-8 w-5 -translate-x-1/2"
      >
        <path
          d="M10 0 Q 4 9, 10 16 Q 16 24, 10 32"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M10 0 Q 4 9, 10 16 Q 16 24, 10 32"
          fill="none"
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="0.8"
          strokeLinecap="round"
          transform="translate(1,0)"
        />
      </svg>

      {/* Onda de choque al explotar */}
      {globo.popping && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[50px] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white/85 animate-[shockwave_0.45s_ease-out_forwards]"
        />
      )}
    </button>
  );
}

/* ============================================================
   LED Syllable Display — cartel LED con sílabas
   ============================================================ */

function LedSyllableDisplay({
  palabra,
  silabaIndex,
  sacudiendo,
}: {
  palabra: PalabraEntry;
  silabaIndex: number;
  sacudiendo: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 border-emerald-400/40 bg-gradient-to-b from-emerald-950 to-slate-950 px-4 py-2.5 shadow-[0_0_30px_rgba(16,185,129,0.25)] sm:px-6 sm:py-3 ${
        sacudiendo ? "animate-[shake-aaa_0.4s_ease]" : ""
      }`}
    >
      {/* Patrón de puntos LED */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(110,231,183,0.7) 1px, transparent 1.5px)",
          backgroundSize: "8px 8px",
        }}
      />
      {/* Brillo superior */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-emerald-400/15 to-transparent"
      />

      <div className="relative">
        <div className="mb-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/70 sm:text-xs">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
            style={{ animation: "led-pulse 1.6s ease-in-out infinite" }}
          />
          Palabra Objetivo
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
            style={{ animation: "led-pulse 1.6s ease-in-out infinite" }}
          />
        </div>
        <div
          className="font-display flex flex-wrap items-center justify-center gap-1 text-2xl font-black sm:gap-1.5 sm:text-3xl"
          aria-live="polite"
        >
          {palabra.syllables.map((s, i) => {
            const done = i < silabaIndex;
            const current = i === silabaIndex;
            return (
              <Fragment key={i}>
                <span
                  className={`rounded-md px-2 py-0.5 transition-all duration-300 ${
                    done
                      ? "bg-emerald-500/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                      : current
                      ? "bg-amber-500/25 text-amber-200 shadow-[0_0_12px_rgba(252,211,77,0.55)] animate-pulse"
                      : "bg-white/5 text-white/90"
                  }`}
                  style={{
                    textShadow: done
                      ? "0 0 8px rgba(110,231,183,0.95)"
                      : current
                      ? "0 0 8px rgba(252,211,77,0.95)"
                      : "0 0 6px rgba(255,255,255,0.45)",
                  }}
                >
                  {done && "✓ "}
                  {s}
                </span>
                {i < palabra.syllables.length - 1 && (
                  <span className="text-emerald-400/50">-</span>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ProgressSilabas — glassmorphism con chips
   ============================================================ */

function ProgressSilabas({
  palabra,
  silabaIndex,
}: {
  palabra: PalabraEntry;
  silabaIndex: number;
}) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-md sm:px-4 sm:py-2.5">
      <div className="mb-1 text-center text-[10px] font-bold uppercase tracking-widest text-white/50">
        Progreso
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-sm font-bold sm:text-base">
        {palabra.syllables.map((s, i) => {
          const done = i < silabaIndex;
          const current = i === silabaIndex;
          return (
            <Fragment key={i}>
              <div
                className={`rounded-lg px-2 py-1 transition-all duration-300 ${
                  done
                    ? "bg-emerald-500/30 text-emerald-100 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : current
                    ? "bg-rose-500/30 text-rose-100 shadow-[0_0_8px_rgba(251,113,133,0.5)] animate-pulse"
                    : "bg-white/10 text-white/55"
                }`}
              >
                {done ? `✓ ${s}` : current ? `▶ ${s}` : "___"}
              </div>
              {i < palabra.syllables.length - 1 && (
                <span className="text-white/40">·</span>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   Componente principal
   ============================================================ */

interface CazadorSilabasProps {
  onSalir?: () => void;
}

export function CazadorSilabas({ onSalir: onSalirProp }: CazadorSilabasProps = {}) {
  const sfx = useGameAudio();

  const [estado, setEstado] = useState<Estado>("intro");
  const [resultado, setResultado] = useState<Resultado>("victoria");
  const [ronda, setRonda] = useState(1);
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(VIDAS_MAX);
  const [racha, setRacha] = useState(0);
  const [rachaMaxima, setRachaMaxima] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [palabraActual, setPalabraActual] = useState<PalabraEntry>(
    () => BANCO_PALABRAS[0]
  );
  const [silabaIndex, setSilabaIndex] = useState(0);
  const [globos, setGlobos] = useState<Globo[]>([]);
  const [sacudiendo, setSacudiendo] = useState(false);
  const [timerMs, setTimerMs] = useState(TIMER_MS);
  const [muted, setMuted] = useState(false);
  const [scores, setScores] = useState<FloatingScoreItem[]>([]);
  const [bursts, setBursts] = useState<(BurstConfig & { id: number })[]>([]);
  const [celebrandoPalabra, setCelebrandoPalabra] = useState(false);

  // Refs para loop / sincronización
  const areaRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const spawnRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const corriendoRef = useRef(true);
  const palabraActualRef = useRef(palabraActual);
  const silabaIndexRef = useRef(silabaIndex);
  const estadoRef = useRef<Estado>(estado);
  const rachaRef = useRef(0);
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const spawnCountRef = useRef(0);
  const lastTickSecRef = useRef(0);
  const mazoRef = useRef<PalabraEntry[]>(mezclar(BANCO_PALABRAS));
  const errorEnPalabraRef = useRef(false);

  palabraActualRef.current = palabraActual;
  silabaIndexRef.current = silabaIndex;
  estadoRef.current = estado;
  rachaRef.current = racha;

  /* ---------- helpers timeouts ---------- */
  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timeoutsRef.current.delete(id);
      fn();
    }, ms);
    timeoutsRef.current.add(id);
    return id;
  }, []);

  /* ---------- mute sync ---------- */
  useEffect(() => {
    sfx.setMuted(muted);
  }, [muted, sfx]);

  /* ---------- salir (delegado al Wrapper si no hay prop) ---------- */
  const handleSalir = useCallback(() => {
    if (onSalirProp) {
      onSalirProp();
      return;
    }
    if (typeof document !== "undefined") {
      const btn = document.querySelector<HTMLButtonElement>(
        'button[aria-label="Salir del minijuego y volver al inicio"]'
      );
      if (btn) btn.click();
    }
  }, [onSalirProp]);

  /* ---------- mute toggle ---------- */
  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      sfx.setMuted(next);
      if (!next) sfx.click();
      return next;
    });
  }, [sfx]);

  /* ---------- spawn globo ---------- */
  const spawnGlobo = useCallback(() => {
    if (!corriendoRef.current || !areaRef.current) return;
    if (estadoRef.current !== "jugando") return;
    const anchoArea = areaRef.current.offsetWidth;
    if (anchoArea === 0) return;

    spawnCountRef.current += 1;
    const silabasActuales = palabraActualRef.current.syllables;
    const idx = silabaIndexRef.current;
    let silaba: string;
    // Cada 3er spawn o 40% aleatorio → sílaba correcta
    if (
      idx < silabasActuales.length &&
      (spawnCountRef.current % 3 === 0 || Math.random() < 0.4)
    ) {
      silaba = silabasActuales[idx];
    } else {
      const rw =
        BANCO_PALABRAS[Math.floor(Math.random() * BANCO_PALABRAS.length)];
      silaba = rw.syllables[Math.floor(Math.random() * rw.syllables.length)];
    }

    const color = COLORES[Math.floor(Math.random() * COLORES.length)];
    const anchoGlobo = 96;
    const x = Math.max(8, Math.random() * (anchoArea - anchoGlobo - 8));
    const speed = 1.1 + Math.random() * 1.2;

    setGlobos((prev) => {
      // Cap máx de globos en pantalla
      if (prev.length > 9) return prev;
      return [
        ...prev,
        {
          id: ++globoIdCounter,
          silaba,
          x,
          y: areaRef.current!.offsetHeight + 10,
          speed,
          color,
          swayPhase: Math.random() * 3,
          hue: Math.random() * 20 - 10,
        },
      ];
    });
  }, []);

  /* ---------- loop de movimiento (rAF) ---------- */
  useEffect(() => {
    const mover = () => {
      if (!corriendoRef.current) return;
      setGlobos((prev) => {
        if (prev.length === 0) return prev;
        const altura = areaRef.current?.offsetHeight ?? 440;
        return prev
          .map((g) => ({ ...g, y: g.y - g.speed }))
          .filter((g) => g.y > -160 || g.popping);
      });
      animRef.current = requestAnimationFrame(mover);
    };
    animRef.current = requestAnimationFrame(mover);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  /* ---------- loop de spawn ---------- */
  useEffect(() => {
    corriendoRef.current = true;
    const tick = () => {
      spawnGlobo();
      spawnRef.current = setTimeout(tick, 1400);
    };
    spawnRef.current = setTimeout(tick, 600);
    return () => {
      corriendoRef.current = false;
      if (spawnRef.current) clearTimeout(spawnRef.current);
    };
  }, [spawnGlobo]);

  /* ---------- timer (setInterval 100ms) ---------- */
  useEffect(() => {
    if (estado !== "jugando") return;
    const id = setInterval(() => {
      setTimerMs((t) => Math.max(0, t - 100));
    }, 100);
    return () => clearInterval(id);
  }, [estado]);

  /* ---------- timer vencido ---------- */
  const handleTimeout = useCallback(() => {
    if (estadoRef.current !== "jugando") return;
    sfx.error();
    sfx.vibrate([20, 40, 20]);
    setRacha(0);
    errorEnPalabraRef.current = true;
    setSacudiendo(true);
    addTimeout(() => setSacudiendo(false), 400);

    const nuevasVidas = vidas - 1;
    setVidas(nuevasVidas);

    if (nuevasVidas <= 0) {
      addTimeout(() => {
        setResultado("derrota");
        setEstado("completado");
        corriendoRef.current = false;
      }, 600);
    } else {
      // nueva palabra
      addTimeout(() => avanzarPalabra(false), 350);
    }
  }, [vidas, sfx, addTimeout]);

  /* ---------- reacción a timer ---------- */
  useEffect(() => {
    if (estado !== "jugando") return;
    if (timerMs <= 0) {
      handleTimeout();
      return;
    }
    if (timerMs <= TIMER_LOW_MS) {
      const sec = Math.ceil(timerMs / 1000);
      if (sec !== lastTickSecRef.current) {
        lastTickSecRef.current = sec;
        sfx.tick();
      }
    }
  }, [timerMs, estado, handleTimeout, sfx]);

  /* ---------- añadir floating score ---------- */
  const addScore = useCallback(
    (xPct: number, yPct: number, text: string, color?: string, icon?: string) => {
      const id = nextScoreId();
      setScores((prev) => [
        ...prev,
        { id, x: xPct, y: yPct, text, color, icon },
      ]);
      addTimeout(() => {
        setScores((prev) => prev.filter((s) => s.id !== id));
      }, 1000);
    },
    [addTimeout]
  );

  /* ---------- añadir particle burst ---------- */
  const addBurst = useCallback(
    (x: number, y: number, color: ColorGlobo) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setBursts((prev) => [
        ...prev,
        {
          id,
          x,
          y,
          count: 18,
          colors: [COLOR_GLOBO[color], "#ffffff", "#fbbf24", "#22d3ee"],
          power: 1.25,
        },
      ]);
      addTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 1000);
    },
    [addTimeout]
  );

  /* ---------- avanzar a la siguiente palabra ---------- */
  const avanzarPalabra = useCallback(
    (correcto: boolean) => {
      const nuevaRonda = ronda + 1;
      const nuevaRacha = correcto && !errorEnPalabraRef.current ? racha + 1 : 0;
      const comboMult = Math.max(1, Math.min(nuevaRacha, COMBO_MAX));

      if (correcto && !errorEnPalabraRef.current) {
        // Bonus +30 por palabra perfecta
        setPuntos((p) => p + PUNTOS_PALABRA_PERFECT);
        setAciertos((a) => a + 1);
        // Score "¡+30 PALABRA!" centrado
        addScore(50, 35, `+${PUNTOS_PALABRA_PERFECT} PALABRA!`, "#34d399", "🎉");
        if (nuevaRacha >= 2) {
          addTimeout(() => {
            addScore(
              50,
              25,
              `¡Combo x${Math.min(nuevaRacha, COMBO_MAX)}!`,
              "#fb923c",
              "🔥"
            );
            sfx.combo(Math.min(nuevaRacha, COMBO_MAX));
          }, 350);
        }
      } else if (correcto) {
        // Completada con errores → bonus +20 normal
        setPuntos((p) => p + PUNTOS_PALABRA);
        addScore(50, 35, `+${PUNTOS_PALABRA} PALABRA!`, "#fbbf24", "🎉");
      }

      setRacha(nuevaRacha);
      setRachaMaxima((rm) => Math.max(rm, nuevaRacha));
      errorEnPalabraRef.current = false;
      setGlobos([]);
      setSilabaIndex(0);
      setTimerMs(TIMER_MS);
      lastTickSecRef.current = 0;
      setCelebrandoPalabra(false);

      // silencio de comboMult para evitar unused warning
      void comboMult;

      if (nuevaRonda > TOTAL_RONDAS) {
        addTimeout(() => {
          setResultado("victoria");
          setEstado("completado");
          sfx.victory();
          corriendoRef.current = false;
        }, 700);
      } else {
        setRonda(nuevaRonda);
        const idx = (nuevaRonda - 1) % mazoRef.current.length;
        setPalabraActual(mazoRef.current[idx]);
      }
    },
    [ronda, racha, sfx, addScore, addTimeout]
  );

  /* ---------- reventar globo ---------- */
  const reventarGlobo = useCallback(
    (globo: Globo, btn: HTMLButtonElement) => {
      if (globo.popping) return;
      if (estadoRef.current !== "jugando") return;
      if (celebrandoPalabra) return;

      sfx.pop();

      // marcar popping
      setGlobos((prev) =>
        prev.map((g) => (g.id === globo.id ? { ...g, popping: true } : g))
      );
      addTimeout(() => {
        setGlobos((prev) => prev.filter((g) => g.id !== globo.id));
      }, 450);

      // posiciones para efectos
      const rect = btn.getBoundingClientRect();
      const area = areaRef.current;
      const areaRect = area?.getBoundingClientRect();
      const xPct =
        areaRect && areaRect.width > 0
          ? ((rect.left + rect.width / 2 - areaRect.left) / areaRect.width) * 100
          : 50;
      const yPct =
        areaRect && areaRect.height > 0
          ? ((rect.top + rect.height / 2 - areaRect.top) / areaRect.height) * 100
          : 50;

      const esperada = palabraActual.syllables[silabaIndex];

      if (globo.silaba === esperada) {
        /* ACIERTO */
        const comboMult = Math.max(1, Math.min(racha, COMBO_MAX));
        const pts = PUNTOS_SILABA * comboMult;
        setPuntos((p) => p + pts);
        const nuevoIndex = silabaIndex + 1;
        setSilabaIndex(nuevoIndex);

        addBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, globo.color);
        addScore(xPct, yPct, `+${pts}`, comboMult >= 2 ? "#fb923c" : "#fbbf24");
        sfx.vibrate(30);

        if (nuevoIndex >= palabraActual.syllables.length) {
          /* ¡PALABRA COMPLETADA! */
          setCelebrandoPalabra(true);
          sfx.success();
          addTimeout(() => avanzarPalabra(true), 800);
        }
      } else {
        /* ERROR */
        const nuevasVidas = vidas - 1;
        setVidas(nuevasVidas);
        setRacha(0);
        errorEnPalabraRef.current = true;
        setSilabaIndex(0);
        setSacudiendo(true);
        sfx.error();
        sfx.vibrate([20, 40, 20]);

        addScore(xPct, yPct, "✗ ¡Ups!", "#f43f5e", "💔");

        addTimeout(() => setSacudiendo(false), 400);

        if (nuevasVidas <= 0) {
          addTimeout(() => {
            setResultado("derrota");
            setEstado("completado");
            corriendoRef.current = false;
          }, 700);
        }
      }
    },
    [
      palabraActual,
      silabaIndex,
      vidas,
      racha,
      sfx,
      addBurst,
      addScore,
      addTimeout,
      avanzarPalabra,
      celebrandoPalabra,
    ]
  );

  /* ---------- reiniciar palabra (opcional) ---------- */
  const reiniciarPalabra = useCallback(() => {
    if (estadoRef.current !== "jugando") return;
    sfx.click();
    setSilabaIndex(0);
    setGlobos([]);
    setSacudiendo(false);
    // No resetea timer ni racha: el costo es el tiempo
  }, [sfx]);

  /* ---------- iniciar juego ---------- */
  const iniciarJuego = useCallback(() => {
    sfx.click();
    sfx.vibrate(20);
    mazoRef.current = mezclar(BANCO_PALABRAS);
    setRonda(1);
    setPuntos(0);
    setVidas(VIDAS_MAX);
    setRacha(0);
    setRachaMaxima(0);
    setAciertos(0);
    setPalabraActual(mazoRef.current[0]);
    setSilabaIndex(0);
    setGlobos([]);
    setScores([]);
    setBursts([]);
    setTimerMs(TIMER_MS);
    setCelebrandoPalabra(false);
    errorEnPalabraRef.current = false;
    lastTickSecRef.current = 0;
    corriendoRef.current = true;
    setResultado("victoria");
    setEstado("jugando");
  }, [sfx]);

  /* ---------- reiniciar todo ---------- */
  const reiniciarJuego = useCallback(() => {
    sfx.click();
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current.clear();
    iniciarJuego();
  }, [sfx, iniciarJuego]);

  /* ---------- cleanup al desmontar ---------- */
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current.clear();
      corriendoRef.current = false;
    };
  }, []);

  /* ---------- pausar spawn/movimiento cuando no jugando ---------- */
  useEffect(() => {
    if (estado !== "jugando") {
      corriendoRef.current = false;
    } else {
      corriendoRef.current = true;
    }
  }, [estado]);

  /* ============================================================
     Render
     ============================================================ */

  /* ---------- INTRO ---------- */
  if (estado === "intro") {
    return (
      <GameShell theme="sky" onSalir={handleSalir}>
        <SkyScene />
        <div className="relative z-10">
          <GameIntro
            icono={
              <span className="text-7xl sm:text-8xl" role="img" aria-label="Globo">
                🎈
              </span>
            }
            titulo="Cazador de Sílabas"
            subtitulo="Reventá los globos en el orden correcto"
            descripcion="¡Mirá la palabra objetivo, esperá que suban los globos y reventalos en el orden correcto para formar la palabra!"
            pasos={[
              "Mirá la palabra objetivo separada en sílabas",
              "Esperá que suban los globos con las sílabas",
              "Tocalos en el ORDEN correcto de la palabra",
              "¡Completá la palabra antes de que se escapen!",
            ]}
            temaColor={TEMA_COLOR}
            onJugar={iniciarJuego}
          />
        </div>
      </GameShell>
    );
  }

  /* ---------- COMPLETADO ---------- */
  if (estado === "completado") {
    return (
      <GameShell theme="sky" onSalir={handleSalir}>
        <SkyScene />
        <GameOverlay
          tipo={resultado}
          titulo={
            resultado === "victoria"
              ? "¡Eres un Cazador de Sílabas!"
              : "¡Sigue practicando!"
          }
          subtitulo={
            resultado === "victoria"
              ? "Reventaste todos los globos correctamente 🎈"
              : "Se acabaron las vidas. ¡Volvé a intentarlo!"
          }
          stats={{
            puntos,
            rachaMaxima,
            aciertos,
            total: TOTAL_RONDAS,
          }}
          onReiniciar={reiniciarJuego}
          onSalir={handleSalir}
          temaColor={TEMA_COLOR}
        />
      </GameShell>
    );
  }

  /* ---------- JUGANDO ---------- */
  return (
    <GameShell theme="sky" onSalir={handleSalir}>
      <SkyScene />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-56px)] max-w-5xl flex-col">
        <GameHUD
          theme="language"
          nivel={ronda}
          totalNiveles={TOTAL_RONDAS}
          puntos={puntos}
          vidas={vidas}
          vidasMaximas={VIDAS_MAX}
          racha={racha}
          timerMs={timerMs}
          timerTotalMs={TIMER_MS}
          muted={muted}
          onToggleMute={toggleMute}
          icono={<span className="text-lg">🎈</span>}
        />

        {/* Palabra objetivo + progreso */}
        <div className="mx-auto w-full max-w-2xl space-y-2.5 px-3 py-3 sm:py-4">
          <LedSyllableDisplay
            palabra={palabraActual}
            silabaIndex={silabaIndex}
            sacudiendo={sacudiendo}
          />
          <ProgressSilabas palabra={palabraActual} silabaIndex={silabaIndex} />

          {/* Mensaje sutil */}
          <div
            className="text-center text-xs font-semibold text-white/60 sm:text-sm"
            aria-live="polite"
          >
            {celebrandoPalabra
              ? "🎉 ¡Palabra completada!"
              : sacudiendo
              ? "✗ Sílaba incorrecta. ¡Empezá de nuevo!"
              : "Tocá los globos en el orden correcto ↓"}
          </div>
        </div>

        {/* Área de juego */}
        <div
          ref={areaRef}
          className="relative mx-3 mb-3 flex-1 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-sky-400/10 via-cyan-300/5 to-sky-200/10 shadow-[inset_0_2px_30px_rgba(255,255,255,0.15)] backdrop-blur-sm sm:mx-4"
          style={{ minHeight: "380px" }}
        >
          {/* Suelo decorativo lejano */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-300/20 to-transparent"
          />

          {/* Globos */}
          {globos.map((globo) => (
            <GloboView
              key={globo.id}
              globo={globo}
              onPop={reventarGlobo}
            />
          ))}

          {/* Floating scores */}
          {scores.map((s) => (
            <FloatingScore key={s.id} item={s} />
          ))}

          {/* Indicador "esperá" si no hay globos */}
          {globos.length === 0 && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <div className="animate-pulse rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/70 backdrop-blur-sm">
                ¡Mirá los globos subir! 🎈
              </div>
            </div>
          )}
        </div>

        {/* Pie: botón reiniciar palabra */}
        <div className="mx-3 mb-3 flex items-center justify-between gap-2 sm:mx-4 sm:mb-4">
          <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 backdrop-blur-sm">
            Ronda <span className="font-black text-white">{ronda}</span>
            <span className="text-white/40"> / {TOTAL_RONDAS}</span>
          </div>
          <button
            onClick={reiniciarPalabra}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/75 backdrop-blur-sm transition hover:scale-105 hover:bg-white/10 active:scale-95"
            aria-label="Reiniciar la palabra actual sin perder puntos"
          >
            <span aria-hidden="true">↻</span>
            Reiniciar palabra
          </button>
        </div>
      </div>

      {/* Particle bursts (fixed positioning) */}
      {bursts.map((b) => (
        <ParticleBurst key={b.id} burst={b} />
      ))}

      {/* Estilos globales del componente */}
      <style jsx global>{`
        @keyframes globo-pop-aaa {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: scale(1.4) rotate(3deg);
            opacity: 0.9;
          }
          55% {
            transform: scale(0.5) rotate(-4deg);
            opacity: 0.55;
          }
          100% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
        }
        @keyframes globo-sway {
          0%,
          100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }
        @keyframes shockwave {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 1;
            border-width: 6px;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.4);
            opacity: 0;
            border-width: 1px;
          }
        }
        @keyframes shake-aaa {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          20% {
            transform: translateX(-10px) rotate(-1deg);
          }
          40% {
            transform: translateX(10px) rotate(1deg);
          }
          60% {
            transform: translateX(-8px) rotate(-0.5deg);
          }
          80% {
            transform: translateX(6px) rotate(0.5deg);
          }
        }
        @keyframes led-pulse {
          0%,
          100% {
            opacity: 1;
            box-shadow: 0 0 6px rgba(110, 231, 183, 0.8);
          }
          50% {
            opacity: 0.45;
            box-shadow: 0 0 2px rgba(110, 231, 183, 0.3);
          }
        }
      `}</style>
    </GameShell>
  );
}
