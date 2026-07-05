/**
 * El Bus de las Letras — Diseño de Niveles
 * -----------------------------------------
 * Minijuego educativo para 3er grado (MINED Nicaragua) — Módulo 3 Lengua y Literatura.
 *
 * Mecánica: Un bus escolar nicaragüense recorre una ruta. En cada parada sube
 * un pasajero con una tarjeta de palabras. El niño debe identificar la palabra
 * correcta según la consigna (sujeto, predicado, pronombre, etc.) y "subirla" al bus.
 *
 * Progresión pedagógica (estructura del texto → gramática → pronombres):
 *   N1   Sujeto simple (una palabra)
 *   N2   Sujeto compuesto (nombre + apellido)
 *   N3   Predicado simple
 *   N4   Predicado con adjetivo
 *   N5   Sujeto vs Predicado (identificar cuál es cuál)
 *   N6   Pronombre personal (él / ella)
 *   N7   Pronombre personal (ellos / ellas)
 *   N8   Estructura del texto: inicio
 *   N9   Estructura del texto: desarrollo
 *   N10  Estructura del texto: final / moraleja
 */

export interface NivelBus {
  nivel: number;
  tipo_ejercicio:
    | "sujeto_simple"
    | "sujeto_compuesto"
    | "predicado_simple"
    | "predicado_adjetivo"
    | "sujeto_vs_predicado"
    | "pronombre_el_ella"
    | "pronombre_ellos_ellas"
    | "estructura_inicio"
    | "estructura_desarrollo"
    | "estructura_final";
  parada: string; // nombre del lugar del bus
  consigna_para_nino: string; // instrucción visible
  enunciado: string; // oración o texto de referencia
  palabra_correcta: string;
  distractores: [string, string, string];
  feedback_error: string;
  avatar_pasajero: string; // emoji del pasajero en esta parada
}

export const nivelesBus: NivelBus[] = [
  {
    nivel: 1,
    tipo_ejercicio: "sujeto_simple",
    parada: "Mercado de Masaya",
    consigna_para_nino: "Tocá la palabra que es el SUJETO de la oración",
    enunciado: "María vende cuajadas en el mercado.",
    palabra_correcta: "María",
    distractores: ["vende", "cuajadas", "mercado"],
    feedback_error:
      "El sujeto es de quién se habla en la oración. Acá se habla de María. ¡Subila al bus!",
    avatar_pasajero: "🧒",
  },
  {
    nivel: 2,
    tipo_ejercicio: "sujeto_compuesto",
    parada: "Parque Central de León",
    consigna_para_nino: "Tocá el SUJETO completo (nombre + apellido)",
    enunciado: "Doña Rosa cocina nacatamales los domingos.",
    palabra_correcta: "Doña Rosa",
    distractores: ["Doña", "cocina", "nacatamales"],
    feedback_error:
      "El sujeto completo incluye nombre y quién es. Acá es 'Doña Rosa'. ¡Subila al bus!",
    avatar_pasajero: "👵",
  },
  {
    nivel: 3,
    tipo_ejercicio: "predicado_simple",
    parada: "Laguna de Masaya",
    consigna_para_nino: "Tocá la palabra que es el PREDICADO (acción)",
    enunciado: "El cacao crece en Matagalpa.",
    palabra_correcta: "crece",
    distractores: ["cacao", "en", "Matagalpa"],
    feedback_error:
      "El predicado dice qué hace el sujeto. Acá el cacao 'crece'. ¡Subí 'crece' al bus!",
    avatar_pasajero: "🧑",
  },
  {
    nivel: 4,
    tipo_ejercicio: "predicado_adjetivo",
    parada: "Calle La Calzada, Granada",
    consigna_para_nino: "Tocá el PREDICADO completo (acción + cómo)",
    enunciado: "El pinol blanco sabe delicioso.",
    palabra_correcta: "sabe delicioso",
    distractores: ["sabe", "delicioso", "El pinol"],
    feedback_error:
      "El predicado completo es toda la acción: 'sabe delicioso'. ¡No te lleves solo una parte!",
    avatar_pasajero: "👨",
  },
  {
    nivel: 5,
    tipo_ejercicio: "sujeto_vs_predicado",
    parada: "Mercado Oriental, Managua",
    consigna_para_nino: "Tocá solo el SUJETO de la oración",
    enunciado: "Los nancites maduran rápido en verano.",
    palabra_correcta: "Los nancites",
    distractores: ["maduran", "maduran rápido", "en verano"],
    feedback_error:
      "El sujeto es de quién hablamos. Acá son 'Los nancites'. ¡El resto es predicado!",
    avatar_pasajero: "👩",
  },
  {
    nivel: 6,
    tipo_ejercicio: "pronombre_el_ella",
    parada: "Frente a la Catedral de Granada",
    consigna_para_nino: "Tocá el pronombre que reemplaza a 'María'",
    enunciado: "María teje hamacas en Masaya.",
    palabra_correcta: "ella",
    distractores: ["él", "ellos", "ellas"],
    feedback_error:
      "María es una sola persona, mujer. Su pronombre es 'ella'. ¡Subila al bus!",
    avatar_pasajero: "👧",
  },
  {
    nivel: 7,
    tipo_ejercicio: "pronombre_ellos_ellas",
    parada: "Cooperativa de café, Jinotega",
    consigna_para_nino: "Tocá el pronombre que reemplaza a 'Jerson y Nahomi'",
    enunciado: "Jerson y Nahomi siembran cacao en la finca.",
    palabra_correcta: "ellos",
    distractores: ["ellas", "él", "ella"],
    feedback_error:
      "Jerson y Nahomi son dos personas, al menos un hombre. Su pronombre es 'ellos'. ¡A subir!",
    avatar_pasajero: "👫",
  },
  {
    nivel: 8,
    tipo_ejercicio: "estructura_inicio",
    parada: "Biblioteca pública de León",
    consigna_para_nino: "Tocá la palabra que abre el INICIO del cuento",
    enunciado: "Había una vez un coyote travieso en las sabanas de Carazo.",
    palabra_correcta: "Había",
    distractores: ["travieso", "coyote", "sabanas"],
    feedback_error:
      "El inicio de un cuento empieza presentando. 'Había' abre la historia. ¡Subila al bus!",
    avatar_pasajero: "🧓",
  },
  {
    nivel: 9,
    tipo_ejercicio: "estructura_desarrollo",
    parada: "Frente al Lago Cocibolca",
    consigna_para_nino: "Tocá la palabra del DESARROLLO (qué pasó después)",
    enunciado: "El coyote corrió tras el conejo por toda la sabana seca.",
    palabra_correcta: "corrió",
    distractores: ["coyote", "sabana", "seca"],
    feedback_error:
      "El desarrollo cuenta la acción principal. Acá es 'corrió'. ¡Subila al bus!",
    avatar_pasajero: "🦊",
  },
  {
    nivel: 10,
    tipo_ejercicio: "estructura_final",
    parada: "Última parada: Puerto Salvador Allende",
    consigna_para_nino: "Tocá la MORALEJA (enseñanza) del cuento",
    enunciado:
      "El conejo escapó. Moraleja: la astucia vence a la fuerza bruta.",
    palabra_correcta: "la astucia vence a la fuerza bruta",
    distractores: ["El conejo escapó", "fuerza bruta", "Moraleja"],
    feedback_error:
      "La moraleja es la enseñanza final. Acá: 'la astucia vence a la fuerza bruta'. ¡Subila!",
    avatar_pasajero: "🐰",
  },
];

export default nivelesBus;
