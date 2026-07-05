/**
 * El Camión de las Multiplicaciones — Diseño de Niveles
 * -----------------------------------------------------
 * Minijuego educativo para 3er grado (MINED Nicaragua) — Módulo 2 Matemática.
 *
 * Mecánica: Un camión de carga nicaragüense llega al mercado. El niño debe
 * cargar cajas con productos. El cliente pide "N cajitas con M adentro cada una".
 * El niño arrastra cajitas al camión (cada cajita contiene M ítems visibles).
 * Refuerza el concepto de multiplicación como " grupos iguales".
 *
 * Progresión pedagógica (DU×U → CDU×U):
 *   N1   2×3   (2 grupos de 3)         → tabla del 2, base conceptual
 *   N2   3×4   (3 grupos de 4)         → tabla del 3
 *   N3   4×5   (4 grupos de 5)         → tabla del 4, productos del Mercado
 *   N4   5×6   (5 grupos de 6)         → tabla del 5
 *   N5   6×7   (6 grupos de 7)         → tabla del 6, sube complejidad
 *   N6   8×4   (8 grupos de 4)         → tabla del 8
 *   N7   12×3  (12 grupos de 3)        → DU×U (producto > 30)
 *   N8   14×5  (14 grupos de 5)        → DU×U (producto > 60)
 *   N9   23×4  (23 grupos de 4)        → DU×U (producto > 80)
 *   N10  34×6  (34 grupos de 6)        → CDU×U (producto > 200, cierre)
 */

export interface NivelCamion {
  nivel: number;
  grupos: number;            // multiplicando (cajitas a cargar)
  elementos_por_grupo: number; // multiplicador (ítems por cajita)
  producto_visual:
    | "cajas de nancites"
    | "sacos de café"
    | "pacas de rosquillas"
    | "cajas de pitahayas"
    | "sacos de frijoles"
    | "cajas de cuajadas"
    | "sacos de cacao"
    | "cajas de pan de leche";
  frase_del_cliente: string;
  respuesta_correcta: number;
  feedback_error: string;
  operacion_formal: string; // p.ej. "12 × 3 = 36"
  contexto_nicaraguense: string; // descripción breve del escenario
}

