"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Users,
  Loader2,
  Star,
  Sparkles,
  UserPlus,
  X,
  ChevronRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { Usuario } from "@/lib/types";

export function ParentDashboard() {
  const { usuario, setVista, setEstudianteSeleccionadoId, setAsignaturaId, setModuloId, mostrarToast } = useApp();
  const [hijos, setHijos] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);

  // Form para vincular
  const [nombreHijo, setNombreHijo] = useState("");
  const [pinHijo, setPinHijo] = useState("");
  const [vinculando, setVinculando] = useState(false);

  const cargar = async () => {
    if (!usuario) return;
    setCargando(true);
    try {
      const data = await api.obtenerHijos(usuario.id);
      setHijos(data);
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al cargar hijos", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id]);

  const vincular = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    if (!nombreHijo.trim() || !/^\d{4}$/.test(pinHijo)) {
      mostrarToast("Escribe el nombre y un PIN de 4 dígitos", "error");
      return;
    }
    setVinculando(true);
    try {
      await api.vincularHijo(usuario.id, { nombre: nombreHijo.trim(), pin: pinHijo });
      mostrarToast("¡Hijo vinculado con éxito!", "exito");
      setNombreHijo("");
      setPinHijo("");
      await cargar();
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al vincular hijo", "error");
    } finally {
      setVinculando(false);
    }
  };

  const verProgreso = (h: Usuario) => {
    setEstudianteSeleccionadoId(h.id);
    setAsignaturaId(null);
    setModuloId(null);
    setVista("progreso-estudiante");
  };

  if (!usuario) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <button
        onClick={() => setVista("perfil")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
            <Users size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-800">Mis hijos</h1>
            <p className="text-sm font-semibold text-stone-600">
              Hola, {usuario.nombre}. Sigue el progreso de tus hijos.
            </p>
          </div>
        </div>
      </div>

      {/* Formulario vincular */}
      <form onSubmit={vincular} className="card-premium animate-bounce-in mb-6 rounded-3xl p-5">
        <div className="mb-3 flex items-center gap-2">
          <UserPlus size={18} className="text-orange-500" strokeWidth={2.5} />
          <h2 className="text-base font-black text-stone-800">Vincular hijo/a</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_140px_auto]">
          <input
            type="text"
            value={nombreHijo}
            onChange={(e) => setNombreHijo(e.target.value)}
            placeholder="Nombre del hijo/a"
            maxLength={40}
            className="rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 outline-none transition-all placeholder:font-medium placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
          <input
            type="password"
            inputMode="numeric"
            value={pinHijo}
            onChange={(e) => setPinHijo(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="PIN (4 dígitos)"
            maxLength={4}
            className="rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 text-center text-sm font-black tracking-[0.3em] text-stone-800 outline-none transition-all placeholder:tracking-normal placeholder:font-medium placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />
          <button
            type="submit"
            disabled={vinculando}
            className="btn-3d flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105 disabled:opacity-60"
          >
            <UserPlus size={15} strokeWidth={2.5} />
            {vinculando ? "Vinculando..." : "Vincular"}
          </button>
        </div>
        <p className="mt-2 text-xs font-medium text-stone-500">
          Escribe el nombre y PIN exactos que usa tu hijo/a en EducaPlay.
        </p>
      </form>

      {/* Lista hijos */}
      {cargando ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : hijos.length === 0 ? (
        <div className="card-premium rounded-3xl p-8 text-center">
          <Users size={36} className="mx-auto mb-2 text-orange-400" />
          <p className="text-sm font-bold text-stone-600">
            Aún no tienes hijos vinculados. Usa el formulario de arriba.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {hijos.map((h, i) => {
            const nivel = Math.floor(h.experiencia / 100) + 1;
            return (
              <div
                key={h.id}
                className="card-premium animate-pop flex items-center gap-3 rounded-3xl p-4 transition-all hover:scale-[1.02]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-fuchsia-500 text-lg font-black text-white shadow-md">
                  {h.nombre?.charAt(0)?.toUpperCase() ?? "🧒"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-base font-black text-stone-800">{h.nombre}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs font-bold">
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                      <Star size={11} strokeWidth={2.5} /> {h.puntos} pts
                    </span>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                      <Sparkles size={11} strokeWidth={2.5} /> Nivel {nivel}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => verProgreso(h)}
                  className="btn-3d flex items-center gap-1 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                >
                  Ver progreso <ChevronRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
