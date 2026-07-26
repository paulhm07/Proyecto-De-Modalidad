// Base de datos de personajes icónicos inspirados en anime, videojuegos y películas
// Estilo bloque 3D Roblox/Minecraft — sin emojis, solo iconos vectoriales

export type CategoriaPersonaje = "ANIME" | "GAMER" | "MOVIE" | "MUGIWARA" | "CAZADORES";

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
  MUGIWARA: "Piratas Mugiwara",
  CAZADORES: "Cazadores de Demonios",
};

export const CATEGORIA_PERSONAJE_ORDER: CategoriaPersonaje[] = ["ANIME", "GAMER", "MOVIE", "MUGIWARA", "CAZADORES"];

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
  // ===== PIRATAS MUGIWARA (One Piece) =====
  {
    id: "luffy",
    nombre: "Capitan Gomoso",
    categoria: "MUGIWARA",
    desc: "Sombrero de paja y chaqueta roja",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-gran-sonrisa", CABELLO: "cabello-corto", ROPA: "ropa-capas", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "zoro",
    nombre: "Cazador Pirata",
    categoria: "MUGIWARA",
    desc: "Pelo verde y tres katanas",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-normales", BOCA: "boca-serio", CABELLO: "cabello-corto", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-varita" },
  },
  {
    id: "nami",
    nombre: "Navegante Gato",
    categoria: "MUGIWARA",
    desc: "Pelo naranja y tatuaje de mandarina",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-sonrisa", CABELLO: "cabello-largo", ROPA: "ropa-basica", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "usopp",
    nombre: "Tirador Valiente",
    categoria: "MUGIWARA",
    desc: "Nariz larga y tirachinas",
    config: { CUERPO: "cuerpo-oscuro", OJOS: "ojos-grandes", BOCA: "boca-sonrisa", CABELLO: "cabello-corto", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-gafas" },
  },
  {
    id: "sanji",
    nombre: "Cocinero Rubio",
    categoria: "MUGIWARA",
    desc: "Traje negro y ceja rizada",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-normales", BOCA: "boca-serio", CABELLO: "cabello-corto", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "chopper",
    nombre: "Reno Medico",
    categoria: "MUGIWARA",
    desc: "Reno azul con gorro rosa",
    config: { CUERPO: "cuerpo-verde", OJOS: "ojos-grandes", BOCA: "boca-gran-sonrisa", CABELLO: "cabello-nada", ROPA: "ropa-basica", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "robin",
    nombre: "Arqueologa Oscura",
    categoria: "MUGIWARA",
    desc: "Pelo negro y gafas de sol",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-cerrados", BOCA: "boca-serio", CABELLO: "cabello-largo", ROPA: "ropa-basica", ACCESORIO: "accesorio-gafas-sol" },
  },
  {
    id: "franky",
    nombre: "Ciborg Carpintero",
    categoria: "MUGIWARA",
    desc: "Pelo azul y cuerpo metalico",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-gran-sonrisa", CABELLO: "cabello-mohawk", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-gafas-sol" },
  },
  {
    id: "brook",
    nombre: "Musico Esqueleto",
    categoria: "MUGIWARA",
    desc: "Esqueleto con afro y violin",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-cerrados", BOCA: "boca-sonrisa", CABELLO: "cabello-largo", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "jinbe",
    nombre: "Timonel Gyojin",
    categoria: "MUGIWARA",
    desc: "Piel azul y kimono de judo",
    config: { CUERPO: "cuerpo-oscuro", OJOS: "ojos-normales", BOCA: "boca-serio", CABELLO: "cabello-nada", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-nada" },
  },
  // ===== CAZADORES DE DEMONIOS (Kimetsu no Yaiba) =====
  // --- Protagonistas ---
  {
    id: "tanjiro",
    nombre: "Cazador Protector",
    categoria: "CAZADORES",
    desc: "Haori cuadriculado verde y espada negra",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-sonrisa", CABELLO: "cabello-corto", ROPA: "ropa-capas", ACCESORIO: "accesorio-varita" },
  },
  {
    id: "nezuko",
    nombre: "Demonio Hermana",
    categoria: "CAZADORES",
    desc: "Kimono rosa con bozal de bambu",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-serio", CABELLO: "cabello-largo", ROPA: "ropa-basica", ACCESORIO: "accesorio-mascara" },
  },
  {
    id: "zenitsu",
    nombre: "Rayo Asustadizo",
    categoria: "CAZADORES",
    desc: "Pelo amarillo y haori naranja",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-sonrisa", CABELLO: "cabello-corto", ROPA: "ropa-capas", ACCESORIO: "accesorio-varita" },
  },
  {
    id: "inosuke",
    nombre: "Jabali Salvaje",
    categoria: "CAZADORES",
    desc: "Mascara de jabali y dos espadas",
    config: { CUERPO: "cuerpo-oscuro", OJOS: "ojos-grandes", BOCA: "boca-gran-sonrisa", CABELLO: "cabello-nada", ROPA: "ropa-basica", ACCESORIO: "accesorio-mascara" },
  },
  {
    id: "kanao",
    nombre: "Mariposa Silenciosa",
    categoria: "CAZADORES",
    desc: "Coletas con horquilla de mariposa",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-serio", CABELLO: "cabello-largo", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-nada" },
  },
  // --- Pilares (Hashira) ---
  {
    id: "giyu",
    nombre: "Pilar del Agua",
    categoria: "CAZADORES",
    desc: "Haori bicolor rojo y naranja",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-normales", BOCA: "boca-serio", CABELLO: "cabello-corto", ROPA: "ropa-capas", ACCESORIO: "accesorio-varita" },
  },
  {
    id: "shinobu",
    nombre: "Pilar del Insecto",
    categoria: "CAZADORES",
    desc: "Haori de alas de mariposa moradas",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-sonrisa", CABELLO: "cabello-largo", ROPA: "ropa-capas", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "rengoku",
    nombre: "Pilar del Fuego",
    categoria: "CAZADORES",
    desc: "Pelo rojo y amarillo flameante",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-gran-sonrisa", CABELLO: "cabello-corto", ROPA: "ropa-capas", ACCESORIO: "accesorio-varita" },
  },
  {
    id: "tengen",
    nombre: "Pilar del Sonido",
    categoria: "CAZADORES",
    desc: "Pelo blanco y diadema con joyas",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-sonrisa", CABELLO: "cabello-corto", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-gafas" },
  },
  {
    id: "mitsuri",
    nombre: "Pilar del Amor",
    categoria: "CAZADORES",
    desc: "Pelo rosa y verde con coletas",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-sonrisa", CABELLO: "cabello-largo", ROPA: "ropa-basica", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "muichiro",
    nombre: "Pilar de la Niebla",
    categoria: "CAZADORES",
    desc: "Pelo negro largo con puntas menta",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-normales", BOCA: "boca-serio", CABELLO: "cabello-largo", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "gyomei",
    nombre: "Pilar de la Roca",
    categoria: "CAZADORES",
    desc: "Calvo gigante con rosario y maza",
    config: { CUERPO: "cuerpo-oscuro", OJOS: "ojos-cerrados", BOCA: "boca-serio", CABELLO: "cabello-nada", ROPA: "ropa-capas", ACCESORIO: "accesorio-nada" },
  },
  {
    id: "obanai",
    nombre: "Pilar de la Serpiente",
    categoria: "CAZADORES",
    desc: "Haori blanco y negro con serpiente",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-grandes", BOCA: "boca-serio", CABELLO: "cabello-corto", ROPA: "ropa-capas", ACCESORIO: "accesorio-mascara" },
  },
  {
    id: "sanemi",
    nombre: "Pilar del Viento",
    categoria: "CAZADORES",
    desc: "Pelo blanco espinoso con cicatrices",
    config: { CUERPO: "cuerpo-claro", OJOS: "ojos-normales", BOCA: "boca-serio", CABELLO: "cabello-mohawk", ROPA: "ropa-uniforme", ACCESORIO: "accesorio-varita" },
  },
];

// Mapa rápido por id
export const PERSONAJE_POR_ID: Record<string, PersonajeIconico> = Object.fromEntries(
  PERSONAJES_ICONICOS.map((p) => [p.id, p]),
);
