"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Award,
  Trophy,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  Hand,
  X,
  PenLine,
  CalendarDays,
  Target,
  Medal,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { EstadoAsistencia, ReporteEstudiante } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type EstadoAvance = "AL_DIA" | "EN_PROGRESO" | "REZAGADO";

function formatearFechaCorta(fecha: string): string {
  try {
    return new Date(fecha).toLocaleDateString("es-NI", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return fecha;
  }
}

function colorNota(nota: number): { bg: string; texto: string } {
  if (nota >= 70) return { bg: "bg-emerald-100", texto: "text-emerald-700" };
  if (nota >= 50) return { bg: "bg-amber-100", texto: "text-amber-700" };
  return { bg: "bg-rose-100", texto: "text-rose-700" };
}

function configEstado(estado: EstadoAvance): {
  label: string;
  bg: string;
  texto: string;
  icon: typeof Check;
  gradiente: string;
} {
  switch (estado) {
    case "AL_DIA":
      return {
        label: "Al día",
        bg: "bg-emerald-100",
        texto: "text-emerald-700",
        icon: Check,
        gradiente: "from-emerald-400 to-teal-500",
      };
    case "EN_PROGRESO":
      return {
        label: "En progreso",
        bg: "bg-amber-100",
        texto: "text-amber-700",
        icon: Minus,
        gradiente: "from-amber-400 to-orange-500",
      };
    case "REZAGADO":
      return {
        label: "Rezagado",
        bg: "bg-rose-100",
        texto: "text-rose-700",
        icon: TrendingDown,
        gradiente: "from-rose-400 to-fuchsia-500",
      };
  }
}

function configEstadoAsistencia(estado: EstadoAsistencia): {
  label: string;
  bg: string;
  texto: string;
  icon: typeof Check;
} {
  switch (estado) {
    case "PRESENTE":
      return { label: "Presente", bg: "bg-emerald-100", texto: "text-emerald-700", icon: Check };
    case "TARDANZA":
      return { label: "Tardanza", bg: "bg-amber-100", texto: "text-amber-700", icon: Hand };
    case "AUSENTE":
      return { label: "Ausente", bg: "bg-rose-100", texto: "text-rose-700", icon: X };
    case "JUSTIFICADO":
      return { label: "Justificado", bg: "bg-violet-100", texto: "text-violet-700", icon: PenLine };
  }
}

function MedallaIcono({ iconoUrl, size = 28 }: { iconoUrl?: string | null; size?: number }) {
  const esUrl = iconoUrl && (iconoUrl.startsWith("http") || iconoUrl.startsWith("/"));
  const esEmoji = iconoUrl && !esUrl && iconoUrl.length <= 4;
  if (esUrl) {
    return (
      <img
        src={iconoUrl!}
        alt=""
        width={size}
        height={size}
        className="h-auto w-auto"
        style={{ maxWidth: size, maxHeight: size }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }
  if (esEmoji) {
    return <span style={{ fontSize: size }}>{iconoUrl}</span>;
  }
  return <Award size={size} className="text-amber-500" strokeWidth={2.5} />;
}

export function TeacherReporteEstudiante() {
  const { estudianteSeleccionadoId, setVista, mostrarToast } = useApp();
  const [reporte, setReporte] = useState<ReporteEstudiante | null>(null);
  const [cargando, setCargando] = useState(false);
  const [tab, setTab] = useState("progreso");

  useEffect(() => {
    if (!estudianteSeleccionadoId) {
      setReporte(null);
      return;
    }
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const data = await api.obtenerReporteEstudiante(estudianteSeleccionadoId);
        if (cancelado) return;
        setReporte(data);
      } catch (err) {
        if (!cancelado) {
          mostrarToast(err instanceof Error ? err.message : "Error al cargar reporte", "error");
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [estudianteSeleccionadoId, mostrarToast]);

  // Sin estudiante seleccionado
  if (!estudianteSeleccionadoId) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <button
          onClick={() => setVista("maestro-reportes")}
          className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Volver
        </button>
        <div className="card-premium rounded-3xl p-8 text-center">
          <Award size={40} className="mx-auto mb-3 text-amber-300" />
          <p className="text-base font-black text-stone-700">No hay estudiante seleccionado</p>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            Vuelve a la lista de estudiantes para ver el reporte individual.
          </p>
        </div>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <button
          onClick={() => setVista("maestro-reportes")}
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

  if (!reporte) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <button
          onClick={() => setVista("maestro-reportes")}
          className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Volver
        </button>
        <div className="card-premium rounded-3xl p-8 text-center">
          <Award size={40} className="mx-auto mb-3 text-amber-300" />
          <p className="text-base font-black text-stone-700">No se pudo cargar el reporte</p>
        </div>
      </div>
    );
  }

  const est = reporte.estudiante;
  const inicial = est.nombre?.charAt(0)?.toUpperCase() ?? "🧑";
  const estadoCfg = configEstado(reporte.resumen.estadoAvance);
  const EstadoIcon = estadoCfg.icon;
  const pctGlobal = Math.round(reporte.resumen.porcentajeGlobal ?? 0);
  const completados = reporte.resumen.completados ?? 0;
  const totalDesafios = reporte.resumen.totalDesafios ?? 0;
  const ultimosRegistros = reporte.asistencia.registros.slice(0, 10);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <button
        onClick={() => setVista("maestro-reportes")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      {/* Header */}
      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-500 to-rose-500 text-2xl font-black text-white shadow-md">
              {inicial}
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-800">{est.nombre}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-emerald-700">
                  Nivel {est.nivel}
                </span>
                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-700">
                  <Star size={10} strokeWidth={2.5} className="mr-0.5 inline" />
                  {est.puntos} pts
                </span>
              </div>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 self-start rounded-full ${estadoCfg.bg} px-3 py-1.5 text-sm font-black ${estadoCfg.texto} sm:self-auto`}
          >
            <EstadoIcon size={14} strokeWidth={2.75} />
            {estadoCfg.label}
          </span>
        </div>
      </div>

      {/* Resumen global */}
      <div className="card-premium animate-pop mb-6 rounded-3xl p-5 sm:p-6" style={{ animationDelay: "50ms" }}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${estadoCfg.gradiente} shadow-md`}
            >
              <Target size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-stone-500">
                Progreso global
              </p>
              <p className="text-sm font-black text-stone-800">
                {completados} / {totalDesafios} desafíos completados
              </p>
            </div>
          </div>
          <p className="text-3xl font-black text-stone-800">
            {pctGlobal}
            <span className="text-base font-bold text-stone-400">%</span>
          </p>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-stone-200">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${estadoCfg.gradiente} transition-all`}
            style={{ width: `${Math.min(100, pctGlobal)}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-stone-100 p-1.5 sm:flex-nowrap">
          <TabsTrigger
            value="progreso"
            className="rounded-xl px-3 py-2 text-xs font-black data-[state=active]:bg-white data-[state=active]:text-fuchsia-600 data-[state=active]:shadow-sm sm:text-sm"
          >
            Progreso
          </TabsTrigger>
          <TabsTrigger
            value="calificaciones"
            className="rounded-xl px-3 py-2 text-xs font-black data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm sm:text-sm"
          >
            Calificaciones
          </TabsTrigger>
          <TabsTrigger
            value="asistencia"
            className="rounded-xl px-3 py-2 text-xs font-black data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm sm:text-sm"
          >
            Asistencia
          </TabsTrigger>
          <TabsTrigger
            value="medallas"
            className="rounded-xl px-3 py-2 text-xs font-black data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-sm sm:text-sm"
          >
            Medallas
          </TabsTrigger>
        </TabsList>

        {/* === Tab Progreso === */}
        <TabsContent value="progreso">
          {reporte.progresoPorAsignatura.length === 0 ? (
            <div className="card-premium rounded-3xl p-6 text-center">
              <TrendingUp size={32} className="mx-auto mb-2 text-fuchsia-300" />
              <p className="text-sm font-bold text-stone-600">
                No hay progreso registrado todavía.
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {reporte.progresoPorAsignatura.map((asig, i) => (
                <AccordionItem
                  key={asig.id}
                  value={asig.id}
                  className="card-premium animate-pop overflow-hidden rounded-3xl border-0 px-5"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex w-full items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-rose-500 text-sm font-black text-white shadow-md">
                        {asig.nombre?.charAt(0)?.toUpperCase() ?? "📚"}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="truncate text-sm font-black text-stone-800">{asig.nombre}</p>
                        <p className="text-[11px] font-bold text-stone-500">
                          {asig.completados}/{asig.totalDesafios} desafíos ·{" "}
                          <span className="text-fuchsia-600">{Math.round(asig.porcentaje)}%</span>
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mb-4 px-1">
                      <Progress
                        value={Math.round(asig.porcentaje)}
                        className="h-3 [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-fuchsia-400 [&>[data-slot=progress-indicator]]:to-rose-500"
                      />
                    </div>
                    {asig.modulos.length === 0 ? (
                      <p className="px-1 py-2 text-xs font-bold text-stone-500">
                        Sin módulos registrados.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {asig.modulos.map((m) => (
                          <div
                            key={m.id}
                            className="rounded-2xl bg-stone-50 p-3"
                          >
                            <div className="mb-1.5 flex items-center justify-between gap-2">
                              <p className="truncate text-xs font-black text-stone-700">
                                {m.titulo}
                              </p>
                              <span className="shrink-0 text-[11px] font-bold text-stone-500">
                                {m.completados}/{m.totalDesafios} · {Math.round(m.porcentaje)}%
                              </span>
                            </div>
                            <Progress
                              value={Math.round(m.porcentaje)}
                              className="h-2 [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-emerald-400 [&>[data-slot=progress-indicator]]:to-teal-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>

        {/* === Tab Calificaciones === */}
        <TabsContent value="calificaciones">
          <div className="card-premium animate-pop rounded-3xl p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-amber-500" strokeWidth={2.5} />
                <h2 className="text-lg font-black text-stone-800">Calificaciones</h2>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black uppercase tracking-wide text-stone-500">
                  Promedio
                </p>
                <p className="text-2xl font-black text-stone-800">
                  {(reporte.promedioNotas ?? 0).toFixed(1)}
                  <span className="text-sm font-bold text-stone-400"> /100</span>
                </p>
              </div>
            </div>

            {reporte.calificaciones.length === 0 ? (
              <div className="py-6 text-center">
                <Star size={28} className="mx-auto mb-2 text-amber-300" />
                <p className="text-sm font-bold text-stone-500">
                  Aún no hay calificaciones registradas.
                </p>
              </div>
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {reporte.calificaciones.map((c, i) => {
                  const col = colorNota(c.nota);
                  return (
                    <div
                      key={c.id}
                      className="animate-pop flex items-start gap-3 rounded-2xl bg-stone-50 p-3"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${col.bg}`}
                      >
                        <span className={`text-lg font-black ${col.texto}`}>{c.nota}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-stone-800">{c.tarea}</p>
                        {c.seccion && (
                          <p className="truncate text-[11px] font-bold text-stone-500">
                            {c.seccion}
                          </p>
                        )}
                        {c.comentario && (
                          <p className="mt-1 line-clamp-2 text-xs font-semibold text-stone-600">
                            “{c.comentario}”
                          </p>
                        )}
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-stone-400">
                          <CalendarDays size={10} strokeWidth={2.5} />
                          {formatearFechaCorta(c.fecha)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* === Tab Asistencia === */}
        <TabsContent value="asistencia">
          <div className="space-y-4">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <div className="card-premium animate-pop rounded-2xl p-4 text-center" style={{ animationDelay: "0ms" }}>
                <div className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                  <Check size={18} className="text-emerald-600" strokeWidth={2.5} />
                </div>
                <p className="text-2xl font-black text-emerald-600">
                  {reporte.asistencia.presentes}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">
                  Presentes
                </p>
              </div>
              <div className="card-premium animate-pop rounded-2xl p-4 text-center" style={{ animationDelay: "50ms" }}>
                <div className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
                  <Hand size={18} className="text-amber-600" strokeWidth={2.5} />
                </div>
                <p className="text-2xl font-black text-amber-600">
                  {reporte.asistencia.tardanzas}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">
                  Tardanzas
                </p>
              </div>
              <div className="card-premium animate-pop rounded-2xl p-4 text-center" style={{ animationDelay: "100ms" }}>
                <div className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100">
                  <X size={18} className="text-rose-600" strokeWidth={2.5} />
                </div>
                <p className="text-2xl font-black text-rose-600">{reporte.asistencia.ausentes}</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">
                  Ausentes
                </p>
              </div>
              <div className="card-premium animate-pop rounded-2xl p-4 text-center" style={{ animationDelay: "150ms" }}>
                <div className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
                  <PenLine size={18} className="text-violet-600" strokeWidth={2.5} />
                </div>
                <p className="text-2xl font-black text-violet-600">
                  {reporte.asistencia.justificados}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">
                  Justificados
                </p>
              </div>
            </div>

            {/* % asistencia grande */}
            <div className="card-premium animate-pop rounded-3xl p-5 sm:p-6" style={{ animationDelay: "100ms" }}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md">
                    <Check size={20} className="text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-stone-500">
                      % Asistencia
                    </p>
                    <p className="text-sm font-black text-stone-800">
                      {reporte.asistencia.total} registros en total
                    </p>
                  </div>
                </div>
                <p className="text-3xl font-black text-emerald-600">
                  {Math.round(reporte.asistencia.porcentaje)}
                  <span className="text-base font-bold text-stone-400">%</span>
                </p>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all"
                  style={{
                    width: `${Math.min(100, Math.round(reporte.asistencia.porcentaje))}%`,
                  }}
                />
              </div>
            </div>

            {/* Últimos registros */}
            <div className="card-premium animate-pop rounded-3xl p-5 sm:p-6" style={{ animationDelay: "150ms" }}>
              <div className="mb-3 flex items-center gap-2">
                <CalendarDays size={18} className="text-emerald-500" strokeWidth={2.5} />
                <h3 className="text-base font-black text-stone-800">Últimos registros</h3>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                  {ultimosRegistros.length}
                </span>
              </div>
              {ultimosRegistros.length === 0 ? (
                <p className="py-4 text-center text-sm font-bold text-stone-500">
                  No hay registros de asistencia todavía.
                </p>
              ) : (
                <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                  {ultimosRegistros.map((r, i) => {
                    const cfg = configEstadoAsistencia(r.estado);
                    const EIcon = cfg.icon;
                    return (
                      <div
                        key={r.id}
                        className="flex items-center gap-3 rounded-2xl bg-stone-50 p-3"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}
                        >
                          <EIcon size={16} className={cfg.texto} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-black ${cfg.texto}`}>{cfg.label}</p>
                          {r.observacion && (
                            <p className="truncate text-[11px] font-semibold text-stone-500">
                              {r.observacion}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-[11px] font-bold text-stone-400">
                          {formatearFechaCorta(r.fecha)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* === Tab Medallas === */}
        <TabsContent value="medallas">
          {reporte.medallas.length === 0 ? (
            <div className="card-premium rounded-3xl p-6 text-center">
              <Trophy size={32} className="mx-auto mb-2 text-amber-300" />
              <p className="text-sm font-bold text-stone-600">
                Aún no ha ganado medallas. ¡A seguir practicando!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {reporte.medallas.map((m, i) => (
                <div
                  key={m.id}
                  className="card-premium animate-pop flex flex-col items-center rounded-3xl p-4 text-center"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
                    <MedallaIcono iconoUrl={m.iconoUrl} size={28} />
                  </div>
                  <p className="text-sm font-black text-stone-800">{m.titulo}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-stone-500">{m.descripcion}</p>
                  <span className="mt-2 inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    <Medal size={10} strokeWidth={2.5} />
                    {formatearFechaCorta(m.ganadaEn)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
