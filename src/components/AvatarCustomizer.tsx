"use client";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  ArrowLeft, Lock, Check, Sparkles, Loader2, Wrench,
  ChevronLeft, ChevronRight, Boxes, Crown, Star, Zap, Shield,
} from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { CategoriaAvatar, ItemTienda, MiAvatarResponse } from "@/lib/types";
import { AvatarSVG } from "@/components/AvatarSVG";
import { RunicCoin } from "@/components/RunicCoin";
import { EssenceCrystal } from "@/components/EssenceCrystal";
import { CategoryIcon, KitsIcon, CATEGORIAS_ORDER, CATEGORIA_LABEL } from "@/components/CategoryIcon";

// ===== Sistema de rareza con bordes neón =====
const RAREZA_CONFIG: Record<string, {
  label: string;
  ring: string;
  border: string;
  glow: string;
  badge: string;
  icon: typeof Crown;
}> = {
  COMUN: {
    label: "Comun",
    ring: "ring-1 ring-stone-300",
    border: "border-stone-300",
    glow: "",
    badge: "bg-stone-200 text-stone-700",
    icon: Check,
  },
  RARA: {
    label: "Raro",
    ring: "ring-2 ring-cyan-400",
    border: "border-cyan-400",
    glow: "shadow-[0_0_12px_rgba(34,211,238,0.5)]",
    badge: "bg-cyan-500 text-white",
    icon: Zap,
  },
  EPICA: {
    label: "Epico",
    ring: "ring-2 ring-fuchsia-500",
    border: "border-fuchsia-500",
    glow: "shadow-[0_0_14px_rgba(217,70,239,0.55)]",
    badge: "bg-fuchsia-600 text-white",
    icon: Star,
  },
  LEGENDARIA: {
    label: "Legendario",
    ring: "ring-2 ring-amber-400",
    border: "border-amber-400",
    glow: "shadow-[0_0_16px_rgba(251,191,36,0.6)]",
    badge: "bg-gradient-to-r from-amber-500 to-orange-600 text-white",
    icon: Crown,
  },
};

const RAREZAS_ORDER = ["COMUN", "RARA", "EPICA", "LEGENDARIA"] as const;
const RAREZA_LABEL: Record<string, string> = {
  COMUN: "Comun", RARA: "Raro", EPICA: "Epico", LEGENDARIA: "Legendario",
};

interface PersonajePreset {
  id: string;
  nombre: string;
  icon: typeof Boxes;
  desc: string;
  config: {
    CUERPO: string; OJOS: string; BOCA: string;
    CABELLO: string; ROPA: string; ACCESORIO: string;
  };
}

