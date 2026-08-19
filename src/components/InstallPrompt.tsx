"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

/**
 * Tipos locales para el prompt de instalación PWA.
 * --------------------------------------------------
 * `BeforeInstallPromptEvent` NO está en los tipos estándar del DOM
 * (es una feature aún en draft de Chromium). Lo declaramos aquí para
 * tener tipado estricto sin recurrir a `any`.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/** iOS Safari expone `navigator.standalone` (booleano) — no está tipado. */
interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

const DISMISS_KEY = "mundilex_install_dismissed";
const DISMISS_DAYS = 7;
const LISTEN_WINDOW_MS = 3000;

/** ¿El usuario descartó el prompt hace menos de 7 días? */
function wasRecentlyDismissed(): boolean {
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    const elapsedDays = (Date.now() - ts) / (1000 * 60 * 60 * 24);
    return elapsedDays < DISMISS_DAYS;
  } catch {
    // localStorage puede estar bloqueado (modo privado) → tratamos como no descartado.
    return false;
  }
}

/** ¿La app ya corre instalada como PWA (standalone)? */
function isRunningAsPWA(): boolean {
  try {
    if (window.matchMedia("(display-mode: standalone)").matches) return true;
  } catch {
    /* matchMedia podría no existir en entornos muy antiguos — ignoramos. */
  }
  const nav = window.navigator as NavigatorStandalone;
  return nav.standalone === true;
}

/**
 * InstallPrompt
 * --------------------------------------------------
 * Captura el evento `beforeinstallprompt` (Chrome / Android / Edge desktop)
 * y muestra una tarjeta flotante discreta en la esquina inferior derecha
 * para invitar a instalar Mundilex como PWA.
 *
 * - Si la app ya está instalada (display-mode: standalone o iOS standalone)
 *   → nunca se muestra.
 * - Si el usuario descartó el aviso hace menos de 7 días → no se muestra.
 * - Si tras 3 segundos no se disparó `beforeinstallprompt` (iOS Safari o
 *   ya instalada) → no se muestra nada y se deja de escuchar.
 * - Botón "Instalar" → dispara `deferredPrompt.prompt()` → lee `userChoice`
 *   → oculta la tarjeta y emite `CustomEvent("mundilex:installed")` si fue
 *   aceptada.
 * - Botón "Ahora no" → oculta la tarjeta y guarda timestamp en localStorage.
 */
export function InstallPrompt() {
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1) Si ya corre como PWA instalada → no hacer nada nunca.
    if (isRunningAsPWA()) return;

    // 2) Si fue descartado hace < 7 días → respetar el silencio del usuario.
    if (wasRecentlyDismissed()) return;

    let captured = false;

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      captured = true;
      deferredRef.current = e as BeforeInstallPromptEvent;
      setVisible(true);
    };

    const onAppInstalled = () => {
      setVisible(false);
      deferredRef.current = null;
      window.dispatchEvent(new CustomEvent("mundilex:installed"));
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    // 3) Si tras 3 segundos no se disparó beforeinstallprompt, dejamos de
    //    escuchar: iOS Safari o navegadores sin soporte no volverán a
    //    dispararlo en esta sesión.
    const giveUpTimer = window.setTimeout(() => {
      if (!captured) {
        window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      }
    }, LISTEN_WINDOW_MS);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      window.clearTimeout(giveUpTimer);
    };
  }, []);

  const instalar = async () => {
    const deferred = deferredRef.current;
    if (!deferred) {
      setVisible(false);
      return;
    }
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        // Avisamos al resto de la app (toasts, analítica, etc.).
        window.dispatchEvent(new CustomEvent("mundilex:installed"));
      }
    } catch {
      // Algunos navegadores lanzan error si el prompt ya fue usado o si
      // el usuario tiene la PWA instalada entre llamadas — silencioso.
    } finally {
      deferredRef.current = null;
      setVisible(false);
    }
  };

  const descartar = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* localStorage bloqueado — igual ocultamos visualmente. */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Instalar Mundilex en tu dispositivo"
      className="animate-pop fixed bottom-2 left-2 right-2 z-[60] flex max-w-none items-start gap-3 rounded-2xl border border-amber-400/30 bg-violet-950/90 p-4 shadow-2xl backdrop-blur-md sm:bottom-4 sm:right-4 sm:left-auto sm:max-w-xs"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-lg">
        <Download size={22} className="text-white" strokeWidth={2.5} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-amber-100">Instala Mundilex</p>
        <p className="mt-0.5 text-xs font-semibold leading-snug text-stone-300">
          Acceso rápido desde tu pantalla de inicio. Juega sin navegador.
        </p>

        <div className="mt-2.5 flex items-center gap-3">
          <button
            type="button"
            onClick={instalar}
            className="btn-3d flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-3.5 py-1.5 text-xs font-bold text-violet-950 shadow-md transition-all hover:scale-105"
          >
            <Download size={13} strokeWidth={2.5} /> Instalar
          </button>
          <button
            type="button"
            onClick={descartar}
            className="rounded-xl px-2 py-1.5 text-xs font-bold text-stone-400 transition-colors hover:text-stone-200"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallPrompt;
