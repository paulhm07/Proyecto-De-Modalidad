// =============================================================================
// 📐 MÓDULO 3 — FRACCIONES Y GEOMETRÍA (3.er grado MINED Nicaragua)
// -----------------------------------------------------------------------------
// 10 desafíos visuales:
//   • 5 fracciones propias (1/2, 1/3, 1/4, 1/5)
//   • 5 elementos del círculo (radio, diámetro, centro) y triángulos
//     (equilátero, isósceles, escaleno)
//
// El campo `descripcion_visual_para_ui` es la instrucción que usa el
// componente de React para renderizar la figura (forma + partes + sombreado
// o tipo de línea y figura). El niño responde con texto (opción múltiple).
// =============================================================================

export interface DesafioVisual {
  id: string;
  nivel: 3;
  tema: "fracciones" | "geometria";
  descripcion_visual_para_ui: string;
  pregunta_para_el_nino: string;
  opcion_correcta: string;
  opciones_incorrectas: [string, string, string];
}

export const desafiosVisualesFG: DesafioVisual[] = [
  // ===========================================================================
  // FRACCIONES PROPIAS (5)
  // ===========================================================================

  // --- FG-001: 1/2 ---
  {
    id: "FG-001",
    nivel: 3,
    tema: "fracciones",
    descripcion_visual_para_ui:
      "Dibujar una sandía redonda partida en 2 partes iguales por una línea vertical; sombrear 1 de las 2 partes en color verde-rosado.",
    pregunta_para_el_nino:
      "Mirá la sandía que partió Doña Rosa. ¿Qué fracción representa la parte sombreada?",
    opcion_correcta: "1/2 (un medio)",
    opciones_incorrectas: ["1/3 (un tercio)", "1/4 (un cuarto)", "2/2 (dos medios)"],
  },

  // --- FG-002: 1/3 ---
  {
    id: "FG-002",
    nivel: 3,
    tema: "fracciones",
    descripcion_visual_para_ui:
      "Dibujar una cuajada circular dividida en 3 porciones iguales (líneas en Y); sombrear 1 porción en amarillo.",
    pregunta_para_el_nino:
      "Doña Rosa partió la cuajada en 3 partes iguales y comió 1. ¿Qué fracción comió?",
    opcion_correcta: "1/3 (un tercio)",
    opciones_incorrectas: ["1/2 (un medio)", "1/4 (un cuarto)", "2/3 (dos tercios)"],
  },

  // --- FG-003: 1/4 ---
  {
    id: "FG-003",
    nivel: 3,
    tema: "fracciones",
    descripcion_visual_para_ui:
      "Dibujar un pastel de tres leches circular dividido en 4 porciones iguales (cruz); sombrear 1 porción en color café-crema.",
    pregunta_para_el_nino:
      "En el cumpleaños de Nahomi partieron el pastel en 4 y ella tomó 1 pedazo. ¿Qué fracción se llevó?",
    opcion_correcta: "1/4 (un cuarto)",
    opciones_incorrectas: ["1/2 (un medio)", "1/3 (un tercio)", "3/4 (tres cuartos)"],
  },

  // --- FG-004: 1/5 ---
  {
    id: "FG-004",
    nivel: 3,
    tema: "fracciones",
    descripcion_visual_para_ui:
      "Dibujar una piña estilo cartoon dividida en 5 gajos verticales iguales; sombrear 1 gajo en amarillo dorado.",
    pregunta_para_el_nino:
      "Don Luis cortó la piña en 5 gajos iguales y le dio 1 a Jerson. ¿Qué fracción recibió Jerson?",
    opcion_correcta: "1/5 (un quinto)",
    opciones_incorrectas: ["1/4 (un cuarto)", "1/3 (un tercio)", "1/2 (un medio)"],
  },

  // --- FG-005: 1/2 (refuerzo con contexto distinto) ---
  {
    id: "FG-005",
    nivel: 3,
    tema: "fracciones",
    descripcion_visual_para_ui:
      "Dibujar un nacatamal rectangular dividido por la mitad con una línea horizontal; sombrear la mitad de arriba en color café.",
    pregunta_para_el_nino:
      "Carlos partió el nacatamal en 2 partes iguales y se comió la mitad de arriba. ¿Qué fracción se comió?",
    opcion_correcta: "1/2 (un medio)",
    opciones_incorrectas: ["1/3 (un tercio)", "2/2 (dos medios)", "1/4 (un cuarto)"],
  },

  // ===========================================================================
  // GEOMETRÍA — ELEMENTOS DEL CÍRCULO Y CLASIFICACIÓN DE TRIÁNGULOS (5)
  // ===========================================================================

  // --- FG-006: Centro del círculo ---
  {
    id: "FG-006",
    nivel: 3,
    tema: "geometria",
    descripcion_visual_para_ui:
      "Dibujar un círculo que represente la Laguna de Masaya vista desde el cielo; marcar con un punto rojo en el medio exacto.",
    pregunta_para_el_nino:
      "Mirá la Laguna de Masaya vista desde arriba. ¿Cómo se llama el punto rojo del centro del círculo?",
    opcion_correcta: "Centro",
    opciones_incorrectas: ["Radio", "Diámetro", "Lado"],
  },

  // --- FG-007: Radio del círculo ---
  {
    id: "FG-007",
    nivel: 3,
    tema: "geometria",
    descripcion_visual_para_ui:
      "Dibujar una rueda de carreta (círculo) con centro marcado; trazar una línea recta azul del centro al borde.",
    pregunta_para_el_nino:
      "En la rueda de la carreta de Don Luis, ¿cómo se llama la línea azul que va del centro al borde?",
    opcion_correcta: "Radio",
    opciones_incorrectas: ["Diámetro", "Centro", "Circunferencia"],
  },

  // --- FG-008: Diámetro del círculo ---
  {
    id: "FG-008",
    nivel: 3,
    tema: "geometria",
    descripcion_visual_para_ui:
      "Dibujar un círculo (sombrero de pino visto por arriba) con centro marcado; trazar una línea recta verde que cruza de lado a lado pasando por el centro.",
    pregunta_para_el_nino:
      "En el sombrero de pino, ¿cómo se llama la línea verde que cruza el círculo de lado a lado pasando por el centro?",
    opcion_correcta: "Diámetro",
    opciones_incorrectas: ["Radio", "Centro", "Arco"],
  },

  // --- FG-009: Triángulo equilátero ---
  {
    id: "FG-009",
    nivel: 3,
    tema: "geometria",
    descripcion_visual_para_ui:
      "Dibujar un triángulo con sus 3 lados visiblemente iguales (marcar cada lado con una rayita de igual tamaño) en forma de hoja de cacao.",
    pregunta_para_el_nino:
      "Mirá esta hoja de cacao con los 3 lados iguales. ¿Cómo se llama este tipo de triángulo?",
    opcion_correcta: "Equilátero",
    opciones_incorrectas: ["Isósceles", "Escaleno", "Rectángulo"],
  },

  // --- FG-010: Triángulo escaleno ---
  {
    id: "FG-010",
    nivel: 3,
    tema: "geometria",
    descripcion_visual_para_ui:
      "Dibujar un triángulo con sus 3 lados visiblemente distintos (marcar cada lado con una, dos y tres rayitas) como el techo de una casa chorotega.",
    pregunta_para_el_nino:
      "Mirá el techo de esta casa chorotega: sus 3 lados son distintos. ¿Cómo se llama este triángulo?",
    opcion_correcta: "Escaleno",
    opciones_incorrectas: ["Equilátero", "Isósceles", "Rectángulo"],
  },
];

// =============================================================================
// Helpers de agrupación
// =============================================================================

export const fraccionesFG: DesafioVisual[] = desafiosVisualesFG.filter(
  (d) => d.tema === "fracciones"
);

export const geometriaFG: DesafioVisual[] = desafiosVisualesFG.filter(
  (d) => d.tema === "geometria"
);

export const RESUMEN_FG = {
  total: desafiosVisualesFG.length,
  fracciones: fraccionesFG.length,
  geometria: geometriaFG.length,
};
