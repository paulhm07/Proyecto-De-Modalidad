"use client";

import { ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PulperiaFracciones } from "@/components/PulperiaFracciones";

/**
 * Wrapper de navegación para el minijuego "La Pulpería de Fracciones".
 * Incluye un botón "Salir" que devuelve al dashboard, y monta el
 * componente principal del juego dentro del layout cálido del minijuego.
 */
export function PulperiaFraccionesWrapper() {
  const { setVista } = useApp();

  const salir = () => {
    setVista("dashboard");
  };

  return (
    <div className="relative">
      {/* Botón Salir — flotante arriba a la izquierda, sobre el fondo cálido */}
      <button
        onClick={salir}
        className="fixed left-3 top-16 z-30 flex items-center gap-1.5 rounded-xl border-2 border-orange-300 bg-white/90 px-3 py-2 text-sm font-bold text-orange-800 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-orange-50 active:scale-95 sm:left-4 sm:top-20"
        aria-label="Salir del minijuego y volver al inicio"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        Salir
      </button>

      <PulperiaFracciones />
    </div>
  );
}
