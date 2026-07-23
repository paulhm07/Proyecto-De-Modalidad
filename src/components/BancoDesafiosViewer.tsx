"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  PenLine,
  CheckCircle2,
  Copy,
  Download,
  Filter,
  Lightbulb,
  Library,
  Hash,
  MousePointerClick,
  Hand,
  PencilLine,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  BANCO_DESAFIOS,
  DIFICULTADES,
  MATERIAS,
  RESUMEN_BANCO,
  type DesafioBanco,
  type Dificultad,
  type Materia,
  type TipoMecanica,
} from "@/data/bancoDesafios";

// ---- Helpers visuales ----------------------------------------------------

const DIFICULTAD_ESTILO: Record<
  Dificultad,
  { bg: string; text: string; ring: string; emoji: string }
> = {
  Fácil: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    ring: "ring-emerald-300",
    emoji: "🌱",
  },
  Medio: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    ring: "ring-amber-300",
    emoji: "⚡",
  },
  Difícil: {
    bg: "bg-rose-100",
    text: "text-rose-700",
    ring: "ring-rose-300",
    emoji: "🔥",
  },
};

const MATERIA_ESTILO: Record<
  Materia,
  { bg: string; text: string; icon: typeof Calculator }
> = {
  Matemáticas: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    icon: Calculator,
  },
  Lengua: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    icon: PenLine,
  },
};

const MECANICA_ESTILO: Record<
  TipoMecanica,
  { icon: typeof MousePointerClick; short: string }
> = {
  "Opción Múltiple": { icon: MousePointerClick, short: "OM" },
  "Arrastrar y Soltar": { icon: Hand, short: "AS" },
  "Completar Espacio": { icon: PencilLine, short: "CE" },
};

