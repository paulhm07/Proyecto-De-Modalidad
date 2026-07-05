/**
 * La Carta Mal Enviada — Diseño de Niveles
 * ------------------------------------------
 * Minijuego educativo para 3er grado (MINED Nicaragua) — Módulo 4 Ortografía y Signos.
 *
 * Mecánica: Un cartero nicaragüense lleva cartas con errores. El niño debe
 * "sellar" la corrección correcta antes de que la carta salga al buzón.
 * Tipos de error a corregir: uso de b/v, clasificación por acento
 * (agudas/graves/esdrújulas) y signos de apertura (¡ ¿) en exclamativas e
 * interrogativas.
 *
 * Progresión pedagógica:
 *   N1   b/v (sustitución clásica)           → 4 cartas
 *   N2   b/v (omisión de b inicial)           → 4 cartas
 *   N3   b/v (confusión en prefijos)          → 4 cartas
 *   N4   Agudas (con tilde)                   → 4 cartas
 *   N5   Graves (con/sin tilde)               → 4 cartas
 *   N6   Esdrújulas (siempre con tilde)       → 4 cartas
 *   N7   Signo ¡ (exclamativa, falta apertura)→ 4 cartas
 *   N8   Signo ¿ (interrogativa, falta apertura) → 4 cartas
 *   N9   Mezcla ¡/¿ (frases que combinan)     → 4 cartas
 *   N10  Revisión final: clasificar tipo de error → 4 cartas
 *
 * Total: 40 cartas distribuidas en 10 niveles.
 * El niño arranca el nivel con 4 cartas; cada una vale 1 sello correcto.
 */

export interface Carta {
  id: string; // ID único: CARTA-001 a CARTA-040
  nivel: number;
  tipo_error: "uso_b_v" | "clasificacion_acentos" | "signos_apertura";
  subtipo:
    | "sustitucion_b_v"
    | "omision_b_inicial"
    | "confusion_prefijo"
    | "aguda"
    | "grave"
    | "esdrujula"
    | "exclamativa_sin_apertura"
    | "interrogativa_sin_apertura"
    | "mezcla_signos"
    | "clasificar_tipo";
  texto_mostrado: string; // lo que el niño ve en la carta (con error)
  correccion_correcta: string; // la forma correcta
  regla_ortografica: string; // explicación breve
  feedback_error: string;
}

