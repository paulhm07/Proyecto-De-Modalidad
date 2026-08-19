"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Loader2,
  MessageSquare,
  Save,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type {
  Calificacion,
  EntregaTarea,
  Tarea,
} from "@/lib/types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const TAREA_SEL_KEY = "mundilex_tarea_sel";

// La API retorna el desafío con opciones incluidas (extiende el tipo Tarea.desafio)
interface DesafioConOpciones {
  id: string;
  pregunta: string;
  puntos: number;
  opciones: { id: string; texto: string }[];
}

interface TareaDetalle extends Tarea {
  entregas: EntregaTarea[];
  calificaciones: Calificacion[];
}

interface EstudianteSeccion {
  id: string;
  nombre: string;
  puntos?: number;
  experiencia?: number;
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

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("es-NI", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function TeacherTareaDetalle() {
  const { usuario, setVista, mostrarToast } = useApp();
  const [tarea, setTarea] = useState<TareaDetalle | null>(null);
  const [estudiantes, setEstudiantes] = useState<EstudianteSeccion[]>([]);
  const [cargando, setCargando] = useState(true);
  // notas[estudianteId] = { nota: string, comentario: string }
  const [notas, setNotas] = useState<
    Record<string, { nota: string; comentario: string }>
  >({});
  const [guardandoId, setGuardandoId] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    let id: string | null = null;
    try {
      id = localStorage.getItem(TAREA_SEL_KEY);
    } catch {
      /* ignore */
    }
    if (!id) {
      mostrarToast("No hay tarea seleccionada", "error");
      setVista("maestro-tareas");
      return;
    }
    setCargando(true);
    try {
      const t = (await api.obtenerTarea(id)) as TareaDetalle;
      setTarea(t);
      // Cargar estudiantes de la sección para la pestaña "Calificar"
      const ests = await api
        .obtenerEstudiantesSeccion(t.seccionId)
        .catch(() => [] as EstudianteSeccion[]);
      setEstudiantes(ests);

      // Inicializar formulario de calificaciones con valores existentes
      const init: Record<string, { nota: string; comentario: string }> = {};
      for (const c of t.calificaciones ?? []) {
        init[c.estudianteId] = {
          nota: String(c.nota),
          comentario: c.comentario ?? "",
        };
      }
      for (const e of ests) {
        if (!init[e.id]) init[e.id] = { nota: "", comentario: "" };
      }
      setNotas(init);
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al cargar tarea",
        "error",
      );
    } finally {
      setCargando(false);
    }
  }, [mostrarToast, setVista]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const entregasPorEstudiante = useMemo(() => {
    const m: Record<string, EntregaTarea> = {};
    for (const e of tarea?.entregas ?? []) m[e.estudianteId] = e;
    return m;
  }, [tarea]);

  const calificacionesPorEstudiante = useMemo(() => {
    const m: Record<string, Calificacion> = {};
    for (const c of tarea?.calificaciones ?? []) m[c.estudianteId] = c;
    return m;
  }, [tarea]);

