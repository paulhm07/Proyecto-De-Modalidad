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