export const cartasNiveles: Carta[] = [
  // Nivel 1 — sustitución clásica b/v
  {
    id: "CARTA-001",
    nivel: 1,
    tipo_error: "uso_b_v",
    subtipo: "sustitucion_b_v",
    texto_mostrado: "El ciervo corre por el bosque.",
    correccion_correcta: "El ciervo corre por el bosque.",
    regla_ortografica: "'Ciervo' se escribe con 'c' antes de 'e', pero el animal lleva 'v'.",
    feedback_error: "Acá no hay error, era trampa. ¡Leé bien antes de sellar!",
  },
  {
    id: "CARTA-002",
    nivel: 1,
    tipo_error: "uso_b_v",
    subtipo: "sustitucion_b_v",
    texto_mostrado: "Compré un kilo de cavas en el mercado.",
    correccion_correcta: "Compré un kilo de cebollas en el mercado.",
    regla_ortografica: "Si querías decir 'cabas' (cajas), es con 'b'. Pero 'cebollas' lleva 'b'.",
    feedback_error: "Acá lo correcto era 'cebollas' con 'b'. ¡Cuidado con la trampa!",
  },
  {
    id: "CARTA-003",
    nivel: 1,
    tipo_error: "uso_b_v",
    subtipo: "sustitucion_b_v",
    texto_mostrado: "La hamaca se mueve con el viento.",
    correccion_correcta: "La hamaca se mueve con el viento.",
    regla_ortografica: "'Hamaca' lleva 'h' muda, 'viento' lleva 'v'. Todo está bien.",
    feedback_error: "Esta carta no tiene error. ¡Cuidado con sellar sin revisar!",
  },
  {
    id: "CARTA-004",
    nivel: 1,
    tipo_error: "uso_b_v",
    subtipo: "sustitucion_b_v",
    texto_mostrado: "Mi hermano tiene un nueve caballo.",
    correccion_correcta: "Mi hermano tiene un nuevo caballo.",
    regla_ortografica: "'Nuevo' se escribe con 'v' después de 'e'. 'Caballo' con 'b' antes de 'll'.",
    feedback_error: "Acá hay dos errores: 'nuevo' (con v) y 'caballo' (con b). ¡A revisar!",
  },

  // Nivel 2 — omisión de b inicial
  {
    id: "CARTA-005",
    nivel: 2,
    tipo_error: "uso_b_v",
    subtipo: "omision_b_inicial",
    texto_mostrado: "Buenas, vengo a uscar trabajo.",
    correccion_correcta: "Buenas, vengo a buscar trabajo.",
    regla_ortografica: "Las formas del verbo 'buscar' empiezan con 'b'.",
    feedback_error: "Faltó la 'b' en 'buscar'. ¡Las acciones empiezan con b!",
  },
  {
    id: "CARTA-006",
    nivel: 2,
    tipo_error: "uso_b_v",
    subtipo: "omision_b_inicial",
    texto_mostrado: "El autobús salió al octubre.",
    correccion_correcta: "El autobús salió a octubre.",
    regla_ortografica: "Los meses llevan minúscula: 'octubre' (no 'al octubre').",
    feedback_error: "Acá el error era otro: sobraba 'al'. 'Octubre' con minúscula.",
  },
  {
    id: "CARTA-007",
    nivel: 2,
    tipo_error: "uso_b_v",
    subtipo: "omision_b_inicial",
    texto_mostrado: "Vamos a nadar en el alberca.",
    correccion_correcta: "Vamos a nadar en la alberca.",
    regla_ortografica: "Antes de 'alberca' va 'la', no 'el' (palabra femenina).",
    feedback_error: "Acá el error era el artículo: 'la alberca', no 'el alberca'.",
  },
  {
    id: "CARTA-008",
    nivel: 2,
    tipo_error: "uso_b_v",
    subtipo: "omision_b_inicial",
    texto_mostrado: "El ornitorrinco nada en el río.",
    correccion_correcta: "El ornitorrinco nada en el río.",
    regla_ortografica: "Aunque suene raro, 'ornitorrinco' empieza con 'o' (sin b).",
    feedback_error: "Esta carta estaba bien. No todas las palabras raras llevan 'b'.",
  },

  // Nivel 3 — confusión en prefijos (ab-, ob-, sub-)
  {
    id: "CARTA-009",
    nivel: 3,
    tipo_error: "uso_b_v",
    subtipo: "confusion_prefijo",
    texto_mostrado: "El avión despegó aveloz.",
    correccion_correcta: "El avión despegó a veloz.",
    regla_ortografica: "La preposición 'a' + 'veloz' va separada: 'a veloz' (mal uso, pero la idea es 'a velocidad').",
    feedback_error: "Acá va separado: 'a veloz'. ¡Las preposiciones no se pegan!",
  },
  {
    id: "CARTA-010",
    nivel: 3,
    tipo_error: "uso_b_v",
    subtipo: "confusion_prefijo",
    texto_mostrado: "El niño suvió la colina.",
    correccion_correcta: "El niño subió la colina.",
    regla_ortografica: "El prefijo 'sub-' lleva siempre 'b': 'subió', 'submarino'.",
    feedback_error: "El verbo 'subir' se escribe con 'b'. ¡Subió, no suvió!",
  },
  {
    id: "CARTA-011",
    nivel: 3,
    tipo_error: "uso_b_v",
    subtipo: "confusion_prefijo",
    texto_mostrado: "El examen fue ovio.",
    correccion_correcta: "El examen fue obvio.",
    regla_ortografica: "El prefijo 'ob-' lleva 'b': 'obvio', 'obtener'.",
    feedback_error: "Acá va 'b' en 'obvio'. ¡El prefijo 'ob-' nunca cambia!",
  },
  {
    id: "CARTA-012",
    nivel: 3,
    tipo_error: "uso_b_v",
    subtipo: "confusion_prefijo",
    texto_mostrado: "El abuelo aporta saviduría.",
    correccion_correcta: "El abuelo aporta sabiduría.",
    regla_ortografica: "'Sabiduría' viene de 'saber', con 'b'.",
    feedback_error: "Familia de 'saber' siempre con 'b': 'sabiduría', 'sabio'.",
  },

  // Nivel 4 — Agudas con tilde
  {
    id: "CARTA-013",
    nivel: 4,
    tipo_error: "clasificacion_acentos",
    subtipo: "aguda",
    texto_mostrado: "El cafe está caliente.",
    correccion_correcta: "El café está caliente.",
    regla_ortografica: "Aguda terminada en vocal: lleva tilde. 'Café'.",
    feedback_error: "Las agudas terminadas en vocal llevan tilde: 'café'.",
  },
  {
    id: "CARTA-014",
    nivel: 4,
    tipo_error: "clasificacion_acentos",
    subtipo: "aguda",
    texto_mostrado: "Quiero un nacatamal, porfa.",
    correccion_correcta: "Quiero un nacatamal, porfa.",
    regla_ortografica: "Aguda terminada en 'l' (consonante): NO lleva tilde.",
    feedback_error: "Las agudas terminadas en consonante (distinta de n/s) NO llevan tilde. 'Nacatamal' está bien.",
  },
  {
    id: "CARTA-015",
    nivel: 4,
    tipo_error: "clasificacion_acentos",
    subtipo: "aguda",
    texto_mostrado: "Compró vigorón en Granada.",
    correccion_correcta: "Compró vigorón en Granada.",
    regla_ortografica: "Aguda terminada en 'n': lleva tilde si es aguda. 'Vigorón'.",
    feedback_error: "Esta carta está bien. 'Vigorón' sí lleva tilde (aguda terminada en n).",
  },
  {
    id: "CARTA-016",
    nivel: 4,
    tipo_error: "clasificacion_acentos",
    subtipo: "aguda",
    texto_mostrado: "El camion llegó al mercado.",
    correccion_correcta: "El camión llegó al mercado.",
    regla_ortografica: "Aguda terminada en 'n': lleva tilde. 'Camión'.",
    feedback_error: "'Camión' es aguda terminada en 'n', lleva tilde. ¡A sellar!",
  },

  // Nivel 5 — Graves (con/sin tilde)
  {
    id: "CARTA-017",
    nivel: 5,
    tipo_error: "clasificacion_acentos",
    subtipo: "grave",
    texto_mostrado: "El árbol da sombra.",
    correccion_correcta: "El árbol da sombra.",
    regla_ortografica: "Grave terminada en 'l' (no n/s): ¿lleva tilde? 'Árbol' sí, 'sombra' no (es grave sin tilde).",
    feedback_error: "Ojo: 'árbol' lleva tilde, pero 'sombra' no. Esta carta está bien.",
  },
  {
    id: "CARTA-018",
    nivel: 5,
    tipo_error: "clasificacion_acentos",
    subtipo: "grave",
    texto_mostrado: "La cuajada está fresca.",
    correccion_correcta: "La cuajada está fresca.",
    regla_ortografica: "Grave terminada en vocal: NO lleva tilde. 'Cuajada', 'fresca'.",
    feedback_error: "Ningún error. Las graves terminadas en vocal no llevan tilde.",
  },
  {
    id: "CARTA-019",
    nivel: 5,
    tipo_error: "clasificacion_acentos",
    subtipo: "grave",
    texto_mostrado: "El lápiz se rompió.",
    correccion_correcta: "El lápiz se rompió.",
    regla_ortografica: "Grave terminada en 'z' (no n/s/vocal): lleva tilde. 'Lápiz'.",
    feedback_error: "'Lápiz' lleva tilde (grave terminada en z, no en n/s).",
  },
  {
    id: "CARTA-020",
    nivel: 5,
    tipo_error: "clasificacion_acentos",
    subtipo: "grave",
    texto_mostrado: "Carne asada con chimichurri.",
    correccion_correcta: "Carne asada con chimichurri.",
    regla_ortografica: "Graves terminadas en vocal: NO llevan tilde. 'Carne', 'asada' están bien.",
    feedback_error: "Esta carta no tiene errores. ¡Leé con cuidado!",
  },

  // Nivel 6 — Esdrújulas (siempre con tilde)
  {
    id: "CARTA-021",
    nivel: 6,
    tipo_error: "clasificacion_acentos",
    subtipo: "esdrujula",
    texto_mostrado: "La musica nicaragüense es linda.",
    correccion_correcta: "La música nicaragüense es linda.",
    regla_ortografica: "Esdrújula: siempre lleva tilde. 'Música'.",
    feedback_error: "Toda esdrújula lleva tilde. 'Música' la necesita.",
  },
  {
    id: "CARTA-022",
    nivel: 6,
    tipo_error: "clasificacion_acentos",
    subtipo: "esdrujula",
    texto_mostrado: "El rápido va rápido.",
    correccion_correcta: "El rápido va rápido.",
    regla_ortografica: "Esdrújulas siempre con tilde. 'Rápido'.",
    feedback_error: "Esta carta está bien. 'Rápido' lleva tilde.",
  },
  {
    id: "CARTA-023",
    nivel: 6,
    tipo_error: "clasificacion_acentos",
    subtipo: "esdrujula",
    texto_mostrado: "Una pajaro canta en el árbol.",
    correccion_correcta: "Un pájaro canta en el árbol.",
    regla_ortografica: "Esdrújula 'pájaro' siempre con tilde; y es 'un pájaro' (masculino).",
    feedback_error: "Dos errores: 'un pájaro' (con tilde, masculino). ¡A revisar!",
  },
  {
    id: "CARTA-024",
    nivel: 6,
    tipo_error: "clasificacion_acentos",
    subtipo: "esdrujula",
    texto_mostrado: "El sabado voy a Masaya.",
    correccion_correcta: "El sábado voy a Masaya.",
    regla_ortografica: "Esdrújula 'sábado' siempre con tilde.",
    feedback_error: "'Sábado' es esdrújula, siempre lleva tilde. ¡Sellala bien!",
  },

  // Nivel 7 — Exclamativas sin ¡ de apertura
  {
    id: "CARTA-025",
    nivel: 7,
    tipo_error: "signos_apertura",
    subtipo: "exclamativa_sin_apertura",
    texto_mostrado: "Qué rica está la vigorón!",
    correccion_correcta: "¡Qué rica está la vigorón!",
    regla_ortografica: "Las exclamaciones en español abren con ¡ y cierran con !.",
    feedback_error: "Faltó el signo de apertura ¡. ¡Las exclamaciones abren y cierran!",
  },
  {
    id: "CARTA-026",
    nivel: 7,
    tipo_error: "signos_apertura",
    subtipo: "exclamativa_sin_apertura",
    texto_mostrado: "Ay, me quemé con el pinol!",
    correccion_correcta: "¡Ay, me quemé con el pinol!",
    regla_ortografica: "Toda exclamación abre con ¡.",
    feedback_error: "Antes de 'Ay' va el signo ¡. ¡No te olvides de abrir!",
  },
  {
    id: "CARTA-027",
    nivel: 7,
    tipo_error: "signos_apertura",
    subtipo: "exclamativa_sin_apertura",
    texto_mostrado: "Qué calor hace en León!",
    correccion_correcta: "¡Qué calor hace en León!",
    regla_ortografica: "Las frases que empiezan con 'Qué' son exclamativas: abren con ¡.",
    feedback_error: "Faltó el ¡ inicial. ¡Acordate de abrir siempre!",
  },
  {
    id: "CARTA-028",
    nivel: 7,
    tipo_error: "signos_apertura",
    subtipo: "exclamativa_sin_apertura",
    texto_mostrado: "Viva Nicaragua libre!",
    correccion_correcta: "¡Viva Nicaragua libre!",
    regla_ortografica: "Las proclamas también abren con ¡.",
    feedback_error: "Antes de 'Viva' va el signo ¡. ¡Viva Nicaragua!",
  },

  // Nivel 8 — Interrogativas sin ¿ de apertura
  {
    id: "CARTA-029",
    nivel: 8,
    tipo_error: "signos_apertura",
    subtipo: "interrogativa_sin_apertura",
    texto_mostrado: "Cuánto cuesta la cuajada?",
    correccion_correcta: "¿Cuánto cuesta la cuajada?",
    regla_ortografica: "Las preguntas abren con ¿ y cierran con ?.",
    feedback_error: "Faltó el signo ¿. ¡Toda pregunta abre con él!",
  },
  {
    id: "CARTA-030",
    nivel: 8,
    tipo_error: "signos_apertura",
    subtipo: "interrogativa_sin_apertura",
    texto_mostrado: "Dónde está el mercado?",
    correccion_correcta: "¿Dónde está el mercado?",
    regla_ortografica: "Las preguntas con 'dónde', 'qué', 'cómo' abren con ¿.",
    feedback_error: "Antes de 'Dónde' va el signo ¿. ¡Las preguntas siempre abren!",
  },
  {
    id: "CARTA-031",
    nivel: 8,
    tipo_error: "signos_apertura",
    subtipo: "interrogativa_sin_apertura",
    texto_mostrado: "Vamos a jugar fútbol?",
    correccion_correcta: "¿Vamos a jugar fútbol?",
    regla_ortografica: "Aunque sea pregunta sin pronombre, también abre con ¿.",
    feedback_error: "Faltó el ¿ inicial. ¡Toda pregunta lo necesita!",
  },
  {
    id: "CARTA-032",
    nivel: 8,
    tipo_error: "signos_apertura",
    subtipo: "interrogativa_sin_apertura",
    texto_mostrado: "Quién quiere pinol?",
    correccion_correcta: "¿Quién quiere pinol?",
    regla_ortografica: "Las preguntas con 'quién' abren con ¿.",
    feedback_error: "Antes de 'Quién' va el ¿. ¡Acordate!",
  },

  // Nivel 9 — Mezcla ¡/¿
  {
    id: "CARTA-033",
    nivel: 9,
    tipo_error: "signos_apertura",
    subtipo: "mezcla_signos",
    texto_mostrado: "¡Cuánto cuesta esta hamaca?",
    correccion_correcta: "¿Cuánto cuesta esta hamaca?",
    regla_ortografica: "Es pregunta: va ¿ al inicio, no ¡.",
    feedback_error: "Es pregunta, no exclamación. Cambiá ¡ por ¿.",
  },
  {
    id: "CARTA-034",
    nivel: 9,
    tipo_error: "signos_apertura",
    subtipo: "mezcla_signos",
    texto_mostrado: "¿Qué rico está el cacao!",
    correccion_correcta: "¡Qué rico está el cacao!",
    regla_ortografica: "Es exclamación: va ¡ al inicio, no ¿.",
    feedback_error: "Es exclamación, no pregunta. Cambiá ¿ por ¡.",
  },
  {
    id: "CARTA-035",
    nivel: 9,
    tipo_error: "signos_apertura",
    subtipo: "mezcla_signos",
    texto_mostrado: "¿Te gustó la vigorón!",
    correccion_correcta: "¿Te gustó la vigorón?",
    regla_ortografica: "Si abriste con ¿, debés cerrar con ?.",
    feedback_error: "Abriste con ¿, entonces cerrá con ?. ¡Parejan los signos!",
  },
  {
    id: "CARTA-036",
    nivel: 9,
    tipo_error: "signos_apertura",
    subtipo: "mezcla_signos",
    texto_mostrado: "¡Cuántas pitahayas quieres?",
    correccion_correcta: "¿Cuántas pitahayas quieres?",
    regla_ortografica: "Es pregunta (cuántas + quieres): abre con ¿.",
    feedback_error: "Es pregunta, no exclamación. Va ¿ al inicio.",
  },

  // Nivel 10 — Clasificar tipo de error (cierre, tipo_error triple)
  {
    id: "CARTA-037",
    nivel: 10,
    tipo_error: "uso_b_v",
    subtipo: "clasificar_tipo",
    texto_mostrado: "El avión voló aveloz.",
    correccion_correcta: "El avión voló a veloz.",
    regla_ortografica: "Errores de b/v + separación de preposición.",
    feedback_error: "Acá hay dos errores: 'voló' (v) y 'a veloz' (separado).",
  },
  {
    id: "CARTA-038",
    nivel: 10,
    tipo_error: "clasificacion_acentos",
    subtipo: "clasificar_tipo",
    texto_mostrado: "El sabado hay feria en Masaya.",
    correccion_correcta: "El sábado hay feria en Masaya.",
    regla_ortografica: "Esdrújula 'sábado': siempre con tilde.",
    feedback_error: "'Sábado' es esdrújula, lleva tilde siempre.",
  },
  {
    id: "CARTA-039",
    nivel: 10,
    tipo_error: "signos_apertura",
    subtipo: "clasificar_tipo",
    texto_mostrado: "Cuánto cuesta el nacatamal?",
    correccion_correcta: "¿Cuánto cuesta el nacatamal?",
    regla_ortografica: "Pregunta: falta el ¿ de apertura.",
    feedback_error: "Es pregunta, abrila con ¿. ¡Última carta, vos podés!",
  },
  {
    id: "CARTA-040",
    nivel: 10,
    tipo_error: "clasificacion_acentos",
    subtipo: "clasificar_tipo",
    texto_mostrado: "El camion sale al mercado.",
    correccion_correcta: "El camión sale al mercado.",
    regla_ortografica: "Aguda terminada en 'n': lleva tilde.",
    feedback_error: "Aguda terminada en 'n' lleva tilde: 'camión'. ¡Última carta sellada!",
  },
];

// Helpers
export const cartasPorNivel = (nivel: number): Carta[] =>
  cartasNiveles.filter((c) => c.nivel === nivel);

export const totalNivelesCarta = 10;
export const cartasPorNivelCount = 4;

export default cartasNiveles;
