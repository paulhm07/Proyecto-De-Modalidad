"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  Plus,
  Send,
  UserCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { Conversacion, HijoVinculado } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Tiempo relativo corto en español nicaragüense. */
function tiempoRelativo(iso: string): string {
  try {
    const fecha = new Date(iso);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    if (diffMs < 0) return "ahora";
    const minutos = Math.floor(diffMs / 60000);
    if (minutos < 1) return "ahora";
    if (minutos < 60) return `hace ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `hace ${horas} h`;
    const dias = Math.floor(horas / 24);
    if (dias === 1) return "ayer";
    if (dias < 7) return `hace ${dias} días`;
    return fecha.toLocaleDateString("es-NI", { day: "numeric", month: "short" });
  } catch {
    return iso;
  }
}

export function ParentMensajes() {
  const {
    usuario,
    setVista,
    setConversacionSeleccionadaId,
    mostrarToast,
  } = useApp();
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [cargando, setCargando] = useState(true);

  // Modal "Nueva conversación"
  const [modalAbierto, setModalAbierto] = useState(false);
  const [hijos, setHijos] = useState<HijoVinculado[]>([]);
  const [cargandoHijos, setCargandoHijos] = useState(false);
  const [hijoSel, setHijoSel] = useState<string>("");
  const [asunto, setAsunto] = useState("");
  const [mensajeInicial, setMensajeInicial] = useState("");
  const [creando, setCreando] = useState(false);

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    try {
      const data = await api.obtenerConversaciones(usuario.id);
      setConversaciones(data);
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al cargar conversaciones",
        "error"
      );
    } finally {
      setCargando(false);
    }
  }, [usuario, mostrarToast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const abrirModal = async () => {
    if (!usuario) return;
    setModalAbierto(true);
    setCargandoHijos(true);
    try {
      const data = await api.obtenerHijosPadre(usuario.id);
      setHijos(data);
      if (data.length > 0) setHijoSel(data[0].id);
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al cargar hijos",
        "error"
      );
    } finally {
      setCargandoHijos(false);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setHijoSel("");
    setAsunto("");
    setMensajeInicial("");
  };

  const crearConversacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    if (!hijoSel) {
      mostrarToast("Selecciona un hijo", "error");
      return;
    }
    if (!asunto.trim()) {
      mostrarToast("Escribe un asunto", "error");
      return;
    }

    const hijo = hijos.find((h) => h.id === hijoSel);
    if (!hijo) {
      mostrarToast("Hijo no válido", "error");
      return;
    }

    setCreando(true);
    try {
      // Necesitamos el maestro: lo obtenemos del resumen del hijo (sus secciones).
      const resumen = await api.obtenerResumenPadre(usuario.id, hijo.id);
      if (!resumen.secciones || resumen.secciones.length === 0) {
        mostrarToast("Tu hijo no tiene maestro asignado", "error");
        return;
      }
      const primeraSeccion = resumen.secciones[0];
      const nueva = await api.iniciarConversacion(usuario.id, {
        maestroId: primeraSeccion.maestro.id,
        hijoId: hijo.id,
        asunto: asunto.trim(),
        seccionId: primeraSeccion.id,
        mensajeInicial: mensajeInicial.trim() || undefined,
      });
      mostrarToast("Conversación iniciada", "exito");
      cerrarModal();
      await cargar();
      setConversacionSeleccionadaId(nueva.id);
      setVista("padre-mensaje-thread");
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al iniciar conversación",
        "error"
      );
    } finally {
      setCreando(false);
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-md">
              <MessageSquare size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-800">Mensajes</h1>
              <p className="text-sm font-semibold text-stone-600">
                Conversa con los maestros de tus hijos
              </p>
            </div>
          </div>
          <button
            onClick={abrirModal}
            className="btn-3d flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Nueva conversación</span>
            <span className="sm:hidden">Nueva</span>
          </button>
        </div>
      </div>

      {/* Lista conversaciones */}
      {cargando ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : conversaciones.length === 0 ? (
        <div className="card-premium rounded-3xl p-8 text-center">
          <MessageSquare size={36} className="mx-auto mb-2 text-orange-400" />
          <p className="text-sm font-bold text-stone-600">
            No tienes conversaciones. Inicia una nueva.
          </p>
        </div>
      ) : (
        <div className="max-h-[75vh] space-y-2.5 overflow-y-auto pr-1">
          {conversaciones.map((conv, i) => {
            const ultimoMensaje = conv.mensajes?.[conv.mensajes.length - 1];
            const esMio = ultimoMensaje?.remitenteId === usuario.id;
            return (
              <button
                key={conv.id}
                onClick={() => {
                  setConversacionSeleccionadaId(conv.id);
                  setVista("padre-mensaje-thread");
                }}
                className="card-premium animate-pop flex w-full items-center gap-3 rounded-2xl p-4 text-left transition-all hover:scale-[1.01]"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Avatar maestro */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-base font-black text-white shadow-md">
                  {conv.maestro.nombre?.charAt(0)?.toUpperCase() ?? (
                    <UserCircle size={24} />
                  )}
                </div>

                {/* Contenido */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-black text-stone-800">
                      {conv.maestro.nombre}
                    </p>
                    <span className="shrink-0 text-[11px] font-bold text-stone-500">
                      {tiempoRelativo(conv.ultimaActividad)}
                    </span>
                  </div>
                  <p className="truncate text-xs font-semibold text-stone-600">
                    Maestro/a de {conv.seccion?.asignatura?.nombre ?? "su sección"}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-bold text-stone-700">
                    {conv.asunto}
                  </p>
                  {ultimoMensaje && (
                    <p
                      className={`mt-0.5 truncate text-xs ${
                        esMio
                          ? "font-medium text-stone-600"
                          : "italic text-stone-600"
                      }`}
                    >
                      {esMio ? "Tú: " : ""}
                      {ultimoMensaje.cuerpo}
                    </p>
                  )}
                </div>

                {/* Badge no leídos */}
                {conv.noLeidos > 0 && (
                  <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-fuchsia-500 px-1.5 text-xs font-black text-white shadow-md">
                    {conv.noLeidos}
                  </span>
                )}
                <ChevronRight
                  size={16}
                  className="shrink-0 text-stone-400"
                  strokeWidth={2.5}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Modal: nueva conversación */}
      <Dialog open={modalAbierto} onOpenChange={(o) => (o ? abrirModal() : cerrarModal())}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-stone-800">
              Nueva conversación
            </DialogTitle>
            <DialogDescription className="text-sm font-semibold text-stone-600">
              Elige el hijo y escribe el asunto para contactar a su maestro/a.
            </DialogDescription>
          </DialogHeader>

          {cargandoHijos ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          ) : hijos.length === 0 ? (
            <div className="rounded-2xl bg-amber-50 p-4 text-center">
              <p className="text-sm font-bold text-amber-700">
                No tienes hijos vinculados.
              </p>
              <button
                onClick={() => {
                  cerrarModal();
                  setVista("padre-vincular");
                }}
                className="mt-2 text-xs font-black text-orange-600 underline-offset-2 hover:underline"
              >
                Vincular un hijo ahora
              </button>
            </div>
          ) : (
            <form onSubmit={crearConversacion} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-stone-700">
                  Hijo/a
                </label>
                <Select value={hijoSel} onValueChange={setHijoSel}>
                  <SelectTrigger className="h-auto w-full rounded-xl border-2 border-orange-200 bg-white py-2.5 font-bold text-stone-800">
                    <SelectValue placeholder="Selecciona un hijo" />
                  </SelectTrigger>
                  <SelectContent>
                    {hijos.map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-stone-700">
                  Asunto
                </label>
                <input
                  type="text"
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  placeholder="Ej: Seguimiento de tareas de esta semana"
                  maxLength={100}
                  autoFocus
                  className="w-full rounded-xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 outline-none transition-all placeholder:font-medium placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                />
                <p className="text-right text-[11px] font-semibold text-stone-400">
                  {asunto.length}/100
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-stone-700">
                  Mensaje inicial{" "}
                  <span className="font-semibold text-stone-400">(opcional)</span>
                </label>
                <textarea
                  value={mensajeInicial}
                  onChange={(e) => setMensajeInicial(e.target.value)}
                  placeholder="Escribe el primer mensaje para el maestro/a..."
                  maxLength={500}
                  rows={4}
                  className="w-full resize-none rounded-xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 outline-none transition-all placeholder:font-medium placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                />
                <p className="text-right text-[11px] font-semibold text-stone-400">
                  {mensajeInicial.length}/500
                </p>
              </div>

              <DialogFooter>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-bold text-stone-700 transition-all hover:bg-stone-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creando}
                  className="btn-3d inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creando ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} strokeWidth={2.5} />
                  )}
                  Iniciar conversación
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
