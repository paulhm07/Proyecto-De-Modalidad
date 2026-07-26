// Genera Documentacion Tecnica EducaPlay en formato .docx
// Profile A (Formal Report) — Recipe R1 (Pure Paragraph Left), palette WM-1 (Warm Teal, education)

const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, HeadingLevel, PageNumber, PageBreak,
  Table, TableRow, TableCell, TableLayoutType,
  WidthType, BorderStyle, ShadingType, VerticalAlign,
  LevelFormat, NumberFormat, SectionType, PageOrientation,
} = require("docx");
const fs = require("fs");
const path = require("path");

// ──────────────────────────────────────────────────────────────
// 1. Paleta — WM-1 Warm Teal (education)
// ──────────────────────────────────────────────────────────────
const P = {
  primary: "15857A", body: "1A1A1A", secondary: "5A5A5A",
  accent: "15857A", surface: "F0EDE5",
  cover: {
    titleColor: "15857A", subtitleColor: "606060",
    metaColor: "707070", footerColor: "A0A0A0",
  },
  table: { headerBg: "15857A", headerText: "FFFFFF", accentLine: "15857A", innerLine: "D5D0C8", surface: "F0EDE5" },
};
const c = (hex) => hex.replace("#", "");

// ──────────────────────────────────────────────────────────────
// 2. Helpers
// ──────────────────────────────────────────────────────────────
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NB, bottom: NB, left: NB, right: NB };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

function safeText(v, ph) {
  if (v === undefined || v === null || v === "" || String(v) === "NaN" || String(v) === "undefined") {
    return ph || "[Por completar]";
  }
  return String(v);
}

// Headings
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.LEFT,
    spacing: { before: 480, after: 200, line: 360 },
    children: [new TextRun({ text, bold: true, color: c(P.primary), size: 32,
      font: { ascii: "Calibri", eastAsia: "SimHei" } })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 160, line: 340 },
    children: [new TextRun({ text, bold: true, color: c(P.primary), size: 28,
      font: { ascii: "Calibri", eastAsia: "SimHei" } })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120, line: 320 },
    children: [new TextRun({ text, bold: true, color: c(P.primary), size: 26,
      font: { ascii: "Calibri", eastAsia: "SimHei" } })],
  });
}

// Body paragraph — justified, first-line indent
function body(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 312, after: 120 },
    children: [new TextRun({ text: safeText(text), size: 24, color: c(P.body),
      font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

// Bullet paragraph
function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { line: 312, after: 80 },
    children: [new TextRun({ text: safeText(text), size: 24, color: c(P.body),
      font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

// Numbered paragraph
function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "main-numbering", level },
    spacing: { line: 312, after: 80 },
    children: [new TextRun({ text: safeText(text), size: 24, color: c(P.body),
      font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
  });
}

// Code block paragraph (monospace, no indent)
function codeLine(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { line: 280, after: 0 },
    indent: { left: 360 },
    shading: { type: ShadingType.CLEAR, fill: "F4F4F4" },
    children: [new TextRun({ text: safeText(text), size: 20, color: "1A1A1A",
      font: { ascii: "Courier New", eastAsia: "Courier New" } })],
  });
}

// Generic 2-col table builder (label + content)
function buildInfoTable(rows) {
  const tableRows = rows.map(([label, content], idx) => new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 30, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: P.table.surface },
        margins: { top: 100, bottom: 100, left: 160, right: 160 },
        children: [new Paragraph({
          spacing: { line: 280 },
          children: [new TextRun({ text: label, bold: true, size: 22, color: c(P.primary),
            font: { ascii: "Calibri", eastAsia: "SimHei" } })],
        })],
      }),
      new TableCell({
        width: { size: 70, type: WidthType.PERCENTAGE },
        margins: { top: 100, bottom: 100, left: 160, right: 160 },
        children: [new Paragraph({
          spacing: { line: 280 },
          children: [new TextRun({ text: content, size: 22, color: c(P.body),
            font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
        })],
      }),
    ],
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: c(P.table.accentLine) },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: c(P.table.accentLine) },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: c(P.table.innerLine) },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: c(P.table.innerLine) },
    },
    rows: tableRows,
  });
}

