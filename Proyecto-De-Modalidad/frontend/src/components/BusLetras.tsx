"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Trophy,
  Users,
} from "lucide-react";
import { nivelesBus, type NivelBus } from "@/data/busLetras";
import { Confetti } from "@/components/Toasts";

/* ============================================================
   El Bus de las Letras — Minijuego educativo
   ------------------------------------------------------------
   Mecánica:
   1. Un bus escolar nicaragüense recorre una ruta. En cada parada
      espera un pasajero (avatar emoji) con una consigna de
      Lengua y Literatura (sujeto, predicado, pronombre, estructura
      del texto).
   2. Debajo del bus se muestran las palabras del enunciado como
      tarjetas clickeables (modo enunciado) o 4 pronombres como
      opciones (modo pronombres).
   3. El niño toca para seleccionar/deseleccionar palabras y luego
      presiona "¡Subir al bus!" para validar.
   4. Si la selección forma la palabra_correcta → celebración +
      confeti + el pasajero "se sube" al bus (animación).
   5. Si no coincide → feedback_error pedagógico y vuelve a
      seleccionando (manteniendo la selección para que ajuste).
   6. Avance por 10 niveles hasta "¡Conductor Experto!" 🏆.
   ============================================================ */

type Estado =
  | "presentacion"
  | "seleccionando"
  | "verificando"
  | "celebrando"
  | "completado";

const TOTAL_NIVELES = nivelesBus.length;

/* ----------------------- Helpers ----------------------- */

