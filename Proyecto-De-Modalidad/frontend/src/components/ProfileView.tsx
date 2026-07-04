"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Award,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import { AvatarSVG } from "@/components/AvatarSVG";
import type { MedallaEstudiante, Rol } from "@/lib/types";

// ---- Helpers -------------------------------------------------------------

/** Map role + level to a dynamic "hero title" (replaces flat "Estudiante"). */
function tituloHeroe(rol: Rol, nivel: number): string {
  if (rol === "MAESTRO") return "Sabio Mentor";
  if (rol === "PADRE") return "Guardián del Hogar";
  // ESTUDIANTE: title scales with level to motivate progression
  if (nivel >= 7) return "Explorador Legendario";
  if (nivel >= 5) return "Explorador Maestro";
  if (nivel >= 3) return "Explorador Aventurero";
  return "Explorador Novato";
}

// Backdrop floating icons (math symbols + alphabet letters) — cosmic flavor
const ICONOS_FONDO = [
  { simbolo: "+", top: "8%", left: "6%", size: 64, color: "rgba(34,211,238,0.20)", delay: "0s" },
  { simbolo: "×", top: "14%", left: "88%", size: 56, color: "rgba(244,114,182,0.22)", delay: "1.2s" },
  { simbolo: "−", top: "42%", left: "3%", size: 50, color: "rgba(167,139,250,0.22)", delay: "2.4s" },
  { simbolo: "A", top: "26%", left: "12%", size: 44, color: "rgba(251,191,36,0.20)", delay: "0.6s" },
  { simbolo: "B", top: "62%", left: "92%", size: 52, color: "rgba(34,211,238,0.18)", delay: "1.8s" },
  { simbolo: "C", top: "78%", left: "8%", size: 48, color: "rgba(244,114,182,0.20)", delay: "3s" },
  { simbolo: "+", top: "85%", left: "82%", size: 60, color: "rgba(167,139,250,0.18)", delay: "0.9s" },
  { simbolo: "÷", top: "52%", left: "78%", size: 46, color: "rgba(251,191,36,0.20)", delay: "2.1s" },
  { simbolo: "D", top: "34%", left: "70%", size: 42, color: "rgba(34,211,238,0.18)", delay: "1.5s" },
  { simbolo: "E", top: "68%", left: "44%", size: 50, color: "rgba(244,114,182,0.16)", delay: "2.7s" },
];

// Total medal slots on the shelf (unlocked + locked silhouettes)
const TOTAL_SLOTS = 8;

// ---- SVG 3D icons --------------------------------------------------------

/** 3D golden floating star with radial gradient + specular highlight. */
function PowerStar({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="animate-star-float"
      aria-hidden
    >
      <defs>
        <radialGradient id="pstarGold" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="22%" stopColor="#fef3c7" />
          <stop offset="48%" stopColor="#fbbf24" />
          <stop offset="78%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
        <filter id="pstarGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polygon
        points="50,6 61,37 94,37 67,57 78,90 50,69 22,90 33,57 6,37 39,37"
        fill="url(#pstarGold)"
        stroke="#fcd34d"
        strokeWidth="1.5"
        strokeLinejoin="round"
        filter="url(#pstarGlow)"
      />
      <ellipse
        cx="42"
        cy="33"
        rx="11"
        ry="6"
        fill="rgba(255,255,255,0.6)"
        transform="rotate(-25 42 33)"
      />
      <circle cx="58" cy="62" r="2.5" fill="rgba(255,255,255,0.85)" />
    </svg>
  );
}

