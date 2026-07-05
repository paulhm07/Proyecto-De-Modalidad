"use client";

import { ArrowLeft } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { CartaOrtografia } from "@/components/CartaOrtografia";

/**
 * Wrapper de navegación para el minijuego "La Carta Mal Enviada".
 * Incluye un botón "Salir" (tono ámbar/terracota) que devuelve al dashboard,
 * y monta el componente principal del juego dentro del layout cálido del minijuego.
 */
export function CartaOrtografiaWrapper() {
  const { setVista } = useApp();

  const salir = () => {
    setVista("dashboard");
  };

  return (
    <div className="relative">
      {/* Botón Salir — flotante arriba a la izquierda, tono ámbar/terracota */}
      <button
        onClick={salir}
        className="fixed left-3 top-16 z-30 flex items-center gap-1.5 rounded-xl border-2 border-amber-400 bg-white/90 px-3 py-2 text-sm font-bold text-amber-800 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-amber-50 active:scale-95 sm:left-4 sm:top-20"
        aria-label="Salir del minijuego y volver al inicio"
      >
        <ArrowLeft size={16} strokeWidth={2.5} />
        Salir
      </button>

      <CartaOrtografia />
    </div>
  );
}
