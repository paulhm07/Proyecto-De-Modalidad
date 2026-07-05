/**
 * Atrapa el Acento — Banco de Desafíos
 * --------------------------------------
 * Videojuego móvil de ritmo y velocidad ortográfica para 3er grado
 * (MINED Nicaragua, segundo semestre).
 *
 * Mecánica: Caen vocales con tilde flotando por la pantalla. El niño debe
 * "atrapar" la vocal correcta para completar la palabra en el momento justo
 * del compás. Cada palabra tiene su sílaba tónica marcada pero sin tilde.
 *
 * Progresión pedagógica:
 *   1–8   Agudas (con tilde, terminadas en n, s o vocal)
 *   9–13  Graves (con tilde, NO terminadas en n, s o vocal)
 *   14–20 Esdrújulas (siempre con tilde)
 *
 * Total: 20 desafíos.
 */

export interface DesafioAtrapa {
  id: string; // p.ej. "AC-01"
  palabra_completa: string; // forma final correcta, p.ej. "café"
  palabra_incompleta: string; // con guiones separando sílabas, sin tilde, ej. "ca-fe"
  silaba_tonica_index: number; // 0-based, cuál sílaba lleva el acento
  clasificacion: "Aguda" | "Grave" | "Esdrújula";
  letra_con_tilde_correcta: string; // vocal con tilde, p.ej. "é"
  posicion_x: "izquierda" | "centro" | "derecha";
  audio_guia: string; // pronunciación exagerada con sílaba tónica en MAYÚSCULAS
  bpm_sugerido: number; // tempo musical del nivel
  distracting_letters: string[]; // 2 vocales con tilde distractores que también caen
}

