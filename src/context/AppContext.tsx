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
  | "padre-calificaciones"
  | "padre-asistencia"
  | "padre-avisos"
  | "padre-mensajes"
  | "padre-mensaje-thread"
  | "padre-notificaciones"
  | "padre-vincular"
  | "maestro"
  | "maestro-seccion"
  | "maestro-estudiantes"
  | "maestro-crear-tarea"
  | "maestro-tareas"
  | "maestro-tarea-detalle"
  | "maestro-asistencia"
  | "maestro-reportes"
  | "maestro-reporte-estudiante"
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
  seccionSeleccionadaId: string | null;
  hijoSeleccionadoId: string | null;
  conversacionSeleccionadaId: string | null;
  toasts: Toast[];
  setUsuario: (u: Usuario | null) => void;
  setVista: (v: Vista) => void;
  setModuloId: (id: string | null) => void;
  setAsignaturaId: (id: string | null) => void;
  setRolSeleccionado: (r: Rol) => void;
  setEstudianteSeleccionadoId: (id: string | null) => void;
  setSeccionSeleccionadaId: (id: string | null) => void;
  setHijoSeleccionadoId: (id: string | null) => void;
  setConversacionSeleccionadaId: (id: string | null) => void;
  mostrarToast: (mensaje: string, tipo?: Toast["tipo"]) => void;
  cerrarSesion: () => void;
}

const STORAGE_KEY = "mundilex_usuario";
const LEGACY_STORAGE_KEY = "educaplay_usuario";

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuarioState] = useState<Usuario | null>(null);
  const [vista, setVista] = useState<Vista>("login");
  const [moduloId, setModuloId] = useState<string | null>(null);
  const [asignaturaId, setAsignaturaId] = useState<string | null>(null);
  const [rolSeleccionado, setRolSeleccionado] = useState<Rol>("ESTUDIANTE");
  const [estudianteSeleccionadoId, setEstudianteSeleccionadoId] = useState<string | null>(null);
  const [seccionSeleccionadaId, setSeccionSeleccionadaId] = useState<string | null>(null);
  const [hijoSeleccionadoId, setHijoSeleccionadoId] = useState<string | null>(null);
  const [conversacionSeleccionadaId, setConversacionSeleccionadaId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hidratado, setHidratado] = useState(false);

  // Cargar usuario desde localStorage al montar (con migración de clave legacy)
  useEffect(() => {
    try {
      let raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Migración: si existe la clave antigua de EducaPlay, reutilizarla
        raw = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (raw) {
          localStorage.setItem(STORAGE_KEY, raw);
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        }
      }
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
    setSeccionSeleccionadaId(null);
    setHijoSeleccionadoId(null);
    setConversacionSeleccionadaId(null);
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
      seccionSeleccionadaId,
      hijoSeleccionadoId,
      conversacionSeleccionadaId,
      toasts,
      setUsuario,
      setVista,
      setModuloId,
      setAsignaturaId,
      setRolSeleccionado,
      setEstudianteSeleccionadoId,
      setSeccionSeleccionadaId,
      setHijoSeleccionadoId,
      setConversacionSeleccionadaId,
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
      seccionSeleccionadaId,
      hijoSeleccionadoId,
      conversacionSeleccionadaId,
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
