/**
 * Atrapa el Acento — Diseño de 20 Desafíos
 * ------------------------------------------
 * Minijuego de ritmo y velocidad ortográfica para 3er grado
 * (segundo semestre MINED Nicaragua).
 *
 * Mecánica: Aparece una palabra incompleta (sin tilde) en pantalla.
 * Tres vocales flotantes con tilde se mueven por la pantalla (¡/¿/ó/á...).
 * El niño debe "atrapar" (tocar rápido) la vocal con tilde correcta
 * antes de que salga de la pantalla. El audio guía refuerza la
 * pronunciación exagerada de la sílaba tónica.
 *
 * Progresión pedagógica:
 *   1-7  Agudas (7 desafíos)       → terminadas en n, s, vocal
 *   8-15 Graves (8 desafíos)       → terminadas en consonante (no n/s)
 *   16-20 Esdrújulas (5 desafíos)  → siempre con tilde
 *
 * Distribución de Posición_X:
 *   - Variación rotativa (centro → derecha → izquierda) para que el
 *     niño no memorice la posición y deba leer la palabra.
 */

export interface DesafioAtrapa {
  id: string; // p.ej. "AA-001"
  palabra_completa: string; // palabra con tilde (referencia)
  palabra_incompleta: string; // silabeada sin tilde, ej. "ca-fe"
  clasificacion: "Aguda" | "Grave" | "Esdrújula";
  letra_con_tilde_correcta: string; // vocal con tilde, ej. "é"
  posicion_x: "izquierda" | "centro" | "derecha";
  audio_guia: string; // pronunciación exagerada, mayúscula = sílaba tónica
  silaba_tonica: number; // cuál sílaba se acentúa (1=última, 2=penúltima, 3=antepenúltima)
  distractores: [string, string]; // 2 vocales con tilde incorrectas (flotantes)
  regla: string; // regla ortográfica breve
}