/** 3D metallic shiny trophy with golden cup + handles + base. */
function PowerTrophy({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="animate-metal-shine"
      aria-hidden
    >
      <defs>
        <linearGradient id="ptrophyGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="25%" stopColor="#fde047" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="ptrophyHandle" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="ptrophyBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>
      {/* Left handle */}
      <path
        d="M 22 32 Q 8 36 12 52 Q 14 60 24 58"
        fill="none"
        stroke="url(#ptrophyHandle)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Right handle */}
      <path
        d="M 78 32 Q 92 36 88 52 Q 86 60 76 58"
        fill="none"
        stroke="url(#ptrophyHandle)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Cup body */}
      <path
        d="M 24 24 L 76 24 L 72 60 Q 70 70 50 70 Q 30 70 28 60 Z"
        fill="url(#ptrophyGold)"
        stroke="#fcd34d"
        strokeWidth="1.5"
      />
      {/* Star engraving */}
      <polygon
        points="50,32 53,42 63,42 55,48 58,58 50,52 42,58 45,48 37,42 47,42"
        fill="#92400e"
        opacity="0.75"
      />
      {/* Stem */}
      <rect x="46" y="68" width="8" height="10" fill="url(#ptrophyGold)" />
      {/* Base */}
      <rect x="32" y="78" width="36" height="8" rx="2" fill="url(#ptrophyBase)" />
      <rect x="28" y="84" width="44" height="6" rx="2" fill="url(#ptrophyBase)" />
      {/* Specular highlight on cup */}
      <ellipse cx="38" cy="38" rx="6" ry="14" fill="rgba(255,255,255,0.55)" transform="rotate(-12 38 38)" />
    </svg>
  );
}

