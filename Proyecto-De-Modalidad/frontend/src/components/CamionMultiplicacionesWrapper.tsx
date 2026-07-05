"use client";

import { ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { CamionMultiplicaciones } from "@/components/CamionMultiplicaciones";

/**
 * Wrapper de navegación para el minijuego "El Camión de las Multiplicaciones".
 * Incluye un botón "Salir" que devuelve al dashboard, y monta el
 * componente principal del juego dentro del layout cálido del minijuego.
 */
export function CamionMultiplicacionesWrapper() {
  const { setVista } = useApp();

  const salir = () => {
    setVista("dashboard");
  };

  return (
    <div className="relative">
      {/* Botón Salir — flotante arriba a la izquierda, tono teal/verde */}
      <button
        onClick={salir}
        className="fixed left-3 top-16 z-30 flex items-center gap-1.5 rounded-xl border-2 border-teal-300 bg-white/90 px-3 py-2 text-sm font-bold text-teal-800 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-teal-50 active:scale-95 sm:left-4 sm:top-20"
        aria-label="Salir del minijuego y volver al inicio"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        Salir
      </button>

      <CamionMultiplicaciones />
    </div>
  );
}
