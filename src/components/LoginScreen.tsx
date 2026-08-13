"use client";

import { useState } from "react";
import { GraduationCap, Users, BookOpen, Loader2, LogIn, UserPlus, Sparkles, Rocket } from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import { Logo } from "@/components/Logo";
import type { Rol } from "@/lib/types";

interface RolOption {
  id: Rol;
  label: string;
  desc: string;
  icon: React.ReactNode;
  activo: string;
  inactivo: string;
}

const ROLES: RolOption[] = [
  {
    id: "ESTUDIANTE",
    label: "Estudiante",
    desc: "¡Aprende jugando!",
    icon: <GraduationCap size={22} strokeWidth={2.5} />,
    activo: "bg-gradient-to-r from-cyan-400 to-teal-500 text-white shadow-lg shadow-cyan-500/40",
    inactivo: "bg-white/5 text-cyan-100 hover:bg-cyan-400/15 border border-cyan-400/20",
  },
  {
    id: "PADRE",
    label: "Papá / Mamá",
    desc: "Sigue el progreso",
    icon: <Users size={22} strokeWidth={2.5} />,
    activo: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/40",
    inactivo: "bg-white/5 text-amber-100 hover:bg-amber-400/15 border border-amber-400/20",
  },
  {
    id: "MAESTRO",
    label: "Maestro/a",
    desc: "Crea contenido",
    icon: <BookOpen size={22} strokeWidth={2.5} />,
    activo: "bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white shadow-lg shadow-fuchsia-500/40",
    inactivo: "bg-white/5 text-fuchsia-100 hover:bg-fuchsia-400/15 border border-fuchsia-400/20",
  },
];

