"use client";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { ArrowLeft, Coins, Gem, Lock, Check, Sparkles, Loader2, Wrench, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";
import type { CategoriaAvatar, ItemTienda, MiAvatarResponse } from "@/lib/types";
import { AvatarSVG } from "@/components/AvatarSVG";
import { RunicCoin } from "@/components/RunicCoin";
import { EssenceCrystal } from "@/components/EssenceCrystal";
import { CategoryIcon, CATEGORIAS_ORDER, CATEGORIA_LABEL } from "@/components/CategoryIcon";

const RAREZA_RING: Record<string, string> = {
  COMUN: "",
  RARA: "ring-2 ring-cyan-300/50",
  EPICA: "ring-2 ring-fuchsia-300/60",
  LEGENDARIA: "ring-2 ring-amber-400/70",
};

interface PersonajePreset {
  id: string;
  nombre: string;
  emoji: string;
  desc: string;
  config: {
    CUERPO: string;
    OJOS: string;
    BOCA: string;
    CABELLO: string;
    ROPA: string;
    ACCESORIO: string;
  };
}

// Personajes llamativos: combinaciones de las 6 categorías.
// Diseñados con items mayormente gratis / baratos (monedas, nivel 1) para que un estudiante nuevo pueda aplicarlos.
const PERSONAJES: PersonajePreset[] = [
  {
    id: "novato",
    nombre: "Novato",
    emoji: "🌱",
    desc: "El look inicial, gratis",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-normales", BOCA: "boca-sonrisa", CABELLO: "cabello-nada", ROPA: "ropa-basica", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "sonador",
    nombre: "Soñador",
    emoji: "😴",
    desc: "Relajado con capucha",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-cerrados", BOCA: "boca-sonrisa", CABELLO: "cabello-corto", ROPA: "ropa-capucha", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "robot",
    nombre: "Robot Alien",
    emoji: "🤖",
    desc: "¡Verde del espacio!",
    config: { CUERPO: "cuerpo-verde", OJOS: "ojos-grandes", BOCA: "boca-serio", CABELLO: "cabello-nada", ROPA: "ropa-basica", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "artista",
    nombre: "Artista",
    emoji: "🎨",
    desc: "Creativo y feliz",
    config: { CUERPO: "cuerpo-medio", OJOS: "ojos-felices", BOCA: "boca-gran-sonrisa", CABELLO: "cabello-largo", ROPA: "ropa-basica", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "cadete",
    nombre: "Cadete",
    emoji: "🚀",
    desc: "Uniforme espacial",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-serio", CABELLO: "cabello-corto", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "pop",
    nombre: "Estrella Pop",
    emoji: "🌟",
    desc: "Travieso con estrella",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-felices", BOCA: "boca-lengua", CABELLO: "cabello-corto", ROPA: "ropa-basica", ACCESORIO: "accesorio-estrella" },
  },
  {
    id: "intellect",
    nombre: "Genio",
    emoji: "🧠",
    desc: "Con gafas intelectuales",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-sonrisa", CABELLO: "cabello-corto", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-gafas" },
  },
  {
    id: "heroe",
    nombre: "Héroe",
    emoji: "🦸",
    desc: "Capucha misteriosa",
    config: { CUERPO: "cuerpo-oscuro", OJOS: "ojos-normales", BOCA: "boca-serio", CABELLO: "cabello-nada", ROPA: "ropa-capucha", ACCESORIO: "accesorio-nada" },
  },
];

export function AvatarCustomizer() {
  const { usuario, setVista, mostrarToast, setUsuario } = useApp();
  const [data, setData] = useState<MiAvatarResponse | null>(null);
  const [tienda, setTienda] = useState<ItemTienda[]>([]);
  const [cargando, setCargando] = useState(true);
  const [catActiva, setCatActiva] = useState<CategoriaAvatar>("CUERPO");
  const [accionando, setAccionando] = useState<string | null>(null);
  const [aplicandoPersonaje, setAplicandoPersonaje] = useState(false);

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
    el.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  useEffect(() => {
    if (cargando) return; // esperar a que el contenido esté en el DOM
    const el = personajesScrollRef.current;
    if (!el) return;

    verificarScrollPersonajes();
    const rafId = requestAnimationFrame(verificarScrollPersonajes);

    // Listener de scroll manual
    el.addEventListener("scroll", verificarScrollPersonajes, { passive: true });
    window.addEventListener("resize", verificarScrollPersonajes);

    // ResizeObserver: detecta cuando el layout termina de restringir el ancho del contenedor
    const resizeObserver = new ResizeObserver(() => verificarScrollPersonajes());
    resizeObserver.observe(el);

    // Backup: re-verificar tras un breve retardo por si el layout tarda en estabilizarse
    const timeoutId = setTimeout(verificarScrollPersonajes, 400);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      el.removeEventListener("scroll", verificarScrollPersonajes);
      window.removeEventListener("resize", verificarScrollPersonajes);
      resizeObserver.disconnect();
    };
  }, [verificarScrollPersonajes, cargando]);

  // ===== MODO DEMO: DemoKid / PadreDemo / MaestroDemo tienen TODO el catálogo desbloqueado =====
  const esModoDemo = usuario?.nombre === "DemoKid" || usuario?.nombre === "PadreDemo" || usuario?.nombre === "MaestroDemo";

  // Aplica un personaje completo: compra (si hace falta y se puede) y equipa las 6 categorías en secuencia.
  const aplicarPersonaje = async (p: PersonajePreset) => {
    if (!usuario || !data) return;
    setAplicandoPersonaje(true);
    // Preview optimista: muestra el look completo al instante
    const configOptimista = { ...data.config, ...p.config };
    setData((prev) => (prev ? { ...prev, config: configOptimista } : prev));
    try {
      let configActual = configOptimista;
      let monedasActual = data.monedas;
      let gemasActual = data.gemas;
      let ownedActual = [...data.itemsOwned];
      let faltaron = 0;
      let equipados = 0;
      // Procesar las 6 categorías en secuencia
      for (const [cat, clave] of Object.entries(p.config)) {
        const item = tienda.find((it) => it.categoria === cat && it.clave === clave);
        if (!item) { faltaron++; continue; }
        const esGratis = item.precioMonedas === 0 && item.precioGemas === 0;
        const yaPosee = ownedActual.includes(item.id);
        // Si no es gratis y no lo posee, intentar comprar (en modo demo el backend no cobra)
        if (!esGratis && !yaPosee) {
          // En modo demo NO verificamos fondos ni nivel (backend lo permite)
          if (!esModoDemo) {
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
        // Equipar
        try {
          const res = await api.equipar(usuario.id, item.id);
          configActual = res.config;
          equipados++;
        } catch {
          faltaron++;
        }
      }
      // Actualizar estado local con el resultado real del backend
      setData((prev) => (prev ? { ...prev, config: configActual, monedas: monedasActual, gemas: gemasActual, itemsOwned: ownedActual } : prev));
      setUsuario({ ...usuario, monedas: monedasActual, gemas: gemasActual });
      if (faltaron === 0) {
        mostrarToast(`¡${p.nombre} aplicado! (${equipados} piezas)`, "exito");
      } else if (equipados > 0) {
        mostrarToast(`¡${p.nombre} parcial! ${equipados} piezas aplicadas, ${faltaron} bloqueadas`, "info");
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

  const itemsCat = useMemo(() => tienda.filter((i) => i.categoria === catActiva), [tienda, catActiva]);
  const estaEquipado = (item: ItemTienda): boolean => { if (!data) return false; const campo = item.categoria.toLowerCase() as keyof typeof data.config; return data.config[campo] === item.clave; };
  const esPropio = (item: ItemTienda): boolean => data?.itemsOwned.includes(item.id) ?? false;
  const esGratis = (item: ItemTienda): boolean => item.precioMonedas === 0 && item.precioGemas === 0;
  const puedeComprar = (item: ItemTienda): boolean => { if (!data) return false; if (data.nivel < item.nivelRequerido) return false; if (item.precioGemas > 0) return data.gemas >= item.precioGemas; return data.monedas >= item.precioMonedas; };

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

  if (cargando) return (
    <div className="neu-room flex min-h-[70vh] items-center justify-center">
      <div className="neu-raised-sm flex h-16 w-16 items-center justify-center rounded-3xl">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    </div>
  );

  return (
    <div className="neu-room relative min-h-screen overflow-hidden text-stone-700">
      {/* ===== Decorative backdrop (sin estanterías laterales — ya no se cortan los laterales) ===== */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Work lights (cyan + coral) — prominent glows */}
        <div className="absolute -top-10 left-[15%] h-72 w-72 rounded-full bg-cyan-400/40 blur-[80px]" />
        <div className="absolute bottom-0 right-[15%] h-72 w-72 rounded-full bg-orange-400/35 blur-[80px]" />
        <div className="absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-400/25 blur-[90px]" />

        {/* Floating tool icons — centrados, no tocan los bordes */}
        <div className="absolute left-[8%] top-[12%] text-cyan-600/60 animate-float"><Wrench size={28} strokeWidth={2.5} /></div>
        <div className="absolute right-[8%] top-[14%] text-orange-600/60 animate-float" style={{ animationDelay: "1.2s" }}><Sparkles size={26} /></div>
        <div className="absolute left-[10%] bottom-[14%] text-cyan-600/45 animate-float" style={{ animationDelay: "0.6s" }}><Sparkles size={24} /></div>
        <div className="absolute right-[10%] bottom-[12%] text-orange-600/45 animate-float" style={{ animationDelay: "1.8s" }}><Wrench size={24} strokeWidth={2.5} /></div>

        {/* Tech grid floor */}
        <div className="absolute inset-x-0 bottom-0 h-44 opacity-[0.10]" style={{
          backgroundImage: "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "linear-gradient(to top, black, transparent)",
          WebkitMaskImage: "linear-gradient(to top, black, transparent)",
        }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* Header bar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setVista("dashboard")}
            className="neu-pill flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-stone-600 transition-all hover:text-cyan-600"
          >
            <ArrowLeft size={16} strokeWidth={2.5} /> Volver
          </button>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-stone-700">
            <Wrench size={22} className="text-cyan-600" strokeWidth={2.5} />
            Cámara de Personalización
          </h1>
        </div>

        {/* ===== Banner Modo Demo (todo desbloqueado) ===== */}
        {esModoDemo && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 px-4 py-3 shadow-md">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
              <Sparkles size={20} strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold text-amber-800">¡Modo Demo activo! Todo el catálogo está desbloqueado</p>
              <p className="text-xs font-medium text-amber-700">Equipa cualquier prenda, accesorio o personaje legendario al instante, sin costo ni nivel</p>
            </div>
            <span className="hidden rounded-full bg-amber-200/70 px-3 py-1 text-xs font-black uppercase tracking-wide text-amber-800 sm:inline">DEMO</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* ===== LEFT: Avatar preview con cápsula grande + podio iluminado ===== */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="neu-raised rounded-[2rem] p-6 text-center">
              <div className="neu-inset-sm mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-cyan-pulse" />
                <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">Cápsula activa</p>
              </div>
              <p className="mb-1 font-display text-2xl font-bold text-stone-800">{usuario?.nombre}</p>
              <p className="mb-4 text-xs font-semibold text-stone-500">Unidad avatar en ensamble</p>

              {/* ===== Cápsula grande con podio iluminado ===== */}
              <div className="relative mx-auto mb-4 flex h-96 w-72 items-end justify-center">
                {/* Glow de fondo del podio (haz de luz ascendente) */}
                <div className="absolute bottom-0 left-1/2 h-80 w-56 -translate-x-1/2 rounded-full bg-cyan-300/40 blur-[50px] animate-cyan-pulse" />
                {/* Cúpula de cristal (más alta) */}
                <div className="crystal-capsule absolute inset-x-0 bottom-16 top-0 rounded-t-[10rem] rounded-b-[2.5rem]">
                  <div className="flex h-full items-end justify-center pb-4">
                    <AvatarSVG config={data?.config} size={215} className="animate-capsule-float" />
                  </div>
                </div>
                {/* Podio iluminado (plataforma 3D con degradado) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                  {/* Anillo de luz del podio */}
                  <div className="absolute -top-1 left-1/2 h-6 w-56 -translate-x-1/2 rounded-full bg-cyan-400/60 blur-md animate-cyan-pulse" />
                  {/* Plataforma elíptica superior */}
                  <div className="relative h-6 w-60 rounded-[50%] bg-gradient-to-b from-cyan-200 via-cyan-300 to-cyan-500 shadow-[0_8px_24px_rgba(34,211,238,0.45)]" />
                  {/* Cuerpo del podio (trapecio) */}
                  <div className="mx-auto h-6 w-52 -mt-1 bg-gradient-to-b from-cyan-500 to-cyan-700" style={{ clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)" }} />
                  {/* Base del podio */}
                  <div className="mx-auto h-2 w-56 -mt-1 rounded-b-xl bg-gradient-to-b from-cyan-700 to-cyan-900" />
                  {/* Brillo especular en la plataforma */}
                  <div className="absolute top-0 left-1/2 h-2 w-40 -translate-x-1/2 rounded-full bg-white/60 blur-[1px]" />
                </div>
              </div>

              {/* Wallet: neumorphic oval pills (oculto en modo demo para evitar confusión) */}
              {!esModoDemo && (
                <div className="mb-3 grid grid-cols-2 gap-2.5">
                  <div className="neu-inset-sm flex items-center justify-center gap-2 rounded-full px-3 py-2.5">
                    <RunicCoin size={22} />
                    <span className="font-display text-lg font-bold text-amber-700">{data?.monedas ?? 0}</span>
                  </div>
                  <div className="neu-inset-sm flex items-center justify-center gap-2 rounded-full px-3 py-2.5">
                    <EssenceCrystal size={20} tint="cyan" />
                    <span className="font-display text-lg font-bold text-cyan-700">{data?.gemas ?? 0}</span>
                  </div>
                </div>
              )}

              {/* Level plate (oculto en modo demo) */}
              {!esModoDemo && (
                <div className="neu-inset-sm rounded-2xl px-4 py-2.5">
                  <p className="text-xs font-bold uppercase tracking-wide text-cyan-600">Nivel {data?.nivel ?? 1}</p>
                  <p className="text-sm font-bold text-stone-700">{data?.experiencia ?? 0} XP</p>
                </div>
              )}
              {esModoDemo && (
                <div className="neu-inset-sm rounded-2xl px-4 py-2.5">
                  <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-600">
                    <Sparkles size={12} /> Acceso total · Sin restricciones
                  </p>
                </div>
              )}
              {!esModoDemo && (
                <p className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-stone-500">
                  <Sparkles size={12} className="text-orange-500" /> Responde desafíos para ganar monedas y gemas
                </p>
              )}
            </div>
          </div>

          {/* ===== RIGHT: Building-block option cards ===== */}
          <div className="min-w-0">
            {/* ===== Character presets (llamativo quick-select) ===== */}
            <div className="neu-inset-sm mb-5 rounded-2xl p-4">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles size={18} strokeWidth={2.5} className="text-orange-500" />
                <h2 className="font-display text-base font-bold text-stone-700">Personajes rápidos</h2>
                <span className="ml-auto rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700">
                  {PERSONAJES.length} personajes
                </span>
              </div>
              <div className="relative">
                {/* Degradados de borde para indicar más contenido */}
                <div
                  aria-hidden
                  className={`pointer-events-none absolute left-0 top-0 bottom-2 z-10 w-10 rounded-l-2xl bg-gradient-to-r from-stone-200/90 to-transparent transition-opacity duration-200 ${puedeIzq ? "opacity-100" : "opacity-0"}`}
                />
                <div
                  aria-hidden
                  className={`pointer-events-none absolute right-0 top-0 bottom-2 z-10 w-10 rounded-r-2xl bg-gradient-to-l from-stone-200/90 to-transparent transition-opacity duration-200 ${puedeDer ? "opacity-100" : "opacity-0"}`}
                />

                {/* Flecha izquierda */}
                <button
                  onClick={() => desplazarPersonajes(-1)}
                  disabled={!puedeIzq}
                  className={`absolute left-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-cyan-600 shadow-lg ring-2 ring-cyan-200 transition-all hover:scale-110 active:scale-95 disabled:pointer-events-none disabled:opacity-0 ${puedeIzq ? "opacity-100" : "opacity-0"}`}
                  aria-label="Ver personajes anteriores"
                >
                  <ChevronLeft size={22} strokeWidth={2.5} />
                </button>

                {/* Contenedor con scroll oculto */}
                <div
                  ref={personajesScrollRef}
                  className="flex min-w-0 gap-3 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {PERSONAJES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => aplicarPersonaje(p)}
                      disabled={aplicandoPersonaje}
                      className="group flex w-28 shrink-0 flex-col items-center gap-1.5 rounded-2xl p-2.5 transition-all hover:scale-105 disabled:opacity-50 neu-raised-sm"
                      aria-label={`Aplicar personaje ${p.nombre}`}
                    >
                      <div className="neu-inset-sm flex h-28 w-24 items-center justify-center overflow-hidden rounded-2xl">
                        <AvatarSVG config={p.config} size={72} className="transition-transform group-hover:scale-110" />
                      </div>
                      <span className="text-center text-[11px] font-bold leading-tight text-stone-700">{p.emoji} {p.nombre}</span>
                      <span className="text-center text-[9px] font-medium leading-tight text-stone-500">{p.desc}</span>
                    </button>
                  ))}
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

                {/* Contador de posición / hint */}
                <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] font-medium text-stone-400">
                  <ChevronLeft size={11} strokeWidth={2.5} />
                  Desliza para ver los {PERSONAJES.length} personajes
                  <ChevronRight size={11} strokeWidth={2.5} />
                </p>
              </div>
              <p className="mt-1.5 text-center text-[10px] font-medium text-stone-400">
                {esModoDemo
                  ? "Toca un personaje para aplicar su look completo al instante (modo demo)"
                  : "Toca un personaje para aplicar su look completo (compra y equipa automáticamente)"}
              </p>
            </div>

            {/* Category tabs — BIG icons with small text below */}
            <div className="mb-5 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              {CATEGORIAS_ORDER.map((catId) => {
                const activo = catActiva === catId;
                return (
                  <button
                    key={catId}
                    onClick={() => setCatActiva(catId)}
                    aria-label={CATEGORIA_LABEL[catId]}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 transition-all hover:scale-105 ${
                      activo ? "neu-pressed text-cyan-700" : "neu-raised-sm text-stone-500 hover:text-cyan-600"
                    }`}
                  >
                    <CategoryIcon categoria={catId} size={26} strokeWidth={2.5} className={activo ? "text-cyan-600" : ""} />
                    <span className="text-[10px] font-bold leading-tight">{CATEGORIA_LABEL[catId]}</span>
                  </button>
                );
              })}
            </div>

            {/* Section header */}
            <div className="neu-inset-sm mb-4 flex items-center justify-between rounded-2xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <CategoryIcon categoria={catActiva} size={18} strokeWidth={2.5} className="text-cyan-600" />
                <h2 className="font-display text-base font-bold text-stone-700">{CATEGORIA_LABEL[catActiva]}</h2>
              </div>
              <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-bold text-cyan-700">
                {itemsCat.length} piezas
              </span>
            </div>

            {/* Building-block grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {itemsCat.map((item) => {
                const equipado = estaEquipado(item);
                const propio = esPropio(item);
                const gratis = esGratis(item);
                const puede = puedeComprar(item);
                const bloqueadoNivel = (data?.nivel ?? 1) < item.nivelRequerido;
                const cargandoItem = accionando === item.id;
                // En modo demo: todo se puede equipar directamente
                const disponibleDirecto = esModoDemo || propio || gratis;
                return (
                  <div
                    key={item.id}
                    className={`relative flex flex-col rounded-3xl p-3 transition-all hover:scale-[1.03] neu-block ${equipado ? "ring-2 ring-emerald-400" : RAREZA_RING[item.raridad] ?? ""}`}
                  >
                    {/* Rarity badge */}
                    <span className="absolute right-2 top-2 rounded-full bg-white/70 px-2 py-0.5 text-[8px] font-black uppercase tracking-wide text-stone-500 shadow-sm">
                      {esModoDemo ? "DEMO" : item.raridad}
                    </span>

                    {/* Preview window — inset "screen" */}
                    <div className="neu-inset-sm mb-2.5 flex h-32 items-center justify-center overflow-hidden rounded-2xl">
                      <AvatarSVG config={{ ...data?.config, [item.categoria.toLowerCase()]: item.clave } as any} size={78} />
                    </div>

                    <p className="font-display text-sm font-bold leading-tight text-stone-800">{item.nombre}</p>
                    {item.descripcion && (
                      <p className="mt-0.5 line-clamp-2 text-[10px] font-medium text-stone-500">{item.descripcion}</p>
                    )}

                    {/* Action area */}
                    <div className="mt-auto pt-2.5">
                      {equipado ? (
                        <div className="neu-pill-emerald flex items-center justify-center gap-1 py-2 text-xs font-bold">
                          <Check size={13} strokeWidth={3} /> Equipado
                        </div>
                      ) : disponibleDirecto ? (
                        <button
                          onClick={() => handleEquipar(item)}
                          disabled={cargandoItem}
                          className="neu-pill-cyan flex w-full items-center justify-center gap-1 py-2 text-xs font-bold transition-all hover:scale-105 disabled:opacity-50"
                        >
                          {cargandoItem ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={3} />}
                          Equipar
                        </button>
                      ) : bloqueadoNivel ? (
                        <div className="neu-inset-sm flex items-center justify-center gap-1 rounded-full py-2 text-xs font-bold text-stone-400">
                          <Lock size={12} strokeWidth={2.5} /> Nivel {item.nivelRequerido}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleComprar(item)}
                          disabled={!puede || cargandoItem}
                          className={`flex w-full items-center justify-center gap-1.5 py-2 text-xs font-bold transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
                            item.precioGemas > 0 ? "neu-pill-cyan" : "neu-pill-coral"
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
          </div>
        </div>
      </div>
    </div>
  );
}