  const guardarNota = async (estudianteId: string) => {
    if (!usuario || !tarea) return;
    const n = notas[estudianteId];
    if (!n || !n.nota.trim()) {
      mostrarToast("Ingresa una nota entre 0 y 100", "error");
      return;
    }
    const notaNum = Number(n.nota);
    if (Number.isNaN(notaNum) || notaNum < 0 || notaNum > 100) {
      mostrarToast("La nota debe estar entre 0 y 100", "error");
      return;
    }
    setGuardandoId(estudianteId);
    try {
      await api.registrarCalificacion({
        tareaId: tarea.id,
        estudianteId,
        nota: notaNum,
        comentario: n.comentario.trim() || undefined,
        maestroId: usuario.id,
      });
      mostrarToast("✅ Calificación guardada", "exito");
      // Recargar para reflejar la calificación persistida
      await cargar();
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al guardar nota",
        "error",
      );
    } finally {
      setGuardandoId(null);
    }
  };

  if (!usuario) return null;

  if (cargando) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <button
          onClick={() => setVista("maestro-tareas")}
          className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Volver
        </button>
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  if (!tarea) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <button
          onClick={() => setVista("maestro-tareas")}
          className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Volver
        </button>
        <div className="card-premium rounded-3xl p-8 text-center">
          <ClipboardList size={40} className="mx-auto mb-3 text-orange-300" />
          <p className="text-base font-black text-stone-800">
            No se pudo cargar la tarea
          </p>
        </div>
      </div>
    );
  }

  const desafio = (tarea.desafio ?? null) as DesafioConOpciones | null;
  const activa = tarea.estado === "ACTIVA";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <button
        onClick={() => setVista("maestro-tareas")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      {/* Header */}
      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 shadow-md">
              <ClipboardList
                size={24}
                className="text-white"
                strokeWidth={2.5}
              />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-black text-stone-800 sm:text-2xl">
                {tarea.titulo}
              </h1>
              <p className="text-sm font-semibold text-stone-600">
                {tarea.seccion?.nombre ?? "Sección"}
              </p>
            </div>
          </div>
          <span
            className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
              activa
                ? "bg-emerald-100 text-emerald-700"
                : "bg-stone-200 text-stone-600"
            }`}
          >
            {tarea.estado}
          </span>
        </div>

        {tarea.descripcion && (
          <p className="mt-3 text-sm font-medium text-stone-600">
            {tarea.descripcion}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
          <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-orange-700">
            <Calendar
              size={10}
              strokeWidth={2.5}
              className="mr-0.5 inline"
            />
            {formatDate(tarea.fechaLimite)}
          </span>
          <span className="rounded-full bg-fuchsia-100 px-1.5 py-0.5 text-fuchsia-700">
            <CheckCircle2
              size={10}
              strokeWidth={2.5}
              className="mr-0.5 inline"
            />
            {tarea.entregas.length} entregas
          </span>
          <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-violet-700">
            <Star
              size={10}
              strokeWidth={2.5}
              className="mr-0.5 inline"
            />
            {tarea.calificaciones.length} calif.
          </span>
          <span className="rounded-full bg-teal-100 px-1.5 py-0.5 text-teal-700">
            <Users
              size={10}
              strokeWidth={2.5}
              className="mr-0.5 inline"
            />
            {estudiantes.length} estudiantes
          </span>
        </div>
      </div>

      {/* Desafío asociado */}
      {desafio && (
        <div className="card-premium mb-6 rounded-3xl p-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <BookOpen size={18} className="text-violet-500" strokeWidth={2.5} />
            <h2 className="text-base font-black text-stone-800">
              Desafío asociado
            </h2>
            <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">
              {desafio.puntos} pts
            </span>
          </div>
          <p className="text-sm font-bold text-stone-700">{desafio.pregunta}</p>
          {desafio.opciones && desafio.opciones.length > 0 && (
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {desafio.opciones.map((o, i) => (
                <li
                  key={o.id}
                  className="rounded-xl bg-white/60 px-3 py-2 text-xs font-bold text-stone-700"
                >
                  <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-200 text-[10px] text-violet-800">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {o.texto}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="entregas" className="space-y-3">
        <TabsList className="h-auto rounded-2xl bg-white/60 p-1">
          <TabsTrigger
            value="entregas"
            className="rounded-xl px-4 py-2 text-sm font-bold text-stone-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-fuchsia-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
          >
            <CheckCircle2 size={14} strokeWidth={2.5} className="mr-1" />
            Entregas ({tarea.entregas.length})
          </TabsTrigger>
          <TabsTrigger
            value="calificar"
            className="rounded-xl px-4 py-2 text-sm font-bold text-stone-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
          >
            <Star size={14} strokeWidth={2.5} className="mr-1" />
            Calificar ({estudiantes.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab: Entregas */}
        <TabsContent value="entregas">
          <div className="card-premium rounded-3xl p-4 sm:p-6">
            {tarea.entregas.length === 0 ? (
              <div className="py-6 text-center">
                <CheckCircle2
                  size={32}
                  className="mx-auto mb-2 text-fuchsia-300"
                />
                <p className="text-sm font-bold text-stone-600">
                  Aún no hay entregas registradas para esta tarea.
                </p>
              </div>
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {tarea.entregas.map((e, i) => {
                  const tieneResultado =
                    e.correcta === true || e.correcta === false;
                  return (
                    <div
                      key={e.id}
                      className="animate-pop flex flex-wrap items-center gap-3 rounded-2xl bg-white/50 p-3.5"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-rose-500 text-xs font-black text-white">
                        {e.estudiante?.nombre?.charAt(0)?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-stone-800">
                          {e.estudiante?.nombre ?? "Estudiante"}
                        </p>
                        <p className="text-[11px] font-medium text-stone-500">
                          <Clock
                            size={10}
                            strokeWidth={2.5}
                            className="mr-0.5 inline"
                          />
                          {formatDateTime(e.entregadaEn)}
                        </p>
                      </div>
                      {e.tarde && (
                        <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                          Tardía
                        </span>
                      )}
                      {tieneResultado &&
                        (e.correcta ? (
                          <span className="flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                            <CheckCircle2 size={11} strokeWidth={2.5} />{" "}
                            Correcta
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                            <XCircle size={11} strokeWidth={2.5} /> Incorrecta
                          </span>
                        ))}
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                        <Star
                          size={10}
                          strokeWidth={2.5}
                          className="mr-0.5 inline"
                        />
                        {e.puntosGanados} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab: Calificar */}
        <TabsContent value="calificar">
          <div className="card-premium rounded-3xl p-4 sm:p-6">
            {estudiantes.length === 0 ? (
              <div className="py-6 text-center">
                <Users size={32} className="mx-auto mb-2 text-fuchsia-300" />
                <p className="text-sm font-bold text-stone-600">
                  No hay estudiantes inscritos en esta sección.
                </p>
              </div>
            ) : (
              <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                {estudiantes.map((est, i) => {
                  const existente = calificacionesPorEstudiante[est.id];
                  const entrega = entregasPorEstudiante[est.id];
                  const n = notas[est.id] ?? { nota: "", comentario: "" };
                  const guardandoEste = guardandoId === est.id;
                  return (
                    <div
                      key={est.id}
                      className="animate-pop rounded-2xl bg-white/50 p-3.5"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      {/* Encabezado de estudiante */}
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-black text-white">
                          {est.nombre?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <p className="min-w-0 flex-1 truncate text-sm font-black text-stone-800">
                          {est.nombre}
                        </p>
                        {entrega && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              entrega.correcta === true
                                ? "bg-emerald-100 text-emerald-700"
                                : entrega.correcta === false
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            {entrega.correcta === true
                              ? "Entregó ✓"
                              : entrega.correcta === false
                                ? "Entregó ✗"
                                : "Entregó"}
                          </span>
                        )}
                        {existente && (
                          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                            <Star
                              size={10}
                              strokeWidth={2.5}
                              className="mr-0.5 inline"
                            />
                            {existente.nota}
                          </span>
                        )}
                      </div>

                      {/* Inputs de calificación */}
                      <div className="grid gap-2 sm:grid-cols-[120px_1fr]">
                        <div className="relative">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={1}
                            value={n.nota}
                            onChange={(ev) =>
                              setNotas((prev) => ({
                                ...prev,
                                [est.id]: {
                                  ...n,
                                  nota: ev.target.value,
                                },
                              }))
                            }
                            placeholder="0-100"
                            className="w-full rounded-xl border-2 border-orange-200 bg-white px-3 py-2 pr-8 text-sm font-bold text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                          />
                          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">
                            /100
                          </span>
                        </div>
                        <div className="relative">
                          <MessageSquare
                            size={12}
                            strokeWidth={2.5}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                          />
                          <input
                            type="text"
                            value={n.comentario}
                            onChange={(ev) =>
                              setNotas((prev) => ({
                                ...prev,
                                [est.id]: {
                                  ...n,
                                  comentario: ev.target.value,
                                },
                              }))
                            }
                            placeholder="Comentario (opcional)"
                            maxLength={300}
                            className="w-full rounded-xl border-2 border-orange-200 bg-white px-3 py-2 pl-8 text-sm font-medium text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                          />
                        </div>
                      </div>

                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => guardarNota(est.id)}
                          disabled={guardandoEste}
                          className="btn-3d flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:scale-105 disabled:opacity-60"
                        >
                          {guardandoEste ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Save size={12} strokeWidth={2.5} />
                          )}
                          {existente ? "Actualizar" : "Guardar"} nota
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
