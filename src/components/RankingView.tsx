"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Star, Sparkles, Crown } from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import { HeroTrophy } from "@/components/HeroTrophy";
import { HonorMedal } from "@/components/HonorMedal";

interface RankingItem {
  id: string;
  nombre: string;
  puntos: number;
  experiencia: number;
}

interface PodiumStyle {
  height: string;
  slab: string;
  badge: string;
  badgeText: string;
  ring: string;
  crown?: React.ReactNode;
  label: string;
  glow: string;
}

export function RankingView() {
  const { usuario, setVista, mostrarToast } = useApp();
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const data = await api.obtenerRanking();
        if (!cancelado) setRanking(data);
      } catch (err) {
        if (!cancelado) {
          const msg = err instanceof Error ? err.message : "Error al cargar el ranking";
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

  const podiumStyle = (idx: number): PodiumStyle | null => {
    if (idx === 0)
      return {
        height: "h-36",
        slab: "from-amber-300 via-amber-400 to-amber-600",
        badge: "bg-gradient-to-br from-amber-300 to-amber-600",
        badgeText: "text-amber-950",
        ring: "ring-amber-400",
        crown: <Crown size={22} className="text-amber-200 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]" strokeWidth={2.5} fill="currentColor" />,
        label: "1°",
        glow: "shadow-[0_0_30px_rgba(251,191,36,0.6)]",
      };
    if (idx === 1)
      return {
        height: "h-28",
        slab: "from-stone-300 via-stone-400 to-stone-500",
        badge: "bg-gradient-to-br from-stone-200 to-stone-400",
        badgeText: "text-stone-800",
        ring: "ring-stone-400",
        crown: <Crown size={18} className="text-stone-200" strokeWidth={2.5} fill="currentColor" />,
        label: "2°",
        glow: "shadow-[0_0_20px_rgba(168,162,158,0.5)]",
      };
    if (idx === 2)
      return {
        height: "h-24",
        slab: "from-orange-400 via-orange-500 to-orange-700",
        badge: "bg-gradient-to-br from-orange-400 to-orange-600",
        badgeText: "text-orange-950",
        ring: "ring-orange-500",
        crown: <Crown size={16} className="text-orange-200" strokeWidth={2.5} fill="currentColor" />,
        label: "3°",
        glow: "shadow-[0_0_22px_rgba(251,113,133,0.5)]",
      };
    return null;
  };

  const top3 = ranking.slice(0, 3);
  const resto = ranking.slice(3);
  // Podium display order: 2nd, 1st, 3rd
  const podioOrden = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div className="hero-hall relative min-h-screen overflow-hidden text-stone-700">
      {/* ===== Hero hall backdrop — blurred sage statues + columns ===== */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Light from above */}
        <div className="absolute -top-10 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-200/40 blur-[80px]" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cyan-200/30 blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-orange-200/30 blur-[80px]" />

        {/* Blurred temple columns (left + right) */}
        <div className="absolute left-2 top-[10%] hidden h-[34rem] w-14 flex-col justify-around sm:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gradient-to-b from-stone-300/40 via-stone-200/30 to-stone-300/40 backdrop-blur-[3px]" style={{ height: `${60 + (i % 2) * 20}px` }} />
          ))}
        </div>
        <div className="absolute right-2 top-[10%] hidden h-[34rem] w-14 flex-col justify-around sm:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gradient-to-b from-stone-300/40 via-stone-200/30 to-stone-300/40 backdrop-blur-[3px]}" style={{ height: `${60 + (i % 2) * 20}px` }} />
          ))}
        </div>

        {/* Blurred sage statues (silhouettes in the background) */}
        <div className="absolute left-[16%] top-[22%] hidden opacity-40 blur-[2px] sm:block">
          <SageStatue />
        </div>
        <div className="absolute right-[16%] top-[22%] hidden opacity-40 blur-[2px] sm:block">
          <SageStatue />
        </div>
        <div className="absolute left-[42%] top-[16%] hidden opacity-30 blur-[3px] lg:block">
          <SageStatue />
        </div>

        {/* Floor light beam */}
        <div className="absolute inset-x-0 bottom-0 h-32 opacity-30" style={{
          background: "linear-gradient(to top, rgba(251,191,36,0.4), transparent)",
        }} />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-6 sm:py-8">
        {/* Back button */}
        <button
          onClick={() => setVista("dashboard")}
          className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-orange-400/40 bg-white/60 px-4 py-2 text-sm font-bold text-orange-700 backdrop-blur-md transition-all hover:scale-105 hover:bg-white"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Volver
        </button>

        {/* ===== Marble slab container ===== */}
        <div className="marble-slab animate-bounce-in rounded-[2rem] p-6 sm:p-8">
          {/* Header with 3D trophy */}
          <div className="relative mb-6 text-center">
            {/* Glow halo behind trophy */}
            <div className="mx-auto mb-1 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-radial from-amber-300/40 via-amber-200/10 to-transparent blur-md" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.35) 0%, transparent 70%)" }} />
            <div className="relative mx-auto -mt-32 mb-1 flex justify-center animate-trophy-float">
              <HeroTrophy size={130} />
            </div>
            <h1 className="font-display text-3xl font-bold text-stone-800 sm:text-4xl">
              <span className="neon-engrave-orange">Ranking</span> de Estudiantes
            </h1>
            <p className="mt-1.5 text-sm font-semibold text-stone-600">
              Salón de Héroes · ¡Mira quién lidera la aventura del saber!
            </p>
            {/* Decorative neon divider */}
            <div className="mx-auto mt-3 flex max-w-xs items-center justify-center gap-2">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
              <Sparkles size={12} className="text-orange-500" />
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
            </div>
          </div>

          {cargando ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : ranking.length === 0 ? (
            <div className="rounded-2xl bg-white/40 p-8 text-center">
              <HeroTrophy size={70} className="mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-600">Aún no hay estudiantes en el salón de héroes.</p>
            </div>
          ) : (
            <>
              {/* ===== Podium (top 3) ===== */}
              {top3.length > 0 && (
                <div className="mb-6 flex items-end justify-center gap-2 sm:gap-4">
                  {podioOrden.map((item) => {
                    const realIdx = ranking.findIndex((r) => r.id === item.id);
                    const pod = podiumStyle(realIdx)!;
                    const soy = usuario?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`flex flex-1 flex-col items-center rounded-2xl p-2 transition-all ${soy ? "amber-crystal" : ""}`}
                        style={{ maxWidth: "10rem" }}
                      >
                        {/* Crown above name — bigger for 1st place */}
                        <div className={`mb-1 flex items-end justify-center ${realIdx === 0 ? "h-10" : "h-7"}`}>
                          {realIdx === 0 ? (
                            <Crown size={32} className="text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,1)] animate-medal-sway" strokeWidth={2.5} fill="currentColor" />
                          ) : (
                            pod.crown
                          )}
                        </div>

                        {/* Name + medal (for current user) */}
                        <div className="mb-1.5 flex items-center gap-1">
                          <p className={`text-sm font-bold ${soy ? "neon-engrave-gold" : "text-stone-700"} truncate max-w-[8rem]`}>
                            {item.nombre}
                          </p>
                          {soy && <HonorMedal size={18} />}
                        </div>

                        {/* Avatar circle / rank badge — amber glow for current user */}
                        <div
                          className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ring-2 ${pod.badge} ${pod.ring} ${soy ? "ring-4 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]" : pod.glow}`}
                        >
                          <span className={`text-base font-black ${pod.badgeText}`}>{pod.label}</span>
                        </div>

                        {/* Points */}
                        <p className={`text-lg font-black ${soy ? "neon-engrave-gold" : "text-stone-800"}`}>{item.puntos}</p>
                        <p className="text-[9px] font-bold uppercase tracking-wide text-stone-500">puntos</p>

                        {/* Pedestal slab */}
                        <div className={`mt-2 w-full ${pod.height} rounded-t-xl bg-gradient-to-b ${pod.slab} relative overflow-hidden border-2 ${soy ? "border-amber-400" : "border-orange-500/50"} shadow-[0_0_18px_rgba(251,113,133,0.4),0_8px_20px_-6px_rgba(80,50,30,0.5)]`}>
                          {/* Slab highlight */}
                          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent" />
                          {/* Neon orange inlay line */}
                          <div className={`absolute inset-x-2 top-2 bottom-2 rounded-lg border-2 ${soy ? "border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.6)]" : "border-orange-300/70 shadow-[0_0_8px_rgba(251,113,133,0.4)]"}`} />
                          {/* Rank number engraved */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-display text-4xl font-black text-white/85 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                              {pod.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ===== Rest of ranking (4th+) ===== */}
              {resto.length > 0 && (
                <div className="space-y-2.5">
                  {resto.map((item, idx) => {
                    const realIdx = idx + 3;
                    const soy = usuario?.id === item.id;
                    const nivel = Math.floor(item.experiencia / 100) + 1;
                    return (
                      <div
                        key={item.id}
                        className={`animate-pop flex items-center gap-3 rounded-2xl p-3.5 transition-all ${
                          soy ? "amber-crystal" : "marble-card"
                        }`}
                        style={{ animationDelay: `${idx * 40}ms` }}
                      >
                        {/* Rank number */}
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${
                            soy
                              ? "bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950"
                              : "bg-white/70 text-stone-700 border border-stone-300/40"
                          }`}
                        >
                          {realIdx + 1}°
                        </div>

                        {/* Name + medal for current user */}
                        <div className="flex-1 min-w-0">
                          <p className="flex items-center gap-1.5 truncate text-base font-black text-stone-800">
                            {item.nombre}
                            {soy && (
                              <>
                                <HonorMedal size={18} />
                                <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                                  ¡Tú!
                                </span>
                              </>
                            )}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2 text-xs font-bold text-stone-500">
                            <span className="inline-flex items-center gap-0.5 text-amber-600">
                              <Star size={11} strokeWidth={2.5} fill="currentColor" /> {item.puntos} pts
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-cyan-600">
                              <Sparkles size={11} strokeWidth={2.5} /> Nivel {nivel}
                            </span>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                          <p className={`text-lg font-black ${soy ? "neon-engrave-gold" : "text-stone-800"}`}>{item.puntos}</p>
                          <p className="text-[10px] font-bold uppercase text-stone-400">puntos</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Footer note */}
              <p className="mt-6 text-center text-xs font-medium text-stone-500">
                <Sparkles size={11} className="mr-1 inline text-orange-500" />
                Sigue respondiendo desafíos para escalar el podio del saber
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Blurred sage statue silhouette for the background */
function SageStatue() {
  return (
    <svg width="60" height="120" viewBox="0 0 60 120" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="ss-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a8a29e" />
          <stop offset="100%" stopColor="#78716c" />
        </linearGradient>
      </defs>
      {/* Pedestal */}
      <rect x="14" y="100" width="32" height="18" fill="url(#ss-grad)" rx="1" />
      {/* Robe body */}
      <path d="M18 60 Q 30 56, 42 60 L 46 100 L 14 100 Z" fill="url(#ss-grad)" />
      {/* Head */}
      <circle cx="30" cy="44" r="10" fill="url(#ss-grad)" />
      {/* Beard hint */}
      <path d="M24 50 Q 30 60, 36 50 L 34 56 Q 30 58, 26 56 Z" fill="#57534e" opacity="0.5" />
      {/* Arm holding scroll */}
      <rect x="38" y="64" width="6" height="20" fill="url(#ss-grad)" rx="2" transform="rotate(15 41 74)" />
    </svg>
  );
}