// Multi-column data table builder with header row
function buildDataTable(headers, dataRows, colWidths) {
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: headers.map((text, i) => new TableCell({
      width: { size: colWidths[i], type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: P.table.headerBg },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [new Paragraph({
        spacing: { line: 280 },
        children: [new TextRun({ text, bold: true, size: 22, color: c(P.table.headerText),
          font: { ascii: "Calibri", eastAsia: "SimHei" } })],
      })],
    })),
  });
  const bodyRows = dataRows.map((row, idx) => new TableRow({
    cantSplit: true,
    children: row.map((text, i) => new TableCell({
      width: { size: colWidths[i], type: WidthType.PERCENTAGE },
      shading: idx % 2 === 0
        ? { type: ShadingType.CLEAR, fill: P.table.surface }
        : { type: ShadingType.CLEAR, fill: "FFFFFF" },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [new Paragraph({
        spacing: { line: 280 },
        children: [new TextRun({ text: safeText(text), size: 21, color: c(P.body),
          font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" } })],
      })],
    })),
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: c(P.table.accentLine) },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: c(P.table.accentLine) },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: c(P.table.innerLine) },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [headerRow, ...bodyRows],
  });
}

// ──────────────────────────────────────────────────────────────
// 3. Cover (R1-style: pure paragraph left, white bg, accent bar)
// ──────────────────────────────────────────────────────────────
function buildCover() {
  const wrapper = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [
      new TableRow({
        cantSplit: true,
        height: { value: 16838, rule: "exact" },
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            shading: { type: ShadingType.CLEAR, fill: "FFFFFF" },
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            borders: noBorders,
            children: [
              // Top accent bar
              new Paragraph({
                spacing: { before: 0, after: 0, line: 240 },
                border: { bottom: { style: BorderStyle.SINGLE, size: 36, color: c(P.accent), space: 0 } },
                children: [new TextRun({ text: "", size: 2 })],
              }),
              // Top label
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 3600, after: 0, line: 280 },
                indent: { left: 1701, right: 1417 },
                children: [new TextRun({
                  text: "DOCUMENTACION TECNICA DEL PROYECTO",
                  size: 22, color: c(P.secondary), bold: true, characterSpacing: 60,
                  font: { ascii: "Calibri" },
                })],
              }),
              // Main title
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 240, after: 0, line: 1012, lineRule: "atLeast" },
                indent: { left: 1701, right: 1417 },
                children: [new TextRun({
                  text: "EducaPlay",
                  size: 88, bold: true, color: c(P.cover.titleColor),
                  font: { ascii: "Calibri" },
                })],
              }),
              // Subtitle
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 120, after: 0, line: 560, lineRule: "atLeast" },
                indent: { left: 1701, right: 1417 },
                children: [new TextRun({
                  text: "Plataforma Educativa Gamificada para Tercer Grado",
                  size: 36, color: c(P.cover.subtitleColor),
                  font: { ascii: "Calibri" },
                })],
              }),
              // Second subtitle
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 80, after: 0, line: 360, lineRule: "atLeast" },
                indent: { left: 1701, right: 1417 },
                children: [new TextRun({
                  text: "Aplicacion Web + Movil Android | Curriculo MINED Nicaragua",
                  size: 24, color: c(P.cover.subtitleColor), italics: true,
                  font: { ascii: "Calibri" },
                })],
              }),
              // Spacer
              new Paragraph({ spacing: { before: 4800, after: 0 }, children: [] }),
              // Meta block
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 0, after: 80, line: 320 },
                indent: { left: 1701, right: 1417 },
                children: [new TextRun({
                  text: "Modalidad: Proyecto de Modalidad de Titulacion",
                  size: 22, color: c(P.cover.metaColor),
                  font: { ascii: "Calibri" },
                })],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 0, after: 80, line: 320 },
                indent: { left: 1701, right: 1417 },
                children: [new TextRun({
                  text: "Carrera: Ingenieria en Sistemas de Informacion",
                  size: 22, color: c(P.cover.metaColor),
                  font: { ascii: "Calibri" },
                })],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 0, after: 80, line: 320 },
                indent: { left: 1701, right: 1417 },
                children: [new TextRun({
                  text: "Nivel Academico: Tercer Grado de Educacion Primaria",
                  size: 22, color: c(P.cover.metaColor),
                  font: { ascii: "Calibri" },
                })],
              }),
              // Bottom accent line
              new Paragraph({
                spacing: { before: 1800, after: 0, line: 240 },
                indent: { left: 1701, right: 1417 },
                border: { top: { style: BorderStyle.SINGLE, size: 12, color: c(P.accent), space: 8 } },
                children: [new TextRun({ text: "", size: 2 })],
              }),
              // Footer line
              new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 120, after: 0, line: 280 },
                indent: { left: 1701, right: 1417 },
                children: [new TextRun({
                  text: "Documento Tecnico | Monografia de Titulacion",
                  size: 20, color: c(P.cover.footerColor), bold: true, characterSpacing: 40,
                  font: { ascii: "Calibri" },
                })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
  return [wrapper];
}

