"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Bell,
  CheckCheck,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  MessageCircle,
  Trophy,
  Clock,
  Hourglass,
  BellOff,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { Notificacion } from "@/lib/types";

type TipoNotif =
  | "NUEVA_TAREA"
  | "TAREA_CALIFICADA"
  | "INASISTENCIA"
  | "NUEVO_AVISO"
  | "MENSAJE_DOCENTE"
  | "LOGRO"
  | "ENTREGA_TARDIA"
  | "TAREA_POR_VENCER";

interface IconoTipo {
  icon: typeof Bell;
  cls: string;
  emoji: string;
}

const ICONOS_TIPO: Record<TipoNotif, IconoTipo> = {
  NUEVA_TAREA: { icon: ClipboardList, cls: "bg-amber-100 text-amber-600", emoji: "📋" },
  TAREA_CALIFICADA: { icon: CheckCircle2, cls: "bg-emerald-100 text-emerald-600", emoji: "✅" },
  INASISTENCIA: { icon: AlertTriangle, cls: "bg-rose-100 text-rose-600", emoji: "⚠️" },
  NUEVO_AVISO: { icon: Megaphone, cls: "bg-orange-100 text-orange-600", emoji: "📢" },
  MENSAJE_DOCENTE: { icon: MessageCircle, cls: "bg-cyan-100 text-cyan-600", emoji: "💬" },
  LOGRO: { icon: Trophy, cls: "bg-amber-100 text-amber-600", emoji: "🏆" },
  ENTREGA_TARDIA: { icon: Clock, cls: "bg-rose-100 text-rose-600", emoji: "⏰" },
  TAREA_POR_VENCER: { icon: Hourglass, cls: "bg-amber-100 text-amber-600", emoji: "⏳" },
};

function iconoParaTipo(tipo: string): IconoTipo {
  return (
    ICONOS_TIPO[tipo as TipoNotif] ?? {
      icon: Bell,
      cls: "bg-stone-100 text-stone-600",
      emoji: "🔔",
    }
  );
}

// Fecha relativa simple
function fechaRelativa(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const ahora = Date.now();
    const diff = ahora - d.getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return "ahora";
    if (min < 60) return `hace ${min} min`;
    const horas = Math.floor(min / 60);
    if (horas < 24) return `hace ${horas} h`;
    const dias = Math.floor(horas / 24);
    if (dias === 1) return "ayer";
    if (dias < 7) return `hace ${dias} días`;
    const sem = Math.floor(dias / 7);
    if (sem < 5) return `hace ${sem} sem`;
    return d.toLocaleDateString("es-NI", { day: "numeric", month: "short" });
  } catch {
    return iso;
  }
}

export function ParentNotificaciones() {
  const { usuario, setVista, mostrarToast } = useApp();
  const [notifs, setNotifs] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [marcandoTodas, setMarcandoTodas] = useState(false);
  const [marcandoId, setMarcandoId] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    try {
      const data = await api.obtenerNotificaciones(usuario.id);
      // Ordenar: no leídas primero, luego por fecha desc
      const ordenadas = [...data].sort((a, b) => {
        if (a.leida !== b.leida) return a.leida ? 1 : -1;
        return new Date(b.creadaEn).getTime() - new Date(a.creadaEn).getTime();
      });
      setNotifs(ordenadas);
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al cargar notificaciones", "error");
    } finally {
      setCargando(false);
    }
  }, [usuario, mostrarToast]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const marcarTodas = async () => {
    if (!usuario) return;
    setMarcandoTodas(true);
    try {
      const res = await api.marcarTodasNotificacionesLeidas(usuario.id);
      mostrarToast(`${res.actualizadas} notificación(es) marcadas como leídas`, "exito");
      await cargar();
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al marcar notificaciones", "error");
    } finally {
      setMarcandoTodas(false);
    }
  };

  const alClickNotificacion = async (n: Notificacion) => {
    // Marcar como leída primero (si no lo está)
    if (!n.leida && usuario) {
      setMarcandoId(n.id);
      try {
        await api.marcarNotificacionLeida(usuario.id, n.id);
        setNotifs((prev) =>
          prev.map((x) => (x.id === n.id ? { ...x, leida: true } : x)),
        );
      } catch {
        /* ignore — aún navegamos */
      } finally {
        setMarcandoId(null);
      }
    }

    // Navegar según tipo
    switch (n.tipo) {
      case "NUEVO_AVISO":
        setVista("padre-avisos");
        break;
      case "MENSAJE_DOCENTE":
        setVista("padre-mensajes");
        break;
      default:
        mostrarToast("Abriendo detalle…", "info");
        break;
    }
  };

  if (!usuario) return null;

  const noLeidas = notifs.filter((n) => !n.leida).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      {/* ===== Cabecera ===== */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          onClick={() => setVista("padre")}
          className="btn-3d inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Volver
        </button>

        {noLeidas > 0 && (
          <button
            onClick={marcarTodas}
            disabled={marcandoTodas}
            className="btn-3d inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105 disabled:opacity-60"
          >
            {marcandoTodas ? (
              <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
            ) : (
              <CheckCheck size={14} strokeWidth={2.5} />
            )}
            Marcar todas
          </button>
        )}
      </div>

      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
            <Bell size={22} className="text-white" strokeWidth={2.5} />
            {noLeidas > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-md">
                {noLeidas > 9 ? "9+" : noLeidas}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black text-stone-800">Notificaciones</h1>
            <p className="text-sm font-semibold text-stone-600">
              {noLeidas > 0
                ? `Tienes ${noLeidas} sin leer`
                : "Todo al día ✨"}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Lista ===== */}
      {cargando ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : notifs.length === 0 ? (
        <div className="card-premium animate-pop rounded-3xl p-8 text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100">
            <BellOff size={36} className="text-emerald-500" strokeWidth={2.5} />
          </div>
          <p className="text-lg font-black text-stone-800">
            No tienes notificaciones
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm font-semibold text-stone-600">
            Todo al día ✨ — aquí veremos avisos del colegio, notas nuevas y mensajes del docente.
          </p>
        </div>
      ) : (
        <div className="max-h-[70vh] space-y-2.5 overflow-y-auto pr-1">
          {notifs.map((n, i) => {
            const conf = iconoParaTipo(n.tipo);
            const Icon = conf.icon;
            const marcando = marcandoId === n.id;
            return (
              <button
                key={n.id}
                onClick={() => alClickNotificacion(n)}
                disabled={marcando}
                className={`card-premium animate-pop group flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition-all hover:scale-[1.01] disabled:opacity-70 ${
                  !n.leida ? "ring-2 ring-rose-200" : "opacity-80"
                }`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${conf.cls}`}
                >
                  {marcando ? (
                    <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
                  ) : (
                    <Icon size={18} strokeWidth={2.5} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-black text-stone-800">
                      {n.titulo}
                    </p>
                    {!n.leida && (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-rose-100 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-rose-600 animate-pulse">
                        Nueva
                      </span>
                    )}
                  </div>
                  {n.cuerpo && (
                    <p className="mt-0.5 line-clamp-3 text-xs font-semibold text-stone-600">
                      {n.cuerpo}
                    </p>
                  )}
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-stone-500">
                    {fechaRelativa(n.creadaEn)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
