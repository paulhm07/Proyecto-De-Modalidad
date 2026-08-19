# Task 4b-C — full-stack-developer

## Componentes creados (3)

### 1. `src/components/TeacherAsistencia.tsx`
Toma de asistencia diaria del maestro.

**Flujo:**
- Si `!seccionSeleccionadaId`: selector con cards animadas de las secciones del maestro (`api.obtenerSeccionesMaestro`). Al tap → `setSeccionSeleccionadaId(id)`.
- Si hay sección seleccionada:
  - Header: nombre de sección + fecha (`<input type="date">` default hoy local ISO, editable, `max=hoy`).
  - Lista de estudiantes (`api.obtenerEstudiantesSeccion`): cada fila con avatar inicial (gradiente fuchsia→rose) + nombre + nivel + 4 botones de estado.
  - Botones de estado: `PRESENTE` (emerald, icon Check), `TARDANZA` (amber, icon Hand), `AUSENTE` (rose, icon X), `JUSTIFICADO` (violet, icon PenLine). El botón activo se resalta con `scale-105` + `ring-2` + bg sólido + texto blanco; los inactivos con `bg-white/70` + opacidad.
  - Estado local `Map<estudianteId, EstadoAsistencia>` inicializado desde `api.obtenerAsistenciaSeccion(seccionId, fecha)`.
  - Cambio de fecha: recarga SOLO asistencia vía `recargarAsistencia` (useCallback) — no recarga estudiantes (mejor UX, evita parpadeo de loader).
  - Resumen rápido (4 cards animadas): presentes, tardanzas, ausentes, justificados — contadores en vivo desde el Map.
  - Botón "Guardar asistencia" sticky bottom (`sticky bottom-4 z-10`) con gradiente emerald→teal → `api.registrarAsistencia(registros[])` → toast éxito.
  - Loader con `Loader2` spin naranja.

**Volver:** `setVista("maestro")`.

### 2. `src/components/TeacherReportes.tsx`
Reportes grupales por sección.

**Flujo:**
- Selector de sección si `!seccionSeleccionadaId`.
- Header: nombre de sección + icono BarChart3 en cuadrado degradado fuchsia→rose.
- 4 cards de métricas (grid `grid-cols-2 sm:grid-cols-4`):
  - Promedio Progreso (fuchsia→rose, icon BarChart3, suffix %)
  - Promedio Notas (amber→orange, icon Star, formato 1 decimal)
  - % Asistencia (emerald→teal, icon Percent, suffix %)
  - Total Estudiantes (violet→fuchsia, icon Users)
  - Cada card: icono en cuadrado degradado h-10 w-10 + número grande (text-2xl/3xl) + label uppercase.
- Sección "Estudiantes" con `Table` de shadcn: nombre + avatar, nivel (badge emerald), puntos (badge amber con Star), botón "Ver" (gradiente fuchsia→rose). Contenedor con `max-h-96 overflow-y-auto`.
- 3 cards extra: Tareas totales/activas, Asistencia grupal con barra de progreso custom, Promedio notas con interpretación textual.
- Botón "Ver reporte" → `setEstudianteSeleccionadoId(id)` + `setVista("maestro-reporte-estudiante")`.
- API: `api.obtenerResumenSeccion(seccionId)`.

**Volver:** `setVista("maestro")`.

### 3. `src/components/TeacherReporteEstudiante.tsx`
Reporte individual acumulado.