// ──────────────────────────────────────────────────────────────
// 4. Body content
// ──────────────────────────────────────────────────────────────
function buildBody() {
  const children = [];

  // ===== 1. Resumen y Proposito General =====
  children.push(h1("1. Resumen y Proposito General"));

  children.push(h2("1.1 Que es EducaPlay"));
  children.push(body(
    "EducaPlay es una plataforma educativa multilateral (web y movil) de tipo gamificado, " +
    "disenada para reforzar las competencias del curriculo oficial de Tercer Grado de Educacion " +
    "Primaria del Ministerio de Educacion de Nicaragua (MINED). La aplicacion combina mecanicas " +
    "de videojuegos (puntuacion, avatares, medallas, retos) con contenidos pedagogicos alineados " +
    "a cuatro modulos academicos: Multiplicacion y Division, Fracciones y Geometria, Comprension " +
    "y Sintaxis, y Ortografia y Signos."
  ));

  children.push(h2("1.2 Objetivo Principal"));
  children.push(body(
    "Articular el aprendizaje escolar con experiencias ludicas interactivas que permitan a los " +
    "estudiantes practicar contenidos curriculares fuera del aula, mientras los docentes y padres " +
    "de familia acompanan, miden y orientan el progreso academico desde roles diferenciados."
  ));

  children.push(h2("1.3 Problema que Resuelve"));
  children.push(bullet("Baja motivacion hacia el estudio de matematica y lengua en estudiantes de tercer grado."));
  children.push(bullet("Falta de herramientas digitales locales, en espanol, alineadas al curriculo MINED."));
  children.push(bullet("Ausencia de seguimiento individualizado del progreso del estudiante por parte de maestros y padres."));
  children.push(bullet("Desconexion entre hogar y escuela en el acompanamiento academico."));

  children.push(h2("1.4 Publico Destinatario"));
  children.push(body("La plataforma define tres roles de usuario claramente separados:"));
  children.push(buildDataTable(
    ["Rol", "Funcion dentro de la plataforma"],
    [
      ["Estudiante", "Juega los minijuegos, personaliza su avatar, gana monedas y medallas, escala de nivel."],
      ["Padre / Madre", "Visualiza el avance academico de su hijo o hija, tiempo de juego y areas a reforzar."],
      ["Maestro / a", "Administra su grupo de alumnos, consulta metricas de desempeno y asigna retos personalizados."],
    ],
    [25, 75]
  ));

  // ===== 2. Stack Tecnologico y Requisitos =====
  children.push(h1("2. Stack Tecnologologico y Requisitos"));

  children.push(h2("2.1 Aplicacion Web (Frontend)"));
  children.push(buildDataTable(
    ["Componente", "Tecnologia", "Funcion"],
    [
      ["Framework", "Next.js 16 (App Router)", "Renderizado hibrido SSR/CSR, enrutado por archivos, API Routes."],
      ["Lenguaje", "TypeScript 5", "Tipado estatico y seguridad en tiempo de compilacion."],
      ["Libreria UI", "React 19", "Construccion de interfaces componentizadas."],
      ["Estilos", "Tailwind CSS 4", "Diseno utilitario, responsivo y tematizable."],
      ["Componentes", "shadcn/ui + Radix UI + Lucide", "Sistema de componentes accesibles y consistentes."],
      ["Estado", "Zustand + TanStack Query", "Estado cliente y estado servidor con cache."],
      ["Animaciones", "Framer Motion", "Transiciones fluidas entre vistas."],
      ["Formularios", "React Hook Form + Zod", "Validacion declarativa de esquemas."],
      ["Graficas", "Recharts", "Visualizacion de progreso y ranking."],
    ],
    [22, 30, 48]
  ));

  children.push(h2("2.2 Backend (Servidor)"));
  children.push(buildDataTable(
    ["Componente", "Tecnologia", "Funcion"],
    [
      ["Framework servidor", "NestJS 11", "Arquitectura modular, inyeccion de dependencias, controladores."],
      ["ORM", "Prisma 7", "Modelado y migracion de la base de datos."],
      ["Base de datos", "SQLite (better-sqlite3)", "Persistencia local ligera sin servidor adicional."],
      ["Autenticacion", "JWT (JSON Web Tokens) + Guards", "Seguridad stateless para endpoints protegidos."],
      ["Validacion", "DTOs con class-validator", "Validacion de carga util entrante."],
    ],
    [22, 30, 48]
  ));

  children.push(h2("2.3 Aplicacion Movil (Modulo de Maestro - Android)"));
  children.push(buildDataTable(
    ["Componente", "Tecnologia", "Funcion"],
    [
      ["Lenguaje", "Java 17", "Logica de aplicacion, compatible con Android API 21+."],
      ["IDE", "Android Studio (Hedgehog+)", "Entorno oficial de desarrollo."],
      ["Arquitectura", "MVVM (Model-View-ViewModel)", "Separacion de responsabilidades y observabilidad."],
      ["Base de datos local", "Room (SQLite ORM)", "Persistencia offline de maestros, alumnos, progreso y retos."],
      ["Bindings", "ViewBinding", "Acceso tipado a vistas XML."],
      ["Diseno", "Material Design 3", "Componentes visuales modernos y coherentes."],
      ["Red", "Retrofit 2 + OkHttp + Gson", "Cliente HTTP tipado para consumir la API NestJS."],
      ["Seguridad", "EncryptedSharedPreferences", "Almacenamiento cifrado de la sesion JWT (AES-256)."],
      ["Concurrencia", "RxJava 2 + LiveData", "Operaciones asincronas y reactivas en UI."],
      ["Sincronizacion", "WorkManager", "Tareas en segundo plano para sincronizar progreso con el servidor."],
      ["Pruebas", "JUnit 4 + Robolectric + Mockito + Truth", "Pruebas unitarias de DAOs, ViewModel y sesion."],
    ],
    [22, 30, 48]
  ));

  children.push(h2("2.4 Servicios de IA Integrados"));
  children.push(buildDataTable(
    ["Habilidad", "Proposito en la aplicacion"],
    [
      ["z-ai-web-dev-sdk", "Generacion de imagenes, sintesis de voz (TTS) y lectura de paginas, usados para enriquecer los minijuegos y los materiales descargables."],
    ],
    [30, 70]
  ));

  children.push(h2("2.5 Requisitos Minimos de Hardware y Sistema"));
  children.push(h3("2.5.1 Para desarrollo (web + backend)"));
  children.push(bullet("Procesador de 2 nucleos, 4 GB de RAM."));
  children.push(bullet("Node.js 20+ y Bun runtime."));
  children.push(bullet("1 GB de espacio en disco."));
  children.push(h3("2.5.2 Para desarrollo Android"));
  children.push(bullet("Procesador de 4 nucleos, 8 GB de RAM recomendados."));
  children.push(bullet("Android Studio actualizado."));
  children.push(bullet("JDK 17."));
  children.push(bullet("SDK Android API 34 (compileSdk) y minSdk 24."));
  children.push(h3("2.5.3 Para ejecucion movil (usuario final)"));
  children.push(bullet("Dispositivo Android 6.0 (Marshmallow, API 23) o superior."));
  children.push(bullet("100 MB de espacio libre."));
  children.push(bullet("Conexion a internet solo para sincronizacion inicial; el modulo funciona offline-first."));

  // ===== 3. Arquitectura y Estructura =====
  children.push(h1("3. Arquitectura y Estructura"));

  children.push(h2("3.1 Arquitectura General del Sistema"));
  children.push(body(
    "EducaPlay adopta una arquitectura cliente-servidor de tres capas, con un cliente web (Next.js), " +
    "un cliente movil nativo (Android) y un servidor central (NestJS). Ambos clientes comparten los " +
    "mismos endpoints REST y la misma base de datos relacional SQLite, garantizando coherencia de " +
    "datos entre plataformas."
  ));
  children.push(body(
    "El esquema general de comunicacion es el siguiente: los clientes envian peticiones HTTP " +
    "autenticadas con JWT al servidor NestJS, el cual interactua con la capa de persistencia " +
    "mediante Prisma ORM sobre SQLite. La aplicacion Android mantiene ademas una copia local " +
    "en Room que se sincroniza periodicamente con el servidor mediante WorkManager."
  ));

  children.push(h2("3.2 Estructura del Proyecto Web"));
  children.push(body("La estructura de carpetas del frontend Next.js sigue el patron App Router:"));
  const codeWeb = [
    "src/",
    "|-- app/                  # App Router (Next.js 16)",
    "|   |-- page.tsx          # Punto de entrada de la SPA",
    "|   |-- layout.tsx        # Layout raiz con proveedores",
    "|   |-- globals.css       # Variables Tailwind y tema",
    "|   '-- api/              # API Routes locales",
    "|-- components/",
    "|   |-- ui/               # 40+ componentes shadcn/ui",
    "|   |-- LoginScreen.tsx",
    "|   |-- Dashboard.tsx",
    "|   |-- TeacherDashboard.tsx",
    "|   |-- ParentDashboard.tsx",
    "|   '-- (7 minijuegos: PulperiaFracciones, CamionMultiplicaciones,",
    "|         BusLetras, CartaOrtografia, AtrapaAcento, AlimentaMonstruo,",
    "|         CazadorSilabas)",
    "|-- context/AppContext.tsx         # Estado global",
    "|-- data/                          # Bancos de preguntas MINED",
    "|-- lib/",
    "|   |-- api.ts                     # Cliente HTTP tipado",
    "|   |-- db.ts                      # Prisma Client",
    "|   '-- types.ts                   # Tipos compartidos",
    "'-- hooks/                         # use-toast, use-mobile",
  ];
  codeWeb.forEach(line => children.push(codeLine(line)));

  children.push(h2("3.3 Estructura del Backend NestJS"));
  children.push(body("El backend sigue el patron modular caracteristico de NestJS:"));
  const codeBackend = [
    "backend/src/",
    "|-- app.module.ts          # Modulo raiz",
    "|-- main.ts                # Bootstrap (puerto 3001)",
    "|-- prisma.service.ts      # Singleton Prisma",
    "|-- prisma.module.ts",
    "|-- usuarios/              # Login, registro, demo, CRUD usuarios",
    "|-- progreso/              # Persistencia de partidas y metricas",
    "|-- retos/                 # Asignacion y seguimiento de retos",
    "|-- desafios/              # Banco de desafios del MINED",
    "'-- avatars/               # Tienda y equipamiento de avatares",
  ];
  codeBackend.forEach(line => children.push(codeLine(line)));

  children.push(h2("3.4 Estructura del Modulo Android (MVVM)"));
  children.push(body("La aplicacion movil del maestro se organiza en capas MVVM:"));
  const codeAndroid = [
    "com.educaplay.teacher/",
    "|-- EducaPlayApp.java              # Application (init Room, Retrofit)",
    "|-- data/",
    "|   |-- local/",
    "|   |   |-- AppDatabase.java       # Base de datos Room (singleton)",
    "|   |   |-- entity/                # Maestro, Alumno, Progreso, Reto",
    "|   |   |-- dao/                   # MaestroDao, AlumnoDao, ProgresoDao, RetoDao",
    "|   |   '-- DatabaseSeeder.java    # Datos semilla para demo offline",
    "|   |-- remote/",
    "|   |   |-- ApiClient.java         # Configuracion Retrofit",
    "|   |   |-- EducaPlayApi.java      # Interfaz de endpoints",
    "|   |   '-- dto/                   # LoginDTO, AlumnoDTO, ProgresoDTO, RetoDTO, SyncDTO",
    "|   '-- repository/",
    "|       |-- MaestroRepository.java        # Repositorio local",
    "|       '-- MaestroRemoteRepository.java  # Repositorio remoto",
    "|-- security/",
    "|   '-- SessionManager.java        # JWT cifrado con EncryptedSharedPreferences",
    "|-- work/",
    "|   '-- SyncWorker.java            # WorkManager: sync cada 15 min",
    "|-- ui/",
    "|   |-- login/LoginActivity.java",
    "|   |-- dashboard/MaestroDashboardActivity.java",
    "|   |-- dashboard/AlumnoAdapter.java",
    "|   |-- detalle/AlumnoDetalleActivity.java",
    "|   |-- detalle/ProgresoMinijuegoAdapter.java",
    "|   |-- detalle/RetoAdapter.java",
    "|   |-- detalle/AsignarRetoDialogFragment.java",
    "|   '-- viewmodel/                  # MaestroDashboardViewModel, AlumnoDetalleViewModel",
    "'-- res/layout/                     # 7 XML de layouts Material 3",
  ];
  codeAndroid.forEach(line => children.push(codeLine(line)));

  children.push(h2("3.5 Pantallas y Componentes Clave"));
  children.push(h3("3.5.1 Aplicacion Web"));
  children.push(numbered("LoginScreen: Seleccion de rol y acceso por usuario/contrasena o cuentas demo."));
  children.push(numbered("Dashboard del Estudiante: Acceso a los 7 minijuegos, tienda de avatares, ranking y medallas."));
  children.push(numbered("TeacherDashboard: Listado de alumnos con metricas agregadas y asignacion de retos."));
  children.push(numbered("ParentDashboard: Reporte visual de progreso del hijo o hija."));
  children.push(numbered("Siete minijuegos: La Pulperia de Fracciones, El Camion de las Multiplicaciones, El Bus de las Letras, La Carta Mal Enviada, Atrapa el Acento, Alimenta al Monstruo y Cazador de Silabas."));
  children.push(h3("3.5.2 Aplicacion Movil (Modulo Maestro)"));
  children.push(numbered("LoginActivity: Autenticacion con JWT contra el backend NestJS."));
  children.push(numbered("MaestroDashboardActivity: Lista de alumnos del maestro con tarjetas resumen (puntaje promedio, actividades completadas)."));
  children.push(numbered("AlumnoDetalleActivity: Vista detallada con puntuacion por asignatura (Matematica y Lengua), tiempo jugado, retos activos y bitacora de progreso por minijuego."));
  children.push(numbered("AsignarRetoDialogFragment: Dialogo Material 3 para asignar un nuevo reto (minijuego + nivel + fecha limite)."));

  children.push(h2("3.6 Modelo de Datos (Prisma)"));
  children.push(body("El esquema central de la base de datos incluye tres modelos principales:"));
  const codePrisma = [
    "model Usuario {",
    "  id        Int      @id @default(autoincrement())",
    "  nombre    String",
    "  password  String",
    "  rol       Rol      // ESTUDIANTE | PADRE | MAESTRO",
    "  avatarUrl String?",
    "  monedas   Int      @default(0)",
    "  progreso  Progreso[]",
    "  retos     Reto[]",
    "}",
    "",
    "model Progreso {",
    "  id           Int      @id @default(autoincrement())",
    "  usuarioId    Int",
    "  usuario      Usuario  @relation(fields: [usuarioId], references: [id])",
    "  minijuego    String",
    "  puntuacion   Int",
    "  aciertos     Int",
    "  total        Int",
    "  tiempoSeg    Int",
    "  asignatura   String   // MATEMATICA | LENGUA",
    "  createdAt    DateTime @default(now())",
    "}",
    "",
    "model Reto {",
    "  id           Int      @id @default(autoincrement())",
    "  maestroId    Int",
    "  alumnoId     Int",
    "  minijuego    String",
    "  nivel        Int",
    "  fechaLimite  DateTime",
    "  completado   Boolean  @default(false)",
    "}",
  ];
  codePrisma.forEach(line => children.push(codeLine(line)));

  // ===== 4. Proceso de Desarrollo =====
  children.push(h1("4. Proceso de Desarrollo"));

  children.push(h2("4.1 Metodologia y Fases"));
  children.push(body(
    "El proyecto se desarrollo bajo una metodologia iterativa e incremental, dividida en cinco fases " +
    "consecutivas que aseguran la entrega progresiva de funcionalidad verificable."
  ));
  children.push(h3("Fase I - Analisis y Diseno Pedagogico"));
  children.push(bullet("Revision del curriculo MINED de tercer grado."));
  children.push(bullet("Definicion de cuatro modulos academicos y mapeo a siete minijuegos."));
  children.push(bullet("Diseno de banco de preguntas y desafios en JSON estructurado."));
  children.push(h3("Fase II - Construccion del Backend"));
  children.push(bullet("Modelado de la base de datos con Prisma."));
  children.push(bullet("Implementacion de controladores REST para usuarios, progreso, retos, desafios y avatares."));
  children.push(bullet("Seguridad con JWT y guards por rol."));
  children.push(h3("Fase III - Desarrollo del Frontend Web"));
  children.push(bullet("Implementacion de la SPA en Next.js 16 con App Router."));
  children.push(bullet("Construccion de los siete minijuegos como componentes React aislados."));
  children.push(bullet("Integracion de avatares SVG parametrizables, tienda con monedas y medallas."));
  children.push(h3("Fase IV - Desarrollo del Modulo Android"));
  children.push(bullet("Diseno de la arquitectura MVVM con capa de datos local (Room) y remota (Retrofit)."));
  children.push(bullet("Implementacion offline-first con semilla de datos para demostracion sin red."));
  children.push(bullet("Cifrado de sesion con EncryptedSharedPreferences."));
  children.push(bullet("Sincronizacion periodica mediante WorkManager."));
  children.push(h3("Fase V - Pruebas y Verificacion"));
  children.push(bullet("Pruebas unitarias con Robolectric sobre DAOs en base de datos en memoria."));
  children.push(bullet("Pruebas del ViewModel con Mockito y Truth assertions."));
  children.push(bullet("Verificacion end-to-end con navegador headless."));

  children.push(h2("4.2 Funcionalidades Principales (paso a paso)"));
  children.push(h3("4.2.1 Autenticacion multirrol"));
  children.push(numbered("El usuario selecciona su rol en la pantalla de inicio."));
  children.push(numbered("Se envian credenciales al endpoint POST /api/usuarios/login."));
  children.push(numbered("El servidor valida, genera un JWT y devuelve el usuario con su rol."));
  children.push(numbered("El cliente almacena el token (web: localStorage; Android: cifrado)."));
  children.push(numbered("Las peticiones posteriores incluyen la cabecera Authorization: Bearer seguido del token."));

  children.push(h3("4.2.2 Registro de progreso de un minijuego"));
  children.push(numbered("El estudiante juega y al finalizar se calculan puntuacion, aciertos, total y tiempoSeg."));
  children.push(numbered("Se envian al endpoint POST /api/progreso."));
  children.push(numbered("El backend persiste el registro y recalcula medallas automaticas."));
  children.push(numbered("En Android, el registro se guarda primero en Room y se encola para sincronizacion."));

  children.push(h3("4.2.3 Asignacion de retos (modulo maestro)"));
  children.push(numbered("El docente abre el detalle de un alumno."));
  children.push(numbered("Pulsa el boton Asignar reto y se abre el dialogo AsignarRetoDialogFragment."));
  children.push(numbered("Selecciona minijuego, nivel y fecha limite."));
  children.push(numbered("Se inserta en RetoEntity (Room) y se envia al endpoint POST /api/retos."));
  children.push(numbered("El estudiante ve el reto en su dashboard con una insignia Nuevo."));

  children.push(h3("4.2.4 Sincronizacion offline-first (Android)"));
  children.push(numbered("SyncWorker se ejecuta cada 15 minutos via WorkManager."));
  children.push(numbered("Consulta los registros locales con synced = 0."));
  children.push(numbered("Los envia por lote a POST /api/sync/progreso."));
  children.push(numbered("Marca los registros como sincronizados en Room."));

  children.push(h2("4.3 Principales Retos Tecnicos Resueltos"));
  children.push(buildDataTable(
    ["Reto", "Solucion aplicada"],
    [
      ["Persistencia confiable sin conexion", "Arquitectura offline-first con Room + WorkManager."],
      ["Seguridad del token en dispositivo", "EncryptedSharedPreferences con AES-256."],
      ["Coherencia de estado entre web y movil", "Ambos clientes consumen la misma API REST y los mismos DTOs."],
      ["Renderizado fluido de minijuegos animados", "Uso de Framer Motion y SVG parametrizable."],
      ["Accesibilidad y responsividad", "Componentes Radix/shadcn + Tailwind responsivo + soporte ARIA."],
      ["Pruebas sin dispositivo fisico", "Robolectric con base de datos Room en memoria."],
      ["Comparticion de tipos entre cliente y servidor", "Tipos TypeScript centralizados en src/lib/types.ts."],
    ],
    [38, 62]
  ));

  // ===== 5. Guia de Uso / Manual Rapido =====
  children.push(h1("5. Guia de Uso / Manual Rapido"));

  children.push(h2("5.1 Flujo del Estudiante (Web)"));
  children.push(numbered("Abrir la aplicacion en el navegador (la URL la proporciona el docente o el administrador)."));
  children.push(numbered("En la pantalla de inicio, presionar el boton Estudiante o el acceso rapido DemoKid."));
  children.push(numbered("Ingresar nombre de usuario y contrasena (o usar la cuenta demo)."));
  children.push(numbered("Pulsar Entrar a jugar: se muestra el Dashboard con los siete minijuegos."));
  children.push(numbered("Seleccionar un minijuego (por ejemplo, La Pulperia de Fracciones)."));
  children.push(numbered("Leer las instrucciones y pulsar Jugar."));
  children.push(numbered("Responder los reactivos; al finalizar se muestra la pantalla de resultados con monedas ganadas."));
  children.push(numbered("Visitar la Tienda para canjear monedas por accesorios del avatar."));
  children.push(numbered("Consultar el Ranking y las Medallas desde el menu lateral."));

  children.push(h2("5.2 Flujo del Maestro (Web)"));
  children.push(numbered("En la pantalla de inicio, seleccionar rol Maestro/a o MaestroDemo."));
  children.push(numbered("Iniciar sesion: accede al Panel del Maestro."));
  children.push(numbered("Visualizar la lista de alumnos con sus metricas agregadas."));
  children.push(numbered("Para ver detalle, hacer clic sobre un alumno: se abre la vista de progreso individual."));
  children.push(numbered("Pulsar Asignar reto, elegir minijuego, nivel y fecha limite y Guardar."));
  children.push(numbered("El reto aparece inmediatamente en el dashboard del estudiante seleccionado."));

  children.push(h2("5.3 Flujo del Padre / Madre (Web)"));
  children.push(numbered("Seleccionar rol Papa / Mama o PadreDemo."));
  children.push(numbered("Iniciar sesion: accede al Panel Familiar."));
  children.push(numbered("Visualizar el progreso de su hijo o hija en graficas de area por asignatura."));
  children.push(numbered("Consultar tiempo de juego, medallas obtenidas y areas a reforzar."));

  children.push(h2("5.4 Flujo del Modulo Android (Maestro)"));
  children.push(numbered("Abrir la app EducaPlay Teacher en el dispositivo Android."));
  children.push(numbered("Ingresar usuario y contrasena del maestro y pulsar Iniciar sesion."));
  children.push(numbered("El Dashboard del Maestro carga la lista de alumnos (de Room si no hay red, o del servidor si la hay)."));
  children.push(numbered("Tocar un alumno para abrir AlumnoDetalleActivity."));
  children.push(numbered("En la pestana Progreso se ven puntajes en Matematica y Lengua, actividades completadas y tiempo total jugado."));
  children.push(numbered("En la pestana Retos se listan los retos activos y completados."));
  children.push(numbered("Pulsar el boton flotante + para abrir el dialogo Asignar Reto."));
  children.push(numbered("Seleccionar minijuego, nivel y fecha limite y Asignar."));
  children.push(numbered("El reto se guarda localmente y se sincroniza automaticamente con el servidor cuando haya conexion."));

  children.push(h2("5.5 Recomendaciones de Uso"));
  children.push(bullet("Conexion a internet: necesaria solo para la primera autenticacion y para sincronizacion. El modulo Android funciona offline tras el primer login."));
  children.push(bullet("Cuentas demo preconfiguradas para pruebas: Estudiante DemoKid, Padre/Madre PadreDemo, Maestro/a MaestroDemo."));
  children.push(bullet("Navegadores recomendados: Chrome, Edge o Firefox actualizados."));
  children.push(bullet("Dispositivo Android minimo: Android 6.0 (Marshmallow)."));

  // ===== Conclusion Tecnica =====
  children.push(h1("6. Conclusion Tecnica"));
  children.push(body(
    "EducaPlay constituye una solucion integral que combina una arquitectura moderna de tres capas " +
    "(Next.js + NestJS + SQLite) con un cliente movil nativo Android construido bajo el patron MVVM. " +
    "La adopcion de estandares como JWT, Retrofit, Room y Material Design 3 garantiza mantenibilidad, " +
    "escalabilidad y una experiencia de usuario coherente entre plataformas."
  ));
  children.push(body(
    "El enfoque offline-first del modulo movil y la integracion de servicios de IA mediante " +
    "z-ai-web-dev-sdk en el frontend web posicionan al proyecto como una herramienta pedagogica " +
    "alineada al curriculo MINED, tecnicamente robusta y lista para su despliegue en entornos " +
    "educativos reales."
  ));

  return children;
}

