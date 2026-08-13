"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Users,
  Loader2,
  Star,
  Sparkles,
  Bell,
  Home,
  BarChart3,
  MessageCircle,
  User as UserIcon,
  Award,
  TrendingUp,
  CalendarCheck,
  ClipboardList,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  UserPlus,
  Clock,
  Hourglass,
  Flame,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { HijoVinculado, ResumenPadre } from "@/lib/types";

const fmtFecha = (iso: string): string => {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("es-NI", { day: "numeric", month: "short" });
  } catch {
    return iso;
  }
};

const hoyMid = (): number => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const diasHasta = (iso: string): number => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return Number.POSITIVE_INFINITY;
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - hoyMid()) / 86400000);
};

interface UrgenciaTarea {
  icon: typeof Flame;
  cls: string;
}

function urgenciaTarea(fechaLimite: string, entregada: boolean): UrgenciaTarea | null {
  if (entregada) return null;
  const d = diasHasta(fechaLimite);
  if (d < 0) return { icon: Flame, cls: "bg-rose-100 text-rose-600" };
  if (d <= 1) return { icon: Flame, cls: "bg-rose-100 text-rose-600" };
  if (d <= 3) return { icon: Clock, cls: "bg-amber-100 text-amber-600" };
  return { icon: Clock, cls: "bg-stone-100 text-stone-500" };
}

function estadoTarea(
  entregada: boolean,
  entrega: { tarde: boolean } | null,
): { label: string; cls: string } {
  if (entregada && entrega?.tarde) {
    return { label: "Tardía", cls: "bg-rose-100 text-rose-700" };
  }
  if (entregada) {
    return { label: "Entregada", cls: "bg-emerald-100 text-emerald-700" };
  }
  return { label: "Pendiente", cls: "bg-amber-100 text-amber-700" };
}

function colorNota(nota: number): string {
  if (nota >= 80) return "text-emerald-600";
  if (nota >= 60) return "text-amber-600";
  return "text-rose-600";
}

