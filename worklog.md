# Worklog — Módulo de Maestro Mundilex

---
Task ID: 1-2
Agent: main (Arquitecto)
Task: Diseñar e implementar arquitectura del Módulo de Maestro (schema Prisma + backend NestJS)

Work Log:
- Lei convenciones del proyecto: AppContext (vista como string union), api.ts (wrapper http con XTransformPort=3001), types.ts, usuarios.service.ts, desafios.controller.ts, prisma.service.ts, app.module.ts, page.tsx
- Fase 1: Agregué 6 modelos nuevos al schema Prisma: Seccion, Inscripcion, Tarea, EntregaTarea, Calificacion, Asistencia. Agregué relaciones inversas en Usuario y Asignatura y Desafio. Ejecuté `prisma generate` + `prisma db push` — DB en sync.
- Fase 2: Creé módulo NestJS `maestros/` con:
  - `maestros.service.ts`: lógica completa de secciones (CRUD + inscripciones), tareas (CRUD + cerrar), calificaciones (registrar/obtener), asistencia (batch + por sección/estudiante), reportes (resumenSeccion, reporteEstudiante, alertasMaestro), y seedDemo (crea sección "3ro A" + 5 estudiantes)
  - `maestros.controller.ts`: 25+ endpoints bajo `/api/maestros/*`
  - `maestros.module.ts`
  - Registré MaestrosModule en app.module.ts
- Compilé con `nest build` — sin errores de tipos
- Reinicié backend en puerto 3001 — todos los endpoints mapeados
- Verifiqué con curl: seed creó sección "3ro A" con 5 estudiantes, alertas responden, resumen de sección funciona

