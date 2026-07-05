"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  PenLine,
  Hash,
  Download,
  Copy,
  CheckCircle2,
  Circle,
  Triangle,
  Square,
  Coffee,
  Sparkles,
  Lightbulb,
  AlertCircle,
  Layers,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

// ---- Tipos para el contenido MINED ----------------------------------------

interface ManifestModulo {
  id: string;
  archivo: string;
  titulo: string;
  asignatura: string;
  total_items: number;
  total_preguntas?: number;
  total_palabras?: number;
  total_oraciones?: number;
  descripcion: string;
}

interface Manifest {
  titulo: string;
  descripcion: string;
  grado: string;
  semestre: string;
  curriculum: string;
  total_modulos: number;
  modulos: ManifestModulo[];
  elementos_culturales_nicaraguenses: string[];
}

interface ProblemaMat {
  id: string;
  tipo_operacion: string;
  subtipo: string;
  enunciado: string;
  operacion_vertical_esperada: string;
  respuesta_correcta: number;
  residuo: number;
  distractores: number[];
  explicacion_distractores: Record<string, string>;
  contexto_cultural: string;
  dificultad: string;
}

interface ModuloMat {
  modulo: number;
  titulo: string;
  problemas: ProblemaMat[];
}

interface DesafioVisual {
  nivel: number;
  tema: string;
  descripcion_visual_para_ui: string;
  pregunta_para_el_nino: string;
  opcion_correcta: string;
  opciones_incorrectas: string[];
  explicacion_pedagogica: string;
  contexto_cultural: string;
}

interface PreguntaLectura {
  id: string;
  tipo: string;
  habilidad: string;
  pregunta: string;
  opcion_correcta: string;
  opciones_incorrectas: string[];
  explicacion_pedagogica: string;
}

interface Lectura {
  id: string;
  titulo: string;
  tipo: string;
  texto: string;
  palabras: number;
  contexto_cultural: string;
  preguntas: PreguntaLectura[];
}

interface PalabraOrt {
  id: string;
  categoria: string;
  item_con_error: string;
  palabra_correcta: string;
  letra_o_signo_faltante: string;
  regla_ortografica_aplicada: string;
  tipo_de_error: string;
}

interface OracionSigno {
  id: string;
  categoria: string;
  tipo_oracion: string;
  item_con_error: string;
  oracion_correcta: string;
  letra_o_signo_faltante: string;
  regla_ortografica_aplicada: string;
  tipo_de_error: string;
}

// ---- Componente -------------------------------------------------------------

type TabModulo = "m1" | "m2" | "m3" | "m4";

const ICONOS_MODULO: Record<TabModulo, typeof Calculator> = {
  m1: Calculator,
  m2: Triangle,
  m3: BookOpen,
  m4: PenLine,
};

const COLORES_MODULO: Record<
  TabModulo,
  { bg: string; ring: string; text: string; grad: string }
> = {
  m1: {
    bg: "bg-cyan-500/15",
    ring: "ring-cyan-400/40",
    text: "text-cyan-300",
    grad: "from-cyan-500 to-blue-600",
  },
  m2: {
    bg: "bg-emerald-500/15",
    ring: "ring-emerald-400/40",
    text: "text-emerald-300",
    grad: "from-emerald-500 to-teal-600",
  },
  m3: {
    bg: "bg-orange-500/15",
    ring: "ring-orange-400/40",
    text: "text-orange-300",
    grad: "from-orange-500 to-rose-600",
  },
  m4: {
    bg: "bg-fuchsia-500/15",
    ring: "ring-fuchsia-400/40",
    text: "text-fuchsia-300",
    grad: "from-fuchsia-500 to-purple-600",
  },
};