// Convierte un desafío a objeto Kotlin data class (útil para Android Studio)
function toKotlin(d: DesafioBanco): string {
  const esc = (s: string) => s.replace(/"/g, '\\"');
  const opts = d.opciones.map((o) => `        "${esc(o)}"`).join(",\n");
  return `Desafio(
    id = "${d.id}",
    materia = "${d.materia}",
    dificultad = "${d.dificultad}",
    tipo_mecanica = "${d.tipo_mecanica}",
    enunciado = "${esc(d.enunciado)}",
    opciones = listOf(
${opts}
    ),
    respuesta_correcta = "${esc(d.respuesta_correcta)}",
    pista_retroalimentacion = "${esc(d.pista_retroalimentacion)}"
)`;
}

function toJsonObject(d: DesafioBanco): string {
  return JSON.stringify(d, null, 2);
}

// ---- Componente principal ------------------------------------------------

export function BancoDesafiosViewer() {
  const { setVista, mostrarToast } = useApp();

  const [filtroMateria, setFiltroMateria] = useState<Materia | "Todas">("Todas");
  const [filtroDificultad, setFiltroDificultad] = useState<Dificultad | "Todas">(
    "Todas"
  );
  const [filtroMecanica, setFiltroMecanica] = useState<TipoMecanica | "Todas">(
    "Todas"
  );
  const [formatoCopia, setFormatoCopia] = useState<"json" | "kotlin">("json");
  const [desafioExpandido, setDesafioExpandido] = useState<string | null>(null);

  const desafiosFiltrados = useMemo(() => {
    return BANCO_DESAFIOS.filter((d) => {
      if (filtroMateria !== "Todas" && d.materia !== filtroMateria) return false;
      if (filtroDificultad !== "Todas" && d.dificultad !== filtroDificultad)
        return false;
      if (filtroMecanica !== "Todas" && d.tipo_mecanica !== filtroMecanica)
        return false;
      return true;
    });
  }, [filtroMateria, filtroDificultad, filtroMecanica]);

  const copiarAlPortapapeles = async (texto: string, etiqueta: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      mostrarToast(`✅ ${etiqueta} copiado al portapapeles`, "exito");
    } catch {
      mostrarToast("No se pudo copiar automáticamente. Selecciona el texto manualmente.", "error");
    }
  };

  const descargarJsonCompleto = () => {
    // Descarga directa del JSON estático servido en /public
    const a = document.createElement("a");
    a.href = "/banco-desafios.json";
    a.download = "banco-desafios.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    mostrarToast("📦 Descargando banco-desafios.json (30 desafíos)", "exito");
  };

  const copiarTodo = async () => {
    const texto =
      formatoCopia === "json"
        ? JSON.stringify(BANCO_DESAFIOS, null, 2)
        : `val BANCO_DESAFIOS = listOf(\n${BANCO_DESAFIOS.map(toKotlin).join(",\n\n")}\n)`;
    await copiarAlPortapapeles(
      texto,
      `Banco completo (${formatoCopia.toUpperCase()} — ${BANCO_DESAFIOS.length} desafíos)`
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      {/* Botón volver */}
      <button
        onClick={() => setVista("maestro")}
        className="label-on-dark mb-4 inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/40 bg-white/10 px-3 py-2 text-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver al panel
      </button>

      {/* Hero del banco */}
      <div className="challenge-board-sm animate-bounce-in mb-6 overflow-hidden rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 shadow-lg">
              <Library size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="challenge-text text-2xl sm:text-3xl">
                Banco de Desafíos
              </h1>
              <p className="label-on-dark mt-0.5 text-sm">
                30 desafíos curriculares · 3.er grado de primaria (8-9 años)
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={descargarJsonCompleto}
              className="btn-3d flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105"
            >
              <Download size={16} strokeWidth={2.5} /> Descargar JSON
            </button>
            <button
              onClick={copiarTodo}
              className="btn-3d flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105"
            >
              <Copy size={16} strokeWidth={2.5} /> Copiar todo ({formatoCopia.toUpperCase()})
            </button>
          </div>
        </div>

        {/* Stats resumen */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total" value={RESUMEN_BANCO.total} emoji="📚" tone="violet" />
          <StatCard label="Matemáticas" value={RESUMEN_BANCO.matematicas} emoji="🧮" tone="cyan" />
          <StatCard label="Lengua" value={RESUMEN_BANCO.lengua} emoji="📖" tone="orange" />
          <StatCard label="Fácil" value={RESUMEN_BANCO.facil} emoji="🌱" tone="emerald" />
          <StatCard label="Medio" value={RESUMEN_BANCO.medio} emoji="⚡" tone="amber" />
          <StatCard label="Difícil" value={RESUMEN_BANCO.dificil} emoji="🔥" tone="rose" />
        </div>
      </div>

      {/* Filtros */}
      <div className="challenge-board-sm mb-6 rounded-3xl p-5">
        <div className="mb-3 flex items-center gap-2">
          <Filter size={16} className="text-cyan-300" strokeWidth={2.5} />
          <span className="label-on-dark text-sm">Filtros</span>
          <span className="ml-auto rounded-full border border-cyan-300/40 bg-white/10 px-2 py-0.5 text-xs font-bold text-cyan-100">
            {desafiosFiltrados.length} de {BANCO_DESAFIOS.length}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {/* Materia */}
          <FilterGroup label="Materia">
            <Pill
              active={filtroMateria === "Todas"}
              onClick={() => setFiltroMateria("Todas")}
            >
              Todas
            </Pill>
            {MATERIAS.map((m) => (
              <Pill
                key={m}
                active={filtroMateria === m}
                onClick={() => setFiltroMateria(m)}
              >
                {m === "Matemáticas" ? "🧮 Matemáticas" : "📖 Lengua"}
              </Pill>
            ))}
          </FilterGroup>

          {/* Dificultad */}
          <FilterGroup label="Dificultad">
            <Pill
              active={filtroDificultad === "Todas"}
              onClick={() => setFiltroDificultad("Todas")}
            >
              Todas
            </Pill>
            {DIFICULTADES.map((d) => (
              <Pill
                key={d}
                active={filtroDificultad === d}
                onClick={() => setFiltroDificultad(d)}
              >
                {DIFICULTAD_ESTILO[d].emoji} {d}
              </Pill>
            ))}
          </FilterGroup>

          {/* Mecánica */}
          <FilterGroup label="Mecánica">
            <Pill
              active={filtroMecanica === "Todas"}
              onClick={() => setFiltroMecanica("Todas")}
            >
              Todas
            </Pill>
            {(["Opción Múltiple", "Arrastrar y Soltar", "Completar Espacio"] as TipoMecanica[]).map(
              (t) => (
                <Pill
                  key={t}
                  active={filtroMecanica === t}
                  onClick={() => setFiltroMecanica(t)}
                >
                  {t}
                </Pill>
              )
            )}
          </FilterGroup>
        </div>

        {/* Selector de formato de copia */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-cyan-300/20 pt-3">
          <span className="label-on-dark text-xs uppercase tracking-wide">
            Formato al copiar:
          </span>
          <Pill active={formatoCopia === "json"} onClick={() => setFormatoCopia("json")}>
            {"{ }"} JSON
          </Pill>
          <Pill active={formatoCopia === "kotlin"} onClick={() => setFormatoCopia("kotlin")}>
            {"⌘"} Kotlin
          </Pill>
        </div>
      </div>

      {/* Grid de desafíos */}
      {desafiosFiltrados.length === 0 ? (
        <div className="challenge-board-sm rounded-3xl p-10 text-center">
          <Library size={40} className="mx-auto mb-3 text-cyan-300/70" />
          <p className="challenge-text text-sm">
            No hay desafíos que coincidan con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {desafiosFiltrados.map((d, i) => {
            const matEst = MATERIA_ESTILO[d.materia];
            const difEst = DIFICULTAD_ESTILO[d.dificultad];
            const mecEst = MECANICA_ESTILO[d.tipo_mecanica];
            const MatIc = matEst.icon;
            const MecIc = mecEst.icon;
            const expandido = desafioExpandido === d.id;
            const codigo = formatoCopia === "json" ? toJsonObject(d) : toKotlin(d);

            return (
              <article
                key={d.id}
                className="challenge-board-sm animate-pop flex flex-col rounded-3xl p-4"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {/* Cabecera: badges */}
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full ${matEst.bg} ${matEst.text} px-2 py-0.5 text-[11px] font-bold`}
                  >
                    <MatIc size={11} strokeWidth={2.5} /> {d.materia}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full ${difEst.bg} ${difEst.text} px-2 py-0.5 text-[11px] font-bold ring-1 ${difEst.ring}`}
                  >
                    {difEst.emoji} {d.dificultad}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                    <MecIc size={11} strokeWidth={2.5} /> {d.tipo_mecanica}
                  </span>
                </div>

                {/* ID + enunciado */}
                <div className="mb-2 flex items-center gap-1.5">
                  <Hash size={12} className="text-cyan-300/80" strokeWidth={2.5} />
                  <code className="text-[11px] font-mono font-bold text-cyan-200">
                    {d.id}
                  </code>
                </div>

                <h3 className="challenge-text mb-3 text-sm leading-snug">
                  {d.enunciado}
                </h3>

                {/* Opciones — light chips w/ dark text (inverse contrast on dark board) */}
                <div className="mb-3 space-y-1.5">
                  {d.opciones.map((op) => {
                    const esCorrecta = op === d.respuesta_correcta;
                    return (
                      <div
                        key={op}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                          esCorrecta
                            ? "challenge-chip challenge-chip-correct"
                            : "challenge-chip"
                        }`}
                      >
                        {esCorrecta ? (
                          <CheckCircle2 size={13} className="shrink-0 text-emerald-600" strokeWidth={2.5} />
                        ) : (
                          <span className="h-[13px] w-[13px] shrink-0 rounded-full border-2 border-slate-400" />
                        )}
                        <span className="truncate">{op}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Pista */}
                <div className="mb-3 flex items-start gap-1.5 rounded-lg bg-amber-100 px-2.5 py-1.5 ring-1 ring-amber-300">
                  <Lightbulb size={13} className="mt-0.5 shrink-0 text-amber-700" strokeWidth={2.5} />
                  <p className="text-[11px] font-semibold leading-snug text-amber-900">
                    {d.pista_retroalimentacion}
                  </p>
                </div>

                {/* Acciones: copiar / expandir código */}
                <div className="mt-auto flex items-center gap-1.5">
                  <button
                    onClick={() => copiarAlPortapapeles(codigo, `${d.id} (${formatoCopia.toUpperCase()})`)}
                    className="btn-3d flex flex-1 items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-600 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:scale-105"
                  >
                    <Copy size={12} strokeWidth={2.5} /> Copiar {formatoCopia.toUpperCase()}
                  </button>
                  <button
                    onClick={() => setDesafioExpandido(expandido ? null : d.id)}
                    className="rounded-lg bg-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 transition-all hover:bg-slate-300"
                    aria-expanded={expandido}
                    aria-label="Ver código"
                  >
                    {"</>"}
                  </button>
                </div>

                {/* Código expandible */}
                {expandido && (
                  <pre className="mt-2 max-h-56 overflow-y-auto rounded-lg bg-stone-900 p-2.5 text-[10px] leading-relaxed text-stone-100">
                    <code className="font-mono whitespace-pre-wrap break-all">
                      {codigo}
                    </code>
                  </pre>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Pie con leyenda de paleta curricular */}
      <div className="challenge-board-sm mt-6 rounded-3xl p-5">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-cyan-300" strokeWidth={2.5} />
          <h2 className="challenge-text text-sm">
            Mapa curricular del banco
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-cyan-50 p-3 ring-1 ring-cyan-200">
            <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-black text-cyan-800">
              <Calculator size={13} strokeWidth={2.5} /> Matemáticas (15)
            </h3>
            <ul className="space-y-1 text-[11px] font-semibold text-cyan-700">
              <li>🌱 Fácil: sumas/restas 3 dígitos sin llevar + figuras (vértices y lados)</li>
              <li>⚡ Medio: multiplicaciones 1 cifra (tablas 2-9) + fracciones simples visuales</li>
              <li>🔥 Difícil: divisiones exactas + sucesiones lógicas + problemas de 2 pasos</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-orange-50 p-3 ring-1 ring-orange-200">
            <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-black text-orange-800">
              <PenLine size={13} strokeWidth={2.5} /> Lengua y Literatura (15)
            </h3>
            <ul className="space-y-1 text-[11px] font-semibold text-orange-700">
              <li>🌱 Fácil: sinónimos y antónimos sencillos + separación en sílabas</li>
              <li>⚡ Medio: sustantivos propios/comunes + verbos + uso de b/v, c/s/z</li>
              <li>🔥 Difícil: comprensión lectora (idea principal) + sujeto y predicado</li>
            </ul>
          </div>
        </div>
        <p className="label-on-dark mt-3 text-[11px]">
          💡 Tip: usa <strong className="challenge-text-gold">Descargar JSON</strong> para llevar el banco directo a Android Studio, o
          <strong className="challenge-text-gold"> Copiar todo (Kotlin)</strong> para pegarlo como <code className="rounded bg-white/10 px-1 text-cyan-200">val BANCO_DESAFIOS = listOf(...)</code>.
        </p>
      </div>
    </div>
  );
}

// ---- Subcomponentes ------------------------------------------------------

function StatCard({
  label,
  value,
  emoji,
  tone,
}: {
  label: string;
  value: number;
  emoji: string;
  tone: "violet" | "cyan" | "orange" | "emerald" | "amber" | "rose";
}) {
  const tones: Record<typeof tone, string> = {
    violet: "from-violet-100 to-fuchsia-100 text-violet-700 ring-violet-200",
    cyan: "from-cyan-100 to-sky-100 text-cyan-700 ring-cyan-200",
    orange: "from-orange-100 to-amber-100 text-orange-700 ring-orange-200",
    emerald: "from-emerald-100 to-teal-100 text-emerald-700 ring-emerald-200",
    amber: "from-amber-100 to-yellow-100 text-amber-700 ring-amber-200",
    rose: "from-rose-100 to-pink-100 text-rose-700 ring-rose-200",
  };
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl bg-gradient-to-br ${tones[tone]} px-3 py-2 ring-1`}
    >
      <span className="text-lg leading-none">{emoji}</span>
      <div className="min-w-0">
        <p className="text-lg font-black leading-none">{value}</p>
        <p className="truncate text-[10px] font-bold uppercase tracking-wide opacity-80">
          {label}
        </p>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="label-on-dark mb-1.5 text-[11px] uppercase tracking-wide">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
        active
          ? "bg-cyan-400 text-slate-900 shadow-[0_2px_0_#0e7490]"
          : "border border-cyan-300/30 bg-white/10 text-cyan-100 hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  );
}
