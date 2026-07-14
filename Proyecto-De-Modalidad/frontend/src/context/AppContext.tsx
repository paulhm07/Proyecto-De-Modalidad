"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Rol, Usuario } from "@/lib/types";

export type Vista =
  | "login"
  | "dashboard"
  | "asignatura"
  | "modulo"
  | "avatar"
  | "ranking"
  | "perfil"
  | "padre"
  | "maestro"
  | "progreso-estudiante"
  | "contenido"
  | "banco-desafios"
  | "contenido-mined"
  | "pulperia"
  | "camion"
  | "bus"
  | "carta"
  | "atrapa"
  | "monstruo"
  | "silabas";

export interface Toast {
  id: string;
  mensaje: string;
  tipo: "exito" | "error" | "info";
}

interface AppContextValue {
  usuario: Usuario | null;
  vista: Vista;
  moduloId: string | null;
  asignaturaId: string | null;
  rolSeleccionado: Rol;
  estudianteSeleccionadoId: string | null;
  toasts: Toast[];
  setUsuario: (u: Usuario | null) => void;
  setVista: (v: Vista) => void;
  setModuloId: (id: string | null) => void;
  setAsignaturaId: (id: string | null) => void;
  setRolSeleccionado: (r: Rol) => void;
  setEstudianteSeleccionadoId: (id: string | null) => void;
  mostrarToast: (mensaje: string, tipo?: Toast["tipo"]) => void;
  cerrarSesion: () => void;
}

const STORAGE_KEY = "educaplay_usuario";

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuarioState] = useState<Usuario | null>(null);
  const [vista, setVista] = useState<Vista>("login");
  const [moduloId, setModuloId] = useState<string | null>(null);
  const [asignaturaId, setAsignaturaId] = useState<string | null>(null);
  const [rolSeleccionado, setRolSeleccionado] = useState<Rol>("ESTUDIANTE");
  const [estudianteSeleccionadoId, setEstudianteSeleccionadoId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hidratado, setHidratado] = useState(false);

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const u = JSON.parse(raw) as Usuario;
        setUsuarioState(u);
        setVista("dashboard");
        setRolSeleccionado(u.rol);
      }
    } catch {
      /* ignore */
    } finally {
      setHidratado(true);
    }
  }, []);

  const setUsuario = useCallback((u: Usuario | null) => {
    setUsuarioState(u);
    if (u) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } catch {
        /* ignore */
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const mostrarToast = useCallback((mensaje: string, tipo: Toast["tipo"] = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const cerrarSesion = useCallback(() => {
    setUsuarioState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setVista("login");
    setModuloId(null);
    setAsignaturaId(null);
    setEstudianteSeleccionadoId(null);
    setRolSeleccionado("ESTUDIANTE");
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      usuario,
      vista,
      moduloId,
      asignaturaId,
      rolSeleccionado,
      estudianteSeleccionadoId,
      toasts,
      setUsuario,
      setVista,
      setModuloId,
      setAsignaturaId,
      setRolSeleccionado,
      setEstudianteSeleccionadoId,
      mostrarToast,
      cerrarSesion,
    }),
    [
      usuario,
      vista,
      moduloId,
      asignaturaId,
      rolSeleccionado,
      estudianteSeleccionadoId,
      toasts,
      setUsuario,
      mostrarToast,
      cerrarSesion,
    ],
  );

  // Evitar parpadeo de login antes de hidratar localStorage
  if (!hidratado) {
    return null;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp debe usarse dentro de <AppProvider>");
  }
  return ctx;
}
