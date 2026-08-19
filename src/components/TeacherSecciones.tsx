"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Users,
  BookOpen,
  Loader2,
  ChevronRight,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { Asignatura, Seccion } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NONE = "none";

export function TeacherSecciones() {
  const { usuario, setVista, setSeccionSeleccionadaId, mostrarToast } = useApp();
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [cargando, setCargando] = useState(true);

  // Dialog crear sección
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creando, setCreando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    grado: "3",
    asignaturaId: NONE,
  });

  useEffect(() => {
    if (!usuario) return;
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const [secs, asigs] = await Promise.all([
          api.obtenerSeccionesMaestro(usuario.id),
          api.obtenerAsignaturasMaestro(usuario.id),
        ]);
        if (cancelado) return;
        setSecciones(secs);
        setAsignaturas(asigs);
      } catch (err) {
        if (!cancelado) {
          mostrarToast(
            err instanceof Error ? err.message : "Error al cargar las secciones",
            "error"
          );
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [usuario, mostrarToast]);

  const abrirDialog = () => {
    setForm({ nombre: "", grado: "3", asignaturaId: NONE });
    setDialogOpen(true);
  };

  const crearSeccion = async () => {
    if (!usuario) return;
    const nombre = form.nombre.trim();
    if (!nombre) {
      mostrarToast("Ingresa un nombre para la sección", "error");
      return;
    }
    const grado = Number(form.grado) || 3;
    const asignaturaId =
      form.asignaturaId && form.asignaturaId !== NONE ? form.asignaturaId : undefined;
    setCreando(true);
    try {
      const nueva = await api.crearSeccion({
        nombre,
        grado,
        maestroId: usuario.id,
        asignaturaId,
      });
      setSecciones((prev) => [nueva, ...prev]);
      setDialogOpen(false);
      mostrarToast(`Sección "${nueva.nombre}" creada`, "exito");
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al crear la sección",
        "error"
      );
    } finally {
      setCreando(false);
    }
  };

  const gestionar = (s: Seccion) => {
    setSeccionSeleccionadaId(s.id);
    setVista("maestro-estudiantes");
  };

  if (!usuario) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <button
        onClick={() => setVista("maestro")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      {/* Header */}
      <div className="card-premium animate-bounce-in mb-6 flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 shadow-md">
            <GraduationCap size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-800">Mis Secciones</h1>
            <p className="text-sm font-semibold text-stone-600">
              Crea aulas y gestiona tus estudiantes por sección.
            </p>
          </div>
        </div>
        <button
          onClick={abrirDialog}
          className="btn-3d hidden items-center gap-1.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105 sm:inline-flex"
        >
          <Plus size={16} strokeWidth={2.5} /> Crear sección
        </button>
      </div>

      {/* Botón crear (mobile) */}
      <button
        onClick={abrirDialog}
        className="btn-3d mb-4 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.01] sm:hidden"
      >
        <Plus size={16} strokeWidth={2.5} /> Crear sección
      </button>

      {cargando ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : secciones.length === 0 ? (
        <div className="card-premium rounded-3xl p-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-fuchsia-100">
            <GraduationCap size={32} className="text-fuchsia-500" strokeWidth={2.5} />
          </div>
          <p className="text-lg font-black text-stone-800">No tienes secciones todavía</p>
          <p className="mx-auto mt-1 max-w-md text-sm font-semibold text-stone-600">
            Crea tu primera aula para inscribir estudiantes, asignar tareas y llevar asistencia.
          </p>
          <button
            onClick={abrirDialog}
            className="btn-3d mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105"
          >
            <Plus size={16} strokeWidth={2.5} /> Crear primera sección
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {secciones.map((s, i) => {
            const totalEstudiantes = s._count?.inscripciones ?? 0;
            const totalTareas = s._count?.tareas ?? 0;
            const nombreAsignatura = s.asignatura?.nombre ?? null;
            return (
              <div
                key={s.id}
                className="card-premium animate-pop rounded-3xl p-6"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 text-base font-black text-white shadow-md">
                      {s.nombre?.charAt(0)?.toUpperCase() ?? "📚"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-black text-stone-800">{s.nombre}</h3>
                      <p className="text-xs font-bold text-stone-500">
                        {s.grado}° grado · {s.anioEscolar}
                      </p>
                    </div>
                  </div>
                  {s.activa ? (
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                      Activa
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-stone-200 px-2 py-0.5 text-[11px] font-bold text-stone-600">
                      Inactiva
                    </span>
                  )}
                </div>

                {nombreAsignatura && (
                  <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                    <BookOpen size={11} strokeWidth={2.5} />
                    {nombreAsignatura}
                  </div>
                )}

                <div className="mb-4 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 rounded-2xl bg-fuchsia-50 px-3 py-2">
                    <Users size={16} className="shrink-0 text-fuchsia-500" strokeWidth={2.5} />
                    <div className="min-w-0">
                      <p className="text-base font-black leading-none text-stone-800">
                        {totalEstudiantes}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500">
                        Estudiantes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-orange-50 px-3 py-2">
                    <ClipboardList size={16} className="shrink-0 text-orange-500" strokeWidth={2.5} />
                    <div className="min-w-0">
                      <p className="text-base font-black leading-none text-stone-800">
                        {totalTareas}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500">
                        Tareas
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => gestionar(s)}
                  className="btn-3d flex w-full items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02]"
                >
                  Gestionar <ChevronRight size={15} strokeWidth={2.5} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog: crear sección */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-stone-800">
              Crear nueva sección
            </DialogTitle>
            <DialogDescription className="text-sm font-semibold text-stone-600">
              Define el nombre, grado y asignatura (opcional) de tu aula.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sec-nombre" className="text-sm font-bold text-stone-700">
                Nombre de la sección
              </Label>
              <Input
                id="sec-nombre"
                placeholder="Ej: 3ro A"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                className="rounded-xl"
                maxLength={60}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sec-grado" className="text-sm font-bold text-stone-700">
                Grado
              </Label>
              <Input
                id="sec-grado"
                type="number"
                min={1}
                max={9}
                value={form.grado}
                onChange={(e) => setForm((f) => ({ ...f, grado: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-stone-700">
                Asignatura <span className="font-semibold text-stone-400">(opcional)</span>
              </Label>
              <Select
                value={form.asignaturaId}
                onValueChange={(v) => setForm((f) => ({ ...f, asignaturaId: v }))}
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Sin asignatura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Sin asignatura</SelectItem>
                  {asignaturas.length === 0 ? (
                    <SelectItem value="__empty" disabled>
                      No tienes asignaturas creadas
                    </SelectItem>
                  ) : (
                    asignaturas.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-bold text-stone-700 transition-all hover:bg-stone-200"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={crearSeccion}
              disabled={creando}
              className="btn-3d inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creando ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} strokeWidth={2.5} />
              )}
              Crear sección
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