export function ContenidoMINEDViewer() {
  const { setVista, mostrarToast } = useApp();
  const [tab, setTab] = useState<TabModulo>("m1");
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [m1, setM1] = useState<{ problemas: ProblemaMat[]; titulo: string } | null>(null);
  const [m2, setM2] = useState<{ desafios: DesafioVisual[]; titulo: string } | null>(null);
  const [m3, setM3] = useState<{ lecturas: Lectura[]; titulo: string } | null>(null);
  const [m4, setM4] = useState<{
    palabras: PalabraOrt[];
    oraciones: OracionSigno[];
    titulo: string;
  } | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      setCargando(true);
      try {
        const [manRes, m1Res, m2Res, m3Res, m4Res] = await Promise.all([
          fetch("/contenido-mined/index.json"),
          fetch("/contenido-mined/modulo1-multiplicacion-division.json"),
          fetch("/contenido-mined/modulo2-fracciones-geometria.json"),
          fetch("/contenido-mined/modulo3-comprension-sintaxis.json"),
          fetch("/contenido-mined/modulo4-ortografia-signos.json"),
        ]);
        if (cancelado) return;
        const [man, d1, d2, d3, d4] = await Promise.all([
          manRes.json(),
          m1Res.json(),
          m2Res.json(),
          m3Res.json(),
          m4Res.json(),
        ]);
        setManifest(man);
        setM1({ problemas: d1.problemas, titulo: d1.titulo });
        setM2({ desafios: d2.desafios, titulo: d2.titulo });
        setM3({ lecturas: d3.lecturas, titulo: d3.titulo });
        setM4({
          palabras: d4.palabras,
          oraciones: d4.oraciones,
          titulo: d4.titulo,
        });
      } catch (err) {
        if (!cancelado) {
          mostrarToast(
            err instanceof Error ? err.message : "Error al cargar contenido MINED",
            "error",
          );
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [mostrarToast]);

  const copiarJSON = async (modulo: TabModulo) => {
    const archivo = {
      m1: "modulo1-multiplicacion-division.json",
      m2: "modulo2-fracciones-geometria.json",
      m3: "modulo3-comprension-sintaxis.json",
      m4: "modulo4-ortografia-signos.json",
    }[modulo];
    try {
      const res = await fetch(`/contenido-mined/${archivo}`);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      mostrarToast(`JSON del módulo copiado al portapapeles`, "exito");
    } catch {
      mostrarToast("No se pudo copiar el JSON", "error");
    }
  };

  const descargarJSON = (modulo: TabModulo) => {
    const archivo = {
      m1: "modulo1-multiplicacion-division.json",
      m2: "modulo2-fracciones-geometria.json",
      m3: "modulo3-comprension-sintaxis.json",
      m4: "modulo4-ortografia-signos.json",
    }[modulo];
    const a = document.createElement("a");
    a.href = `/contenido-mined/${archivo}`;
    a.download = archivo;
    a.click();
    mostrarToast(`Descargando ${archivo}`, "info");
  };

  if (cargando || !manifest) {
    return (
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-400" />
          <p className="text-sm font-bold text-cyan-200">Cargando contenido MINED…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      {/* Botón volver */}
      <button
        onClick={() => setVista("maestro")}
        className="subject-back-btn mb-4 inline-flex items-center gap-1.5 px-3 py-2 text-sm"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver al panel
      </button>

      {/* Hero */}
      <section className="subject-hero mb-6 rounded-3xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg ring-2 ring-white/30">
            <BookOpen size={28} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="label-on-dark text-xs uppercase tracking-widest">
              {manifest.curriculum} · {manifest.grado} · {manifest.semestre}
            </p>
            <h1 className="subject-hero-title mt-1 text-3xl sm:text-4xl">
              Banco de Contenido MINED
            </h1>
            <p className="subject-hero-subtitle mt-2 text-sm sm:text-base">
              {manifest.descripcion}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {manifest.elementos_culturales_nicaraguenses.slice(0, 6).map((el, i) => (
                <span
                  key={i}
                  className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-cyan-100 ring-1 ring-cyan-300/30"
                >
                  {el}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs de módulos */}
      <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(["m1", "m2", "m3", "m4"] as TabModulo[]).map((m) => {
          const Icon = ICONOS_MODULO[m];
          const c = COLORES_MODULO[m];
          const activo = tab === m;
          const mod = manifest.modulos[Number(m.slice(1)) - 1];
          return (
            <button
              key={m}
              onClick={() => setTab(m)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center transition-all ${
                activo
                  ? `bg-gradient-to-br ${c.grad} text-white shadow-lg ring-2 ring-white/40`
                  : `${c.bg} ${c.text} ring-1 ${c.ring} hover:scale-[1.02]`
              }`}
            >
              <Icon size={22} strokeWidth={2.5} />
              <span className="text-[11px] font-black uppercase tracking-wide">
                Módulo {m.slice(1)}
              </span>
              <span className={`text-[10px] font-semibold ${activo ? "text-white/80" : "opacity-70"}`}>
                {mod.asignatura === "Matemática" ? "Mat" : "Lengua"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Acciones de exportación */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => copiarJSON(tab)}
          className="glass-on-dark inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-cyan-100 ring-1 ring-cyan-300/30 transition-all hover:scale-105"
        >
          <Copy size={13} strokeWidth={2.5} /> Copiar JSON
        </button>
        <button
          onClick={() => descargarJSON(tab)}
          className="glass-on-dark inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-cyan-100 ring-1 ring-cyan-300/30 transition-all hover:scale-105"
        >
          <Download size={13} strokeWidth={2.5} /> Descargar JSON
        </button>
      </div>

      {/* Contenido según tab */}
      {tab === "m1" && m1 && <Modulo1View problemas={m1.problemas} titulo={m1.titulo} />}
      {tab === "m2" && m2 && <Modulo2View desafios={m2.desafios} titulo={m2.titulo} />}
      {tab === "m3" && m3 && <Modulo3View lecturas={m3.lecturas} titulo={m3.titulo} />}
      {tab === "m4" && m4 && (
        <Modulo4View palabras={m4.palabras} oraciones={m4.oraciones} titulo={m4.titulo} />
      )}
    </div>
  );
}

// ===== Módulo 1: Multiplicación y División ===================================

function Modulo1View({ problemas, titulo }: { problemas: ProblemaMat[]; titulo: string }) {
  const [filtro, setFiltro] = useState<"todos" | "multiplicacion" | "division">("todos");
  const filtrados = useMemo(
    () => (filtro === "todos" ? problemas : problemas.filter((p) => p.tipo_operacion === filtro)),
    [problemas, filtro],
  );

  return (
    <section>
      <div className="challenge-board-sm mb-4 rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="challenge-text text-xl">{titulo}</h2>
            <p className="label-on-dark mt-1 text-xs">
              {problemas.length} problemas · 5 multiplicación + 10 división · contexto nicaragüense
            </p>
          </div>
          <div className="flex gap-1.5">
            {(["todos", "multiplicacion", "division"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  filtro === f
                    ? "bg-cyan-400 text-slate-900"
                    : "glass-on-dark text-cyan-100 ring-1 ring-cyan-300/30"
                }`}
              >
                {f === "todos" ? "Todos" : f === "multiplicacion" ? "× Mult" : "÷ Div"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtrados.map((p, i) => (
          <article
            key={p.id}
            className="mission-card animate-pop rounded-2xl p-4"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`mission-num ${
                    p.tipo_operacion === "multiplicacion"
                      ? "mission-num-math"
                      : "mission-num-lang"
                  }`}
                >
                  {p.id.split("-")[1]}
                </span>
                <div>
                  <p className="label-on-dark text-[11px] uppercase tracking-wide">
                    {p.subtipo}
                  </p>
                  <p className="text-xs font-bold text-cyan-200">
                    {p.contexto_cultural}
                  </p>
                </div>
              </div>
              <span
                className={`mission-tag ${
                  p.dificultad === "baja"
                    ? "mission-tag-cyan"
                    : p.dificultad === "media"
                      ? "mission-tag-amber"
                      : "mission-tag-fuchsia"
                }`}
              >
                {p.dificultad}
              </span>
            </div>

            <p className="challenge-text mt-3 text-base leading-snug">{p.enunciado}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-slate-950/60 px-3 py-2 ring-1 ring-cyan-400/30">
                <Hash size={14} className="text-cyan-300" strokeWidth={2.5} />
                <span className="font-mono text-lg font-black text-cyan-300">
                  {p.operacion_vertical_esperada}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="label-on-dark text-[11px]">Respuesta:</span>
                <span className="rounded-lg bg-emerald-400/20 px-2.5 py-1 text-base font-black text-emerald-200 ring-1 ring-emerald-400/50">
                  {p.respuesta_correcta}
                </span>
                {p.residuo > 0 && (
                  <span className="rounded-lg bg-amber-400/20 px-2.5 py-1 text-sm font-black text-amber-200 ring-1 ring-amber-400/50">
                    residuo {p.residuo}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {p.distractores.map((d) => (
                <div
                  key={d}
                  className="rounded-lg bg-rose-500/10 px-2.5 py-1.5 ring-1 ring-rose-400/30"
                >
                  <p className="text-sm font-black text-rose-200">✗ {d}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-rose-100/70">
                    {p.explicacion_distractores[String(d)] ?? "Distractor numérico"}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ===== Módulo 2: Fracciones y Geometría =====================================

function Modulo2View({ desafios, titulo }: { desafios: DesafioVisual[]; titulo: string }) {
  return (
    <section>
      <div className="challenge-board-sm mb-4 rounded-2xl p-4">
        <h2 className="challenge-text text-xl">{titulo}</h2>
        <p className="label-on-dark mt-1 text-xs">
          {desafios.length} desafíos visuales · 5 fracciones + 5 geometría · descripción UI incluida
        </p>
      </div>

      <div className="space-y-3">
        {desafios.map((d, i) => {
          const esFraccion = d.tema.toLowerCase().includes("fracc");
          return (
            <article
              key={d.nivel}
              className="mission-card animate-pop rounded-2xl p-4"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`mission-num ${esFraccion ? "mission-num-math" : "mission-num-lang"}`}
                  >
                    {d.nivel}
                  </span>
                  <div>
                    <p className="label-on-dark text-[11px] uppercase tracking-wide">
                      {esFraccion ? "Fracciones" : "Geometría"}
                    </p>
                    <p className="text-xs font-bold text-cyan-200">{d.contexto_cultural}</p>
                  </div>
                </div>
                <span className="mission-tag mission-tag-cyan">{d.tema}</span>
              </div>

              {/* Descripción visual para UI */}
              <div className="mt-3 rounded-xl bg-indigo-950/50 p-3 ring-1 ring-cyan-400/20">
                <p className="mb-1 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-cyan-300">
                  <Sparkles size={12} strokeWidth={2.5} /> Descripción Visual para UI
                </p>
                <p className="text-sm leading-snug text-cyan-50">{d.descripcion_visual_para_ui}</p>
              </div>

              {/* Pregunta */}
              <p className="challenge-text mt-3 text-base leading-snug">{d.pregunta_para_el_nino}</p>

              {/* Opciones */}
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="challenge-option rounded-xl px-3 py-2">
                  <p className="flex items-center gap-1.5 text-sm font-black">
                    <CheckCircle2 size={14} className="text-emerald-600" strokeWidth={2.5} />
                    {d.opcion_correcta}
                  </p>
                </div>
                {d.opciones_incorrectas.map((opt) => (
                  <div
                    key={opt}
                    className="rounded-xl bg-rose-500/10 px-3 py-2 ring-1 ring-rose-400/30"
                  >
                    <p className="flex items-center gap-1.5 text-sm font-black text-rose-200">
                      <Circle size={14} className="text-rose-400" strokeWidth={2.5} />
                      {opt}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-tight text-amber-200/80">
                <Lightbulb size={12} className="mt-0.5 shrink-0" strokeWidth={2.5} />
                {d.explicacion_pedagogica}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ===== Módulo 3: Comprensión Lectora ========================================

function Modulo3View({ lecturas, titulo }: { lecturas: Lectura[]; titulo: string }) {
  const [abierta, setAbierta] = useState<string | null>(lecturas[0]?.id ?? null);

  return (
    <section>
      <div className="challenge-board-sm mb-4 rounded-2xl p-4">
        <h2 className="challenge-text text-xl">{titulo}</h2>
        <p className="label-on-dark mt-1 text-xs">
          {lecturas.length} lecturas · {lecturas.reduce((a, l) => a + l.preguntas.length, 0)} preguntas
          · estructura + gramática + pronombres
        </p>
      </div>

      <div className="space-y-3">
        {lecturas.map((l, i) => {
          const abiertaEsta = abierta === l.id;
          return (
            <article
              key={l.id}
              className="mission-card animate-pop rounded-2xl p-4"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <button
                onClick={() => setAbierta(abiertaEsta ? null : l.id)}
                className="flex w-full items-center justify-between gap-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="mission-num mission-num-lang">{i + 1}</span>
                  <div>
                    <p className="label-on-dark text-[11px] uppercase tracking-wide">
                      {l.tipo} · {l.palabras} palabras
                    </p>
                    <h3 className="challenge-text text-lg">{l.titulo}</h3>
                  </div>
                </div>
                <span className="text-cyan-200">{abiertaEsta ? "▲" : "▼"}</span>
              </button>

              {abiertaEsta && (
                <div className="mt-3 space-y-3">
                  {/* Texto de la lectura */}
                  <div className="rounded-xl bg-indigo-950/50 p-3 ring-1 ring-orange-400/30">
                    <p className="mb-1 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-orange-300">
                      <BookOpen size={12} strokeWidth={2.5} /> Lectura
                    </p>
                    <p className="text-sm leading-relaxed text-orange-50">{l.texto}</p>
                    <p className="mt-2 text-[10px] italic text-orange-200/60">
                      📌 {l.contexto_cultural}
                    </p>
                  </div>

                  {/* Preguntas */}
                  {l.preguntas.map((q, qi) => (
                    <div
                      key={q.id}
                      className="rounded-xl bg-slate-950/40 p-3 ring-1 ring-cyan-400/20"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="mission-num mission-num-math text-xs">{qi + 1}</span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-300">
                            {q.habilidad}
                          </p>
                          <p className="text-[10px] text-cyan-100/60">{q.tipo}</p>
                        </div>
                      </div>
                      <p className="challenge-text text-sm leading-snug">{q.pregunta}</p>
                      <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                        <div className="challenge-option rounded-lg px-2.5 py-1.5">
                          <p className="flex items-center gap-1.5 text-xs font-black">
                            <CheckCircle2 size={12} className="text-emerald-600" strokeWidth={2.5} />
                            {q.opcion_correcta}
                          </p>
                        </div>
                        {q.opciones_incorrectas.map((opt) => (
                          <div
                            key={opt}
                            className="rounded-lg bg-rose-500/10 px-2.5 py-1.5 ring-1 ring-rose-400/30"
                          >
                            <p className="flex items-center gap-1.5 text-xs font-black text-rose-200">
                              <Circle size={12} className="text-rose-400" strokeWidth={2.5} />
                              {opt}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-1.5 flex items-start gap-1.5 text-[10px] leading-tight text-amber-200/70">
                        <Lightbulb size={11} className="mt-0.5 shrink-0" strokeWidth={2.5} />
                        {q.explicacion_pedagogica}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ===== Módulo 4: Ortografía y Signos ========================================

function Modulo4View({
  palabras,
  oraciones,
  titulo,
}: {
  palabras: PalabraOrt[];
  oraciones: OracionSigno[];
  titulo: string;
}) {
  const [subtab, setSubtab] = useState<"bv" | "acento" | "signos">("bv");

  const palabrasBV = palabras.filter((p) => p.categoria === "uso_b_v");
  const palabrasAcento = palabras.filter((p) => p.categoria.startsWith("acentuacion"));

  const CATEGORIA_ESTILO: Record<string, { label: string; color: string }> = {
    uso_b_v: { label: "B/V", color: "bg-cyan-400/20 text-cyan-200 ring-cyan-400/40" },
    acentuacion_aguda: { label: "Aguda", color: "bg-amber-400/20 text-amber-200 ring-amber-400/40" },
    acentuacion_grave: { label: "Grave", color: "bg-emerald-400/20 text-emerald-200 ring-emerald-400/40" },
    acentuacion_esdrujula: {
      label: "Esdrújula",
      color: "bg-fuchsia-400/20 text-fuchsia-200 ring-fuchsia-400/40",
    },
  };

  return (
    <section>
      <div className="challenge-board-sm mb-4 rounded-2xl p-4">
        <h2 className="challenge-text text-xl">{titulo}</h2>
        <p className="label-on-dark mt-1 text-xs">
          {palabras.length} palabras + {oraciones.length} oraciones · B/V + acentuación + signos ¡!¿?
        </p>
      </div>

      {/* Subtabs */}
      <div className="mb-4 flex gap-2">
        {([
          ["bv", `B/V (${palabrasBV.length})`],
          ["acento", `Acentuación (${palabrasAcento.length})`],
          ["signos", `Signos (${oraciones.length})`],
        ] as const).map(([k, lbl]) => (
          <button
            key={k}
            onClick={() => setSubtab(k)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              subtab === k
                ? "bg-fuchsia-400 text-slate-900"
                : "glass-on-dark text-fuchsia-100 ring-1 ring-fuchsia-300/30"
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* Palabras B/V */}
      {subtab === "bv" && (
        <div className="space-y-2.5">
          {palabrasBV.map((p, i) => (
            <article
              key={p.id}
              className="mission-card animate-pop rounded-xl p-3"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-rose-500/20 px-2.5 py-1 font-mono text-sm font-black text-rose-200 line-through ring-1 ring-rose-400/40">
                  {p.item_con_error}
                </span>
                <span className="text-cyan-200">→</span>
                <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 font-mono text-sm font-black text-emerald-200 ring-1 ring-emerald-400/40">
                  {p.palabra_correcta}
                </span>
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${
                    CATEGORIA_ESTILO[p.categoria]?.color ?? ""
                  }`}
                >
                  {CATEGORIA_ESTILO[p.categoria]?.label}
                </span>
              </div>
              <p className="mt-2 text-xs leading-snug text-cyan-100">
                <span className="font-black text-amber-300">Falta: </span>
                {p.letra_o_signo_faltante}
              </p>
              <p className="mt-1 text-xs leading-snug text-cyan-100">
                <span className="font-black text-cyan-300">Regla: </span>
                {p.regla_ortografica_aplicada}
              </p>
              <p className="mt-0.5 text-[10px] text-cyan-200/60">{p.tipo_de_error}</p>
            </article>
          ))}
        </div>
      )}

      {/* Palabras Acentuación */}
      {subtab === "acento" && (
        <div className="space-y-2.5">
          {palabrasAcento.map((p, i) => (
            <article
              key={p.id}
              className="mission-card animate-pop rounded-xl p-3"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-rose-500/20 px-2.5 py-1 font-mono text-sm font-black text-rose-200 ring-1 ring-rose-400/40">
                  {p.item_con_error}
                </span>
                <span className="text-cyan-200">→</span>
                <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 font-mono text-sm font-black text-emerald-200 ring-1 ring-emerald-400/40">
                  {p.palabra_correcta}
                </span>
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${
                    CATEGORIA_ESTILO[p.categoria]?.color ?? ""
                  }`}
                >
                  {CATEGORIA_ESTILO[p.categoria]?.label}
                </span>
              </div>
              <p className="mt-2 text-xs leading-snug text-cyan-100">
                <span className="font-black text-amber-300">Falta: </span>
                {p.letra_o_signo_faltante}
              </p>
              <p className="mt-1 text-xs leading-snug text-cyan-100">
                <span className="font-black text-cyan-300">Regla: </span>
                {p.regla_ortografica_aplicada}
              </p>
              <p className="mt-0.5 text-[10px] text-cyan-200/60">{p.tipo_de_error}</p>
            </article>
          ))}
        </div>
      )}

      {/* Oraciones Signos */}
      {subtab === "signos" && (
        <div className="space-y-2.5">
          {oraciones.map((o, i) => {
            const esInterrog = o.tipo_oracion === "interrogativa";
            return (
              <article
                key={o.id}
                className="mission-card animate-pop rounded-xl p-3"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${
                      esInterrog
                        ? "bg-cyan-400/20 text-cyan-200 ring-cyan-400/40"
                        : "bg-orange-400/20 text-orange-200 ring-orange-400/40"
                    }`}
                  >
                    {esInterrog ? "¿? Interrogativa" : "¡! Exclamativa"}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-rose-500/20 px-2.5 py-1 text-sm font-black text-rose-200 ring-1 ring-rose-400/40">
                    {o.item_con_error}
                  </span>
                  <span className="text-cyan-200">→</span>
                  <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-sm font-black text-emerald-200 ring-1 ring-emerald-400/40">
                    {o.oracion_correcta}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-200">
                  <AlertCircle size={12} className="shrink-0" strokeWidth={2.5} />
                  <span className="font-black">Falta: </span>
                  {o.letra_o_signo_faltante}
                </p>
                <p className="mt-1 text-xs leading-snug text-cyan-100">
                  <span className="font-black text-cyan-300">Regla: </span>
                  {o.regla_ortografica_aplicada}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
