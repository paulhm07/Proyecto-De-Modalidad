"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Users,
  Loader2,
  ChevronRight,
  Star,
  Sparkles,
  TrendingUp,
  Award,
  CalendarCheck,
  GraduationCap,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { EstudianteSeccion, ResumenSeccion, Seccion } from "@/lib/types";

type EstadoAvance = "AL_DIA" | "EN_PROGRESO" | "REZAGADO";

function calcularEstado(pct: number | undefined): EstadoAvance {
  const p = pct ?? 0;
  if (p >= 70) return "AL_DIA";
  if (p >= 40) return "EN_PROGRESO";
  return "REZAGADO";
}

const ESTADO_BADGE: Record<EstadoAvance, { label: string; cls: string }> = {
  AL_DIA: { label: "Al día", cls: "bg-emerald-100 text-emerald-700" },
  EN_PROGRESO: { label: "En progreso", cls: "bg-amber-100 text-amber-700" },
  REZAGADO: { label: "Rezagado", cls: "bg-rose-100 text-rose-700" },
};

export function TeacherEstudiantes() {
  const {
    usuario,
    seccionSeleccionadaId,
    setVista,
    setEstudianteSeleccionadoId,
    mostrarToast,
  } = useApp();

  const [seccion, setSeccion] = useState<Seccion | null>(null);
  const [estudiantes, setEstudiantes] = useState<EstudianteSeccion[]>([]);
  const [resumen, setResumen] = useState<ResumenSeccion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!seccionSeleccionadaId) return;
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const [sec, ests, res] = await Promise.all([
          api.obtenerSeccion(seccionSeleccionadaId),
          api.obtenerEstudiantesSeccion(seccionSeleccionadaId),
          api.obtenerResumenSeccion(seccionSeleccionadaId),
        ]);
        if (cancelado) return;
        setSeccion(sec);
        setEstudiantes(ests);
        setResumen(res);
      } catch (err) {
        if (!cancelado) {
          mostrarToast(
            err instanceof Error ? err.message : "Error al cargar la sección",
            "error"
          );
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [seccionSeleccionadaId, mostrarToast]);

  const verPerfil = (id: string) => {
    setEstudianteSeleccionadoId(id);
    setVista("maestro-reporte-estudiante");
  };

  if (!usuario) return null;

  // Sin sección seleccionada
  if (!seccionSeleccionadaId) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <div className="card-premium rounded-3xl p-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100">
            <Users size={32} className="text-amber-600" strokeWidth={2.5} />
          </div>
          <p className="text-lg font-black text-stone-800">No has seleccionado una sección</p>
          <p className="mx-auto mt-1 max-w-md text-sm font-semibold text-stone-600">
            Elige una sección para ver sus estudiantes y su progreso.
          </p>
          <button
            onClick={() => setVista("maestro-seccion")}
            className="btn-3d mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105"
          >
            <GraduationCap size={16} strokeWidth={2.5} /> Ir a secciones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <button
        onClick={() => setVista("maestro-seccion")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      {/* Header con nombre de sección */}
      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 shadow-md">
            <Users size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-black text-stone-800">
              {seccion?.nombre ?? "Sección"}
            </h1>
            <p className="truncate text-sm font-semibold text-stone-600">
              {seccion ? `${seccion.grado}° grado` : ""}
              {seccion?.asignatura ? ` · ${seccion.asignatura.nombre}` : ""}
              {resumen ? ` · ${resumen.totalEstudiantes} estudiantes` : ""}
            </p>
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <>
          {/* Resumen rápido de la sección */}
          {resumen && (
            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              <div
                className="card-premium animate-pop rounded-3xl p-4"
                style={{ animationDelay: "0ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100">
                    <TrendingUp size={16} className="text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    Progreso medio
                  </span>
                </div>
                <p className="text-2xl font-black text-stone-800">
                  {Math.round(resumen.promedioProgreso)}%
                </p>
              </div>
              <div
                className="card-premium animate-pop rounded-3xl p-4"
                style={{ animationDelay: "50ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100">
                    <Award size={16} className="text-amber-600" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    Nota media
                  </span>
                </div>
                <p className="text-2xl font-black text-stone-800">
                  {resumen.promedioNotas > 0 ? resumen.promedioNotas.toFixed(1) : "—"}
                </p>
              </div>
              <div
                className="card-premium animate-pop rounded-3xl p-4"
                style={{ animationDelay: "100ms" }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-fuchsia-100">
                    <CalendarCheck size={16} className="text-fuchsia-600" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    Asistencia
                  </span>
                </div>
                <p className="text-2xl font-black text-stone-800">
                  {Math.round(resumen.porcentajeAsistencia)}%
                </p>
              </div>
            </div>
          )}

          {/* Lista de estudiantes */}
          <div className="mb-3 flex items-center gap-2">
            <Users size={18} className="text-fuchsia-500" strokeWidth={2.5} />
            <h2 className="text-lg font-black text-stone-800">Estudiantes</h2>
            <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-bold text-fuchsia-700">
              {estudiantes.length}
            </span>
          </div>

          {estudiantes.length === 0 ? (
            <div className="card-premium rounded-3xl p-8 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-fuchsia-100">
                <Users size={32} className="text-fuchsia-500" strokeWidth={2.5} />
              </div>
              <p className="text-lg font-black text-stone-800">
                Esta sección no tiene estudiantes
              </p>
              <p className="mx-auto mt-1 max-w-md text-sm font-semibold text-stone-600">
                Inscribe estudiantes en la sección para verlos aquí y seguir su progreso.
              </p>
              <button
                onClick={() => setVista("maestro-seccion")}
                className="btn-3d mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105"
              >
                <ArrowLeft size={16} strokeWidth={2.5} /> Volver a secciones
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {estudiantes.map((e, i) => {
                const pct = e.porcentajeGlobal ?? 0;
                const nivel =
                  e.nivel ?? Math.floor((e.experiencia ?? 0) / 100) + 1;
                const estado = calcularEstado(pct);
                const badge = ESTADO_BADGE[estado];
                return (
                  <div
                    key={e.id}
                    className="card-premium animate-pop flex items-center gap-3 rounded-2xl p-3.5"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-rose-500 text-base font-black text-white shadow-md">
                      {e.nombre?.charAt(0)?.toUpperCase() ?? "🧑"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-stone-800">{e.nombre}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                        <span className={`rounded-full px-1.5 py-0.5 ${badge.cls}`}>
                          {badge.label}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-emerald-700">
                          <Sparkles size={10} strokeWidth={2.5} className="mr-0.5 inline" />
                          Nivel {nivel}
                        </span>
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-700">
                          <Star size={10} strokeWidth={2.5} className="mr-0.5 inline" />
                          {e.puntos ?? 0} pts
                        </span>
                        <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-orange-700">
                          {Math.round(pct)}% global
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => verPerfil(e.id)}
                      className="btn-3d flex shrink-0 items-center gap-0.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                    >
                      Ver perfil <ChevronRight size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