export const desafiosAtrapa: DesafioAtrapa[] = [
  // ====== AGUDAS (1-7) ======
  {
    id: "AA-001",
    palabra_completa: "café",
    palabra_incompleta: "ca-fe",
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "é",
    posicion_x: "centro",
    audio_guia: "ca-FÉÉÉ",
    silaba_tonica: 1,
    distractores: ["á", "í"],
    regla: "Aguda terminada en vocal: lleva tilde.",
  },
  {
    id: "AA-002",
    palabra_completa: "camión",
    palabra_incompleta: "ca-mion",
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "ó",
    posicion_x: "derecha",
    audio_guia: "ca-MIÓN",
    silaba_tonica: 1,
    distractores: ["o", "ú"],
    regla: "Aguda terminada en 'n': lleva tilde.",
  },
  {
    id: "AA-003",
    palabra_completa: "vigorón",
    palabra_incompleta: "vi-go-ron",
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "ó",
    posicion_x: "izquierda",
    audio_guia: "vi-go-RÓN",
    silaba_tonica: 1,
    distractores: ["o", "á"],
    regla: "Aguda terminada en 'n': lleva tilde. (Comida típica nicaragüense)",
  },
  {
    id: "AA-004",
    palabra_completa: "colibrí",
    palabra_incompleta: "co-li-bri",
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "í",
    posicion_x: "centro",
    audio_guia: "co-li-BRÍÍÍ",
    silaba_tonica: 1,
    distractores: ["i", "é"],
    regla: "Aguda terminada en vocal: lleva tilde.",
  },
  {
    id: "AA-005",
    palabra_completa: "bambú",
    palabra_incompleta: "bam-bu",
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "ú",
    posicion_x: "derecha",
    audio_guia: "bam-BÚÚÚ",
    silaba_tonica: 1,
    distractores: ["u", "ó"],
    regla: "Aguda terminada en vocal: lleva tilde.",
  },
  {
    id: "AA-006",
    palabra_completa: "canción",
    palabra_incompleta: "can-cion",
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "ó",
    posicion_x: "izquierda",
    audio_guia: "can-CIÓN",
    silaba_tonica: 1,
    distractores: ["o", "é"],
    regla: "Aguda terminada en 'n': lleva tilde.",
  },
  {
    id: "AA-007",
    palabra_completa: "León",
    palabra_incompleta: "Le-on",
    clasificacion: "Aguda",
    letra_con_tilde_correcta: "ó",
    posicion_x: "centro",
    audio_guia: "le-ÓN",
    silaba_tonica: 1,
    distractores: ["o", "á"],
    regla: "Aguda terminada en 'n': lleva tilde. (Departamento de Nicaragua)",
  },

  // ====== GRAVES (8-15) ======
  {
    id: "AA-008",
    palabra_completa: "árbol",
    palabra_incompleta: "ar-bol",
    clasificacion: "Grave",
    letra_con_tilde_correcta: "á",
    posicion_x: "derecha",
    audio_guia: "ÁR-bol",
    silaba_tonica: 2,
    distractores: ["a", "é"],
    regla: "Grave terminada en 'l' (no n/s): lleva tilde.",
  },
  {
    id: "AA-009",
    palabra_completa: "lápiz",
    palabra_incompleta: "la-piz",
    clasificacion: "Grave",
    letra_con_tilde_correcta: "á",
    posicion_x: "izquierda",
    audio_guia: "LÁ-piz",
    silaba_tonica: 2,
    distractores: ["a", "í"],
    regla: "Grave terminada en 'z' (no n/s): lleva tilde.",
  },
  {
    id: "AA-010",
    palabra_completa: "fácil",
    palabra_incompleta: "fa-cil",
    clasificacion: "Grave",
    letra_con_tilde_correcta: "á",
    posicion_x: "centro",
    audio_guia: "FÁ-cil",
    silaba_tonica: 2,
    distractores: ["a", "ó"],
    regla: "Grave terminada en 'l' (no n/s): lleva tilde.",
  },
  {
    id: "AA-011",
    palabra_completa: "Pérez",
    palabra_incompleta: "Pe-rez",
    clasificacion: "Grave",
    letra_con_tilde_correcta: "é",
    posicion_x: "derecha",
    audio_guia: "PÉ-rez",
    silaba_tonica: 2,
    distractores: ["e", "á"],
    regla: "Grave terminada en 'z' (no n/s): lleva tilde. (Apellido común)",
  },
  {
    id: "AA-012",
    palabra_completa: "Sánchez",
    palabra_incompleta: "San-chez",
    clasificacion: "Grave",
    letra_con_tilde_correcta: "á",
    posicion_x: "izquierda",
    audio_guia: "SÁN-chez",
    silaba_tonica: 2,
    distractores: ["a", "é"],
    regla: "Grave terminada en 'z' (no n/s): lleva tilde. (Apellido común)",
  },
  {
    id: "AA-013",
    palabra_completa: "móvil",
    palabra_incompleta: "mo-vil",
    clasificacion: "Grave",
    letra_con_tilde_correcta: "ó",
    posicion_x: "centro",
    audio_guia: "MÓ-vil",
    silaba_tonica: 2,
    distractores: ["o", "á"],
    regla: "Grave terminada en 'l' (no n/s): lleva tilde.",
  },
  {
    id: "AA-014",
    palabra_completa: "cárcel",
    palabra_incompleta: "car-cel",
    clasificacion: "Grave",
    letra_con_tilde_correcta: "á",
    posicion_x: "derecha",
    audio_guia: "CÁR-cel",
    silaba_tonica: 2,
    distractores: ["a", "é"],
    regla: "Grave terminada en 'l' (no n/s): lleva tilde.",
  },
  {
    id: "AA-015",
    palabra_completa: "huésped",
    palabra_incompleta: "hues-ped",
    clasificacion: "Grave",
    letra_con_tilde_correcta: "é",
    posicion_x: "izquierda",
    audio_guia: "HUÉS-ped",
    silaba_tonica: 2,
    distractores: ["e", "á"],
    regla: "Grave terminada en 'd' (no n/s): lleva tilde.",
  },

  // ====== ESDRÚJULAS (16-20) ======
  {
    id: "AA-016",
    palabra_completa: "música",
    palabra_incompleta: "mu-si-ca",
    clasificacion: "Esdrújula",
    letra_con_tilde_correcta: "ú",
    posicion_x: "centro",
    audio_guia: "MÚ-si-ca",
    silaba_tonica: 3,
    distractores: ["u", "á"],
    regla: "Esdrújula: siempre lleva tilde.",
  },
  {
    id: "AA-017",
    palabra_completa: "pájaro",
    palabra_incompleta: "pa-ja-ro",
    clasificacion: "Esdrújula",
    letra_con_tilde_correcta: "á",
    posicion_x: "derecha",
    audio_guia: "PÁ-ja-ro",
    silaba_tonica: 3,
    distractores: ["a", "ó"],
    regla: "Esdrújula: siempre lleva tilde.",
  },
  {
    id: "AA-018",
    palabra_completa: "sábado",
    palabra_incompleta: "sa-ba-do",
    clasificacion: "Esdrújula",
    letra_con_tilde_correcta: "á",
    posicion_x: "izquierda",
    audio_guia: "SÁ-ba-do",
    silaba_tonica: 3,
    distractores: ["a", "ú"],
    regla: "Esdrújula: siempre lleva tilde. (Feria de Masaya es los sábados)",
  },
  {
    id: "AA-019",
    palabra_completa: "rápido",
    palabra_incompleta: "ra-pi-do",
    clasificacion: "Esdrújula",
    letra_con_tilde_correcta: "á",
    posicion_x: "centro",
    audio_guia: "RÁ-pi-do",
    silaba_tonica: 3,
    distractores: ["a", "é"],
    regla: "Esdrújula: siempre lleva tilde.",
  },
  {
    id: "AA-020",
    palabra_completa: "médico",
    palabra_incompleta: "me-di-co",
    clasificacion: "Esdrújula",
    letra_con_tilde_correcta: "é",
    posicion_x: "derecha",
    audio_guia: "MÉ-di-co",
    silaba_tonica: 3,
    distractores: ["e", "á"],
    regla: "Esdrújula: siempre lleva tilde. (El médico del MINSA)",
  },
];

// Helpers
export const agudas = desafiosAtrapa.filter((d) => d.clasificacion === "Aguda");
export const graves = desafiosAtrapa.filter((d) => d.clasificacion === "Grave");
export const esdrujulas = desafiosAtrapa.filter(
  (d) => d.clasificacion === "Esdrújula",
);

export const RESUMEN_ATRAPA = {
  total: desafiosAtrapa.length,
  agudas: agudas.length,
  graves: graves.length,
  esdrujulas: esdrujulas.length,
  vocabulario_nicaraguense: ["vigorón", "León", "sábado (feria Masaya)"],
};

export default desafiosAtrapa;
