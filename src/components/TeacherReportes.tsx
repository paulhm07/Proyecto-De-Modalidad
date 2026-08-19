"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Loader2,
  Users,
  Star,
  ClipboardList,
  Percent,
  ChevronRight,
  Award,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { ResumenSeccion, Seccion } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MetricaCard {
  key: string;
  label: string;
  valor: string;
  icon: typeof Users;
  gradiente: string;
  suffix?: string;
}

export function TeacherReportes() {
  const {
    usuario,
    setVista,
    seccionSeleccionadaId,
    setSeccionSeleccionadaId,
    setEstudianteSeleccionadoId,
    mostrarToast,
  } = useApp();

  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [cargandoSecciones, setCargandoSecciones] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState<Seccion | null>(null);

  const [resumen, setResumen] = useState<ResumenSeccion | null>(null);
  const [cargando, setCargando] = useState(false);

  // Cargar secciones
  useEffect(() => {
    if (!usuario) return;
    let cancelado = false;
    (async () => {
      setCargandoSecciones(true);
      try {
        const list = await api.obtenerSeccionesMaestro(usuario.id);
        if (cancelado) return;
        setSecciones(list);
      } catch (err) {
        if (!cancelado) {
          mostrarToast(err instanceof Error ? err.message : "Error al cargar secciones", "error");
        }
      } finally {
        if (!cancelado) setCargandoSecciones(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [usuario, mostrarToast]);

  // Resolver sección activa
  useEffect(() => {
    if (seccionSeleccionadaId && secciones.length > 0) {
      const found = secciones.find((s) => s.id === seccionSeleccionadaId) ?? null;
      setSeccionActiva(found);
    } else if (!seccionSeleccionadaId) {
      setSeccionActiva(null);
    }
  }, [seccionSeleccionadaId, secciones]);

  // Cargar resumen de la sección seleccionada
  useEffect(() => {
    if (!seccionSeleccionadaId) {
      setResumen(null);
      return;
    }
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const data = await api.obtenerResumenSeccion(seccionSeleccionadaId);
        if (cancelado) return;
        setResumen(data);
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
  }, [seccionSeleccionadaId, mostrarToast]);

  const verReporteEstudiante = (id: string) => {
    setEstudianteSeleccionadoId(id);
    setVista("maestro-reporte-estudiante");
  };

  // === Selector de sección ===
  if (!seccionSeleccionadaId) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <button
          onClick={() => setVista("maestro")}
          className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Volver
        </button>

        <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 shadow-md">
              <BarChart3 size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-800">Reportes de sección</h1>
              <p className="text-sm font-semibold text-stone-600">
                Selecciona una sección para ver el reporte grupal.
              </p>
            </div>
          </div>
        </div>

        {cargandoSecciones ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : secciones.length === 0 ? (
          <div className="card-premium rounded-3xl p-6 text-center">
            <Users size={32} className="mx-auto mb-2 text-fuchsia-300" />
            <p className="text-sm font-bold text-stone-600">
              No tienes secciones asignadas todavía.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {secciones.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setSeccionSeleccionadaId(s.id)}
                className="card-premium animate-pop group flex items-center gap-4 rounded-3xl p-5 text-left transition-all hover:scale-[1.02]"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-rose-500 text-lg font-black text-white shadow-md">
                  {s.nombre?.charAt(0)?.toUpperCase() ?? "📊"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-base font-black text-stone-800">{s.nombre}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                    <span className="rounded-full bg-fuchsia-100 px-1.5 py-0.5 text-fuchsia-700">
                      Grado {s.grado}
                    </span>
                    <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-stone-600">
                      {s._count?.inscripciones ?? 0} estudiantes
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-stone-400 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const metricas: MetricaCard[] = resumen
    ? [
        {
          key: "progreso",
          label: "Promedio Progreso",
          valor: String(Math.round(resumen.promedioProgreso ?? 0)),
          icon: BarChart3,
          gradiente: "from-fuchsia-500 to-rose-500",
          suffix: "%",
        },
        {
          key: "notas",
          label: "Promedio Notas",
          valor: (resumen.promedioNotas ?? 0).toFixed(1),
          icon: Star,
          gradiente: "from-amber-500 to-orange-500",
        },
        {
          key: "asistencia",
          label: "% Asistencia",
          valor: String(Math.round(resumen.porcentajeAsistencia ?? 0)),
          icon: Percent,
          gradiente: "from-emerald-500 to-teal-500",
          suffix: "%",
        },
        {
          key: "total",
          label: "Total Estudiantes",
          valor: String(resumen.totalEstudiantes ?? 0),
          icon: Users,
          gradiente: "from-violet-500 to-fuchsia-500",
        },
      ]
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <button
        onClick={() => setVista("maestro")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 shadow-md">
            <BarChart3 size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-800">
              {seccionActiva?.nombre ?? resumen?.seccion?.nombre ?? "Reporte de sección"}
            </h1>
            <p className="text-sm font-semibold text-stone-600">
              Resumen general del desempeño grupal.
            </p>
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : !resumen ? (
        <div className="card-premium rounded-3xl p-6 text-center">
          <BarChart3 size={32} className="mx-auto mb-2 text-fuchsia-300" />
          <p className="text-sm font-bold text-stone-600">
            No se pudo cargar el resumen de esta sección.
          </p>
        </div>
      ) : (
        <>
          {/* Métricas */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metricas.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.key}
                  className="card-premium animate-pop rounded-3xl p-4"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div
                    className={`mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${m.gradiente} shadow-md`}
                  >
                    <Icon size={20} className="text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-2xl font-black text-stone-800 sm:text-3xl">
                    {m.valor}
                    {m.suffix && <span className="text-base text-stone-500">{m.suffix}</span>}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">
                    {m.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Estudiantes */}
          <section className="card-premium animate-pop rounded-3xl p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users size={18} className="text-fuchsia-500" strokeWidth={2.5} />
              <h2 className="text-lg font-black text-stone-800">Estudiantes</h2>
              <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-bold text-fuchsia-700">
                {resumen.estudiantes.length}
              </span>
            </div>

            {resumen.estudiantes.length === 0 ? (
              <div className="py-6 text-center">
                <Users size={28} className="mx-auto mb-2 text-stone-300" />
                <p className="text-sm font-bold text-stone-500">
                  No hay estudiantes inscritos en esta sección.
                </p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto pr-1">
                <Table>
                  <TableHeader>
                    <TableRow className="border-stone-200">
                      <TableHead className="text-xs font-black uppercase tracking-wide text-stone-500">
                        Estudiante
                      </TableHead>
                      <TableHead className="text-xs font-black uppercase tracking-wide text-stone-500">
                        Nivel
                      </TableHead>
                      <TableHead className="text-xs font-black uppercase tracking-wide text-stone-500">
                        Puntos
                      </TableHead>
                      <TableHead className="text-right text-xs font-black uppercase tracking-wide text-stone-500">
                        Reporte
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resumen.estudiantes.map((e, i) => (
                      <TableRow
                        key={e.id}
                        className="border-stone-100"
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-400 to-rose-500 text-xs font-black text-white">
                              {e.nombre?.charAt(0)?.toUpperCase() ?? "🧑"}
                            </div>
                            <span className="text-sm font-black text-stone-800">{e.nombre}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-xs font-bold text-emerald-700">
                            Nivel {e.nivel}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-700">
                            <Star size={10} strokeWidth={2.5} className="mr-0.5 inline" />
                            {e.puntos}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <button
                            onClick={() => verReporteEstudiante(e.id)}
                            className="btn-3d inline-flex items-center gap-0.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-2.5 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                          >
                            Ver <ChevronRight size={12} strokeWidth={2.5} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>

          {/* Info extra */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="card-premium animate-pop rounded-2xl p-4" style={{ animationDelay: "0ms" }}>
              <div className="flex items-center gap-2">
                <ClipboardList size={16} className="text-orange-500" strokeWidth={2.5} />
                <p className="text-xs font-black uppercase tracking-wide text-stone-500">
                  Tareas totales
                </p>
              </div>
              <p className="mt-1 text-2xl font-black text-stone-800">{resumen.totalTareas}</p>
              <p className="text-[11px] font-bold text-emerald-600">
                {resumen.tareasActivas} activas
              </p>
            </div>
            <div className="card-premium animate-pop rounded-2xl p-4" style={{ animationDelay: "50ms" }}>
              <div className="flex items-center gap-2">
                <Percent size={16} className="text-emerald-500" strokeWidth={2.5} />
                <p className="text-xs font-black uppercase tracking-wide text-stone-500">
                  Asistencia grupal
                </p>
              </div>
              <p className="mt-1 text-2xl font-black text-stone-800">
                {Math.round(resumen.porcentajeAsistencia)}%
              </p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                  style={{ width: `${Math.min(100, Math.round(resumen.porcentajeAsistencia))}%` }}
                />
              </div>
            </div>
            <div className="card-premium animate-pop rounded-2xl p-4" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-amber-500" strokeWidth={2.5} />
                <p className="text-xs font-black uppercase tracking-wide text-stone-500">
                  Promedio notas
                </p>
              </div>
              <p className="mt-1 text-2xl font-black text-stone-800">
                {resumen.promedioNotas.toFixed(1)}
                <span className="text-sm font-bold text-stone-400"> /100</span>
              </p>
              <p className="text-[11px] font-bold text-stone-500">
                {resumen.promedioNotas >= 70
                  ? "Buen desempeño"
                  : resumen.promedioNotas >= 50
                    ? "Desempeño medio"
                    : "Requiere apoyo"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
