# Agent Context — Task 4b-A

**Task ID:** 4b-A
**Agent:** full-stack-developer
**Task:** Crear 2 componentes React para el Módulo de Maestro (Mundilex) — TeacherSecciones y TeacherEstudiantes

## Work Records

### Lectura de contexto
- Leí `worklog.md` (Task 1-2 del Arquitecto): schema Prisma con 6 modelos maestro + backend NestJS en puerto 3001 con endpoints bajo `/api/maestros/*`. MaestroDemo ID y sección demo ID disponibles.
- Leí `src/context/AppContext.tsx`: `Vista` union incluye `maestro-seccion` y `maestro-estudiantes`. `useApp()` proporciona `usuario`, `vista`, `setVista`, `seccionSeleccionadaId`, `setSeccionSeleccionadaId`, `estudianteSeleccionadoId`, `setEstudianteSeleccionadoId`, `mostrarToast`.
- Leí `src/lib/api.ts`: wrapper `http<T>()` con `XTransformPort=3001`. Métodos maestro completos: `obtenerSeccionesMaestro`, `obtenerSeccion`, `crearSeccion`, `obtenerAsignaturasMaestro`, `obtenerEstudiantesSeccion`, `obtenerResumenSeccion`, etc.
- Leí `src/lib/types.ts`: `Seccion` (con `_count?: { inscripciones; tareas }` y `asignatura?: { id; nombre }`), `EstudianteSeccion` (id, nombre, puntos, experiencia, nivel?, porcentajeGlobal?), `ResumenSeccion` (totalEstudiantes, promedioProgreso, promedioNotas, porcentajeAsistencia, estudiantes[]).
- Leí `src/components/TeacherDashboard.tsx`: convenciones de estilo (`card-premium rounded-3xl p-6`, `btn-3d`, `animate-pop` con `animationDelay: i*50ms`, gradientes fuchsia/rose/orange/emerald/amber, badges `rounded-full bg-*-100 px-1.5 py-0.5 text-xs font-bold text-*-700`).
- Leí `src/app/page.tsx`: router switch ya importa `TeacherSecciones` y `TeacherEstudiantes` y los mapea a `vista === "maestro-seccion"` y `"maestro-estudiantes"`.
- Leí `src/components/ui/dialog.tsx`, `select.tsx`, `input.tsx`, `label.tsx`: API estándar shadcn/ui (Radix).

### Componente 1: TeacherSecciones.tsx
- Vista que lista secciones del maestro en grid `sm:grid-cols-2`.
- Cada tarjeta: avatar inicial, nombre, grado + año, badge activa/inactiva, badge asignatura, 2 stats (estudiantes/tareas), botón "Gestionar".
- Dialog crear sección con form (nombre, grado default 3, asignatura opcional via Select con sentinel `NONE`→`undefined`).
- Estados: cargando (Loader2), vacío (CTA), error (toast).
- On "Gestionar": `setSeccionSeleccionadaId(id)` + `setVista("maestro-estudiantes")`.

### Componente 2: TeacherEstudiantes.tsx
- Vista que lista estudiantes de `seccionSeleccionadaId`.
- Carga paralela Promise.all: sección + estudiantes + resumen.
- Sin sección seleccionada: mensaje + CTA "Ir a secciones".
- Resumen rápido grid 3: progreso medio, nota media, % asistencia.
- Lista estudiantes: avatar inicial, nombre, nivel, puntos, badge estado (AL_DIA ≥70% / EN_PROGRESO ≥40% / REZAGADO), botón "Ver perfil".
- On "Ver perfil": `setEstudianteSeleccionadoId(id)` + `setVista("maestro-reporte-estudiante")`.

### Verificación
- `bun run lint` (filtrado a mis archivos): 0 errores.
- `npx tsc --noEmit` (filtrado a mis 2 archivos): 0 errores de tipos.
- Dev server aún roto por 3 imports faltantes en page.tsx (TeacherCrearTarea, TeacherTareas, TeacherTareaDetalle) — responsabilidad de agentes paralelos (tasks 4b-B/C/etc).

## Summary
Ambos componentes completos, tipados, sin errores. Listos para integración. Respetan convenciones de estilo (card-premium, btn-3d, animate-pop, gradientes fuchsia/rose, NO indigo/blue, responsive mobile-first, toasts, loaders).
