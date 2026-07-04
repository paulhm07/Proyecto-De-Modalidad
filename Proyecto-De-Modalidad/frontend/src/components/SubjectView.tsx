"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Play,
  Loader2,
  Layers,
  Target,
  Lock,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { Asignatura, Modulo } from "@/lib/types";

// Detect Math subject (cyan accent + 'M' icon) vs Language (orange + 'L')
const esMatematicas = (nombre: string) => /matem/i.test(nombre ?? "");

export function SubjectView() {
  const { asignaturaId, setVista, setModuloId, usuario, mostrarToast } = useApp();
  const [asignatura, setAsignatura] = useState<Asignatura | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!asignaturaId) {
      setVista("dashboard");
      return;
    }
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const [todas, mods] = await Promise.all([
          api.obtenerAsignaturas(),
          api.obtenerModulos(asignaturaId),
        ]);
        if (cancelado) return;
        setAsignatura(todas.find((a) => a.id === asignaturaId) ?? null);
        setModulos(mods);
      } catch (err) {
        if (!cancelado) {
          const msg = err instanceof Error ? err.message : "Error al cargar módulos";
          mostrarToast(msg, "error");
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [asignaturaId, setVista, mostrarToast]);

  const nivelUsuario = usuario ? Math.floor(usuario.experiencia / 100) + 1 : 1;

  const jugarModulo = (m: Modulo) => {
    if (nivelUsuario < m.nivelMinimo) {
      mostrarToast(`Necesitas nivel ${m.nivelMinimo} para jugar este módulo`, "info");
      return;
    }
    setModuloId(m.id);
    setVista("modulo");
  };

  if (cargando) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
        </div>
      </div>
    );
  }

  const esMath = esMatematicas(asignatura?.nombre ?? "");
  const inicial = asignatura?.nombre?.charAt(0)?.toUpperCase() ?? "📚";

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      {/* Back button — high-contrast capsule */}
      <button
        onClick={() => setVista("dashboard")}
        className="subject-back-btn mb-4 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      {/* Subject hero card — solid dark blue→violet billboard */}
      <div className="challenge-board subject-hero animate-bounce-in mb-6 rounded-3xl p-5 sm:p-6">
        <div className="relative z-10 flex items-start gap-4">
          {/* Subject icon — 'M' in cyan (Math) or 'L' in bright orange (Language) */}
          <div
            className={`subject-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl sm:h-16 sm:w-16 sm:text-3xl ${
              esMath ? "subject-icon-math" : "subject-icon-lang"
            }`}
          >
            {inicial}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="subject-hero-title text-2xl sm:text-3xl">
              {asignatura?.nombre ?? "Asignatura"}
            </h1>
            {asignatura?.descripcion && (
              <p className="subject-hero-subtitle mt-1.5 text-sm sm:text-base">
                {asignatura.descripcion}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mission-tag mission-tag-cyan">
                <Layers size={11} strokeWidth={2.5} />
                {modulos.length} módulos
              </span>
              <span className={`mission-tag ${esMath ? "mission-tag-cyan" : "mission-tag-amber"}`}>
                {esMath ? "Lógica y números" : "Lectura y escritura"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission cards (module list) */}
      {modulos.length === 0 ? (
        <div className="challenge-board rounded-3xl p-8 text-center">
          <BookOpen size={36} className="mx-auto mb-3 text-cyan-300" strokeWidth={2.5} />
          <p className="mission-title text-lg">Esta asignatura aún no tiene módulos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="mb-2 flex items-center gap-2 px-1">
            <Target size={16} className={esMath ? "text-cyan-300" : "text-orange-300"} strokeWidth={2.5} />
            <h2 className="label-on-dark text-sm font-black uppercase tracking-wide">
              Elige tu misión
            </h2>
          </div>
          {modulos.map((m, i) => {
            const bloqueado = nivelUsuario < m.nivelMinimo;
            const numClass = bloqueado
              ? "mission-num mission-num-locked"
              : esMath
              ? "mission-num mission-num-math"
              : "mission-num mission-num-lang";
            return (
              <div
                key={m.id}
                className="challenge-board mission-card animate-pop flex items-center gap-3 rounded-3xl p-4 sm:gap-4 sm:p-5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Number badge — cyan (Math) / orange (Language) / gray (locked) */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg sm:h-14 sm:w-14 sm:text-xl ${numClass}`}
                >
                  {bloqueado ? <Lock size={18} strokeWidth={2.5} /> : m.orden || i + 1}
                </div>

                {/* Title + description + tags */}
                <div className="flex-1 min-w-0">
                  <h3 className="mission-title text-base sm:text-lg leading-tight">
                    {m.titulo}
                  </h3>
                  {m.descripcion && (
                    <p className="mission-desc mt-1 text-xs sm:text-sm leading-snug">
                      {m.descripcion}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="mission-tag mission-tag-amber">
                      <Target size={10} strokeWidth={2.5} />
                      Nivel {m.nivelMinimo}
                    </span>
                    <span className="mission-tag mission-tag-cyan">
                      Módulo {i + 1} de {modulos.length}
                    </span>
                    <span className="mission-tag mission-tag-fuchsia">
                      {m._count?.desafios ?? 0} desafíos
                    </span>
                  </div>
                </div>

                {/* Jugar button — vivid cyan→fuchsia gradient, pure-white text + Play icon */}
                <button
                  onClick={() => jugarModulo(m)}
                  disabled={bloqueado}
                  className="mission-jugar-btn shrink-0 rounded-2xl px-4 py-2.5 text-sm sm:px-5 sm:py-3"
                  aria-label={bloqueado ? `Módulo bloqueado, requiere nivel ${m.nivelMinimo}` : `Jugar ${m.titulo}`}
                >
                  <Play size={14} fill="white" strokeWidth={0} />
                  {bloqueado ? "Bloqueado" : "Jugar"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
