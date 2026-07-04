"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Star,
  Sparkles,
  Trophy,
  Award,
  CheckCircle2,
  BookOpen,
  Target,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";

interface ProgresoModulo {
  id: string;
  titulo: string;
  totalDesafios: number;
  completados: number;
  puntosGanados: number;
  puntosTotales: number;
  porcentajeCompletado: number;
}
interface ProgresoAsignatura {
  id: string;
  nombre: string;
  descripcion?: string | null;
  modulos: ProgresoModulo[];
  totalDesafios: number;
  completados: number;
  puntosGanados: number;
  puntosTotales: number;
  porcentajeCompletado: number;
}
interface ProgresoMedalla {
  id: string;
  titulo: string;
  descripcion?: string | null;
  iconoUrl?: string | null;
  ganadaEn: string;
}
interface ProgresoResponse {
  usuario: {
    id: string;
    nombre: string;
    puntos: number;
    experiencia: number;
    monedas: number;
    gemas: number;
  };
  medallas: ProgresoMedalla[];
  asignaturas: ProgresoAsignatura[];
}

export function StudentProgressView() {
  const { estudianteSeleccionadoId, usuario, setVista, mostrarToast } = useApp();
  const [progreso, setProgreso] = useState<ProgresoResponse | null>(null);
  const [cargando, setCargando] = useState(true);

  const targetId = estudianteSeleccionadoId ?? usuario?.id ?? null;

  useEffect(() => {
    if (!targetId) {
      setVista("dashboard");
      return;
    }
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const data = await api.obtenerProgreso(targetId);
        if (!cancelado) setProgreso(data as ProgresoResponse);
      } catch (err) {
        if (!cancelado) {
          mostrarToast(err instanceof Error ? err.message : "Error al cargar progreso", "error");
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [targetId, setVista, mostrarToast]);

  const volver = () => {
    if (usuario?.rol === "PADRE") setVista("padre");
    else if (usuario?.rol === "MAESTRO") setVista("maestro");
    else setVista("dashboard");
  };

  if (cargando) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  if (!progreso) return null;

  const u = progreso.usuario;
  const nivel = Math.floor(u.experiencia / 100) + 1;
  const totalDesafios = progreso.asignaturas.reduce((s, a) => s + a.totalDesafios, 0);
  const totalCompletados = progreso.asignaturas.reduce((s, a) => s + a.completados, 0);
  const pctGlobal =
    totalDesafios === 0 ? 0 : Math.round((totalCompletados / totalDesafios) * 100);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <button
        onClick={volver}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      {/* Hero */}
      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <h1 className="text-2xl font-black text-stone-800 sm:text-3xl">{u.nombre}</h1>
        <p className="text-sm font-semibold text-orange-600">Progreso detallado</p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Puntos"
            value={u.puntos}
            icon={<Star size={16} strokeWidth={2.5} />}
            grad="from-amber-300 to-orange-400"
          />
          <StatCard
            label="Nivel"
            value={nivel}
            icon={<Sparkles size={16} strokeWidth={2.5} />}
            grad="from-emerald-400 to-teal-500"
          />
          <StatCard
            label="Desafíos"
            value={`${totalCompletados}/${totalDesafios}`}
            icon={<CheckCircle2 size={16} strokeWidth={2.5} />}
            grad="from-rose-400 to-fuchsia-500"
          />
          <StatCard
            label="Global"
            value={`${pctGlobal}%`}
            icon={<Target size={16} strokeWidth={2.5} />}
            grad="from-orange-400 to-rose-500"
          />
        </div>
      </div>

      {/* Asignaturas */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-orange-500" strokeWidth={2.5} />
          <h2 className="text-xl font-black text-stone-800">Asignaturas</h2>
        </div>

        {progreso.asignaturas.length === 0 ? (
          <div className="card-premium rounded-3xl p-6 text-center">
            <BookOpen size={32} className="mx-auto mb-2 text-orange-300" />
            <p className="text-sm font-bold text-stone-600">
              Aún no hay asignaturas disponibles.
            </p>
          </div>
        ) : (
          progreso.asignaturas.map((a, i) => (
            <div
              key={a.id}
              className="card-premium animate-pop rounded-3xl p-5"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-stone-800">{a.nombre}</h3>
                  {a.descripcion && (
                    <p className="text-xs font-medium text-stone-500 line-clamp-1">
                      {a.descripcion}
                    </p>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                  {a.porcentajeCompletado}%
                </span>
              </div>

              {/* Barra de progreso asignatura */}
              <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-white/70 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-rose-500 to-fuchsia-500 transition-all"
                  style={{ width: `${a.porcentajeCompletado}%` }}
                />
              </div>

              <div className="mb-3 flex flex-wrap gap-2 text-[11px] font-bold">
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                  {a.completados}/{a.totalDesafios} desafíos
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                  {a.puntosGanados}/{a.puntosTotales} puntos
                </span>
              </div>

              {/* Módulos */}
              {a.modulos.length > 0 && (
                <div className="space-y-1.5 border-t border-orange-100 pt-3">
                  {a.modulos.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-bold text-stone-700">{m.titulo}</p>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                            style={{ width: `${m.porcentajeCompletado}%` }}
                          />
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs font-black text-stone-700">
                          {m.completados}/{m.totalDesafios}
                        </p>
                        <p className="text-[10px] font-bold text-amber-600">
                          {m.puntosGanados}/{m.puntosTotales} pts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Medallas */}
      <div className="card-premium rounded-3xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <Award size={20} className="text-amber-500" strokeWidth={2.5} />
          <h2 className="text-xl font-black text-stone-800">Medallas</h2>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
            {progreso.medallas.length}
          </span>
        </div>
        {progreso.medallas.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-6 text-center">
            <Trophy size={32} className="mx-auto mb-2 text-amber-400" />
            <p className="text-sm font-bold text-stone-600">
              Aún no hay medallas ganadas.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {progreso.medallas.map((m) => (
              <div
                key={m.id}
                className="flex items-start gap-3 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-100 to-yellow-200 p-3 shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/70">
                  <Trophy size={20} className="text-amber-600" strokeWidth={2} fill="currentColor" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black leading-tight text-amber-900">{m.titulo}</p>
                  {m.descripcion && (
                    <p className="mt-0.5 text-xs font-medium text-amber-800 line-clamp-2">
                      {m.descripcion}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  grad,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  grad: string;
}) {
  return (
    <div className={`flex items-center gap-2 rounded-2xl bg-gradient-to-br ${grad} px-3 py-2.5 shadow-md`}>
      <span className="text-white">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/80">{label}</p>
        <p className="truncate text-lg font-black text-white">{value}</p>
      </div>
    </div>
  );
}
