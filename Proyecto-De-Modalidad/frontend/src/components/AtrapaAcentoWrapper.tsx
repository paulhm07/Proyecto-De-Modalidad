"use client";

import { ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AtrapaAcento } from "@/components/AtrapaAcento";

/**
 * Wrapper de navegación para el minijuego "Atrapa el Acento".
 * Incluye un botón "Salir" (tono fuchsia/violeta) que devuelve al dashboard,
 * y monta el componente principal del juego dentro del layout cálido del minijuego.
 */
export function AtrapaAcentoWrapper() {
  const { setVista } = useApp();

  const salir = () => {
    // Cancelar cualquier narración en curso antes de salir.
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* noop */
      }
    }
    setVista("dashboard");
  };

  return (
    <div className="relative">
      {/* Botón Salir — flotante arriba a la izquierda, tono fuchsia/violeta */}
      <button
        onClick={salir}
        className="fixed left-3 top-16 z-30 flex items-center gap-1.5 rounded-xl border-2 border-fuchsia-400 bg-white/90 px-3 py-2 text-sm font-bold text-fuchsia-800 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-fuchsia-50 active:scale-95 sm:left-4 sm:top-20"
        aria-label="Salir del minijuego y volver al inicio"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        Salir
      </button>

      <AtrapaAcento />
    </div>
  );
}
