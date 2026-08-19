"use client";

import { useSyncExternalStore, useState } from "react";
import { WifiOff, X } from "lucide-react";

/**
 * OfflineIndicator
 * --------------------------------------------------
 * Banner flotante que aparece SOLO cuando navigator.onLine === false
 * (o cuando se dispara el evento `offline` del navegador).
 *
 * - Renderiza `null` mientras hay conexión → no ocupa espacio en el layout.
 * - Banner glassmorphism en la parte inferior (encima del footer), con
 *   fondo violeta profundo translúcido + borde amber + texto amber,
 *   icono WifiOff de lucide-react en cuadrado degradado amber→orange.
 * - Botón X discreto para descartar; reaparece si vuelve a dispararse
 *   el evento `offline` (el descarte se resetea al cambiar el estado de
 *   conexión).
 * - En móvil ocupa casi todo el ancho con padding lateral; en desktop
 *   queda centrado con max-w-md.
 * - Animación de entrada: `animate-bounce-in` (definida en globals.css).
 *
 * Implementación: usa `useSyncExternalStore` para suscribirse a los
 * eventos `online`/`offline` del navegador (patrón canónico React 18+,
 * seguro para SSR). El descarte se resetea durante el render cuando
 * cambia el estado de conexión (patrón "adjusting state during render"
 * de la docs de React — sin setState síncrono en effects).
 */

function subscribeOnline(callback: () => void): () => void {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot(): boolean {
  return window.navigator.onLine;
}

function getOnlineServerSnapshot(): boolean {
  // SSR: asumimos online para no mostrar el banner durante la hidratación
  // y evitar mismatch. El estado real se sincroniza al montar en cliente.
  return true;
}

export function OfflineIndicator() {
  const online = useSyncExternalStore(
    subscribeOnline,
    getOnlineSnapshot,
    getOnlineServerSnapshot,
  );

  const [prevOnline, setPrevOnline] = useState(online);
  const [dismissed, setDismissed] = useState(false);

  // Si el estado de conexión cambió desde el render anterior, olvidamos el
  // descarte: si el usuario cerró el aviso y luego vuelve a caer la conexión,
  // el banner reaparecerá.
  if (online !== prevOnline) {
    setPrevOnline(online);
    setDismissed(false);
  }

  // Mientras haya conexión o el usuario haya cerrado el aviso → no renderizar.
  if (online || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-bounce-in fixed bottom-4 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-amber-400/40 bg-violet-950/90 px-4 py-3 shadow-2xl backdrop-blur-md"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
        <WifiOff size={18} className="text-violet-950" strokeWidth={2.5} />
      </div>
      <p className="flex-1 text-sm font-bold leading-snug text-amber-100">
        Sin conexión — Modo offline activo. Tus juegos siguen disponibles.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Cerrar aviso de conexión"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-amber-200/70 transition-colors hover:bg-amber-400/15 hover:text-amber-100"
      >
        <X size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default OfflineIndicator;
