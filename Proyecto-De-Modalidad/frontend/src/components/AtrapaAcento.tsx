"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Flame,
  RefreshCw,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";
import { desafiosAtrapa, type DesafioAtrapa } from "@/data/atrapaAcento";
import { Confetti } from "@/components/Toasts";

/* ============================================================
   Atrapa el Acento — Minijuego educativo de ritmo ortográfico
   ------------------------------------------------------------
   Mecánica:
   1. Aparece una palabra incompleta (silabeada, sin tilde) en
      el centro de la pantalla. La sílaba tónica está resaltada
      con bg-rose-200 + una flecha ↓ que indica "aquí va la tilde".
   2. Tres "burbujas" redondas con vocales con tilde flotan por
      la pantalla rebotando en los bordes (animación rAF tipo
      Pong). Una es la correcta; dos son distractores.
   3. El niño debe tocar la burbuja correcta antes de que se
      acabe el tiempo (5 s por palabra).
   4. Acierto → la burbuja "explota" + 10 puntos, "¡Atrapada! 🎉",
      auto-avance en 1.2 s.
   5. Error → la burbuja tocada tiembla, -3 puntos, se muestra
      la regla ortográfica en un callout ámbar; se permite
      reintentar (no avanza).
   6. Tiempo agotado → se muestra la palabra completa con la
      tilde resaltada en verde, +0 puntos, auto-avance en 1.5 s.
   7. Al completar los 20 desafíos → "¡Atrapa-Tilde Maestro!" 🏆.
   ============================================================ */

type Estado =
  | "presentacion"
  | "jugando"
  | "acertando"
  | "fallando"
  | "tiempo_agotado"
  | "completado";

interface Burbuja {
  id: number;
  vocal: string;
  esCorrecta: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  temblando: boolean;
}

const TOTAL_DESAFIOS = desafiosAtrapa.length; // 20
const TIEMPO_POR_PALABRA = 5; // segundos
const DURACION_ACERTAR_MS = 1200;
const DURACION_FALLAR_MS = 1500;
const DURACION_TIEMPO_AGOTADO_MS = 1500;

// Paleta cálida para las burbujas (todas las de un mismo desafío
// usan el MISMO color → no hay pista visual de cuál es la correcta).
const PALETA_BURBUJAS = [
  "from-amber-300 to-orange-400",
  "from-rose-300 to-fuchsia-400",
  "from-orange-300 to-rose-400",
  "from-fuchsia-300 to-amber-300",
  "from-violet-300 to-fuchsia-400",
];

// Partículas de la explosión al atrapar la burbuja correcta.
const PARTICULAS_DIRS = [
  { dx: 0, dy: -1 },
  { dx: 0.7, dy: -0.7 },
  { dx: 1, dy: 0 },
  { dx: 0.7, dy: 0.7 },
  { dx: 0, dy: 1 },
  { dx: -0.7, dy: 0.7 },
  { dx: -1, dy: 0 },
  { dx: -0.7, dy: -0.7 },
];

/* ----------------------- Helpers de audio ----------------------- */

// Pasa a minúsculas antes de hablar: el campo audio_guia tiene la
// sílaba tónica en MAYÚSCULAS como anotación de diseño, pero
// SpeechSynthesis no interpreta mayúsculas como énfasis.
function normalizarAudioGuia(texto: string): string {
  return texto.toLowerCase();
}

function hablar(texto: string) {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(normalizarAudioGuia(texto));
    u.lang = "es-ES";
    u.rate = 0.85;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  } catch {
    /* noop */
  }
}

function silenciar() {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* noop */
  }
}

/* ----------------------- Helpers de layout ----------------------- */

function slotAX(
  slot: "izquierda" | "centro" | "derecha",
  ancho: number,
  size: number,
): number {
  if (slot === "izquierda") return Math.max(8, ancho * 0.12);
  if (slot === "centro") return Math.max(8, ancho * 0.5 - size / 2);
  return Math.max(8, ancho * 0.88 - size);
}

function slotBY(slotIdx: number, alto: number, size: number): number {
  // Tres filas virtuales para espaciar las burbujas al iniciar.
  const filas = [alto * 0.18, alto * 0.45, alto * 0.72];
  const f = filas[slotIdx % filas.length];
  return Math.min(Math.max(8, f), Math.max(8, alto - size - 8));
}

function elegir<T>(arr: T[], n: number): T[] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, n);
}

function shuffleThree<T>(arr: [T, T, T]): [T, T, T] {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return [copia[0], copia[1], copia[2]];
}

