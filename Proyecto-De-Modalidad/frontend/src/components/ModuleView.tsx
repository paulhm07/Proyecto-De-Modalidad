"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, X, Star, Trophy, PartyPopper,
  CheckCircle2, AlertCircle, Coins, Gem,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import { Confetti } from "@/components/Toasts";
import type { Desafio, Medalla, RespuestaProgreso } from "@/lib/types";

const TIPO_LABEL: Record<string, string> = {
  SELECCION_MULTIPLE: "Selección múltiple",
  COMPLETAR_TEXTO: "Completa el texto",
  VERDADERO_FALSO: "Verdadero o falso",
  ASOCIAR_PAREJAS: "Asocia la pareja",
  ORDENAR_PALABRAS: "Ordena la oración",
};

export function ModuleView() {
  const { moduloId, setVista, usuario, setUsuario, mostrarToast } = useApp();
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actual, setActual] = useState(0);
  const [opcionSel, setOpcionSel] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<RespuestaProgreso | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [puntosTotales, setPuntosTotales] = useState(0);
  const [medallas, setMedallas] = useState<Medalla[]>([]);
  const [finalizado, setFinalizado] = useState(false);
  const [mostrarConfeti, setMostrarConfeti] = useState(false);

  useEffect(() => {
    if (!moduloId) { setVista("asignatura"); return; }
    (async () => {
      setCargando(true);
      try {
        const data = await api.obtenerDesafios(moduloId);
        setDesafios(data);
      } catch (err) { console.error(err); }
      finally { setCargando(false); }
    })();
  }, [moduloId, setVista]);

  const desafio = desafios[actual];

  const responder = useCallback(async () => {
    if (!opcionSel || !usuario || !desafio || enviando) return;
    setEnviando(true);
    try {
      const res = await api.responder(usuario.id, desafio.id, opcionSel);
      setRespuesta(res);
      if (res.esCorrecta && res.puntosGanados > 0) {
        setPuntosTotales((p) => p + res.puntosGanados);
        setMostrarConfeti(true);
        setTimeout(() => setMostrarConfeti(false), 4000);
        const partes = [`+${res.puntosGanados} puntos`];
        if (res.monedasGanadas > 0) partes.push(`+${res.monedasGanadas} monedas`);
        if (res.gemasGanadas > 0) partes.push(`+${res.gemasGanadas} gema`);
        mostrarToast(partes.join(" · "), "exito");
      }
      if (res.medallaGanada) {
        setMedallas((m) => [...m, res.medallaGanada!]);
        setMostrarConfeti(true);
        setTimeout(() => setMostrarConfeti(false), 4000);
        mostrarToast(`Medalla: ${res.medallaGanada.titulo}`, "exito");
      }
      try {
        const perfil = await api.obtenerPerfil(usuario.id);
        setUsuario(perfil);
      } catch { /* ignore */ }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al responder";
      mostrarToast(msg, "error");
    } finally { setEnviando(false); }
  }, [opcionSel, usuario, desafio, enviando, mostrarToast, setUsuario]);

  const siguiente = () => {
    if (actual + 1 >= desafios.length) {
      setFinalizado(true);
      setMostrarConfeti(true);
    } else {
      setActual((a) => a + 1);
      setOpcionSel(null);
      setRespuesta(null);
    }
  };

  if (cargando) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="h-24 animate-pulse rounded-3xl challenge-board" />
        <div className="mt-6 h-64 animate-pulse rounded-3xl challenge-board" />
      </div>
    );
  }

  if (finalizado) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        {mostrarConfeti && <Confetti duracionMs={5000} />}
        <div className="challenge-board animate-bounce-in overflow-hidden rounded-3xl p-8 text-center">
          <div className="animate-float mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-xl shadow-orange-900/50">
            {medallas.length > 0 ? <Trophy size={36} className="text-white" strokeWidth={2.5} /> : <PartyPopper size={36} className="text-white" strokeWidth={2.5} />}
          </div>
          <h2 className="challenge-text text-3xl">¡Módulo completado!</h2>
          <p className="challenge-text-gold mt-2 text-lg">Has terminado todos los desafíos</p>
          <div className="my-6 rounded-2xl border-2 border-emerald-300/70 bg-gradient-to-br from-emerald-400 to-teal-500 p-5 shadow-lg shadow-emerald-900/40">
            <p className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wide text-emerald-50">
              <Star size={14} fill="white" strokeWidth={0} /> Puntos ganados
            </p>
            <p className="text-5xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">+{puntosTotales}</p>
          </div>
          {medallas.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 flex items-center justify-center gap-1.5 text-sm font-black label-on-dark">
                <Trophy size={16} strokeWidth={2.5} /> Medallas desbloqueadas
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {medallas.map((m) => (
                  <div key={m.id} className="animate-glow rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-100 to-yellow-200 px-4 py-3 shadow-md">
                    <Trophy size={28} className="mx-auto text-amber-600" strokeWidth={2} fill="currentColor" />
                    <p className="mt-1 text-xs font-bold text-amber-800">{m.titulo}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <button onClick={() => setVista("asignatura")} className="challenge-option flex-1 rounded-xl py-3 text-sm">Otros módulos</button>
            <button onClick={() => setVista("dashboard")} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 via-rose-500 to-fuchsia-500 py-3 text-sm font-black text-white shadow-lg shadow-fuchsia-900/40 transition-all hover:scale-105">
              Más aventuras <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!desafio) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="challenge-board rounded-3xl p-8">
          <p className="challenge-text text-xl">Este módulo aún no tiene desafíos</p>
          <button onClick={() => setVista("asignatura")} className="challenge-option mt-4 rounded-xl px-5 py-2.5 text-sm">Volver</button>
        </div>
      </div>
    );
  }

  const progreso = ((actual + (respuesta ? 1 : 0)) / desafios.length) * 100;
  const respondido = respuesta !== null;

  // Computes the option state class for the high-contrast design
  const optionClass = (opId: string, index: number): string => {
    const seleccionada = opcionSel === opId;
    if (!respondido) {
      return `challenge-option ${seleccionada ? "challenge-option-selected" : ""}`;
    }
    // After answering
    const esElegida = seleccionada;
    if (esElegida && respuesta?.esCorrecta) return "challenge-option challenge-option-correct";
    if (esElegida && !respuesta?.esCorrecta) return "challenge-option challenge-option-wrong";
    return "challenge-option challenge-option-dim";
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-8">
      {mostrarConfeti && <Confetti duracionMs={4000} />}
      {/* Header — progress + type, all readable on the dark cosmic bg */}
      <div className="mb-5">
        <button
          onClick={() => setVista("asignatura")}
          className="label-on-dark mb-4 inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/40 bg-white/10 px-3 py-2 text-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Salir
        </button>
        <div className="flex items-center justify-between text-sm font-black">
          <span className="label-on-dark">Desafío {actual + 1} de {desafios.length}</span>
          <span className="rounded-full border border-amber-300/50 bg-amber-400/90 px-3 py-1 font-black text-amber-950 shadow-[0_2px_0_#b45309]">
            {TIPO_LABEL[desafio.tipo] || "Desafío"}
          </span>
        </div>
        <div className="challenge-progress-track mt-2 h-3.5 overflow-hidden rounded-full">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-rose-500 to-fuchsia-500 transition-all duration-500" style={{ width: `${progreso}%` }} />
        </div>
      </div>

      {/* Main challenge board — SOLID dark blue→violet cartel */}
      <div className="challenge-board animate-pop rounded-3xl p-6 sm:p-7">
        {/* Points badge */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-3 py-1.5 text-xs font-black text-amber-950 shadow-[0_3px_0_#b45309]">
          <Star size={12} fill="currentColor" strokeWidth={0} /> {desafio.puntos} puntos
        </div>

        {/* Question — pure white text with navy stroke on solid dark board */}
        <h2 className="challenge-text text-xl leading-snug sm:text-2xl">{desafio.pregunta}</h2>

        {/* Answer options — light luminous capsules with dark text (inverse contrast) */}
        <div className="mt-5 space-y-2.5">
          {desafio.opciones.map((op, i) => {
            const seleccionada = opcionSel === op.id;
            const esRespuesta = respondido && seleccionada;
            const correcta = esRespuesta && respuesta?.esCorrecta;
            const incorrecta = esRespuesta && !respuesta?.esCorrecta;
            return (
              <button
                key={op.id}
                onClick={() => !respondido && setOpcionSel(op.id)}
                disabled={respondido}
                style={{ animationDelay: `${i * 50}ms` }}
                className={`animate-pop flex w-full items-center gap-3 rounded-2xl p-3.5 text-left ${optionClass(op.id, i)} ${respondido ? "cursor-default" : "cursor-pointer"}`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                    correcta
                      ? "bg-emerald-600 text-white"
                      : incorrecta
                      ? "bg-red-600 text-white"
                      : seleccionada
                      ? "bg-amber-500 text-white"
                      : "bg-sky-500 text-white"
                  } shadow-inner`}
                >
                  {correcta ? <Check size={18} strokeWidth={3} /> : incorrecta ? <X size={18} strokeWidth={3} /> : String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1 text-base">{op.texto}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback callout after answering */}
        {respondido && (
          <div className={`animate-bounce-in mt-4 flex items-start gap-3 rounded-2xl p-3.5 ${respuesta?.esCorrecta ? "challenge-feedback-correct" : "challenge-feedback-wrong"}`}>
            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${respuesta?.esCorrecta ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"}`}>
              {respuesta?.esCorrecta ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <AlertCircle size={18} strokeWidth={2.5} />}
            </div>
            <div>
              <p className="font-black">{respuesta?.esCorrecta ? "¡Respuesta correcta!" : "¡Casi! Inténtalo de nuevo"}</p>
              <p className="text-sm font-bold opacity-90">{respuesta?.esCorrecta ? `Ganaste ${respuesta.puntosGanados} punto(s)` : "No te rindas, tú puedes"}</p>
              {respuesta?.esCorrecta && (respuesta.monedasGanadas > 0 || respuesta.gemasGanadas > 0) && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {respuesta.monedasGanadas > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-2 py-0.5 text-xs font-black text-amber-900"><Coins size={11} strokeWidth={2.5} />+{respuesta.monedasGanadas}</span>}
                  {respuesta.gemasGanadas > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-fuchsia-200 px-2 py-0.5 text-xs font-black text-fuchsia-900"><Gem size={11} strokeWidth={2.5} />+{respuesta.gemasGanadas}</span>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-5">
          {!respondido ? (
            <button
              onClick={responder}
              disabled={!opcionSel || enviando}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-rose-500 to-fuchsia-500 py-3.5 text-sm font-black text-white shadow-lg shadow-fuchsia-900/40 transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {enviando ? "Verificando..." : "Confirmar respuesta"} {!enviando && <Check size={16} strokeWidth={2.5} />}
            </button>
          ) : (
            <button
              onClick={siguiente}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-fuchsia-600 py-3.5 text-sm font-black text-white shadow-lg shadow-fuchsia-900/40 transition-all hover:scale-[1.02]"
            >
              {actual + 1 >= desafios.length ? "Ver resultados" : "Siguiente"} <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
