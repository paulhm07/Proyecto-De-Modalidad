"use client";

import { ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { CazadorSilabas } from "@/components/CazadorSilabas";

/**
 * Wrapper de navegación para el minijuego "Cazador de Sílabas".
 * Botón "Salir" tono azul que devuelve al dashboard.
 */
export function CazadorSilabasWrapper() {
  const { setVista } = useApp();

  const salir = () => {
    setVista("dashboard");
  };

  return (
    <div className="relative">
      <button
        onClick={salir}
        className="fixed left-3 top-16 z-30 flex items-center gap-1.5 rounded-xl border-2 border-blue-400 bg-white/90 px-3 py-2 text-sm font-bold text-blue-700 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-blue-50 active:scale-95 sm:left-4 sm:top-20"
        aria-label="Salir del minijuego y volver al inicio"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        Salir
      </button>

      <CazadorSilabas />
    </div>
  );
}