export function LoginScreen() {
  const { setUsuario, setVista, setRolSeleccionado, rolSeleccionado, mostrarToast } = useApp();
  const [modo, setModo] = useState<"login" | "crear">("login");
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");
  const [cargando, setCargando] = useState(false);
  const [demoCargando, setDemoCargando] = useState<Rol | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      mostrarToast("Escribe tu nombre", "error");
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      mostrarToast("El PIN debe tener 4 dígitos", "error");
      return;
    }
    setCargando(true);
    try {
      const usuario =
        modo === "login"
          ? await api.login(nombre.trim(), pin, rolSeleccionado)
          : await api.crearUsuario(nombre.trim(), pin, rolSeleccionado);
      setUsuario(usuario);
      setRolSeleccionado(usuario.rol);
      // Navegación según rol
      if (usuario.rol === "PADRE") {
        setVista("padre");
      } else if (usuario.rol === "MAESTRO") {
        setVista("maestro");
      } else {
        setVista("dashboard");
      }
      mostrarToast(`¡Hola, ${usuario.nombre}!`, "exito");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión";
      mostrarToast(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const entrarDemo = async (rol: Rol) => {
    setDemoCargando(rol);
    setRolSeleccionado(rol);
    try {
      const usuario = await api.loginDemo(rol);
      // Si es maestro demo, preparar sección + estudiantes demo (idempotente)
      if (rol === "MAESTRO") {
        try {
          await api.seedMaestroDemo(usuario.id);
        } catch {
          // El seed es opcional; si falla no bloqueamos el login
        }
      }
      // Si es padre demo, preparar vínculo con DemoKid + avisos + conversación demo
      if (rol === "PADRE") {
        try {
          await api.seedPadreDemo(usuario.id);
        } catch {
          // El seed es opcional; si falla no bloqueamos el login
        }
      }
      setUsuario(usuario);
      setRolSeleccionado(usuario.rol);
      // Navegación según rol: maestro y padre van a sus dashboards dedicados
      if (usuario.rol === "PADRE") {
        setVista("padre");
      } else if (usuario.rol === "MAESTRO") {
        setVista("maestro");
      } else {
        setVista("dashboard");
      }
      mostrarToast(`¡Modo demo! Hola, ${usuario.nombre} 🚀`, "exito");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al entrar en modo demo";
      mostrarToast(msg, "error");
    } finally {
      setDemoCargando(null);
    }
  };

  const DEMO_ROLES: { rol: Rol; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
    {
      rol: "ESTUDIANTE",
      label: "Estudiante",
      sub: "DemoKid",
      icon: <GraduationCap size={16} strokeWidth={2.5} />,
      color: "from-cyan-400 to-teal-500",
    },
    {
      rol: "PADRE",
      label: "Papá/Mamá",
      sub: "PadreDemo",
      icon: <Users size={16} strokeWidth={2.5} />,
      color: "from-amber-400 to-orange-500",
    },
    {
      rol: "MAESTRO",
      label: "Maestro/a",
      sub: "MaestroDemo",
      icon: <BookOpen size={16} strokeWidth={2.5} />,
      color: "from-fuchsia-500 to-rose-500",
    },
  ];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col justify-center px-4 py-8">
      <div className="mb-6 text-center animate-pop">
        <div className="mb-3 flex justify-center">
          <Logo size={64} withText={false} />
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-cyan-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent text-glow-cyan">
            Mundi
          </span>
          <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-fuchsia-300 bg-clip-text text-transparent text-glow-coral">
            lex
          </span>
        </h1>
        <p className="mt-2 text-sm font-bold text-cyan-100/70">
          ¡Aprende jugando entre las estrellas! <Sparkles size={14} className="ml-1 inline text-amber-300" />
        </p>
      </div>

      <div className="card-premium animate-bounce-in rounded-3xl p-6 sm:p-7">
        {/* Role selector */}
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-cyan-300">
          ¿Quién eres?
        </p>
        <div className="mb-5 grid grid-cols-3 gap-2">
          {ROLES.map((r) => {
            const activo = rolSeleccionado === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRolSeleccionado(r.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl p-3 text-center transition-all hover:scale-105 ${
                  activo ? r.activo : r.inactivo
                }`}
              >
                {r.icon}
                <span className="text-xs font-bold leading-tight">{r.label}</span>
                <span className="text-[10px] font-medium opacity-80">{r.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Mode toggle */}
        <div className="mb-5 flex rounded-2xl bg-cyan-400/10 p-1">
          <button
            type="button"
            onClick={() => setModo("login")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold transition-all ${
              modo === "login" ? "bg-violet-950/70 text-cyan-200 shadow" : "text-cyan-100/60"
            }`}
          >
            <LogIn size={15} strokeWidth={2.5} /> Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setModo("crear")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold transition-all ${
              modo === "crear" ? "bg-violet-950/70 text-cyan-200 shadow" : "text-cyan-100/60"
            }`}
          >
            <UserPlus size={15} strokeWidth={2.5} /> Crear cuenta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-bold text-cyan-100/70">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              maxLength={40}
              className="w-full rounded-2xl border border-cyan-400/30 bg-violet-950/40 px-4 py-3 text-sm font-bold text-white outline-none transition-all placeholder:font-medium placeholder:text-cyan-100/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-cyan-100/70">
              PIN (4 dígitos)
            </label>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              className="w-full rounded-2xl border border-cyan-400/30 bg-violet-950/40 px-4 py-3 text-center text-lg font-black tracking-[0.5em] text-white outline-none transition-all placeholder:tracking-normal placeholder:text-cyan-100/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="btn-cosmic flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {cargando ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Cargando...
              </>
            ) : modo === "login" ? (
              <>
                <LogIn size={16} strokeWidth={2.5} /> ¡Entrar a jugar!
              </>
            ) : (
              <>
                <UserPlus size={16} strokeWidth={2.5} /> Crear mi cuenta
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-xs font-medium text-cyan-100/50">
          {modo === "login"
            ? "¿No tienes cuenta? Toca «Crear cuenta»."
            : "Elige un PIN que recuerdes. Lo usarás para entrar."}
        </p>
      </div>

      {/* Modo Demo */}
      <div className="mt-4 animate-bounce-in rounded-3xl border border-dashed border-amber-400/40 bg-amber-400/5 p-4 backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-center gap-1.5 text-center">
          <Rocket size={15} className="text-amber-300" strokeWidth={2.5} />
          <p className="text-xs font-bold uppercase tracking-wide text-amber-200">
            Modo Demo · Explora sin cuenta
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {DEMO_ROLES.map((d) => {
            const cargandoEste = demoCargando === d.rol;
            return (
              <button
                key={d.rol}
                type="button"
                onClick={() => entrarDemo(d.rol)}
                disabled={demoCargando !== null}
                className={`group flex flex-col items-center gap-1 rounded-2xl bg-gradient-to-br ${d.color} px-2 py-3 text-white shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100`}
              >
                {cargandoEste ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  d.icon
                )}
                <span className="text-[11px] font-bold leading-tight">{d.label}</span>
                <span className="text-[9px] font-medium opacity-90">{d.sub}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-center text-[10px] font-medium text-amber-200/60">
          Entra al instante con datos de prueba listos
        </p>
      </div>
    </div>
  );
}