export const nivelesCamion: NivelCamion[] = [
  {
    nivel: 1,
    grupos: 2,
    elementos_por_grupo: 3,
    producto_visual: "cajas de nancites",
    frase_del_cliente:
      "¡Buenas! Llevo 2 cajitas con 3 nancites cada una al mercado de Masaya, porfa.",
    respuesta_correcta: 6,
    feedback_error:
      "Contá bien: 2 cajitas y en cada una van 3 nancites. ¡Sumá los grupos!",
    operacion_formal: "2 × 3 = 6",
    contexto_nicaraguense: "Mercado de Masaya, puesto de frutas",
  },
  {
    nivel: 2,
    grupos: 3,
    elementos_por_grupo: 4,
    producto_visual: "cajas de pitahayas",
    frase_del_cliente:
      "Buenas, deme 3 cajitas con 4 pitahayas en cada una para llevar a Granada.",
    respuesta_correcta: 12,
    feedback_error:
      "Ojo: 3 cajitas × 4 pitahayas cada una. ¡Multiplicá los grupos!",
    operacion_formal: "3 × 4 = 12",
    contexto_nicaraguense: "Puesto de frutas exóticas, calle La Calzada",
  },
  {
    nivel: 3,
    grupos: 4,
    elementos_por_grupo: 5,
    producto_visual: "sacos de café",
    frase_del_cliente:
      "¡Buenas! Necesito 4 sacos con 5 libras de café cada uno para la cooperativa.",
    respuesta_correcta: 20,
    feedback_error:
      "Cuidado: 4 sacos × 5 libras de café. ¡Cada saco lleva 5!",
    operacion_formal: "4 × 5 = 20",
    contexto_nicaraguense: "Cooperativa de café de Jinotega",
  },
  {
    nivel: 4,
    grupos: 5,
    elementos_por_grupo: 6,
    producto_visual: "cajas de cuajadas",
    frase_del_cliente:
      "Buenas, llevo 5 cajas con 6 cuajadas cada una pa' la pulpería de Doña Rosa.",
    respuesta_correcta: 30,
    feedback_error:
      "Te faltó: 5 cajas × 6 cuajadas cada una. ¡Sumá los grupos otra vez!",
    operacion_formal: "5 × 6 = 30",
    contexto_nicaraguense: "Pulpería de Doña Rosa, Barrio Monseñor Lezcano",
  },
  {
    nivel: 5,
    grupos: 6,
    elementos_por_grupo: 7,
    producto_visual: "pacas de rosquillas",
    frase_del_cliente:
      "¡Buenas! Quiero 6 pacas con 7 rosquillas cada una pa' vender en la Laguna.",
    respuesta_correcta: 42,
    feedback_error:
      "Casi: 6 pacas × 7 rosquillas cada una. ¡Multiplicá nomás!",
    operacion_formal: "6 × 7 = 42",
    contexto_nicaraguense: "Laguna de Masaya, domingo de venta",
  },
  {
    nivel: 6,
    grupos: 8,
    elementos_por_grupo: 4,
    producto_visual: "cajas de pan de leche",
    frase_del_cliente:
      "Buenas, deme 8 cajas con 4 panes de leche cada una para la merienda.",
    respuesta_correcta: 32,
    feedback_error:
      "Ojo: 8 cajas × 4 panes cada una. ¡No confundas el orden!",
    operacion_formal: "8 × 4 = 32",
    contexto_nicaraguense: "Panadería de León, venta del domingo",
  },
  {
    nivel: 7,
    grupos: 12,
    elementos_por_grupo: 3,
    producto_visual: "sacos de frijoles",
    frase_del_cliente:
      "¡Buenas! Llevo 12 sacos con 3 libras de frijoles cada uno al Mercado Oriental.",
    respuesta_correcta: 36,
    feedback_error:
      "Números más grandes ya: 12 sacos × 3 libras cada uno. ¡A contar grupos!",
    operacion_formal: "12 × 3 = 36",
    contexto_nicaraguense: "Mercado Oriental de Managua",
  },
  {
    nivel: 8,
    grupos: 14,
    elementos_por_grupo: 5,
    producto_visual: "cajas de nancites",
    frase_del_cliente:
      "Buenas, deme 14 cajas con 5 nancites cada una pa' la feria de Tipitapa.",
    respuesta_correcta: 70,
    feedback_error:
      "Te pasaste o te faltó: 14 cajas × 5 nancites. ¡Hacé la cuenta paso a paso!",
    operacion_formal: "14 × 5 = 70",
    contexto_nicaraguense: "Feria de Tipitapa, puesto rural",
  },
  {
    nivel: 9,
    grupos: 23,
    elementos_por_grupo: 4,
    producto_visual: "sacos de cacao",
    frase_del_cliente:
      "¡Buenas! Llevo 23 sacos con 4 libras de cacao cada uno a la fábrica.",
    respuesta_correcta: 92,
    feedback_error:
      "Cuidado: 23 sacos × 4 libras cada uno. ¡Es una multiplicación de dos cifras!",
    operacion_formal: "23 × 4 = 92",
    contexto_nicaraguense: "Fábrica de chocolate de Matagalpa",
  },
  {
    nivel: 10,
    grupos: 34,
    elementos_por_grupo: 6,
    producto_visual: "cajas de cuajadas",
    frase_del_cliente:
      "¡Buenas, último encargo! 34 cajas con 6 cuajadas cada una para exportar.",
    respuesta_correcta: 204,
    feedback_error:
      "Nivel final: 34 cajas × 6 cuajadas. ¡Multiplicación de tres cifras, vos podés!",
    operacion_formal: "34 × 6 = 204",
    contexto_nicaraguense: "Exportación desde Managua",
  },
];

export default nivelesCamion;
