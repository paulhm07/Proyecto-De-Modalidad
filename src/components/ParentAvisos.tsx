"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Calendar,
  User,
  Megaphone,
  Bell,
  PenLine,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { Aviso } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

type FiltroAviso = "todos" | "urgentes" | "recordatorios" | "eventos";

function formatearFecha(fecha: string): string {
  try {
    return new Date(fecha).toLocaleDateString("es-NI", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return fecha;
  }
}

function formatearFechaEvento(fecha: string): string {
  try {
    return new Date(fecha).toLocaleDateString("es-NI", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return fecha;
  }
}

function configTipo(tipo: Aviso["tipo"]): {
  emoji: string;
  badgeBg: string;
  badgeTexto: string;
  bordeIzq: string;
  icon: typeof Megaphone;
} {
  switch (tipo) {
    case "URGENTE":
      return { emoji: "🚨", badgeBg: "bg-rose-100", badgeTexto: "text-rose-700", bordeIzq: "border-l-rose-500", icon: AlertTriangle };
    case "RECORDATORIO":
      return { emoji: "📋", badgeBg: "bg-amber-100", badgeTexto: "text-amber-700", bordeIzq: "border-l-amber-500", icon: Bell };
    case "EVENTO":
      return { emoji: "🎉", badgeBg: "bg-cyan-100", badgeTexto: "text-cyan-700", bordeIzq: "border-l-cyan-500", icon: Calendar };
    case "CIRCULAR":
      return { emoji: "📢", badgeBg: "bg-stone-200", badgeTexto: "text-stone-700", bordeIzq: "border-l-stone-500", icon: Megaphone };
  }
}

function configPrioridad(p: number): string {
  if (p >= 3) return "border-l-rose-500";
  if (p === 2) return "border-l-amber-500";
  return "border-l-cyan-500";
}

const FILTROS: { id: FiltroAviso; label: string; icon: typeof Megaphone }[] = [
  { id: "todos", label: "Todos", icon: Megaphone },
  { id: "urgentes", label: "Urgentes", icon: AlertTriangle },
  { id: "recordatorios", label: "Recordatorios", icon: Bell },
  { id: "eventos", label: "Eventos", icon: Calendar },
];

export function ParentAvisos() {
  const { usuario, setVista, mostrarToast } = useApp();
  const [cargando, setCargando] = useState(true);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [filtro, setFiltro] = useState<FiltroAviso>("todos");
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());
  const [avisoFirmar, setAvisoFirmar] = useState<Aviso | null>(null);
  const [firmarLoading, setFirmarLoading] = useState(false);

  const cargar = async () => {
    if (!usuario) return;
    setCargando(true);
    try {
      const data = await api.obtenerAvisosPadre(usuario.id);
      setAvisos(data);
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al cargar avisos", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [usuario?.id]);


  const toggleExpand = (id: string) => {
    setExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const marcarLeido = async (a: Aviso) => {
    if (!usuario) return;
    try {
      await api.marcarAvisoLeido(usuario.id, a.id);
      mostrarToast("Aviso marcado como leído", "exito");
      await cargar();
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al marcar aviso", "error");
    }
  };

  const confirmarFirma = async () => {
    if (!usuario || !avisoFirmar) return;
    setFirmarLoading(true);
    try {
      await api.firmarAviso(usuario.id, avisoFirmar.id);
      mostrarToast("¡Aviso firmado y confirmado!", "exito");
      setAvisoFirmar(null);
      await cargar();
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al firmar aviso", "error");
    } finally {
      setFirmarLoading(false);
    }
  };

  const avisosFiltrados = useMemo(() => {
    const sorted = avisos
      .slice()
      .sort((a, b) => new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime());
    if (filtro === "todos") return sorted;
    if (filtro === "urgentes") return sorted.filter((a) => a.tipo === "URGENTE");
    if (filtro === "recordatorios") return sorted.filter((a) => a.tipo === "RECORDATORIO");
    if (filtro === "eventos") return sorted.filter((a) => a.tipo === "EVENTO");
    return sorted;
  }, [avisos, filtro]);

  const noLeidos = avisos.filter((a) => !a.leido).length;

  if (!usuario) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <button
        onClick={() => setVista("padre")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      {/* Header */}
      <div className="card-premium animate-bounce-in mb-6 rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
            <Megaphone size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-stone-800">Avisos y Circulares</h1>
            <p className="text-sm font-semibold text-stone-600">
              Comunicados oficiales del centro educativo.
            </p>
          </div>
          {noLeidos > 0 && (
            <span className="animate-pulse rounded-full bg-rose-500 px-3 py-1 text-xs font-black text-white shadow-md">
              {noLeidos} nuevo{noLeidos !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTROS.map((f) => {
          const activo = filtro === f.id;
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`btn-3d flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold shadow-md transition-all hover:scale-105 ${
                activo
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  : "bg-white/10 text-stone-300 hover:bg-white/20"
              }`}
            >
              <Icon size={13} strokeWidth={2.5} />
              {f.label}
              {f.id === "urgentes" && avisos.filter((a) => a.tipo === "URGENTE").length > 0 && (
                <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-black ${activo ? "bg-white/30 text-white" : "bg-rose-500/30 text-rose-200"}`}>
                  {avisos.filter((a) => a.tipo === "URGENTE").length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {cargando ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : avisosFiltrados.length === 0 ? (
        <div className="card-premium rounded-3xl p-8 text-center">
          <Sparkles size={40} className="mx-auto mb-3 text-amber-300" />
          <p className="text-base font-black text-stone-700">No hay avisos. Todo en orden ✨</p>
          <p className="mt-1 text-sm font-semibold text-stone-500">
            {filtro === "todos"
              ? "Cuando el maestro envíe comunicados, aparecerán aquí."
              : `No hay avisos en la categoría "${FILTROS.find((f) => f.id === filtro)?.label}".`}
          </p>
        </div>
      ) : (
        <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          {avisosFiltrados.map((a, i) => {
            const cfgTipo = configTipo(a.tipo);
            const bordePrioridad = configPrioridad(a.prioridad);
            const expandido = expandidos.has(a.id);
            const contenidoLargo = a.contenido.length > 180;
            const contenidoMostrado =
              expandido || !contenidoLargo ? a.contenido : `${a.contenido.slice(0, 180)}…`;
            return (
              <div
                key={a.id}
                className={`card-premium animate-pop overflow-hidden rounded-3xl border-l-4 ${bordePrioridad} p-5`}
                style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}
              >
                {/* Fila superior: badges + título */}
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full ${cfgTipo.badgeBg} px-2.5 py-1 text-[10px] font-black ${cfgTipo.badgeTexto}`}>
                      <span>{cfgTipo.emoji}</span>
                      {a.tipo}
                    </span>
                    {!a.leido && (
                      <span className="animate-pulse rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white shadow-md">
                        NEW
                      </span>
                    )}
                    {a.firmado && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-emerald-700">
                        <Check size={10} strokeWidth={3} />
                        Firmado
                      </span>
                    )}
                    {a.requiereFirma && !a.firmado && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-amber-700">
                        Requiere firma
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-black text-stone-100">{a.titulo}</h3>

                <p className="mt-1.5 text-sm font-medium leading-relaxed text-stone-300">
                  {contenidoMostrado}
                </p>
                {contenidoLargo && (
                  <button
                    onClick={() => toggleExpand(a.id)}
                    className="mt-1.5 inline-flex items-center gap-0.5 text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    {expandido ? (
                      <>Ver menos <ChevronUp size={12} strokeWidth={2.5} /></>
                    ) : (
                      <>Ver más <ChevronDown size={12} strokeWidth={2.5} /></>
                    )}
                  </button>
                )}

                {/* Metadata */}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-white/10 pt-3 text-[11px] font-semibold text-stone-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} strokeWidth={2.5} className="text-cyan-300" />
                    Enviado {formatearFecha(a.fechaEnvio)}
                  </span>
                  {a.fechaEvento && (
                    <span className="flex items-center gap-1 text-amber-300">
                      <Calendar size={11} strokeWidth={2.5} />
                      Evento: <span className="capitalize">{formatearFechaEvento(a.fechaEvento)}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <User size={11} strokeWidth={2.5} className="text-fuchsia-300" />
                    {a.maestro?.nombre ?? "Maestro"}
                  </span>
                  {a.seccion && (
                    <span className="flex items-center gap-1">
                      <Megaphone size={11} strokeWidth={2.5} className="text-emerald-300" />
                      {a.seccion.asignatura?.nombre ?? a.seccion.nombre ?? "Sección"}
                    </span>
                  )}
                </div>

                {/* Acciones */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {a.requiereFirma && !a.firmado && (
                    <button
                      onClick={() => setAvisoFirmar(a)}
                      className="btn-3d flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-xs font-black text-white shadow-md transition-all hover:scale-105"
                    >
                      <PenLine size={13} strokeWidth={2.5} />
                      Firmar
                    </button>
                  )}
                  {!a.leido && (
                    <button
                      onClick={() => marcarLeido(a)}
                      className="flex items-center gap-1.5 rounded-2xl bg-white/10 px-3 py-2 text-xs font-bold text-stone-300 transition-all hover:scale-105 hover:bg-white/20"
                    >
                      <Check size={12} strokeWidth={2.5} />
                      Marcar leído
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AlertDialog de firma */}
      <AlertDialog open={!!avisoFirmar} onOpenChange={(open) => !open && setAvisoFirmar(null)}>
        <AlertDialogContent className="border-amber-300/40 bg-stone-950/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-stone-100">
              <PenLine size={18} className="text-amber-400" strokeWidth={2.5} />
              Firmar aviso
            </AlertDialogTitle>
            <AlertDialogDescription className="text-stone-300">
              Estás a punto de firmar el siguiente aviso. Tu firma confirma que has recibido y leído el comunicado.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {avisoFirmar && (
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-lg">{configTipo(avisoFirmar.tipo).emoji}</span>
                <p className="text-sm font-black text-stone-100">{avisoFirmar.titulo}</p>
              </div>
              <p className="max-h-48 overflow-y-auto text-xs leading-relaxed text-stone-300">
                {avisoFirmar.contenido}
              </p>
              {avisoFirmar.fechaEvento && (
                <p className="mt-2 text-[11px] font-bold text-amber-300">
                  📅 Evento: <span className="capitalize">{formatearFechaEvento(avisoFirmar.fechaEvento)}</span>
                </p>
              )}
              <p className="mt-2 text-[11px] font-semibold text-stone-400">
                Enviado por {avisoFirmar.maestro?.nombre ?? "el maestro"} · {formatearFecha(avisoFirmar.fechaEnvio)}
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-white/20 bg-transparent text-stone-300 hover:bg-white/10 hover:text-stone-100"
              disabled={firmarLoading}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmarFirma();
              }}
              disabled={firmarLoading}
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md hover:from-amber-500 hover:to-orange-600"
            >
              {firmarLoading ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  Firmando…
                </>
              ) : (
                <>
                  <Check size={14} className="mr-1" strokeWidth={2.5} />
                  Firmar y confirmar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
