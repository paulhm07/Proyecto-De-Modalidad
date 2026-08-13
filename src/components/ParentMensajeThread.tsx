"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Loader2,
  Send,
  UserCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { ConversacionDetalle, Mensaje } from "@/lib/types";

/** Hora legible corta: "14:32" o "ayer 18:05" si es de ayer. */
function horaLegible(iso: string): string {
  try {
    const fecha = new Date(iso);
    const ahora = new Date();
    const mismoDia = fecha.toDateString() === ahora.toDateString();
    const ayer = new Date(ahora);
    ayer.setDate(ayer.getDate() - 1);
    const esAyer = fecha.toDateString() === ayer.toDateString();
    const hora = fecha.toLocaleTimeString("es-NI", {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (mismoDia) return hora;
    if (esAyer) return `ayer ${hora}`;
    return fecha.toLocaleDateString("es-NI", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function ParentMensajeThread() {
  const {
    usuario,
    conversacionSeleccionadaId,
    setVista,
    mostrarToast,
  } = useApp();
  const [conversacion, setConversacion] = useState<ConversacionDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Composer
  const [cuerpo, setCuerpo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const cargar = useCallback(async () => {
    if (!usuario || !conversacionSeleccionadaId) return;
    setCargando(true);
    setError(null);
    try {
      const data = await api.obtenerConversacion(usuario.id, conversacionSeleccionadaId);
      setConversacion(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al cargar conversación";
      setError(msg);
      mostrarToast(msg, "error");
    } finally {
      setCargando(false);
    }
  }, [usuario, conversacionSeleccionadaId, mostrarToast]);

  // Si no hay conversación seleccionada, volver a la lista.
  useEffect(() => {
    if (!conversacionSeleccionadaId) {
      mostrarToast("Selecciona una conversación primero", "error");
      setVista("padre-mensajes");
      return;
    }
    cargar();
  }, [cargar, conversacionSeleccionadaId, mostrarToast, setVista]);

  // Auto-scroll al final cuando llega nuevo contenido.
  useEffect(() => {
    if (!cargando && conversacion) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [cargando, conversacion]);

  // Auto-resize del textarea.
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
  }, [cuerpo]);

  const enviar = async () => {
    if (!usuario || !conversacionSeleccionadaId || !conversacion) return;
    const texto = cuerpo.trim();
    if (!texto || enviando) return;
    setEnviando(true);
    try {
      const nuevo = await api.enviarMensajePadre(
        usuario.id,
        conversacionSeleccionadaId,
        texto
      );
      setConversacion((prev) =>
        prev ? { ...prev, mensajes: [...prev.mensajes, nuevo] } : prev
      );
      setCuerpo("");
      // Scroll al final tras enviar.
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    } catch (err) {
      mostrarToast(
        err instanceof Error ? err.message : "Error al enviar mensaje",
        "error"
      );
    } finally {
      setEnviando(false);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  if (!usuario) return null;

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col px-4 py-4 sm:py-6">
      {/* Header */}
      <button
        onClick={() => setVista("padre-mensajes")}
        className="mb-3 inline-flex items-center gap-1.5 self-start rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      {cargando ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : error || !conversacion ? (
        <div className="card-premium rounded-3xl p-8 text-center">
          <p className="text-sm font-bold text-stone-600">
            {error ?? "No se pudo cargar la conversación."}
          </p>
          <button
            onClick={() => setVista("padre-mensajes")}
            className="btn-3d mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105"
          >
            Volver a mensajes
          </button>
        </div>
      ) : (
        <>
          {/* Cabecera de la conversación */}
          <div className="card-premium animate-bounce-in mb-3 rounded-3xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-base font-black text-white shadow-md">
                {conversacion.maestro.nombre?.charAt(0)?.toUpperCase() ?? (
                  <UserCircle size={24} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-black text-stone-800">
                  {conversacion.maestro.nombre}
                </p>
                <p className="truncate text-xs font-semibold text-stone-600">
                  Maestro/a de{" "}
                  {conversacion.seccion?.asignatura?.nombre ?? "su sección"}
                </p>
                <p className="mt-0.5 truncate text-xs font-bold text-stone-700">
                  {conversacion.asunto}
                </p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-cyan-100 px-2 py-0.5 text-cyan-700">
                Sobre: {conversacion.hijo.nombre}
              </span>
              {conversacion.seccion && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-100 px-2 py-0.5 text-violet-700">
                  {conversacion.seccion.nombre}
                </span>
              )}
            </div>
          </div>

          {/* Thread de mensajes */}
          <div className="card-premium flex-1 overflow-y-auto rounded-3xl p-4">
            <div className="flex flex-col gap-3">
              {conversacion.mensajes.length === 0 ? (
                <p className="py-8 text-center text-sm font-bold text-stone-600">
                  Aún no hay mensajes en esta conversación. Escribe el primero abajo.
                </p>
              ) : (
                conversacion.mensajes.map((m, i) => {
                  const esMio = m.remitenteId === usuario.id;
                  const leido = m.leidoEn != null;
                  return (
                    <div
                      key={m.id}
                      className={`flex animate-pop ${
                        esMio ? "justify-end" : "justify-start"
                      }`}
                      style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-md ${
                          esMio
                            ? "bg-gradient-to-br from-amber-400 to-orange-500 text-violet-950"
                            : "border border-cyan-400/30 bg-white/10 text-stone-100"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm font-medium">
                          {m.cuerpo}
                        </p>
                        <div
                          className={`mt-1 flex items-center justify-end gap-1 text-[10px] font-bold ${
                            esMio ? "text-violet-900/70" : "text-cyan-200/70"
                          }`}
                        >
                          <span>{horaLegible(m.enviadoEn)}</span>
                          {esMio &&
                            (leido ? (
                              <CheckCheck size={12} strokeWidth={2.5} className="text-cyan-600" />
                            ) : (
                              <Check size={12} strokeWidth={2.5} className="text-violet-900/60" />
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Composer fijo abajo */}
          <div className="card-premium sticky bottom-0 mt-3 rounded-3xl p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={cuerpo}
                onChange={(e) => setCuerpo(e.target.value)}
                onKeyDown={onKey}
                placeholder="Escribe un mensaje… (Enter para enviar, Shift+Enter para salto de línea)"
                rows={1}
                className="max-h-[140px] flex-1 resize-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 outline-none transition-all placeholder:font-medium placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              />
              <button
                onClick={enviar}
                disabled={!cuerpo.trim() || enviando}
                aria-label="Enviar mensaje"
                className="btn-3d flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {enviando ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
