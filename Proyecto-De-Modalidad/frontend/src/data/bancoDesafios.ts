// =============================================================================
// 📚 BANCO DE DESAFÍOS — EducaPlay
// -----------------------------------------------------------------------------
// 30 desafíos curriculares para 3.er grado de primaria (8-9 años)
//   • 15 de Matemáticas (5 Fácil · 5 Medio · 5 Difícil)
//   • 15 de Lengua y Literatura (5 Fácil · 5 Medio · 5 Difícil)
//
// Formato de salida solicitado por el usuario (Android Studio / Kotlin data class):
//
//   data class Desafio(
//       val id: String,                       // Ej. "MAT_FACIL_01"
//       val materia: String,                  // "Matemáticas" | "Lengua"
//       val dificultad: String,               // "Fácil" | "Medio" | "Difícil"
//       val tipo_mecanica: String,            // "Opción Múltiple" | "Arrastrar y Soltar" | "Completar Espacio"
//       val enunciado: String,                // Pregunta clara y corta
//       val opciones: List<String>,           // 3 opciones cortas
//       val respuesta_correcta: String,       // Debe coincidir exactamente con una de `opciones`
//       val pista_retroalimentacion: String   // Frase amigable de ayuda si el niño falla
//   )
//
// Paletas curriculares:
//   MAT_FACIL   → Sumas/restas 3 dígitos sin llevar + figuras (vértices/lados)
//   MAT_MEDIO   → Multiplicaciones 1 cifra (tablas 2-9) problemas cotidianos + fracciones simples visuales
//   MAT_DIFICIL → Divisiones exactas simples + sucesiones lógicas + lógica 2 pasos
//   LEN_FACIL   → Sinónimos/antónimos sencillos + separación en sílabas
//   LEN_MEDIO   → Sustantivos propios/comunes + verbos (presente/pasado/futuro) + uso b/v, c/s/z
//   LEN_DIFICIL → Comprensión lectora micro-historias (idea principal) + sujeto/predicado
// =============================================================================

export type Materia = "Matemáticas" | "Lengua";
export type Dificultad = "Fácil" | "Medio" | "Difícil";
export type TipoMecanica = "Opción Múltiple" | "Arrastrar y Soltar" | "Completar Espacio";

export interface DesafioBanco {
  id: string;
  materia: Materia;
  dificultad: Dificultad;
  tipo_mecanica: TipoMecanica;
  enunciado: string;
  opciones: string[];
  respuesta_correcta: string;
  pista_retroalimentacion: string;
}

