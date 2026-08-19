"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { HijoVinculado } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PARENTESCOS: { value: string; label: string }[] = [
  { value: "MADRE", label: "Madre" },
  { value: "PADRE", label: "Padre" },
  { value: "TUTOR_LEGAL", label: "Tutor/a legal" },
  { value: "ABUELO", label: "Abuelo/a" },
  { value: "OTRO", label: "Otro" },
];

function parentescoLabel(valor: string): string {
  return PARENTESCOS.find((p) => p.value === valor)?.label ?? valor;
}

export function ParentVincularHijo() {
  const { usuario, setVista, mostrarToast } = useApp();
  const [hijos, setHijos] = useState<HijoVinculado[]>([]);
  const [cargando, setCargando] = useState(true);

  // Form
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");
  const [parentesco, setParentesco] = useState("MADRE");
  const [vinculando, setVinculando] = useState(false);

  // Desvincular
  const [hijoAEliminar, setHijoAEliminar] = useState<HijoVinculado | null>(null);
  const [desvinculando, setDesvinculando] = useState(false);

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    try {
      const data = await api.obtenerHijosPadre(usuario.id);
      setHijos(data);
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al cargar hijos vinculados",
        "error"
      );
    } finally {
      setCargando(false);
    }
  }, [usuario, mostrarToast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const vincular = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    if (!nombre.trim()) {
      mostrarToast("Escribe el nombre del hijo/a", "error");
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      mostrarToast("El PIN debe tener 4 dígitos", "error");
      return;
    }
    setVinculando(true);
    try {
      await api.solicitarVinculoHijo(usuario.id, {
        nombre: nombre.trim(),
        pin,
        parentesco,
      });
      mostrarToast("¡Hijo/a vinculado con éxito!", "exito");
      setNombre("");
      setPin("");
      setParentesco("MADRE");
      await cargar();
      setVista("padre");
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al vincular hijo/a",
        "error"
      );
    } finally {
      setVinculando(false);
    }
  };

  const confirmarDesvinculacion = async () => {
    if (!usuario || !hijoAEliminar) return;
    setDesvinculando(true);
    try {
      await api.desvincularHijoPadre(usuario.id, hijoAEliminar.id);
      mostrarToast("Hijo/a desvinculado/a", "info");
      setHijoAEliminar(null);
      await cargar();
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al desvincular hijo/a",
        "error"
      );
    } finally {
      setDesvinculando(false);
    }
  };

  if (!usuario) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      {/* Header */}
      <button
        onClick={() => setVista("padre")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
            <UserPlus size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-800">Vincular hijo/a</h1>
            <p className="text-sm font-semibold text-stone-600">
              Conecta tu cuenta con la de tu hijo/a para seguir su progreso.
            </p>
          </div>
        </div>
      </div>

      {/* Formulario principal: vinculación por PIN */}
      <form
        onSubmit={vincular}
        className="card-premium animate-bounce-in mb-6 rounded-3xl p-6"
      >
        <div className="mb-4 flex items-center gap-2">
          <KeyRound size={18} className="text-orange-500" strokeWidth={2.5} />
          <h2 className="text-base font-black text-stone-800">
            Vincular por nombre y PIN
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-bold text-stone-700">
              Nombre del hijo/a
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Sofía Ramírez"
              maxLength={40}
              className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 outline-none transition-all placeholder:font-medium placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-stone-700">PIN</label>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="••••"
              maxLength={4}
              className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 text-center text-base font-black tracking-[0.4em] text-stone-800 outline-none transition-all placeholder:tracking-normal placeholder:font-medium placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />
            <p className="text-[11px] font-semibold text-stone-500">4 dígitos</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-stone-700">Parentesco</label>
            <Select value={parentesco} onValueChange={setParentesco}>
              <SelectTrigger className="h-auto w-full rounded-2xl border-2 border-orange-200 bg-white py-2.5 font-bold text-stone-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PARENTESCOS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="mt-3 text-xs font-medium text-stone-500">
          Escribe el nombre y PIN exactos que usa tu hijo/a en Mundilex.
        </p>

        <button
          type="submit"
          disabled={vinculando}
          className="btn-3d mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {vinculando ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <UserPlus size={16} strokeWidth={2.5} />
          )}
          {vinculando ? "Vinculando…" : "Vincular"}
        </button>
      </form>

      {/* Hijos ya vinculados */}
      <section className="mb-6">
        <div className="mb-3 flex items-center gap-2">
          <Users size={18} className="text-fuchsia-500" strokeWidth={2.5} />
          <h2 className="text-lg font-black text-stone-800">Hijos vinculados</h2>
          <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-bold text-fuchsia-700">
            {hijos.length}
          </span>
        </div>

        {cargando ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
          </div>
        ) : hijos.length === 0 ? (
          <div className="card-premium rounded-3xl p-6 text-center">
            <Users size={32} className="mx-auto mb-2 text-fuchsia-300" />
            <p className="text-sm font-bold text-stone-600">
              Aún no tienes hijos vinculados. Usa el formulario de arriba.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {hijos.map((h, i) => (
              <div
                key={h.id}
                className="card-premium animate-pop flex items-center gap-3 rounded-2xl p-4"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-fuchsia-500 text-base font-black text-white shadow-md">
                  {h.nombre?.charAt(0)?.toUpperCase() ?? "🧒"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-stone-800">
                    {h.nombre}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-violet-700">
                      {parentescoLabel(h.parentesco ?? "OTRO")}
                    </span>
                    {h.verificado ? (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                        <BadgeCheck size={11} strokeWidth={2.5} /> Verificado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
                        <Clock3 size={11} strokeWidth={2.5} /> Pendiente
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setHijoAEliminar(h)}
                  className="btn-3d flex items-center gap-1 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-500 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                >
                  <X size={13} strokeWidth={2.5} /> Desvincular
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sección informativa: otras vías de vinculación */}
      <section className="card-premium rounded-3xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-cyan-500" strokeWidth={2.5} />
          <h2 className="text-base font-black text-stone-800">
            ¿No conoces el PIN?
          </h2>
        </div>
        <p className="mb-4 text-sm font-semibold text-stone-600">
          Existen 3 vías para vincular a tu hijo/a en Mundilex. Por ahora la vía
          por PIN está activa; las otras llegarán pronto.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {/* Vía 1: PIN */}
          <div className="rounded-2xl border-2 border-emerald-300/50 bg-emerald-50/40 p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md">
              <KeyRound size={18} strokeWidth={2.5} />
            </div>
            <p className="text-sm font-black text-stone-800">Por PIN</p>
            <p className="mt-1 text-xs font-medium text-stone-600">
              Ingresa el nombre y PIN de 4 dígitos que tu hijo/a usa para entrar.
            </p>
            <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-black text-emerald-700">
              Activo
            </span>
          </div>

          {/* Vía 2: Código de maestro */}
          <div className="rounded-2xl border-2 border-stone-200 bg-white/40 p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-stone-300 to-stone-400 text-white shadow-md">
              <Sparkles size={18} strokeWidth={2.5} />
            </div>
            <p className="text-sm font-black text-stone-800">Código de maestro</p>
            <p className="mt-1 text-xs font-medium text-stone-600">
              El maestro/a genera un código de invitación para que apruebes la
              vinculación desde su aula.
            </p>
            <span className="mt-2 inline-block rounded-full bg-stone-200 px-2 py-0.5 text-[11px] font-black text-stone-600">
              Próximamente
            </span>
          </div>

          {/* Vía 3: Código de estudiante */}
          <div className="rounded-2xl border-2 border-stone-200 bg-white/40 p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-stone-300 to-stone-400 text-white shadow-md">
              <Lock size={18} strokeWidth={2.5} />
            </div>
            <p className="text-sm font-black text-stone-800">Código de estudiante</p>
            <p className="mt-1 text-xs font-medium text-stone-600">
              Tu hijo/a genera un código desde su perfil que tú ingresas aquí
              para confirmar el parentesco.
            </p>
            <span className="mt-2 inline-block rounded-full bg-stone-200 px-2 py-0.5 text-[11px] font-black text-stone-600">
              Próximamente
            </span>
          </div>
        </div>
      </section>

      {/* Confirmación de desvinculación */}
      <AlertDialog
        open={hijoAEliminar !== null}
        onOpenChange={(o) => !o && setHijoAEliminar(null)}
      >
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-stone-800">
              ¿Desvincular a {hijoAEliminar?.nombre}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-semibold text-stone-600">
              Ya no podrás ver su progreso, calificaciones ni avisos. Tu hijo/a
              podrá ser vinculado nuevamente cuando quieras. Esta acción no
              elimina la cuenta del niño/a.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={desvinculando}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-bold text-stone-700 transition-all hover:bg-stone-200"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmarDesvinculacion();
              }}
              disabled={desvinculando}
              className="btn-3d inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-500 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {desvinculando ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <X size={14} strokeWidth={2.5} />
              )}
              Desvincular
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
