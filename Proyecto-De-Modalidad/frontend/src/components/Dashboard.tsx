"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Trophy,
  Star,
  Play,
  Loader2,
  BookOpen,
  ArrowRight,
  ChevronRight,
  Store,
  Gamepad2,
  Truck,
  Bus,
  Mail,
  Target,
  Utensils,
  Wind,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import { AvatarSVG } from "@/components/AvatarSVG";
import { ParentDashboard } from "@/components/ParentDashboard";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { RunicCoin } from "@/components/RunicCoin";
import { EssenceCrystal } from "@/components/EssenceCrystal";
import { FuelTubeXP } from "@/components/FuelTubeXP";
import type { Asignatura } from "@/lib/types";

export function Dashboard() {
  const { usuario } = useApp();

  if (usuario?.rol === "PADRE") return <ParentDashboard />;
  if (usuario?.rol === "MAESTRO") return <TeacherDashboard />;

  return <StudentDashboard />;
}

function StudentDashboard() {
  const { usuario, setVista, setAsignaturaId, mostrarToast } = useApp();
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const data = await api.obtenerAsignaturas();
        if (!cancelado) setAsignaturas(data);
      } catch (err) {
        if (!cancelado) {
          const msg = err instanceof Error ? err.message : "Error al cargar asignaturas";
          mostrarToast(msg, "error");
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [mostrarToast]);

  if (!usuario) return null;

  const nivel = Math.floor(usuario.experiencia / 100) + 1;
  const xpEnNivel = usuario.experiencia % 100;

  const jugarAsignatura = (a: Asignatura) => {
    setAsignaturaId(a.id);
    setVista("asignatura");
  };

  // Determine subject accent: Math = cyan, Language = coral-gold
  const esMatematicas = (nombre: string) =>
    /matem/i.test(nombre ?? "");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      {/* Greeting */}
      <div className="mb-6 animate-pop">
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          ¡Hola,{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent text-glow-cyan">
            {usuario.nombre}
          </span>
          ! 👋
        </h1>
        <p className="mt-1.5 text-sm font-semibold text-cyan-100/70">
          ¿Listo para una nueva aventura de aprendizaje entre las estrellas?
        </p>
      </div>

      {/* Bento grid — avatar LEFT, progress + fuel tube RIGHT */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* ===== AVATAR PANEL (left) ===== */}
        <div className="glass-panel animate-bounce-in rounded-3xl p-5 lg:col-span-1">
          <div className="relative z-10">
            {/* Avatar stage */}
            <div className="relative mx-auto mb-4 flex h-48 w-48 items-center justify-center">
              {/* Glowing ring behind avatar */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/30 via-violet-500/25 to-rose-400/25 blur-2xl animate-glow" />
              <div className="absolute inset-2 rounded-full border border-cyan-300/40 bg-violet-950/40 backdrop-blur-sm" />
              <div className="absolute inset-0 rounded-full" style={{
                background: "conic-gradient(from 0deg, rgba(34,211,238,0.5), rgba(139,92,246,0.4), rgba(251,113,133,0.4), rgba(34,211,238,0.5))",
                mask: "radial-gradient(transparent 62%, black 64%)",
                WebkitMask: "radial-gradient(transparent 62%, black 64%)",
                opacity: 0.6,
              }} />
              <AvatarSVG config={usuario.avatarConfig} size={150} className="relative z-10 animate-float" />
            </div>

            <h2 className="text-center font-display text-xl font-bold text-white">
              {usuario.nombre}
            </h2>
            <p className="mt-0.5 text-center text-xs font-semibold text-cyan-200/60">
              Aprendiz del Cristal del Saber
            </p>

            {/* Wallet: Runic Coin + Essence Crystal */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="glass-soft flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5">
                <RunicCoin size={26} className="animate-float" />
                <span className="font-display text-lg font-bold text-amber-200 text-glow-gold">
                  {usuario.monedas}
                </span>
              </div>
              <div className="glass-soft flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5">
                <EssenceCrystal size={24} tint="violet" />
                <span className="font-display text-lg font-bold text-violet-200">
                  {usuario.gemas}
                </span>
              </div>
            </div>

            <button
              onClick={() => setVista("avatar")}
              className="btn-cosmic mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.02]"
            >
              <Sparkles size={16} strokeWidth={2.5} /> Personalizar mi avatar
            </button>
          </div>
        </div>

        {/* ===== PROGRESS PANEL (right) — fuel tube XP ===== */}
        <div className="glass-panel animate-bounce-in rounded-3xl p-5 lg:col-span-2" style={{ animationDelay: "80ms" }}>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-white">Mi progreso</h2>
              <span className="flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
                <Star size={12} fill="currentColor" strokeWidth={0} /> Nivel {nivel}
              </span>
            </div>

            {/* Stat boxes */}
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <StatBox
                label="Puntos"
                value={usuario.puntos}
                icon={<Star size={16} strokeWidth={2.5} />}
                tint="amber"
              />
              <StatBox
                label="Experiencia"
                value={usuario.experiencia}
                icon={<Trophy size={16} strokeWidth={2.5} />}
                tint="rose"
              />
              <StatBox
                label="Nivel"
                value={nivel}
                icon={<Sparkles size={16} strokeWidth={2.5} />}
                tint="cyan"
              />
            </div>

            {/* Fuel tube XP */}
            <div className="mt-5">
              <FuelTubeXP
                value={xpEnNivel}
                max={100}
                label={`Energía para Nivel ${nivel + 1}`}
                targetLabel="XP"
              />
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => setVista("ranking")}
                className="btn-cosmic flex items-center gap-1.5 rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-200 transition-all hover:scale-105 hover:bg-cyan-400/20"
              >
                <Trophy size={15} strokeWidth={2.5} /> Ver ranking
              </button>
              <button
                onClick={() => setVista("perfil")}
                className="btn-cosmic flex items-center gap-1.5 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-200 transition-all hover:scale-105 hover:bg-amber-400/20"
              >
                <Sparkles size={15} strokeWidth={2.5} /> Mis medallas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SUBJECTS (adventures) ===== */}
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-cyan-300" strokeWidth={2.5} />
          <h2 className="font-display text-xl font-bold text-white">Mis aventuras</h2>
        </div>

        {cargando ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
          </div>
        ) : asignaturas.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 text-center">
            <p className="font-display text-base font-semibold text-cyan-100/70">
              Aún no hay aventuras disponibles. ¡Vuelve pronto!
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {asignaturas.map((a, i) => {
              const mat = esMatematicas(a.nombre);
              const accent = mat ? "cyan" : "coral";
              return (
                <div
                  key={a.id}
                  className="glass-panel animate-pop group relative rounded-3xl p-5 transition-all hover:scale-[1.02]"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="relative z-10 flex h-full flex-col">
                    {/* 3D-ish initial badge */}
                    <div
                      className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl font-display text-xl font-bold text-white shadow-lg ${
                        mat
                          ? "bg-gradient-to-br from-cyan-300 to-cyan-600 shadow-cyan-500/40"
                          : "bg-gradient-to-br from-amber-300 via-rose-400 to-rose-500 shadow-rose-500/40"
                      }`}
                      style={{
                        boxShadow: mat
                          ? "0 8px 20px -6px rgba(34,211,238,0.6), inset 0 2px 4px rgba(255,255,255,0.5)"
                          : "0 8px 20px -6px rgba(251,113,133,0.6), inset 0 2px 4px rgba(255,255,255,0.5)",
                      }}
                    >
                      {a.nombre?.charAt(0)?.toUpperCase() ?? "📚"}
                    </div>

                    <h3 className="font-display text-base font-bold text-white">{a.nombre}</h3>
                    {a.descripcion && (
                      <p className="mt-1 line-clamp-2 text-xs font-medium text-cyan-100/60">
                        {a.descripcion}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-2 text-xs font-bold">
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          mat
                            ? "bg-cyan-400/15 text-cyan-200"
                            : "bg-rose-400/15 text-rose-200"
                        }`}
                      >
                        {a._count?.modulos ?? 0} módulos
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-cyan-100/40">
                        {accent === "cyan" ? "Lógica" : "Creatividad"}
                      </span>
                    </div>

                    <button
                      onClick={() => jugarAsignatura(a)}
                      className={`btn-cosmic mt-4 flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-sm font-bold text-white transition-all group-hover:scale-[1.02] ${
                        mat
                          ? "bg-gradient-to-r from-cyan-400 via-cyan-500 to-violet-500"
                          : "bg-gradient-to-r from-amber-400 via-rose-400 to-rose-500"
                      }`}
                    >
                      <Play size={14} fill="white" strokeWidth={0} /> Jugar
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== MINI-JUEGOS ===== */}
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Gamepad2 size={20} className="text-amber-300" strokeWidth={2.5} />
          <h2 className="font-display text-xl font-bold text-white">Mini-juegos</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Tarjeta: La Pulpería de Fracciones */}
          <button
            onClick={() => setVista("pulperia")}
            className="group glass-panel animate-pop relative rounded-3xl p-5 text-left transition-all hover:scale-[1.02]"
            style={{ animationDelay: "60ms" }}
            aria-label="Jugar La Pulpería de Fracciones"
          >
            <div className="relative z-10 flex h-full flex-col">
              {/* Badge con emoji */}
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 text-2xl shadow-lg shadow-orange-500/40"
                style={{
                  boxShadow:
                    "0 8px 20px -6px rgba(251,146,60,0.6), inset 0 2px 4px rgba(255,255,255,0.5)",
                }}
              >
                🍉
              </div>

              <h3 className="font-display text-base font-bold text-white">
                La Pulpería de Fracciones
              </h3>
              <p className="mt-1 line-clamp-2 text-xs font-medium text-cyan-100/60">
                Atiende a los clientes partiendo sandías, pasteles y piñas en fracciones iguales.
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-amber-200">
                  10 niveles
                </span>
                <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-rose-200">
                  Fracciones
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-cyan-100/40">
                  3er grado
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 py-2.5 text-sm font-bold text-white transition-all group-hover:scale-[1.02]">
                <Store size={14} strokeWidth={2.5} /> ¡Vender!
                <ArrowRight size={14} strokeWidth={2.5} />
              </div>
            </div>
          </button>

          {/* Tarjeta: El Camión de las Multiplicaciones */}
          <button
            onClick={() => setVista("camion")}
            className="group glass-panel animate-pop relative rounded-3xl p-5 text-left transition-all hover:scale-[1.02]"
            style={{ animationDelay: "120ms" }}
            aria-label="Jugar El Camión de las Multiplicaciones"
          >
            <div className="relative z-10 flex h-full flex-col">
              {/* Badge con emoji */}
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-300 via-emerald-400 to-lime-500 text-2xl shadow-lg shadow-emerald-500/40"
                style={{
                  boxShadow:
                    "0 8px 20px -6px rgba(16,185,129,0.6), inset 0 2px 4px rgba(255,255,255,0.5)",
                }}
              >
                🚚
              </div>

              <h3 className="font-display text-base font-bold text-white">
                El Camión de las Multiplicaciones
              </h3>
              <p className="mt-1 line-clamp-2 text-xs font-medium text-cyan-100/60">
                Carga cajitas en el camión para aprender a multiplicar en el mercado nicaragüense.
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="rounded-full bg-teal-400/15 px-2 py-0.5 text-teal-200">
                  10 niveles
                </span>
                <span className="rounded-full bg-lime-400/15 px-2 py-0.5 text-lime-200">
                  Multiplicación
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-cyan-100/40">
                  3er grado
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-lime-400 py-2.5 text-sm font-bold text-white transition-all group-hover:scale-[1.02]">
                <Truck size={14} strokeWidth={2.5} /> ¡Cargar!
                <ArrowRight size={14} strokeWidth={2.5} />
              </div>
            </div>
          </button>

          {/* Tarjeta: El Bus de las Letras */}
          <button
            onClick={() => setVista("bus")}
            className="group glass-panel animate-pop relative rounded-3xl p-5 text-left transition-all hover:scale-[1.02]"
            style={{ animationDelay: "180ms" }}
            aria-label="Jugar El Bus de las Letras"
          >
            <div className="relative z-10 flex h-full flex-col">
              {/* Badge con emoji */}
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-300 via-fuchsia-400 to-amber-400 text-2xl shadow-lg shadow-fuchsia-500/40"
                style={{
                  boxShadow:
                    "0 8px 20px -6px rgba(217,70,239,0.55), inset 0 2px 4px rgba(255,255,255,0.5)",
                }}
              >
                🚌
              </div>

              <h3 className="font-display text-base font-bold text-white">
                El Bus de las Letras
              </h3>
              <p className="mt-1 line-clamp-2 text-xs font-medium text-cyan-100/60">
                Lleva a los pasajeros al bus identificando sujetos, predicados y
                pronombres en cada parada.
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-rose-200">
                  10 niveles
                </span>
                <span className="rounded-full bg-fuchsia-400/15 px-2 py-0.5 text-fuchsia-200">
                  Lengua y Literatura
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-cyan-100/40">
                  3er grado
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-rose-400 via-fuchsia-400 to-amber-400 py-2.5 text-sm font-bold text-white transition-all group-hover:scale-[1.02]">
                <Bus size={14} strokeWidth={2.5} /> ¡Subir!
                <ArrowRight size={14} strokeWidth={2.5} />
              </div>
            </div>
          </button>

          {/* Tarjeta: La Carta Mal Enviada */}
          <button
            onClick={() => setVista("carta")}
            className="group glass-panel animate-pop relative rounded-3xl p-5 text-left transition-all hover:scale-[1.02]"
            style={{ animationDelay: "240ms" }}
            aria-label="Jugar La Carta Mal Enviada"
          >
            <div className="relative z-10 flex h-full flex-col">
              {/* Badge con emoji */}
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-orange-400 to-rose-500 text-2xl shadow-lg shadow-orange-500/40"
                style={{
                  boxShadow:
                    "0 8px 20px -6px rgba(249,115,22,0.6), inset 0 2px 4px rgba(255,255,255,0.5)",
                }}
              >
                ✉️
              </div>

              <h3 className="font-display text-base font-bold text-white">
                La Carta Mal Enviada
              </h3>
              <p className="mt-1 line-clamp-2 text-xs font-medium text-cyan-100/60">
                Sella las cartas corrigiendo errores de b/v, acentos y signos ¡!
                ¿? en la oficina de correos.
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-amber-200">
                  10 niveles
                </span>
                <span className="rounded-full bg-orange-400/15 px-2 py-0.5 text-orange-200">
                  Ortografía
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-cyan-100/40">
                  3er grado
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 py-2.5 text-sm font-bold text-white transition-all group-hover:scale-[1.02]">
                <Mail size={14} strokeWidth={2.5} /> ¡Sell!
                <ArrowRight size={14} strokeWidth={2.5} />
              </div>
            </div>
          </button>

          {/* Tarjeta: Atrapa el Acento */}
          <button
            onClick={() => setVista("atrapa")}
            className="group glass-panel animate-pop relative rounded-3xl p-5 text-left transition-all hover:scale-[1.02]"
            style={{ animationDelay: "300ms" }}
            aria-label="Jugar Atrapa el Acento"
          >
            <div className="relative z-10 flex h-full flex-col">
              {/* Badge con emoji */}
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-300 via-violet-400 to-amber-300 text-2xl shadow-lg shadow-fuchsia-500/40"
                style={{
                  boxShadow:
                    "0 8px 20px -6px rgba(217,70,239,0.55), inset 0 2px 4px rgba(255,255,255,0.5)",
                }}
              >
                🎯
              </div>

              <h3 className="font-display text-base font-bold text-white">
                Atrapa el Acento
              </h3>
              <p className="mt-1 line-clamp-2 text-xs font-medium text-cyan-100/60">
                Atrapa la vocal con tilde correcta mientras flota por la
                pantalla. ¡Rápido, antes de que se escape!
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="rounded-full bg-fuchsia-400/15 px-2 py-0.5 text-fuchsia-200">
                  20 palabras
                </span>
                <span className="rounded-full bg-violet-400/15 px-2 py-0.5 text-violet-200">
                  Acentos
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-cyan-100/40">
                  3er grado
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-fuchsia-400 via-violet-400 to-amber-400 py-2.5 text-sm font-bold text-white transition-all group-hover:scale-[1.02]">
                <Target size={14} strokeWidth={2.5} /> ¡Atrapar!
                <ArrowRight size={14} strokeWidth={2.5} />
              </div>
            </div>
          </button>

          {/* Tarjeta: Alimenta al Monstruo */}
          <button
            onClick={() => setVista("monstruo")}
            className="group glass-panel animate-pop relative rounded-3xl p-5 text-left transition-all hover:scale-[1.02]"
            style={{ animationDelay: "360ms" }}
            aria-label="Jugar Alimenta al Monstruo"
          >
            <div className="relative z-10 flex h-full flex-col">
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-300 via-amber-400 to-rose-500 text-2xl shadow-lg shadow-orange-500/40"
                style={{
                  boxShadow:
                    "0 8px 20px -6px rgba(251,146,60,0.6), inset 0 2px 4px rgba(255,255,255,0.5)",
                }}
              >
                🦷
              </div>

              <h3 className="font-display text-base font-bold text-white">
                Alimenta al Monstruo
              </h3>
              <p className="mt-1 line-clamp-2 text-xs font-medium text-cyan-100/60">
                Arrastra la respuesta correcta a la boca del monstruo
                hambriento. ¡Multiplicación y división!
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="rounded-full bg-orange-400/15 px-2 py-0.5 text-orange-200">
                  10 rondas
                </span>
                <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-amber-200">
                  Multiplicación
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-cyan-100/40">
                  3er grado
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400 py-2.5 text-sm font-bold text-white transition-all group-hover:scale-[1.02]">
                <Utensils size={14} strokeWidth={2.5} /> ¡Alimentar!
                <ArrowRight size={14} strokeWidth={2.5} />
              </div>
            </div>
          </button>

          {/* Tarjeta: Cazador de Sílabas */}
          <button
            onClick={() => setVista("silabas")}
            className="group glass-panel animate-pop relative rounded-3xl p-5 text-left transition-all hover:scale-[1.02]"
            style={{ animationDelay: "420ms" }}
            aria-label="Jugar Cazador de Sílabas"
          >
            <div className="relative z-10 flex h-full flex-col">
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-300 via-cyan-400 to-teal-400 text-2xl shadow-lg shadow-blue-500/40"
                style={{
                  boxShadow:
                    "0 8px 20px -6px rgba(59,130,246,0.6), inset 0 2px 4px rgba(255,255,255,0.5)",
                }}
              >
                🎈
              </div>

              <h3 className="font-display text-base font-bold text-white">
                Cazador de Sílabas
              </h3>
              <p className="mt-1 line-clamp-2 text-xs font-medium text-cyan-100/60">
                Reventa los globos en el orden correcto para formar la
                palabra. ¡Que no se te escapen!
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="rounded-full bg-blue-400/15 px-2 py-0.5 text-blue-200">
                  8 palabras
                </span>
                <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-cyan-200">
                  Sílabas
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-cyan-100/40">
                  3er grado
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 py-2.5 text-sm font-bold text-white transition-all group-hover:scale-[1.02]">
                <Wind size={14} strokeWidth={2.5} /> ¡Cazar!
                <ArrowRight size={14} strokeWidth={2.5} />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Decorative chevron hint */}
      <div className="mt-8 flex justify-center">
        <ChevronRight size={18} className="rotate-90 text-cyan-300/40 animate-float" />
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
  tint,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tint: "cyan" | "amber" | "rose";
}) {
  const tintMap = {
    cyan: { border: "border-cyan-400/40", bg: "bg-cyan-400/10", text: "text-cyan-200", glow: "text-cyan-300" },
    amber: { border: "border-amber-400/40", bg: "bg-amber-400/10", text: "text-amber-200", glow: "text-amber-300" },
    rose: { border: "border-rose-400/40", bg: "bg-rose-400/10", text: "text-rose-200", glow: "text-rose-300" },
  }[tint];

  return (
    <div className={`glass-soft rounded-2xl border ${tintMap.border} ${tintMap.bg} px-3 py-2.5`}>
      <div className="flex items-center gap-1.5">
        <span className={tintMap.glow}>{icon}</span>
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/60">{label}</p>
      </div>
      <p className={`mt-0.5 font-display text-xl font-bold ${tintMap.text}`}>{value}</p>
    </div>
  );
}
