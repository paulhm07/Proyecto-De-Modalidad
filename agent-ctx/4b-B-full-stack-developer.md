# 4b-B — full-stack-developer (Tareas Maestro)

## Tarea
Crear 3 componentes React del Módulo de Maestro Mundilex:
- `src/components/TeacherTareas.tsx` — lista de tareas con cerrar/eliminar (AlertDialog)
- `src/components/TeacherCrearTarea.tsx` — formulario en cascada Sección→Asignatura→Módulo→Desafío
- `src/components/TeacherTareaDetalle.tsx` — detalle con Tabs (Entregas / Calificar)

## Contexto leído
- `worklog.md` (Task 1-2 Arquitecto + Task 4b-A + Task 4b-C agentes paralelos).
- `src/context/AppContext.tsx` (Vista union, useApp, seccionSeleccionadaId, mostrarToast).
- `src/lib/api.ts` (métodos maestro).
- `src/lib/types.ts` (Tarea, EntregaTarea, Calificacion, Seccion, Desafio, Asignatura, Modulo).
- `src/components/TeacherDashboard.tsx` (convenciones de estilo).
- `src/components/ContentManager.tsx` (formularios).
- `src/components/BancoDesafiosViewer.tsx` (uso de challenge-board).
- `src/components/ui/alert-dialog.tsx`, `ui/tabs.tsx`, `ui/select.tsx` (Radix primitives).
- `src/app/globals.css` (card-premium dark glass, animate-pop, btn-3d marker).
- Backend: `Proyecto-De-Modalidad/backend/src/maestros/maestros.service.ts` (verificar retorna `obtenerTarea` con `desafio: { include: opciones }`).

## Work Log
- Verifiqué dev.log: server roto por imports de TeacherTareas, TeacherCrearTarea, TeacherTareaDetalle faltantes en `page.tsx`.
- **TeacherTareas.tsx** (~290 líneas):
  - Lista tareas de `seccionSeleccionadaId` (o todas las del maestro si no hay sección seleccionada).
  - Header con icono ClipboardList + botón "Crear tarea".
  - Cada tarea como `card-premium animate-pop` con título, badge estado, descripción truncada, desafío (pregunta truncada), 4 badges (fecha/entregas/calif/sección).
  - Acciones: Ver detalle (localStorage `mundilex_tarea_sel`), Cerrar (AlertDialog amber), Eliminar (AlertDialog rose con loader).
- **TeacherCrearTarea.tsx** (~330 líneas):
  - Formulario en cascada con Selects shadcn: Sección → Asignatura → Módulo → Desafío. Cada uno con useEffect + loaders Loader2.
  - Sección preseleccionada si `seccionSeleccionadaId`; si no, autoselecciona la primera.
  - Título sugerido = enunciado del desafío (solo si el usuario no escribió nada).
  - Fecha límite default = mañana misma hora (helper `mananaMismaHora()`).
  - Validación con `puedeEnviar`, estados vacíos con mensajes amber.
- **TeacherTareaDetalle.tsx** (~390 líneas):
  - Lee `tareaId` de localStorage `mundilex_tarea_sel`.
  - Tabs shadcn con gradientes en active state: Entregas (fuchsia→rose) y Calificar (emerald→teal).
  - Tab Entregas: lista scrollable con avatar, nombre, fecha/hora, badge Tardía, check/x, puntos.
  - Tab Calificar: formulario por estudiante (nota 0-100 + comentario) → `api.registrarCalificacion` → toast + reload.
  - Card "Desafío asociado" con pregunta + grid 2 cols de opciones A/B/C/D.
- **Verificaciones**:
  - `bun run lint` — 0 errores en mis 3 archivos.
  - `npx tsc --noEmit --skipLibCheck` — 0 errores en mis 3 archivos (tuve 1 error inicial TS2430 por redefinir `desafio?` incompatible con Tarea; lo resolví eliminando la redefinición del interface y haciendo cast en el acceso).
  - Dev server compila sin errores.

## Stage Summary
- 3 componentes creados, todos `"use client"`, usando `useApp()` + `api`, respetando convenciones premium (card-premium, btn-3d, animate-pop escalonado, gradientes NO indigo/blue, badges con bg-{color}-100/text-{color}-700).
- Persistencia de tarea seleccionada vía localStorage `mundilex_tarea_sel` (set en TeacherTareas, get en TeacherTareaDetalle).
- Integración con `page.tsx`: las 3 rutas ya estaban cableadas — solo faltaban los archivos, ahora completados.
- Con los 9 Teacher*.tsx completos, el dev server ya no reporta `Module not found`.
