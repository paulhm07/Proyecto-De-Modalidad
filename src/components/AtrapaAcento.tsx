"use client";

/**
 * Atrapa el Acento — Minijuego educativo de ritmo ortográfico (REDISEÑO AAA)
 * -----------------------------------------------------------------------
 * Mecánica conservada:
 *  1. Aparece una palabra incompleta (silabeada, sin tilde) en el centro.
 *     La sílaba tónica está resaltada con halo coral pulsante + flecha ↓.
 *  2. Tres "burbujas" premium (SVG con gradiente radial + brillo glossy)
 *     con vocales con tilde flotan por la pantalla rebotando en los bordes
 *     (animación rAF tipo Pong). Una es la correcta; dos son distractores.
 *  3. El niño debe tocar la burbuja correcta antes de que se acabe el
 *     tiempo (5 s por palabra).
 *  4. Acierto → la burbuja "explota" + 10 puntos, +1 racha, auto-avance.
 *  5. Error → la burbuja tiembla, -3 puntos, -1 vida, callout ámbar con
 *     la regla ortográfica; se permite reintentar (no avanza).
 *  6. Tiempo agotado → se muestra la palabra completa con la tilde
 *     resaltada en verde, -1 vida, auto-avance.
 *  7. 0 vidas → derrota. Al completar los 20 desafíos → victoria.
 *
 * Infraestructura AAA usada: GameShell (sky), GameIntro, GameHUD
 * (language), GameOverlay, useGameAudio, FloatingScore, ParticleBurst.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, CheckCircle2, Target, Volume2, X } from "lucide-react";
import { desafiosAtrapa, type DesafioAtrapa } from "@/data/atrapaAcento";
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

type Estado =
  | "presentacion"
  | "jugando"
  | "acertando"
  | "fallando"
  | "tiempo_agotado"
  | "completado"
  | "derrota";

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

interface PaletaBurbuja {
  light: string;
  base: string;
  dark: string;
}

const TOTAL_DESAFIOS = desafiosAtrapa.length; // 20
const TIEMPO_POR_PALABRA = 5; // segundos
const DURACION_ACERTAR_MS = 1200;
const DURACION_FALLAR_MS = 1500;
const DURACION_TIEMPO_AGOTADO_MS = 1500;
const VIDAS_MAX = 3;
const PUNTOS_ACIERTO = 10;
const PUNTOS_ERROR = -3;

// Paleta cálida para las burbujas (todas las de un mismo desafío usan el
// MISMO color → no hay pista visual de cuál es la correcta).
const PALETA: PaletaBurbuja[] = [
  { light: "#fda4af", base: "#fb7185", dark: "#9f1239" }, // rose
  { light: "#fcd34d", base: "#f59e0b", dark: "#92400e" }, // amber
  { light: "#c4b5fd", base: "#a78bfa", dark: "#5b21b6" }, // violet
  { light: "#6ee7b7", base: "#34d399", dark: "#065f46" }, // emerald
  { light: "#f9a8d4", base: "#f472b6", dark: "#9d174d" }, // pink
  { light: "#7dd3fc", base: "#38bdf8", dark: "#075985" }, // sky
];

/* ----------------------- Helpers de audio (TTS) ----------------------- */

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
  const sfx = useGameAudio();

  // --- Estado del juego ---
  const [estado, setEstado] = useState<Estado>("presentacion");
  const [idxDesafio, setIdxDesafio] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [errores, setErrores] = useState(0);
  const [streak, setStreak] = useState(0);
  const [streakMax, setStreakMax] = useState(0);
  const [vidas, setVidas] = useState(VIDAS_MAX);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_POR_PALABRA);
  const [burbujas, setBurbujas] = useState<Burbuja[]>([]);
  const [paletaActual, setPaletaActual] = useState<PaletaBurbuja>(PALETA[0]);
  const [reglaVisible, setReglaVisible] = useState(false);
  const [reglaPositiva, setReglaPositiva] = useState(false);
  const [idxBurbujaAtrapada, setIdxBurbujaAtrapada] = useState<number | null>(
    null,
  );
  const [idxBurbujaFallida, setIdxBurbujaFallida] = useState<number | null>(
    null,
  );
  const [comboBanner, setComboBanner] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const [scores, setScores] = useState<FloatingScoreItem[]>([]);
  const [bursts, setBursts] = useState<(BurstConfig & { id: number })[]>([]);

  // Refs espejo para leer el valor actual dentro de callbacks sin reiniciar
  // el effect correspondiente.
  const tiempoRestanteRef = useRef(TIEMPO_POR_PALABRA);
  const vidasRef = useRef(VIDAS_MAX);
  const lastTickSecondRef = useRef(-1);
  const comboBannerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const dimsRef = useRef({ w: 800, h: 420 });
  const [esDesktop, setEsDesktop] = useState(false);
  const bubbleSize = esDesktop ? 104 : 84;

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

  // Sincronizar muted → sfx
  useEffect(() => {
    sfx.setMuted(muted);
  }, [muted, sfx]);

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

  const cargarDesafio = useCallback((idx: number) => {
    const d = desafiosAtrapa[idx];
    if (!d) return;
    const { w, h } = dimsRef.current;
    const size = window.matchMedia("(min-width: 640px)").matches ? 104 : 84;

    // Construir las 3 vocales (correcta + 2 distractores) en orden
    // aleatorio, y repartir las 3 slots horizontales (izq/centro/der)
    // entre ellas. La correcta arranca en el slot indicado por
    // d.posicion_x; las otras dos toman los slots restantes.
    const slotsRestantes = (
      ["izquierda", "centro", "derecha"] as const
    ).filter((s) => s !== d.posicion_x);
    const [s1, s2] = shuffleTwo([slotsRestantes[0], slotsRestantes[1]]);
    const vocalesSlots: {
      vocal: string;
      esCorrecta: boolean;
      slot: "izquierda" | "centro" | "derecha";
    }[] = [
      { vocal: d.letra_con_tilde_correcta, esCorrecta: true, slot: d.posicion_x },
      { vocal: d.distractores[0], esCorrecta: false, slot: s1 },
      { vocal: d.distractores[1], esCorrecta: false, slot: s2 },
    ];
    const orden = shuffleThree([0, 1, 2] as [0, 1, 2]);
    const nuevasBurbujas: Burbuja[] = orden.map((slotIdx, i) => {
      const v = vocalesSlots[slotIdx];
      const boost = 1 + Math.floor(idx / 5) * 0.12;
      const speed = (95 + Math.random() * 45) * boost;
      const angulos = [
        Math.PI / 4 + (Math.random() - 0.5) * 0.6, // ↘
        (3 * Math.PI) / 4 + (Math.random() - 0.5) * 0.6, // ↙
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
    setPaletaActual(elegir(PALETA, 1)[0]);
    tiempoRestanteRef.current = TIEMPO_POR_PALABRA;
    lastTickSecondRef.current = -1;
    setTiempoRestante(TIEMPO_POR_PALABRA);
    setReglaVisible(false);
    setReglaPositiva(false);
    setIdxBurbujaAtrapada(null);
    setIdxBurbujaFallida(null);
    setEstado("jugando");

    // Reproducir automáticamente el audio guía al iniciar.
    hablar(d.audio_guia);
  }, []);

  /* ----------------------- Loop de animación de burbujas (rAF) ----------------------- */
  // CONSERVADO EXACTAMENTE — no romper el rAF.

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
      const size = window.matchMedia("(min-width: 640px)").matches ? 104 : 84;
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
  // Añade: tick sfx en últimos 2s, -1 vida al agotarse → derrota si 0.

  useEffect(() => {
    if (estado !== "jugando") return;
    const id = setInterval(() => {
      const next = Math.max(0, tiempoRestanteRef.current - 0.1);
      tiempoRestanteRef.current = next;
      setTiempoRestante(next);

      // Tick SFX en los últimos 2s (una vez por segundo entero).
      const secondInt = Math.ceil(next);
      if (next <= 2 && next > 0 && secondInt !== lastTickSecondRef.current) {
        lastTickSecondRef.current = secondInt;
        sfx.tick();
      }

      if (next <= 0) {
        // Tiempo agotado: transición desde el callback.
        setStreak(0);
        const nv = vidasRef.current - 1;
        vidasRef.current = nv;
        setVidas(nv);
        sfx.error();
        sfx.vibrate([20, 40, 20]);
        if (nv <= 0) {
          silenciar();
          setEstado("derrota");
        } else {
          setEstado("tiempo_agotado");
        }
      }
    }, 100);
    return () => clearInterval(id);
  }, [estado, sfx]);

  /* ----------------------- Transiciones de estado ----------------------- */

  // acertando → siguiente desafío (o completado) tras 1.2s
  useEffect(() => {
    if (estado !== "acertando") return;
    const t = setTimeout(() => {
      if (idxDesafio + 1 >= TOTAL_DESAFIOS) {
        silenciar();
        sfx.victory();
        setEstado("completado");
      } else {
        setIdxDesafio((i) => i + 1);
      }
    }, DURACION_ACERTAR_MS);
    return () => clearTimeout(t);
  }, [estado, idxDesafio, sfx]);

  // tiempo_agotado → siguiente desafío (o completado) tras 1.5s
  useEffect(() => {
    if (estado !== "tiempo_agotado") return;
    const t = setTimeout(() => {
      if (idxDesafio + 1 >= TOTAL_DESAFIOS) {
        silenciar();
        setEstado("completado");
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
      setReglaPositiva(false);
      setEstado("jugando");
    }, DURACION_FALLAR_MS);
    return () => clearTimeout(t);
  }, [estado]);

  // Cuando idxDesafio cambia (excepto al iniciar en presentacion), cargar
  // automáticamente el siguiente desafío.
  useEffect(() => {
    if (estado === "presentacion" || estado === "completado") return;
    cargarDesafio(idxDesafio);
  }, [idxDesafio, cargarDesafio]);

  /* ----------------------- Helpers FX (FloatingScore + ParticleBurst) ----------------------- */

  const spawnScore = useCallback(
    (b: Burbuja, text: string, color?: string) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const xPct = ((b.x + bubbleSize / 2) / Math.max(1, rect.width)) * 100;
      const yPct = ((b.y + bubbleSize / 2) / Math.max(1, rect.height)) * 100;
      const item: FloatingScoreItem = {
        id: nextScoreId(),
        x: Math.max(0, Math.min(100, xPct)),
        y: Math.max(0, Math.min(100, yPct)),
        text,
        color: color ?? "#fbbf24",
      };
      setScores((s) => [...s, item]);
      programar(() => {
        setScores((s) => s.filter((x) => x.id !== item.id));
      }, 950);
    },
    [bubbleSize, programar],
  );

  const spawnBurst = useCallback(
    (b: Burbuja) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = rect.left + b.x + bubbleSize / 2;
      const y = rect.top + b.y + bubbleSize / 2;
      const id = Date.now() + Math.random();
      const burst: BurstConfig & { id: number } = {
        id,
        x,
        y,
        count: 20,
        power: 1.4,
        colors: [
          paletaActual.base,
          paletaActual.light,
          "#ffffff",
          "#fde047",
          "#fb7185",
        ],
      };
      setBursts((arr) => [...arr, burst]);
      programar(() => {
        setBursts((arr) => arr.filter((x) => x.id !== id));
      }, 1000);
    },
    [bubbleSize, paletaActual, programar],
  );

  const mostrarComboBanner = useCallback(
    (n: number) => {
      setComboBanner(n);
      if (comboBannerTimeoutRef.current) {
        clearTimeout(comboBannerTimeoutRef.current);
      }
      comboBannerTimeoutRef.current = setTimeout(() => {
        setComboBanner(null);
        comboBannerTimeoutRef.current = null;
      }, 1400);
    },
    [],
  );

  /* ----------------------- Acciones ----------------------- */

  const empezar = useCallback(() => {
    sfx.click();
    silenciar();
    setIdxDesafio(0);
    setPuntos(0);
    setAciertos(0);
    setErrores(0);
    setStreak(0);
    setStreakMax(0);
    vidasRef.current = VIDAS_MAX;
    setVidas(VIDAS_MAX);
    setScores([]);
    setBursts([]);
    setComboBanner(null);
    cargarDesafio(0);
  }, [cargarDesafio, sfx]);

  const manejarToque = useCallback(
    (b: Burbuja) => {
      if (estado !== "jugando" && estado !== "fallando") return;

      // Siempre reproducimos pop al tocar (feedback táctil).
      sfx.pop();

      if (b.esCorrecta) {
        // ¡Acierto!
        setIdxBurbujaAtrapada(b.id);
        setEstado("acertando");
        setPuntos((p) => p + PUNTOS_ACIERTO);
        setAciertos((a) => a + 1);
        const nuevaRacha = streak + 1;
        setStreak(nuevaRacha);
        setStreakMax((m) => Math.max(m, nuevaRacha));
        setReglaVisible(true);
        setReglaPositiva(true);
        setIdxBurbujaFallida(null);

        // FX
        spawnBurst(b);
        spawnScore(b, `+${PUNTOS_ACIERTO}`, "#fbbf24");
        sfx.success();
        sfx.vibrate(30);

        // Combo banner a los 3+ aciertos consecutivos.
        if (nuevaRacha >= 3) {
          mostrarComboBanner(nuevaRacha);
          programar(() => sfx.combo(nuevaRacha), 220);
        }
      } else {
        // Error: la burbuja tocada tiembla.
        setIdxBurbujaFallida(b.id);
        setEstado("fallando");
        setPuntos((p) => Math.max(0, p + PUNTOS_ERROR));
        setErrores((e) => e + 1);
        setStreak(0);
        setReglaVisible(true);
        setReglaPositiva(false);
        sfx.error();
        sfx.vibrate([20, 40, 20]);
        spawnScore(b, `${PUNTOS_ERROR}`, "#f43f5e");

        // Decrementar vida; si llega a 0 → derrota (tras mostrar feedback).
        const nv = vidasRef.current - 1;
        vidasRef.current = nv;
        setVidas(nv);
        if (nv <= 0) {
          programar(() => {
            silenciar();
            setEstado("derrota");
          }, 800);
        }
      }
    },
    [estado, streak, sfx, spawnBurst, spawnScore, mostrarComboBanner, programar],
  );

  const reiniciar = useCallback(() => {
    sfx.click();
    silenciar();
    setEstado("presentacion");
    setIdxDesafio(0);
    setBurbujas([]);
    setPuntos(0);
    setAciertos(0);
    setErrores(0);
    setStreak(0);
    setStreakMax(0);
    vidasRef.current = VIDAS_MAX;
    setVidas(VIDAS_MAX);
    setReglaVisible(false);
    setReglaPositiva(false);
    setIdxBurbujaAtrapada(null);
    setIdxBurbujaFallida(null);
    setScores([]);
    setBursts([]);
    setComboBanner(null);
    tiempoRestanteRef.current = TIEMPO_POR_PALABRA;
    lastTickSecondRef.current = -1;
    setTiempoRestante(TIEMPO_POR_PALABRA);
  }, [sfx]);

  const toggleMute = useCallback(() => {
    sfx.click();
    setMuted((m) => !m);
  }, [sfx]);

  const escuchar = useCallback(() => {
    if (desafio) hablar(desafio.audio_guia);
  }, [desafio]);

  const onSalir = useCallback(() => {
    silenciar();
    if (typeof document !== "undefined") {
      const btn = document.querySelector<HTMLButtonElement>(
        'button[aria-label="Salir del minijuego y volver al inicio"]',
      );
      btn?.click();
    }
  }, []);

  /* ----------------------- Derivados de render ----------------------- */

  const silabasPalabra = useMemo(() => {
    if (!desafio) return [] as { texto: string; tonica: boolean }[];
    return desafio.palabra_incompleta.split("-").map((s, i, arr) => {
      const tonicaIdxDesdeElFinal = desafio.silaba_tonica;
      const idxTonica = arr.length - tonicaIdxDesdeElFinal;
      return { texto: s, tonica: i === idxTonica };
    });
  }, [desafio]);

  const silabasPalabraCompleta = useMemo(() => {
    if (!desafio) return null;
    const palabra = desafio.palabra_completa;
    const idxTilde = Array.from(palabra).findIndex((c) =>
      "áéíóúÁÉÍÓÚ".includes(c),
    );
    return { palabra, idxTilde };
  }, [desafio]);

  const timerMs = Math.max(0, tiempoRestante * 1000);

  /* ===================== RENDER ===================== */

  // ---------------- Pantalla: presentación ----------------
  if (estado === "presentacion") {
    return (
      <GameShell theme="sky" onSalir={onSalir}>
        <SkyDecor />
        <div className="relative z-10">
          <GameIntro
            icono={
              <span className="text-7xl drop-shadow-[0_4px_12px_rgba(251,113,133,0.6)]">
                🎯
              </span>
            }
            titulo="Atrapa el Acento"
            subtitulo="Atrapá la vocal con tilde correcta"
            descripcion="Las vocales con tilde flotan por el cielo. Leé la palabra, identificate la sílaba tónica y tocá la burbuja correcta antes de que se acabe el tiempo."
            pasos={[
              "Leé la palabra en pantalla",
              "Identificá la sílaba tónica (la marcada)",
              "Buscá la vocal con tilde que corresponde",
              "¡Tocala antes de que se acabe el tiempo!",
            ]}
            temaColor="#fb7185"
            onJugar={empezar}
          />
        </div>
      </GameShell>
    );
  }

  // ---------------- Pantalla: completado (victoria) ----------------
  if (estado === "completado") {
    return (
      <GameShell theme="sky" onSalir={onSalir}>
        <SkyDecor />
        <GameOverlay
          tipo="victoria"
          titulo="¡Atrapa-Tilde Maestro!"
          subtitulo={`Atrapaste ${aciertos} de ${TOTAL_DESAFIOS} tildes. ¡Sos un crack de la ortografía!`}
          stats={{
            puntos,
            rachaMaxima: streakMax,
            aciertos,
            total: TOTAL_DESAFIOS,
          }}
          onReiniciar={reiniciar}
          onSalir={onSalir}
          temaColor="#fb7185"
        />
      </GameShell>
    );
  }

  // ---------------- Pantalla: derrota (0 vidas) ----------------
  if (estado === "derrota") {
    return (
      <GameShell theme="sky" onSalir={onSalir}>
        <SkyDecor />
        <GameOverlay
          tipo="derrota"
          titulo="¡Te quedaste sin vidas!"
          subtitulo={`Llegaste a la palabra ${Math.min(
            idxDesafio + 1,
            TOTAL_DESAFIOS,
          )} de ${TOTAL_DESAFIOS}. ¡Probá de nuevo!`}
          stats={{
            puntos,
            rachaMaxima: streakMax,
            aciertos,
            total: TOTAL_DESAFIOS,
          }}
          onReiniciar={reiniciar}
          onSalir={onSalir}
          temaColor="#fb7185"
        />
      </GameShell>
    );
  }

  // ---------------- Pantalla: jugando / feedback ----------------
  return (
    <GameShell theme="sky" onSalir={onSalir}>
      <SkyDecor />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-56px)] max-w-5xl flex-col px-3 pb-6 pt-2 sm:px-5">
        <GameHUD
          theme="language"
          nivel={Math.min(idxDesafio + 1, TOTAL_DESAFIOS)}
          totalNiveles={TOTAL_DESAFIOS}
          puntos={puntos}
          vidas={vidas}
          vidasMaximas={VIDAS_MAX}
          racha={streak}
          timerMs={timerMs}
          timerTotalMs={TIEMPO_POR_PALABRA * 1000}
          muted={muted}
          onToggleMute={toggleMute}
          icono={<Target size={18} strokeWidth={2.5} />}
        />

        {/* Banner "Palabra X" */}
        <div className="mt-3 flex items-center justify-center gap-2 text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-100/90 sm:text-base">
            <span className="text-rose-300">Palabra</span>{" "}
            <span className="text-white">
              {Math.min(idxDesafio + 1, TOTAL_DESAFIOS)}
            </span>{" "}
            <span className="text-rose-300/70">/ {TOTAL_DESAFIOS}</span>
          </p>
        </div>

        {desafio && (
          <div className="mt-2 flex flex-1 flex-col gap-3 sm:gap-4">
            {/* Palabra central — estilo cartel LED */}
            <div
              className="relative overflow-hidden rounded-2xl border-2 p-4 text-center shadow-2xl sm:p-5"
              style={{
                background:
                  "linear-gradient(180deg, #0a1a2f 0%, #061325 100%)",
                borderColor: "rgba(56,189,248,0.35)",
                boxShadow:
                  "0 0 32px rgba(56,189,248,0.18), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* scanlines sutiles estilo LED */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.4) 3px, rgba(0,0,0,0.4) 4px)",
                }}
              />
              <p className="relative text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300/80 sm:text-xs">
                {desafio.clasificacion} · ¿Dónde va la tilde?
              </p>
              <div className="relative mt-3 flex flex-wrap items-end justify-center gap-2 sm:gap-3">
                {silabasPalabra.map((s, i) => (
                  <div key={i} className="relative flex flex-col items-center">
                    {s.tonica && (
                      <span
                        aria-hidden
                        className="mb-1 animate-pulse text-2xl font-black text-rose-400 sm:text-3xl"
                        style={{ filter: "drop-shadow(0 0 8px #fb7185)" }}
                      >
                        ↓
                      </span>
                    )}
                    {!s.tonica && (
                      <span className="mb-1 h-7 sm:h-9" aria-hidden />
                    )}
                    <span
                      className={`relative rounded-lg px-3 py-1 text-5xl font-bold leading-none transition-all sm:text-6xl ${
                        s.tonica ? "text-white" : "text-emerald-200/90"
                      }`}
                      style={{
                        fontFamily: '"Fredoka", sans-serif',
                        background: s.tonica
                          ? "rgba(251,113,133,0.18)"
                          : "rgba(255,255,255,0.04)",
                        boxShadow: s.tonica
                          ? "0 0 24px rgba(251,113,133,0.55), inset 0 0 12px rgba(251,113,133,0.25)"
                          : "inset 0 0 8px rgba(16,185,129,0.1)",
                        border: s.tonica
                          ? "2px solid rgba(251,113,133,0.6)"
                          : "1px solid rgba(56,189,248,0.15)",
                        textShadow: s.tonica
                          ? "0 0 18px rgba(251,113,133,0.8)"
                          : "0 0 12px rgba(16,185,129,0.6)",
                        animation: s.tonica
                          ? "tonicaPulse 1.4s ease-in-out infinite"
                          : undefined,
                      }}
                    >
                      {s.texto}
                    </span>
                  </div>
                ))}
              </div>
              <p className="relative mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-100/80 sm:text-sm">
                <Target size={13} strokeWidth={2.5} className="text-rose-300" />
                Tocá la burbuja con la vocal que lleva tilde.
              </p>
            </div>

            {/* Campo de juego con burbujas flotantes */}
            <div
              ref={containerRef}
              className="relative flex-1 overflow-hidden rounded-3xl border-2 border-cyan-400/25 shadow-2xl backdrop-blur-sm"
              style={{
                minHeight: "320px",
                background:
                  "linear-gradient(180deg, rgba(8,30,55,0.55) 0%, rgba(4,18,35,0.7) 100%)",
              }}
            >
              {/* Nubes SVG suaves flotando dentro del campo */}
              <CampoNubes />

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
                      disabled={estado === "acertando" || esAtrapada}
                      aria-label={ariaVocal(b.vocal)}
                      className={`absolute flex items-center justify-center rounded-full transition-transform duration-75 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 active:scale-95 ${
                        esAtrapada
                          ? "pointer-events-none animate-pop-burst"
                          : ""
                      } ${esFallida ? "animate-burbuja-tiembla" : ""} hover:scale-105`}
                      style={{
                        left: `${b.x}px`,
                        top: `${b.y}px`,
                        width: `${bubbleSize}px`,
                        height: `${bubbleSize}px`,
                        touchAction: "manipulation",
                        cursor: "pointer",
                      }}
                    >
                      <BurbujaSVG
                        vocal={b.vocal}
                        size={bubbleSize}
                        paleta={paletaActual}
                        atrapada={esAtrapada}
                        fallida={esFallida}
                      />
                    </button>
                  );
                })}

              {/* FloatingScores (relativos al contenedor) */}
              {scores.map((s) => (
                <FloatingScore key={s.id} item={s} />
              ))}

              {/* Combo banner */}
              {comboBanner !== null && comboBanner >= 3 && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-6 z-30 -translate-x-1/2 animate-combo-pop"
                >
                  <div
                    className="flex items-center gap-2 rounded-full px-5 py-2 text-2xl font-black text-white shadow-2xl sm:text-3xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #fb7185 50%, #a78bfa 100%)",
                      boxShadow:
                        "0 0 32px rgba(251,113,133,0.6), 0 8px 24px rgba(0,0,0,0.4)",
                      textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                    }}
                  >
                    🔥 ¡COMBO x{comboBanner}!
                  </div>
                </div>
              )}

              {/* Overlay: ¡Atrapada! 🎉 */}
              {estado === "acertando" && (
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                  <div
                    className="animate-bounce-in rounded-3xl border-2 px-6 py-4 shadow-2xl"
                    style={{
                      background:
                        "linear-gradient(160deg, rgba(255,255,255,0.97) 0%, rgba(240,253,244,0.97) 100%)",
                      borderColor: "rgba(52,211,153,0.6)",
                      boxShadow:
                        "0 0 40px rgba(52,211,153,0.4), 0 12px 32px rgba(0,0,0,0.3)",
                    }}
                  >
                    <p className="flex items-center justify-center gap-2 text-center text-2xl font-black text-emerald-600 sm:text-3xl">
                      <CheckCircle2
                        size={28}
                        strokeWidth={2.5}
                        className="text-emerald-500"
                      />
                      ¡Atrapada!
                    </p>
                    <p className="mt-1 text-center text-sm font-bold text-emerald-700/80 sm:text-base">
                      +{PUNTOS_ACIERTO} puntos
                    </p>
                  </div>
                </div>
              )}

              {/* Overlay: tiempo agotado — muestra palabra completa */}
              {estado === "tiempo_agotado" && silabasPalabraCompleta && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div
                    className="animate-bounce-in rounded-3xl border-2 px-6 py-5 text-center shadow-2xl"
                    style={{
                      background:
                        "linear-gradient(160deg, rgba(255,255,255,0.97) 0%, rgba(255,241,242,0.97) 100%)",
                      borderColor: "rgba(244,63,94,0.6)",
                      boxShadow:
                        "0 0 40px rgba(244,63,94,0.4), 0 12px 32px rgba(0,0,0,0.3)",
                    }}
                  >
                    <p className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wide text-rose-600">
                      <X size={14} strokeWidth={3} /> Se acabó el tiempo
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-800 sm:text-4xl">
                      {Array.from(silabasPalabraCompleta.palabra).map(
                        (c, i) => (
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
                        ),
                      )}
                    </p>
                    <p className="mt-2 text-sm font-bold text-rose-700/80">
                      Así se escribe con tilde. ¡A la próxima!
                    </p>
                  </div>
                </div>
              )}

              {/* Callout: regla ortográfica (glassmorphism amber) */}
              {reglaVisible && desafio && (
                <div className="absolute left-1/2 top-3 z-30 w-[92%] max-w-md -translate-x-1/2 animate-bounce-in">
                  <div
                    className="rounded-2xl border-2 px-4 py-3 shadow-xl backdrop-blur-md"
                    style={{
                      background: reglaPositiva
                        ? "linear-gradient(160deg, rgba(254,243,199,0.92) 0%, rgba(253,230,138,0.88) 100%)"
                        : "linear-gradient(160deg, rgba(255,251,235,0.92) 0%, rgba(254,215,170,0.88) 100%)",
                      borderColor: reglaPositiva
                        ? "rgba(52,211,153,0.55)"
                        : "rgba(245,158,11,0.6)",
                      boxShadow: reglaPositiva
                        ? "0 0 24px rgba(52,211,153,0.3), 0 8px 20px rgba(0,0,0,0.2)"
                        : "0 0 24px rgba(245,158,11,0.3), 0 8px 20px rgba(0,0,0,0.2)",
                    }}
                  >
                    <p className="flex items-start gap-2 text-sm font-bold text-amber-900 sm:text-base">
                      {reglaPositiva ? (
                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-emerald-600"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <BookOpen
                          size={18}
                          className="mt-0.5 shrink-0 text-amber-700"
                          strokeWidth={2.5}
                        />
                      )}
                      <span>
                        <span
                          className={
                            reglaPositiva
                              ? "font-black text-emerald-700"
                              : "font-black text-amber-700"
                          }
                        >
                          {reglaPositiva ? "¡Muy bien! " : "Regla: "}
                        </span>
                        {desafio.regla}
                      </span>
                    </p>
                    {!reglaPositiva && (
                      <p className="mt-1.5 text-xs font-black text-rose-700">
                        {PUNTOS_ERROR} puntos · ¡Intentá de nuevo!
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Botón escuchar + stats */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={escuchar}
                className="flex items-center gap-2 rounded-2xl border-2 border-rose-400/50 bg-white/10 px-4 py-3 text-base font-bold text-rose-100 shadow-lg backdrop-blur-md transition hover:scale-[1.02] hover:bg-white/15 active:scale-95 sm:text-lg"
                aria-label={`Escuchar cómo se pronuncia ${desafio.palabra_completa}`}
              >
                <Volume2 size={20} strokeWidth={2.5} />
                <span>🔊 Escuchar</span>
              </button>
              <div className="rounded-2xl border-2 border-cyan-400/30 bg-white/5 px-3 py-2 text-right text-xs font-bold text-cyan-100 backdrop-blur-md sm:text-sm">
                <p>
                  Aciertos:{" "}
                  <span className="text-emerald-300">{aciertos}</span>
                  {" · "}
                  <span className="text-rose-300">{errores} errores</span>
                </p>
                <p className="text-cyan-300/70">
                  Racha máxima: {streakMax} 🔥
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ParticleBursts (fixed positioning, fuera del contenedor) */}
      {bursts.map((b) => (
        <ParticleBurst key={b.id} burst={b} />
      ))}

      {/* Estilos inline para keyframes */}
      <style>{`
        @keyframes tonicaPulse {
          0%, 100% {
            box-shadow: 0 0 24px rgba(251,113,133,0.55), inset 0 0 12px rgba(251,113,133,0.25);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 36px rgba(251,113,133,0.85), inset 0 0 18px rgba(251,113,133,0.4);
            transform: scale(1.05);
          }
        }
        @keyframes popBurst {
          0% { transform: scale(1); opacity: 1; }
          40% { transform: scale(1.6); opacity: 0.85; }
          100% { transform: scale(0); opacity: 0; }
        }
        .animate-pop-burst {
          animation: popBurst 0.55s ease-out forwards;
        }
        @keyframes burbujaTiembla {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          15% { transform: translateX(-7px) rotate(-4deg); }
          30% { transform: translateX(7px) rotate(4deg); }
          45% { transform: translateX(-6px) rotate(-3deg); }
          60% { transform: translateX(6px) rotate(3deg); }
          75% { transform: translateX(-4px) rotate(-2deg); }
        }
        .animate-burbuja-tiembla {
          animation: burbujaTiembla 0.5s ease-in-out;
        }
        @keyframes comboPop {
          0% { transform: translate(-50%, -10px) scale(0.4); opacity: 0; }
          30% { transform: translate(-50%, 0) scale(1.15); opacity: 1; }
          60% { transform: translate(-50%, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -8px) scale(0.95); opacity: 0; }
        }
        .animate-combo-pop {
          animation: comboPop 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes nubeFloat {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }
        .animate-nube {
          animation: nubeFloat 18s ease-in-out infinite;
        }
        @keyframes vocalFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-22px) rotate(6deg); }
        }
        .animate-vocal-float {
          animation: vocalFloat 9s ease-in-out infinite;
        }
      `}</style>
    </GameShell>
  );
}

/* ----------------------- BurbujaSVG (premium) ----------------------- */

function BurbujaSVG({
  vocal,
  size,
  paleta,
  atrapada,
  fallida,
}: {
  vocal: string;
  size: number;
  paleta: PaletaBurbuja;
  atrapada: boolean;
  fallida: boolean;
}) {
  const gid = `bub-${Math.round(size)}-${vocal.charCodeAt(0)}`;
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{
        filter: atrapada
          ? `drop-shadow(0 0 24px ${paleta.base})`
          : fallida
            ? "drop-shadow(0 0 16px #f43f5e)"
            : `drop-shadow(0 6px 14px rgba(0,0,0,0.45))`,
        display: "block",
      }}
    >
      <defs>
        <radialGradient id={`${gid}-grad`} cx="35%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="18%" stopColor={paleta.light} stopOpacity="0.95" />
          <stop offset="55%" stopColor={paleta.base} stopOpacity="1" />
          <stop offset="100%" stopColor={paleta.dark} stopOpacity="1" />
        </radialGradient>
        <radialGradient id={`${gid}-shine`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Cuerpo principal de la burbuja */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill={`url(#${gid}-grad)`}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
      />

      {/* Brillo glossy superior izquierdo */}
      <ellipse
        cx="34"
        cy="26"
        rx="16"
        ry="10"
        fill={`url(#${gid}-shine)`}
        transform="rotate(-25 34 26)"
      />

      {/* Pequeño destello secundario */}
      <ellipse
        cx="68"
        cy="22"
        rx="5"
        ry="3"
        fill="#ffffff"
        opacity="0.55"
        transform="rotate(-15 68 22)"
      />

      {/* Sombra inferior interna */}
      <ellipse
        cx="55"
        cy="78"
        rx="28"
        ry="8"
        fill="#000000"
        opacity="0.18"
      />

      {/* Borde inferior oscuro */}
      <path
        d="M 12 60 A 38 38 0 0 0 88 60"
        fill="none"
        stroke={paleta.dark}
        strokeWidth="2"
        opacity="0.45"
      />

      {/* Vocal con tilde gigante (Fredoka bold) */}
      <text
        x="50"
        y="64"
        textAnchor="middle"
        fontFamily='"Fredoka", "Baloo 2", sans-serif'
        fontWeight="700"
        fontSize="48"
        fill="#ffffff"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="1.2"
        paintOrder="stroke"
        style={{
          filter: `drop-shadow(0 2px 3px ${paleta.dark})`,
        }}
      >
        {vocal}
      </text>
    </svg>
  );
}