export const BANCO_DESAFIOS: DesafioBanco[] = [
  // ===========================================================================
  // 🧮 MATEMÁTICAS — NIVEL FÁCIL (5)
  //   Suma/resta 3 dígitos sin llevar + figuras geométricas (vértices/lados)
  // ===========================================================================
  {
    id: "MAT_FACIL_01",
    materia: "Matemáticas",
    dificultad: "Fácil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "¿Cuánto es 124 + 213?",
    opciones: ["337", "327", "347"],
    respuesta_correcta: "337",
    pista_retroalimentacion: "Suma primero las unidades: 4 + 3 = 7. ¡Luego decenas y centenas!"
  },
  {
    id: "MAT_FACIL_02",
    materia: "Matemáticas",
    dificultad: "Fácil",
    tipo_mecanica: "Completar Espacio",
    enunciado: "Completa la operación: 458 − ___ = 221",
    opciones: ["237", "227", "247"],
    respuesta_correcta: "237",
    pista_retroalimentacion: "Resta unidades: 8 − 7 = 1, decenas: 5 − 3 = 2, centenas: 4 − 2 = 2."
  },
  {
    id: "MAT_FACIL_03",
    materia: "Matemáticas",
    dificultad: "Fácil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "¿Qué figura geométrica tiene 3 vértices?",
    opciones: ["Triángulo", "Cuadrado", "Círculo"],
    respuesta_correcta: "Triángulo",
    pista_retroalimentacion: "Tri- significa tres. ¡Un triángulo tiene 3 esquinas (vértices)!"
  },
  {
    id: "MAT_FACIL_04",
    materia: "Matemáticas",
    dificultad: "Fácil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "¿Cuántos lados tiene un cuadrado?",
    opciones: ["4 lados", "3 lados", "5 lados"],
    respuesta_correcta: "4 lados",
    pista_retroalimentacion: "Cuenta los bordes rectos del cuadrado: 1, 2, 3, 4 lados."
  },
  {
    id: "MAT_FACIL_05",
    materia: "Matemáticas",
    dificultad: "Fácil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "Juan tiene 312 canicas y gana 124 más. ¿Cuántas tiene ahora?",
    opciones: ["436", "426", "446"],
    respuesta_correcta: "436",
    pista_retroalimentacion: "Suma 312 + 124 sin llevar. ¡Empieza por las unidades!"
  },

  // ===========================================================================
  // 🧮 MATEMÁTICAS — NIVEL MEDIO (5)
  //   Multiplicaciones 1 cifra (tablas 2-9) problemas cotidianos + fracciones
  // ===========================================================================
  {
    id: "MAT_MEDIO_01",
    materia: "Matemáticas",
    dificultad: "Medio",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "Hay 6 cajas con 4 lápices cada una. ¿Cuántos lápices hay en total?",
    opciones: ["24", "10", "28"],
    respuesta_correcta: "24",
    pista_retroalimentacion: "Multiplica 6 × 4. ¡Cuenta de 4 en 4, seis veces: 4, 8, 12...!"
  },
  {
    id: "MAT_MEDIO_02",
    materia: "Matemáticas",
    dificultad: "Medio",
    tipo_mecanica: "Completar Espacio",
    enunciado: "Completa: 7 × 8 = ___",
    opciones: ["56", "54", "63"],
    respuesta_correcta: "56",
    pista_retroalimentacion: "Truco: 5, 6, 7, 8 → 56 = 7 × 8. ¡Recuerda este pareo!"
  },
  {
    id: "MAT_MEDIO_03",
    materia: "Matemáticas",
    dificultad: "Medio",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "Cada paquete trae 5 galletas. Compro 9 paquetes. ¿Cuántas galletas tengo?",
    opciones: ["45", "40", "50"],
    respuesta_correcta: "45",
    pista_retroalimentacion: "Multiplica 5 × 9. ¡La tabla del 5 termina siempre en 0 o en 5!"
  },
  {
    id: "MAT_MEDIO_04",
    materia: "Matemáticas",
    dificultad: "Medio",
    tipo_mecanica: "Arrastrar y Soltar",
    enunciado: "Parto una pizza en 2 partes iguales y tomo 1. Arrastra la fracción que tomé.",
    opciones: ["1/2 (un medio)", "1/4 (un cuarto)", "1/3 (un tercio)"],
    respuesta_correcta: "1/2 (un medio)",
    pista_retroalimentacion: "2 partes iguales = medios. Tomé 1 de 2 partes, ¡es un medio!"
  },
  {
    id: "MAT_MEDIO_05",
    materia: "Matemáticas",
    dificultad: "Medio",
    tipo_mecanica: "Arrastrar y Soltar",
    enunciado: "Un chocolate se parte en 4 pedazos iguales y como 1. Arrastra la fracción correcta.",
    opciones: ["1/4 (un cuarto)", "1/2 (un medio)", "3/4 (tres cuartos)"],
    respuesta_correcta: "1/4 (un cuarto)",
    pista_retroalimentacion: "4 partes iguales = cuartos. Comí 1 de 4 pedazos, ¡es un cuarto!"
  },

  // ===========================================================================
  // 🧮 MATEMÁTICAS — NIVEL DIFÍCIL (5)
  //   Divisiones exactas simples + sucesiones + lógica 2 pasos
  // ===========================================================================
  {
    id: "MAT_DIFICIL_01",
    materia: "Matemáticas",
    dificultad: "Difícil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "¿Cuánto es 24 ÷ 6?",
    opciones: ["4", "6", "5"],
    respuesta_correcta: "4",
    pista_retroalimentacion: "Piensa: ¿6 × ? = 24? La tabla del 6 te ayuda: 6 × 4 = 24."
  },
  {
    id: "MAT_DIFICIL_02",
    materia: "Matemáticas",
    dificultad: "Difícil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "Reparto 18 caramelos entre 3 amigos en partes iguales. ¿Cuántos toca a cada uno?",
    opciones: ["6", "5", "9"],
    respuesta_correcta: "6",
    pista_retroalimentacion: "Divide 18 ÷ 3. ¡Busca qué número multiplicado por 3 da 18!"
  },
  {
    id: "MAT_DIFICIL_03",
    materia: "Matemáticas",
    dificultad: "Difícil",
    tipo_mecanica: "Completar Espacio",
    enunciado: "Descubre el patrón y completa: 3, 6, 9, 12, ___",
    opciones: ["15", "14", "18"],
    respuesta_correcta: "15",
    pista_retroalimentacion: "Suma 3 cada vez: 3, 6, 9, 12... ¡el siguiente es 12 + 3 = 15!"
  },
  {
    id: "MAT_DIFICIL_04",
    materia: "Matemáticas",
    dificultad: "Difícil",
    tipo_mecanica: "Completar Espacio",
    enunciado: "Continúa la serie: 2, 4, 8, 16, ___",
    opciones: ["32", "24", "20"],
    respuesta_correcta: "32",
    pista_retroalimentacion: "Cada número se multiplica por 2: 2×2=4, 4×2=8... ¡sigue duplicando!"
  },
  {
    id: "MAT_DIFICIL_05",
    materia: "Matemáticas",
    dificultad: "Difícil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "Tengo 3 bolsas con 5 manzanas cada una y regalo 4. ¿Cuántas me quedan?",
    opciones: ["11", "15", "9"],
    respuesta_correcta: "11",
    pista_retroalimentacion: "Dos pasos: primero 3 × 5 = 15, luego 15 − 4 = 11. ¡Tú puedes!"
  },

  // ===========================================================================
  // 📖 LENGUA Y LITERATURA — NIVEL FÁCIL (5)
  //   Sinónimos/antónimos sencillos + separación en sílabas
  // ===========================================================================
  {
    id: "LEN_FACIL_01",
    materia: "Lengua",
    dificultad: "Fácil",
    tipo_mecanica: "Arrastrar y Soltar",
    enunciado: "Arrastra el sinónimo de la palabra «grande».",
    opciones: ["enorme", "chico", "feo"],
    respuesta_correcta: "enorme",
    pista_retroalimentacion: "Busca la palabra que describe algo de gran tamaño. ¡Chico es lo opuesto!"
  },
  {
    id: "LEN_FACIL_02",
    materia: "Lengua",
    dificultad: "Fácil",
    tipo_mecanica: "Arrastrar y Soltar",
    enunciado: "Arrastra el antónimo de la palabra «frío».",
    opciones: ["caliente", "tibio", "helado"],
    respuesta_correcta: "caliente",
    pista_retroalimentacion: "El antónimo es lo opuesto. ¡Lo opuesto de frío es caliente!"
  },
  {
    id: "LEN_FACIL_03",
    materia: "Lengua",
    dificultad: "Fácil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "¿Cuántas sílabas tiene la palabra «ca-ma»?",
    opciones: ["2 sílabas", "3 sílabas", "1 sílaba"],
    respuesta_correcta: "2 sílabas",
    pista_retroalimentacion: "Separa la palabra con palmadas: ca-ma. ¡Dos palmadas, dos sílabas!"
  },
  {
    id: "LEN_FACIL_04",
    materia: "Lengua",
    dificultad: "Fácil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "¿Cuántas sílabas tiene la palabra «ma-ri-po-sa»?",
    opciones: ["4 sílabas", "3 sílabas", "5 sílabas"],
    respuesta_correcta: "4 sílabas",
    pista_retroalimentacion: "Cuenta cada pedacito: ma-ri-po-sa. ¡Cuatro sílabas!"
  },
  {
    id: "LEN_FACIL_05",
    materia: "Lengua",
    dificultad: "Fácil",
    tipo_mecanica: "Arrastrar y Soltar",
    enunciado: "Arrastra el sinónimo de la palabra «feliz».",
    opciones: ["contento", "triste", "cansado"],
    respuesta_correcta: "contento",
    pista_retroalimentacion: "Piensa cómo te sientes cuando estás feliz: ¡contento!"
  },

  // ===========================================================================
  // 📖 LENGUA Y LITERATURA — NIVEL MEDIO (5)
  //   Sustantivos propios/comunes + verbos (tiempo) + uso b/v, c/s/z
  // ===========================================================================
  {
    id: "LEN_MEDIO_01",
    materia: "Lengua",
    dificultad: "Medio",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "¿Cuál de estas palabras es un sustantivo común?",
    opciones: ["perro", "México", "Ana"],
    respuesta_correcta: "perro",
    pista_retroalimentacion: "Los sustantivos comunes no llevan mayúscula. ¡«perro» es común!"
  },
  {
    id: "LEN_MEDIO_02",
    materia: "Lengua",
    dificultad: "Medio",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "¿Cuál de estas palabras es un sustantivo propio?",
    opciones: ["Colombia", "ciudad", "río"],
    respuesta_correcta: "Colombia",
    pista_retroalimentacion: "Los nombres propios se escriben con mayúscula inicial. ¡Como los países!"
  },
  {
    id: "LEN_MEDIO_03",
    materia: "Lengua",
    dificultad: "Medio",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "En «Yo juego en el parque», ¿en qué tiempo está el verbo «juego»?",
    opciones: ["Presente", "Pasado", "Futuro"],
    respuesta_correcta: "Presente",
    pista_retroalimentacion: "Si ocurre ahora mismo, es presente. ¡Yo juego = ocurre hoy!"
  },
  {
    id: "LEN_MEDIO_04",
    materia: "Lengua",
    dificultad: "Medio",
    tipo_mecanica: "Completar Espacio",
    enunciado: "Completa con b o v: «En ___ierno hace frío»",
    opciones: ["invierno (con v)", "imbierno (con b)", "inbierno (con b)"],
    respuesta_correcta: "invierno (con v)",
    pista_retroalimentacion: "Después de la letra «n» se escribe «v». ¡In-vierno!"
  },
  {
    id: "LEN_MEDIO_05",
    materia: "Lengua",
    dificultad: "Medio",
    tipo_mecanica: "Completar Espacio",
    enunciado: "Completa con c, s o z: «El pájaro ___anta en el árbol»",
    opciones: ["canta (con c)", "santa (con s)", "zanta (con z)"],
    respuesta_correcta: "canta (con c)",
    pista_retroalimentacion: "Antes de «a» se usa «c» para el sonido /k/. ¡Ca, co, cu se escriben con c!"
  },

  // ===========================================================================
  // 📖 LENGUA Y LITERATURA — NIVEL DIFÍCIL (5)
  //   Comprensión lectora micro-historias + sujeto/predicado
  // ===========================================================================
  {
    id: "LEN_DIFICIL_01",
    materia: "Lengua",
    dificultad: "Difícil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "Lee: «Lucía fue al zoológico y vio leones, monos y elefantes. Su animal favorito fue el león.» ¿De qué trata principalmente el texto?",
    opciones: [
      "De la visita de Lucía al zoológico",
      "De los leones del zoológico",
      "De los animales del bosque"
    ],
    respuesta_correcta: "De la visita de Lucía al zoológico",
    pista_retroalimentacion: "La idea principal resume TODO el texto. ¡No te fijes solo en una parte!"
  },
  {
    id: "LEN_DIFICIL_02",
    materia: "Lengua",
    dificultad: "Difícil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "Lee: «Pedro sembró una semilla. La regó cada día. Después de dos semanas, brotó una plantita.» ¿Qué hizo Pedro?",
    opciones: [
      "Cuidó una semilla hasta que brotó",
      "Compró una plantita ya hecha",
      "Pintó un árbol grande"
    ],
    respuesta_correcta: "Cuidó una semilla hasta que brotó",
    pista_retroalimentacion: "Sigue las acciones de Pedro en orden: sembró, regó, brotó. ¡Eso es cuidar!"
  },
  {
    id: "LEN_DIFICIL_03",
    materia: "Lengua",
    dificultad: "Difícil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "En la oración «El gato duerme en el sofá», ¿cuál es el sujeto?",
    opciones: ["El gato", "duerme en el sofá", "el sofá"],
    respuesta_correcta: "El gato",
    pista_retroalimentacion: "El sujeto es de quién o qué hablamos. Pregunta: ¿quién duerme? ¡El gato!"
  },
  {
    id: "LEN_DIFICIL_04",
    materia: "Lengua",
    dificultad: "Difícil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "En la oración «María dibuja una casa», ¿cuál es el predicado?",
    opciones: ["dibuja una casa", "María", "una casa"],
    respuesta_correcta: "dibuja una casa",
    pista_retroalimentacion: "El predicado es lo que se dice del sujeto. Pregunta: ¿qué hace María? ¡Dibuja una casa!"
  },
  {
    id: "LEN_DIFICIL_05",
    materia: "Lengua",
    dificultad: "Difícil",
    tipo_mecanica: "Opción Múltiple",
    enunciado: "Lee: «Tomás lavó los platos. Luego ordenó su cuarto. Después hizo la tarea.» ¿Cuál es la idea principal?",
    opciones: [
      "Tomás ayudó en casa y estudió",
      "Tomás solo lavó los platos",
      "Tomás jugó en el parque"
    ],
    respuesta_correcta: "Tomás ayudó en casa y estudió",
    pista_retroalimentacion: "La idea principal resume todo: ayudó en casa (platos + cuarto) y estudió (tarea)."
  }
];

