"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  Check,
  Hand,
  X,
  PenLine,
  Loader2,
  Users,
  Save,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { EstadoAsistencia, Seccion } from "@/lib/types";

interface EstudianteSeccion {
  id: string;
  nombre: string;
  puntos?: number;
  experiencia?: number;
  nivel?: number;
}

interface EstadoBtn {
  valor: EstadoAsistencia;
  label: string;
  icon: typeof Check;
  gradiente: string;
  activoBg: string;
  activoTexto: string;
  activoBorde: string;
  inactivoTexto: string;
}

const ESTADOS: EstadoBtn[] = [
  {
    valor: "PRESENTE",
    label: "Presente",
    icon: Check,
    gradiente: "from-emerald-400 to-emerald-500",
    activoBg: "bg-emerald-500",
    activoTexto: "text-white",
    activoBorde: "ring-2 ring-emerald-300",
    inactivoTexto: "text-emerald-700",
  },
  {
    valor: "TARDANZA",
    label: "Tardanza",
    icon: Hand,
    gradiente: "from-amber-400 to-amber-500",
    activoBg: "bg-amber-500",
    activoTexto: "text-white",
    activoBorde: "ring-2 ring-amber-300",
    inactivoTexto: "text-amber-700",
  },
  {
    valor: "AUSENTE",
    label: "Ausente",
    icon: X,
    gradiente: "from-rose-400 to-rose-500",
    activoBg: "bg-rose-500",
    activoTexto: "text-white",
    activoBorde: "ring-2 ring-rose-300",
    inactivoTexto: "text-rose-700",
  },
  {
    valor: "JUSTIFICADO",
    label: "Justificado",
    icon: PenLine,
    gradiente: "from-violet-400 to-violet-500",
    activoBg: "bg-violet-500",
    activoTexto: "text-white",
    activoBorde: "ring-2 ring-violet-300",
    inactivoTexto: "text-violet-700",
  },
];

function hoyISO(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().split("T")[0];
}

