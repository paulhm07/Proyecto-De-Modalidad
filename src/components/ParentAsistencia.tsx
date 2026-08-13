"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Check,
  X,
  Clock,
  CalendarOff,
  TrendingUp,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { EstadoAsistencia, ResumenAsistencia, Usuario } from "@/lib/types";

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function formatearFechaLarga(fecha: string): string {
  try {
    return new Date(fecha).toLocaleDateString("es-NI", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return fecha;
  }
}

function nombreMesAnio(mes: number, anio: number): string {
  try {
    return new Date(anio, mes - 1, 1).toLocaleDateString("es-NI", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return `${mes}/${anio}`;
  }
}

function diasEnMes(anio: number, mes: number): number {
  return new Date(anio, mes, 0).getDate();
}

function primerDiaSemanaLun0(anio: number, mes: number): number {
  // JS getDay: Sunday=0..Saturday=6 → convert to Monday=0..Sunday=6
  return (new Date(anio, mes - 1, 1).getDay() + 6) % 7;
}

function configEstado(estado: EstadoAsistencia): {
  label: string;
  dot: string;
  badgeBg: string;
  badgeTexto: string;
  icon: typeof Check;
} {
  switch (estado) {
    case "PRESENTE":
      return { label: "Presente", dot: "bg-emerald-400", badgeBg: "bg-emerald-100", badgeTexto: "text-emerald-700", icon: Check };
    case "TARDANZA":
      return { label: "Tardanza", dot: "bg-amber-400", badgeBg: "bg-amber-100", badgeTexto: "text-amber-700", icon: Clock };
    case "AUSENTE":
      return { label: "Ausente", dot: "bg-rose-400", badgeBg: "bg-rose-100", badgeTexto: "text-rose-700", icon: X };
    case "JUSTIFICADO":
      return { label: "Justificado", dot: "bg-stone-400", badgeBg: "bg-stone-200", badgeTexto: "text-stone-700", icon: CalendarOff };
  }
}

function mismoDia(fecha: string, anio: number, mes: number, dia: number): boolean {
  const d = new Date(fecha);
  return d.getFullYear() === anio && d.getMonth() + 1 === mes && d.getDate() === dia;
}

export function ParentAsistencia() {
  const { usuario, hijoSeleccionadoId, setVista, mostrarToast } = useApp();
  const ahora = new Date();
  const [mes, setMes] = useState(ahora.getMonth() + 1);
  const [anio, setAnio] = useState(ahora.getFullYear());
  const [cargando, setCargando] = useState(true);
  const [data, setData] = useState<ResumenAsistencia | null>(null);
  const [hijo, setHijo] = useState<Usuario | null>(null);

  useEffect(() => {
    if (!usuario) return;
    if (!hijoSeleccionadoId) {
      mostrarToast("Selecciona un hijo para ver su asistencia", "info");
      setVista("padre");
      return;
    }
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const [a, h] = await Promise.all([
          api.obtenerAsistenciaHijo(usuario.id, hijoSeleccionadoId, { mes, anio }),
          api.obtenerPerfil(hijoSeleccionadoId).catch(() => null),
        ]);
        if (cancelado) return;
        setData(a);
        setHijo(h);
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
  }, [usuario, hijoSeleccionadoId, mes, anio, setVista, mostrarToast]);

  const mesPrev = () => {
    if (mes === 1) {
      setMes(12);
      setAnio((a) => a - 1);
    } else {
      setMes((m) => m - 1);
    }
  };
  const mesSig = () => {
    if (mes === 12) {
      setMes(1);
      setAnio((a) => a + 1);
    } else {
      setMes((m) => m + 1);
    }
  };

  const registrosPorDia = useMemo(() => {
    const map = new Map<number, ResumenAsistencia["registros"][number]>();
    if (data?.registros) {
      for (const r of data.registros) {
        const d = new Date(r.fecha);
        if (d.getFullYear() === anio && d.getMonth() + 1 === mes) {
          map.set(d.getDate(), r);
        }
      }
    }
    return map;
  }, [data, anio, mes]);

  const diasTotales = diasEnMes(anio, mes);
  const offsetInicial = primerDiaSemanaLun0(anio, mes);

  if (!usuario) return null;

  const nombreHijo = hijo?.nombre ?? "del estudiante";
  const conteo = data?.conteo ?? {};
  const presentes = conteo["PRESENTE"] ?? 0;
  const ausentes = conteo["AUSENTE"] ?? 0;
  const tardanzas = conteo["TARDANZA"] ?? 0;
  const justificados = conteo["JUSTIFICADO"] ?? 0;
  const porcentaje = data?.porcentaje ?? 0;

  const registrosOrdenados = data?.registros
    ? data.registros.slice().sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    : [];

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md">
              <CalendarDays size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-800">Asistencia de {nombreHijo}</h1>
              <p className="text-sm font-semibold text-stone-600">
                Revisa el registro mensual de asistencia.
              </p>
            </div>
          </div>

          {/* Selector de mes */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-white/10 p-1.5">
            <button
              onClick={mesPrev}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-stone-200 transition-all hover:scale-105 hover:bg-white/20"
              aria-label="Mes anterior"
            >
              <ChevronLeft size={18} strokeWidth={2.75} />
            </button>
            <span className="min-w-[140px] text-center text-sm font-black capitalize text-white">
              {nombreMesAnio(mes, anio)}
            </span>
            <button
              onClick={mesSig}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-stone-200 transition-all hover:scale-105 hover:bg-white/20"
              aria-label="Mes siguiente"
            >
              <ChevronRight size={18} strokeWidth={2.75} />
            </button>
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : !data || data.registros.length === 0 ? (
        <div className="card-premium rounded-3xl p-8 text-center">
          <CalendarDays size={40} className="mx-auto mb-3 text-emerald-300" />
          <p className="text-base font-black text-stone-700">Sin registros de asistencia este mes</p>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            Si crees que es un error, contacta al maestro del grado.
          </p>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="card-premium animate-pop mb-6 rounded-3xl p-5 sm:p-6" style={{ animationDelay: "0ms" }}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-emerald-400/15 p-4 ring-1 ring-emerald-300/30">
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <TrendingUp size={14} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-wide">% Asistencia</span>
                </div>
                <p className="mt-1 text-3xl font-black text-emerald-200">{Math.round(porcentaje)}%</p>
              </div>
              <div className="rounded-2xl bg-emerald-400/10 p-4 ring-1 ring-emerald-300/20">
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Check size={14} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-wide">Presentes</span>
                </div>
                <p className="mt-1 text-3xl font-black text-white">{presentes}</p>
              </div>
              <div className="rounded-2xl bg-rose-400/10 p-4 ring-1 ring-rose-300/20">
                <div className="flex items-center gap-1.5 text-rose-300">
                  <X size={14} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-wide">Ausentes</span>
                </div>
                <p className="mt-1 text-3xl font-black text-white">{ausentes}</p>
              </div>
              <div className="rounded-2xl bg-amber-400/10 p-4 ring-1 ring-amber-300/20">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Clock size={14} strokeWidth={2.5} />
                  <span className="text-[10px] font-black uppercase tracking-wide">Tardanzas</span>
                </div>
                <p className="mt-1 text-3xl font-black text-white">{tardanzas}</p>
              </div>
            </div>
            {justificados > 0 && (
              <p className="mt-3 text-[11px] font-semibold text-stone-400">
                + {justificados} inasistencia{justificados !== 1 ? "s" : ""} justificada{justificados !== 1 ? "s" : ""} · Total: {data.total} registro{data.total !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Calendario */}
          <div className="card-premium animate-pop mb-6 rounded-3xl p-5 sm:p-6" style={{ animationDelay: "60ms" }}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-black text-stone-800">Calendario</h2>
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                <span className="flex items-center gap-1 text-stone-300"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Presente</span>
                <span className="flex items-center gap-1 text-stone-300"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Tardanza</span>
                <span className="flex items-center gap-1 text-stone-300"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Ausente</span>
                <span className="flex items-center gap-1 text-stone-300"><span className="h-2.5 w-2.5 rounded-full bg-stone-400" /> Justificado</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {DIAS_SEMANA.map((d) => (
                <div key={d} className="text-center text-[10px] font-black uppercase tracking-wide text-stone-400">
                  {d}
                </div>
              ))}
              {Array.from({ length: offsetInicial }).map((_, i) => (
                <div key={`pad-${i}`} className="aspect-square rounded-xl bg-white/5" />
              ))}
              {Array.from({ length: diasTotales }).map((_, idx) => {
                const dia = idx + 1;
                const registro = registrosPorDia.get(dia);
                const cfg = registro ? configEstado(registro.estado) : null;
                const esHoy =
                  dia === ahora.getDate() &&
                  mes === ahora.getMonth() + 1 &&
                  anio === ahora.getFullYear();
                return (
                  <div
                    key={dia}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-xl ${
                      registro ? "bg-white/10 ring-1 ring-white/15" : "bg-white/5"
                    } ${esHoy ? "ring-2 ring-cyan-300/60" : ""}`}
                    title={registro ? `${configEstado(registro.estado).label} — ${formatearFechaLarga(registro.fecha)}` : `${dia}`}
                  >
                    <span className={`text-sm font-black ${registro ? "text-white" : "text-stone-500"}`}>
                      {dia}
                    </span>
                    {cfg ? <span className={`mt-0.5 h-2 w-2 rounded-full ${cfg.dot}`} /> : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lista detallada */}
          <div className="card-premium animate-pop rounded-3xl p-5 sm:p-6" style={{ animationDelay: "120ms" }}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-lg font-black text-stone-800">Detalle del mes</h2>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                {registrosOrdenados.length}
              </span>
            </div>
            <div className="max-h-96 space-y-2.5 overflow-y-auto pr-1">
              {registrosOrdenados.map((r, i) => {
                const cfg = configEstado(r.estado);
                const Icon = cfg.icon;
                return (
                  <div
                    key={r.id}
                    className="animate-pop flex items-start gap-3 rounded-2xl bg-white/10 p-3.5"
                    style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${cfg.badgeBg}`}>
                      <Icon size={18} className={cfg.badgeTexto} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-black capitalize text-stone-100">
                          {formatearFechaLarga(r.fecha)}
                        </p>
                        <span className={`rounded-full ${cfg.badgeBg} px-2 py-0.5 text-[10px] font-black ${cfg.badgeTexto}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] font-bold text-amber-300">
                        {r.seccion?.asignatura?.nombre ?? "General"}
                        {r.seccion?.nombre ? <span className="text-stone-400"> · {r.seccion.nombre}</span> : null}
                      </p>
                      {r.observacion ? (
                        <p className="mt-1 text-xs italic text-stone-300">{r.observacion}</p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