// =============================================================================
// Helpers de agrupación (útiles para el visor y para sembrar el backend)
// =============================================================================

export const DIFICULTADES: Dificultad[] = ["Fácil", "Medio", "Difícil"];
export const MATERIAS: Materia[] = ["Matemáticas", "Lengua"];

export function desafiosPorMateria(materia: Materia): DesafioBanco[] {
  return BANCO_DESAFIOS.filter((d) => d.materia === materia);
}

export function desafiosPorDificultad(dificultad: Dificultad): DesafioBanco[] {
  return BANCO_DESAFIOS.filter((d) => d.dificultad === dificultad);
}

export function desafiosPorBloque(
  materia: Materia,
  dificultad: Dificultad
): DesafioBanco[] {
  return BANCO_DESAFIOS.filter(
    (d) => d.materia === materia && d.dificultad === dificultad
  );
}

// Resumen rápido para mostrar contadores en la UI
export const RESUMEN_BANCO = {
  total: BANCO_DESAFIOS.length,
  matematicas: BANCO_DESAFIOS.filter((d) => d.materia === "Matemáticas").length,
  lengua: BANCO_DESAFIOS.filter((d) => d.materia === "Lengua").length,
  facil: BANCO_DESAFIOS.filter((d) => d.dificultad === "Fácil").length,
  medio: BANCO_DESAFIOS.filter((d) => d.dificultad === "Medio").length,
  dificil: BANCO_DESAFIOS.filter((d) => d.dificultad === "Difícil").length,
};
