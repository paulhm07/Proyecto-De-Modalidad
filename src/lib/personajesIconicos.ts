// Base de datos de personajes icónicos inspirados en anime, videojuegos y películas
// Estilo bloque 3D Roblox/Minecraft — sin emojis, solo iconos vectoriales

export type CategoriaPersonaje = "ANIME" | "GAMER" | "MOVIE";

export interface PersonajeIconico {
  id: string;
  nombre: string;
  categoria: CategoriaPersonaje;
  desc: string;
  // Configuración de partes combinables (para el sistema de items por categoría)
  config: {
    CUERPO: string;
    OJOS: string;
    BOCA: string;
    CABELLO: string;
    ROPA: string;
    ACCESORIO: string;
  };
}

export const CATEGORIA_PERSONAJE_LABEL: Record<CategoriaPersonaje, string> = {
  ANIME: "Anime Legends",
  GAMER: "Gamer Heroes",
  MOVIE: "Movie Icons",
};

export const CATEGORIA_PERSONAJE_ORDER: CategoriaPersonaje[] = ["ANIME", "GAMER", "MOVIE"];

export const PERSONAJES_ICONICOS: PersonajeIconico[] = [
  // ===== ANIME LEGENDS =====
  {
    id: "goku",
    nombre: "Guerrero Z",
    categoria: "ANIME",
    desc: "Artes marciales con ki",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-serio", CABELLO: "cabello-mohawk", ROPA: "ropa-capas", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "naruto",
    nombre: "Ninja Rubio",
    categoria: "ANIME",
    desc: "Joven ninja con headband",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-sonrisa", CABELLO: "cabello-corto", ROPA: "ropa-capucha", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "pikachu",
    nombre: "Raton Electrico",
    categoria: "ANIME",
    desc: "Amarillo con mejillas rojas",
    config: { CUERPO: "cuerpo-verde", OJOS: "ojos-grandes", BOCA: "boca-gran-sonrisa", CABELLO: "cabello-nada", ROPA: "ropa-basica", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "eren",
    nombre: "Soldado Explorador",
    categoria: "ANIME",
    desc: "Capa verde de exploracion",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-normales", BOCA: "boca-serio", CABELLO: "cabello-corto", ROPA: "ropa-capas", ACCESORIO: "accesorio-nada" },
  },
  // ===== GAMER HEROES =====
  {
    id: "mario",
    nombre: "Fontanero Heroico",
    categoria: "GAMER",
    desc: "Rojo y azul con bigote",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-normales", BOCA: "boca-gran-sonrisa", CABELLO: "cabello-corto", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-gafas-sol" },
  },
  {
    id: "master-chief",
    nombre: "Jefe Maestro",
    categoria: "GAMER",
    desc: "Armadura verde con visor",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-serio", CABELLO: "cabello-nada", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-mascara" },
  },
  {
    id: "sora",
    nombre: "Portador de Llave",
    categoria: "GAMER",
    desc: "Aventurero con llave espada",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-sonrisa", CABELLO: "cabello-corto", ROPA: "ropa-basica", ACCESORIO: "accesorio-varita" },
  },
  // ===== MOVIE ICONS =====
  {
    id: "spiderman",
    nombre: "Trepa-muros",
    categoria: "MOVIE",
    desc: "Rojo y azul con telarana",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-serio", CABELLO: "cabello-nada", ROPA: "ropa-capas", ACCESORIO: "accesorio-mascara" },
  },
  {
    id: "batman",
    nombre: "Caballero Oscuro",
    categoria: "MOVIE",
    desc: "Negro con capa y cornamenta",
    config: { CUERPO: "cuerpo-oscuro", OJOS: "ojos-normales", BOCA: "boca-serio", CABELLO: "cabello-nada", ROPA: "ropa-capas", ACCESORIO: "accesorio-mascara" },
  },
  {
    id: "luke",
    nombre: "Caballero Jedi",
    categoria: "MOVIE",
    desc: "Tunica blanca con sable de luz",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-normales", BOCA: "boca-serio", CABELLO: "cabello-corto", ROPA: "ropa-basica", ACCESORIO: "accesorio-varita" },
  },
  {
    id: "eleven",
    nombre: "Chica Psiquica",
    categoria: "MOVIE",
    desc: "Vestido rosa con poderes",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-cerrados", BOCA: "boca-serio", CABELLO: "cabello-corto", ROPA: "ropa-basica", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "mickey",
    nombre: "Raton Magico",
    categoria: "MOVIE",
    desc: "Orejas redondas y pantalon corto",
    config: { CUERPO: "cuerpo-oscuro", OJOS: "ojos-grandes", BOCA: "boca-gran-sonrisa", CABELLO: "cabello-nada", ROPA: "ropa-basica", ACCESORIO: "accesorio-nada" },
  },
];

// Mapa rápido por id
export const PERSONAJE_POR_ID: Record<string, PersonajeIconico> = Object.fromEntries(
  PERSONAJES_ICONICOS.map((p) => [p.id, p]),
);