export function ParentDashboard() {
  const {
    usuario,
    hijoSeleccionadoId,
    setHijoSeleccionadoId,
    setVista,
    mostrarToast,
  } = useApp();

  const [hijos, setHijos] = useState<HijoVinculado[]>([]);
  const [resumen, setResumen] = useState<ResumenPadre | null>(null);
  const [cargandoHijos, setCargandoHijos] = useState(true);
  const [cargandoResumen, setCargandoResumen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [noLeidas, setNoLeidas] = useState(0);

  const hijoIdActivo = useMemo(() => {
    if (hijoSeleccionadoId && hijos.some((h) => h.id === hijoSeleccionadoId)) {
      return hijoSeleccionadoId;
    }
    return hijos[0]?.id ?? null;
  }, [hijos, hijoSeleccionadoId]);

  // Auto-seleccionar primer hijo si no hay selección
  useEffect(() => {
    if (hijos.length > 0 && !hijoSeleccionadoId) {
      setHijoSeleccionadoId(hijos[0].id);
    }
    if (
      hijoSeleccionadoId &&
      hijos.length > 0 &&
      !hijos.some((h) => h.id === hijoSeleccionadoId)
    ) {
      setHijoSeleccionadoId(hijos[0].id);
    }
  }, [hijos, hijoSeleccionadoId, setHijoSeleccionadoId]);

  // Cargar hijos (y seed demo en background)
  const cargarHijos = useCallback(async () => {
    if (!usuario) return;
    setCargandoHijos(true);
    setError(null);
    try {
      // Seed idempotente en background para garantizar datos demo
      api.seedPadreDemo(usuario.id).catch(() => {
        /* ignore seed errors */
      });
      const data = await api.obtenerHijosPadre(usuario.id);
      setHijos(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al cargar hijos";
      setError(msg);
      mostrarToast(msg, "error");
    } finally {
      setCargandoHijos(false);
    }
  }, [usuario, mostrarToast]);

  // Cargar notificaciones no leídas (badge campana)
  const cargarNoLeidas = useCallback(async () => {
    if (!usuario) return;
    try {
      const notifs = await api.obtenerNotificaciones(usuario.id, true);
      setNoLeidas(notifs.length);
    } catch {
      /* ignore */
    }
  }, [usuario]);

  useEffect(() => {
    cargarHijos();
    cargarNoLeidas();
  }, [cargarHijos, cargarNoLeidas]);

  // Cargar resumen del hijo seleccionado
  useEffect(() => {
    if (!usuario || !hijoIdActivo) {
      setResumen(null);
      return;
    }
    let cancelado = false;
    (async () => {
      setCargandoResumen(true);
      try {
        const data = await api.obtenerResumenPadre(usuario.id, hijoIdActivo);
        if (!cancelado) setResumen(data);
      } catch (err) {
        if (!cancelado) {
          const msg = err instanceof Error ? err.message : "Error al cargar resumen";
          mostrarToast(msg, "error");
        }
      } finally {
        if (!cancelado) setCargandoResumen(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [usuario, hijoIdActivo, mostrarToast]);

  if (!usuario) return null;

  const hijoActual =
    hijos.find((h) => h.id === hijoIdActivo) ?? null;

  // ===== ESTADO: cargando hijos =====
  if (cargandoHijos) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-20">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="mt-3 text-sm font-bold text-stone-600">Cargando panel de padre…</p>
      </div>
    );
  }

  // ===== ESTADO: error grave =====
  if (error && hijos.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        <button
          onClick={() => setVista("perfil")}
          className="btn-3d mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Volver
        </button>
        <div className="card-premium rounded-3xl p-8 text-center">
          <AlertTriangle size={32} className="mx-auto mb-2 text-rose-500" strokeWidth={2.5} />
          <p className="text-base font-black text-stone-800">{error}</p>
          <button
            onClick={cargarHijos}
            className="btn-3d mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ===== ESTADO: sin hijos vinculados =====
  if (hijos.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8 pb-24">
        <button
          onClick={() => setVista("perfil")}
          className="btn-3d mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Volver
        </button>

        <div className="card-premium animate-bounce-in rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md text-2xl">
              🦉
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-800">Hola, {usuario.nombre}</h1>
              <p className="text-sm font-semibold text-stone-600">
                Vincula a tu hijo/a para seguir su progreso en Mundilex.
              </p>
            </div>
          </div>
        </div>

        <div className="card-premium animate-pop rounded-3xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-100 to-fuchsia-100 text-4xl">
            🦉
          </div>
          <p className="text-lg font-black text-stone-800">
            Aún no tienes hijos vinculados
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm font-semibold text-stone-600">
            Pide el PIN de tu hijo/a (4 dígitos) dentro de la app y vincúlalo aquí
            para ver notas, asistencia y avisos del colegio.
          </p>
          <button
            onClick={() => setVista("padre-vincular")}
            className="btn-3d mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-base font-bold text-white shadow-md transition-all hover:scale-105"
          >
            <UserPlus size={18} strokeWidth={2.5} /> Vincular por PIN
          </button>
        </div>

        <BottomNav vista="padre" setVista={setVista} noLeidas={noLeidas} />
      </div>
    );
  }

  // ===== ESTADO: con hijos y resumen =====
  const kpis = resumen?.kpis;
  const tareasActivas = resumen?.tareasActivas ?? [];
  const califsRecientes = resumen?.calificacionesRecientes ?? [];
  const avisosNoLeidos = resumen?.avisosNoLeidos ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8 pb-24">
      {/* ===== Top bar: Volver + campana ===== */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          onClick={() => setVista("perfil")}
          className="btn-3d inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Volver
        </button>

        <button
          onClick={() => setVista("padre-notificaciones")}
          className="btn-3d relative inline-flex items-center justify-center rounded-xl bg-white/70 p-2.5 text-stone-700 transition-all hover:scale-105 hover:bg-white"
          aria-label="Notificaciones"
        >
          <Bell size={20} strokeWidth={2.5} />
          {noLeidas > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-fuchsia-500 px-1 text-[10px] font-black text-white shadow-md">
              {noLeidas > 9 ? "9+" : noLeidas}
            </span>
          )}
        </button>
      </div>

      {/* ===== Cabecera del hijo seleccionado ===== */}
      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-fuchsia-500 text-2xl font-black text-white shadow-md">
            {hijoActual?.nombre?.charAt(0)?.toUpperCase() ?? "🧒"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-black text-stone-800 sm:text-2xl">
                {hijoActual?.nombre ?? "Hijo/a"}
              </h1>
              {hijoActual?.parentesco && (
                <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-[11px] font-bold capitalize text-fuchsia-700">
                  {hijoActual.parentesco.toLowerCase()}
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
              {resumen && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                  <Sparkles size={11} strokeWidth={2.5} /> Nivel {resumen.nivel}
                </span>
              )}
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                <Star size={11} strokeWidth={2.5} /> {hijoActual?.puntos ?? 0} pts
              </span>
              {resumen && resumen.secciones.length > 0 && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-orange-100 px-2 py-0.5 text-orange-700">
                  <Users size={11} strokeWidth={2.5} /> {resumen.secciones.length} sección{resumen.secciones.length !== 1 ? "es" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Selector de hijo si hay más de uno */}
          {hijos.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setSelectorAbierto((v) => !v)}
                className="btn-3d inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
              >
                Cambiar hijo <ChevronDown size={14} strokeWidth={2.5} />
              </button>
              {selectorAbierto && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSelectorAbierto(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
                    {hijos.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => {
                          setHijoSeleccionadoId(h.id);
                          setSelectorAbierto(false);
                        }}
                        className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-bold transition-colors hover:bg-amber-50 ${
                          h.id === hijoIdActivo
                            ? "bg-amber-50 text-amber-700"
                            : "text-stone-700"
                        }`}
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-fuchsia-500 text-xs font-black text-white">
                          {h.nombre?.charAt(0)?.toUpperCase() ?? "🧒"}
                        </span>
                        <span className="flex-1 min-w-0 truncate">{h.nombre}</span>
                        {h.id === hijoIdActivo && (
                          <CheckCircle2 size={16} className="text-amber-500" strokeWidth={2.5} />
                        )}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setSelectorAbierto(false);
                        setVista("padre-vincular");
                      }}
                      className="flex w-full items-center gap-2 border-t border-stone-100 px-3 py-2.5 text-left text-xs font-bold text-orange-600 transition-colors hover:bg-orange-50"
                    >
                      <UserPlus size={14} strokeWidth={2.5} /> Vincular otro
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Botón "Vincular otro" si solo hay un hijo */}
          {hijos.length === 1 && (
            <button
              onClick={() => setVista("padre-vincular")}
              className="btn-3d inline-flex items-center gap-1 rounded-xl bg-white/70 px-3 py-2 text-xs font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
            >
              <UserPlus size={14} strokeWidth={2.5} /> Vincular
            </button>
          )}
        </div>
      </div>

      {/* ===== KPIs ===== */}
      {cargandoResumen && !resumen ? (
        <div className="mb-6 flex items-center justify-center py-6">
          <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
        </div>
      ) : kpis ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <KpiCard
            delay={0}
            icon={Award}
            iconCls="bg-amber-100 text-amber-600"
            label="Promedio notas"
            value={kpis.promedioNotas > 0 ? kpis.promedioNotas.toFixed(1) : "—"}
            suffix={kpis.promedioNotas > 0 ? "/100" : ""}
          />
          <KpiCard
            delay={50}
            icon={TrendingUp}
            iconCls="bg-emerald-100 text-emerald-600"
            label="Progreso"
            value={`${Math.round(kpis.porcentajeProgreso)}%`}
          />
          <KpiCard
            delay={100}
            icon={CalendarCheck}
            iconCls="bg-fuchsia-100 text-fuchsia-600"
            label="Asistencia"
            value={`${Math.round(kpis.porcentajeAsistencia)}%`}
          />
        </div>
      ) : null}

      {/* ===== Avisos urgentes ===== */}
      {avisosNoLeidos.length > 0 && (
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-500" strokeWidth={2.5} />
              <h2 className="text-lg font-black text-stone-800">Avisos urgentes</h2>
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">
                {avisosNoLeidos.length}
              </span>
            </div>
            <button
              onClick={() => setVista("padre-avisos")}
              className="btn-3d inline-flex items-center gap-0.5 rounded-xl bg-white/70 px-2.5 py-1.5 text-xs font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
            >
              Ver todos <ChevronRight size={12} strokeWidth={2.5} />
            </button>
          </div>
          <div className="space-y-2.5">
            {avisosNoLeidos.slice(0, 3).map((a, i) => (
              <button
                key={a.id}
                onClick={() => setVista("padre-avisos")}
                className="card-premium animate-pop group flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition-all hover:scale-[1.01]"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <AlertTriangle size={16} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-stone-800">{a.titulo}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs font-semibold text-stone-600">
                    {a.contenido}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-stone-500">
                    {fmtFecha(a.fechaEnvio)}
                    {a.seccion?.asignatura?.nombre ? ` · ${a.seccion.asignatura.nombre}` : ""}
                  </p>
                </div>
                <ChevronRight
                  size={14}
                  className="mt-1 shrink-0 text-stone-400 transition-transform group-hover:translate-x-1"
                  strokeWidth={2.5}
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ===== Actividades del día ===== */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <ClipboardList size={18} className="text-orange-500" strokeWidth={2.5} />
          <h2 className="text-lg font-black text-stone-800">Actividades del día</h2>
          {tareasActivas.length > 0 && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
              {tareasActivas.length}
            </span>
          )}
        </div>

        {tareasActivas.length === 0 ? (
          <div className="card-premium rounded-3xl p-6 text-center">
            <CheckCircle2 size={28} className="mx-auto mb-1 text-emerald-500" strokeWidth={2.5} />
            <p className="text-sm font-bold text-stone-600">
              No hay tareas activas. ¡Todo al día! ✨
            </p>
          </div>
        ) : (
          <div className="max-h-96 space-y-2.5 overflow-y-auto pr-1">
            {tareasActivas.map((t, i) => {
              const urg = urgenciaTarea(t.fechaLimite, t.entregada);
              const estado = estadoTarea(t.entregada, t.entrega);
              const IconoUrg = urg?.icon ?? Clock;
              return (
                <div
                  key={t.id}
                  className="card-premium animate-pop flex items-center gap-3 rounded-2xl p-3.5"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${urg?.cls ?? "bg-stone-100 text-stone-500"}`}
                  >
                    <IconoUrg size={18} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-stone-800">{t.titulo}</p>
                    <p className="mt-0.5 truncate text-xs font-semibold text-stone-600">
                      {t.seccion?.asignatura?.nombre ?? "Asignatura"}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-stone-600">
                        <Hourglass size={10} strokeWidth={2.5} className="mr-0.5 inline" />
                        Vence {fmtFecha(t.fechaLimite)}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 ${estado.cls}`}>
                        {estado.label}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => mostrarToast("Detalle de tarea próximamente", "info")}
                    className="btn-3d flex shrink-0 items-center gap-0.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                  >
                    Ver <ChevronRight size={12} strokeWidth={2.5} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== Notas recientes ===== */}
      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-500" strokeWidth={2.5} />
            <h2 className="text-lg font-black text-stone-800">Notas recientes</h2>
          </div>
          <button
            onClick={() => setVista("padre-calificaciones")}
            className="btn-3d inline-flex items-center gap-0.5 rounded-xl bg-white/70 px-2.5 py-1.5 text-xs font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
          >
            Ver todas <ChevronRight size={12} strokeWidth={2.5} />
          </button>
        </div>

        {califsRecientes.length === 0 ? (
          <div className="card-premium rounded-3xl p-6 text-center">
            <Award size={28} className="mx-auto mb-1 text-amber-400" strokeWidth={2.5} />
            <p className="text-sm font-bold text-stone-600">
              Aún no hay notas registradas.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {califsRecientes.slice(0, 5).map((c, i) => (
              <div
                key={c.id}
                className="card-premium animate-pop flex items-center gap-3 rounded-2xl p-3.5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex w-14 shrink-0 flex-col items-center">
                  <span className={`text-2xl font-black ${colorNota(c.nota)}`}>
                    {c.nota.toFixed(0)}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wide text-stone-500">
                    /100
                  </span>
                </div>
                <div className="min-w-0 flex-1 border-l border-stone-200/40 pl-3">
                  <p className="truncate text-sm font-black text-stone-800">
                    {c.tarea.titulo}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-semibold text-stone-600">
                    {c.tarea.seccion.asignatura?.nombre ?? "Asignatura"}
                  </p>
                  {c.comentario && (
                    <p className="mt-1 line-clamp-2 text-xs italic font-medium text-stone-500">
                      “{c.comentario}”
                    </p>
                  )}
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-stone-500">
                    {fmtFecha(c.calificadaEn)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNav vista="padre" setVista={setVista} noLeidas={noLeidas} />
    </div>
  );
}

// ===== Subcomponentes =====

interface KpiCardProps {
  icon: typeof Award;
  iconCls: string;
  label: string;
  value: string;
  suffix?: string;
  delay: number;
}

function KpiCard({ icon: Icon, iconCls, label, value, suffix, delay }: KpiCardProps) {
  return (
    <div
      className="card-premium animate-pop rounded-3xl p-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-1 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconCls}`}>
          <Icon size={16} strokeWidth={2.5} />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wide text-stone-500">
          {label}
        </span>
      </div>
      <p className="text-2xl font-black text-stone-800">
        {value}
        {suffix && <span className="ml-0.5 text-sm font-bold text-stone-500">{suffix}</span>}
      </p>
    </div>
  );
}

type VistaNav =
  | "padre"
  | "padre-calificaciones"
  | "padre-avisos"
  | "padre-mensajes"
  | "perfil";

interface BottomNavProps {
  vista: string;
  setVista: (v: VistaNav) => void;
  noLeidas: number;
}

function BottomNav({ vista, setVista, noLeidas }: BottomNavProps) {
  const items: Array<{
    id: VistaNav;
    label: string;
    icon: typeof Home;
  }> = [
    { id: "padre", label: "Inicio", icon: Home },
    { id: "padre-calificaciones", label: "Notas", icon: BarChart3 },
    { id: "padre-avisos", label: "Avisos", icon: AlertTriangle },
    { id: "padre-mensajes", label: "Mensajes", icon: MessageCircle },
    { id: "perfil", label: "Perfil", icon: UserIcon },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-4xl items-stretch gap-1 border-t border-stone-200 bg-white/95 px-2 py-1.5 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md sm:gap-2 sm:px-4">
      {items.map((it) => {
        const activo = vista === it.id;
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => setVista(it.id)}
            className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-2 text-[10px] font-bold transition-all sm:text-xs ${
              activo
                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md"
                : "text-stone-600 hover:bg-stone-100"
            }`}
            aria-current={activo ? "page" : undefined}
          >
            <Icon size={18} strokeWidth={2.5} />
            <span className="hidden xs:inline sm:inline">{it.label}</span>
            {it.id === "padre-avisos" && noLeidas > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white">
                {noLeidas > 9 ? "9+" : noLeidas}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
