"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Trophy,
  Medal,
  Lock,
  BookOpen,
  MessageSquare,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from "recharts";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { MedallasHijo, ResumenCalificaciones, Usuario } from "@/lib/types";

function formatearFecha(fecha: string): string {
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

function colorNota(nota: number): { bg: string; texto: string; gradiente: string } {
  if (nota >= 80) return { bg: "bg-emerald-100", texto: "text-emerald-700", gradiente: "from-emerald-400 to-teal-500" };
  if (nota >= 60) return { bg: "bg-amber-100", texto: "text-amber-700", gradiente: "from-amber-400 to-orange-500" };
  return { bg: "bg-rose-100", texto: "text-rose-700", gradiente: "from-rose-400 to-fuchsia-500" };
}

function colorGauge(promedio: number): string {
  if (promedio >= 80) return "#10b981";
  if (promedio >= 60) return "#f59e0b";
  return "#f43f5e";
}

function emojiMedalla(titulo: string): string {
  const t = titulo.toLowerCase();
  if (t.includes("oro") || t.includes("maestr")) return "🥇";
  if (t.includes("plata")) return "🥈";
  if (t.includes("bronce")) return "🥉";
  if (t.includes("trofeo") || t.includes("campeón") || t.includes("destacado")) return "🏆";
  if (t.includes("estrella") || t.includes("brillo")) return "⭐";
  if (t.includes("racha") || t.includes("constancia")) return "🔥";
  if (t.includes("velocidad") || t.includes("rápido")) return "⚡";
  if (t.includes("genio") || t.includes("sabio")) return "🧠";
  if (t.includes("maestro") || t.includes("expert")) return "🎓";
  return "🏅";
}

export function ParentCalificaciones() {
  const { usuario, hijoSeleccionadoId, setVista, mostrarToast } = useApp();
  const [cargando, setCargando] = useState(true);
  const [calif, setCalif] = useState<ResumenCalificaciones | null>(null);
  const [medallas, setMedallas] = useState<MedallasHijo | null>(null);
  const [hijo, setHijo] = useState<Usuario | null>(null);

  useEffect(() => {
    if (!usuario) return;
    if (!hijoSeleccionadoId) {
      mostrarToast("Selecciona un hijo para ver sus calificaciones", "info");
      setVista("padre");
      return;
    }
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const [c, m, h] = await Promise.all([
          api.obtenerCalificacionesHijo(usuario.id, hijoSeleccionadoId),
          api.obtenerMedallasHijo(usuario.id, hijoSeleccionadoId).catch(() => null),
          api.obtenerPerfil(hijoSeleccionadoId).catch(() => null),
        ]);
        if (cancelado) return;
        setCalif(c);
        setMedallas(m);
        setHijo(h);
      } catch (err) {
        if (!cancelado) {
          mostrarToast(err instanceof Error ? err.message : "Error al cargar calificaciones", "error");
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [usuario, hijoSeleccionadoId, setVista, mostrarToast]);

  if (!usuario) return null;

  const nombreHijo = hijo?.nombre ?? "del estudiante";

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <button
        onClick={() => setVista("padre")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      {/* Header */}
      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
            <Trophy size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-800">Calificaciones y Avance</h1>
            <p className="text-sm font-semibold text-stone-600">
              {nombreHijo}
            </p>
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : !calif || calif.calificaciones.length === 0 ? (
        <div className="card-premium rounded-3xl p-8 text-center">
          <BookOpen size={40} className="mx-auto mb-3 text-amber-300" />
          <p className="text-base font-black text-stone-700">Aún no hay calificaciones publicadas</p>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            Cuando el maestro registre notas, aparecerán aquí con gráficos y medallas.
          </p>
        </div>
      ) : (
        <>
          {/* Gauge + KPIs */}
          <div className="card-premium animate-pop mb-6 rounded-3xl p-5 sm:p-6" style={{ animationDelay: "0ms" }}>
            <div className="grid items-center gap-6 sm:grid-cols-2">
              <div className="relative mx-auto h-52 w-52 sm:h-56 sm:w-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="72%"
                    outerRadius="100%"
                    data={[{ name: "promedio", value: Math.round(calif.promedioGeneral ?? 0), fill: colorGauge(calif.promedioGeneral ?? 0) }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" cornerRadius={14} background={{ fill: "rgba(255,255,255,0.08)" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white">
                    {Math.round(calif.promedioGeneral ?? 0)}
                  </span>
                  <span className="text-sm font-bold text-stone-400">/100</span>
                  <span className="mt-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-stone-300">
                    Promedio general
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-stone-500">Tendencia</p>
                  <p className="mt-0.5 text-sm font-black text-stone-700">— Sin histórico comparativo</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-2xl font-black text-white">{calif.total}</p>
                    <p className="text-[11px] font-bold text-stone-300">Notas registradas</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-2xl font-black text-white">{calif.resumenPorAsignatura.length}</p>
                    <p className="text-[11px] font-bold text-stone-300">Asignaturas</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-2xl font-black text-emerald-300">
                      {calif.calificaciones.filter((c) => c.nota >= 80).length}
                    </p>
                    <p className="text-[11px] font-bold text-stone-300">Excelentes (≥80)</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-2xl font-black text-rose-300">
                      {calif.calificaciones.filter((c) => c.nota < 60).length}
                    </p>
                    <p className="text-[11px] font-bold text-stone-300">A mejorar (&lt;60)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barras horizontales por asignatura */}
          {calif.resumenPorAsignatura.length > 0 && (
            <div className="card-premium animate-pop mb-6 rounded-3xl p-5 sm:p-6" style={{ animationDelay: "60ms" }}>
              <div className="mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-orange-400" strokeWidth={2.5} />
                <h2 className="text-lg font-black text-stone-800">Promedio por asignatura</h2>
              </div>
              <div style={{ height: Math.max(180, calif.resumenPorAsignatura.length * 44 + 20) }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={calif.resumenPorAsignatura}
                    margin={{ top: 4, right: 36, bottom: 4, left: 8 }}
                  >
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis
                      type="category"
                      dataKey="nombre"
                      width={110}
                      tick={{ fill: "#f5f5f4", fontSize: 12, fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Bar dataKey="promedio" radius={[0, 8, 8, 0]} barSize={22}>
                      {calif.resumenPorAsignatura.map((a, i) => (
                        <Cell
                          key={i}
                          fill={a.promedio >= 80 ? "#f59e0b" : a.promedio >= 60 ? "#fb923c" : "#f97316"}
                        />
                      ))}
                      <LabelList
                        dataKey="promedio"
                        position="right"
                        formatter={(v: number) => `${Math.round(v)}`}
                        style={{ fill: "#fbbf24", fontSize: 12, fontWeight: 800 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-[11px] font-semibold text-stone-500">
                {calif.resumenPorAsignatura.reduce((acc, a) => acc + a.cantidad, 0)} calificaciones en {calif.resumenPorAsignatura.length} asignatura{calif.resumenPorAsignatura.length !== 1 ? "s" : ""}.
              </p>
            </div>
          )}

          {/* Historial detallado */}
          <div className="card-premium animate-pop mb-6 rounded-3xl p-5 sm:p-6" style={{ animationDelay: "120ms" }}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-amber-400" strokeWidth={2.5} />
                <h2 className="text-lg font-black text-stone-800">Historial de calificaciones</h2>
              </div>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                {calif.calificaciones.length}
              </span>
            </div>
            <div className="max-h-96 space-y-2.5 overflow-y-auto pr-1">
              {calif.calificaciones
                .slice()
                .sort((a, b) => new Date(b.calificadaEn).getTime() - new Date(a.calificadaEn).getTime())
                .map((c, i) => {
                  const cfg = colorNota(c.nota);
                  const asignatura = c.tarea?.seccion?.asignatura?.nombre ?? "General";
                  const seccion = c.tarea?.seccion?.nombre;
                  return (
                    <div
                      key={c.id}
                      className="animate-pop flex items-start gap-3 rounded-2xl bg-white/10 p-3.5"
                      style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${cfg.gradiente} text-white shadow-md`}
                      >
                        <span className="text-lg font-black leading-none">{Math.round(c.nota)}</span>
                        <span className="text-[9px] font-bold opacity-80">/100</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-black text-stone-100">
                          {c.tarea?.titulo ?? "Tarea sin título"}
                        </p>
                        <p className="mt-0.5 text-[11px] font-bold text-amber-300">
                          {asignatura}
                          {seccion ? <span className="text-stone-400"> · {seccion}</span> : null}
                        </p>
                        {c.comentario ? (
                          <p className="mt-1 flex items-start gap-1 text-xs italic text-stone-300">
                            <MessageSquare size={11} strokeWidth={2.5} className="mt-0.5 shrink-0 text-cyan-300" />
                            <span className="line-clamp-2">{c.comentario}</span>
                          </p>
                        ) : null}
                        <p className="mt-1 text-[10px] font-semibold text-stone-500">
                          {formatearFecha(c.calificadaEn)}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Medallas */}
          {medallas && (
            <div className="card-premium animate-pop rounded-3xl p-5 sm:p-6" style={{ animationDelay: "180ms" }}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Medal size={18} className="text-fuchsia-400" strokeWidth={2.5} />
                  <h2 className="text-lg font-black text-stone-800">Medallas</h2>
                </div>
                <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-bold text-fuchsia-700">
                  {medallas.desbloqueadas} / {medallas.total}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                {medallas.ganadas.map((m) => (
                  <div
                    key={m.id}
                    title={`${m.medalla.titulo} — ${m.medalla.descripcion}`}
                    className="group relative flex flex-col items-center gap-1 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 p-2.5 ring-1 ring-amber-300/40 transition-all hover:scale-105"
                  >
                    <span className="text-3xl drop-shadow">{emojiMedalla(m.medalla.titulo)}</span>
                    <span className="line-clamp-1 w-full text-center text-[9px] font-bold text-amber-200">
                      {m.medalla.titulo}
                    </span>
                  </div>
                ))}
                {medallas.bloqueadas.map((m) => (
                  <div
                    key={m.id}
                    title={`Bloqueada: ${m.titulo} — ${m.descripcion}`}
                    className="group relative flex flex-col items-center gap-1 rounded-2xl bg-white/5 p-2.5 opacity-60 ring-1 ring-white/10"
                  >
                    <span className="text-3xl grayscale">🔒</span>
                    <span className="line-clamp-1 w-full text-center text-[9px] font-bold text-stone-500">
                      {m.titulo}
                    </span>
                  </div>
                ))}
              </div>
              {medallas.total === 0 ? (
                <p className="mt-3 text-center text-xs font-bold text-stone-500">
                  Aún no hay medallas disponibles para mostrar.
                </p>
              ) : (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-stone-500">
                  <TrendingUp size={12} strokeWidth={2.5} className="text-emerald-400" />
                  {medallas.desbloqueadas} de {medallas.total} desbloqueadas
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
