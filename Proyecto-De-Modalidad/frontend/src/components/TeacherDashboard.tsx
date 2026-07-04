"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Users,
  BookOpen,
  Loader2,
  Star,
  Sparkles,
  ChevronRight,
  Plus,
  Library,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { Asignatura } from "@/lib/types";

interface EstudianteMaestro {
  id: string;
  nombre: string;
  puntos: number;
  experiencia: number;
  desafiosCompletados?: number;
  totalDesafios?: number;
  porcentajeGlobal?: number;
}

export function TeacherDashboard() {
  const { usuario, setVista, setEstudianteSeleccionadoId, setAsignaturaId, setModuloId, mostrarToast } = useApp();
  const [estudiantes, setEstudiantes] = useState<EstudianteMaestro[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario) return;
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const [ests, asigs] = await Promise.all([
          api.obtenerEstudiantesMaestro(usuario.id),
          api.obtenerAsignaturasMaestro(usuario.id),
        ]);
        if (cancelado) return;
        setEstudiantes(ests);
        setAsignaturas(asigs);
      } catch (err) {
        if (!cancelado) {
          mostrarToast(err instanceof Error ? err.message : "Error al cargar datos", "error");
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [usuario, mostrarToast]);

  const verProgreso = (e: EstudianteMaestro) => {
    setEstudianteSeleccionadoId(e.id);
    setAsignaturaId(null);
    setModuloId(null);
    setVista("progreso-estudiante");
  };

  if (!usuario) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <button
        onClick={() => setVista("perfil")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 shadow-md">
            <BookOpen size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-800">Panel del maestro/a</h1>
            <p className="text-sm font-semibold text-stone-600">
              Hola, {usuario.nombre}. Gestiona tus asignaturas y estudiantes.
            </p>
          </div>
        </div>
      </div>

      {/* Acceso rápido al Banco de Desafíos */}
      <button
        onClick={() => setVista("banco-desafios")}
        className="btn-3d group mb-6 flex w-full items-center gap-4 rounded-3xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 p-5 text-left shadow-md transition-all hover:scale-[1.01]"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-2 ring-white/40">
          <Library size={28} className="text-white" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-black text-white">Banco de Desafíos</p>
          <p className="text-sm font-semibold text-white/90">
            30 desafíos curriculares listos · Matemáticas y Lengua · 3 niveles · JSON + Kotlin
          </p>
        </div>
        <ChevronRight size={24} className="text-white transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
      </button>

      {cargando ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Estudiantes */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Users size={18} className="text-fuchsia-500" strokeWidth={2.5} />
              <h2 className="text-lg font-black text-stone-800">Mis estudiantes</h2>
              <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-bold text-fuchsia-700">
                {estudiantes.length}
              </span>
            </div>
            {estudiantes.length === 0 ? (
              <div className="card-premium rounded-3xl p-6 text-center">
                <Users size={32} className="mx-auto mb-2 text-fuchsia-300" />
                <p className="text-sm font-bold text-stone-600">
                  No tienes estudiantes asignados a tus asignaturas todavía.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {estudiantes.map((e, i) => {
                  const nivel = Math.floor((e.experiencia ?? 0) / 100) + 1;
                  const completados = e.desafiosCompletados ?? 0;
                  const total = e.totalDesafios ?? 0;
                  const pct = e.porcentajeGlobal ?? (total > 0 ? Math.round((completados / total) * 100) : 0);
                  return (
                    <div
                      key={e.id}
                      className="card-premium animate-pop flex items-center gap-3 rounded-2xl p-3.5"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-rose-500 text-sm font-black text-white">
                        {e.nombre?.charAt(0)?.toUpperCase() ?? "🧑"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-black text-stone-800">{e.nombre}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-700">
                            <Star size={10} strokeWidth={2.5} className="mr-0.5 inline" />
                            {e.puntos ?? 0} pts
                          </span>
                          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-emerald-700">
                            <Sparkles size={10} strokeWidth={2.5} className="mr-0.5 inline" />
                            Nivel {nivel}
                          </span>
                          <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-orange-700">
                            {pct}% global
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => verProgreso(e)}
                        className="btn-3d flex items-center gap-0.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                      >
                        Ver <ChevronRight size={12} strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Asignaturas */}
          <section>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-orange-500" strokeWidth={2.5} />
                <h2 className="text-lg font-black text-stone-800">Mis asignaturas</h2>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                  {asignaturas.length}
                </span>
              </div>
              <button
                onClick={() => setVista("contenido")}
                className="btn-3d flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
              >
                <Plus size={13} strokeWidth={2.5} /> Crear
              </button>
            </div>
            {asignaturas.length === 0 ? (
              <div className="card-premium rounded-3xl p-6 text-center">
                <BookOpen size={32} className="mx-auto mb-2 text-orange-300" />
                <p className="text-sm font-bold text-stone-600">
                  Aún no has creado asignaturas. Ve a «Contenido» para empezar.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {asignaturas.map((a, i) => (
                  <div
                    key={a.id}
                    className="card-premium animate-pop flex items-center gap-3 rounded-2xl p-3.5"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 text-sm font-black text-white">
                      {a.nombre?.charAt(0)?.toUpperCase() ?? "📚"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-black text-stone-800">{a.nombre}</p>
                      <span className="mt-0.5 inline-block rounded-full bg-orange-100 px-1.5 py-0.5 text-[11px] font-bold text-orange-700">
                        {a._count?.modulos ?? 0} módulos
                      </span>
                    </div>
                    <button
                      onClick={() => setVista("contenido")}
                      className="btn-3d flex items-center gap-0.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                    >
                      Gestionar <ChevronRight size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