function formatearFecha(fechaISO: string): string {
  try {
    const d = new Date(fechaISO + "T00:00:00");
    return d.toLocaleDateString("es-NI", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return fechaISO;
  }
}

export function TeacherAsistencia() {
  const {
    usuario,
    setVista,
    seccionSeleccionadaId,
    setSeccionSeleccionadaId,
    mostrarToast,
  } = useApp();

  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [cargandoSecciones, setCargandoSecciones] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState<Seccion | null>(null);

  const [estudiantes, setEstudiantes] = useState<EstudianteSeccion[]>([]);
  const [estados, setEstados] = useState<Map<string, EstadoAsistencia>>(new Map());
  const [fecha, setFecha] = useState<string>(hoyISO);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Cargar secciones del maestro
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

  // Cargar estudiantes + asistencia cuando cambia la sección
  useEffect(() => {
    if (!seccionSeleccionadaId) {
      setEstudiantes([]);
      setEstados(new Map());
      return;
    }
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const [ests, regs] = await Promise.all([
          api.obtenerEstudiantesSeccion(seccionSeleccionadaId),
          api.obtenerAsistenciaSeccion(seccionSeleccionadaId, fecha),
        ]);
        if (cancelado) return;
        setEstudiantes(ests as EstudianteSeccion[]);
        const map = new Map<string, EstadoAsistencia>();
        (regs ?? []).forEach((r) => {
          if (r?.estudianteId && r.estado) map.set(r.estudianteId, r.estado);
        });
        setEstados(map);
      } catch (err) {
        if (!cancelado) {
          mostrarToast(err instanceof Error ? err.message : "Error al cargar asistencia", "error");
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
    // Se omite "fecha" de las dependencias intencionalmente: el cambio de fecha
    // se maneja por separado en recargarAsistencia() para evitar recargar
    // también la lista de estudiantes.
  }, [seccionSeleccionadaId]);

  // Recargar solo asistencia cuando cambia la fecha
  const recargarAsistencia = useCallback(
    async (nuevaFecha: string) => {
      if (!seccionSeleccionadaId) return;
      try {
        const regs = await api.obtenerAsistenciaSeccion(seccionSeleccionadaId, nuevaFecha);
        const map = new Map<string, EstadoAsistencia>();
        (regs ?? []).forEach((r) => {
          if (r?.estudianteId && r.estado) map.set(r.estudianteId, r.estado);
        });
        setEstados(map);
      } catch {
        /* silent */
      }
    },
    [seccionSeleccionadaId],
  );

  const onChangeFecha = (nueva: string) => {
    setFecha(nueva);
    recargarAsistencia(nueva);
  };

  const setEstado = (estudianteId: string, estado: EstadoAsistencia) => {
    setEstados((prev) => {
      const next = new Map(prev);
      next.set(estudianteId, estado);
      return next;
    });
  };

  const guardar = async () => {
    if (!seccionSeleccionadaId) return;
    if (estudiantes.length === 0) {
      mostrarToast("No hay estudiantes para registrar", "info");
      return;
    }
    setGuardando(true);
    try {
      const registros = estudiantes.map((e) => ({
        seccionId: seccionSeleccionadaId,
        estudianteId: e.id,
        fecha,
        estado: estados.get(e.id) ?? "PRESENTE",
      }));
      await api.registrarAsistencia(registros);
      mostrarToast("Asistencia guardada correctamente", "exito");
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al guardar asistencia", "error");
    } finally {
      setGuardando(false);
    }
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md">
              <CalendarCheck size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-800">Tomar asistencia</h1>
              <p className="text-sm font-semibold text-stone-600">
                Selecciona la sección para registrar la asistencia de hoy.
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
            <Users size={32} className="mx-auto mb-2 text-emerald-300" />
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
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-lg font-black text-white shadow-md">
                  {s.nombre?.charAt(0)?.toUpperCase() ?? "📚"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-base font-black text-stone-800">{s.nombre}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-emerald-700">
                      Grado {s.grado}
                    </span>
                    {s.asignatura && (
                      <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-orange-700">
                        {s.asignatura.nombre}
                      </span>
                    )}
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

  // === Vista de toma de asistencia ===
  const presentes = Array.from(estados.values()).filter((e) => e === "PRESENTE").length;
  const tardanzas = Array.from(estados.values()).filter((e) => e === "TARDANZA").length;
  const ausentes = Array.from(estados.values()).filter((e) => e === "AUSENTE").length;
  const justificados = Array.from(estados.values()).filter((e) => e === "JUSTIFICADO").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <button
        onClick={() => setVista("maestro")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md">
              <CalendarCheck size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-800">
                {seccionActiva?.nombre ?? "Asistencia"}
              </h1>
              <p className="text-sm font-semibold text-stone-600 capitalize">
                {formatearFecha(fecha)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="fecha-asistencia"
              className="text-xs font-black uppercase tracking-wide text-stone-500"
            >
              Fecha
            </label>
            <input
              id="fecha-asistencia"
              type="date"
              value={fecha}
              max={hoyISO()}
              onChange={(e) => onChangeFecha(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white/80 px-3 py-2 text-sm font-bold text-stone-700 shadow-sm transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <div className="card-premium animate-pop rounded-2xl p-3 text-center" style={{ animationDelay: "0ms" }}>
          <p className="text-2xl font-black text-emerald-600">{presentes}</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">Presentes</p>
        </div>
        <div className="card-premium animate-pop rounded-2xl p-3 text-center" style={{ animationDelay: "50ms" }}>
          <p className="text-2xl font-black text-amber-600">{tardanzas}</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">Tardanzas</p>
        </div>
        <div className="card-premium animate-pop rounded-2xl p-3 text-center" style={{ animationDelay: "100ms" }}>
          <p className="text-2xl font-black text-rose-600">{ausentes}</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">Ausentes</p>
        </div>
        <div className="card-premium animate-pop rounded-2xl p-3 text-center" style={{ animationDelay: "150ms" }}>
          <p className="text-2xl font-black text-violet-600">{justificados}</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">Justificados</p>
        </div>
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : estudiantes.length === 0 ? (
        <div className="card-premium rounded-3xl p-6 text-center">
          <Users size={32} className="mx-auto mb-2 text-emerald-300" />
          <p className="text-sm font-bold text-stone-600">
            No hay estudiantes inscritos en esta sección.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2.5">
            {estudiantes.map((e, i) => {
              const estadoActual = estados.get(e.id) ?? null;
              const inicial = e.nombre?.charAt(0)?.toUpperCase() ?? "🧑";
              return (
                <div
                  key={e.id}
                  className="card-premium animate-pop flex flex-col gap-3 rounded-2xl p-3.5 sm:flex-row sm:items-center"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-rose-500 text-sm font-black text-white">
                      {inicial}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-stone-800">{e.nombre}</p>
                      {e.nivel != null && (
                        <span className="text-[11px] font-bold text-stone-500">
                          Nivel {e.nivel}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 sm:flex sm:gap-1.5">
                    {ESTADOS.map((est) => {
                      const Icon = est.icon;
                      const activo = estadoActual === est.valor;
                      return (
                        <button
                          key={est.valor}
                          onClick={() => setEstado(e.id, est.valor)}
                          aria-pressed={activo}
                          aria-label={`${est.label} para ${e.nombre}`}
                          className={[
                            "inline-flex items-center justify-center gap-1 rounded-xl px-2.5 py-1.5 text-[11px] font-black transition-all sm:px-3 sm:text-xs",
                            activo
                              ? `${est.activoBg} ${est.activoTexto} ${est.activoBorde} scale-105 shadow-md`
                              : `bg-white/70 ${est.inactivoTexto} hover:bg-white hover:scale-105`,
                          ].join(" ")}
                        >
                          <Icon size={13} strokeWidth={2.75} />
                          <span className="hidden sm:inline">{est.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botón sticky guardar */}
          <div className="sticky bottom-4 z-10 mt-6">
            <button
              onClick={guardar}
              disabled={guardando}
              className="btn-3d flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-base font-black text-white shadow-lg transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando ? (
                <>
                  <Loader2 size={18} className="animate-spin" strokeWidth={2.5} />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} strokeWidth={2.5} />
                  Guardar asistencia
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