/* ----------------------- SkyDecor (fondo cielo decorativo) ----------------------- */

function SkyDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Sol suave */}
      <div className="absolute right-6 top-20 h-24 w-24 rounded-full bg-amber-200/30 blur-2xl sm:right-12 sm:top-24 sm:h-32 sm:w-32" />
      {/* Nubes SVG suaves flotando */}
      <CloudSVG className="animate-nube absolute left-[6%] top-[16%] w-40 opacity-30 sm:w-56" />
      <CloudSVG
        className="animate-nube absolute right-[10%] top-[28%] w-32 opacity-25 sm:w-44"
        style={{ animationDelay: "3s" }}
      />
      <CloudSVG
        className="animate-nube absolute left-[18%] bottom-[12%] w-48 opacity-20 sm:w-64"
        style={{ animationDelay: "6s" }}
      />
      <CloudSVG
        className="animate-nube absolute right-[16%] bottom-[18%] w-36 opacity-25 sm:w-48"
        style={{ animationDelay: "9s" }}
      />

      {/* Vocales gigantes decorativas flotando */}
      <span
        className="animate-vocal-float absolute left-[6%] top-[42%] select-none text-[8rem] font-black text-rose-300/15 sm:text-[10rem]"
        style={{ fontFamily: '"Fredoka", sans-serif' }}
      >
        á
      </span>
      <span
        className="animate-vocal-float absolute right-[8%] top-[55%] select-none text-[7rem] font-black text-amber-300/15 sm:text-[9rem]"
        style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: "1.2s" }}
      >
        é
      </span>
      <span
        className="animate-vocal-float absolute left-[42%] top-[10%] select-none text-[6rem] font-black text-fuchsia-300/15 sm:text-[8rem]"
        style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: "0.6s" }}
      >
        í
      </span>
      <span
        className="animate-vocal-float absolute right-[36%] bottom-[8%] select-none text-[8rem] font-black text-orange-300/15 sm:text-[10rem]"
        style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: "1.8s" }}
      >
        ó
      </span>
      <span
        className="animate-vocal-float absolute left-[55%] bottom-[32%] select-none text-[7rem] font-black text-violet-300/15 sm:text-[9rem]"
        style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: "2.4s" }}
      >
        ú
      </span>
    </div>
  );
}

