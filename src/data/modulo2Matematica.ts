// =============================================================================
// 🧮 MÓDULO 2 — MATEMÁTICA (3.er grado, segundo semestre MINED Nicaragua)
// -----------------------------------------------------------------------------
// 15 problemas de operación vertical para 3.er grado:
//   • 5 multiplicaciones verticales (DU×U y CDU×U)
//   • 10 divisiones verticales DU÷U (5 exactas + 5 con residuo)
//
// Contexto nicaragüense: córdobas (C$), quintales de café, nancites,
// pitahayas, buses de Managua, cuajada, cacao, nacatamal. Nombres locales:
// Jerson, Nahomi, María José, Carlos, Doña Rosa, Don Luis, Junior, Arelys.
//
// Distractores = errores comunes de niños de 8-9 años (NO absurdos).
// =============================================================================

export interface ProblemaMatematico {
  id: string;
  tipo_operacion: "multiplicacion" | "division";
  enunciado: string;
  operacion_vertical_esperada: string;
  respuesta_correcta: number;
  residuo?: number;
  distractores: [number, number, number];
  es_exacta?: boolean;
}

export const problemasMatematicosM2: ProblemaMatematico[] = [
  // ===========================================================================
  // MULTIPLICACIONES VERTICALES (5)
  // ===========================================================================

  // --- M2-001: DU × U (47 × 6 = 282) ---
  {
    id: "M2-001",
    tipo_operacion: "multiplicacion",
    enunciado:
      "Doña Rosa vende en la pulpería 6 bolsas de pan de leche a C$47 cada una. ¿Cuánto juntó en total, vos creés?",
    operacion_vertical_esperada: "47 × 6",
    respuesta_correcta: 282,
    distractores: [242, 288, 292],
  },

  // --- M2-002: CDU × U (234 × 4 = 936) ---
  {
    id: "M2-002",
    tipo_operacion: "multiplicacion",
    enunciado:
      "Don Luis cosechó 4 sacos de café y cada saco lleva 234 libras. ¿Cuántas libras de café llevó al beneficio?",
    operacion_vertical_esperada: "234 × 4",
    respuesta_correcta: 936,
    distractores: [926, 946, 836],
  },

  // --- M2-003: DU × U (56 × 8 = 448) ---
  {
    id: "M2-003",
    tipo_operacion: "multiplicacion",
    enunciado:
      "Nahomi recogió 8 canastas con 56 nancites cada una para hacer fresco. ¿Cuántos nancites juntó en total?",
    operacion_vertical_esperada: "56 × 8",
    respuesta_correcta: 448,
    distractores: [458, 438, 488],
  },

  // --- M2-004: CDU × U (215 × 3 = 645) ---
  {
    id: "M2-004",
    tipo_operacion: "multiplicacion",
    enunciado:
      "En el Mercado Oriental hay 3 buses que llevan 215 pasajeros cada uno rumbo a Masaya. ¿Cuántos pasajeros van en total?",
    operacion_vertical_esperada: "215 × 3",
    respuesta_correcta: 645,
    distractores: [635, 655, 545],
  },

  // --- M2-005: DU × U (78 × 5 = 390) ---
  {
    id: "M2-005",
    tipo_operacion: "multiplicacion",
    enunciado:
      "Jerson llevó al mercado 5 cajas con 78 pitahayas cada una. ¿Cuántas pitahayas llevó en total?",
    operacion_vertical_esperada: "78 × 5",
    respuesta_correcta: 390,
    distractores: [380, 400, 395],
  },

  // ===========================================================================
  // DIVISIONES VERTICALES — EXACTAS (5)
  // ===========================================================================

  // --- M2-006: 84 ÷ 4 = 21 ---
  {
    id: "M2-006",
    tipo_operacion: "division",
    enunciado:
      "María José tiene C$84 y los reparte en partes iguales entre 4 sobrinos. ¿Cuántos córdobas le tocan a cada uno?",
    operacion_vertical_esperada: "84 ÷ 4",
    respuesta_correcta: 21,
    es_exacta: true,
    distractores: [20, 22, 24],
  },

  // --- M2-007: 96 ÷ 6 = 16 ---
  {
    id: "M2-007",
    tipo_operacion: "division",
    enunciado:
      "Doña Rosa preparó 96 nacatamales y los acomodó en 6 canastas iguales. ¿Cuántos nacatamales van en cada canasta?",
    operacion_vertical_esperada: "96 ÷ 6",
    respuesta_correcta: 16,
    es_exacta: true,
    distractores: [15, 17, 19],
  },

  // --- M2-008: 75 ÷ 5 = 15 ---
  {
    id: "M2-008",
    tipo_operacion: "division",
    enunciado:
      "Don Luis reparte 75 cuajadas en 5 latas iguales para vender en Granada. ¿Cuántas cuajadas van en cada lata?",
    operacion_vertical_esperada: "75 ÷ 5",
    respuesta_correcta: 15,
    es_exacta: true,
    distractores: [14, 16, 25],
  },

  // --- M2-009: 72 ÷ 8 = 9 ---
  {
    id: "M2-009",
    tipo_operacion: "division",
    enunciado:
      "Arelys lleva 72 pitahayas a la feria de León y las acomoda en 8 bandejas iguales. ¿Cuántas pitahayas pone en cada bandeja?",
    operacion_vertical_esperada: "72 ÷ 8",
    respuesta_correcta: 9,
    es_exacta: true,
    distractores: [8, 10, 12],
  },

  // --- M2-010: 68 ÷ 4 = 17 ---
  {
    id: "M2-010",
    tipo_operacion: "division",
    enunciado:
      "Junior seca 68 mazorcas de cacao y las guarda en 4 sacos iguales. ¿Cuántas mazorcas van en cada saco?",
    operacion_vertical_esperada: "68 ÷ 4",
    respuesta_correcta: 17,
    es_exacta: true,
    distractores: [16, 18, 15],
  },

  // ===========================================================================
  // DIVISIONES VERTICALES — CON RESIDUO (5)
  // ===========================================================================

  // --- M2-011: 84 ÷ 5 = 16, residuo 4 ---
  {
    id: "M2-011",
    tipo_operacion: "division",
    enunciado:
      "Carlos tiene 84 nancites y los reparte a partes iguales entre 5 primos. ¿Cuántos le tocan a cada primo y cuántos sobran?",
    operacion_vertical_esperada: "84 ÷ 5",
    respuesta_correcta: 16,
    residuo: 4,
    es_exacta: false,
    distractores: [15, 17, 14],
  },

  // --- M2-012: 95 ÷ 6 = 15, residuo 5 ---
  {
    id: "M2-012",
    tipo_operacion: "division",
    enunciado:
      "Doña Rosa hace 95 vigorones y los reparte en 6 bandejas iguales. ¿Cuántos vigorones van en cada bandeja y cuántos quedan sueltos?",
    operacion_vertical_esperada: "95 ÷ 6",
    respuesta_correcta: 15,
    residuo: 5,
    es_exacta: false,
    distractores: [14, 16, 13],
  },

  // --- M2-013: 73 ÷ 4 = 18, residuo 1 ---
  {
    id: "M2-013",
    tipo_operacion: "division",
    enunciado:
      "Nahomi reúne 73 pitahayas y las guarda en 4 cajas iguales. ¿Cuántas pitahayas caben en cada caja y cuántas sobran?",
    operacion_vertical_esperada: "73 ÷ 4",
    respuesta_correcta: 18,
    residuo: 1,
    es_exacta: false,
    distractores: [17, 19, 16],
  },

  // --- M2-014: 67 ÷ 3 = 22, residuo 1 ---
  {
    id: "M2-014",
    tipo_operacion: "division",
    enunciado:
      "Don Luis saca 67 quintales de café y los reparte en 3 camiones iguales. ¿Cuántos quintales lleva cada camión y cuántos quedan sin cargar?",
    operacion_vertical_esperada: "67 ÷ 3",
    respuesta_correcta: 22,
    residuo: 1,
    es_exacta: false,
    distractores: [21, 23, 20],
  },

  // --- M2-015: 89 ÷ 7 = 12, residuo 5 ---
  {
    id: "M2-015",
    tipo_operacion: "division",
    enunciado:
      "Jerson junta 89 cuajadas y las reparte en 7 bandejas iguales para la feria de Masaya. ¿Cuántas van en cada bandeja y cuántas sobran?",
    operacion_vertical_esperada: "89 ÷ 7",
    respuesta_correcta: 12,
    residuo: 5,
    es_exacta: false,
    distractores: [11, 13, 14],
  },
];

// =============================================================================
// Helpers de agrupación (útiles para la UI y el backend)
// =============================================================================

export const multiplicacionesM2: ProblemaMatematico[] =
  problemasMatematicosM2.filter((p) => p.tipo_operacion === "multiplicacion");

export const divisionesM2: ProblemaMatematico[] =
  problemasMatematicosM2.filter((p) => p.tipo_operacion === "division");

export const divisionesExactasM2: ProblemaMatematico[] = problemasMatematicosM2.filter(
  (p) => p.tipo_operacion === "division" && p.es_exacta === true
);

export const divisionesConResiduoM2: ProblemaMatematico[] =
  problemasMatematicosM2.filter(
    (p) => p.tipo_operacion === "division" && p.es_exacta === false
  );

export const RESUMEN_M2 = {
  total: problemasMatematicosM2.length,
  multiplicaciones: multiplicacionesM2.length,
  divisiones: divisionesM2.length,
  exactas: divisionesExactasM2.length,
  con_residuo: divisionesConResiduoM2.length,
};
