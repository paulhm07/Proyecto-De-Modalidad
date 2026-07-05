"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Hand,
  Mail,
  Mailbox,
  RefreshCw,
  RotateCcw,
  Send,
  Sparkles,
  Stamp,
  TriangleAlert,
  Trophy,
  X,
} from "lucide-react";
import {
  cartasPorNivel,
  totalNivelesCarta,
  type Carta,
} from "@/data/cartaOrtografia";
import { Confetti } from "@/components/Toasts";

/* ============================================================
   La Carta Mal Enviada — Minijuego educativo
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
        como pista. El niño escribe la corrección y presiona "Corregir".
        Si coincide (case-insensitive, trim) → se sella con ✓ verde.
   5. Si la decisión o la corrección es incorrecta → se muestra
      feedback_error pedagógico y la carta queda abierta para reintentar.
   6. Cuando las 4 cartas del nivel están selladas → confeti y avanza
      al siguiente nivel.
   7. Al completar nivel 10 → "¡Cartero Experto!" 🏆.
   ============================================================ */

type Estado = "presentacion" | "jugando" | "celebrando" | "completado";

type EstadoCarta =
  | "sin_abrir"
  | "abierta"
  | "corrigiendo"
  | "sellada_correcta";

const TOTAL_NIVELES = totalNivelesCarta; // 10
const CARTAS_POR_NIVEL = 4;
const TOTAL_CARTAS = TOTAL_NIVELES * CARTAS_POR_NIVEL; // 40

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
// Comparamos texto_mostrado contra correccion_correcta (normalizado).
function cartaTieneError(c: Carta): boolean {
  return normalizar(c.texto_mostrado) !== normalizar(c.correccion_correcta);
}

/* ----------------------- Escena decorativa: estantes de sobres ----------------------- */

