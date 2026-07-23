// =============================================================================
// ✏️ MÓDULO 4 — ORTOGRAFÍA (3.er grado MINED Nicaragua)
// -----------------------------------------------------------------------------
// 30 ítems de ortografía distribuidos así:
//   • 10 de uso de «b» y «v» (5 con error a corregir + 5 correctas para clasificar)
//   • 10 de clasificación por acento (Agudas, Graves, Esdrújulas)
//   • 10 de signos de apertura (¡ o ¿) faltantes en oraciones
//     exclamativas e interrogativas
//
// Notas pedagógicas:
//   - Los distractores son errores típicos de niños de 8-9 años.
//   - Las reglas se redactan en lenguaje simple, sin tecnicismos.
//   - Para los ítems de "clasificar" (sin error a corregir) se usa
//     tipo_de_error = "sin_error_clasificar".
// =============================================================================

export interface ItemOrtografia {
  id: string;
  categoria: "uso_b_v" | "clasificacion_acentos" | "signos_apertura";
  item_con_error: string;
  letra_o_signo_faltante: string;
  regla_ortografica_aplicada: string;
  tipo_de_error: string;
  respuesta_correcta: string;
}

export const itemsOrtografiaM4: ItemOrtografia[] = [
  // ===========================================================================
  // USO DE «b» Y «v» — 5 CON ERROR A CORREGIR (sustitución)
  // ===========================================================================

  {
    id: "ORT-001",
    categoria: "uso_b_v",
    item_con_error: "inbierno",
    letra_o_signo_faltante: "v",
    regla_ortografica_aplicada:
      "Después de la consonante «n» se escribe «v». La palabra correcta es in-vierno, no in-bierno.",
    tipo_de_error: "sustitucion",
    respuesta_correcta: "invierno",
  },

  {
    id: "ORT-002",
    categoria: "uso_b_v",
    item_con_error: "culevra",
    letra_o_signo_faltante: "b",
    regla_ortografica_aplicada:
      "Después de la consonante «l» se escribe «b». La palabra correcta es cu-le-bra, no cu-le-vra.",
    tipo_de_error: "sustitucion",
    respuesta_correcta: "culebra",
  },

  {
    id: "ORT-003",
    categoria: "uso_b_v",
    item_con_error: "escrivir",
    letra_o_signo_faltante: "b",
    regla_ortografica_aplicada:
      "Los verbos terminados en -bir se escriben con «b» (excepto hervir, servir y vivir). La palabra correcta es escri-bir.",
    tipo_de_error: "sustitucion",
    respuesta_correcta: "escribir",
  },

  {
    id: "ORT-004",
    categoria: "uso_b_v",
    item_con_error: "árvol",
    letra_o_signo_faltante: "b",
    regla_ortografica_aplicada:
      "Después de la consonante «r» se escribe «b». La palabra correcta es ár-bol, no ár-vol.",
    tipo_de_error: "sustitucion",
    respuesta_correcta: "árbol",
  },

  {
    id: "ORT-005",
    categoria: "uso_b_v",
    item_con_error: "cantava",
    letra_o_signo_faltante: "b",
    regla_ortografica_aplicada:
      "El pretérito de los verbos en -ar termina en «-aba» con «b» (cantaba, jugaba, bailaba).",
    tipo_de_error: "sustitucion",
    respuesta_correcta: "cantaba",
  },

  // ===========================================================================
  // USO DE «b» Y «v» — 5 CORRECTAS PARA CLASIFICAR
  // ===========================================================================

  {
    id: "ORT-006",
    categoria: "uso_b_v",
    item_con_error: "cabeza",
    letra_o_signo_faltante: "b",
    regla_ortografica_aplicada:
      "Esta palabra ya está bien escrita con «b»: ca-be-za. Clasifícala en el grupo de la «b».",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "b",
  },

  {
    id: "ORT-007",
    categoria: "uso_b_v",
    item_con_error: "vacaciones",
    letra_o_signo_faltante: "v",
    regla_ortografica_aplicada:
      "Esta palabra ya está bien escrita con «v»: va-ca-cio-nes. Clasifícala en el grupo de la «v».",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "v",
  },

  {
    id: "ORT-008",
    categoria: "uso_b_v",
    item_con_error: "sombra",
    letra_o_signo_faltante: "b",
    regla_ortografica_aplicada:
      "Después de la consonante «m» se escribe «b». La palabra som-bra ya está bien escrita con «b».",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "b",
  },

  {
    id: "ORT-009",
    categoria: "uso_b_v",
    item_con_error: "ventana",
    letra_o_signo_faltante: "v",
    regla_ortografica_aplicada:
      "Esta palabra ya está bien escrita con «v»: ven-ta-na. Clasifícala en el grupo de la «v».",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "v",
  },

  {
    id: "ORT-010",
    categoria: "uso_b_v",
    item_con_error: "libro",
    letra_o_signo_faltante: "b",
    regla_ortografica_aplicada:
      "Esta palabra ya está bien escrita con «b»: li-bro. Clasifícala en el grupo de la «b».",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "b",
  },

  // ===========================================================================
  // CLASIFICACIÓN POR ACENTO — AGUDAS (3)
  // ===========================================================================

  {
    id: "ORT-011",
    categoria: "clasificacion_acentos",
    item_con_error: "café",
    letra_o_signo_faltante: "tilde",
    regla_ortografica_aplicada:
      "Las agudas llevan tilde cuando terminan en vocal, «n» o «s». «Café» termina en vocal y la fuerza está en la última sílaba (ca-FÉ).",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "Aguda",
  },

  {
    id: "ORT-012",
    categoria: "clasificacion_acentos",
    item_con_error: "tambor",
    letra_o_signo_faltante: "tilde",
    regla_ortografica_aplicada:
      "Las agudas NO llevan tilde cuando terminan en consonante distinta de «n» o «s». «Tambor» termina en «r» y la fuerza está en la última sílaba (tam-BOR).",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "Aguda",
  },

  {
    id: "ORT-013",
    categoria: "clasificacion_acentos",
    item_con_error: "también",
    letra_o_signo_faltante: "tilde",
    regla_ortografica_aplicada:
      "Las agudas llevan tilde cuando terminan en vocal, «n» o «s». «También» termina en «n» y la fuerza está en la última sílaba (tam-BIÉN).",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "Aguda",
  },

  // ===========================================================================
  // CLASIFICACIÓN POR ACENTO — GRAVES (4)
  // ===========================================================================

  {
    id: "ORT-014",
    categoria: "clasificacion_acentos",
    item_con_error: "árbol",
    letra_o_signo_faltante: "tilde",
    regla_ortografica_aplicada:
      "Las graves llevan tilde cuando NO terminan en vocal, «n» o «s». «Árbol» termina en «l» y la fuerza está en la penúltima sílaba (ÁR-bol).",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "Grave",
  },

  {
    id: "ORT-015",
    categoria: "clasificacion_acentos",
    item_con_error: "lápiz",
    letra_o_signo_faltante: "tilde",
    regla_ortografica_aplicada:
      "Las graves llevan tilde cuando NO terminan en vocal, «n» o «s». «Lápiz» termina en «z» y la fuerza está en la penúltima sílaba (LÁ-piz).",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "Grave",
  },

  {
    id: "ORT-016",
    categoria: "clasificacion_acentos",
    item_con_error: "mesa",
    letra_o_signo_faltante: "tilde",
    regla_ortografica_aplicada:
      "Las graves NO llevan tilde cuando terminan en vocal, «n» o «s». «Mesa» termina en vocal y la fuerza está en la penúltima sílaba (ME-sa).",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "Grave",
  },

  {
    id: "ORT-017",
    categoria: "clasificacion_acentos",
    item_con_error: "cárcel",
    letra_o_signo_faltante: "tilde",
    regla_ortografica_aplicada:
      "Las graves llevan tilde cuando NO terminan en vocal, «n» o «s». «Cárcel» termina en «l» y la fuerza está en la penúltima sílaba (CÁR-cel).",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "Grave",
  },

  // ===========================================================================
  // CLASIFICACIÓN POR ACENTO — ESDRÚJULAS (3)
  // ===========================================================================

  {
    id: "ORT-018",
    categoria: "clasificacion_acentos",
    item_con_error: "música",
    letra_o_signo_faltante: "tilde",
    regla_ortografica_aplicada:
      "Las esdrújulas siempre llevan tilde. La fuerza está en la antepenúltima sílaba (MÚ-si-ca).",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "Esdrújula",
  },

  {
    id: "ORT-019",
    categoria: "clasificacion_acentos",
    item_con_error: "pájaro",
    letra_o_signo_faltante: "tilde",
    regla_ortografica_aplicada:
      "Las esdrújulas siempre llevan tilde. La fuerza está en la antepenúltima sílaba (PÁ-ja-ro).",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "Esdrújula",
  },

  {
    id: "ORT-020",
    categoria: "clasificacion_acentos",
    item_con_error: "rápido",
    letra_o_signo_faltante: "tilde",
    regla_ortografica_aplicada:
      "Las esdrújulas siempre llevan tilde. La fuerza está en la antepenúltima sílaba (RÁ-pi-do).",
    tipo_de_error: "sin_error_clasificar",
    respuesta_correcta: "Esdrújula",
  },

  // ===========================================================================
  // SIGNOS DE APERTURA — EXCLAMATIVAS (5 faltan «¡»)
  // ===========================================================================

  {
    id: "ORT-021",
    categoria: "signos_apertura",
    item_con_error: "Qué rico nacatamal!",
    letra_o_signo_faltante: "¡",
    regla_ortografica_aplicada:
      "Toda oración exclamativa empieza con «¡» y termina con «!». Aquí falta el signo de apertura.",
    tipo_de_error: "falta_signo_apertura",
    respuesta_correcta: "¡Qué rico nacatamal!",
  },

  {
    id: "ORT-022",
    categoria: "signos_apertura",
    item_con_error: "Qué fresco de cacao tan sabroso!",
    letra_o_signo_faltante: "¡",
    regla_ortografica_aplicada:
      "Toda oración exclamativa empieza con «¡» y termina con «!». Aquí falta el signo de apertura.",
    tipo_de_error: "falta_signo_apertura",
    respuesta_correcta: "¡Qué fresco de cacao tan sabroso!",
  },

  {
    id: "ORT-023",
    categoria: "signos_apertura",
    item_con_error: "Buenas, deme dos vigorones!",
    letra_o_signo_faltante: "¡",
    regla_ortografica_aplicada:
      "Toda oración exclamativa empieza con «¡» y termina con «!». Aquí falta el signo de apertura.",
    tipo_de_error: "falta_signo_apertura",
    respuesta_correcta: "¡Buenas, deme dos vigorones!",
  },

  {
    id: "ORT-024",
    categoria: "signos_apertura",
    item_con_error: "Qué linda está la Laguna de Masaya!",
    letra_o_signo_faltante: "¡",
    regla_ortografica_aplicada:
      "Toda oración exclamativa empieza con «¡» y termina con «!». Aquí falta el signo de apertura.",
    tipo_de_error: "falta_signo_apertura",
    respuesta_correcta: "¡Qué linda está la Laguna de Masaya!",
  },

  {
    id: "ORT-025",
    categoria: "signos_apertura",
    item_con_error: "Ñam, qué sabroso el vigorón!",
    letra_o_signo_faltante: "¡",
    regla_ortografica_aplicada:
      "Toda oración exclamativa empieza con «¡» y termina con «!». Aquí falta el signo de apertura.",
    tipo_de_error: "falta_signo_apertura",
    respuesta_correcta: "¡Ñam, qué sabroso el vigorón!",
  },

  // ===========================================================================
  // SIGNOS DE APERTURA — INTERROGATIVAS (5 faltan «¿»)
  // ===========================================================================

  {
    id: "ORT-026",
    categoria: "signos_apertura",
    item_con_error: "Cuántos córdobas cuesta la cuajada?",
    letra_o_signo_faltante: "¿",
    regla_ortografica_aplicada:
      "Toda pregunta empieza con «¿» y termina con «?». Aquí falta el signo de apertura.",
    tipo_de_error: "falta_signo_apertura",
    respuesta_correcta: "¿Cuántos córdobas cuesta la cuajada?",
  },

  {
    id: "ORT-027",
    categoria: "signos_apertura",
    item_con_error: "Vamos a Masaya este domingo?",
    letra_o_signo_faltante: "¿",
    regla_ortografica_aplicada:
      "Toda pregunta empieza con «¿» y termina con «?». Aquí falta el signo de apertura.",
    tipo_de_error: "falta_signo_apertura",
    respuesta_correcta: "¿Vamos a Masaya este domingo?",
  },

  {
    id: "ORT-028",
    categoria: "signos_apertura",
    item_con_error: "Dónde está el pinol blanco?",
    letra_o_signo_faltante: "¿",
    regla_ortografica_aplicada:
      "Toda pregunta empieza con «¿» y termina con «?». Aquí falta el signo de apertura.",
    tipo_de_error: "falta_signo_apertura",
    respuesta_correcta: "¿Dónde está el pinol blanco?",
  },

  {
    id: "ORT-029",
    categoria: "signos_apertura",
    item_con_error: "Cuántas pitahayas trajo Jerson?",
    letra_o_signo_faltante: "¿",
    regla_ortografica_aplicada:
      "Toda pregunta empieza con «¿» y termina con «?». Aquí falta el signo de apertura.",
    tipo_de_error: "falta_signo_apertura",
    respuesta_correcta: "¿Cuántas pitahayas trajo Jerson?",
  },

  {
    id: "ORT-030",
    categoria: "signos_apertura",
    item_con_error: "A qué hora sale el bus para Granada?",
    letra_o_signo_faltante: "¿",
    regla_ortografica_aplicada:
      "Toda pregunta empieza con «¿» y termina con «?». Aquí falta el signo de apertura.",
    tipo_de_error: "falta_signo_apertura",
    respuesta_correcta: "¿A qué hora sale el bus para Granada?",
  },
];

