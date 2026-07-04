"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Layers,
  ListChecks,
  Plus,
  Trash2,
  Loader2,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { Asignatura, Desafio, Modulo, TipoDesafio } from "@/lib/types";

type Tab = "asignaturas" | "modulos" | "desafios";

const TIPOS: { value: TipoDesafio; label: string }[] = [
  { value: "SELECCION_MULTIPLE", label: "Selección múltiple" },
  { value: "COMPLETAR_TEXTO", label: "Completa el texto" },
  { value: "VERDADERO_FALSO", label: "Verdadero o falso" },
  { value: "ASOCIAR_PAREJAS", label: "Asocia la pareja" },
  { value: "ORDENAR_PALABRAS", label: "Ordena la oración" },
];

export function ContentManager() {
  const { usuario, setVista, mostrarToast } = useApp();
  const [tab, setTab] = useState<Tab>("asignaturas");

  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [asignaturaSel, setAsignaturaSel] = useState<string | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [moduloSel, setModuloSel] = useState<string | null>(null);
  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargarAsignaturas = async () => {
    if (!usuario) return;
    setCargando(true);
    try {
      const data = await api.obtenerAsignaturasMaestro(usuario.id);
      setAsignaturas(data);
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al cargar asignaturas", "error");
    } finally {
      setCargando(false);
    }
  };

  const cargarModulos = async (asignaturaId: string) => {
    setCargando(true);
    try {
      const data = await api.obtenerModulos(asignaturaId);
      setModulos(data);
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al cargar módulos", "error");
    } finally {
      setCargando(false);
    }
  };

  const cargarDesafios = async (moduloId: string) => {
    setCargando(true);
    try {
      const data = await api.obtenerDesafios(moduloId);
      setDesafios(data);
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al cargar desafíos", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAsignaturas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id]);

  useEffect(() => {
    if (asignaturaSel) cargarModulos(asignaturaSel);
    else setModulos([]);
  }, [asignaturaSel]);

  useEffect(() => {
    if (moduloSel) cargarDesafios(moduloSel);
    else setDesafios([]);
  }, [moduloSel]);

  if (!usuario) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "asignaturas", label: "Asignaturas", icon: <BookOpen size={15} strokeWidth={2.5} /> },
    { id: "modulos", label: "Módulos", icon: <Layers size={15} strokeWidth={2.5} /> },
    { id: "desafios", label: "Desafíos", icon: <ListChecks size={15} strokeWidth={2.5} /> },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <button
        onClick={() => setVista("dashboard")}
        className="mb-4 inline-flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-2 text-sm font-bold text-stone-700 transition-all hover:scale-105 hover:bg-white"
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> Volver
      </button>

      <div className="card-premium animate-bounce-in mb-5 rounded-3xl p-5">
        <h1 className="text-2xl font-black text-stone-800">Gestión de contenido</h1>
        <p className="text-sm font-semibold text-stone-600">
          Crea asignaturas, módulos y desafíos para tus estudiantes.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const activo = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-bold transition-all hover:scale-105 ${
                activo
                  ? "bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white shadow-md"
                  : "bg-white/70 text-stone-700 hover:bg-white"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>

      {cargando && (
        <div className="mb-4 flex items-center justify-center py-4">
          <Loader2 className="h-7 w-7 animate-spin text-fuchsia-500" />
        </div>
      )}

      {tab === "asignaturas" && (
        <AsignaturasTab
          asignaturas={asignaturas}
          usuarioId={usuario.id}
          onChange={cargarAsignaturas}
          onSeleccionar={(id) => {
            setAsignaturaSel(id);
            setTab("modulos");
          }}
          mostrarToast={mostrarToast}
        />
      )}

      {tab === "modulos" && (
        <ModulosTab
          asignaturas={asignaturas}
          asignaturaSel={asignaturaSel}
          setAsignaturaSel={setAsignaturaSel}
          modulos={modulos}
          onChange={() => asignaturaSel && cargarModulos(asignaturaSel)}
          onSeleccionar={(id) => {
            setModuloSel(id);
            setTab("desafios");
          }}
          mostrarToast={mostrarToast}
        />
      )}

      {tab === "desafios" && (
        <DesafiosTab
          asignaturas={asignaturas}
          asignaturaSel={asignaturaSel}
          setAsignaturaSel={(id) => {
            setAsignaturaSel(id);
            setModuloSel(null);
          }}
          modulos={modulos}
          moduloSel={moduloSel}
          setModuloSel={setModuloSel}
          desafios={desafios}
          onChange={() => moduloSel && cargarDesafios(moduloSel)}
          mostrarToast={mostrarToast}
        />
      )}
    </div>
  );
}

/* -------------------------- Asignaturas Tab -------------------------- */

function AsignaturasTab({
  asignaturas,
  usuarioId,
  onChange,
  onSeleccionar,
  mostrarToast,
}: {
  asignaturas: Asignatura[];
  usuarioId: string;
  onChange: () => void;
  onSeleccionar: (id: string) => void;
  mostrarToast: (m: string, t?: "exito" | "error" | "info") => void;
}) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      mostrarToast("Escribe un nombre", "error");
      return;
    }
    setGuardando(true);
    try {
      await api.crearAsignatura(nombre.trim(), descripcion.trim() || null, usuarioId);
      mostrarToast("¡Asignatura creada!", "exito");
      setNombre("");
      setDescripcion("");
      onChange();
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al crear asignatura", "error");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar esta asignatura? Se borrarán sus módulos y desafíos.")) return;
    try {
      await api.eliminarAsignatura(id);
      mostrarToast("Asignatura eliminada", "info");
      onChange();
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al eliminar", "error");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
      <form onSubmit={crear} className="card-premium rounded-3xl p-5">
        <div className="mb-3 flex items-center gap-2">
          <Plus size={16} className="text-fuchsia-500" strokeWidth={2.5} />
          <h2 className="text-base font-black text-stone-800">Nueva asignatura</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-bold text-stone-600">Nombre *</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Matemáticas"
              maxLength={80}
              className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 outline-none transition-all placeholder:font-medium placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-stone-600">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Breve descripción de la asignatura"
              rows={3}
              maxLength={240}
              className="w-full resize-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 outline-none transition-all placeholder:font-medium placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <button
            type="submit"
            disabled={guardando}
            className="btn-3d flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] disabled:opacity-60"
          >
            {guardando ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} strokeWidth={2.5} />}
            Crear asignatura
          </button>
        </div>
      </form>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-orange-500" strokeWidth={2.5} />
          <h2 className="text-base font-black text-stone-800">
            Asignaturas creadas
          </h2>
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
            {asignaturas.length}
          </span>
        </div>
        {asignaturas.length === 0 ? (
          <div className="card-premium rounded-3xl p-6 text-center">
            <BookOpen size={32} className="mx-auto mb-2 text-orange-300" />
            <p className="text-sm font-bold text-stone-600">Aún no has creado asignaturas.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {asignaturas.map((a, i) => (
              <div
                key={a.id}
                className="card-premium animate-pop flex items-center gap-3 rounded-2xl p-3.5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-rose-500 text-sm font-black text-white">
                  {a.nombre?.charAt(0)?.toUpperCase() ?? "📚"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-black text-stone-800">{a.nombre}</p>
                  {a.descripcion && (
                    <p className="truncate text-xs font-medium text-stone-500">{a.descripcion}</p>
                  )}
                  <span className="mt-0.5 inline-block rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">
                    {a._count?.modulos ?? 0} módulos
                  </span>
                </div>
                <button
                  onClick={() => onSeleccionar(a.id)}
                  className="btn-3d rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                >
                  Módulos
                </button>
                <button
                  onClick={() => eliminar(a.id)}
                  className="rounded-xl border-2 border-rose-200 bg-white p-2 text-rose-500 transition-all hover:scale-105 hover:bg-rose-50"
                  aria-label="Eliminar"
                >
                  <Trash2 size={14} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------- Módulos Tab -------------------------- */

function ModulosTab({
  asignaturas,
  asignaturaSel,
  setAsignaturaSel,
  modulos,
  onChange,
  onSeleccionar,
  mostrarToast,
}: {
  asignaturas: Asignatura[];
  asignaturaSel: string | null;
  setAsignaturaSel: (id: string | null) => void;
  modulos: Modulo[];
  onChange: () => void;
  onSeleccionar: (id: string) => void;
  mostrarToast: (m: string, t?: "exito" | "error" | "info") => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [nivelMinimo, setNivelMinimo] = useState(1);
  const [guardando, setGuardando] = useState(false);

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asignaturaSel) {
      mostrarToast("Selecciona una asignatura", "error");
      return;
    }
    if (!titulo.trim()) {
      mostrarToast("Escribe un título para el módulo", "error");
      return;
    }
    setGuardando(true);
    try {
      await api.crearModulo(asignaturaSel, titulo.trim(), nivelMinimo);
      mostrarToast("¡Módulo creado!", "exito");
      setTitulo("");
      setNivelMinimo(1);
      onChange();
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al crear módulo", "error");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar este módulo y sus desafíos?")) return;
    try {
      await api.eliminarModulo(id);
      mostrarToast("Módulo eliminado", "info");
      onChange();
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al eliminar", "error");
    }
  };

  return (
    <div>
      {/* Selector de asignatura */}
      <div className="card-premium mb-4 rounded-3xl p-4">
        <label className="mb-2 block text-xs font-bold text-stone-600">
          Asignatura
        </label>
        <div className="relative">
          <select
            value={asignaturaSel ?? ""}
            onChange={(e) => setAsignaturaSel(e.target.value || null)}
            className="w-full appearance-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 pr-10 text-sm font-bold text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          >
            <option value="">— Selecciona una asignatura —</option>
            {asignaturas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
        </div>
      </div>

      {!asignaturaSel ? (
        <div className="card-premium rounded-3xl p-8 text-center">
          <Layers size={32} className="mx-auto mb-2 text-orange-300" />
          <p className="text-sm font-bold text-stone-600">
            Selecciona una asignatura para gestionar sus módulos.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <form onSubmit={crear} className="card-premium rounded-3xl p-5">
            <div className="mb-3 flex items-center gap-2">
              <Plus size={16} className="text-fuchsia-500" strokeWidth={2.5} />
              <h2 className="text-base font-black text-stone-800">Nuevo módulo</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-stone-600">Título *</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Sumas básicas"
                  maxLength={80}
                  className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 outline-none transition-all placeholder:font-medium placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-stone-600">
                  Nivel mínimo requerido
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={nivelMinimo}
                  onChange={(e) => setNivelMinimo(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <button
                type="submit"
                disabled={guardando}
                className="btn-3d flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] disabled:opacity-60"
              >
                {guardando ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} strokeWidth={2.5} />}
                Crear módulo
              </button>
            </div>
          </form>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Layers size={16} className="text-orange-500" strokeWidth={2.5} />
              <h2 className="text-base font-black text-stone-800">Módulos</h2>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                {modulos.length}
              </span>
            </div>
            {modulos.length === 0 ? (
              <div className="card-premium rounded-3xl p-6 text-center">
                <Layers size={32} className="mx-auto mb-2 text-orange-300" />
                <p className="text-sm font-bold text-stone-600">Aún no hay módulos en esta asignatura.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {modulos.map((m, i) => (
                  <div
                    key={m.id}
                    className="card-premium animate-pop flex items-center gap-3 rounded-2xl p-3.5"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-black text-white">
                      {m.orden || i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-black text-stone-800">{m.titulo}</p>
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          Nivel {m.nivelMinimo}
                        </span>
                        <span className="rounded-full bg-fuchsia-100 px-1.5 py-0.5 text-[10px] font-bold text-fuchsia-700">
                          {m._count?.desafios ?? 0} desafíos
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onSeleccionar(m.id)}
                      className="btn-3d rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-3 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                    >
                      Desafíos
                    </button>
                    <button
                      onClick={() => eliminar(m.id)}
                      className="rounded-xl border-2 border-rose-200 bg-white p-2 text-rose-500 transition-all hover:scale-105 hover:bg-rose-50"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------- Desafíos Tab -------------------------- */

function DesafiosTab({
  asignaturas,
  asignaturaSel,
  setAsignaturaSel,
  modulos,
  moduloSel,
  setModuloSel,
  desafios,
  onChange,
  mostrarToast,
}: {
  asignaturas: Asignatura[];
  asignaturaSel: string | null;
  setAsignaturaSel: (id: string | null) => void;
  modulos: Modulo[];
  moduloSel: string | null;
  setModuloSel: (id: string | null) => void;
  desafios: Desafio[];
  onChange: () => void;
  mostrarToast: (m: string, t?: "exito" | "error" | "info") => void;
}) {
  const [pregunta, setPregunta] = useState("");
  const [tipo, setTipo] = useState<TipoDesafio>("SELECCION_MULTIPLE");
  const [puntos, setPuntos] = useState(10);
  const [opciones, setOpciones] = useState<{ texto: string; esCorrecta: boolean }[]>([
    { texto: "", esCorrecta: true },
    { texto: "", esCorrecta: false },
  ]);
  const [guardando, setGuardando] = useState(false);

  const resetForm = () => {
    setPregunta("");
    setTipo("SELECCION_MULTIPLE");
    setPuntos(10);
    setOpciones([
      { texto: "", esCorrecta: true },
      { texto: "", esCorrecta: false },
    ]);
  };

  const actualizarOpcion = (idx: number, campo: "texto" | "esCorrecta", valor: string | boolean) => {
    setOpciones((prev) =>
      prev.map((o, i) => {
        if (i !== idx) return o;
        // Si marcamos una como correcta, las demás se vuelven incorrectas (solo 1 correcta)
        if (campo === "esCorrecta" && valor === true) {
          return { ...o, esCorrecta: true };
        }
        return { ...o, [campo]: valor };
      }),
    );
    // Asegurar única correcta
    if (campo === "esCorrecta" && valor === true) {
      setOpciones((prev) => prev.map((o, i) => (i === idx ? o : { ...o, esCorrecta: false })));
    }
  };

  const agregarOpcion = () => {
    setOpciones((prev) => [...prev, { texto: "", esCorrecta: false }]);
  };

  const quitarOpcion = (idx: number) => {
    setOpciones((prev) => prev.filter((_, i) => i !== idx));
  };

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduloSel) {
      mostrarToast("Selecciona un módulo", "error");
      return;
    }
    if (!pregunta.trim()) {
      mostrarToast("Escribe la pregunta", "error");
      return;
    }
    const opsValidas = opciones.filter((o) => o.texto.trim().length > 0);
    if (opsValidas.length < 2) {
      mostrarToast("Agrega al menos 2 opciones con texto", "error");
      return;
    }
    const correctas = opsValidas.filter((o) => o.esCorrecta).length;
    if (correctas !== 1) {
      mostrarToast("Debe haber exactamente 1 opción correcta", "error");
      return;
    }
    setGuardando(true);
    try {
      await api.crearDesafio({
        moduloId: moduloSel,
        tipo,
        pregunta: pregunta.trim(),
        puntos,
        opciones: opsValidas.map((o) => ({ texto: o.texto.trim(), esCorrecta: o.esCorrecta })),
      });
      mostrarToast("¡Desafío creado!", "exito");
      resetForm();
      onChange();
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al crear desafío", "error");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar este desafío?")) return;
    try {
      await api.eliminarDesafio(id);
      mostrarToast("Desafío eliminado", "info");
      onChange();
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al eliminar", "error");
    }
  };

  return (
    <div>
      {/* Selectores */}
      <div className="card-premium mb-4 rounded-3xl p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-stone-600">Asignatura</label>
            <div className="relative">
              <select
                value={asignaturaSel ?? ""}
                onChange={(e) => {
                  setAsignaturaSel(e.target.value || null);
                  setModuloSel(null);
                }}
                className="w-full appearance-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 pr-10 text-sm font-bold text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              >
                <option value="">— Selecciona —</option>
                {asignaturas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-stone-600">Módulo</label>
            <div className="relative">
              <select
                value={moduloSel ?? ""}
                onChange={(e) => setModuloSel(e.target.value || null)}
                disabled={!asignaturaSel}
                className="w-full appearance-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 pr-10 text-sm font-bold text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 disabled:opacity-50"
              >
                <option value="">— Selecciona —</option>
                {modulos.map((m, i) => (
                  <option key={m.id} value={m.id}>
                    {m.titulo} (Nivel {m.nivelMinimo}) · {m._count?.desafios ?? 0} desafíos
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
            </div>
          </div>
        </div>
      </div>

      {!moduloSel ? (
        <div className="card-premium rounded-3xl p-8 text-center">
          <ListChecks size={32} className="mx-auto mb-2 text-orange-300" />
          <p className="text-sm font-bold text-stone-600">
            Selecciona una asignatura y un módulo para gestionar sus desafíos.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          {/* Form crear */}
          <form onSubmit={crear} className="card-premium rounded-3xl p-5">
            <div className="mb-3 flex items-center gap-2">
              <Plus size={16} className="text-fuchsia-500" strokeWidth={2.5} />
              <h2 className="text-base font-black text-stone-800">Nuevo desafío</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-stone-600">Tipo</label>
                <div className="relative">
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as TipoDesafio)}
                    className="w-full appearance-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 pr-10 text-sm font-bold text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                  >
                    {TIPOS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-stone-600">Pregunta *</label>
                <textarea
                  value={pregunta}
                  onChange={(e) => setPregunta(e.target.value)}
                  placeholder="Escribe la pregunta"
                  rows={2}
                  maxLength={280}
                  className="w-full resize-none rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 outline-none transition-all placeholder:font-medium placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-stone-600">Puntos</label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={puntos}
                  onChange={(e) => setPuntos(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full rounded-2xl border-2 border-orange-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-600">
                    Opciones (marca 1 correcta)
                  </label>
                  <button
                    type="button"
                    onClick={agregarOpcion}
                    className="flex items-center gap-1 rounded-lg bg-orange-100 px-2 py-1 text-[11px] font-bold text-orange-700 transition-all hover:scale-105"
                  >
                    <Plus size={11} strokeWidth={2.5} /> Añadir
                  </button>
                </div>
                <div className="space-y-2">
                  {opciones.map((op, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => actualizarOpcion(i, "esCorrecta", true)}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                          op.esCorrecta
                            ? "bg-emerald-500 text-white shadow-md"
                            : "border-2 border-orange-200 bg-white text-stone-400 hover:border-emerald-300"
                        }`}
                        aria-label="Marcar como correcta"
                      >
                        {op.esCorrecta ? <Check size={14} strokeWidth={3} /> : String.fromCharCode(65 + i)}
                      </button>
                      <input
                        type="text"
                        value={op.texto}
                        onChange={(e) => actualizarOpcion(i, "texto", e.target.value)}
                        placeholder={`Opción ${String.fromCharCode(65 + i)}`}
                        maxLength={120}
                        className="flex-1 rounded-xl border-2 border-orange-200 bg-white px-3 py-2 text-sm font-medium text-stone-800 outline-none transition-all placeholder:font-medium placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                      />
                      {opciones.length > 2 && (
                        <button
                          type="button"
                          onClick={() => quitarOpcion(i)}
                          className="rounded-xl border-2 border-rose-200 bg-white p-2 text-rose-500 transition-all hover:scale-105 hover:bg-rose-50"
                          aria-label="Quitar opción"
                        >
                          <X size={12} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-[11px] font-medium text-stone-500">
                  Debe haber exactamente 1 opción marcada como correcta.
                </p>
              </div>
              <button
                type="submit"
                disabled={guardando}
                className="btn-3d flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-rose-500 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] disabled:opacity-60"
              >
                {guardando ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} strokeWidth={2.5} />}
                Crear desafío
              </button>
            </div>
          </form>

          {/* Lista desafíos */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ListChecks size={16} className="text-orange-500" strokeWidth={2.5} />
              <h2 className="text-base font-black text-stone-800">Desafíos del módulo</h2>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                {desafios.length}
              </span>
            </div>
            {desafios.length === 0 ? (
              <div className="card-premium rounded-3xl p-6 text-center">
                <ListChecks size={32} className="mx-auto mb-2 text-orange-300" />
                <p className="text-sm font-bold text-stone-600">
                  Aún no hay desafíos en este módulo.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {desafios.map((d, i) => (
                  <div
                    key={d.id}
                    className="card-premium animate-pop rounded-2xl p-3.5"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] font-bold text-fuchsia-700">
                            {TIPOS.find((t) => t.value === d.tipo)?.label ?? d.tipo}
                          </span>
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            {d.puntos} pts
                          </span>
                          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                            {d.opciones.length} opciones
                          </span>
                        </div>
                        <p className="text-sm font-bold text-stone-800 line-clamp-2">{d.pregunta}</p>
                      </div>
                      <button
                        onClick={() => eliminar(d.id)}
                        className="shrink-0 rounded-xl border-2 border-rose-200 bg-white p-2 text-rose-500 transition-all hover:scale-105 hover:bg-rose-50"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