/** Neon green sparkle with bright glow + white core. */
function PowerSparkle({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="animate-sparkle-pulse"
      aria-hidden
    >
      <defs>
        <radialGradient id="psparkleGreen" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#d1fae5" />
          <stop offset="45%" stopColor="#34d399" />
          <stop offset="78%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064e3b" />
        </radialGradient>
        <filter id="psparkleGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Four-pointed sparkle */}
      <path
        d="M 50 6 C 56 32 68 44 94 50 C 68 56 56 68 50 94 C 44 68 32 56 6 50 C 32 44 44 32 50 6 Z"
        fill="url(#psparkleGreen)"
        stroke="#6ee7b7"
        strokeWidth="1.5"
        strokeLinejoin="round"
        filter="url(#psparkleGlow)"
      />
      {/* Bright white core */}
      <circle cx="50" cy="50" r="7" fill="#ffffff" opacity="0.9" />
      <circle cx="50" cy="50" r="3" fill="#ecfdf5" />
      {/* Small cross sparkle */}
      <path
        d="M 50 14 L 50 22 M 50 78 L 50 86 M 14 50 L 22 50 M 78 50 L 86 50"
        stroke="#a7f3d0"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

// ---- Main component ------------------------------------------------------

export function ProfileView() {
  const { usuario, setVista, mostrarToast } = useApp();
  const [medallas, setMedallas] = useState<MedallaEstudiante[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuario) return;
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const data = await api.obtenerMedallas(usuario.id);
        if (!cancelado) setMedallas(data);
      } catch (err) {
        if (!cancelado) {
          const msg = err instanceof Error ? err.message : "Error al cargar medallas";
          mostrarToast(msg, "error");
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [usuario, mostrarToast]);

  const nivel = useMemo(
    () => (usuario ? Math.floor(usuario.experiencia / 100) + 1 : 1),
    [usuario]
  );
  const xpEnNivel = usuario ? usuario.experiencia % 100 : 0;
  const titulo = usuario ? tituloHeroe(usuario.rol, nivel) : "";

  // Locked slots = total shelf slots − already earned medals
  const slotsBloqueados = Math.max(0, TOTAL_SLOTS - medallas.length);

  if (!usuario) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Backdrop: floating math symbols + alphabet letters */}
      <div className="hero-chamber-bg pointer-events-none absolute inset-0 z-0" aria-hidden>
        {ICONOS_FONDO.map((ic, i) => (
          <span
            key={i}
            className="animate-drift-slow absolute select-none font-black"
            style={{
              top: ic.top,
              left: ic.left,
              fontSize: `${ic.size}px`,
              color: ic.color,
              animationDelay: ic.delay,
              textShadow: `0 0 20px ${ic.color}`,
            }}
          >
            {ic.simbolo}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6 sm:py-8">
        {/* Volver */}
        <button
          onClick={() => setVista("dashboard")}
          className="mb-4 inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/40 bg-white/10 px-3 py-2 text-sm font-bold text-cyan-100 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Volver
        </button>

        {/* ===== HERO CARD: holographic avatar + comic name + gummy wallet ===== */}
        <section className="power-capsule animate-bounce-in mb-6 rounded-[2rem] p-5 sm:p-7">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            {/* Holographic circular frame */}
            <div className="relative shrink-0">
              {/* Outer ambient glow */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(34,211,238,0.45) 0%, rgba(139,92,246,0.3) 50%, transparent 75%)",
                  filter: "blur(18px)",
                  transform: "scale(1.2)",
                }}
                aria-hidden
              />
              <div className="holographic-frame relative h-40 w-40 sm:h-48 sm:w-48">
                <div className="relative z-10 flex h-full w-full items-center justify-center">
                  <AvatarSVG
                    config={usuario.avatarConfig}
                    size={150}
                    className="animate-capsule-float"
                  />
                </div>
              </div>
            </div>

            {/* Name + role + wallet */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="comic-name text-4xl sm:text-5xl">{usuario.nombre}</h1>
              <p className="role-dynamic mt-1 text-lg sm:text-xl">{titulo}</p>

              {/* Gummy bubble wallet buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <button
                  type="button"
                  className="gummy-coin flex items-center gap-2 px-4 py-2.5 text-base"
                  title="Monedas ganadas respondiendo desafíos"
                >
                  <span className="text-xl">🪙</span>
                  <span className="font-black tabular-nums">{usuario.monedas}</span>
                  <span className="text-[10px] font-bold uppercase opacity-80">monedas</span>
                </button>
                <button
                  type="button"
                  className="gummy-gem flex items-center gap-2 px-4 py-2.5 text-base"
                  title="Gemas ganadas completando módulos"
                >
                  <span className="text-xl">💎</span>
                  <span className="font-black tabular-nums">{usuario.gemas}</span>
                  <span className="text-[10px] font-bold uppercase opacity-80">gemas</span>
                </button>
              </div>

              <button
                onClick={() => setVista("avatar")}
                className="btn-3d mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105"
              >
                <Sparkles size={15} strokeWidth={2.5} /> Editar mi avatar
              </button>
            </div>
          </div>
        </section>

        {/* ===== POWER CAPSULES: 3 translucent stat cards ===== */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {/* PUNTOS — 3D golden floating star */}
          <div
            className="power-capsule animate-pop flex flex-col items-center rounded-[1.5rem] p-5 text-center"
            style={{ animationDelay: "0ms" }}
          >
            <div className="relative mb-1 h-16 w-16">
              <PowerStar size={64} />
            </div>
            <p className="text-3xl font-black tabular-nums text-white drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
              {usuario.puntos}
            </p>
            <p className="mt-0.5 text-xs font-black uppercase tracking-widest text-cyan-100/80">
              Puntos
            </p>
          </div>

          {/* NIVEL — 3D metallic shiny trophy */}
          <div
            className="power-capsule animate-pop flex flex-col items-center rounded-[1.5rem] p-5 text-center"
            style={{ animationDelay: "80ms" }}
          >
            <div className="relative mb-1 h-16 w-16">
              <PowerTrophy size={64} />
            </div>
            <p className="text-3xl font-black tabular-nums text-white drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
              {nivel}
            </p>
            <p className="mt-0.5 text-xs font-black uppercase tracking-widest text-cyan-100/80">
              Nivel
            </p>
          </div>

          {/* EXPERIENCIA — neon green sparkle */}
          <div
            className="power-capsule animate-pop flex flex-col items-center rounded-[1.5rem] p-5 text-center"
            style={{ animationDelay: "160ms" }}
          >
            <div className="relative mb-1 h-16 w-16">
              <PowerSparkle size={64} />
            </div>
            <p className="text-3xl font-black tabular-nums text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]">
              {usuario.experiencia}
            </p>
            <p className="mt-0.5 text-xs font-black uppercase tracking-widest text-cyan-100/80">
              Experiencia
            </p>
          </div>
        </div>

        {/* ===== XP THERMOMETER ===== */}
        <section className="power-capsule mb-6 rounded-[1.5rem] p-5">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-cyan-100">
                Progreso al nivel {nivel + 1}
              </span>
            </div>
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-sm font-black tabular-nums text-white ring-1 ring-white/25">
              {xpEnNivel}/100 XP
            </span>
          </div>
          <div className="xp-thermometer-tube">
            <div
              className="xp-thermometer-liquid"
              style={{ width: `${xpEnNivel}%` }}
            />
          </div>
          <p className="mt-2 text-center text-[11px] font-semibold text-cyan-100/70">
            ¡Sigue completando desafíos para llenar tu termómetro de energía! ⚡
          </p>
        </section>

        {/* ===== MEDAL SHELF — satin space metal collectibles panel ===== */}
        <section className="medal-shelf rounded-[1.75rem] p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-500 shadow-md ring-1 ring-white/30">
              <Award size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              ¡Mis medallas!
            </h2>
            <span className="rounded-full bg-cyan-400/20 px-2.5 py-0.5 text-xs font-black text-cyan-100 ring-1 ring-cyan-300/40">
              {medallas.length}/{TOTAL_SLOTS}
            </span>
          </div>

          {cargando ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-7 w-7 animate-spin text-cyan-300" />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
              {/* Earned medals */}
              {medallas.map((m, i) => (
                <div
                  key={m.id}
                  className="animate-pop group relative flex aspect-square items-center justify-center"
                  style={{ animationDelay: `${i * 60}ms` }}
                  title={m.medalla.titulo}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 shadow-[0_0_18px_rgba(251,191,36,0.6)] ring-2 ring-amber-200/60" />
                  <div className="absolute inset-[14%] rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-inner">
                    <Award size={20} className="text-amber-900" strokeWidth={2.5} fill="currentColor" />
                  </div>
                  {/* Tooltip on hover */}
                  <div className="pointer-events-none absolute -top-1 left-1/2 z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-violet-950/95 px-2 py-1 text-[10px] font-bold text-cyan-100 opacity-0 ring-1 ring-cyan-400/40 transition-opacity group-hover:opacity-100">
                    {m.medalla.titulo}
                  </div>
                </div>
              ))}

              {/* Locked medal silhouettes */}
              {Array.from({ length: slotsBloqueados }).map((_, i) => (
                <div
                  key={`locked-${i}`}
                  className="locked-medal animate-pop"
                  style={{ animationDelay: `${(medallas.length + i) * 60}ms` }}
                  title="¡Juega más para desbloquear esta medalla!"
                >
                  <span className="locked-q text-2xl">?</span>
                </div>
              ))}
            </div>
          )}

          {medallas.length === 0 && !cargando && (
            <p className="mt-4 rounded-2xl border border-dashed border-violet-400/40 bg-violet-950/30 p-4 text-center text-sm font-semibold text-violet-100">
              🔒 Aún no tienes medallas. ¡Completa módulos para desbloquearlas y llenar tu estante de colección!
            </p>
          )}
          {medallas.length > 0 && medallas.length < TOTAL_SLOTS && !cargando && (
            <p className="mt-4 text-center text-[11px] font-semibold text-violet-200/80">
              🔒 {slotsBloqueados} medalla{slotsBloqueados === 1 ? "" : "s"} bloqueada{slotsBloqueados === 1 ? "" : "s"} — ¡sigue jugando para desbloquearlas!
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
