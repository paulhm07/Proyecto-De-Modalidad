"use client";

import { ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { AlimentaMonstruo } from "@/components/AlimentaMonstruo";

/**
 * Wrapper de navegación para el minijuego "Alimenta al Monstruo".
 * Botón "Salir" tono naranja que devuelve al dashboard.
 */
export function AlimentaMonstruoWrapper() {
  const { setVista } = useApp();

  const salir = () => {
    setVista("dashboard");
  };

  return (
    <div className="relative">
      <button
        onClick={salir}
        className="fixed left-3 top-16 z-30 flex items-center gap-1.5 rounded-xl border-2 border-orange-400 bg-white/90 px-3 py-2 text-sm font-bold text-orange-700 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-orange-50 active:scale-95 sm:left-4 sm:top-20"
        aria-label="Salir del minijuego y volver al inicio"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        Salir
      </button>

      <AlimentaMonstruo />
    </div>
  );
}