function CloudSVG({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 120 60" className={className} style={style}>
      <g fill="#ffffff">
        <ellipse cx="30" cy="38" rx="22" ry="14" />
        <ellipse cx="55" cy="30" rx="26" ry="18" />
        <ellipse cx="85" cy="38" rx="22" ry="14" />
        <ellipse cx="60" cy="42" rx="35" ry="10" />
      </g>
    </svg>
  );
}

/* ----------------------- CampoNubes (nubes dentro del campo de juego) ----------------------- */

function CampoNubes() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <CloudSVG className="animate-nube absolute left-[8%] top-[20%] w-28 opacity-20 sm:w-36" />
      <CloudSVG
        className="animate-nube absolute right-[12%] top-[55%] w-24 opacity-15 sm:w-32"
        style={{ animationDelay: "4s" }}
      />
      <CloudSVG
        className="animate-nube absolute left-[40%] top-[75%] w-32 opacity-15 sm:w-44"
        style={{ animationDelay: "8s" }}
      />
    </div>
  );
}

/* ----------------------- Aria helper ----------------------- */

function ariaVocal(v: string): string {
  // Describe la vocal: "é con tilde" o "a sin tilde".
  const conTilde = "áéíóú".includes(v.toLowerCase());
  const base = v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (conTilde) return `Vocal ${v} con tilde`;
  return `Vocal ${v} sin tilde (base ${base})`;
}