Stage Summary:
- Schema Prisma tiene 6 modelos nuevos para el módulo maestro (Seccion, Inscripcion, Tarea, EntregaTarea, Calificacion, Asistencia)
- Backend expone endpoints completos bajo /api/maestros/* (secciones, tareas, calificaciones, asistencia, reportes, alertas, seed)
- Seed demo funciona: POST /api/maestros/seed/:maestroId crea sección + 5 estudiantes (Ana López, Carlos Pérez, Lucía Martínez, Sofía Ramírez, DemoKid)
- MaestroDemo ID: 54952cc3-8261-4d39-8e12-267c80dcd374
- Sección demo ID: 0dbced8a-b53a-40c8-9990-3cd9d9497e2a
- Convenciones clave para frontend:
  - Wrapper api: `api.ts` usa `http<T>()` que añade `?XTransformPort=3001`
  - Vistas: `Vista` type en AppContext.tsx (string union), enrutadas en `page.tsx` switch
  - Estilos: clases `card-premium`, `btn-3d`, `animate-pop`, `animate-bounce-in`, gradientes fucsia/rose/naranja
  - Iconos: lucide-react
  - Componentes UI: shadcn/ui en src/components/ui/
  - Toast: `mostrarToast(mensaje, tipo)` del AppContext
- PRÓXIMO PASO: Fase 3 (frontend) — agregar tipos, métodos api, vistas, componentes UI

---
Task ID: 4b-C
Agent: full-stack-developer
Task: Crear 3 componentes React del Módulo de Maestro — TeacherAsistencia, TeacherReportes, TeacherReporteEstudiante

Work Log:
- Leí worklog previo (Task 1-2 del Arquitecto) + api.ts, types.ts, AppContext.tsx, TeacherDashboard.tsx para alinear convenciones de estilo (card-premium, btn-3d, animate-pop, gradientes fucsia/rose/emerald/teal/amber/violet, badges, header con icono en cuadrado degradado, botón "Volver").
- Verifiqué componentes UI disponibles: Progress, Tabs, Accordion, Table — todos presentes en src/components/ui/.
- Componente 1 — `src/components/TeacherAsistencia.tsx`:
  - Selector de sección (cards animadas) si no hay `seccionSeleccionadaId`; al tap → `setSeccionSeleccionadaId`.
  - Vista de toma: header con nombre de sección + fecha (input type="date", default hoy en ISO local, editable, max=hoy).
  - Lista de estudiantes (`api.obtenerEstudiantesSeccion`) con avatar inicial + nombre + 4 botones de estado (PRESENTE emerald, TARDANZA amber, AUSENTE rose, JUSTIFICADO violet). Botón activo se resalta con escala + ring + bg sólido; los demás opacidad/bg blanco.
  - Estado local `Map<estudianteId, EstadoAsistencia>` inicializado desde `api.obtenerAsistenciaSeccion(seccionId, fecha)`. Cambio de fecha recarga solo asistencia (no estudiantes) vía `recargarAsistencia` con useCallback.
  - Resumen rápido (4 cards): presentes, tardanzas, ausentes, justificados.
  - Botón "Guardar asistencia" sticky bottom → `api.registrarAsistencia(registros[])` → toast éxito.
  - Botón "Volver" → `setVista("maestro")`.
- Componente 2 — `src/components/TeacherReportes.tsx`:
  - Selector de sección si no hay `seccionSeleccionadaId`.
  - Header con nombre de sección + 4 cards de métricas (grid 2x2 en mobile, 4 cols en desktop): Promedio Progreso (fuchsia/rose), Promedio Notas (amber/orange), % Asistencia (emerald/teal), Total Estudiantes (violet/fuchsia). Cada una con icono en cuadrado degradado + número grande + label.
  - Sección "Estudiantes" con shadcn Table (nombre + avatar, nivel badge, puntos badge, botón "Ver") con scroll-area `max-h-96 overflow-y-auto`.
  - 3 cards extra: Tareas totales/activas, Asistencia grupal con barra, Promedio notas con interpretación.
  - Botón "Ver reporte" → `setEstudianteSeleccionadoId(id)` + `setVista("maestro-reporte-estudiante")`.
  - Usa `api.obtenerResumenSeccion(seccionId)`.
- Componente 3 — `src/components/TeacherReporteEstudiante.tsx`:
  - Lee `estudianteSeleccionadoId`. Si no hay: mensaje + botón volver.
  - Header con avatar inicial + nombre + nivel + puntos + badge de estado (AL_DIA=emerald, EN_PROGRESO=amber, REZAGADO=rose).
  - Resumen global (antes de tabs): barra grande con gradiente según estado + "X/Y desafíos completados" + % grande.
  - Tabs (shadcn) con 4 pestañas:
    - **Progreso**: Accordion por asignatura — trigger con icono + nombre + "X/Y (Z%)", contenido con Progress shadcn (h-3, gradiente fuchsia/rose vía `[&>[data-slot=progress-indicator]]`) + lista de módulos con Progress (h-2, gradiente emerald/teal).
    - **Calificaciones**: promedio arriba + lista scrollable con badge de nota (>=70 emerald, >=50 amber, <50 rose), tarea, sección, comentario, fecha.
    - **Asistencia**: 4 stat cards (presentes/tardanzas/ausentes/justificados) + % asistencia con barra grande + lista de últimos 10 registros con icono y color según estado.
    - **Medallas**: grid 2-3 cols con icono (MedallaIcono helper: usa img si URL http/, emoji si ≤4 chars, fallback Award lucide) + título + descripción + fecha.
  - Usa `api.obtenerReporteEstudiante(estudianteId)`.
  - Botón "Volver" → `setVista("maestro-reportes")`.
- Verificación:
  - `bun run lint` — mis 3 archivos sin errores ni warnings (otros errores del proyecto son pre-existentes en AlimentaMonstruo.tsx, scripts/generate-doc.js, layout.tsx).
  - `npx tsc --noEmit` — sin errores de tipos en mis 3 archivos.
  - Dev server compila correctamente los 3 archivos (verificado en dev.log: "✓ Compiled").
- Helper `formatearFechaCorta` usa `toLocaleDateString("es-NI", {day, month: short, year})`. Helper `hoyISO` genera fecha local sin desfase de zona horaria.
- Responsive mobile-first en los 3 componentes (grid cols adaptativas, tablas con overflow-x-auto, botones de estado grid-cols-2 en mobile / flex en desktop).

Stage Summary:
- 3 componentes creados en `src/components/`: TeacherAsistencia.tsx, TeacherReportes.tsx, TeacherReporteEstudiante.tsx
- Todos `"use client"`, usan `useApp()` y `api` del proyecto, respetan convenciones de estilo premium (card-premium, btn-3d, animate-pop con animationDelay escalonado, gradientes no-indigo/no-blue).
- Tipos TypeScript verificados contra `@/lib/types` (EstadoAsistencia, RegistroAsistencia, ResumenSeccion, ReporteEstudiante, Seccion).
- Integración con page.tsx: las 3 rutas (`maestro-asistencia`, `maestro-reportes`, `maestro-reporte-estudiante`) ya estaban cableadas en el switch — solo faltaban los archivos, ahora creados.
- NOTA: El dev server aún reporta `Module not found` para TeacherSecciones, TeacherEstudiantes, TeacherCrearTarea, TeacherTareas, TeacherTareaDetalle — esos corresponden a tasks 4b-A y 4b-B (otros agentes). Mis 3 archivos están completos y compilan sin errores.

---
Task ID: 4b-A
Agent: full-stack-developer
Task: Crear 2 componentes React para el Módulo de Maestro — TeacherSecciones y TeacherEstudiantes

Work Log:
- Leí worklog.md y archivos clave: AppContext.tsx (Vista union, useApp), api.ts (métodos maestro), types.ts (Seccion, EstudianteSeccion, ResumenSeccion, Asignatura), TeacherDashboard.tsx (convenciones de estilo), page.tsx (router switch), ui/dialog.tsx + ui/select.tsx + ui/input.tsx + ui/label.tsx (API de componentes).
- Verifiqué dev.log: el servidor estaba roto por imports de 6 componentes Teacher faltantes en page.tsx (mi task cubre 2; los otros 4 los hacen agentes paralelos).
- Creé `src/components/TeacherSecciones.tsx`:
  - Vista lista de secciones del maestro con `api.obtenerSeccionesMaestro(usuario.id)` + `api.obtenerAsignaturasMaestro(usuario.id)`.
  - Header con icono GraduationCap en cuadrado degradado fuchsia→rose + botón "Crear sección" (desktop inline, mobile full-width).
  - Grid `sm:grid-cols-2` de tarjetas `card-premium animate-pop` (delay `i*50ms`): avatar inicial, nombre, grado + año, badge activa/inactiva, badge asignatura (si tiene), 2 mini-stats (# estudiantes con Users icon, # tareas con ClipboardList icon), botón "Gestionar" → `setSeccionSeleccionadaId(id)` + `setVista("maestro-estudiantes")`.
  - Estado vacío amigable con CTA.
  - Dialog crear sección: form con Input nombre, Input number grado (default 3), Select asignatura (opcional, con opción "Sin asignatura" + lista de asignaturas del maestro; sentinel `NONE` mapeado a `undefined` en la llamada API). Validación de nombre no vacío, loading state en botón, toasts de éxito/error.
  - Loader con `Loader2` spin naranja.
- Creé `src/components/TeacherEstudiantes.tsx`:
  - Vista lista de estudiantes de `seccionSeleccionadaId`. Carga paralela (`Promise.all`) de `api.obtenerSeccion`, `api.obtenerEstudiantesSeccion`, `api.obtenerResumenSeccion`.
  - Si no hay `seccionSeleccionadaId`: mensaje + botón "Ir a secciones" → `setVista("maestro-seccion")`.
  - Header con nombre de sección + metadata (grado, asignatura, # estudiantes).
  - Resumen rápido en grid `sm:grid-cols-3`: promedio progreso (TrendingUp, emerald), nota media (Award, amber, "—" si 0), % asistencia (CalendarCheck, fuchsia).
  - Lista de estudiantes: avatar inicial cuadrado degradado fuchsia→rose, nombre, nivel (de `e.nivel` o calculado de experiencia), puntos, badge de estado (AL_DIA ≥70% / EN_PROGRESO ≥40% / REZAGADO <40% basado en `porcentajeGlobal`), botón "Ver perfil" → `setEstudianteSeleccionadoId(id)` + `setVista("maestro-reporte-estudiante")`.
  - Estado vacío si la sección no tiene estudiantes.
  - Loader con `Loader2` spin naranja.
- Verificaciones:
  - `bun run lint` filtrado a mis archivos: 0 errores (los errores restantes son en `Proyecto-De-Modalidad/backend/dist/*.js` preexistentes y otros archivos Teacher de agentes paralelos).
  - `npx tsc --noEmit` filtrado a mis 2 archivos: 0 errores de tipos.
- Convenciones respetadas: clases `card-premium`, `btn-3d`, `animate-pop`, `animate-bounce-in`, gradientes fuchsia/rose/orange/emerald/amber, NO indigo/blue, botones con `ChevronRight`, "Volver" con `ArrowLeft` estilo `bg-white/70`, contenedor `mx-auto max-w-5xl px-4 py-6 sm:py-8`, responsive mobile-first, toasts vía `mostrarToast`, sin emojis nuevos (reusé 🧑 y 📚 ya existentes).

Stage Summary:
- `src/components/TeacherSecciones.tsx` y `src/components/TeacherEstudiantes.tsx` completos y sin errores de tipos/lint.
- Flujo: TeacherDashboard → (futuro botón) → TeacherSecciones → "Gestionar" → TeacherEstudiantes → "Ver perfil" → TeacherReporteEstudiante.
- Ambos componentes están listos para integrarse en cuanto los agentes paralelos completen TeacherCrearTarea, TeacherTareas y TeacherTareaDetalle (los 3 imports faltantes en page.tsx que aún rompen el dev server).
- Dependencias de API ya disponibles en `api.ts`: obtenerSeccionesMaestro, obtenerSeccion, crearSeccion, obtenerAsignaturasMaestro, obtenerEstudiantesSeccion, obtenerResumenSeccion — todas con tipos correctos en types.ts.

---
Task ID: 4b-B
Agent: full-stack-developer
Task: Crear 3 componentes React del Módulo de Maestro — TeacherTareas, TeacherCrearTarea, TeacherTareaDetalle

Work Log:
- Leí worklog.md previo (Task 1-2 del Arquitecto + Task 4b-A y 4b-C de agentes paralelos) para alinear convenciones de estilo y entender el flujo del módulo maestro.
- Leí archivos clave: AppContext.tsx (Vista union, useApp, seccionSeleccionadaId, mostrarToast), api.ts (métodos maestro: tareas CRUD, calificaciones, secciones, asignaturas, módulos, desafíos, estudiantes), types.ts (Tarea, EntregaTarea, Calificacion, Seccion, Desafio, Asignatura, Modulo), TeacherDashboard.tsx (convenciones card-premium + btn-3d + animate-pop + gradientes), BancoDesafiosViewer.tsx (uso de challenge-board), ContentManager.tsx (formularios con inputs white/stone-800 + selects), ui/alert-dialog.tsx (Radix AlertDialog primitives), ui/tabs.tsx (shadcn Tabs), ui/select.tsx (SelectTrigger/Content/Item), globals.css (card-premium dark glass, btn-3d marker sin CSS propio, animate-pop/bounce-in keyframes).
- Verifiqué backend: `obtenerTarea(id)` retorna tarea con `desafio: { include: opciones }` (no solo `{ id, pregunta, puntos }`), `seccion`, `entregas` con estudiante, `calificaciones` con estudiante. `registrarCalificacion` es upsert (crea o actualiza por `tareaId_estudianteId`).
- Verifiqué dev.log: el servidor estaba roto por imports de TeacherTareas, TeacherCrearTarea, TeacherTareaDetalle faltantes en page.tsx (mi task cubre esos 3).
- Componente 1 — `src/components/TeacherTareas.tsx`:
  - Lista tareas: si hay `seccionSeleccionadaId` → `api.obtenerTareasSeccion(id)` + `api.obtenerSeccion(id)` para mostrar el nombre; si no, trae todas las secciones del maestro y concatena tareas (ordenadas por fechaAsignada desc).
  - Header con icono ClipboardList en cuadrado degradado orange→rose + botón "Crear tarea" → `setVista("maestro-crear-tarea")`.
  - Cada tarea como tarjeta `card-premium animate-pop` (delay `i*50ms`): título + badge estado (ACTIVA=emerald, CERRADA=stone), descripción truncada, desafío (pregunta truncada) en bg-white/50, badges inferiores con fecha límite (Calendar), # entregas (ListChecks), # calificaciones (CheckCircle2), sección (teal).
  - Acciones por tarea: "Ver detalle" (emerald→teal, → guarda id en localStorage `mundilex_tarea_sel` + `setVista("maestro-tarea-detalle")`); "Cerrar tarea" (AlertDialog confirmar amber → `api.cerrarTarea(id)`); "Eliminar" (AlertDialog confirmar rose → `api.eliminarTarea(id)` con loader en botón mientras opera).
  - Estado `operandoId` para mostrar spinner en el botón de la tarea en curso. `cargando` general con Loader2.
  - Estado vacío con CTA secundario.
- Componente 2 — `src/components/TeacherCrearTarea.tsx`:
  - Formulario en cascada: Sección → Asignatura → Módulo → Desafío. Cada Select dispara useEffect que carga el siguiente nivel (con loaders Loader2 por nivel). Sección preseleccionada si `seccionSeleccionadaId`; si no, autoselecciona la primera.
  - Selects usan shadcn (SelectTrigger h-auto + border-2 orange-200 + bg-white + text-stone-800) para verse premium con los gradientes del proyecto.
  - Cada label tiene icono pequeño inline (Users, BookOpen, Layers, ListChecks, SquarePen).
  - Título (Input): maxLength 120, sugerido automáticamente = `desafio.pregunta.slice(0,90)` si el usuario aún no escribió nada (vía useEffect que respeta `titulo.trim() === ""`).
  - Descripción opcional (Textarea, maxLength 400, resize-none).
  - Fecha límite (Input datetime-local): default = mañana misma hora (helper `mananaMismaHora()` que formatea `YYYY-MM-DDTHH:MM` en local).
  - Vista previa del desafío seleccionado (pregunta completa + puntos).
  - Validación: `puedeEnviar` requiere seccionId, asignaturaId, moduloId, desafioId, título no vacío, fechaLimite y no guardando. Botón "Crear tarea" con Loader2 durante envío → `api.crearTarea({...})` → toast éxito → `setVista("maestro-tareas")`.
  - Manejo de estados vacíos (sin secciones/asignaturas/módulos/desafíos) con mensajes amber explicativos.
- Componente 3 — `src/components/TeacherTareaDetalle.tsx`:
  - Lee `tareaId` de `localStorage.getItem("mundilex_tarea_sel")`. Si no existe → toast error + volver a `maestro-tareas`.
  - `cargar()` hace `api.obtenerTarea(id)` (cast a `TareaDetalle` que extiende Tarea + entregas + calificaciones) y `api.obtenerEstudiantesSeccion(t.seccionId)`. Inicializa formulario de notas con valores existentes.
  - Header con icono ClipboardList orange→rose + título + sección + descripción + 4 badges (fecha límite, entregas, calificaciones, estudiantes).
  - Card "Desafío asociado" con pregunta + grid 2 cols de opciones etiquetadas A/B/C/D en circ violeta.
  - Tabs (shadcn) con 2 pestañas estilizadas con gradientes en active state (Entregas=fuchsia→rose, Calificar=emerald→teal):
    - **Entregas**: lista scrollable (`max-h-96 overflow-y-auto`) con avatar inicial + nombre + fecha/hora + badge "Tardía" (rose) si `tarde` + check/x (emerald/rose) si `correcta` no es null + puntos (amber Star). Cada item con `animate-pop` delay `i*40ms`.
    - **Calificar**: lista scrollable (`max-h-[28rem]`) con un formulario por estudiante. Avatar emerald→teal + nombre + badge entrega (Entregó ✓/✗) + badge nota existente (si ya calificado). Inputs: nota (number 0-100 con sufijo "/100") + comentario (text con icono MessageSquare). Botón "Guardar"/"Actualizar" nota según exista calificación → `api.registrarCalificacion({tareaId, estudianteId, nota, comentario, maestroId: usuario.id})` → toast éxito → `cargar()` para refrescar.
  - Loader con `guardandoId` por estudiante.
- Verificaciones:
  - `bun run lint` filtrado a mis archivos: 0 errores ni warnings (otros errores son pre-existentes en AlimentaMonstruo.tsx, scripts/generate-doc.js, layout.tsx, ContentManager.tsx, ParentDashboard.tsx, AvatarCustomizer.tsx).
  - `npx tsc --noEmit --skipLibCheck` filtrado a mis 3 archivos: 0 errores de tipos. Tuve un error inicial TS2430 ("Interface TareaDetalle incorrectly extends interface Tarea" porque `desafio?: DesafioConOpciones | null` no es asignable a `desafio?: { id; pregunta; puntos } | undefined` debido al `null`) — lo resolví eliminando la redefinición de `desafio` del interface y haciendo cast en el acceso: `const desafio = (tarea.desafio ?? null) as DesafioConOpciones | null;`.
  - Dev server compila correctamente los 3 archivos (verificado en dev.log: "✓ Compiled in 201ms" sin errores).
- Convenciones respetadas: clases `card-premium rounded-3xl p-6`, `btn-3d` con gradientes fuchsia/rose, emerald/teal, orange/rose, violet/fuchsia; `animate-pop` con `animationDelay: \`${i * 50}ms\``; headers con icono en `h-12 w-12 rounded-2xl bg-gradient-to-br shadow-md`; badges `rounded-full bg-{color}-100 px-1.5 py-0.5 text-xs font-bold text-{color}-700`; botón "Volver" con `ArrowLeft` y `bg-white/70 text-stone-700 hover:bg-white`; contenedor `mx-auto max-w-5xl px-4 py-6 sm:py-8`; Loader2 spin naranja; responsive mobile-first (grid sm:grid-cols-2, flex-wrap, max-h-96 overflow-y-auto); NO indigo/blue.
- Helper `formatDate` y `formatDateTime` usan `toLocaleDateString("es-NI", {day, month: short, year})` y `toLocaleString("es-NI", {...})`.

Stage Summary:
- 3 componentes creados en `src/components/`: TeacherTareas.tsx, TeacherCrearTarea.tsx, TeacherTareaDetalle.tsx (~290+330+390 líneas respectivamente).
- Todos `"use client"`, usan `useApp()` y `api` del proyecto, respetan convenciones premium.
- Tipos TypeScript verificados contra `@/lib/types` (Tarea, EntregaTarea, Calificacion, Seccion, Desafio, Asignatura, Modulo).
- Integración con page.tsx: las 3 rutas (`maestro-tareas`, `maestro-crear-tarea`, `maestro-tarea-detalle`) ya estaban cableadas en el switch — solo faltaban los archivos, ahora creados.
- Persistencia de tarea seleccionada: clave `mundilex_tarea_sel` en localStorage (se setea en TeacherTareas al hacer "Ver detalle", se lee en TeacherTareaDetalle).
- Flujo completo: TeacherDashboard → TeacherSecciones → TeacherEstudiantes → (botón Tareas) → TeacherTareas → "Crear tarea" → TeacherCrearTarea → submit → TeacherTareas → "Ver detalle" → TeacherTareaDetalle → calificar/ver entregas → "Volver" → TeacherTareas.
- Con los 3 archivos creados, el dev server ya no reporta `Module not found` para los componentes Teacher — todos los 9 Teacher*.tsx existen y compilan correctamente.

---
Task ID: 3-6 (final)
Agent: main (Arquitecto)
Task: Fase 3 (frontend wiring + componentes) + Fase 4 (seed automático) + verificación con Agent Browser

Work Log:
- Fase 3a (wiring): Agregué tipos Seccion/Tarea/EntregaTarea/Calificacion/RegistroAsistencia/AlertasMaestro/ResumenSeccion/ReporteEstudiante a types.ts. Agregué ~30 métodos API a api.ts (secciones, tareas, calificaciones, asistencia, reportes, alertas, seed). Agregué 8 vistas nuevas al tipo Vista en AppContext + state seccionSeleccionadaId. Actualicé page.tsx con routing de las 8 vistas nuevas.
- Fase 3b (componentes): Lancé 3 subagents en paralelo (4b-A, 4b-B, 4b-C) que crearon 8 componentes:
  - TeacherSecciones, TeacherEstudiantes (4b-A)
  - TeacherTareas, TeacherCrearTarea, TeacherTareaDetalle (4b-B)
  - TeacherAsistencia, TeacherReportes, TeacherReporteEstudiante (4b-C)
  Todos con 0 errores de lint y tipos, respetando convenciones (card-premium, btn-3d, animate-pop, gradientes sin indigo/blue).
- Fase 3c (dashboard): Amplié TeacherDashboard con: sección de Alertas pendientes (tareas por calificar, asistencias hoy, entregas tardías), grid de Herramientas de gestión (Mis Secciones, Tareas, Asistencia, Reportes), listas con scroll (max-h-96 overflow-y-auto).
- Fase 4 (seed): Modifiqué LoginScreen.entrarDemo para que tras login MaestroDemo llame api.seedMaestroDemo(usuario.id) (idempotente) — crea sección "3ro A" + 5 estudiantes demo.
- Verificación con Agent Browser:
  - Login MaestroDemo → dashboard carga con alertas (1 asistencia pendiente hoy), herramientas, recursos
  - Mis Secciones → muestra sección "3ro A" con botón Gestionar
  - Gestionar → lista 5 estudiantes (Ana López, Carlos Pérez, Lucía Martínez, Sofía Ramírez, DemoKid)
  - Asistencia → selecciona sección → formulario con 5 estudiantes × 4 botones (Presente/Tardanza/Ausente/Justificado) + fecha + Guardar
  - Marcó Ana López como PRESENTE → guardó → verificado en DB via API (registro con estado PRESENTE, fecha 2026-08-13)
  - Reportes → muestra sección con tabla de estudiantes
  - 0 errores de consola, 0 errores de página, screenshots guardados

Stage Summary:
- Módulo de Maestro COMPLETO y verificado end-to-end:
  - 6 modelos Prisma nuevos (Seccion, Inscripcion, Tarea, EntregaTarea, Calificacion, Asistencia)
  - 25+ endpoints NestJS bajo /api/maestros/*
  - 9 componentes React (TeacherDashboard ampliado + 8 nuevos)
  - Seed automático al login MaestroDemo
  - Flujo verificado: dashboard → secciones → estudiantes → asistencia (guardado en DB confirmado) → reportes
- Servicios: FE 3000 (200), BE 3001 (200), Gateway 81 (200), Watchdog activo
- Screenshots: maestro-dashboard.png, maestro-asistencia.png, maestro-reportes.png, maestro-dashboard-final.png

---
Task ID: PWA-1
Agent: main (Arquitecto)
Task: Convertir Mundilex en PWA (Progressive Web App) instalable con soporte offline — arquitectura PWA completa

Work Log:
- Leí worklog.md previo (Módulo de Maestro completado en sesiones anteriores) para entender contexto: app Next.js 16 con tema "espacio profundo" (fondo violeta/índigo #07061f, búho naranja, estrellas doradas), stack FE 3000 + BE NestJS 3001 + gateway Caddy 81.
- Inspeccioné layout.tsx existente (fondo espacial con runas/estrellas, footer sticky), package.json (sharp disponible), public/ (logo.svg búho 100x100), next.config.ts (standalone, sin headers).
- Fase 1 — Iconos PWA: Creé `scripts/gen-pwa-icons.mjs` que usa sharp para componer el búho SVG sobre un fondo degradado espacial (radial violeta→índigo→negro + brillo violeta + 26 estrellas doradas aleatorias). Generé: `public/pwa/icon-192.png`, `icon-512.png`, `icon-512-maskable.png` (con padding 24% + anillo amber sutil para safe-zone maskable), `apple-touch-icon.png` (180x180 fondo sólido), `public/favicon-32.png`.
- Fase 2 — Manifest: Creé `public/manifest.webmanifest` con name/short_name/description, start_url `/?source=pwa`, scope `/`, display standalone (+ display_override), background_color y theme_color `#07061f`, lang `es-NI`, categories education/kids/games, 4 iconos (any+maskable en 192 y 512), 3 shortcuts (Matemáticas, Lenguaje, Medallas), edge_side_panel.
- Fase 3 — Service Worker: Creé `public/sw.js` (~180 líneas) con estrategias diferenciadas:
  - Install: precachea app shell (/, manifest, iconos, logo) con skipWaiting.
  - Activate: limpia caches viejos (versión `mundilex-sw-v1`), clients.claim.
  - Fetch router: HTML navegación → network-first con fallback a cached "/" + página offline mínima (HTML inline con tema espacial, botón reintentar); API `/api/*` → network-first con cache corto 30s (expira); Next.js chunks `/_next/static/*` → stale-while-revalidate; otros estáticos (img/font/svg) → cache-first con placeholder SVG si offline.
  - Página offline inline con CSS embebido (luna 🌙, mensaje "El Cristal del Saber descansó", botón reintentar).
- Fase 4 — Componentes React:
  - `src/components/PWARegister.tsx`: registra `/sw.js` tras `load`, escucha `updatefound`/`statechange` para detectar SW nuevo, postMessage SKIP_WAITING, recarga en `controllerchange`.
  - Delegué a frontend-styling-expert (Task 7-PWA-UI): `OfflineIndicator.tsx` (useSyncExternalStore sobre eventos online/offline, banner glassmorphism violeta con borde amber, icono WifiOff, `fixed bottom-4`, descartable) y `InstallPrompt.tsx` (escucha beforeinstallprompt con interfaz local tipada, guarda evento en ref, timeout 3s si no dispara, detecta PWA ya instalada via matchMedia standalone, respeta dismiss 7 días en localStorage, tarjeta `fixed bottom-4 right-4` con gradiente amber→orange→rose, botones Instalar/Ahora no, emite CustomEvent mundilex:installed).
- Fase 5 — Layout: Edité `src/app/layout.tsx`: importé los 3 componentes, agregué `manifest`, `appleWebApp` (capable, statusBarStyle black-translucent, title), `formatDetection`, `icons` (32/192/512 + apple 180) al Metadata; viewport con `maximumScale: 5` + `viewportFit: cover`; en `<head>` agregué meta tags iOS/MS (mobile-web-app-capable, apple-mobile-web-app-*, msapplication-TileColor, msapplication-tap-highlight), apple-touch-icon, mask-icon, favicon links, manifest link; inserté `<PWARegister/>`, `<OfflineIndicator/>`, `<InstallPrompt/>` entre main y footer.
- Fase 6 — Headers: Reescribí `next.config.ts` agregando `async headers()` con 3 reglas: `/sw.js` → Cache-Control no-cache + Service-Worker-Allowed `/`; `/manifest.webmanifest` → Content-Type `application/manifest+json` + no-cache; `/pwa/*` → Cache-Control immutable 1 año.
- Verificación con Agent Browser (vía gateway :81):
  - `open http://localhost:81/` → title "Mundilex — Aprende jugando", sin errores de consola.
  - Manifest linkeado: `http://localhost:81/manifest.webmanifest` ✓
  - Apple meta: `apple-mobile-web-app-capable=yes`, `theme-color=#07061f`, apple-touch-icon → `/pwa/apple-touch-icon.png` ✓
  - Service Worker registrado y **activo**: scope `http://localhost:81/`, `active=true` ✓
  - curl headers: sw.js → `Cache-Control: no-cache` + `Service-Worker-Allowed: /` + `application/javascript`; manifest → `application/manifest+json`; iconos → `max-age=31536000 immutable` ✓
  - Login MaestroDemo vía gateway → dashboard carga con "Panel del maestro/a", Herramientas de gestión (Mis Secciones, Tareas, Asistencia, Reportes, Banco de Desafíos, Contenido MINED), Estudiantes activos, Mis asignaturas ✓
  - InstallPrompt visible (botones "Instalar" + "Ahora no") en esquina inferior derecha ✓
  - Click "Ahora no" → prompt oculto + `mundilex_install_dismissed` guardado en localStorage con timestamp ✓
  - **Prueba offline**: `set offline on` + `reload` → title sigue "Mundilex", URL sigue `:81/`, VLM confirma screenshot muestra el **dashboard autenticado completo** (no login, no error) → el SW sirvió el shell cacheado y la sesión persistió offline ✓
  - 0 errores de consola, 0 errores de página en todo el flujo.
- Lint: solo warning pre-existente `no-page-custom-font` en layout.tsx (Google Fonts link, ya estaba antes de mis cambios). Typecheck: 0 errores en archivos PWA.

Stage Summary:
- Mundilex es ahora una **PWA instalable** completa:
  - 5 iconos generados (192, 512, 512-maskable, 180 apple-touch, 32 favicon) con fondo espacial + búho.
  - `manifest.webmanifest` con shortcuts, display standalone, theme color.
  - `sw.js` con 4 estrategias de cache (network-first HTML/API, SWR chunks, cache-first assets) + página offline inline.
  - 3 componentes React: PWARegister (registro + auto-update), OfflineIndicator (banner), InstallPrompt (prompt nativo con dismiss 7 días).
  - Layout con manifest + 10 meta tags iOS/MS + componentes insertados.
  - next.config.ts con headers Cache-Control/Content-Type/Service-Worker-Allowed.
- Verificado end-to-end vía gateway: SW activo, login funcional, dashboard carga, offline sirve shell cacheado, install prompt funciona.
- Servicios: FE 3000 (200), BE 3001 (corriendo, /api/usuarios/demo devuelve 500 pre-existente pero frontend tiene fallback), Gateway 81 (200).
- Screenshots: pwa-install-prompt.png, pwa-dashboard-gateway.png, pwa-offline-gateway.png (dashboard servido offline).

---
Task ID: F3-A
Agent: full-stack-developer
Task: Rediseñar ParentDashboard (home) + crear ParentNotificaciones

Work Log:
- Leí worklog previo (entradas del Módulo de Maestro y PWA) para entender convenciones: tema "espacio profundo" (fondo violeta oscuro #07061f, búho naranja, estrellas doradas), clases premium `card-premium` / `btn-3d` / `animate-pop` / `animate-bounce-in`, gradientes permitidos amber→orange, rose→fuchsia, emerald→teal, orange→rose (sin indigo/blue), patrón de listas scrollables `max-h-96 overflow-y-auto` con `animationDelay: ${i*50}ms`, avatar inicial cuadrada con gradiente rose→fuchsia.
- Revisé archivos de referencia: `types.ts` (interfaces `ResumenPadre`, `Notificacion`, `HijoVinculado`, `Aviso`), `api.ts` (firmas exactas: `seedPadreDemo`, `obtenerHijosPadre`, `obtenerResumenPadre`, `obtenerNotificaciones`, `marcarNotificacionLeida`, `marcarTodasNotificacionesLeidas`), `AppContext.tsx` (hook `useApp` con `hijoSeleccionadoId`, `setHijoSeleccionadoId`, `mostrarToast`, union `Vista` que ya incluye `padre`, `padre-calificaciones`, `padre-asistencia`, `padre-avisos`, `padre-mensajes`, `padre-mensaje-thread`, `padre-notificaciones`, `padre-vincular`), `TeacherDashboard.tsx` y `TeacherEstudiantes.tsx` (convenciones de tarjetas/alertas/KPIs), `globals.css` (clases `card-premium` glassmorphism con borde cyan, `animate-pop`/`animate-bounce-in` keyframes).
- Verifiqué que `page.tsx` ya importa `ParentDashboard` (caso `"padre"`) y `ParentNotificaciones` (caso `"padre-notificaciones"`) — este último aún no existía.
- Componente 1 — `ParentDashboard.tsx` (reescribí completo, ~706 líneas):
  - Al montar: llama `api.seedPadreDemo(usuario.id)` en background (catch silencioso, idempotente) + `api.obtenerHijosPadre(usuario.id)` + `api.obtenerNotificaciones(usuario.id, true)` para badge de campana.
  - Estado cargando: spinner `Loader2` naranja + mensaje "Cargando panel de padre…".
  - Estado error: card con `AlertTriangle` rose + botón Reintentar.
  - Estado vacío (sin hijos): ilustración búho 🦉 grande + mensaje "Aún no tienes hijos vinculados" + botón "Vincular por PIN" → `setVista("padre-vincular")`.
  - Estado con hijos: cabecera con avatar inicial (gradiente rose→fuchsia), nombre, badge de parentesco, nivel (de `resumen.nivel`), puntos, sección count; selector desplegable "Cambiar hijo" si hay >1 (con dropdown `absolute z-20` + overlay `fixed inset-0 z-10`); botón "Vincular otro" si solo 1.
  - Autoselección de primer hijo vía useEffect si `hijoSeleccionadoId` es null o apunta a hijo inexistente.
  - KPIs en `grid sm:grid-cols-3`: (a) Promedio notas (`Award` amber, `/100`), (b) % Progreso (`TrendingUp` emerald), (c) % Asistencia (`CalendarCheck` fuchsia). Cada `card-premium animate-pop` con delay escalonado 0/50/100ms.
  - Avisos urgentes (solo si `avisosNoLeidos.length > 0`): header con `AlertTriangle` rose + badge count + "Ver todos" → `padre-avisos`. Lista top 3 con fecha formateada `es-NI`.
  - Actividades del día: lista scrollable `max-h-96 overflow-y-auto` de `tareasActivas`. Cada tarea con icono de urgencia (Flame rose si vence hoy/ayer, Clock amber si ≤3 días, Clock gris si más), título, asignatura, fecha límite (`es-NI`), badge estado (Pendiente amber / Entregada emerald / Tardía rose). Botón "Ver" → toast "Detalle de tarea próximamente".
  - Notas recientes: lista de `calificacionesRecientes` (max 5). Cada una con nota grande coloreada (emerald ≥80, amber 60-79, rose <60), título tarea, asignatura, comentario italic, fecha.
  - Top bar: botón "Volver" (ArrowLeft) → `perfil` + botón campana (Bell) con badge de no leídas → `padre-notificaciones`.
  - Bottom nav fija (`fixed inset-x-0 bottom-0 max-w-4xl`): 5 botones (Inicio/Notas/Avisos/Mensajes/Perfil) con iconos `Home`/`BarChart3`/`AlertTriangle`/`MessageCircle`/`User`. El activo se resalta con gradiente amber→orange. Contenedor principal con `pb-24` para que el nav no tape contenido.
- Componente 2 — `ParentNotificaciones.tsx` (creé nuevo, ~270 líneas):
  - Al montar: `api.obtenerNotificaciones(usuario.id)` (todas). Ordena: no leídas primero, luego por fecha desc.
  - Cabecera: botón "Volver" (ArrowLeft) → `padre` + título "Notificaciones" con badge de no leídas + botón "Marcar todas" (CheckCheck, gradiente emerald→teal) → `api.marcarTodasNotificacionesLeidas` → toast `${actualizadas} marcadas` → recarga.
  - Lista scrollable `max-h-[70vh] overflow-y-auto`. Cada notif: icono según `tipo` (mapa completo `ICONOS_TIPO`): NUEVA_TAREA 📋 amber, TAREA_CALIFICADA ✅ emerald, INASISTENCIA ⚠️ rose, NUEVO_AVISO 📢 orange, MENSAJE_DOCENTE 💬 cyan, LOGRO 🏆 amber, ENTREGA_TARDIA ⏰ rose, TAREA_POR_VENCER ⏳ amber. Fallback a `Bell` stone si tipo desconocido.
  - Badge "Nueva" rose con `animate-pulse` si `!leida`. Ring rose-200 alrededor de cards no leídas.
  - Fecha relativa vía helper `fechaRelativa()`: "ahora" (<1 min), "hace X min" (<60), "hace X h" (<24), "ayer" (1 día), "hace X días" (<7), "hace X sem" (<5 semanas), si no `es-NI` date.
  - Click: marca como leída con `api.marcarNotificacionLeida` (loader en el icono) + navega: NUEVO_AVISO → `padre-avisos`, MENSAJE_DOCENTE → `padre-mensajes`, otros → toast "Abriendo detalle…".
  - Estado vacío: ilustración `BellOff` emerald + "No tienes notificaciones. Todo al día ✨".
  - Loader centrado con `Loader2` naranja.
  - Contenedor `mx-auto max-w-3xl px-4 py-6 sm:py-8`.
- Helpers compartidos: `fmtFecha` (toLocaleDateString es-NI), `fechaRelativa`, `urgenciaTarea`, `estadoTarea`, `colorNota`, `iconoParaTipo`.
- Restricciones cumplidas: solo gradientes amber→orange / rose→fuchsia / emerald→teal / orange→rose / amber→fuchsia (sin indigo ni blue); clases premium `card-premium`, `btn-3d`, `animate-pop`/`animate-bounce-in` con delays escalonados; mobile-first con `sm:` breakpoints; touch targets ≥40px; iconos lucide-react; `"use client"` al inicio; feedback vía `mostrarToast`.

Stage Summary:
- Archivos: `src/components/ParentDashboard.tsx` (reescribí, ~706 líneas), `src/components/ParentNotificaciones.tsx` (creé, ~270 líneas).
- Verificación typecheck: `npx tsc --noEmit --skipLibCheck 2>&1 | grep -E "(ParentDashboard|ParentNotificaciones)"` → **vacío, 0 errores**. (Tuve 1 error inicial de tipado en `BottomNavProps` porque `vista: string` hacía que `it.id` se infiriera como `string` en lugar de la unión literal; lo corregí extrayendo un tipo `VistaNav` y usándolo tanto en `setVista` como en el array `items[].id`.)
- Verificación lint: `bun run lint 2>&1 | grep ParentDashboard|ParentNotificaciones` → **vacío, 0 errores y 0 warnings** para nuestros archivos en `/src/components/`. (Un warning homónimo aparece solo en `Proyecto-De-Modalidad/frontend/src/components/ParentDashboard.tsx`, un duplicado legacy de otro subproyecto, no en mi archivo.)
- Dev server: Next.js 16.1.3 Turbopack en puerto 3000, "Ready in 7.8s", sirviendo 200 OK.
- Ambos componentes listos para integrarse al flujo padre (login PADRE → vista "padre" → campana "padre-notificaciones"). Faltan por construir otros agentes: ParentVincular, ParentCalificaciones, ParentAsistencia, ParentAvisos, ParentMensajes.

---
Task ID: F3-C
Agent: full-stack-developer
Task: Crear ParentMensajes + ParentMensajeThread + ParentVincularHijo

Work Log:
- Leí worklog.md previo (entradas del Módulo de Maestro: Task 1-2, 4b-A, 4b-B, 4b-C, 3-6 final, PWA-1) para alinear convenciones: card-premium dark glass, btn-3d, animate-pop con animationDelay escalonado, gradientes sin indigo/blue (amber→orange, rose→fuchsia, emerald→teal, violet→fuchsia, cyan para badges info), botón "Volver" con ArrowLeft estilo `bg-white/70 text-stone-700`, contenedor `mx-auto max-w-3xl px-4 py-6 sm:py-8`, scroll lists con `max-h-[75vh] overflow-y-auto`, Loader2 spin naranja, toasts vía `mostrarToast`.
- Leí archivos clave: ParentDashboard.tsx viejo (patrón PIN existente para reusar), AppContext.tsx (Vista union, useApp, conversacionSeleccionadaId, mostrarToast), api.ts (firmas de métodos padres), types.ts (Conversacion, ConversacionDetalle, Mensaje, HijoVinculado, SeccionHijo, ResumenPadre), TeacherDashboard.tsx (convenciones), TeacherSecciones.tsx (uso de Dialog de shadcn), TeacherTareaDetalle.tsx (patrón tabs + formularios), globals.css (card-premium dark glass cyan-tinted), layout.tsx (fondo cosmic deep-space).
- Verifiqué que las 3 vistas (`padre-mensajes`, `padre-mensaje-thread`, `padre-vincular`) ya estaban cableadas en page.tsx switch (líneas 81-92) pero faltaban los 3 archivos — dev server reportaba "Module not found" para ParentVincularHijo.
- Componente 1 — `src/components/ParentMensajes.tsx` (~410 líneas):
  - Carga `api.obtenerConversaciones(usuario.id)` al montar.
  - Cabecera con icono MessageSquare en cuadrado gradiente violet→fuchsia + título "Mensajes" + botón "Nueva conversación" (Plus icon, gradiente amber→orange, btn-3d, label responsive).
  - Lista de conversaciones scrollable (`max-h-[75vh] overflow-y-auto`). Cada item como botón card-premium animate-pop delay `i*50ms`: avatar inicial cuadrada gradiente violet→fuchsia (o UserCircle si no hay inicial), nombre del maestro, rol "Maestro/a de {asignatura.nombre}", asunto truncado, último mensaje truncado (italic si no es mío, prefix "Tú: " si es mío), tiempo relativo ("hace X h", "ayer"), badge no leídos (rose→fuchsia con número) si noLeidos>0, ChevronRight al final.
  - Click → `setConversacionSeleccionadaId(conv.id)` + `setVista("padre-mensaje-thread")`.
  - Modal "Nueva conversación" con Dialog de shadcn: Select hijo (cargado vía `api.obtenerHijosPadre`), input asunto (maxLength 100 con contador), textarea mensaje inicial (maxLength 500 con contador, opcional). Al submitir: obtiene resumen del hijo vía `api.obtenerResumenPadre` para encontrar la primera sección y su maestro, valida que el hijo tenga secciones (toast "Tu hijo no tiene maestro asignado" si no), llama `api.iniciarConversacion(usuario.id, {maestroId, hijoId, asunto, seccionId, mensajeInicial})` → toast éxito → cerrar modal → recargar lista → abrir thread. Loader en botón mientras opera.
  - Estado vacío y cargando con Loader2.
- Componente 2 — `src/components/ParentMensajeThread.tsx` (~260 líneas):
  - Si `conversacionSeleccionadaId` es null → toast "Selecciona una conversación primero" + `setVista("padre-mensajes")`.
  - Carga `api.obtenerConversacion(usuario.id, conversacionId)` → ConversacionDetalle.
  - Layout `mx-auto flex min-h-[80vh] max-w-3xl flex-col px-4 py-4 sm:py-6`:
    - Cabecera card-premium: avatar maestro + nombre + rol + asunto + badges contexto "Sobre: {hijo.nombre}" (cyan) y sección (violet).
    - Thread scrollable (`flex-1 overflow-y-auto`): cada mensaje en burbuja animate-pop delay `min(i,10)*30ms`. Padre (remitenteId === usuario.id): alineado derecha, gradiente amber→orange, texto violet-950, indicador ✓ (violet-900/60 si no leído) o ✓✓ cyan-600 si `leidoEn` no null. Maestro: alineado izquierda, `bg-white/10 border border-cyan-400/30 text-stone-100`. Hora legible ("14:32", "ayer 18:05", o "3 dic 14:32" si más antiguo).
    - Auto-scroll al final al cargar y tras enviar (useRef + scrollIntoView smooth).
    - Composer sticky bottom card-premium: textarea auto-resize (max-h-140px) + botón circular Send (gradiente amber→orange, btn-3d). Enter envía, Shift+Enter salto de línea. Disabled si cuerpo vacío o enviando.
  - Enviar mensaje: `api.enviarMensajePadre(usuario.id, conversacionId, texto)` → agregar mensaje a la lista local (sin recargar todo el thread) + limpiar input + scroll al final. Loader en botón mientras opera.
  - Estados: cargando (Loader2 centrado), error (card con botón "Volver a mensajes").
- Componente 3 — `src/components/ParentVincularHijo.tsx` (~360 líneas):
  - Cabecera con icono UserPlus en gradiente amber→orange + título "Vincular hijo/a".
  - Formulario principal card-premium: input nombre (maxLength 40), input PIN (password numeric maxLength 4 tracking-[0.4em]), Select parentesco (MADRE/PADRE/TUTOR_LEGAL/ABUELO/OTRO con labels legibles), botón "Vincular" (gradiente amber→orange, btn-3d, full-width en mobile auto en sm+). Hint "Escribe el nombre y PIN exactos que usa tu hijo/a en Mundilex." → `api.solicitarVinculoHijo(usuario.id, {nombre, pin, parentesco})` → toast éxito → limpiar form → `setVista("padre")`. Loader en botón.
  - Lista hijos vinculados (cargar con `api.obtenerHijosPadre`): avatar inicial cuadrada gradiente rose→fuchsia, nombre, badge parentesco (violet), badge estado (emerald "Verificado" con BadgeCheck si `verificado=true`, amber "Pendiente" con Clock3 si false), botón "Desvincular" (rose→fuchsia) que abre AlertDialog.
  - AlertDialog de confirmación: "¿Desvincular a {nombre}?" con descripción explicando que no elimina la cuenta del niño/a, botones Cancelar + Desvincular (loader en botón mientras opera). → `api.desvincularHijoPadre(usuario.id, hijoId)` → toast info → recargar lista.
  - Sección informativa card-premium "¿No conoces el PIN?": 3 tarjetas explicando las 3 vías de vinculación. Vía 1 (PIN): activa, gradiente emerald→teal, badge "Activo". Vía 2 (Código de maestro): stone, badge "Próximamente". Vía 3 (Código de estudiante): stone, badge "Próximamente". Iconos KeyRound/Sparkles/Lock.
  - Estados: cargando (Loader2), vinculando (loader en botón), desvinculando (loader en botón).
- Helper `tiempoRelativo(iso)` implementado en ParentMensajes: "ahora" (<1min), "hace X min" (<60min), "hace X h" (<24h), "ayer" (1 día), "hace X días" (<7d), luego "d mes" corto. Helper `horaLegible(iso)` en ParentMensajeThread: hora del día si mismo día, "ayer HH:MM" si ayer, "d mes HH:MM" si más antiguo.
- Verificaciones:
  - `npx tsc --noEmit --skipLibCheck 2>&1 | grep -E "(ParentMensajes|ParentMensajeThread|ParentVincularHijo)"` → vacío (0 errores en mis 3 archivos). Errores pre-existentes en `Proyecto-De-Modalidad/backend/*` (NestJS decorators) y `src/components/AvatarCustomizer.tsx` (AvatarConfig shape mismatch) — ninguno mío.
  - `bun run lint 2>&1 | grep -E "(ParentMensajes|ParentMensajeThread|ParentVincularHijo)"` → vacío (0 warnings ni errores en mis 3 archivos). Warnings pre-existentes en `ParentAvisos.tsx` (unused eslint-disable) y `Proyecto-De-Modalidad/frontend/src/components/ParentDashboard.tsx` — ninguno mío.
- Convenciones respetadas: clases `card-premium rounded-3xl p-6`, `btn-3d` con gradientes amber→orange, rose→fuchsia, emerald→teal, violet→fuchsia; `animate-pop` con `animationDelay: \`${i * 50}ms\``; `animate-bounce-in` en headers; botón "Volver" con `ArrowLeft` y `bg-white/70 text-stone-700 hover:bg-white`; contenedores `mx-auto max-w-3xl px-4 py-6 sm:py-8`; lists scrollable `max-h-[75vh] overflow-y-auto`; Loader2 spin naranja; responsive mobile-first (grid sm:grid-cols-2, flex-wrap, labels ocultos en mobile); NO indigo ni blue (solo cyan para badges info y bordes sutiles); toasts vía `mostrarToast`; `Dialog` y `AlertDialog` de shadcn/ui para modales/confirmaciones; Select shadcn estilizado con `border-2 border-orange-200 bg-white` para verse premium; `"use client"` al inicio; helpers de fecha es-NI.

Stage Summary:
- 3 componentes creados en `src/components/`: ParentMensajes.tsx (~410 líneas), ParentMensajeThread.tsx (~260 líneas), ParentVincularHijo.tsx (~360 líneas).
- Todos `"use client"`, usan `useApp()` y `api` del proyecto, respetan convenciones premium del Módulo de Maestro.
- Tipos TypeScript verificados contra `@/lib/types` (Conversacion, ConversacionDetalle, Mensaje, HijoVinculado, SeccionHijo vía ResumenPadre).
- Integración con page.tsx: las 3 vistas (`padre-mensajes`, `padre-mensaje-thread`, `padre-vincular`) ya estaban cableadas en el switch — solo faltaban los archivos, ahora creados.
- Persistencia de conversación seleccionada: vía `AppContext.conversacionSeleccionadaId` (se setea en ParentMensajes al hacer click, se lee en ParentMensajeThread). No usa localStorage porque el contexto ya maneja el state en memoria.
- Flujo completo: ParentDashboard → (botón Mensajes) → ParentMensajes → click conversación → ParentMensajeThread → enviar mensaje → "Volver" → ParentMensajes. Flujo vinculación: ParentDashboard → (botón Vincular) → ParentVincularHijo → submit form → ParentDashboard. Flujo nueva conversación: ParentMensajes → "Nueva conversación" → Dialog → submit → ParentMensajeThread (abre conversación creada).
- Con los 3 archivos creados, el dev server ya no reporta `Module not found` para `@/components/ParentVincularHijo`. (ParentCalificaciones, ParentAsistencia, ParentAvisos y ParentNotificaciones fueron creados por agentes paralelos F3-A/F3-B en la misma ventana de tiempo.)

---
Task ID: F3-B
Agent: full-stack-developer
Task: Crear ParentCalificaciones + ParentAsistencia + ParentAvisos

Work Log:
- Lei contexto completo: worklog (Task 1-2 Arquitecto + 4b-A/B/C Maestro), src/lib/types.ts (ResumenCalificaciones, CalificacionPadre, ResumenAsistencia, RegistroAsistenciaPadre, Aviso, MedallasHijo), src/lib/api.ts (métodos padres: obtenerCalificacionesHijo, obtenerAsistenciaHijo, obtenerMedallasHijo, obtenerAvisosPadre, marcarAvisoLeido, firmarAviso), src/context/AppContext.tsx (Vista union, useApp, hijoSeleccionadoId, mostrarToast), src/components/TeacherDashboard.tsx (convenciones card-premium + btn-3d + gradientes), src/components/TeacherReporteEstudiante.tsx (colorNota, configEstado, formatearFechaCorta), src/app/globals.css (.card-premium glass, .animate-pop, .btn-3d marker).
- Verifiqué package.json: recharts ^2.15.4 + date-fns ^4.1.0 disponibles. Cables ya en page.tsx: case "padre-calificaciones" → <ParentCalificaciones />, "padre-asistencia" → <ParentAsistencia />, "padre-avisos" → <ParentAvisos />.
- **ParentCalificaciones.tsx** (~270 líneas):
  - Si hijoSeleccionadoId null → toast info + setVista("padre").
  - Carga paralela: api.obtenerCalificacionesHijo + api.obtenerMedallasHijo + api.obtenerPerfil (para nombre hijo).
  - Header: btn Volver + Trophy + "Calificaciones y Avance" + nombre hijo.
  - Gauge RadialBarChart (startAngle 90 / endAngle -270) con valor único promedioGeneral; color dinámico emerald (#10b981) si ≥80, amber (#f59e0b) 60-79, rose (#f43f5e) <60. Número grande + "/100" centrado, texto "Promedio general". KPIs laterales: total notas, asignaturas, excelentes (≥80), a mejorar (<60). Texto "— Sin histórico comparativo" como tendencia.
  - Barras horizontales BarChart layout="vertical" con resumenPorAsignatura, Cell amber/orange dinámico por rango, LabelList derecha, altura dinámica (mín 180px + 44px por asignatura).
  - Historial scrollable (max-h-96) ordenado por calificadaEn desc, cada item con nota grande (gradient emerald/amber/rose según rango), título tarea, asignatura+sección, comentario italic con icon MessageSquare, fecha. animate-pop escalonado (delay 40ms × index, cap 12).
  - Medallas grid grid-cols-4 sm:grid-cols-6: ganadas con emoji dinámico (🥇🥈🥉🏆⭐🔥⚡🧠🎓🏅) en bg amber/orange; bloqueadas con 🔒 en grayscale opacity-60. Tooltip title con título+descripción. Contador desbloqueadas/total abajo con icon TrendingUp.
- **ParentAsistencia.tsx** (~290 líneas):
  - Si hijoSeleccionadoId null → toast + setVista("padre").
  - Estados mes (1-12) y anio inicializados con Date actual. Navegación mesPrev/mesSig con wrap de año.
  - Carga api.obtenerAsistenciaHijo + api.obtenerPerfil. Recarga automática al cambiar mes/anio.
  - Header: Volver + "Asistencia de {hijo}" + selector mes con ChevronLeft/ChevronRight + nombre mes-anio en es-NI capitalize.
  - KPIs grid sm:grid-cols-4: % Asistencia (emerald), Presentes (Check), Ausentes (X), Tardanzas (Clock). Justificados como nota adicional abajo si >0.
  - Calendario grid grid-cols-7: headers Lun-Dom, días del mes con offset inicial calculado (Monday=0). Cada día: aspect-square con dot coloreado (emerald PRESENTE, amber TARDANZA, rose AUSENTE, stone JUSTIFICADO), ring-2 cyan si es hoy. Empty cells en blanco para días fuera del mes. Tooltip con estado+fecha larga.
  - Lista detallada scrollable (max-h-96): registros ordenados asc por fecha, badge coloreado con icon, fecha larga capitalize, asignatura+sección, observación italic si existe. animate-pop escalonado.
- **ParentAvisos.tsx** (~340 líneas):
  - Carga api.obtenerAvisosPadre. Contador noLeidos mostrado como badge pulse en header.
  - Header: Volver + Megaphone + "Avisos y Circulares".
  - Filtros tabs (4 botones btn-3d): Todos, Urgentes, Recordatorios, Eventos. Filtro en cliente vía useMemo + sort por fechaEnvio desc. Contador urgentes en badge.
  - Lista scrollable max-h-[70vh]. Cada aviso: card-premium con border-l-4 según prioridad (rose p≥3, amber p=2, cyan p=1). Badge tipo con emoji (🚨📋🎉📢) + color (rose/amber/cyan/stone). NEW pulse si !leido. ✓ Firmado emerald si firmado. Requiere firma badge amber si pendiente.
  - Contenido truncable: si >180 chars → recorta con "…" y botón "Ver más"/"Ver menos" (ChevronDown/Up).
  - Metadata: fecha envío (Calendar cyan), fecha evento si existe (Calendar amber, capitalize), maestro (User fuchsia), sección destinataria (Megaphone emerald).
  - Acciones: botón Firmar (btn-3d amber→orange gradient) si requiereFirma && !firmado, abre AlertDialog. Botón "Marcar leído" discreto si !leido.
  - AlertDialog custom con border amber-300/40 bg-stone-950/95: muestra tipo+emoji, título, contenido completo scrollable, fecha evento, maestro. Botón "Firmar y confirmar" con loader → api.firmarAviso → toast éxito → recargar. Cancelar cierra.
- **Verificaciones**:
  - `npx tsc --noEmit --skipLibCheck | grep Parent` → vacío (0 errores en mis 3 archivos).
  - `npx eslint src/components/Parent{Calificaciones,Asistencia,Avisos}.tsx` → exit 0 (0 errores, 0 warnings).
  - Dev server sigue respondiendo 200 en / tras guardar.

Stage Summary:
- 3 componentes creados: src/components/ParentCalificaciones.tsx, src/components/ParentAsistencia.tsx, src/components/ParentAvisos.tsx. Todos "use client", usando useApp() + api, tipos de @/lib/types, recharts (RadialBarChart + BarChart), AlertDialog shadcn/ui, iconos lucide-react.
- Convenciones respetadas: card-premium rounded-3xl p-5/6, btn-3d, animate-pop escalonado con style={{animationDelay}}, animate-bounce-in en headers. Gradientes solo amber→orange, emerald→teal, rose→fuchsia, orange→rose. NO indigo/blue. Cyan solo para badges informativos (EVENTO).
- Formateo fechas con toLocaleDateString("es-NI", {...}). mostrarToast para feedback. Responsive mobile-first (grid sm:grid-cols-4, max-h-* overflow-y-auto, breakpoints sm/lg).
- Cableado existente en src/app/page.tsx (case "padre-calificaciones"|"padre-asistencia"|"padre-avisos") ya estaba listo; solo faltaban los archivos.

---
Task ID: PADRES-FINAL
Agent: main (Arquitecto)
Task: Implementación completa del Módulo de Padres — schema + backend + 8 componentes frontend + verificación

Work Log:
- F1 Schema: Agregué 6 modelos nuevos al schema Prisma (Aviso, AvisoLeido, Conversacion, Mensaje, Notificacion, PushSubscription) + extendí PadreHijo con parentesco/verificado/activo + agregué relaciones inversas en Usuario y Seccion. `prisma db push` + `prisma generate` exitosos.
- F2 Backend: Creé módulo NestJS `padres/` completo:
  - `padres.service.ts` (~900 líneas): vinculación (solicitarVinculo, vincularPorHijoId, desvincular), verificarAccesoHijo (row-level security), resumen home, calificaciones con promedios por asignatura, asistencia mensual con conteo, avisos con lecturas/firmas, conversaciones con mensajes y noLeídos, notificaciones in-app, push subscriptions, medallas, seed demo.
  - `padres.controller.ts`: ~25 endpoints bajo /api/padres/*.
  - `padres.module.ts` + registrado en AppModule.
  - Fix de 2 errores de tipos Prisma 7: `none: { where: {...} }` → `none: { padreId }` y relación inversa `Seccion.conversaciones` + `Conversacion.seccion`.
- F3-0 Base frontend: Agregué 6 nuevas vistas a Vista en AppContext (padre-calificaciones, padre-asistencia, padre-avisos, padre-mensajes, padre-mensaje-thread, padre-notificaciones, padre-vincular) + estado hijoSeleccionadoId y conversacionSeleccionadaId. Agregué ~15 tipos TypeScript a types.ts (HijoVinculado, ResumenPadre, Aviso, CalificacionPadre, ResumenCalificaciones, ResumenAsistencia, Conversacion, ConversacionDetalle, Mensaje, Notificacion, MedallasHijo). Agregué ~20 métodos API a api.ts. Cableé 7 imports en page.tsx.
- F3-A/B/C (3 subagentes en paralelo): Crearon 8 componentes:
  - ParentDashboard rediseñado (~706 líneas): home con selector de hijo, KPIs (notas/progreso/asistencia), avisos urgentes, actividades del día, notas recientes, bottom nav de 5 botones, campana con badge.
  - ParentNotificaciones (~270 líneas): campana in-app con 8 tipos de notificación, tiempos relativos, "Marcar todas".
  - ParentCalificaciones (~270 líneas): gauge RadialBarChart, barras por asignatura, historial, medallas grid.
  - ParentAsistencia (~290 líneas): calendario mensual 7-col, KPIs, lista detallada, navegación de meses.
  - ParentAvisos (~340 líneas): filtros por tipo, lista con bordes por prioridad, AlertDialog de firma.
  - ParentMensajes (~410 líneas): lista conversaciones + modal "Nueva conversación" con Select hijo.
  - ParentMensajeThread (~260 líneas): chat con burbujas diferenciadas, composer sticky, auto-scroll.
  - ParentVincularHijo (~360 líneas): formulario PIN + parentesco + lista hijos vinculados + AlertDialog desvincular.
  Todos con 0 errores tsc/lint, convenciones premium (card-premium, btn-3d, animate-pop, sin indigo/blue).
- F4 LoginScreen: Modifiqué entrarDemo y onSubmit para: (a) llamar seedPadreDemo tras login PadreDemo (idempotente), (b) navegar a vista "padre" si rol es PADRE, "maestro" si MAESTRO, "dashboard" si ESTUDIANTE.
- Bug fix crítico: El schema nuevo agregó `verificado Boolean @default(false)` a PadreHijo. Los vínculos existentes (creados antes del campo) quedaron con verificado=false. El seed era idempotente y no los actualizaba. Agregué lógica: si el vínculo existe pero !verificado, hacer update a verificado=true. Reconstruí backend + re-seedé → hijos ahora aparecen.
- Verificación con Agent Browser (vía gateway :81):
  - Login PadreDemo → dashboard carga con hijo DemoKid, KPIs, 3 avisos urgentes, actividades, notas, bottom nav, campana. 0 errores.
  - Avisos → 3 circulares con filtros (Todos/Urgentes/Recordatorios/Eventos). Click "Firmar" en Reunión de padres → AlertDialog → "Firmar y confirmar" → badge "FIRMADO" verde verificado por VLM.
  - Mensajes → lista con conversación "Sobre el progreso de DemoKid" (badge 1 no leído). Click → thread con mensaje del maestro visible. Escribí "Muchas gracias por el aviso..." → click Enviar → mensaje aparece en el chat (verificado por innerText).
  - Calificaciones → estado vacío "Aún no hay calificaciones publicadas" (correcto, DemoKid no tiene notas). VLM confirma.
  - Notificaciones → 3 notifs con iconos (💬📢🏆), badges "NUEVA", tiempos relativos ("HACE 1 H", "AYER"), botón "Marcar todas".
  - 0 errores de consola en todo el flujo.

Stage Summary:
- Módulo de Padres COMPLETO y verificado end-to-end:
  - 6 modelos Prisma nuevos + PadreHijo extendido con verificación de vínculo
  - Módulo NestJS padres/ con ~25 endpoints (vinculación, resumen, calificaciones, asistencia, avisos, conversaciones, mensajes, notificaciones, push, seed)
  - 8 componentes React (ParentDashboard rediseñado + 7 nuevos)
  - Seed automático al login PadreDemo (vínculo DemoKid + 3 avisos + 1 conversación + 3 notificaciones)
  - LoginScreen redirige por rol (padre→padre, maestro→maestro, estudiante→dashboard)
  - Row-level security: verificarAccesoHijo valida vínculo verificado+activo en cada endpoint
- Flujo verificado: login → dashboard (KPIs, avisos, actividades) → avisos (firmar circular) → mensajes (abrir conversación, enviar mensaje) → notificaciones (lista con tiempos relativos)
- Servicios: FE 3000 (200), BE 3001 (200, módulo padres mapeado), Gateway 81 (200)
- Screenshots: padre-dashboard.png, padre-avisos.png, padre-firmar-dialog.png, padre-avisos-post-firma.png, padre-mensajes-lista.png, padre-mensaje-thread.png, padre-mensaje-enviado.png, padre-calificaciones.png, padre-notificaciones.png