// ──────────────────────────────────────────────────────────────
// 5. Document assembly
// ──────────────────────────────────────────────────────────────
const doc = new Document({
  creator: "EducaPlay",
  title: "Documentacion Tecnica - EducaPlay",
  description: "Documento tecnico de la plataforma educativa EducaPlay",
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, size: 24, color: c(P.body) },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 32, bold: true, color: c(P.primary) },
        paragraph: { spacing: { before: 480, after: 200, line: 360 } },
      },
      heading2: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 28, bold: true, color: c(P.primary) },
        paragraph: { spacing: { before: 320, after: 160, line: 340 } },
      },
      heading3: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 26, bold: true, color: c(P.primary) },
        paragraph: { spacing: { before: 240, after: 120, line: 320 } },
      },
    },
  },
  numbering: {
    config: [{
      reference: "main-numbering",
      levels: [{
        level: 0,
        format: LevelFormat.DECIMAL,
        text: "%1.",
        alignment: AlignmentType.START,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } },
      }],
    }],
  },
  sections: [
    // Section 1: Cover (no page number, no footer)
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: buildCover(),
    },
    // Section 2: Body (Arabic page numbers, footer with page number)
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: c(P.accent), space: 4 } },
            children: [new TextRun({
              text: "EducaPlay - Documentacion Tecnica",
              size: 18, color: c(P.secondary), italics: true,
              font: { ascii: "Calibri" },
            })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ children: [PageNumber.CURRENT], size: 20, color: c(P.secondary),
                font: { ascii: "Calibri" } }),
            ],
          })],
        }),
      },
      children: buildBody(),
    },
  ],
});

// ──────────────────────────────────────────────────────────────
// 6. Write file
// ──────────────────────────────────────────────────────────────
const outputPath = path.join(__dirname, "..", "public", "Documentacion-Tecnica-EducaPlay.docx");
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outputPath, buf);
  console.log("Documento generado:", outputPath);
  console.log("Tamano:", (buf.length / 1024).toFixed(2), "KB");
});
