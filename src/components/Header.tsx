"use client";

import { useState } from "react";
import { Sparkles, Trophy, User, BookOpen, Home, LogOut, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useApp, type Vista } from "@/context/AppContext";
import type { Rol } from "@/lib/types";

interface NavItem {
  label: string;
  vista: Vista;
  icon: React.ReactNode;
}

const NAV_BY_ROL: Record<Rol, NavItem[]> = {
  ESTUDIANTE: [
    { label: "Inicio", vista: "dashboard", icon: <Home size={16} strokeWidth={2.5} /> },
    { label: "Avatar", vista: "avatar", icon: <Sparkles size={16} strokeWidth={2.5} /> },
    { label: "Ranking", vista: "ranking", icon: <Trophy size={16} strokeWidth={2.5} /> },
    { label: "Perfil", vista: "perfil", icon: <User size={16} strokeWidth={2.5} /> },
  ],
  PADRE: [
    { label: "Inicio", vista: "dashboard", icon: <Home size={16} strokeWidth={2.5} /> },
    { label: "Perfil", vista: "perfil", icon: <User size={16} strokeWidth={2.5} /> },
  ],
  MAESTRO: [
    { label: "Inicio", vista: "dashboard", icon: <Home size={16} strokeWidth={2.5} /> },
    { label: "Contenido", vista: "contenido", icon: <BookOpen size={16} strokeWidth={2.5} /> },
    { label: "Perfil", vista: "perfil", icon: <User size={16} strokeWidth={2.5} /> },
  ],
};

export function Header() {
  const { usuario, vista, setVista, cerrarSesion } = useApp();
  const [menuAbierto, setMenuAbierto] = useState(false);
  if (!usuario) return null;

  const items = NAV_BY_ROL[usuario.rol] ?? [];

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-400/25 bg-violet-950/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <button
          onClick={() => setVista("dashboard")}
          className="transition-transform hover:scale-105"
          aria-label="Ir al inicio"
        >
          <Logo size={40} variant="horizontal" />
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {items.map((item) => {
            const activo = vista === item.vista;
            return (
              <button
                key={item.vista}
                onClick={() => setVista(item.vista)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition-all hover:scale-105 ${
                  activo
                    ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-white shadow-md shadow-cyan-500/30"
                    : "text-cyan-100/70 hover:bg-cyan-400/10 hover:text-cyan-100"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200 sm:inline">
            {usuario.nombre}
          </span>
          <button
            onClick={cerrarSesion}
            className="flex items-center gap-1.5 rounded-xl border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm font-bold text-rose-200 transition-all hover:scale-105 hover:bg-rose-400/20"
          >
            <LogOut size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">Salir</span>
          </button>
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            className="rounded-xl bg-cyan-400/10 p-2 text-cyan-200 sm:hidden"
            aria-label="Abrir menú"
          >
            {menuAbierto ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuAbierto && (
        <nav className="flex flex-col gap-1 border-t border-cyan-400/20 bg-violet-950/80 px-4 py-3 backdrop-blur-xl sm:hidden">
          {items.map((item) => {
            const activo = vista === item.vista;
            return (
              <button
                key={item.vista}
                onClick={() => {
                  setVista(item.vista);
                  setMenuAbierto(false);
                }}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                  activo
                    ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-white"
                    : "text-cyan-100/70 hover:bg-cyan-400/10 hover:text-cyan-100"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
