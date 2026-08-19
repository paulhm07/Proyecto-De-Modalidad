"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Eye,
  ListChecks,
  Loader2,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { Seccion, Tarea } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TAREA_SEL_KEY = "mundilex_tarea_sel";

function truncate(s: string | null | undefined, n = 80): string {
  if (!s) return "";
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-NI", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function TeacherTareas() {
  const { usuario, setVista, seccionSeleccionadaId, mostrarToast } = useApp();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [seccionActiva, setSeccionActiva] = useState<Seccion | null>(null);
  const [cargando, setCargando] = useState(true);
  const [operandoId, setOperandoId] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    try {
      if (seccionSeleccionadaId) {
        const [ts, sec] = await Promise.all([
          api.obtenerTareasSeccion(seccionSeleccionadaId),
          api.obtenerSeccion(seccionSeleccionadaId).catch(() => null),
        ]);
        setTareas(ts);
        setSeccionActiva(sec);
      } else {
        // Sin sección seleccionada: traer tareas de todas las secciones del maestro
        const secciones = await api.obtenerSeccionesMaestro(usuario.id);
        const listas = await Promise.all(
          secciones.map((s) =>
            api.obtenerTareasSeccion(s.id).catch(() => [] as Tarea[]),
          ),
        );
        const todas = listas.flat();
        // Ordenar por fecha asignada descendente (más recientes primero)
        todas.sort(
          (a, b) =>
            new Date(b.fechaAsignada).getTime() -
            new Date(a.fechaAsignada).getTime(),
        );
        setTareas(todas);
        setSeccionActiva(null);
      }
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al cargar tareas",
        "error",
      );
    } finally {
      setCargando(false);
    }
  }, [usuario, seccionSeleccionadaId, mostrarToast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const verDetalle = (id: string) => {
    try {
      localStorage.setItem(TAREA_SEL_KEY, id);
    } catch {
      /* ignore */
    }
    setVista("maestro-tarea-detalle");
  };

  const cerrar = async (id: string) => {
    setOperandoId(id);
    try {
      await api.cerrarTarea(id);
      mostrarToast("✅ Tarea cerrada", "exito");
      cargar();
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al cerrar tarea",
        "error",
      );
    } finally {
      setOperandoId(null);
    }
  };

  const eliminar = async (id: string) => {
    setOperandoId(id);
    try {
      await api.eliminarTarea(id);
      mostrarToast("Tarea eliminada", "info");
      cargar();
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al eliminar tarea",
        "error",
      );
    } finally {
      setOperandoId(null);
    }
  };

  if (!usuario) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <button
        onClick={() => setVista("maestro-seccion")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      {/* Header */}
      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 shadow-md">
              <ClipboardList size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-800">Tareas</h1>
              <p className="text-sm font-semibold text-stone-600">
                {seccionActiva
                  ? `Sección: ${seccionActiva.nombre}`
                  : "Todas las tareas de tus secciones"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setVista("maestro-crear-tarea")}
            className="btn-3d flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105"
          >
            <Plus size={16} strokeWidth={2.5} /> Crear tarea
          </button>
        </div>
      </div>

      {/* Contenido */}
      {cargando ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : tareas.length === 0 ? (
        <div className="card-premium rounded-3xl p-8 text-center">
          <ClipboardList size={40} className="mx-auto mb-3 text-orange-300" />
          <p className="text-base font-black text-stone-800">Aún no hay tareas</p>
          <p className="mt-1 text-sm font-semibold text-stone-600">
            {seccionSeleccionadaId
              ? "Crea la primera tarea para esta sección."
              : "Crea tu primera tarea desde cualquiera de tus secciones."}
          </p>
          <button
            onClick={() => setVista("maestro-crear-tarea")}
            className="btn-3d mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105"
          >
            <Plus size={16} strokeWidth={2.5} /> Crear tarea
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tareas.map((t, i) => {
            const activa = t.estado === "ACTIVA";
            const operando = operandoId === t.id;
            return (
              <div
                key={t.id}
                className="card-premium animate-pop rounded-3xl p-5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-stone-800">
                        {t.titulo}
                      </h3>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                          activa
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {t.estado}
                      </span>
                    </div>
                    {t.descripcion && (
                      <p className="mt-1 text-sm font-medium text-stone-600">
                        {truncate(t.descripcion, 120)}
                      </p>
                    )}
                    {t.desafio && (
                      <p className="mt-2 rounded-xl bg-white/50 px-3 py-2 text-xs font-medium text-stone-600">
                        <span className="font-bold text-stone-700">
                          Desafío:
                        </span>{" "}
                        {truncate(t.desafio.pregunta, 90)}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                      <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-orange-700">
                        <Calendar
                          size={10}
                          strokeWidth={2.5}
                          className="mr-0.5 inline"
                        />
                        {formatDate(t.fechaLimite)}
                      </span>
                      <span className="rounded-full bg-fuchsia-100 px-1.5 py-0.5 text-fuchsia-700">
                        <ListChecks
                          size={10}
                          strokeWidth={2.5}
                          className="mr-0.5 inline"
                        />
                        {t._count?.entregas ?? 0} entregas
                      </span>
                      <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-violet-700">
                        <CheckCircle2
                          size={10}
                          strokeWidth={2.5}
                          className="mr-0.5 inline"
                        />
                        {t._count?.calificaciones ?? 0} calif.
                      </span>
                      {t.seccion && (
                        <span className="rounded-full bg-teal-100 px-1.5 py-0.5 text-teal-700">
                          {t.seccion.nombre}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => verDetalle(t.id)}
                      className="btn-3d flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                    >
                      <Eye size={13} strokeWidth={2.5} /> Ver detalle
                    </button>

                    {activa && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            disabled={operando}
                            className="flex items-center gap-1 rounded-xl border-2 border-amber-200 bg-white px-3 py-2 text-xs font-bold text-amber-700 transition-all hover:scale-105 hover:bg-amber-50 disabled:opacity-60"
                          >
                            <Lock size={13} strokeWidth={2.5} /> Cerrar
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ¿Cerrar esta tarea?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Una vez cerrada, los estudiantes ya no podrán
                              entregar respuestas. Puedes seguir calificando las
                              entregas existentes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => cerrar(t.id)}
                              className="bg-amber-500 text-white hover:bg-amber-600"
                            >
                              Sí, cerrar tarea
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          disabled={operando}
                          className="rounded-xl border-2 border-rose-200 bg-white p-2 text-rose-500 transition-all hover:scale-105 hover:bg-rose-50 disabled:opacity-60"
                          aria-label="Eliminar tarea"
                        >
                          {operando ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} strokeWidth={2.5} />
                          )}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Eliminar tarea?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se borrarán las
                            entregas y calificaciones asociadas a esta tarea.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => eliminar(t.id)}
                            className="bg-rose-500 text-white hover:bg-rose-600"
                          >
                            Sí, eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
