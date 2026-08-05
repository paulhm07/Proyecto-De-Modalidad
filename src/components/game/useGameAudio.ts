"use client";

/**
 * useGameAudio — Sistema de sonido AAA para mini-juegos.
 * -------------------------------------------------------
 * Hook basado en Web Audio API (sin assets externos). Genera SFX
 * sintetizados en tiempo real: clicks, aciertos, errores, combos,
 * victoria, etc. Vibración opcional en móviles.
 *
 * Uso:
 *   const sfx = useGameAudio();
 *   sfx.click();
 *   sfx.success();
 *   sfx.error();
 *   sfx.combo(3);     // combo de 3
 *   sfx.victory();
 *   sfx.pop();        // globo
 *   sfx.cut();        // corte
 *   sfx.chime();      // campana suave
 */

import { useCallback, useEffect, useRef } from "react";

type SfxName =
  | "click"
  | "success"
  | "error"
  | "combo"
  | "victory"
  | "pop"
  | "cut"
  | "chime"
  | "whoosh"
  | "tick"
  | "coin";

export interface GameAudio {
  click: () => void;
  success: () => void;
  error: () => void;
  combo: (level?: number) => void;
  victory: () => void;
  pop: () => void;
  cut: () => void;
  chime: () => void;
  whoosh: () => void;
  tick: () => void;
  coin: () => void;
  vibrate: (pattern?: number | number[]) => void;
  setMuted: (m: boolean) => void;
  isMuted: () => boolean;
}

export function useGameAudio(): GameAudio {
  const ctxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(false);

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      try {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        ctxRef.current = new AC();
      } catch {
        return null;
      }
    }
    // Resume si está suspendido (política de autoplay)
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (
      freq: number,
      duration: number,
      type: OscillatorType = "sine",
      gain = 0.18,
      delay = 0,
    ) => {
      const ctx = getCtx();
      if (!ctx || mutedRef.current) return;
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.05);
    },
    [getCtx],
  );

  const sweep = useCallback(
    (
      f1: number,
      f2: number,
      duration: number,
      type: OscillatorType = "sine",
      gain = 0.18,
      delay = 0,
    ) => {
      const ctx = getCtx();
      if (!ctx || mutedRef.current) return;
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f1, t0);
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, f2),
        t0 + duration,
      );
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + duration + 0.05);
    },
    [getCtx],
  );

  const noise = useCallback(
    (duration: number, gain = 0.12, delay = 0) => {
      const ctx = getCtx();
      if (!ctx || mutedRef.current) return;
      const t0 = ctx.currentTime + delay;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const g = ctx.createGain();
      g.gain.setValueAtTime(gain, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      src.connect(g);
      g.connect(ctx.destination);
      src.start(t0);
      src.stop(t0 + duration + 0.02);
    },
    [getCtx],
  );

  const play: Record<SfxName, () => void> = {
    click: () => tone(540, 0.07, "triangle", 0.13),
    success: () => {
      // arpeggio Do-Mi-Sol-Do
      tone(523.25, 0.12, "triangle", 0.16, 0);
      tone(659.25, 0.12, "triangle", 0.16, 0.09);
      tone(783.99, 0.14, "triangle", 0.16, 0.18);
      tone(1046.5, 0.2, "triangle", 0.14, 0.27);
    },
    error: () => {
      sweep(220, 110, 0.28, "sawtooth", 0.16);
      noise(0.08, 0.06, 0.02);
    },
    combo: (level = 2) => {
      // sube de tono según el nivel del combo
      const base = 523.25 * Math.pow(1.122, Math.min(level, 8));
      tone(base, 0.1, "square", 0.12, 0);
      tone(base * 1.5, 0.12, "square", 0.12, 0.06);
      tone(base * 2, 0.14, "square", 0.1, 0.12);
    },
    victory: () => {
      // fanfarria
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
      notes.forEach((f, i) => tone(f, 0.18, "triangle", 0.16, i * 0.13));
      tone(1568, 0.4, "triangle", 0.14, notes.length * 0.13);
    },
    pop: () => {
      sweep(880, 220, 0.12, "square", 0.14);
      noise(0.05, 0.08, 0);
    },
    cut: () => {
      noise(0.12, 0.1, 0);
      sweep(880, 440, 0.1, "sawtooth", 0.08, 0.02);
    },
    chime: () => {
      tone(1318.51, 0.5, "sine", 0.1, 0);
      tone(1975.53, 0.6, "sine", 0.07, 0.02);
    },
    whoosh: () => {
      noise(0.2, 0.08, 0);
      sweep(400, 1200, 0.18, "sine", 0.08, 0.02);
    },
    tick: () => tone(1200, 0.04, "square", 0.08),
    coin: () => {
      tone(988, 0.08, "square", 0.14, 0);
      tone(1319, 0.14, "square", 0.14, 0.07);
    },
  };

  const vibrate = useCallback((pattern: number | number[] = 30) => {
    if (typeof navigator === "undefined") return;
    if (!navigator.vibrate) return;
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }, []);

  const setMuted = useCallback((m: boolean) => {
    mutedRef.current = m;
  }, []);
  const isMuted = useCallback(() => mutedRef.current, []);

  // Cerrar contexto al desmontar
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        try {
          ctxRef.current.close();
        } catch {
          /* ignore */
        }
        ctxRef.current = null;
      }
    };
  }, []);

  return {
    click: play.click,
    success: play.success,
    error: play.error,
    combo: play.combo,
    victory: play.victory,
    pop: play.pop,
    cut: play.cut,
    chime: play.chime,
    whoosh: play.whoosh,
    tick: play.tick,
    coin: play.coin,
    vibrate,
    setMuted,
    isMuted,
  };
}