function shuffleTwo<T>(arr: [T, T]): [T, T] {
  return Math.random() < 0.5 ? [arr[0], arr[1]] : [arr[1], arr[0]];
}

/* ----------------------- Componente principal ----------------------- */

export function AtrapaAcento() {
  // --- Estado del juego ---
  const [estado, setEstado] = useState<Estado>("presentacion");
  const [idxDesafio, setIdxDesafio] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [errores, setErrores] = useState(0);
  const [streak, setStreak] = useState(0);
  const [streakMax, setStreakMax] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_POR_PALABRA);
  const [burbujas, setBurbujas] = useState<Burbuja[]>([]);
  const [colorBurbujas, setColorBurbujas] = useState(PALETA_BURBUJAS[0]);
  const [reglaVisible, setReglaVisible] = useState(false);
  const [idxBurbujaAtrapada, setIdxBurbujaAtrapada] = useState<number | null>(null);
  const [idxBurbujaFallida, setIdxBurbujaFallida] = useState<number | null>(null);

  // Ref espejo de tiempoRestante para poder leer el valor actual dentro
  // del callback del interval sin reiniciar el effect.
  const tiempoRestanteRef = useRef(TIEMPO_POR_PALABRA);

  const containerRef = useRef<HTMLDivElement>(null);
  const dimsRef = useRef({ w: 800, h: 420 });
  const [esDesktop, setEsDesktop] = useState(false);
  const bubbleSize = esDesktop ? 96 : 80;

  // Set de timeouts para limpieza segura al desmontar.
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
      silenciar();
    };
  }, []);

  // Mantener dimsRef sincronizado con el tamaño real del contenedor
  // para que el rAF loop siempre lea el valor más reciente.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      if (!e) return;
      const w = Math.max(200, Math.floor(e.contentRect.width));
      const h = Math.max(200, Math.floor(e.contentRect.height));
      dimsRef.current = { w, h };
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Detectar breakpoint sm (≥640px) para escoger tamaño de burbuja.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = () => setEsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const desafio: DesafioAtrapa | null = desafiosAtrapa[idxDesafio] ?? null;

  /* ----------------------- Carga de un desafío ----------------------- */

  const cargarDesafio = useCallback(
    (idx: number) => {
      const d = desafiosAtrapa[idx];
      if (!d) return;
      const { w, h } = dimsRef.current;
      const size = window.matchMedia("(min-width: 640px)").matches ? 96 : 80;

      // Construir las 3 vocales (correcta + 2 distractores) en orden
      // aleatorio, y repartir las 3 slots horizontales (izq/centro/der)
      // entre ellas. La correcta arranca en el slot indicado por
      // d.posicion_x; las otras dos toman los slots restantes.
      const slotsRestantes = (
        ["izquierda", "centro", "derecha"] as const
      ).filter((s) => s !== d.posicion_x);
      const [s1, s2] = shuffleTwo([slotsRestantes[0], slotsRestantes[1]]);
      const vocalesSlots: { vocal: string; esCorrecta: boolean; slot: "izquierda" | "centro" | "derecha" }[] = [
        { vocal: d.letra_con_tilde_correcta, esCorrecta: true, slot: d.posicion_x },
        { vocal: d.distractores[0], esCorrecta: false, slot: s1 },
        { vocal: d.distractores[1], esCorrecta: false, slot: s2 },
      ];
      const orden = shuffleThree([0, 1, 2] as [0, 1, 2]);
      const nuevasBurbujas: Burbuja[] = orden.map((slotIdx, i) => {
        const v = vocalesSlots[slotIdx];
        // Velocidades aleatorias pero direcciones distintas.
        // Magnitud base ~110 px/s, modulada por la velocidad del nivel
        // (aumenta ligeramente cada 5 palabras).
        const boost = 1 + Math.floor(idx / 5) * 0.12;
        const speed = (95 + Math.random() * 45) * boost;
        // Ángulo distinto por índice para que no se muevan en grupo.
        const angulos = [
          (Math.PI / 4) + (Math.random() - 0.5) * 0.6, // ↘
          (3 * Math.PI / 4) + (Math.random() - 0.5) * 0.6, // ↙
          -Math.PI / 4 + (Math.random() - 0.5) * 0.6, // ↗
        ];
        const ang = angulos[i % angulos.length];
        return {
          id: i,
          vocal: v.vocal,
          esCorrecta: v.esCorrecta,
          x: slotAX(v.slot, w, size),
          y: slotBY(i, h, size),
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          temblando: false,
        };
      });

      setBurbujas(nuevasBurbujas);
      setColorBurbujas(elegir(PALETA_BURBUJAS, 1)[0]);
      tiempoRestanteRef.current = TIEMPO_POR_PALABRA;
      setTiempoRestante(TIEMPO_POR_PALABRA);
      setReglaVisible(false);
      setIdxBurbujaAtrapada(null);
      setIdxBurbujaFallida(null);
      setEstado("jugando");

      // Reproducir automáticamente el audio guía al iniciar.
      hablar(d.audio_guia);
    },
    [],
  );

  /* ----------------------- Loop de animación de burbujas (rAF) ----------------------- */

  useEffect(() => {
    if (
      estado !== "jugando" &&
      estado !== "fallando" &&
      estado !== "acertando"
    ) {
      return;
    }
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(50, now - last) / 1000;
      last = now;
      const { w, h } = dimsRef.current;
      const size = window.matchMedia("(min-width: 640px)").matches ? 96 : 80;
      const maxX = Math.max(0, w - size);
      const maxY = Math.max(0, h - size);
      setBurbujas((prev) =>
        prev.map((b) => {
          if (estado === "acertando" && b.id === idxBurbujaAtrapada) {
            // La burbuja atrapada se queda quieta (luego "explota").
            return b;
          }
          let { x, y, vx, vy } = b;
          x += vx * dt;
          y += vy * dt;
          if (x < 0) {
            x = 0;
            vx = -vx;
          } else if (x > maxX) {
            x = maxX;
            vx = -vx;
          }
          if (y < 0) {
            y = 0;
            vy = -vy;
          } else if (y > maxY) {
            y = maxY;
            vy = -vy;
          }
          return { ...b, x, y, vx, vy };
        }),
      );
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [estado, idxBurbujaAtrapada]);

  /* ----------------------- Timer (5s por palabra) ----------------------- */
  // Solo corre en 'jugando'. Se pausa durante 'fallando' y 'acertando'.
  // La transición a 'tiempo_agotado' se dispara DENTRO del callback del
  // interval (no en un effect body) para evitar renders en cascada.

  useEffect(() => {
    if (estado !== "jugando") return;
    const id = setInterval(() => {
      const next = Math.max(0, tiempoRestanteRef.current - 0.1);
      tiempoRestanteRef.current = next;
      setTiempoRestante(next);
      if (next <= 0) {
        // Tiempo agotado: transición directa desde el callback.
        setStreak(0);
        setEstado("tiempo_agotado");
      }
    }, 100);
    return () => clearInterval(id);
  }, [estado]);

  /* ----------------------- Transiciones de estado ----------------------- */

  // acertando → siguiente desafío (o completado) tras 1.2s
  useEffect(() => {
    if (estado !== "acertando") return;
    const t = setTimeout(() => {
      if (idxDesafio + 1 >= TOTAL_DESAFIOS) {
        setEstado("completado");
        silenciar();
      } else {
        setIdxDesafio((i) => i + 1);
      }
    }, DURACION_ACERTAR_MS);
    return () => clearTimeout(t);
  }, [estado, idxDesafio]);

  // tiempo_agotado → siguiente desafío (o completado) tras 1.5s
  useEffect(() => {
    if (estado !== "tiempo_agotado") return;
    const t = setTimeout(() => {
      if (idxDesafio + 1 >= TOTAL_DESAFIOS) {
        setEstado("completado");
        silenciar();
      } else {
        setIdxDesafio((i) => i + 1);
      }
    }, DURACION_TIEMPO_AGOTADO_MS);
    return () => clearTimeout(t);
  }, [estado, idxDesafio]);

  // fallando → vuelve a jugando tras 1.5s (no avanza)
  useEffect(() => {
    if (estado !== "fallando") return;
    const t = setTimeout(() => {
      setIdxBurbujaFallida(null);
      setReglaVisible(false);
      setEstado("jugando");
    }, DURACION_FALLAR_MS);
    return () => clearTimeout(t);
  }, [estado]);

  // Cuando idxDesafio cambia (excepto al iniciar en presentacion), cargar
  // automáticamente el siguiente desafío.
  // NOTA: NO incluir `estado` en las dependencias, porque eso dispararía
  // `cargarDesafio` en cada transición de estado (acertando→jugando,
  // fallando→jugando) y reiniciaría el desafío actual, impidiendo el avance.
  // Solo nos interesa reaccionar al cambio de `idxDesafio`.
  useEffect(() => {
    if (estado === "presentacion" || estado === "completado") return;
    cargarDesafio(idxDesafio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idxDesafio]);

  /* ----------------------- Acciones ----------------------- */

  const empezar = useCallback(() => {
    setIdxDesafio(0);
    setPuntos(0);
    setAciertos(0);
    setErrores(0);
    setStreak(0);
    setStreakMax(0);
    cargarDesafio(0);
  }, [cargarDesafio]);

  const manejarToque = useCallback(
    (b: Burbuja) => {
      if (estado !== "jugando" && estado !== "fallando") return;
      if (b.esCorrecta) {
        // ¡Acierto!
        setIdxBurbujaAtrapada(b.id);
        setEstado("acertando");
        setPuntos((p) => p + 10);
        setAciertos((a) => a + 1);
        setStreak((s) => {
          const ns = s + 1;
          setStreakMax((m) => Math.max(m, ns));
          return ns;
        });
        setReglaVisible(false);
        setIdxBurbujaFallida(null);
      } else {
        // Error: la burbuja tocada tiembla.
        setIdxBurbujaFallida(b.id);
        setEstado("fallando");
        setPuntos((p) => Math.max(0, p - 3));
        setErrores((e) => e + 1);
        setStreak(0);
        setReglaVisible(true);
      }
    },
    [estado],
  );

  const reiniciar = useCallback(() => {
    silenciar();
    setEstado("presentacion");
    setIdxDesafio(0);
    setBurbujas([]);
    setPuntos(0);
    setAciertos(0);
    setErrores(0);
    setStreak(0);
    setStreakMax(0);
    setReglaVisible(false);
    setIdxBurbujaAtrapada(null);
    setIdxBurbujaFallida(null);
    tiempoRestanteRef.current = TIEMPO_POR_PALABRA;
    setTiempoRestante(TIEMPO_POR_PALABRA);
  }, []);

  const escuchar = useCallback(() => {
    if (desafio) hablar(desafio.audio_guia);
  }, [desafio]);

  /* ----------------------- Derivados de render ----------------------- */

  const porcentajeTiempo = (tiempoRestante / TIEMPO_POR_PALABRA) * 100;
  const colorBarraTiempo =
    porcentajeTiempo > 50
      ? "from-emerald-400 to-teal-400"
      : porcentajeTiempo > 25
        ? "from-amber-400 to-orange-400"
        : "from-rose-400 to-red-400";

  const silabasPalabra = useMemo(() => {
    if (!desafio) return [] as { texto: string; tonica: boolean }[];
    return desafio.palabra_incompleta.split("-").map((s, i, arr) => {
      // silaba_tonica: 1=última, 2=penúltima, 3=antepenúltima.
      const tonicaIdxDesdeElFinal = desafio.silaba_tonica;
      const idxTonica = arr.length - tonicaIdxDesdeElFinal;
      return { texto: s, tonica: i === idxTonica };
    });
  }, [desafio]);

  const silabasPalabraCompleta = useMemo(() => {
    if (!desafio) return null;
    // Mostrar la palabra completa con la tilde resaltada en verde.
    // Resaltamos el primer carácter acentuado que aparezca.
    const palabra = desafio.palabra_completa;
    const idxTilde = Array.from(palabra).findIndex((c) =>
      "áéíóúÁÉÍÓÚ".includes(c),
    );
    return { palabra, idxTilde };
  }, [desafio]);

  /* ===================== RENDER ===================== */

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-br from-amber-100 via-orange-200 to-rose-200 font-display">
      {/* ---------------- Fondos decorativos: "cielo de vocales" ---------------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Sol suave */}
        <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-amber-300 opacity-70 blur-sm sm:right-8 sm:top-8 sm:h-20 sm:w-20" />
        {/* Nubes difuminadas */}
        <div className="absolute left-[8%] top-[14%] h-20 w-44 rounded-full bg-white/55 blur-2xl" />
        <div className="absolute right-[10%] top-[28%] h-16 w-36 rounded-full bg-white/45 blur-2xl" />
        <div className="absolute left-[20%] bottom-[18%] h-20 w-48 rounded-full bg-white/40 blur-2xl" />
        <div className="absolute right-[18%] bottom-[10%] h-16 w-40 rounded-full bg-white/45 blur-2xl" />
        {/* Vocales gigantes decorativas flotando */}
        <span className="absolute left-[6%] top-[40%] select-none text-7xl font-bold text-rose-300/30 animate-float">á</span>
        <span className="absolute right-[8%] top-[55%] select-none text-6xl font-bold text-amber-300/30 animate-float" style={{ animationDelay: "1.2s" }}>é</span>
        <span className="absolute left-[40%] top-[8%] select-none text-5xl font-bold text-fuchsia-300/30 animate-float" style={{ animationDelay: "0.6s" }}>í</span>
        <span className="absolute right-[35%] bottom-[6%] select-none text-7xl font-bold text-orange-300/30 animate-float" style={{ animationDelay: "1.8s" }}>ó</span>
        <span className="absolute left-[55%] bottom-[30%] select-none text-6xl font-bold text-violet-300/30 animate-float" style={{ animationDelay: "2.4s" }}>ú</span>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl flex-col px-3 pb-6 pt-4 sm:px-5 sm:pt-6">
        {/* ===================== HUD superior ===================== */}
        <div className="mb-4 rounded-2xl border-2 border-fuchsia-300 bg-white/80 p-3 shadow-md backdrop-blur sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white shadow sm:h-11 sm:w-11">
                <Target size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-fuchsia-700/80">
                  Atrapa el Acento
                </p>
                <p className="text-base font-bold text-fuchsia-950 sm:text-lg">
                  Palabra {Math.min(idxDesafio + 1, TOTAL_DESAFIOS)}{" "}
                  <span className="text-fuchsia-700/60">de {TOTAL_DESAFIOS}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Puntos */}
              <div className="flex items-center gap-1.5 rounded-full border-2 border-amber-300 bg-amber-50 px-3 py-1.5">
                <Sparkles size={15} className="text-amber-600" strokeWidth={2.5} />
                <span className="text-sm font-bold text-amber-900">{puntos}</span>
              </div>
              {/* Racha */}
              <div className="flex items-center gap-1.5 rounded-full border-2 border-orange-300 bg-orange-50 px-3 py-1.5">
                {streak >= 3 ? (
                  <Flame size={15} className="text-orange-500" strokeWidth={2.5} />
                ) : (
                  <Zap size={15} className="text-orange-400" strokeWidth={2.5} />
                )}
                <span className="text-sm font-bold text-orange-900">
                  {streak}
                  <span className="ml-1 hidden text-xs font-semibold text-orange-700/70 sm:inline">
                    racha
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Barra de tiempo (solo visible mientras se juega o se muestra feedback) */}
          {(estado === "jugando" ||
            estado === "fallando" ||
            estado === "acertando" ||
            estado === "tiempo_agotado") && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs font-bold text-fuchsia-900/80">
                <span className="flex items-center gap-1">
                  <Timer size={12} strokeWidth={2.5} /> Tiempo
                </span>
                <span>{Math.ceil(tiempoRestante)}s</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-fuchsia-100">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${colorBarraTiempo} transition-all duration-100 ease-linear`}
                  style={{ width: `${porcentajeTiempo}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ===================== Pantalla: presentación ===================== */}
        {estado === "presentacion" ? (
          <Presentacion onEmpezar={empezar} />
        ) : estado === "completado" ? (
          /* ===================== Pantalla: completado ===================== */
          <PantallaCompletado
            puntos={puntos}
            aciertos={aciertos}
            errores={errores}
            streakMax={streakMax}
            onReiniciar={reiniciar}
          />
        ) : (
          /* ===================== Pantalla: jugando / feedback ===================== */
          desafio && (
            <div className="flex flex-1 flex-col gap-4">
              {/* Palabra central */}
              <div className="rounded-3xl border-2 border-fuchsia-200 bg-white/85 p-4 text-center shadow-lg backdrop-blur sm:p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-fuchsia-700">
                  {desafio.clasificacion} · ¿Dónde va la tilde?
                </p>
                <div className="mt-3 flex flex-wrap items-end justify-center gap-2 sm:gap-3">
                  {silabasPalabra.map((s, i) => (
                    <div key={i} className="flex flex-col items-center">
                      {s.tonica && (
                        <span className="mb-0.5 text-2xl font-bold text-rose-500 sm:text-3xl" aria-hidden>
                          ↓
                        </span>
                      )}
                      {!s.tonica && (
                        <span className="mb-0.5 h-7 sm:h-9" aria-hidden />
                      )}
                      <span
                        className={`rounded-xl px-3 py-1 text-5xl font-bold leading-none sm:text-6xl ${
                          s.tonica
                            ? "bg-rose-200 text-slate-800 shadow-inner"
                            : "text-slate-800"
                        }`}
                        style={
                          s.tonica
                            ? { borderBottom: "4px solid #f43f5e" }
                            : undefined
                        }
                      >
                        {s.texto}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm font-semibold text-fuchsia-900/80 sm:text-base">
                  <Target
                    size={14}
                    className="mr-1 inline"
                    strokeWidth={2.5}
                  />
                  Tocá la burbuja con la vocal que lleva tilde.
                </p>
              </div>

              {/* Campo de juego con burbujas flotantes */}
              <div
                ref={containerRef}
                className="relative flex-1 overflow-hidden rounded-3xl border-2 border-fuchsia-200 bg-white/40 shadow-inner backdrop-blur-sm"
                style={{ minHeight: "320px" }}
              >
                {/* Burbujas */}
                {(estado === "jugando" ||
                  estado === "fallando" ||
                  estado === "acertando") &&
                  burbujas.map((b) => {
                    const esAtrapada =
                      estado === "acertando" && b.id === idxBurbujaAtrapada;
                    const esFallida =
                      estado === "fallando" && b.id === idxBurbujaFallida;
                    return (
                      <button
                        key={b.id}
                        onClick={() => manejarToque(b)}
                        disabled={
                          estado === "acertando" ||
                          esAtrapada
                        }
                        aria-label={ariaVocal(b.vocal)}
                        className={`absolute flex items-center justify-center rounded-full border-4 border-white bg-gradient-to-br ${colorBurbujas} font-bold text-white shadow-lg transition-transform duration-75 active:scale-95 ${esAtrapada ? "pointer-events-none animate-pop-burst" : ""} ${esFallida ? "animate-burbuja-tiembla" : ""} hover:scale-105`}
                        style={{
                          left: `${b.x}px`,
                          top: `${b.y}px`,
                          width: `${bubbleSize}px`,
                          height: `${bubbleSize}px`,
                          fontSize: esDesktop ? "3.25rem" : "2.5rem",
                          touchAction: "manipulation",
                          textShadow: "0 2px 4px rgba(0,0,0,0.25)",
                          boxShadow:
                            "0 6px 16px -4px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.5)",
                        }}
                      >
                        {b.vocal}
                        {/* Partículas de explosión si fue atrapada */}
                        {esAtrapada && (
                          <>
                            {PARTICULAS_DIRS.map((p, i) => (
                              <span
                                key={i}
                                aria-hidden
                                className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-white shadow"
                                style={{
                                  "--dx": `${p.dx * 60}px`,
                                  "--dy": `${p.dy * 60}px`,
                                  animation: `particulaVolar 0.6s ease-out forwards`,
                                  animationDelay: `${i * 0.02}s`,
                                } as React.CSSProperties}
                              />
                            ))}
                          </>
                        )}
                      </button>
                    );
                  })}

                {/* Overlay: ¡Atrapada! 🎉 */}
                {estado === "acertando" && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="animate-bounce-in rounded-3xl border-2 border-emerald-300 bg-white/95 px-6 py-4 shadow-2xl">
                      <p className="text-center text-2xl font-bold text-emerald-700 sm:text-3xl">
                        ¡Atrapada! 🎉
                      </p>
                      <p className="mt-1 text-center text-sm font-semibold text-emerald-700/80 sm:text-base">
                        +10 puntos
                      </p>
                    </div>
                  </div>
                )}

                {/* Overlay: tiempo agotado — muestra palabra completa */}
                {estado === "tiempo_agotado" && silabasPalabraCompleta && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-bounce-in rounded-3xl border-2 border-rose-300 bg-white/95 px-6 py-5 text-center shadow-2xl">
                      <p className="text-xs font-bold uppercase tracking-wide text-rose-700">
                        Se acabó el tiempo
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">
                        {Array.from(silabasPalabraCompleta.palabra).map((c, i) => (
                          <span
                            key={i}
                            className={
                              i === silabasPalabraCompleta.idxTilde
                                ? "rounded-md bg-emerald-200 px-1 text-emerald-800 shadow-inner"
                                : ""
                            }
                          >
                            {c}
                          </span>
                        ))}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-rose-700/80">
                        Así se escribe con tilde. ¡A la próxima!
                      </p>
                    </div>
                  </div>
                )}

                {/* Callout: regla ortográfica al fallar */}
                {estado === "fallando" && reglaVisible && (
                  <div className="absolute left-1/2 top-3 w-[92%] max-w-md -translate-x-1/2">
                    <div className="animate-bounce-in rounded-2xl border-2 border-amber-300 bg-amber-50/95 px-4 py-3 shadow-xl backdrop-blur">
                      <p className="flex items-start gap-2 text-sm font-semibold text-amber-900 sm:text-base">
                        <BookOpen
                          size={16}
                          className="mt-0.5 shrink-0 text-amber-600"
                          strokeWidth={2.5}
                        />
                        <span>
                          <span className="font-bold text-amber-700">
                            Regla:{" "}
                          </span>
                          {desafio.regla}
                        </span>
                      </p>
                      <p className="mt-1 text-xs font-bold text-rose-700">
                        -3 puntos · ¡Intentá de nuevo!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón escuchar (esquina inferior izquierda del área de juego) */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={escuchar}
                  className="flex items-center gap-2 rounded-2xl border-2 border-fuchsia-400 bg-white/90 px-4 py-3 text-base font-bold text-fuchsia-800 shadow-md transition hover:scale-[1.02] hover:bg-fuchsia-50 active:scale-95 sm:text-lg"
                  aria-label={`Escuchar cómo se pronuncia ${desafio.palabra_completa}`}
                >
                  <Volume2 size={20} strokeWidth={2.5} />
                  <span>🔊 Escuchar</span>
                </button>
                <div className="rounded-2xl border-2 border-fuchsia-200 bg-white/70 px-3 py-2 text-right text-xs font-bold text-fuchsia-900 sm:text-sm">
                  <p>
                    Aciertos:{" "}
                    <span className="text-emerald-700">{aciertos}</span>
                    {" · "}
                    <span className="text-rose-700">{errores} errores</span>
                  </p>
                  <p className="text-fuchsia-700/70">
                    Racha máxima: {streakMax} 🔥
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Confeti al atrapar la última burbuja correcta (transición a completado) */}
      {estado === "completado" && <Confetti duracionMs={3000} cantidad={64} />}

      {/* Estilos inline para keyframes de partículas y animaciones de burbuja */}
      <style>{`
        @keyframes particulaVolar {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% {
            transform: translate(var(--dx), var(--dy)) scale(0.3);
            opacity: 0;
          }
        }
        @keyframes popBurst {
          0% { transform: scale(1); opacity: 1; }
          40% { transform: scale(1.5); opacity: 0.9; }
          100% { transform: scale(0); opacity: 0; }
        }
        .animate-pop-burst {
          animation: popBurst 0.55s ease-out forwards;
        }
        @keyframes burbujaTiembla {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px) rotate(-3deg); }
          40% { transform: translateX(6px) rotate(3deg); }
          60% { transform: translateX(-5px) rotate(-2deg); }
          80% { transform: translateX(5px) rotate(2deg); }
        }
        .animate-burbuja-tiembla {
          animation: burbujaTiembla 0.45s ease-in-out;
        }
      `}</style>
    </div>
  );
}

/* ----------------------- Aria helper ----------------------- */

function ariaVocal(v: string): string {
  // Describe la vocal: "é con tilde" o "a sin tilde".
  const conTilde = "áéíóú".includes(v.toLowerCase());
  const base = v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (conTilde) return `Vocal ${v} con tilde`;
  return `Vocal ${v} sin tilde (base ${base})`;
}

/* ----------------------- Pantalla de presentación ----------------------- */

function Presentacion({ onEmpezar }: { onEmpezar: () => void }) {
  return (
    <div className="animate-bounce-in mx-auto max-w-2xl rounded-3xl border-2 border-fuchsia-300 bg-white/85 p-6 text-center shadow-lg backdrop-blur sm:p-8">
      <p className="text-xs font-bold uppercase tracking-wider text-fuchsia-700">
        Ritmo y velocidad ortográfica · 3er grado
      </p>
      <h2 className="mt-1 flex items-center justify-center gap-2 text-2xl font-bold text-fuchsia-950 sm:text-3xl">
        <Target size={24} className="text-fuchsia-600" strokeWidth={2.5} />
        ¡Atrapa el Acento!
      </h2>

      <div className="mx-auto my-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-300 via-violet-400 to-amber-300 text-6xl shadow-inner sm:h-28 sm:w-28">
        🎯
      </div>

      <p className="text-base font-bold text-fuchsia-900 sm:text-lg">
        Las vocales con tilde <span className="text-fuchsia-600">flotan</span> por
        la pantalla.
      </p>
      <div className="mx-auto mt-3 max-w-md rounded-2xl border-2 border-fuchsia-200 bg-fuchsia-50 px-4 py-3 text-left">
        <ul className="space-y-1.5 text-sm font-semibold text-fuchsia-900 sm:text-base">
          <li className="flex items-start gap-2">
            <span className="text-fuchsia-500">▸</span>
            <span>
              Mirá la palabra del centro: la sílaba con la flecha ↓ es la que
              lleva tilde.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-fuchsia-500">▸</span>
            <span>
              Tocá rápido la burbuja con la vocal correcta antes de que se
              acabe el tiempo.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-fuchsia-500">▸</span>
            <span>
              Si te equivocás, te mostramos la regla. ¡Seguí intentando!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-fuchsia-500">▸</span>
            <span>
              Poné el sonido 🔊 para escuchar la palabra bien despacio.
            </span>
          </li>
        </ul>
      </div>

      <p className="mt-4 text-sm font-bold text-fuchsia-700/80">
        {TOTAL_DESAFIOS} palabras · Agudas, Graves y Esdrújulas
      </p>

      <button
        onClick={onEmpezar}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-amber-500 py-3.5 text-base font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-95 sm:w-auto sm:px-10"
      >
        <Target size={18} strokeWidth={2.5} /> ¡Atrapar!
        <ArrowRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ----------------------- Pantalla final ----------------------- */

function PantallaCompletado({
  puntos,
  aciertos,
  errores,
  streakMax,
  onReiniciar,
}: {
  puntos: number;
  aciertos: number;
  errores: number;
  streakMax: number;
  onReiniciar: () => void;
}) {
  const porcentaje = Math.round((aciertos / TOTAL_DESAFIOS) * 100);
  return (
    <div className="mx-auto max-w-2xl">
      <div className="animate-bounce-in rounded-3xl border-2 border-fuchsia-300 bg-white/90 p-8 text-center shadow-2xl backdrop-blur">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-300 via-violet-400 to-amber-300 shadow-lg">
          <Trophy
            size={52}
            className="animate-trophy-float text-white"
            strokeWidth={2.5}
          />
        </div>
        <h2 className="text-3xl font-bold text-fuchsia-950 sm:text-4xl">
          ¡Atrapa-Tilde Maestro!
        </h2>
        <p className="mt-2 text-base font-semibold text-fuchsia-700 sm:text-lg">
          Atrapaste <span className="text-fuchsia-600">{aciertos}</span> de{" "}
          {TOTAL_DESAFIOS} tildes. 🎉
        </p>
        <p className="mt-1 text-sm font-medium text-fuchsia-600/80">
          Aprendiste a reconocer <b>agudas</b>, <b>graves</b> y{" "}
          <b>esdrújulas</b> del español nicaragüense.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-3xl">
          <span>🎯</span>
          <span>á</span>
          <span>é</span>
          <span>í</span>
          <span>ó</span>
          <span>ú</span>
          <span>🏆</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard
            label="Puntos"
            value={puntos}
            icon={<Sparkles size={18} className="text-amber-600" strokeWidth={2.5} />}
            border="border-amber-200"
            bg="bg-amber-50"
            text="text-amber-900"
          />
          <StatCard
            label="Aciertos"
            value={`${aciertos}/${TOTAL_DESAFIOS}`}
            icon={<Target size={18} className="text-emerald-600" strokeWidth={2.5} />}
            border="border-emerald-200"
            bg="bg-emerald-50"
            text="text-emerald-900"
          />
          <StatCard
            label="Errores"
            value={errores}
            icon={<BookOpen size={18} className="text-rose-600" strokeWidth={2.5} />}
            border="border-rose-200"
            bg="bg-rose-50"
            text="text-rose-900"
          />
          <StatCard
            label="Racha máxima"
            value={`${streakMax} 🔥`}
            icon={<Flame size={18} className="text-orange-500" strokeWidth={2.5} />}
            border="border-orange-200"
            bg="bg-orange-50"
            text="text-orange-900"
          />
        </div>

        <p className="mt-4 text-sm font-bold text-fuchsia-700">
          Precisión: {porcentaje}%
        </p>

        <button
          onClick={onReiniciar}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-amber-500 py-3.5 text-base font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-95 sm:w-auto sm:px-8"
        >
          <RefreshCw size={18} strokeWidth={2.5} /> Jugar de nuevo
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  border,
  bg,
  text,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  border: string;
  bg: string;
  text: string;
}) {
  return (
    <div className={`rounded-2xl border-2 ${border} ${bg} px-3 py-3`}>
      <div className="flex items-center justify-center">{icon}</div>
      <p className="mt-1 text-xs font-bold text-fuchsia-700/80">{label}</p>
      <p className={`font-display text-lg font-bold ${text}`}>{value}</p>
    </div>
  );
}