**Flujo:**
- Lee `estudianteSeleccionadoId`. Si no hay: card con icon Award + mensaje + botón volver.
- Header: avatar inicial (h-16 w-16, gradiente fuchsia→rose) + nombre + nivel + puntos + badge de estado (AL_DIA=emerald/Check, EN_PROGRESO=amber/Minus, REZAGADO=rose/TrendingDown).
- Resumen global (antes de tabs): barra grande h-4 con gradiente según estado + "X/Y desafíos completados" + % grande (text-3xl).
- Tabs (shadcn) con 4 pestañas:
  - **Progreso**: `Accordion` (single collapsible) por asignatura. Trigger: icono cuadrado + nombre + "X/Y · Z%". Content: `Progress` h-3 con gradiente fuchsia→rose (vía `[&>[data-slot=progress-indicator]]:bg-gradient-to-r`) + lista de módulos con `Progress` h-2 gradiente emerald→teal.
  - **Calificaciones**: promedio arriba (text-2xl) + lista scrollable `max-h-96`. Cada item: badge de nota en cuadrado (>=70 emerald, >=50 amber, <50 rose) + tarea + sección + comentario (line-clamp-2) + fecha (icon CalendarDays).
  - **Asistencia**: 4 stat cards (presentes/tardanzas/ausentes/justificados con iconos Check/Hand/X/PenLine) + % asistencia con barra grande gradiente emerald→teal + lista de últimos 10 registros con icono+color según estado.
  - **Medallas**: grid `grid-cols-2 sm:grid-cols-3`. Cada card: icono en cuadrado gradiente amber→orange (helper `MedallaIcono`: img si URL http/, emoji si ≤4 chars, fallback Award lucide) + título + descripción + fecha con icon Medal.
- API: `api.obtenerReporteEstudiante(estudianteId)`.

**Volver:** `setVista("maestro-reportes")`.

## Convenciones respetadas
- `"use client"` en los 3 archivos.
- `useApp()` del AppContext para `usuario`, `vista`, `setVista`, `seccionSeleccionadaId`, `setSeccionSeleccionadaId`, `estudianteSeleccionadoId`, `setEstudianteSeleccionadoId`, `mostrarToast`.
- Estilos: `card-premium rounded-3xl p-6`, `btn-3d`, `animate-pop` con `animationDelay: ${i*50}ms`, `animate-bounce-in` para headers.
- Botón "Volver" con `ArrowLeft` y clase exacta especificada.
- Contenedor `mx-auto max-w-5xl px-4 py-6 sm:py-8`.
- Loader `<Loader2 className="h-8 w-8 animate-spin text-orange-500" />`.
- Colores: stone, amber, fuchsia, rose, emerald, teal, orange, violet — NO indigo ni blue.
- Fechas: `toLocaleDateString("es-NI", { day, month: short, year })`.
- shadcn/ui: Progress, Tabs, Accordion, Table.
- Responsive mobile-first (grid cols adaptativas, tablas con overflow-x-auto, botones grid-cols-2 en mobile).

## Verificación
- `bun run lint` (filtrado a mis 3 archivos): **0 errores, 0 warnings**.
- `npx tsc --noEmit --skipLibCheck` (filtrado a mis 3 archivos): **0 errores de tipos**.
- Tipos usados de `@/lib/types`: `EstadoAsistencia`, `RegistroAsistencia`, `ResumenSeccion`, `ReporteEstudiante`, `Seccion`.
- Dev server: mis 3 archivos compilan correctamente (verificado en dev.log). Los `Module not found` restantes son de TeacherSecciones/TeacherEstudiantes/TeacherCrearTarea/TeacherTareas/TeacherTareaDetalle (tasks 4b-A y 4b-B).

## Integración con page.tsx
Las 3 rutas ya estaban cableadas en el switch de `src/app/page.tsx`:
- `case "maestro-asistencia"` → `<TeacherAsistencia />`
- `case "maestro-reportes"` → `<TeacherReportes />`
- `case "maestro-reporte-estudiante"` → `<TeacherReporteEstudiante />`

Solo faltaban los archivos — ahora creados.

## Notas para agentes posteriores
- `TeacherReportes` usa `ResumenSeccion.estudiantes` que solo trae `{id, nombre, puntos, nivel}`. Si se quiere mostrar más info (progreso individual, % asistencia) en la tabla, habría que llamar `obtenerReporteEstudiante` por cada estudiante o extender el endpoint de resumen.
- `TeacherReporteEstudiante` accede a `reporte.asistencia.registros` para mostrar los últimos 10 — el endpoint ya devuelve los registros ordenados; si no lo están, habría que ordenar por fecha desc antes del slice.
- El helper `MedallaIcono` en TeacherReporteEstudiante.tsx puede reutilizarse si otros componentes necesitan renderizar iconos de medalla.
