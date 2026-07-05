// =============================================================================
// 📖 MÓDULO 3 — LECTURA COMPRENSIVA (3.er grado MINED Nicaragua)
// -----------------------------------------------------------------------------
// 3 lecturas infantiles cortas (≤ 80 palabras) con temática nicaragüense.
// Cada lectura trae 3 preguntas:
//   1. Estructura del texto (inicio / desarrollo / final o moraleja)
//   2. Gramática (identificar sujeto o predicado)
//   3. Pronombres (él / ella / ellos)
//
// Frases de feedback no incluidas en este banco (las maneja la UI), pero los
// distractores son errores comunes de niños de 8-9 años, NO absurdos.
// =============================================================================

export interface PreguntaLectura {
  id: string;
  tipo: "estructura" | "gramatica" | "pronombres";
  pregunta: string;
  opcion_correcta: string;
  opciones_incorrectas: [string, string, string];
}

export interface Lectura {
  id: string;
  titulo: string;
  texto: string;
  preguntas: [PreguntaLectura, PreguntaLectura, PreguntaLectura];
}

export const lecturasM3: Lectura[] = [
  // ===========================================================================
  // LECTURA 1 — El nacatamal de Doña Rosa
  // ===========================================================================
  {
    id: "LEC-001",
    titulo: "El nacatamal de Doña Rosa",
    texto:
      "Doña Rosa prepara nacatamales todos los domingos. Esta mañana, su nieto Jerson la ayudó a pelar el maíz y a lavar las hojas de plátano. Después, Doña Rosa armó los nacatamales con arroz, masa y carne de chancho. Al mediodía, toda la familia se sentó a la mesa y los devoró con alegría. ¡Ñam, qué ricos quedaron! Jerson aprendió que ayudar en casa es muy bonito.",
    preguntas: [
      {
        id: "LEC-001-P1",
        tipo: "estructura",
        pregunta: "¿Cuál es el final (la moraleja) de esta lectura?",
        opcion_correcta:
          "Jerson aprendió que ayudar en casa es muy bonito",
        opciones_incorrectas: [
          "Doña Rosa prepara nacatamales todos los domingos",
          "Jerson ayudó a pelar el maíz y a lavar las hojas",
          "Al mediodía la familia devoró los nacatamales con alegría",
        ],
      },
      {
        id: "LEC-001-P2",
        tipo: "gramatica",
        pregunta:
          "En la oración «Toda la familia se sentó a la mesa», ¿cuál es el sujeto?",
        opcion_correcta: "Toda la familia",
        opciones_incorrectas: [
          "se sentó a la mesa",
          "la mesa",
          "Doña Rosa",
        ],
      },
      {
        id: "LEC-001-P3",
        tipo: "pronombres",
        pregunta:
          "Doña Rosa prepara nacatamales. ¿Con qué pronombre podemos reemplazar a Doña Rosa?",
        opcion_correcta: "Ella",
        opciones_incorrectas: ["Él", "Ellos", "Nosotros"],
      },
    ],
  },

  // ===========================================================================
  // LECTURA 2 — El viaje a Granada
  // ===========================================================================
  {
    id: "LEC-002",
    titulo: "El viaje a Granada",
    texto:
      "María José y Carlos viajaron en bus desde Managua hasta Granada para visitar a su abuelo. Por la ventana vieron el lago Cocibolca brillar bajo el sol. Al llegar, el abuelo los esperaba con un vaso de pinol blanco bien fresco. Platicaron toda la tarde sobre la historia de la ciudad colonial. Antes de regresar, dieron un paseo por la calle La Calzada. María José se sintió muy feliz de compartir ese día con su familia.",
    preguntas: [
      {
        id: "LEC-002-P1",
        tipo: "estructura",
        pregunta: "¿Cuál es el inicio de esta lectura?",
        opcion_correcta:
          "María José y Carlos viajaron en bus desde Managua hasta Granada",
        opciones_incorrectas: [
          "El abuelo los esperaba con un vaso de pinol blanco",
          "Dieron un paseo por la calle La Calzada",
          "María José se sintió muy feliz con su familia",
        ],
      },
      {
        id: "LEC-002-P2",
        tipo: "gramatica",
        pregunta:
          "En la oración «El abuelo los esperaba con pinol blanco», ¿cuál es el predicado?",
        opcion_correcta: "los esperaba con pinol blanco",
        opciones_incorrectas: [
          "El abuelo",
          "con pinol blanco",
          "María José y Carlos",
        ],
      },
      {
        id: "LEC-002-P3",
        tipo: "pronombres",
        pregunta:
          "María José y Carlos viajaron juntos. ¿Con qué pronombre los reemplazamos?",
        opcion_correcta: "Ellos",
        opciones_incorrectas: ["Él", "Ella", "Nosotros"],
      },
    ],
  },

  // ===========================================================================
  // LECTURA 3 — El cacao de Don Luis
  // ===========================================================================
  {
    id: "LEC-003",
    titulo: "El cacao de Don Luis",
    texto:
      "Don Luis cultiva cacao en una finca cerca de Masaya. Cada mañana revisa las mazorcas con cariño. Nahomi, su nieta, lo acompaña los sábados. Juntos recolectan las semillas y las ponen a secar al sol. Después, las tuestan en un comal de barro. Don Luis cuenta que el cacao fue sagrado para los pueblos originarios. Nahomi escucha atenta cada plática. Aprende el oficio del abuelo y guarda el secreto del buen chocolate.",
    preguntas: [
      {
        id: "LEC-003-P1",
        tipo: "estructura",
        pregunta:
          "¿Qué parte del texto nos cuenta el final de la plática del abuelo y la nieta?",
        opcion_correcta:
          "El final: Nahomi aprende el oficio del abuelo y guarda el secreto del chocolate",
        opciones_incorrectas: [
          "El inicio: Don Luis cultiva cacao cerca de Masaya",
          "El desarrollo: juntos recolectan y tuestan las semillas",
          "El inicio: Nahomi lo acompaña los sábados",
        ],
      },
      {
        id: "LEC-003-P2",
        tipo: "gramatica",
        pregunta:
          "En la oración «Don Luis cultiva cacao», ¿cuál es el sujeto?",
        opcion_correcta: "Don Luis",
        opciones_incorrectas: [
          "cultiva cacao",
          "cacao",
          "Nahomi",
        ],
      },
      {
        id: "LEC-003-P3",
        tipo: "pronombres",
        pregunta:
          "Don Luis cultiva cacao en su finca. ¿Con qué pronombre reemplazamos a Don Luis?",
        opcion_correcta: "Él",
        opciones_incorrectas: ["Ella", "Ellos", "Nosotros"],
      },
    ],
  },
];

// =============================================================================
// Helpers de agrupación
// =============================================================================

export const lecturasPorId = (id: string): Lectura | undefined =>
  lecturasM3.find((l) => l.id === id);

export const todasLasPreguntasM3: PreguntaLectura[] = lecturasM3.flatMap(
  (l) => l.preguntas
);

export const preguntasPorTipoM3 = (
  tipo: PreguntaLectura["tipo"]
): PreguntaLectura[] => todasLasPreguntasM3.filter((p) => p.tipo === tipo);

export const RESUMEN_LECTURAS_M3 = {
  lecturas: lecturasM3.length,
  preguntas_total: todasLasPreguntasM3.length,
  estructura: preguntasPorTipoM3("estructura").length,
  gramatica: preguntasPorTipoM3("gramatica").length,
  pronombres: preguntasPorTipoM3("pronombres").length,
};