export const desafiosAtrapa: DesafioAtrapa[] = [
  // ===== AGUDAS (1-8) — introducción, tempo alegre =====
  {
    id: "AC-01",
    palabra_completa: "café",
    palabra_incompleta: "ca-fe",
    silaba_tonica_index: 1,
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "é",
    posicion_x: "centro",
    audio_guia: "ca-FÉÉÉ (con alargue en la última)",
    bpm_sugerido: 90,
    distracting_letters: ["á", "í"],
  },
  {
    id: "AC-02",
    palabra_completa: "también",
    palabra_incompleta: "tam-bien",
    silaba_tonica_index: 1,
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "é",
    posicion_x: "izquierda",
    audio_guia: "tam-bi-ÉÉÉN (la fuerza va al final)",
    bpm_sugerido: 92,
    distracting_letters: ["á", "ó"],
  },
  {
    id: "AC-03",
    palabra_completa: "canción",
    palabra_incompleta: "can-cion",
    silaba_tonica_index: 1,
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "ó",
    posicion_x: "derecha",
    audio_guia: "can-CIÓÓÓN (alargue nasal en la o)",
    bpm_sugerido: 95,
    distracting_letters: ["é", "ú"],
  },
  {
    id: "AC-04",
    palabra_completa: "León",
    palabra_incompleta: "le-on",
    silaba_tonica_index: 1,
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "ó",
    posicion_x: "centro",
    audio_guia: "le-ÓÓÓN (como rugiendo un león)",
    bpm_sugerido: 95,
    distracting_letters: ["é", "á"],
  },
  {
    id: "AC-05",
    palabra_completa: "camión",
    palabra_incompleta: "ca-mion",
    silaba_tonica_index: 1,
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "ó",
    posicion_x: "izquierda",
    audio_guia: "ca-MIÓÓÓN (sonido de motor al final)",
    bpm_sugerido: 98,
    distracting_letters: ["é", "í"],
  },
  {
    id: "AC-06",
    palabra_completa: "jabón",
    palabra_incompleta: "ja-bon",
    silaba_tonica_index: 1,
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "ó",
    posicion_x: "derecha",
    audio_guia: "ja-BÓÓÓN (sílaba final con fuerza)",
    bpm_sugerido: 100,
    distracting_letters: ["é", "á"],
  },
  {
    id: "AC-07",
    palabra_completa: "sofá",
    palabra_incompleta: "so-fa",
    silaba_tonica_index: 1,
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "á",
    posicion_x: "centro",
    audio_guia: "so-FÁÁÁ (última sílaba muy marcada)",
    bpm_sugerido: 102,
    distracting_letters: ["é", "í"],
  },
  {
    id: "AC-08",
    palabra_completa: "colibrí",
    palabra_incompleta: "co-li-bri",
    silaba_tonica_index: 2,
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "í",
    posicion_x: "derecha",
    audio_guia: "co-li-BRÍÍÍ (aguda como el piquito del pajarito)",
    bpm_sugerido: 105,
    distracting_letters: ["á", "é"],
  },

  // ===== GRAVES (9-13) — sube la dificultad, tempo medio =====
  {
    id: "AC-09",
    palabra_completa: "lápiz",
    palabra_incompleta: "la-piz",
    silaba_tonica_index: 0,
    clasificacion: "Grave",
    letra_con_tilde_correcta: "á",
    posicion_x: "izquierda",
    audio_guia: "LÁÁÁ-piz (la fuerza va en la primera)",
    bpm_sugerido: 100,
    distracting_letters: ["é", "í"],
  },
  {
    id: "AC-10",
    palabra_completa: "árbol",
    palabra_incompleta: "ar-bol",
    silaba_tonica_index: 0,
    clasificacion: "Grave",
    letra_con_tilde_correcta: "á",
    posicion_x: "centro",
    audio_guia: "ÁÁÁR-bol (primera sílaba con peso, como raíz)",
    bpm_sugerido: 102,
    distracting_letters: ["é", "ó"],
  },
  {
    id: "AC-11",
    palabra_completa: "difícil",
    palabra_incompleta: "di-fi-cil",
    silaba_tonica_index: 1,
    clasificacion: "Grave",
    letra_con_tilde_correcta: "í",
    posicion_x: "derecha",
    audio_guia: "di-FÍÍÍ-cil (la del medio es la fuerte)",
    bpm_sugerido: 105,
    distracting_letters: ["á", "é"],
  },
  {
    id: "AC-12",
    palabra_completa: "azúcar",
    palabra_incompleta: "a-zu-car",
    silaba_tonica_index: 1,
    clasificacion: "Grave",
    letra_con_tilde_correcta: "ú",
    posicion_x: "izquierda",
    audio_guia: "a-ZÚÚÚ-car (dulcecita la del medio)",
    bpm_sugerido: 108,
    distracting_letters: ["á", "ó"],
  },
  {
    id: "AC-13",
    palabra_completa: "cárcel",
    palabra_incompleta: "car-cel",
    silaba_tonica_index: 0,
    clasificacion: "Grave",
    letra_con_tilde_correcta: "á",
    posicion_x: "centro",
    audio_guia: "CÁÁÁR-cel (fuerza al principio)",
    bpm_sugerido: 110,
    distracting_letters: ["é", "ó"],
  },

  // ===== ESDRÚJULAS (14-20) — máximo desafío, tempo rápido =====
  {
    id: "AC-14",
    palabra_completa: "música",
    palabra_incompleta: "mu-si-ca",
    silaba_tonica_index: 0,
    clasificacion: "Esdrújula",
    letra_con_tilde_correcta: "ú",
    posicion_x: "centro",
    audio_guia: "MÚÚÚ-si-ca (siempre con tilde, fuerza atrás)",
    bpm_sugerido: 110,
    distracting_letters: ["á", "í"],
  },
  {
    id: "AC-15",
    palabra_completa: "rápido",
    palabra_incompleta: "ra-pi-do",
    silaba_tonica_index: 0,
    clasificacion: "Esdrújula",
    letra_con_tilde_correcta: "á",
    posicion_x: "izquierda",
    audio_guia: "RÁÁÁ-pi-do (veloz como su nombre)",
    bpm_sugerido: 112,
    distracting_letters: ["é", "í"],
  },
  {
    id: "AC-16",
    palabra_completa: "sábado",
    palabra_incompleta: "sa-ba-do",
    silaba_tonica_index: 0,
    clasificacion: "Esdrújula",
    letra_con_tilde_correcta: "á",
    posicion_x: "derecha",
    audio_guia: "SÁÁÁ-ba-do (día de descanso, fuerza al inicio)",
    bpm_sugerido: 115,
    distracting_letters: ["é", "ú"],
  },
  {
    id: "AC-17",
    palabra_completa: "plátano",
    palabra_incompleta: "pla-ta-no",
    silaba_tonica_index: 0,
    clasificacion: "Esdrújula",
    letra_con_tilde_correcta: "á",
    posicion_x: "centro",
    audio_guia: "PLÁÁÁ-ta-no (¡como morder el plátano nicaragüense!)",
    bpm_sugerido: 118,
    distracting_letters: ["é", "í"],
  },
  {
    id: "AC-18",
    palabra_completa: "página",
    palabra_incompleta: "pa-gi-na",
    silaba_tonica_index: 0,
    clasificacion: "Esdrújula",
    letra_con_tilde_correcta: "á",
    posicion_x: "izquierda",
    audio_guia: "PÁÁÁ-gi-na (como abrir el libro de MINED)",
    bpm_sugerido: 120,
    distracting_letters: ["é", "í"],
  },
  {
    id: "AC-19",
    palabra_completa: "murciélago",
    palabra_incompleta: "mur-cie-la-go",
    silaba_tonica_index: 2,
    clasificacion: "Esdrújula",
    letra_con_tilde_correcta: "é",
    posicion_x: "derecha",
    audio_guia: "mur-ci-ÉÉÉ-la-go (vuela fuerte la tercera)",
    bpm_sugerido: 122,
    distracting_letters: ["á", "í"],
  },
  {
    id: "AC-20",
    palabra_completa: "esdrújula",
    palabra_incompleta: "es-dru-ju-la",
    silaba_tonica_index: 1,
    clasificacion: "Esdrújula",
    letra_con_tilde_correcta: "ú",
    posicion_x: "centro",
    audio_guia: "es-DRÚÚÚ-ju-la (la palabra que las nombra a todas)",
    bpm_sugerido: 125,
    distracting_letters: ["á", "é"],
  },
];

// Helpers
export const agudasAtrapa = desafiosAtrapa.filter((d) => d.clasificacion === "Aguda");
export const gravesAtrapa = desafiosAtrapa.filter((d) => d.clasificacion === "Grave");
export const esdrujulasAtrapa = desafiosAtrapa.filter((d) => d.clasificacion === "Esdrújula");

export const RESUMEN_ATRAPA_ACENTO = {
  total_desafios: desafiosAtrapa.length,
  agudas: agudasAtrapa.length,
  graves: gravesAtrapa.length,
  esdrujulas: esdrujulasAtrapa.length,
  bpm_min: 90,
  bpm_max: 125,
  vocales_con_tilde_usadas: ["á", "é", "í", "ó", "ú"],
};

export default desafiosAtrapa;