// Kits de personajes estilo Roblox: skins de cuerpo completo
const PERSONAJES: PersonajePreset[] = [
  {
    id: "novato",
    nombre: "Novato",
    icon: Boxes,
    desc: "Skin inicial, gratis",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-normales", BOCA: "boca-sonrisa", CABELLO: "cabello-nada", ROPA: "ropa-basica", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "sonador",
    nombre: "Soñador",
    icon: Sparkles,
    desc: "Relajado con capucha",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-cerrados", BOCA: "boca-sonrisa", CABELLO: "cabello-corto", ROPA: "ropa-capucha", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "robot",
    nombre: "Alien Bloque",
    icon: Boxes,
    desc: "Verde del espacio",
    config: { CUERPO: "cuerpo-verde", OJOS: "ojos-grandes", BOCA: "boca-serio", CABELLO: "cabello-nada", ROPA: "ropa-basica", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "artista",
    nombre: "Artista",
    icon: Sparkles,
    desc: "Creativo y feliz",
    config: { CUERPO: "cuerpo-medio", OJOS: "ojos-felices", BOCA: "boca-gran-sonrisa", CABELLO: "cabello-largo", ROPA: "ropa-basica", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "cadete",
    nombre: "Cadete Espacial",
    icon: Shield,
    desc: "Uniforme de mision",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-serio", CABELLO: "cabello-corto", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "pop",
    nombre: "Estrella Pop",
    icon: Star,
    desc: "Travieso con estrella",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-felices", BOCA: "boca-lengua", CABELLO: "cabello-corto", ROPA: "ropa-basica", ACCESORIO: "accesorio-estrella" },
  },
  {
    id: "intellect",
    nombre: "Genio",
    icon: Boxes,
    desc: "Con gafas intelectuales",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-sonrisa", CABELLO: "cabello-corto", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-gafas" },
  },
  {
    id: "heroe",
    nombre: "Superheroe",
    icon: Shield,
    desc: "Capa y mascara",
    config: { CUERPO: "cuerpo-oscuro", OJOS: "ojos-normales", BOCA: "boca-serio", CABELLO: "cabello-nada", ROPA: "ropa-capas", ACCESORIO: "accesorio-mascara" },
  },
];

export function AvatarCustomizer() {
  const { usuario, setVista, mostrarToast, setUsuario } = useApp();
  const [data, setData] = useState<MiAvatarResponse | null>(null);
  const [tienda, setTienda] = useState<ItemTienda[]>([]);
  const [cargando, setCargando] = useState(true);
  const [catActiva, setCatActiva] = useState<CategoriaAvatar | "KITS">("KITS");
  const [rarezaFiltro, setRarezaFiltro] = useState<string>("TODAS");
  const [accionando, setAccionando] = useState<string | null>(null);
  const [aplicandoPersonaje, setAplicandoPersonaje] = useState(false);

  // ===== MODO DEMO: bandera isDemo =====
  const isDemo = usuario?.nombre === "DemoKid" || usuario?.nombre === "PadreDemo" || usuario?.nombre === "MaestroDemo";

  // ===== Scroll horizontal con flechas para Personajes rápidos =====
  const personajesScrollRef = useRef<HTMLDivElement>(null);
  const [puedeIzq, setPuedeIzq] = useState(false);
  const [puedeDer, setPuedeDer] = useState(false);

  const verificarScrollPersonajes = useCallback(() => {
    const el = personajesScrollRef.current;
    if (!el) return;
    setPuedeIzq(el.scrollLeft > 4);
    setPuedeDer(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const desplazarPersonajes = (dir: 1 | -1) => {
    const el = personajesScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  useEffect(() => {
    if (cargando) return;
    const el = personajesScrollRef.current;
    if (!el) return;
    verificarScrollPersonajes();
    const rafId = requestAnimationFrame(verificarScrollPersonajes);
    el.addEventListener("scroll", verificarScrollPersonajes, { passive: true });
    window.addEventListener("resize", verificarScrollPersonajes);
    const resizeObserver = new ResizeObserver(() => verificarScrollPersonajes());
    resizeObserver.observe(el);
    const timeoutId = setTimeout(verificarScrollPersonajes, 400);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      el.removeEventListener("scroll", verificarScrollPersonajes);
      window.removeEventListener("resize", verificarScrollPersonajes);
      resizeObserver.disconnect();
    };
  }, [verificarScrollPersonajes, cargando]);

  // Aplica un personaje completo (kits): en modo demo, sin costo ni restricciones
  const aplicarPersonaje = async (p: PersonajePreset) => {
    if (!usuario || !data) return;
    setAplicandoPersonaje(true);
    // Preview optimista: aplica el look completo al instante en la cápsula
    const configOptimista = { ...data.config, ...p.config };
    setData((prev) => (prev ? { ...prev, config: configOptimista } : prev));
    try {
      let configActual = configOptimista;
      let monedasActual = data.monedas;
      let gemasActual = data.gemas;
      let ownedActual = [...data.itemsOwned];
      let faltaron = 0;
      let equipados = 0;
      for (const [cat, clave] of Object.entries(p.config)) {
        const item = tienda.find((it) => it.categoria === cat && it.clave === clave);
        if (!item) { faltaron++; continue; }
        const yaPosee = ownedActual.includes(item.id);
        const esGratis = item.precioMonedas === 0 && item.precioGemas === 0;
        if (!esGratis && !yaPosee) {
          if (!isDemo) {
            const nivelOk = (data.nivel) >= item.nivelRequerido;
            const fondosOk = item.precioGemas > 0 ? gemasActual >= item.precioGemas : monedasActual >= item.precioMonedas;
            if (!nivelOk || !fondosOk) { faltaron++; continue; }
          }
          try {
            const res = await api.comprar(usuario.id, item.id);
            monedasActual = res.monedas;
            gemasActual = res.gemas;
            ownedActual = [...ownedActual, item.id];
          } catch {
            faltaron++; continue;
          }
        }
        try {
          const res = await api.equipar(usuario.id, item.id);
          configActual = res.config;
          equipados++;
        } catch {
          faltaron++;
        }
      }
      setData((prev) => (prev ? { ...prev, config: configActual, monedas: monedasActual, gemas: gemasActual, itemsOwned: ownedActual } : prev));
      setUsuario({ ...usuario, monedas: monedasActual, gemas: gemasActual });
      if (faltaron === 0) {
        mostrarToast(`${p.nombre} aplicado · ${equipados} piezas equipadas`, "exito");
      } else if (equipados > 0) {
        mostrarToast(`${p.nombre} parcial · ${equipados} piezas, ${faltaron} bloqueadas`, "info");
      } else {
        mostrarToast(`No se pudo aplicar ${p.nombre}`, "error");
      }
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al aplicar el personaje", "error");
      await cargar();
    } finally {
      setAplicandoPersonaje(false);
    }
  };

  const cargar = async () => {
    if (!usuario) return;
    try {
      const [mi, tiendaData] = await Promise.all([api.obtenerMiAvatar(usuario.id), api.obtenerTienda()]);
      setData(mi); setTienda(tiendaData);
    } catch (err) { mostrarToast(err instanceof Error ? err.message : "Error al cargar el avatar", "error"); }
    finally { setCargando(false); }
  };
  useEffect(() => { cargar(); /* eslint-disable-next-line */ }, [usuario?.id]);

  const itemsCat = useMemo(() => {
    let items = tienda.filter((i) => i.categoria === catActiva);
    if (rarezaFiltro !== "TODAS") items = items.filter((i) => i.raridad === rarezaFiltro);
    return items;
  }, [tienda, catActiva, rarezaFiltro]);

  const estaEquipado = (item: ItemTienda): boolean => {
    if (!data) return false;
    const campo = item.categoria.toLowerCase() as keyof typeof data.config;
    return data.config[campo] === item.clave;
  };
  const esPropio = (item: ItemTienda): boolean => data?.itemsOwned.includes(item.id) ?? false;
  const esGratis = (item: ItemTienda): boolean => item.precioMonedas === 0 && item.precioGemas === 0;
  const puedeComprar = (item: ItemTienda): boolean => {
    if (!data) return false;
    if (data.nivel < item.nivelRequerido) return false;
    if (item.precioGemas > 0) return data.gemas >= item.precioGemas;
    return data.monedas >= item.precioMonedas;
  };

  const handleComprar = async (item: ItemTienda) => {
    if (!usuario) return;
    setAccionando(item.id);
    try {
      const res = await api.comprar(usuario.id, item.id);
      setData((prev) => prev ? { ...prev, monedas: res.monedas, gemas: res.gemas, itemsOwned: [...prev.itemsOwned, item.id] } : prev);
      setUsuario({ ...usuario, monedas: res.monedas, gemas: res.gemas });
      mostrarToast(res.mensaje, "exito");
      await handleEquipar(item, true);
    } catch (err) { mostrarToast(err instanceof Error ? err.message : "Error al comprar", "error"); }
    finally { setAccionando(null); }
  };

  const handleEquipar = async (item: ItemTienda, silencioso = false) => {
    if (!usuario) return;
    if (!silencioso) setAccionando(item.id);
    try {
      const res = await api.equipar(usuario.id, item.id);
      setData((prev) => (prev ? { ...prev, config: res.config } : prev));
      if (!silencioso) mostrarToast(res.mensaje, "exito");
    } catch (err) { if (!silencioso) mostrarToast(err instanceof Error ? err.message : "Error al equipar", "error"); }
    finally { if (!silencioso) setAccionando(null); }
  };

  // En modo demo: equipar directamente sin comprar (el backend permite la equipación)
  const handleEquiparDemo = async (item: ItemTienda) => {
    if (!usuario) return;
    setAccionando(item.id);
    // Preview optimista: actualiza el Protagonista al instante
    setData((prev) => prev ? { ...prev, config: { ...prev.config, [item.categoria.toLowerCase()]: item.clave } } : prev);
    try {
      // Intentar comprar (gratis en demo) y luego equipar
      if (!esPropio(item) && !esGratis(item)) {
        try { await api.comprar(usuario.id, item.id); } catch { /* en demo, ignorar errores de compra */ }
      }
      const res = await api.equipar(usuario.id, item.id);
      setData((prev) => (prev ? { ...prev, config: res.config } : prev));
      mostrarToast(`${item.nombre} equipado`, "exito");
    } catch (err) {
      mostrarToast(err instanceof Error ? err.message : "Error al equipar", "error");
      await cargar();
    } finally { setAccionando(null); }
  };

  if (cargando) return (
    <div className="flex min-h-[70vh] items-center justify-center bg-stone-100">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg ring-2 ring-cyan-200">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-stone-200 text-stone-800">
      {/* ===== Decoración de fondo: cuadrícula isométrica ===== */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 left-[10%] h-72 w-72 rounded-full bg-cyan-300/30 blur-[90px]" />
        <div className="absolute bottom-0 right-[10%] h-72 w-72 rounded-full bg-orange-300/25 blur-[90px]" />
        <div className="absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-300/20 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* ===== Header ===== */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setVista("dashboard")}
            className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-stone-600 shadow-md ring-1 ring-stone-200 transition-all hover:text-cyan-600 hover:ring-cyan-300"
          >
            <ArrowLeft size={16} strokeWidth={2.5} /> Volver
          </button>
          <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-stone-800">
            <Wrench size={22} className="text-cyan-600" strokeWidth={2.5} />
            Estudio Avatar 3D
          </h1>
        </div>

        {/* ===== Banner Modo Demo ===== */}
        {isDemo && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 px-4 py-3 shadow-lg shadow-emerald-200/50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
              <Check size={20} strokeWidth={3} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-emerald-800">DEMO ACTIVO · Acceso total al catalogo</p>
              <p className="text-xs font-semibold text-emerald-700">Equipa cualquier skin, traje o accesorio al instante, sin costo de monedas ni gemas</p>
            </div>
            <span className="hidden rounded-full bg-emerald-500 px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow sm:inline">DEMO</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* ===== IZQUIERDA: Cápsula central con Protagonista ===== */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl bg-white p-6 text-center shadow-xl ring-1 ring-stone-200">
              {/* Etiqueta de cápsula activa */}
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">Capsula activa</p>
              </div>
              <p className="mb-1 text-2xl font-black text-stone-800">{usuario?.nombre}</p>
              <p className="mb-4 text-xs font-semibold text-stone-500">Protagonista 3D · Bloque Humanoide</p>

              {/* ===== Cápsula cilíndrica de cristal con podio ===== */}
              <div className="relative mx-auto mb-4 flex h-96 w-72 items-end justify-center">
                {/* Glow del podio (haz de luz ascendente) */}
                <div className="absolute bottom-0 left-1/2 h-80 w-56 -translate-x-1/2 rounded-full bg-cyan-300/40 blur-[50px] animate-pulse" />

                {/* Cúpula de cristal cilíndrica */}
                <div className="absolute inset-x-0 bottom-16 top-0 overflow-hidden rounded-t-[10rem] rounded-b-[2.5rem] border-2 border-cyan-200/60 bg-gradient-to-b from-cyan-50/40 via-white/20 to-cyan-100/30 backdrop-blur-sm">
                  {/* Brillo especular izquierdo */}
                  <div className="absolute left-4 top-8 h-3/4 w-6 rounded-full bg-white/40 blur-md" />
                  {/* Brillo especular derecho */}
                  <div className="absolute right-6 top-12 h-1/2 w-3 rounded-full bg-white/30 blur-sm" />
                  {/* Protagonista bloque 3D */}
                  <div className="flex h-full items-end justify-center pb-6">
                    <AvatarSVG config={data?.config} size={200} className="drop-shadow-2xl animate-[float_3s_ease-in-out_infinite]" />
                  </div>
                </div>

                {/* Podio iluminado (plataforma 3D) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  {/* Anillo de luz */}
                  <div className="absolute -top-1 left-1/2 h-6 w-56 -translate-x-1/2 rounded-full bg-cyan-400/60 blur-md animate-pulse" />
                  {/* Plataforma elíptica superior */}
                  <div className="relative h-6 w-60 rounded-[50%] bg-gradient-to-b from-cyan-200 via-cyan-300 to-cyan-500 shadow-[0_8px_24px_rgba(34,211,238,0.45)]" />
                  {/* Cuerpo del podio (trapecio) */}
                  <div className="mx-auto h-6 w-52 -mt-1 bg-gradient-to-b from-cyan-500 to-cyan-700" style={{ clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)" }} />
                  {/* Base */}
                  <div className="mx-auto h-2 w-56 -mt-1 rounded-b-xl bg-gradient-to-b from-cyan-700 to-cyan-900" />
                  {/* Brillo especular */}
                  <div className="absolute top-0 left-1/2 h-2 w-40 -translate-x-1/2 rounded-full bg-white/60 blur-[1px]" />
                </div>
              </div>

              {/* Billetera (oculta en modo demo) */}
              {!isDemo && (
                <div className="mb-3 grid grid-cols-2 gap-2.5">
                  <div className="flex items-center justify-center gap-2 rounded-full bg-stone-100 px-3 py-2.5 ring-1 ring-stone-200">
                    <RunicCoin size={22} />
                    <span className="text-lg font-black text-amber-700">{data?.monedas ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-full bg-stone-100 px-3 py-2.5 ring-1 ring-stone-200">
                    <EssenceCrystal size={20} tint="cyan" />
                    <span className="text-lg font-black text-cyan-700">{data?.gemas ?? 0}</span>
                  </div>
                </div>
              )}

              {/* Placa de nivel (oculta en modo demo) */}
              {!isDemo && (
                <div className="rounded-2xl bg-stone-100 px-4 py-2.5 ring-1 ring-stone-200">
                  <p className="text-xs font-bold uppercase tracking-wide text-cyan-600">Nivel {data?.nivel ?? 1}</p>
                  <p className="text-sm font-bold text-stone-700">{data?.experiencia ?? 0} XP</p>
                </div>
              )}
              {isDemo && (
                <div className="rounded-2xl bg-emerald-50 px-4 py-2.5 ring-1 ring-emerald-200">
                  <p className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wide text-emerald-600">
                    <Check size={12} strokeWidth={3} /> Acceso total · Sin restricciones
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ===== DERECHA: Catálogo ===== */}
          <div className="min-w-0">
            {/* ===== Kits de Personajes (skins completos) ===== */}
            <div className="mb-5 rounded-2xl bg-white p-4 shadow-md ring-1 ring-stone-200">
              <div className="mb-3 flex items-center gap-2">
                <Boxes size={20} strokeWidth={2.5} className="text-orange-500" />
                <h2 className="text-base font-black text-stone-800">Kits de Personajes</h2>
                <span className="ml-auto rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
                  {PERSONAJES.length} skins
                </span>
              </div>
              <div className="relative">
                {/* Degradados de borde */}
                <div aria-hidden className={`pointer-events-none absolute left-0 top-0 bottom-2 z-10 w-10 rounded-l-2xl bg-gradient-to-r from-stone-100/90 to-transparent transition-opacity duration-200 ${puedeIzq ? "opacity-100" : "opacity-0"}`} />
                <div aria-hidden className={`pointer-events-none absolute right-0 top-0 bottom-2 z-10 w-10 rounded-r-2xl bg-gradient-to-l from-stone-100/90 to-transparent transition-opacity duration-200 ${puedeDer ? "opacity-100" : "opacity-0"}`} />

                {/* Flecha izquierda */}
                <button
                  onClick={() => desplazarPersonajes(-1)}
                  disabled={!puedeIzq}
                  className={`absolute left-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-cyan-600 shadow-lg ring-2 ring-cyan-200 transition-all hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:opacity-0 ${puedeIzq ? "opacity-100" : "opacity-0"}`}
                  aria-label="Ver personajes anteriores"
                >
                  <ChevronLeft size={22} strokeWidth={2.5} />
                </button>

                {/* Contenedor scroll oculto */}
                <div
                  ref={personajesScrollRef}
                  className="flex min-w-0 gap-3 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {PERSONAJES.map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => aplicarPersonaje(p)}
                        disabled={aplicandoPersonaje}
                        className="group flex w-32 shrink-0 flex-col items-center gap-1.5 rounded-2xl bg-stone-50 p-3 ring-1 ring-stone-200 transition-all hover:scale-105 hover:ring-cyan-300 hover:shadow-md disabled:opacity-50"
                        aria-label={`Aplicar personaje ${p.nombre}`}
                      >
                        <div className="relative flex h-28 w-24 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-cyan-50 to-white ring-1 ring-cyan-100">
                          <AvatarSVG config={p.config} size={72} className="transition-transform group-hover:scale-110" />
                          {isDemo && (
                            <span className="absolute left-1 top-1 rounded-md bg-emerald-500 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-white shadow">DEMO</span>
                          )}
                        </div>
                        <span className="flex items-center gap-1 text-center text-[11px] font-black leading-tight text-stone-800">
                          <Icon size={11} strokeWidth={2.5} className="text-orange-500" /> {p.nombre}
                        </span>
                        <span className="text-center text-[9px] font-medium leading-tight text-stone-500">{p.desc}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Flecha derecha */}
                <button
                  onClick={() => desplazarPersonajes(1)}
                  disabled={!puedeDer}
                  className={`absolute right-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-cyan-600 shadow-lg ring-2 ring-cyan-200 transition-all hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:opacity-0 ${puedeDer ? "opacity-100" : "opacity-0"}`}
                  aria-label="Ver personajes siguientes"
                >
                  <ChevronRight size={22} strokeWidth={2.5} />
                </button>

                <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-medium text-stone-400">
                  <ChevronLeft size={11} strokeWidth={2.5} />
                  Desliza para ver los {PERSONAJES.length} skins
                  <ChevronRight size={11} strokeWidth={2.5} />
                </p>
              </div>
              <p className="mt-1.5 text-center text-[10px] font-medium text-stone-400">
                {isDemo
                  ? "Toca un skin para aplicarlo al Protagonista al instante (modo demo)"
                  : "Toca un skin para aplicarlo (compra y equipa automaticamente)"}
              </p>
            </div>

            {/* ===== Pestañas de categorías con iconos SVG ===== */}
            <div className="mb-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
              {/* Botón KITS */}
              <button
                onClick={() => setCatActiva("KITS")}
                aria-label="Kits de Personajes"
                className={`flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 transition-all hover:scale-105 ${
                  catActiva === "KITS"
                    ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200"
                    : "bg-white text-stone-500 ring-1 ring-stone-200 hover:text-orange-500"
                }`}
              >
                <KitsIcon categoria={"CUERPO" as any} size={26} strokeWidth={2.5} className={catActiva === "KITS" ? "text-white" : "text-orange-500"} />
                <span className="text-[10px] font-black leading-tight">Kits</span>
              </button>
              {CATEGORIAS_ORDER.map((catId) => {
                const activo = catActiva === catId;
                return (
                  <button
                    key={catId}
                    onClick={() => setCatActiva(catId)}
                    aria-label={CATEGORIA_LABEL[catId]}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 transition-all hover:scale-105 ${
                      activo
                        ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-200"
                        : "bg-white text-stone-500 ring-1 ring-stone-200 hover:text-cyan-600"
                    }`}
                  >
                    <CategoryIcon categoria={catId} size={26} strokeWidth={2.5} className={activo ? "text-white" : ""} />
                    <span className="text-[10px] font-black leading-tight">{CATEGORIA_LABEL[catId]}</span>
                  </button>
                );
              })}
            </div>

            {/* ===== Pestañas de rareza (bordes neón) ===== */}
            {catActiva !== "KITS" && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setRarezaFiltro("TODAS")}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                    rarezaFiltro === "TODAS"
                      ? "bg-stone-800 text-white shadow-md"
                      : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-stone-400"
                  }`}
                >
                  Todas
                </button>
                {RAREZAS_ORDER.map((rz) => {
                  const cfg = RAREZA_CONFIG[rz];
                  const Icon = cfg.icon;
                  const activo = rarezaFiltro === rz;
                  return (
                    <button
                      key={rz}
                      onClick={() => setRarezaFiltro(rz)}
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                        activo ? `${cfg.badge} shadow-md ${cfg.glow}` : `bg-white text-stone-600 ring-1 ${cfg.border} hover:scale-105`
                      }`}
                    >
                      <Icon size={11} strokeWidth={2.5} />
                      {RAREZA_LABEL[rz]}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ===== Sección KITS (tarjetas grandes de skins) ===== */}
            {catActiva === "KITS" ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {PERSONAJES.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => aplicarPersonaje(p)}
                      disabled={aplicandoPersonaje}
                      className="group relative flex flex-col items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-stone-200 transition-all hover:scale-[1.03] hover:shadow-lg disabled:opacity-50"
                    >
                      {isDemo && (
                        <span className="absolute left-2 top-2 z-10 flex items-center gap-0.5 rounded-md bg-emerald-500 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-white shadow">
                          <Check size={8} strokeWidth={3} /> DEMO
                        </span>
                      )}
                      <span className="absolute right-2 top-2 rounded-md bg-orange-100 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-orange-700">
                        KIT
                      </span>
                      <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-cyan-50 to-white ring-1 ring-cyan-100">
                        <AvatarSVG config={p.config} size={88} className="transition-transform group-hover:scale-110" />
                      </div>
                      <div className="flex w-full items-center justify-center gap-1 text-sm font-black text-stone-800">
                        <Icon size={13} strokeWidth={2.5} className="text-orange-500" /> {p.nombre}
                      </div>
                      <p className="text-center text-[10px] font-medium text-stone-500">{p.desc}</p>
                      <div className="mt-auto w-full rounded-lg bg-cyan-500 py-1.5 text-center text-xs font-black text-white shadow-sm transition-colors group-hover:bg-cyan-600">
                        {aplicandoPersonaje ? <Loader2 size={12} className="mx-auto animate-spin" /> : "Aplicar Skin"}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* ===== Grid de catálogo (items por categoría) ===== */
              <>
                {/* Encabezado de sección */}
                <div className="mb-4 flex items-center justify-between rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-stone-200">
                  <div className="flex items-center gap-2">
                    <CategoryIcon categoria={catActiva} size={18} strokeWidth={2.5} className="text-cyan-600" />
                    <h2 className="text-base font-black text-stone-800">{CATEGORIA_LABEL[catActiva]}</h2>
                  </div>
                  <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-bold text-cyan-700">
                    {itemsCat.length} piezas
                  </span>
                </div>

                {/* Grid de items */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {itemsCat.map((item) => {
                    const equipado = estaEquipado(item);
                    const propio = esPropio(item);
                    const gratis = esGratis(item);
                    const puede = puedeComprar(item);
                    const bloqueadoNivel = (data?.nivel ?? 1) < item.nivelRequerido;
                    const cargandoItem = accionando === item.id;
                    const disponibleDirecto = isDemo || propio || gratis;
                    const rzCfg = RAREZA_CONFIG[item.raridad] ?? RAREZA_CONFIG.COMUN;
                    const RzIcon = rzCfg.icon;
                    return (
                      <div
                        key={item.id}
                        className={`relative flex flex-col rounded-2xl bg-white p-3 ring-1 transition-all hover:scale-[1.03] hover:shadow-lg ${equipado ? "ring-2 ring-emerald-400 shadow-md shadow-emerald-100" : rzCfg.ring + " " + rzCfg.glow}`}
                      >
                        {/* Badge de rareza (esquina superior derecha) */}
                        <span className={`absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide shadow-sm ${rzCfg.badge}`}>
                          <RzIcon size={8} strokeWidth={2.5} />
                          {isDemo ? "DEMO" : RAREZA_LABEL[item.raridad]}
                        </span>

                        {/* Etiqueta DEMO ACTIVO (esquina superior izquierda) */}
                        {isDemo && (
                          <span className="absolute left-2 top-2 z-10 flex items-center gap-0.5 rounded-md bg-emerald-500 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-white shadow">
                            <Check size={8} strokeWidth={3} /> DEMO
                          </span>
                        )}

                        {/* Ventana de preview */}
                        <div className="mb-2.5 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-stone-50 to-white ring-1 ring-stone-100">
                          <AvatarSVG config={{ ...data?.config, [item.categoria.toLowerCase()]: item.clave } as any} size={78} />
                        </div>

                        <p className="text-sm font-black leading-tight text-stone-800">{item.nombre}</p>
                        {item.descripcion && (
                          <p className="mt-0.5 line-clamp-2 text-[10px] font-medium text-stone-500">{item.descripcion}</p>
                        )}

                        {/* Área de acción */}
                        <div className="mt-auto pt-2.5">
                          {equipado ? (
                            <div className="flex items-center justify-center gap-1 rounded-lg bg-emerald-500 py-2 text-xs font-black text-white shadow-sm">
                              <Check size={13} strokeWidth={3} /> Equipado
                            </div>
                          ) : disponibleDirecto ? (
                            <button
                              onClick={() => isDemo ? handleEquiparDemo(item) : handleEquipar(item)}
                              disabled={cargandoItem}
                              className="flex w-full items-center justify-center gap-1 rounded-lg bg-cyan-500 py-2 text-xs font-black text-white shadow-sm transition-all hover:bg-cyan-600 hover:scale-105 disabled:opacity-50"
                            >
                              {cargandoItem ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={3} />}
                              Equipar
                            </button>
                          ) : bloqueadoNivel ? (
                            <div className="flex items-center justify-center gap-1 rounded-lg bg-stone-100 py-2 text-xs font-bold text-stone-400 ring-1 ring-stone-200">
                              <Lock size={12} strokeWidth={2.5} /> Nivel {item.nivelRequerido}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleComprar(item)}
                              disabled={!puede || cargandoItem}
                              className={`flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black text-white shadow-sm transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
                                item.precioGemas > 0 ? "bg-fuchsia-500 hover:bg-fuchsia-600" : "bg-amber-500 hover:bg-amber-600"
                              }`}
                            >
                              {cargandoItem ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : item.precioGemas > 0 ? (
                                <>
                                  <EssenceCrystal size={14} tint="rose" />
                                  {item.precioGemas}
                                </>
                              ) : (
                                <>
                                  <RunicCoin size={16} />
                                  {item.precioMonedas}
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {itemsCat.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-12 text-stone-400 ring-1 ring-stone-200">
                    <Boxes size={40} strokeWidth={1.5} className="mb-2 opacity-50" />
                    <p className="text-sm font-bold">No hay piezas de esta rareza</p>
                    <p className="text-xs">Prueba con otra rareza o categoria</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Animación de flotación del avatar (inline para evitar dependencias) */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
