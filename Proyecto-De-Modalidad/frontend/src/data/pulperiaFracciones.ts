/**
 * La Pulpería de Fracciones — Diseño de Niveles (Game Design)
 * -----------------------------------------------------------
 * Minijuego educativo para 3er grado (MINED Nicaragua).
 *
 * Mecánica: Un niño atiende una pulpería. Llega un cliente y pide una
 * fracción de un producto típico local. El niño debe:
 *   1. Dividir el objeto visual en `denominador_cortes` partes iguales.
 *   2. Arrastrar `numerador_pedido` partes hacia el cliente.
 *
 * Progresión pedagógica:
 *   N1  1/2  → mitades (concepto base)
 *   N2  1/4  → cuartos
 *   N3  2/4  → equivalencia con 1/2 (mismo objeto, distinta representación)
 *   N4  1/3  → tercios (denominador impar, nueva idea)
 *   N5  2/3  → numerador > 1 con tercios
 *   N6  3/4  → casi el entero (concepto "casi todo")
 *   N7  1/6  → sextos (partes más pequeñas)
 *   N8  5/8  → octavos con numerador alto (desafío)
 *   N9  3/8  → octavos con numerador bajo (menos de la mitad)
 *   N10 5/6  → cierre: casi el entero con denominador 6
 */

export interface NivelPulperia {
  nivel: number;
  objeto_visual:
    | "cuajada"
    | "sandía"
    | "pastel de tres leches"
    | "piña"
    | "barra de jabón de lavar";
  denominador_cortes: 2 | 3 | 4 | 6 | 8;
  numerador_pedido: number;
  frase_del_cliente: string;
  feedback_error: string;
  // Campos auxiliares para la implementación
  fraccion_latex: string; // p.ej. "\frac{1}{2}"
  fraccion_plana: string; // p.ej. "1/2"
  es_equivalente_de?: string; // hint pedagógico opcional
}

export const nivelesPulperia: NivelPulperia[] = [
  {
    nivel: 1,
    objeto_visual: "sandía",
    denominador_cortes: 2,
    numerador_pedido: 1,
    frase_del_cliente:
      "¡Buenas! Quiero $\\frac{1}{2}$ de esa sandía para mi familia, porfa.",
    feedback_error:
      "Te pasaste un poquito. La sandía se parte en 2 pedazos iguales y le damos solo 1 al cliente. ¡Tú puedes!",
    fraccion_latex: "\\frac{1}{2}",
    fraccion_plana: "1/2",
  },
  {
    nivel: 2,
    objeto_visual: "pastel de tres leches",
    denominador_cortes: 4,
    numerador_pedido: 1,
    frase_del_cliente:
      "Buenas, deme $\\frac{1}{4}$ de ese pastel de tres leches, por favor.",
    feedback_error:
      "Cuidado, el pastel se corta en 4 partes iguales. El cliente pidió solo 1 pedacito.",
    fraccion_latex: "\\frac{1}{4}",
    fraccion_plana: "1/4",
  },
  {
    nivel: 3,
    objeto_visual: "sandía",
    denominador_cortes: 4,
    numerador_pedido: 2,
    frase_del_cliente:
      "Hola, yo quiero $\\frac{2}{4}$ de esa sandía rosada, por favor.",
    feedback_error:
      "Recuerda: 4 partes iguales en total y el cliente lleva 2. ¡Cuenta bien los pedazos!",
    fraccion_latex: "\\frac{2}{4}",
    fraccion_plana: "2/4",
    es_equivalente_de: "1/2",
  },
  {
    nivel: 4,
    objeto_visual: "piña",
    denominador_cortes: 3,
    numerador_pedido: 1,
    frase_del_cliente: "Buenas, deme $\\frac{1}{3}$ de esa piña madura, porfa.",
    feedback_error:
      "La piña se reparte en 3 partes iguales. El cliente solo quiere 1 de las 3.",
    fraccion_latex: "\\frac{1}{3}",
    fraccion_plana: "1/3",
  },
  {
    nivel: 5,
    objeto_visual: "cuajada",
    denominador_cortes: 3,
    numerador_pedido: 2,
    frase_del_cliente:
      "¡Buenas! Quiero $\\frac{2}{3}$ de esa cuajada para llevar, por favor.",
    feedback_error:
      "Ojo: la cuajada se parte en 3 iguales y el cliente lleva 2. ¡No le des de más!",
    fraccion_latex: "\\frac{2}{3}",
    fraccion_plana: "2/3",
  },
  {
    nivel: 6,
    objeto_visual: "pastel de tres leches",
    denominador_cortes: 4,
    numerador_pedido: 3,
    frase_del_cliente:
      "Buenas, deme $\\frac{3}{4}$ de ese pastel para cumpleaños, porfa.",
    feedback_error:
      "Casi. El pastel tiene 4 partes y el cliente pidió 3. Si das 4, le das el pastel entero.",
    fraccion_latex: "\\frac{3}{4}",
    fraccion_plana: "3/4",
  },
  {
    nivel: 7,
    objeto_visual: "barra de jabón de lavar",
    denominador_cortes: 6,
    numerador_pedido: 1,
    frase_del_cliente:
      "Buenas, deme $\\frac{1}{6}$ de esa barra de jabón de lavar, porfa.",
    feedback_error:
      "La barra se corta en 6 pedacitos iguales. El cliente pidió nomás 1 pedacito.",
    fraccion_latex: "\\frac{1}{6}",
    fraccion_plana: "1/6",
  },
  {
    nivel: 8,
    objeto_visual: "sandía",
    denominador_cortes: 8,
    numerador_pedido: 5,
    frase_del_cliente:
      "Hola, deme $\\frac{5}{8}$ de esa sandía grandota, por favor.",
    feedback_error:
      "Cuidado: 8 partes iguales y el cliente lleva 5. Cuenta los pedazos antes de entregar.",
    fraccion_latex: "\\frac{5}{8}",
    fraccion_plana: "5/8",
  },
  {
    nivel: 9,
    objeto_visual: "cuajada",
    denominador_cortes: 8,
    numerador_pedido: 3,
    frase_del_cliente:
      "Buenas, deme $\\frac{3}{8}$ de esa cuajada de leche, porfa.",
    feedback_error:
      "La cuajada se parte en 8 pedacitos iguales. El cliente quiere solo 3 de esos.",
    fraccion_latex: "\\frac{3}{8}",
    fraccion_plana: "3/8",
  },
  {
    nivel: 10,
    objeto_visual: "piña",
    denominador_cortes: 6,
    numerador_pedido: 5,
    frase_del_cliente:
      "¡Buenas! Quiero $\\frac{5}{6}$ de esa piña dulce para llevar, por favor.",
    feedback_error:
      "Último nivel: la piña se reparte en 6 partes iguales y el cliente lleva 5. ¡Tú puedes, contador experto!",
    fraccion_latex: "\\frac{5}{6}",
    fraccion_plana: "5/6",
  },
];

export default nivelesPulperia;
