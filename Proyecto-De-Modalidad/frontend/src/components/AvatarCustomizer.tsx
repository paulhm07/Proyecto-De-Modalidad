"use client";
import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Coins, Gem, Lock, Check, Sparkles, Loader2, Wrench } from "lucide-react";
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

export function AvatarCustomizer() {
  const { usuario, setVista, mostrarToast, setUsuario } = useApp();
  const [data, setData] = useState<MiAvatarResponse | null>(null);
  const [tienda, setTienda] = useState<ItemTienda[]>([]);
  const [cargando, setCargando] = useState(true);
  const [catActiva, setCatActiva] = useState<CategoriaAvatar>("CUERPO");
  const [accionando, setAccionando] = useState<string | null>(null);

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
      {/* ===== Decorative robot-workshop backdrop (sits ABOVE the gray bg, BELOW content) ===== */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Work lights (cyan + coral) — prominent glows */}
        <div className="absolute -top-10 left-[20%] h-72 w-72 rounded-full bg-cyan-400/45 blur-[70px]" />
        <div className="absolute bottom-0 right-[18%] h-72 w-72 rounded-full bg-orange-400/40 blur-[70px]" />

        {/* Left shelving unit with avatar parts (clearly visible) */}
        <div className="absolute left-0 top-[14%] hidden h-[30rem] w-28 flex-col rounded-r-2xl border-2 border-stone-600/50 bg-stone-500/30 shadow-2xl backdrop-blur-[1px] sm:flex">
          {[0, 1, 2, 3].map((shelf) => (
            <div key={shelf} className="relative flex flex-1 items-center justify-around border-b-2 border-stone-600/45 px-1.5">
              {/* shelf board bottom edge */}
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-b from-stone-600/40 to-stone-700/50" />
              {/* parts on the shelf */}
              {Array.from({ length: 3 }).map((_, i) => {
                const kind = (shelf + i) % 3;
                return kind === 0 ? (
                  <div key={i} className="h-7 w-7 rounded-full bg-gradient-to-br from-stone-600/75 to-stone-800/65 shadow-inner ring-1 ring-white/25" />
                ) : kind === 1 ? (
                  <div key={i} className="h-7 w-7 rounded-md bg-gradient-to-br from-cyan-500/70 to-cyan-700/60 shadow-inner ring-1 ring-white/25" />
                ) : (
                  <div key={i} className="h-6 w-6 rotate-45 bg-gradient-to-br from-orange-500/70 to-rose-600/60 shadow-inner ring-1 ring-white/25" />
                );
              })}
            </div>
          ))}
        </div>
        {/* Right shelving unit with parts (clearly visible) */}
        <div className="absolute right-0 top-[18%] hidden h-[30rem] w-28 flex-col rounded-l-2xl border-2 border-stone-600/50 bg-stone-500/30 shadow-2xl backdrop-blur-[1px] sm:flex">
          {[0, 1, 2, 3].map((shelf) => (
            <div key={shelf} className="relative flex flex-1 items-center justify-around border-b-2 border-stone-600/45 px-1.5">
              <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-b from-stone-600/40 to-stone-700/50" />
              {Array.from({ length: 3 }).map((_, i) => {
                const kind = (shelf + i + 1) % 3;
                return kind === 0 ? (
                  <div key={i} className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-500/70 to-rose-600/60 shadow-inner ring-1 ring-white/25" />
                ) : kind === 1 ? (
                  <div key={i} className="h-7 w-7 rounded-md bg-gradient-to-br from-amber-400/75 to-orange-600/60 shadow-inner ring-1 ring-white/25" />
                ) : (
                  <div key={i} className="h-7 w-7 rounded-full bg-gradient-to-br from-stone-600/75 to-stone-800/65 shadow-inner ring-1 ring-white/25" />
                );
              })}
            </div>
          ))}
        </div>

        {/* Floating tool icons (wrench, sparkles) — prominent */}
        <div className="absolute left-[20%] top-[12%] text-cyan-600/70 animate-float"><Wrench size={30} strokeWidth={2.5} /></div>
        <div className="absolute right-[21%] top-[14%] text-orange-600/70 animate-float" style={{ animationDelay: "1.2s" }}><Sparkles size={28} /></div>
        <div className="absolute left-[15%] bottom-[14%] text-cyan-600/55 animate-float" style={{ animationDelay: "0.6s" }}><Sparkles size={26} /></div>
        <div className="absolute right-[16%] bottom-[12%] text-orange-600/55 animate-float" style={{ animationDelay: "1.8s" }}><Wrench size={26} strokeWidth={2.5} /></div>

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

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* ===== LEFT: Avatar crystal capsule ===== */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="neu-raised rounded-[2rem] p-6 text-center">
              <div className="neu-inset-sm mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-cyan-pulse" />
                <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">Cápsula activa</p>
              </div>
              <p className="mb-1 font-display text-2xl font-bold text-stone-800">{usuario?.nombre}</p>
              <p className="mb-4 text-xs font-semibold text-stone-500">Unidad avatar en ensamble</p>

              {/* Crystal capsule with cyan under-light */}
              <div className="relative mx-auto mb-4 flex h-60 w-56 items-end justify-center">
                {/* Under-light base plate */}
                <div className="absolute bottom-2 h-8 w-44 rounded-full cyan-base-plate animate-cyan-pulse" />
                {/* Capsule dome */}
                <div className="crystal-capsule absolute inset-x-0 bottom-6 top-0 rounded-t-[8rem] rounded-b-3xl">
                  <div className="flex h-full items-center justify-center">
                    <AvatarSVG config={data?.config} size={170} className="animate-capsule-float" />
                  </div>
                </div>
                {/* Base ring */}
                <div className="neu-raised-sm absolute bottom-0 h-5 w-48 rounded-full" />
              </div>

              {/* Wallet: neumorphic oval pills */}
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

              {/* Level plate */}
              <div className="neu-inset-sm rounded-2xl px-4 py-2.5">
                <p className="text-xs font-bold uppercase tracking-wide text-cyan-600">Nivel {data?.nivel ?? 1}</p>
                <p className="text-sm font-bold text-stone-700">{data?.experiencia ?? 0} XP</p>
              </div>
              <p className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-stone-500">
                <Sparkles size={12} className="text-orange-500" /> Responde desafíos para ganar monedas y gemas
              </p>
            </div>
          </div>

          {/* ===== RIGHT: Building-block option cards ===== */}
          <div>
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
                return (
                  <div
                    key={item.id}
                    className={`relative flex flex-col rounded-3xl p-3 transition-all hover:scale-[1.03] neu-block ${equipado ? "ring-2 ring-emerald-400" : RAREZA_RING[item.raridad] ?? ""}`}
                  >
                    {/* Rarity badge */}
                    <span className="absolute right-2 top-2 rounded-full bg-white/70 px-2 py-0.5 text-[8px] font-black uppercase tracking-wide text-stone-500 shadow-sm">
                      {item.raridad}
                    </span>

                    {/* Preview window — inset "screen" */}
                    <div className="neu-inset-sm mb-2.5 flex h-24 items-center justify-center overflow-hidden rounded-2xl">
                      <AvatarSVG config={{ ...data?.config, [item.categoria.toLowerCase()]: item.clave } as any} size={76} />
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
                      ) : propio || gratis ? (
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