function EstanteSobres({ className }: { className?: string }) {
  // Tres filas de sobrecitos mini en un estante (decoración de oficina)
  const sobres = [
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 4, 5],
    [0, 1, 2, 3],
  ];
  return (
    <svg
      viewBox="0 0 220 120"
      aria-hidden
      className={className}
    >
      {[10, 50, 90].map((yTop, filaIdx) => (
        <g key={filaIdx}>
          {/* Estante (tabla marrón) */}
          <rect
            x="4"
            y={yTop + 22}
            width="212"
            height="4"
            fill="#92400e"
            opacity="0.55"
            rx="2"
          />
          {/* Sobres mini */}
          {sobres[filaIdx].map((_, i) => {
            const x = 12 + i * 40;
            return (
              <g key={i} transform={`translate(${x},${yTop})`}>
                <rect width="34" height="20" rx="2" fill="#fff7ed" stroke="#b45309" strokeWidth="1" />
                <path d="M 0 0 L 17 12 L 34 0 Z" fill="#f59e0b" opacity="0.85" />
                <rect x="24" y="3" width="7" height="7" rx="1" fill="#fcd34d" stroke="#b45309" strokeWidth="0.5" />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/* ----------------------- Sobre SVG ----------------------- */

interface SobreSVGProps {
  abierto: boolean;
  sellada: boolean;
  activa: boolean;
  index: number;
}

function SobreSVG({ abierto, sellada, activa, index }: SobreSVGProps) {
  return (
    <svg
      viewBox="0 0 120 90"
      className="w-full drop-shadow-md transition-all duration-300"
      aria-hidden
    >
      {/* Sombra */}
      <ellipse cx="60" cy="86" rx="50" ry="4" fill="#000000" opacity="0.1" />

      {/* Cuerpo del sobre (crema) */}
      <rect
        x="6"
        y="18"
        width="108"
        height="64"
        rx="6"
        fill={sellada ? "#d1fae5" : abierto ? "#fffbeb" : "#fff7ed"}
        stroke={sellada ? "#10b981" : "#92400e"}
        strokeWidth="2.5"
        style={{ transition: "fill 0.4s, stroke 0.4s" }}
      />

      {/* Línea de dirección */}
      {!abierto && !sellada && (
        <>
          <line x1="20" y1="42" x2="86" y2="42" stroke="#b45309" strokeWidth="1.2" opacity="0.5" strokeDasharray="3 3" />
          <line x1="20" y1="50" x2="72" y2="50" stroke="#b45309" strokeWidth="1.2" opacity="0.5" strokeDasharray="3 3" />
        </>
      )}

      {/* Solapa (amber-500) */}
      <path
        d={abierto || sellada ? "M 6 22 L 60 14 L 114 22" : "M 6 22 L 60 50 L 114 22 Z"}
        fill={sellada ? "#34d399" : "#f59e0b"}
        stroke={sellada ? "#047857" : "#b45309"}
        strokeWidth="2.5"
        strokeLinejoin="round"
        style={{ transition: "d 0.4s, fill 0.4s" }}
      />

      {/* Estampilla (cuadrado) */}
      <rect
        x="84"
        y="58"
        width="18"
        height="16"
        rx="2"
        fill={sellada ? "#a7f3d0" : "#fcd34d"}
        stroke={sellada ? "#047857" : "#b45309"}
        strokeWidth="1"
      />
      <text
        x="93"
        y="69"
        textAnchor="middle"
        fontSize="8"
        fontWeight="bold"
        fill={sellada ? "#047857" : "#92400e"}
        fontFamily="Fredoka, sans-serif"
      >
        NI
      </text>

      {/* Número de carta (esquina superior izquierda) */}
      <text
        x="14"
        y="32"
        fontSize="9"
        fontWeight="bold"
        fill="#92400e"
        fontFamily="Fredoka, sans-serif"
        opacity="0.6"
      >
        #{index + 1}
      </text>

      {/* Sello verde de "sellada" */}
      {sellada && (
        <g className="animate-bounce-in">
          <circle
            cx="60"
            cy="52"
            r="18"
            fill="#10b981"
            stroke="#047857"
            strokeWidth="2.5"
            opacity="0.92"
            transform="rotate(-12 60 52)"
          />
          <circle
            cx="60"
            cy="52"
            r="14"
            fill="none"
            stroke="#fff"
            strokeWidth="1.2"
            opacity="0.7"
            transform="rotate(-12 60 52)"
          />
          <path
            d="M 50 52 L 57 59 L 70 45"
            stroke="white"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="rotate(-12 60 52)"
          />
          <text
            x="60"
            y="78"
            textAnchor="middle"
            fontSize="6"
            fontWeight="bold"
            fill="#047857"
            fontFamily="Fredoka, sans-serif"
            letterSpacing="1"
          >
            ENVIADA
          </text>
        </g>
      )}

      {/* Pulso de "activa" (cuando está abierta o corrigiendo) */}
      {activa && !sellada && (
        <rect
          x="3"
          y="15"
          width="114"
          height="70"
          rx="8"
          fill="none"
          stroke="#f97316"
          strokeWidth="3"
          opacity="0.6"
          className="animate-pulse"
        />
      )}
    </svg>
  );
}

/* ----------------------- Buzón SVG (clásico cilíndrico rojo) ----------------------- */

function BuzonSVG({ contadorNivel }: { contadorNivel: number }) {
  const lleno = contadorNivel >= CARTAS_POR_NIVEL;
  return (
    <svg
      viewBox="0 0 120 160"
      className="w-full drop-shadow-lg"
      aria-hidden
    >
      {/* Sombra */}
      <ellipse cx="60" cy="152" rx="42" ry="5" fill="#000000" opacity="0.15" />

      {/* Poste */}
      <rect x="55" y="120" width="10" height="36" fill="#78350f" rx="2" />
      <rect x="52" y="155" width="16" height="4" fill="#451a03" rx="2" />

      {/* Cuerpo del buzón (cilindro rojo) */}
      <rect
        x="14"
        y="32"
        width="92"
        height="92"
        rx="8"
        fill={lleno ? "#16a34a" : "#dc2626"}
        stroke="#7f1d1d"
        strokeWidth="2.5"
        style={{ transition: "fill 0.5s" }}
      />
      {/* Techo semicilíndrico */}
      <path
        d="M 14 38 Q 60 6 106 38 Z"
        fill={lleno ? "#15803d" : "#b91c1c"}
        stroke="#7f1d1d"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Banda decorativa superior */}
      <rect x="14" y="36" width="92" height="6" fill="#7f1d1d" opacity="0.55" />

      {/* Ranura para cartas */}
      <rect
        x="32"
        y="46"
        width="56"
        height="6"
        rx="2"
        fill="#450a0a"
        opacity="0.85"
      />
      <text
        x="60"
        y="42"
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
        y="68"
        width="68"
        height="42"
        rx="4"
        fill="#fef3c7"
        stroke="#7f1d1d"
        strokeWidth="1.5"
        opacity="0.95"
      />
      {/* Cartitas dentro (proporcional a contadorNivel) */}
      {Array.from({ length: CARTAS_POR_NIVEL }).map((_, i) => (
        <g key={i}>
          <rect
            x={32 + i * 12}
            y={72 + (i % 2) * 3}
            width="18"
            height="32"
            rx="1.5"
            fill={i < contadorNivel ? "#10b981" : "#fcd34d"}
            stroke={i < contadorNivel ? "#047857" : "#b45309"}
            strokeWidth="1"
            style={{ transition: "fill 0.4s" }}
          />
          {i < contadorNivel && (
            <path
              d={`M ${32 + i * 12 + 2} ${74 + (i % 2) * 3} L ${41 + i * 12} ${82 + (i % 2) * 3} L ${50 + i * 12 - 2} ${74 + (i % 2) * 3}`}
              fill="#34d399"
              opacity="0.7"
            />
          )}
        </g>
      ))}

      {/* Tapita inferior */}
      <rect x="14" y="118" width="92" height="6" fill="#7f1d1d" opacity="0.55" />

      {/* Check verde cuando el buzón está lleno */}
      {lleno && (
        <g className="animate-bounce-in">
          <circle cx="60" cy="22" r="12" fill="#10b981" stroke="#047857" strokeWidth="2" />
          <path
            d="M 54 22 L 59 27 L 67 18"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
}

/* ----------------------- Componente principal ----------------------- */

interface CartaState {
  carta: Carta;
  estado: EstadoCarta;
  textoInput: string;
}

export function CartaOrtografia() {
  const [nivelIdx, setNivelIdx] = useState(0);
  const [estado, setEstado] = useState<Estado>("presentacion");
  const [cartasNivel, setCartasNivel] = useState<CartaState[]>([]);
  const [idxActiva, setIdxActiva] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [cartasEnviadasTotal, setCartasEnviadasTotal] = useState(0);

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

  // Cargar las 4 cartas del nivel actual al cambiar de nivel
  useEffect(() => {
    const cartas = cartasPorNivel(nivelIdx + 1);
    setCartasNivel(
      cartas.map((c) => ({
        carta: c,
        estado: "sin_abrir" as EstadoCarta,
        textoInput: "",
      })),
    );
    setIdxActiva(null);
    setFeedback(null);
  }, [nivelIdx]);

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
      } else {
        setNivelIdx((n) => n + 1);
        setEstado("presentacion");
      }
    }, 2400);
    return () => clearTimeout(t);
  }, [estado, nivelIdx]);

  // ¿Todas las cartas del nivel están selladas? → celebrar
  useEffect(() => {
    if (estado !== "jugando") return;
    if (cartasNivel.length === 0) return;
    if (selladasNivel === CARTAS_POR_NIVEL) {
      programar(() => setEstado("celebrando"), 400);
    }
  }, [selladasNivel, cartasNivel.length, estado, programar]);

  /* ---- Acciones ---- */

  const empezar = useCallback(() => {
    setEstado("jugando");
    setFeedback(null);
  }, []);

  const abrirCarta = useCallback(
    (i: number) => {
      if (estado !== "jugando") return;
      setCartasNivel((prev) =>
        prev.map((c, idx) => {
          if (idx === i) {
            if (c.estado === "sellada_correcta") return c;
            return { ...c, estado: "abierta" as EstadoCarta };
          }
          // Las demás se vuelven "sin_abrir" si estaban abiertas sin decisión
          if (c.estado === "abierta" || c.estado === "corrigiendo") {
            return { ...c, estado: "sin_abrir" as EstadoCarta };
          }
          return c;
        }),
      );
      setIdxActiva(i);
      setFeedback(null);
    },
    [estado],
  );

  const decidir = useCallback(
    (i: number, diceError: boolean) => {
      if (estado !== "jugando") return;
      const cartaObj = cartasNivel[i]?.carta;
      if (!cartaObj) return;
      const tieneError = cartaTieneError(cartaObj);

      if (diceError) {
        // El niño dice "✗ Tiene error"
        if (tieneError) {
          // Correcto: abrir formulario de corrección
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
          setFeedback(cartaObj.feedback_error);
        }
      } else {
        // El niño dice "✓ Está bien"
        if (!tieneError) {
          // Correcto: sellar
          setCartasNivel((prev) =>
            prev.map((c, idx) =>
              idx === i ? { ...c, estado: "sellada_correcta" as EstadoCarta } : c,
            ),
          );
          setCartasEnviadasTotal((v) => v + 1);
          setIdxActiva(null);
          setFeedback(null);
        } else {
          // Incorrecto: la carta sí tenía error
          setFeedback(cartaObj.feedback_error);
        }
      }
    },
    [estado, cartasNivel],
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
      const ok =
        normalizar(cs.textoInput) === normalizar(cs.carta.correccion_correcta);
      if (ok) {
        setCartasNivel((prev) =>
          prev.map((c, idx) =>
            idx === i ? { ...c, estado: "sellada_correcta" as EstadoCarta } : c,
          ),
        );
        setCartasEnviadasTotal((v) => v + 1);
        setIdxActiva(null);
        setFeedback(null);
      } else {
        setFeedback(cs.carta.feedback_error);
      }
    },
    [estado, cartasNivel],
  );

  const cancelarCorreccion = useCallback(
    (i: number) => {
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
    },
    [],
  );

  const reiniciarJuego = useCallback(() => {
    setNivelIdx(0);
    setEstado("presentacion");
    setCartasEnviadasTotal(0);
    setIdxActiva(null);
    setFeedback(null);
  }, []);

  /* ---- Derivados ---- */
  const progresoNivel = useMemo(
    () => ((nivelIdx + (estado === "celebrando" ? 1 : 0)) / TOTAL_NIVELES) * 100,
    [nivelIdx, estado],
  );
  const esPresentacion = estado === "presentacion";
  const esJugando = estado === "jugando";
  const esCelebrando = estado === "celebrando";
  const cartaActiva = idxActiva !== null ? cartasNivel[idxActiva] : null;

  /* ===================== RENDER ===================== */

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-br from-amber-100 via-orange-100 to-orange-200 font-display">
      {/* Decoración: estantes con sobres en la parte superior (oficina de cartero) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Sol suave */}
        <div className="absolute right-6 top-6 h-14 w-14 rounded-full bg-amber-300 opacity-60 blur-sm sm:right-10 sm:top-10 sm:h-16 sm:w-16" />
        {/* Estantes */}
        <EstanteSobres className="absolute left-2 top-2 hidden h-24 w-44 opacity-40 sm:block" />
        <EstanteSobres className="absolute right-2 top-2 hidden h-24 w-44 opacity-40 sm:block" />
        {/* Mesa de cartero */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-800/15 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-3 pb-6 pt-4 sm:px-5 sm:pt-6">
        {/* ===================== HUD superior ===================== */}
        <div className="mb-4 rounded-2xl border-2 border-amber-300 bg-white/75 p-3 shadow-md backdrop-blur sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow sm:h-11 sm:w-11">
                <Mail size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700/70">
                  La Carta Mal Enviada
                </p>
                <p className="text-base font-bold text-amber-950 sm:text-lg">
                  Nivel {nivel}{" "}
                  <span className="text-amber-700/60">de {TOTAL_NIVELES}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border-2 border-rose-300 bg-rose-50 px-3 py-1.5">
                <Send size={15} className="text-rose-700" strokeWidth={2.5} />
                <span className="text-sm font-bold text-rose-800">
                  {cartasEnviadasTotal}
                  <span className="hidden sm:inline">/{TOTAL_CARTAS}</span>
                  <span className="ml-1 hidden sm:inline">enviadas</span>
                </span>
              </div>
            </div>
          </div>
          {/* Barra de progreso */}
          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-amber-200/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-all duration-700 ease-out"
              style={{ width: `${progresoNivel}%` }}
            />
          </div>
        </div>

        {/* ===================== Pantalla: completado ===================== */}
        {estado === "completado" ? (
          <PantallaCompletado
            onReiniciar={reiniciarJuego}
            enviadas={cartasEnviadasTotal}
          />
        ) : esPresentacion ? (
          /* ===================== Pantalla: presentación ===================== */
          <div className="animate-bounce-in rounded-3xl border-2 border-amber-300 bg-white/85 p-6 text-center shadow-lg backdrop-blur sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Oficina de correos · Nivel {nivel} de {TOTAL_NIVELES}
            </p>
            <h2 className="mt-1 flex items-center justify-center gap-1.5 text-2xl font-bold text-amber-950 sm:text-3xl">
              <Mailbox size={22} className="text-rose-600" strokeWidth={2.5} />
              ¡Cartero, hay cartas para revisar!
            </h2>

            <div className="mx-auto my-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-200 text-6xl shadow-inner sm:h-28 sm:w-28">
              📮
            </div>

            <p className="text-base font-bold text-amber-900 sm:text-lg">
              Llegaron <span className="text-orange-600">{CARTAS_POR_NIVEL}</span>{" "}
              cartas a la oficina.
            </p>
            <div className="mx-auto mt-3 max-w-md rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-sm font-semibold text-amber-800 sm:text-base">
                <Sparkles size={14} className="mr-1 inline" strokeWidth={2.5} />
                Abrí cada sobre, leé con cuidado y decidí: ¿está bien o tiene
                error? Si hay error, corregilo antes de enviarlo al buzón.
              </p>
            </div>

            <button
              onClick={empezar}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-base font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-95 sm:w-auto sm:px-10"
            >
              <Mail size={18} strokeWidth={2.5} /> ¡Abrir primera carta!
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          /* ===================== Pantalla: jugando / celebrando ===================== */
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            {/* ============ Columna principal: cartas y formulario ============ */}
            <div className="flex flex-col gap-4">
              {/* Fila de 4 sobres */}
              <div className="rounded-3xl border-2 border-amber-300 bg-white/80 p-4 shadow-lg backdrop-blur sm:p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-sm font-bold text-amber-950 sm:text-base">
                    <Mail size={16} className="text-amber-600" strokeWidth={2.5} />
                    Sobres del nivel
                  </h3>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
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
                        onClick={() => abrirCarta(i)}
                        disabled={sellada || !esJugando}
                        aria-label={
                          sellada
                            ? `Carta ${i + 1} sellada y enviada`
                            : `Abrir carta ${i + 1}`
                        }
                        className={`group relative flex flex-col items-center rounded-2xl border-2 p-2 transition-all ${
                          sellada
                            ? "cursor-default border-emerald-400 bg-emerald-50"
                            : activa
                              ? "border-orange-500 bg-orange-50 ring-2 ring-orange-300"
                              : "border-amber-200 bg-amber-50/60 hover:border-orange-400 hover:bg-orange-50/70"
                        } ${esJugando && !sellada ? "cursor-pointer active:scale-95" : ""}`}
                      >
                        <SobreSVG
                          abierto={abierta}
                          sellada={sellada}
                          activa={activa}
                          index={i}
                        />
                        <p
                          className={`mt-1 text-[10px] font-bold uppercase tracking-wide sm:text-xs ${
                            sellada ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {sellada
                            ? "✓ Enviada"
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
                <div className="animate-bounce-in rounded-3xl border-2 border-amber-300 bg-white/90 p-4 shadow-lg backdrop-blur sm:p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                      Carta {cartaActiva.carta.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700/70">
                      {etiquetaTipo(cartaActiva.carta)}
                    </span>
                  </div>

                  {/* Hoja de papel con el texto */}
                  <div className="relative rounded-xl border border-amber-200 bg-white px-4 py-5 shadow-inner sm:px-6 sm:py-6">
                    {/* Líneas de cuaderno */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-xl opacity-30"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(transparent, transparent 27px, #fbbf24 27px, #fbbf24 28px)",
                      }}
                    />
                    {/* Margen rojo */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-7 top-0 bottom-0 w-px bg-rose-300 opacity-50 sm:left-9"
                    />
                    <p className="relative text-lg font-semibold leading-8 text-amber-950 sm:text-xl sm:leading-9">
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
                        <button
                          onClick={() => decidir(idxActiva ?? 0, false)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-emerald-400 bg-emerald-50 py-3.5 text-base font-bold text-emerald-800 shadow-sm transition hover:scale-[1.02] hover:bg-emerald-100 active:scale-95 sm:text-lg"
                        >
                          <Check size={20} strokeWidth={2.5} /> Está bien
                        </button>
                        <button
                          onClick={() => decidir(idxActiva ?? 0, true)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-rose-400 bg-rose-50 py-3.5 text-base font-bold text-rose-800 shadow-sm transition hover:scale-[1.02] hover:bg-rose-100 active:scale-95 sm:text-lg"
                        >
                          <X size={20} strokeWidth={2.5} /> Tiene error
                        </button>
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
                        className="mt-2 w-full rounded-2xl border-2 border-amber-300 bg-white px-4 py-3 text-base font-semibold text-amber-950 shadow-inner outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 sm:text-lg"
                        placeholder="Escribí aquí la corrección…"
                      />

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => corregir(idxActiva ?? 0)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-base font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-95 sm:text-lg"
                        >
                          <Check size={20} strokeWidth={2.5} /> Corregir
                        </button>
                        <button
                          onClick={() => cancelarCorreccion(idxActiva ?? 0)}
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
                <div className="rounded-3xl border-2 border-dashed border-amber-300 bg-white/70 p-6 text-center backdrop-blur">
                  <p className="flex items-center justify-center gap-2 text-sm font-bold text-amber-800 sm:text-base">
                    <Hand size={16} strokeWidth={2.5} />
                    Tocá un sobre arriba para abrir esa carta.
                  </p>
                </div>
              )}

              {/* Feedback de error */}
              {feedback && esJugando && (
                <div className="animate-bounce-in rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-3 shadow">
                  <p className="flex items-start gap-2 text-sm font-semibold text-amber-900">
                    <TriangleAlert
                      size={18}
                      className="mt-0.5 shrink-0 text-amber-600"
                      strokeWidth={2.5}
                    />
                    <span>{feedback}</span>
                  </p>
                </div>
              )}
            </div>

            {/* ============ Columna derecha: buzón ============ */}
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border-2 border-rose-300 bg-white/80 p-3 shadow-lg backdrop-blur sm:p-4">
                <h3 className="mb-2 flex items-center justify-center gap-1.5 text-sm font-bold text-rose-900 sm:text-base">
                  <Mailbox size={16} className="text-rose-600" strokeWidth={2.5} />
                  Buzón de enviadas
                </h3>
                <BuzonSVG contadorNivel={selladasNivel} />
                <p className="mt-2 text-center text-xs font-semibold text-rose-800 sm:text-sm">
                  {selladasNivel}/{CARTAS_POR_NIVEL} cartas selladas este nivel
                </p>
                <p className="mt-0.5 text-center text-[11px] font-bold text-amber-700/80">
                  Total: {cartasEnviadasTotal}/{TOTAL_CARTAS}
                </p>
              </div>

              {/* Tip pedagógico */}
              <div className="hidden rounded-3xl border-2 border-amber-200 bg-white/70 p-3 backdrop-blur lg:block">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                  💡 Tip del cartero
                </p>
                <p className="mt-1 text-xs font-semibold text-amber-900">
                  No todas las cartas tienen error. Leé con calma antes de
                  decidir. ¡Cuidado con las trampas!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Overlay de celebración entre niveles */}
        {esCelebrando && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-start justify-center pt-24 sm:pt-32">
            <div className="animate-bounce-in rounded-3xl border-2 border-emerald-300 bg-white/95 px-6 py-4 shadow-2xl">
              <p className="text-center text-sm font-bold uppercase tracking-wide text-emerald-700">
                ¡Nivel {nivel} completado!
              </p>
              <p className="mt-1 text-center text-2xl font-bold text-emerald-900 sm:text-3xl">
                {CARTAS_POR_NIVEL} cartas selladas 🎉
              </p>
              <p className="mt-1 text-center text-xs font-semibold text-emerald-700 sm:text-sm">
                {nivelIdx + 1 < TOTAL_NIVELES
                  ? `Vamos al nivel ${nivel + 1}…`
                  : "¡Último nivel completado!"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confeti al celebrar */}
      {esCelebrando && <Confetti duracionMs={2400} cantidad={48} />}
    </div>
  );
}

/* ----------------------- Etiqueta legible del tipo de error ----------------------- */

function etiquetaTipo(c: Carta): string {
  if (c.tipo_error === "uso_b_v") return "Uso de b y v";
  if (c.tipo_error === "clasificacion_acentos") return "Acentos";
  if (c.tipo_error === "signos_apertura") return "Signos ¡ ¿";
  return "Ortografía";
}

/* ----------------------- Pantalla final ----------------------- */

function PantallaCompletado({
  onReiniciar,
  enviadas,
}: {
  onReiniciar: () => void;
  enviadas: number;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="animate-bounce-in rounded-3xl border-2 border-amber-300 bg-white/90 p-8 text-center shadow-2xl backdrop-blur">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 shadow-lg">
          <Trophy
            size={52}
            className="animate-trophy-float text-white"
            strokeWidth={2.5}
          />
        </div>
        <h2 className="text-3xl font-bold text-amber-950 sm:text-4xl">
          ¡Cartero Experto!
        </h2>
        <p className="mt-2 text-base font-semibold text-amber-700 sm:text-lg">
          Enviaste <span className="text-orange-600">{enviadas}</span> cartas
          con éxito desde la oficina de correos. 🎉
        </p>
        <p className="mt-1 text-sm font-medium text-amber-600/80">
          Aprendiste a corregir errores de <b>b/v</b>, <b>acentos</b> (agudas,
          graves, esdrújulas) y <b>signos de apertura</b> ¡ ¿ en español
          nicaragüense.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-3xl">
          <span>✉️</span>
          <span>📮</span>
          <span>✉️</span>
          <span>📬</span>
          <span>✉️</span>
          <span>📭</span>
          <span>✉️</span>
          <span>📮</span>
          <span>✉️</span>
          <span>🏆</span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 px-3 py-3">
            <CheckCircle2
              size={20}
              className="mx-auto text-emerald-600"
              strokeWidth={2.5}
            />
            <p className="mt-1 text-xs font-bold text-amber-800">
              Cartas enviadas
            </p>
            <p className="font-display text-lg font-bold text-amber-900">
              {enviadas}/{TOTAL_CARTAS}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 px-3 py-3">
            <Mail
              size={20}
              className="mx-auto text-orange-600"
              strokeWidth={2.5}
            />
            <p className="mt-1 text-xs font-bold text-orange-800">Niveles</p>
            <p className="font-display text-lg font-bold text-orange-900">
              {TOTAL_NIVELES}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 px-3 py-3">
            <Stamp size={20} className="mx-auto text-rose-600" strokeWidth={2.5} />
            <p className="mt-1 text-xs font-bold text-rose-800">Selladas</p>
            <p className="font-display text-lg font-bold text-rose-900">
              {TOTAL_CARTAS}
            </p>
          </div>
        </div>

        <button
          onClick={onReiniciar}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-base font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-95 sm:w-auto sm:px-8"
        >
          <RefreshCw size={18} strokeWidth={2.5} /> Jugar de nuevo
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
