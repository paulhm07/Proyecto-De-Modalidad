"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Layers,
  ListChecks,
  Loader2,
  Plus,
  Save,
  SquarePen,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type {
  Asignatura,
  Desafio,
  Modulo,
  Seccion,
} from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function mananaMismaHora(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function truncate(s: string | null | undefined, n = 70): string {
  if (!s) return "";
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

export function TeacherCrearTarea() {
  const { usuario, setVista, seccionSeleccionadaId, mostrarToast } = useApp();

  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [desafios, setDesafios] = useState<Desafio[]>([]);

  const [seccionId, setSeccionId] = useState<string>(
    seccionSeleccionadaId ?? "",
  );
  const [asignaturaId, setAsignaturaId] = useState<string>("");
  const [moduloId, setModuloId] = useState<string>("");
  const [desafioId, setDesafioId] = useState<string>("");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaLimite, setFechaLimite] = useState<string>(mananaMismaHora());

  const [cargandoSecciones, setCargandoSecciones] = useState(true);
  const [cargandoAsignaturas, setCargandoAsignaturas] = useState(false);
  const [cargandoModulos, setCargandoModulos] = useState(false);
  const [cargandoDesafios, setCargandoDesafios] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Cargar secciones del maestro
  useEffect(() => {
    if (!usuario) return;
    let cancelado = false;
    (async () => {
      setCargandoSecciones(true);
      try {
        const secs = await api.obtenerSeccionesMaestro(usuario.id);
        if (cancelado) return;
        setSecciones(secs);
        // Si no hay sección preseleccionada, autoseleccionar la primera
        if (!seccionSeleccionadaId && secs.length > 0) {
          setSeccionId(secs[0].id);
        }
      } catch (err) {
        if (!cancelado) {
          mostrarToast(
            err instanceof Error ? err.message : "Error al cargar secciones",
            "error",
          );
        }
      } finally {
        if (!cancelado) setCargandoSecciones(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [usuario, seccionSeleccionadaId, mostrarToast]);

  // Cargar asignaturas del maestro
  useEffect(() => {
    if (!usuario) return;
    let cancelado = false;
    (async () => {
      setCargandoAsignaturas(true);
      try {
        const asigs = await api.obtenerAsignaturasMaestro(usuario.id);
        if (cancelado) return;
        setAsignaturas(asigs);
      } catch (err) {
        if (!cancelado) {
          mostrarToast(
            err instanceof Error ? err.message : "Error al cargar asignaturas",
            "error",
          );
        }
      } finally {
        if (!cancelado) setCargandoAsignaturas(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [usuario, mostrarToast]);

  // Cargar módulos al cambiar asignatura
  useEffect(() => {
    if (!asignaturaId) {
      setModulos([]);
      setModuloId("");
      return;
    }
    let cancelado = false;
    (async () => {
      setCargandoModulos(true);
      try {
        const mods = await api.obtenerModulos(asignaturaId);
        if (cancelado) return;
        setModulos(mods);
        setModuloId("");
      } catch (err) {
        if (!cancelado) {
          mostrarToast(
            err instanceof Error ? err.message : "Error al cargar módulos",
            "error",
          );
        }
      } finally {
        if (!cancelado) setCargandoModulos(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [asignaturaId, mostrarToast]);

  // Cargar desafíos al cambiar módulo
  useEffect(() => {
    if (!moduloId) {
      setDesafios([]);
      setDesafioId("");
      return;
    }
    let cancelado = false;
    (async () => {
      setCargandoDesafios(true);
      try {
        const ds = await api.obtenerDesafios(moduloId);
        if (cancelado) return;
        setDesafios(ds);
        setDesafioId("");
      } catch (err) {
        if (!cancelado) {
          mostrarToast(
            err instanceof Error ? err.message : "Error al cargar desafíos",
            "error",
          );
        }
      } finally {
        if (!cancelado) setCargandoDesafios(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [moduloId, mostrarToast]);

  // Sugerir título = enunciado del desafío (si el usuario aún no escribió nada)
  useEffect(() => {
    if (!desafioId) return;
    const d = desafios.find((x) => x.id === desafioId);
    if (d && titulo.trim() === "") {
      setTitulo(d.pregunta.slice(0, 90));
    }
  }, [desafioId, desafios, titulo]);

  const desafioSel = useMemo(
    () => desafios.find((d) => d.id === desafioId) ?? null,
    [desafios, desafioId],
  );

  const puedeEnviar =
    !!seccionId &&
    !!asignaturaId &&
    !!moduloId &&
    !!desafioId &&
    titulo.trim().length > 0 &&
    !!fechaLimite &&
    !guardando;

  const enviar = useCallback(async () => {
    if (!usuario) return;
    if (!puedeEnviar) {
      mostrarToast("Completa todos los campos requeridos", "error");
      return;
    }
    setGuardando(true);
    try {
      await api.crearTarea({
        seccionId,
        desafioId,
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        fechaLimite,
      });
      mostrarToast("✅ Tarea creada con éxito", "exito");
      setVista("maestro-tareas");
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al crear tarea",
        "error",
      );
    } finally {
      setGuardando(false);
    }
  }, [
    usuario,
    puedeEnviar,
    seccionId,
    desafioId,
    titulo,
    descripcion,
    fechaLimite,
    setVista,
    mostrarToast,
  ]);

  if (!usuario) return null;

  const labelCls = "mb-1 block text-xs font-bold text-stone-600";
  const selectTriggerCls =
    "h-auto w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 data-[placeholder]:font-medium data-[placeholder]:text-stone-400";
  const inputCls =
    "w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 outline-none transition-all placeholder:font-medium placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200";

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <button
        onClick={() => setVista("maestro-tareas")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      {/* Header */}
      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-md">
            <Plus size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-800">Crear tarea</h1>
            <p className="text-sm font-semibold text-stone-600">
              Asigna un desafío a una sección
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="card-premium rounded-3xl p-6">
        <div className="space-y-4">
          {/* Sección */}
          <div>
            <label className={labelCls}>
              <Users
                size={11}
                strokeWidth={2.5}
                className="mr-0.5 inline -translate-y-px"
              />{" "}
              Sección *
            </label>
            {cargandoSecciones ? (
              <div className="flex items-center gap-2 text-sm font-bold text-stone-500">
                <Loader2 size={14} className="animate-spin text-orange-500" />{" "}
                Cargando secciones…
              </div>
            ) : secciones.length === 0 ? (
              <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                No tienes secciones. Crea una primero desde el panel de
                secciones.
              </p>
            ) : (
              <Select value={seccionId} onValueChange={setSeccionId}>
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Elige una sección" />
                </SelectTrigger>
                <SelectContent>
                  {secciones.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nombre}
                      {s.asignatura ? ` · ${s.asignatura.nombre}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Asignatura */}
          <div>
            <label className={labelCls}>
              <BookOpen
                size={11}
                strokeWidth={2.5}
                className="mr-0.5 inline -translate-y-px"
              />{" "}
              Asignatura *
            </label>
            {cargandoAsignaturas ? (
              <div className="flex items-center gap-2 text-sm font-bold text-stone-500">
                <Loader2 size={14} className="animate-spin text-orange-500" />{" "}
                Cargando asignaturas…
              </div>
            ) : asignaturas.length === 0 ? (
              <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                No tienes asignaturas. Crea una primero desde Contenido.
              </p>
            ) : (
              <Select value={asignaturaId} onValueChange={setAsignaturaId}>
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Elige una asignatura" />
                </SelectTrigger>
                <SelectContent>
                  {asignaturas.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Módulo */}
          <div>
            <label className={labelCls}>
              <Layers
                size={11}
                strokeWidth={2.5}
                className="mr-0.5 inline -translate-y-px"
              />{" "}
              Módulo *
            </label>
            {!asignaturaId ? (
              <p className="text-xs font-medium text-stone-500">
                Primero elige una asignatura
              </p>
            ) : cargandoModulos ? (
              <div className="flex items-center gap-2 text-sm font-bold text-stone-500">
                <Loader2 size={14} className="animate-spin text-orange-500" />{" "}
                Cargando módulos…
              </div>
            ) : modulos.length === 0 ? (
              <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                Esta asignatura no tiene módulos. Crea uno en Contenido.
              </p>
            ) : (
              <Select value={moduloId} onValueChange={setModuloId}>
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Elige un módulo" />
                </SelectTrigger>
                <SelectContent>
                  {modulos.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Desafío */}
          <div>
            <label className={labelCls}>
              <ListChecks
                size={11}
                strokeWidth={2.5}
                className="mr-0.5 inline -translate-y-px"
              />{" "}
              Desafío *
            </label>
            {!moduloId ? (
              <p className="text-xs font-medium text-stone-500">
                Primero elige un módulo
              </p>
            ) : cargandoDesafios ? (
              <div className="flex items-center gap-2 text-sm font-bold text-stone-500">
                <Loader2 size={14} className="animate-spin text-orange-500" />{" "}
                Cargando desafíos…
              </div>
            ) : desafios.length === 0 ? (
              <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                Este módulo no tiene desafíos. Crea uno en Contenido.
              </p>
            ) : (
              <Select value={desafioId} onValueChange={setDesafioId}>
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Elige un desafío" />
                </SelectTrigger>
                <SelectContent>
                  {desafios.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {truncate(d.pregunta, 70)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {desafioSel && (
              <div className="mt-2 rounded-2xl bg-white/50 px-3 py-2 text-xs font-medium text-stone-600">
                <span className="font-bold text-stone-700">Pregunta:</span>{" "}
                {desafioSel.pregunta}
                <span className="ml-2 rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">
                  {desafioSel.puntos} pts
                </span>
              </div>
            )}
          </div>

          {/* Título */}
          <div>
            <label className={labelCls}>
              <SquarePen
                size={11}
                strokeWidth={2.5}
                className="mr-0.5 inline -translate-y-px"
              />{" "}
              Título *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Tarea de repaso — Operaciones"
              maxLength={120}
              className={inputCls}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className={labelCls}>Descripción (opcional)</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Instrucciones adicionales para los estudiantes"
              rows={3}
              maxLength={400}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Fecha límite */}
          <div>
            <label className={labelCls}>Fecha límite *</label>
            <input
              type="datetime-local"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className={inputCls}
            />
            <p className="mt-1 text-[11px] font-medium text-stone-500">
              Por defecto: mañana a la misma hora
            </p>
          </div>

          {/* Botón */}
          <button
            onClick={enviar}
            disabled={!puedeEnviar}
            className="btn-3d flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          >
            {guardando ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} strokeWidth={2.5} />
            )}
            Crear tarea
          </button>
        </div>
      </div>
    </div>
  );
}