// Quita signos de puntuación de los extremos de un token.
function limpiar(token: string): string {
  return token
    .replace(/^[.,;:!¡¿()"']+/, "")
    .replace(/[.,;:!¡¿()"']+$/, "");
}

// Normaliza una frase para comparar (minúsculas, sin puntuación, sin dobles espacios).
function normalizar(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map(limpiar)
    .filter(Boolean)
    .join(" ");
}

// ¿Es un nivel de pronombres? (opciones múltiples, no enunciado)
function esNivelPronombres(tipo: NivelBus["tipo_ejercicio"]): boolean {
  return tipo === "pronombre_el_ella" || tipo === "pronombre_ellos_ellas";
}

// Tokeniza un enunciado en palabras (limpiando puntuación de los extremos).
function tokenizarEnunciado(enunciado: string): string[] {
  return enunciado
    .split(/\s+/)
    .map((t) => limpiar(t))
    .filter(Boolean);
}

// Fisher–Yates sin mutar el original.
function mezclar<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ----------------------- Palmeras decorativas ----------------------- */

function Palmera({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 140"
      aria-hidden
      className={className}
    >
      {/* Tronco */}
      <path
        d="M 38 140 Q 36 90 40 50 Q 42 30 44 18"
        stroke="#92400e"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Tronco segmentos */}
      <path d="M 36 120 L 44 120 M 36 100 L 44 100 M 37 80 L 45 80 M 38 60 L 46 60" stroke="#78350f" strokeWidth="1.5" />
      {/* Hojas */}
      <g fill="#16a34a" stroke="#15803d" strokeWidth="1">
        <path d="M 42 20 Q 10 5 0 25 Q 18 28 42 24 Z" />
        <path d="M 42 20 Q 74 5 80 25 Q 62 28 42 24 Z" />
        <path d="M 42 18 Q 30 -5 8 -2 Q 24 14 42 22 Z" />
        <path d="M 42 18 Q 54 -5 76 -2 Q 60 14 42 22 Z" />
        <path d="M 42 16 Q 42 -8 30 -10 Q 36 8 42 20 Z" />
        <path d="M 42 16 Q 42 -8 54 -10 Q 48 8 42 20 Z" />
      </g>
      {/* Cocos */}
      <circle cx="36" cy="26" r="3" fill="#92400e" />
      <circle cx="48" cy="28" r="3" fill="#92400e" />
    </svg>
  );
}

/* ----------------------- Letrero de parada ----------------------- */

function LetreroParada({ texto }: { texto: string }) {
  return (
    <div className="flex justify-center">
      <div className="relative inline-flex flex-col items-center">
        {/* Cartel */}
        <div className="rounded-xl border-4 border-rose-500 bg-white px-4 py-2 shadow-md sm:px-5 sm:py-2.5">
          <div className="flex items-center justify-center gap-1.5">
            <BusIcon size={13} className="text-rose-600" strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 sm:text-xs">
              Parada
            </span>
          </div>
          <p className="text-center text-sm font-bold leading-tight text-rose-950 sm:text-base">
            {texto}
          </p>
        </div>
        {/* Poste */}
        <div className="h-6 w-2 rounded-b bg-amber-700 sm:h-8" />
        <div className="h-2 w-5 rounded-full bg-amber-800/80" />
      </div>
    </div>
  );
}

/* ----------------------- Bus SVG ----------------------- */

function BusSVG({ completo }: { completo: boolean }) {
  return (
    <svg viewBox="0 0 360 200" className="w-full drop-shadow-lg" aria-hidden>
      {/* Sombra */}
      <ellipse cx="180" cy="188" rx="160" ry="7" fill="#000000" opacity="0.12" />

      {/* Caja de pasajeros (rose-200) */}
      <rect
        x="20"
        y="48"
        width="240"
        height="100"
        rx="14"
        fill={completo ? "#bbf7d0" : "#fecdd3"}
        stroke="#f43f5e"
        strokeWidth="3"
        style={{ transition: "fill 0.4s" }}
      />
      {/* Techo (rosa más oscuro) */}
      <rect x="20" y="48" width="240" height="14" rx="6" fill="#fb7185" opacity="0.6" />

      {/* Ventanas (teal-200) */}
      {[36, 92, 148, 204].map((x) => (
        <rect
          key={x}
          x={x}
          y="68"
          width="44"
          height="28"
          rx="5"
          fill="#99f6e4"
          stroke="#0d9488"
          strokeWidth="1.5"
        />
      ))}
      {/* Brillos de las ventanas */}
      {[36, 92, 148, 204].map((x) => (
        <rect key={`b-${x}`} x={x + 3} y="71" width="14" height="6" rx="2" fill="#ccfbf1" opacity="0.8" />
      ))}

      {/* Banda decorativa con texto ESCUELA */}
      <rect x="20" y="118" width="240" height="14" fill="#f43f5e" opacity="0.55" />
      <text
        x="140"
        y="129"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill="#fff"
        fontFamily="Fredoka, sans-serif"
        letterSpacing="2"
      >
        ESCUELA
      </text>

      {/* Cabina (amber-400) */}
      <path
        d="M 260 78 L 260 148 L 340 148 L 340 112 Q 340 78 305 78 Z"
        fill="#fbbf24"
        stroke="#d97706"
        strokeWidth="3"
      />
      {/* Parabrisas (teal-200) */}
      <path
        d="M 272 88 L 305 88 Q 330 88 330 112 L 330 116 L 272 116 Z"
        fill="#99f6e4"
        stroke="#0d9488"
        strokeWidth="1.5"
      />
      <rect x="278" y="92" width="20" height="8" rx="2" fill="#ccfbf1" opacity="0.7" />

      {/* Puerta de la cabina */}
      <line x1="298" y1="120" x2="298" y2="148" stroke="#d97706" strokeWidth="1.5" opacity="0.7" />
      <circle cx="305" cy="132" r="2.5" fill="#d97706" />

      {/* Faro delantero */}
      <circle cx="335" cy="140" r="4" fill="#fef08a" stroke="#d97706" strokeWidth="1" />

      {/* Ruedas */}
      <circle cx="80" cy="158" r="20" fill="#1f2937" />
      <circle cx="80" cy="158" r="8" fill="#9ca3af" />
      <circle cx="270" cy="158" r="20" fill="#1f2937" />
      <circle cx="270" cy="158" r="8" fill="#9ca3af" />

      {/* Check verde al completar */}
      {completo && (
        <g className="animate-bounce-in">
          <circle cx="180" cy="28" r="20" fill="#10b981" stroke="#047857" strokeWidth="2.5" />
          <path
            d="M 170 28 L 178 36 L 190 22"
            stroke="white"
            strokeWidth="3.5"
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

export function BusLetras() {
  const [nivelIdx, setNivelIdx] = useState(0);
  const [estado, setEstado] = useState<Estado>("presentacion");
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [pasajerosTransportados, setPasajerosTransportados] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

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

  const nivel = nivelesBus[nivelIdx];
  const esPronombres = esNivelPronombres(nivel.tipo_ejercicio);

  // Tokens del enunciado (memo por nivel)
  const tokensEnunciado = useMemo(
    () => tokenizarEnunciado(nivel.enunciado),
    [nivel],
  );

  // Opciones de pronombres mezcladas (memo por nivel)
  const opcionesPronombres = useMemo(
    () =>
      esPronombres
        ? mezclar([nivel.palabra_correcta, ...nivel.distractores])
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nivel.nivel],
  );

  /* ---- Transición: celebrando → siguiente nivel o completado ---- */
  useEffect(() => {
    if (estado !== "celebrando") return;
    const t = setTimeout(() => {
      if (nivelIdx + 1 >= TOTAL_NIVELES) {
        setEstado("completado");
      } else {
        setNivelIdx((n) => n + 1);
        setSeleccionadas([]);
        setFeedback(null);
        setEstado("presentacion");
      }
    }, 2800);
    return () => clearTimeout(t);
  }, [estado, nivelIdx]);

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
    // Modo enunciado: ordenar índices asc y unir tokens
    const frase = [...seleccionadas]
      .sort((a, b) => a - b)
      .map((i) => tokensEnunciado[i])
      .join(" ");
    return normalizar(frase) === normalizar(nivel.palabra_correcta);
  }, [seleccionadas, esPronombres, opcionesPronombres, nivel.palabra_correcta, tokensEnunciado]);

  /* ---- Acciones ---- */
  const empezar = useCallback(() => {
    setEstado("seleccionando");
    setFeedback(null);
  }, []);

  const toggleSeleccion = useCallback(
    (i: number) => {
      if (estado !== "seleccionando") return;
      setFeedback(null);
      if (esPronombres) {
        // En pronombres solo se permite 1 selección a la vez
        setSeleccionadas((p) => (p.includes(i) ? [] : [i]));
        return;
      }
      setSeleccionadas((p) =>
        p.includes(i) ? p.filter((x) => x !== i) : [...p, i],
      );
    },
    [estado, esPronombres],
  );

  const subirAlBus = useCallback(() => {
    if (estado !== "seleccionando") return;
    if (seleccionadas.length === 0) return;
    setEstado("verificando");
    const correcto = validar();
    programar(() => {
      if (correcto) {
        setPasajerosTransportados((v) => v + 1);
        setEstado("celebrando");
      } else {
        setFeedback(nivel.feedback_error);
        setEstado("seleccionando");
      }
    }, 550);
  }, [estado, seleccionadas.length, validar, nivel.feedback_error, programar]);

  const limpiarSeleccion = useCallback(() => {
    setSeleccionadas([]);
    setFeedback(null);
  }, []);

  const reiniciarJuego = useCallback(() => {
    setNivelIdx(0);
    setEstado("presentacion");
    setSeleccionadas([]);
    setPasajerosTransportados(0);
    setFeedback(null);
  }, []);

  /* ---- Derivados ---- */
  const progresoNivel = useMemo(
    () => ((nivelIdx + (estado === "celebrando" ? 1 : 0)) / TOTAL_NIVELES) * 100,
    [nivelIdx, estado],
  );
  const esPresentacion = estado === "presentacion";
  const esSeleccionando = estado === "seleccionando";
  const esVerificando = estado === "verificando";
  const esCelebrando = estado === "celebrando";
  const puedeSubir = esSeleccionando && seleccionadas.length > 0;

  /* ===================== RENDER ===================== */

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-br from-rose-100 via-amber-100 to-rose-200 font-display">
      {/* Cielo: sol y nubes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute right-6 top-8 h-16 w-16 rounded-full bg-amber-300 opacity-80 blur-sm sm:right-10 sm:top-12 sm:h-20 sm:w-20" />
        <div className="absolute right-12 top-10 h-12 w-12 rounded-full bg-amber-200 opacity-70 sm:right-16 sm:top-16 sm:h-14 sm:w-14" />
        <div className="absolute left-1/4 top-6 h-6 w-16 rounded-full bg-white/70 blur-[1px]" />
        <div className="absolute right-1/4 top-14 h-5 w-14 rounded-full bg-white/60 blur-[1px]" />
      </div>

      {/* Palmeras a los lados (solo desktop) */}
      <Palmera className="pointer-events-none absolute -left-2 bottom-2 z-0 hidden h-56 w-32 -rotate-6 opacity-90 sm:block lg:h-72 lg:w-40" />
      <Palmera className="pointer-events-none absolute -right-2 bottom-2 z-0 hidden h-56 w-32 rotate-6 opacity-90 sm:block lg:h-72 lg:w-40" />

      <div className="relative z-10 mx-auto max-w-5xl px-3 pb-6 pt-4 sm:px-5 sm:pt-6">
        {/* ===================== HUD superior ===================== */}
        <div className="mb-4 rounded-2xl border-2 border-rose-200 bg-white/70 p-3 shadow-md backdrop-blur sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-fuchsia-500 text-white shadow sm:h-11 sm:w-11">
                <BusIcon size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-rose-700/70">
                  El Bus de las Letras
                </p>
                <p className="text-base font-bold text-rose-950 sm:text-lg">
                  Nivel {nivel.nivel}{" "}
                  <span className="text-rose-600/60">de {TOTAL_NIVELES}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border-2 border-amber-300 bg-amber-50 px-3 py-1.5">
                <Users size={15} className="text-amber-700" strokeWidth={2.5} />
                <span className="text-sm font-bold text-amber-800">
                  {pasajerosTransportados}{" "}
                  <span className="hidden sm:inline">transportados</span>
                </span>
              </div>
            </div>
          </div>
          {/* Barra de progreso */}
          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-rose-200/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-400 to-amber-400 transition-all duration-700 ease-out"
              style={{ width: `${progresoNivel}%` }}
            />
          </div>
        </div>

        {/* ===================== Pantalla: completado ===================== */}
        {estado === "completado" ? (
          <PantallaCompletado
            onReiniciar={reiniciarJuego}
            pasajeros={pasajerosTransportados}
          />
        ) : esPresentacion ? (
          /* ===================== Pantalla: presentación ===================== */
          <div className="animate-bounce-in rounded-3xl border-2 border-rose-300 bg-white/85 p-6 text-center shadow-lg backdrop-blur sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
              Parada {nivel.nivel} de {TOTAL_NIVELES}
            </p>
            <h2 className="mt-1 flex items-center justify-center gap-1.5 text-2xl font-bold text-rose-950 sm:text-3xl">
              <MapPin size={22} className="text-rose-500" strokeWidth={2.5} />
              {nivel.parada}
            </h2>

            <div className="mx-auto my-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-rose-100 text-6xl shadow-inner sm:h-28 sm:w-28">
              {nivel.avatar_pasajero}
            </div>

            <p className="text-base font-bold text-rose-900 sm:text-lg">
              “¡Buenas! Vengo esperando el bus.”
            </p>
            <div className="mx-auto mt-3 max-w-md rounded-2xl border-2 border-rose-200 bg-rose-50 px-4 py-3">
              <p className="text-sm font-semibold text-rose-700 sm:text-base">
                <Sparkles size={14} className="mr-1 inline" strokeWidth={2.5} />
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
          <div className="grid gap-4 lg:grid-cols-2">
            {/* ============ Columna izquierda: escena (pasajero + bus) ============ */}
            <div className="flex flex-col gap-4">
              {/* Pasajero con bocadillo */}
              <div className="rounded-3xl border-2 border-rose-200 bg-white/85 p-4 shadow-lg backdrop-blur sm:p-5">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-rose-100 text-4xl shadow-inner transition-all duration-700 ease-out sm:h-20 sm:w-20 sm:text-5xl ${
                      esCelebrando
                        ? "translate-x-6 -translate-y-4 scale-50 opacity-0"
                        : ""
                    }`}
                    aria-label="Pasajero esperando el bus"
                  >
                    {nivel.avatar_pasajero}
                  </div>
                  <div className="relative flex-1 rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3 shadow-sm">
                    <div className="absolute -left-2 top-5 h-4 w-4 rotate-45 border-b-2 border-l-2 border-rose-300 bg-rose-50" />
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

              {/* Letrero de parada */}
              <LetreroParada texto={nivel.parada} />

              {/* Bus SVG */}
              <div className="rounded-3xl border-2 border-amber-300 bg-white/70 p-3 shadow-lg backdrop-blur sm:p-4">
                <BusSVG completo={esCelebrando} />
                <p className="mt-1 text-center text-xs font-semibold text-rose-700/70">
                  {esCelebrando
                    ? "¡Pasajero a bordo! 🎉"
                    : "Bus escolar esperando pasajeros…"}
                </p>
              </div>
            </div>

            {/* ============ Columna derecha: palabras + feedback + botones ============ */}
            <div className="flex flex-col gap-4">
              {/* Tarjetas de palabra (enunciado o pronombres) */}
              <div className="rounded-3xl border-2 border-rose-300 bg-white/85 p-4 shadow-lg backdrop-blur sm:p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-1.5 text-sm font-bold text-rose-950 sm:text-base">
                    <BookOpen size={16} className="text-rose-600" strokeWidth={2.5} />
                    {esPronombres ? "¿Qué pronombre usamos?" : "Oración del pasajero"}
                  </h3>
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                    {seleccionadas.length} selec.
                  </span>
                </div>

                {!esPronombres && (
                  <p className="mb-3 text-center text-xs font-semibold text-rose-700/80 sm:text-sm">
                    <Hand size={13} className="mr-1 inline" strokeWidth={2.5} />
                    Tocá la palabra (o palabras) correcta y luego{" "}
                    <b>“Subir al bus”</b>.
                  </p>
                )}
                {esPronombres && (
                  <p className="mb-3 text-center text-xs font-semibold text-rose-700/80 sm:text-sm">
                    <Hand size={13} className="mr-1 inline" strokeWidth={2.5} />
                    Elegí el pronombre correcto y luego{" "}
                    <b>“Subir al bus”</b>.
                  </p>
                )}

                {/* Lista de palabras / opciones */}
                {esPronombres ? (
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {opcionesPronombres.map((opcion, i) => {
                      const sel = seleccionadas.includes(i);
                      return (
                        <button
                          key={i}
                          onClick={() => toggleSeleccion(i)}
                          disabled={!esSeleccionando}
                          className={`select-none rounded-xl border-2 px-6 py-3 text-lg font-bold transition-all sm:text-xl ${
                            sel
                              ? "scale-[1.05] border-rose-500 bg-rose-100 text-rose-900 shadow-md"
                              : "border-rose-300 bg-white/90 text-rose-950 hover:border-rose-400 hover:bg-rose-50"
                          } ${esSeleccionando ? "cursor-pointer active:scale-95" : "cursor-default"}`}
                        >
                          {opcion}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {tokensEnunciado.map((palabra, i) => {
                      const sel = seleccionadas.includes(i);
                      return (
                        <button
                          key={i}
                          onClick={() => toggleSeleccion(i)}
                          disabled={!esSeleccionando}
                          className={`select-none rounded-xl border-2 px-3.5 py-2.5 text-base font-bold transition-all sm:px-4 sm:text-lg ${
                            sel
                              ? "scale-[1.05] border-rose-500 bg-rose-100 text-rose-900 shadow-md"
                              : "border-rose-300 bg-white/90 text-rose-950 hover:border-rose-400 hover:bg-rose-50"
                          } ${esSeleccionando ? "cursor-pointer active:scale-95" : "cursor-default"}`}
                        >
                          {palabra}
                        </button>
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
                <div className="animate-bounce-in rounded-2xl border-2 border-amber-300 bg-amber-50 px-4 py-3 shadow">
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
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-bold shadow-md transition active:scale-95 ${
                    puedeSubir
                      ? "bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white hover:scale-[1.02] hover:shadow-lg"
                      : "cursor-not-allowed bg-rose-200 text-rose-500/70"
                  }`}
                >
                  {esVerificando ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" strokeWidth={2.5} />{" "}
                      Revisando…
                    </>
                  ) : (
                    <>
                      <Check size={18} strokeWidth={2.5} /> ¡Subir al bus!
                    </>
                  )}
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
              <p className="mt-1 text-center text-2xl font-bold text-emerald-900 sm:text-3xl">
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
      {esCelebrando && <Confetti duracionMs={2800} cantidad={48} />}
    </div>
  );
}

/* ----------------------- Pantalla final ----------------------- */

function PantallaCompletado({
  onReiniciar,
  pasajeros,
}: {
  onReiniciar: () => void;
  pasajeros: number;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="animate-bounce-in rounded-3xl border-2 border-rose-300 bg-white/90 p-8 text-center shadow-2xl backdrop-blur">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-300 via-fuchsia-400 to-amber-400 shadow-lg">
          <Trophy size={52} className="animate-trophy-float text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-bold text-rose-950 sm:text-4xl">
          ¡Conductor Experto!
        </h2>
        <p className="mt-2 text-base font-semibold text-rose-700 sm:text-lg">
          Transportaste <span className="text-fuchsia-600">{pasajeros}</span>{" "}
          pasajeros con éxito en el bus escolar. 🎉
        </p>
        <p className="mt-1 text-sm font-medium text-rose-600/80">
          Aprendiste a identificar sujetos, predicados, pronombres y las partes
          de un cuento nicaragüense.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-3xl">
          <span>🧒</span>
          <span>👵</span>
          <span>🧑</span>
          <span>👨</span>
          <span>👩</span>
          <span>👧</span>
          <span>👫</span>
          <span>🧓</span>
          <span>🦊</span>
          <span>🐰</span>
          <span>🏆</span>
        </div>

        <button
          onClick={onReiniciar}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-fuchsia-500 py-3.5 text-base font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-95 sm:w-auto sm:px-8"
        >
          <RefreshCw size={18} strokeWidth={2.5} /> Jugar de nuevo
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