// =============================================================================
// Helpers de agrupación
// =============================================================================

export const itemsPorCategoria = (
  categoria: ItemOrtografia["categoria"]
): ItemOrtografia[] =>
  itemsOrtografiaM4.filter((i) => i.categoria === categoria);

export const usoBV: ItemOrtografia[] = itemsPorCategoria("uso_b_v");
export const clasificacionAcentos: ItemOrtografia[] =
  itemsPorCategoria("clasificacion_acentos");
export const signosApertura: ItemOrtografia[] =
  itemsPorCategoria("signos_apertura");

// Subagrupación de uso de «b» y «v»
export const usoBV_conError: ItemOrtografia[] = usoBV.filter(
  (i) => i.tipo_de_error === "sustitucion"
);
export const usoBV_correctasClasificar: ItemOrtografia[] = usoBV.filter(
  (i) => i.tipo_de_error === "sin_error_clasificar"
);

// Subagrupación de acentos por categoría
export const acentosAgudas: ItemOrtografia[] = clasificacionAcentos.filter(
  (i) => i.respuesta_correcta === "Aguda"
);
export const acentosGraves: ItemOrtografia[] = clasificacionAcentos.filter(
  (i) => i.respuesta_correcta === "Grave"
);
export const acentosEsdrújulas: ItemOrtografia[] = clasificacionAcentos.filter(
  (i) => i.respuesta_correcta === "Esdrújula"
);

export const RESUMEN_ORTOGRAFIA_M4 = {
  total: itemsOrtografiaM4.length,
  uso_b_v: usoBV.length,
  uso_b_v_con_error: usoBV_conError.length,
  uso_b_v_clasificar: usoBV_correctasClasificar.length,
  clasificacion_acentos: clasificacionAcentos.length,
  acentos_agudas: acentosAgudas.length,
  acentos_graves: acentosGraves.length,
  acentos_esdrujulas: acentosEsdrújulas.length,
  signos_apertura: signosApertura.length,
};
