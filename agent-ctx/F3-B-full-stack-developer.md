# F3-B — full-stack-developer (Componentes Padres)

## Tarea
Crear 3 componentes React cliente del Módulo de Padres Mundilex:
- `src/components/ParentCalificaciones.tsx` — gráficos (gauge RadialBarChart + barras BarChart) + historial + medallas
- `src/components/ParentAsistencia.tsx` — KPIs + calendario mensual + lista detallada
- `src/components/ParentAvisos.tsx` — filtros por tipo + lista scrollable + AlertDialog de firma

## Contexto leído
- `worklog.md` (Tasks 1-2 Arquitecto + 4b-A/B/C Maestro).
- `src/lib/types.ts` (ResumenCalificaciones, CalificacionPadre, ResumenAsistencia, RegistroAsistenciaPadre, Aviso, MedallasHijo, Usuario).
- `src/lib/api.ts` (obtenerCalificacionesHijo, obtenerAsistenciaHijo con opts {mes, anio}, obtenerMedallasHijo, obtenerAvisosPadre, marcarAvisoLeido, firmarAviso, obtenerPerfil).
- `src/context/AppContext.tsx` (Vista union con padre-calificaciones/padre-asistencia/padre-avisos, useApp, hijoSeleccionadoId, mostrarToast).
- `src/components/TeacherDashboard.tsx` (card-premium, btn-3d, animate-pop, animate-bounce-in, gradientes NO indigo/blue).
- `src/components/TeacherReporteEstudiante.tsx` (helpers colorNota, configEstado, formatearFechaCorta, patrones de cards con `style={{ animationDelay }}`).
- `src/components/ui/alert-dialog.tsx` (API: AlertDialog, AlertDialogContent/Header/Title/Description/Footer/Action/Cancel; open/onOpenChange controlled).
- `src/app/globals.css` (.card-premium dark glass con cyan border, .animate-pop 0.35s, .animate-bounce-in 0.55s, .btn-3d marker).
- `package.json` confirma recharts ^2.15.4 + date-fns ^4.1.0 instalados.
- `src/app/page.tsx` ya cablea los 3 componentes en los cases "padre-calificaciones" / "padre-asistencia" / "padre-avisos".

## Work Log
- **ParentCalificaciones.tsx** (~270 líneas):
  - Hook useApp + null-check hijoSeleccionadoId → toast info + setVista("padre").
  - Carga paralela: api.obtenerCalificacionesHijo + api.obtenerMedallasHijo (catch → null) + api.obtenerPerfil (catch → null para nombre hijo).
  - Header con Trophy + "Calificaciones y Avance" + nombre hijo.
  - Gauge RadialBarChart (startAngle 90 / endAngle -270) un solo valor promedioGeneral. PolarAngleAxis domain [0,100] para que el valor llene el arco proporcionalmente. Color dinámico emerald (#10b981) ≥80, amber (#f59e0b) 60-79, rose (#f43f5e) <60. Número grande + "/100" centrado absolute. KPIs laterales: total notas, asignaturas, excelentes (≥80), a mejorar (<60). Tendencia "— Sin histórico comparativo".
  - BarChart layout="vertical" con resumenPorAsignatura. Cell amber/orange dinámico por rango (≥80 #f59e0b, 60-79 #fb923c, <60 #f97316). LabelList position right. Altura dinámica = max(180, length × 44 + 20).
  - Historial scrollable max-h-96 ordenado por calificadaEn desc. Cada item: nota gradient (emerald/amber/rose según rango), título tarea, asignatura amber + sección, comentario italic con icon MessageSquare cyan, fecha. animate-pop delay escalonado cap 12.
  - Medallas grid grid-cols-4 sm:grid-cols-6. Helper emojiMedalla() devuelve 🥇🥈🥉🏆⭐🔥⚡🧠🎓🏅 según keywords del título. Ganadas en bg amber/orange; bloqueadas con 🔒 grayscale opacity-60. Tooltip title con título+descripción. Contador desbloqueadas/total con TrendingUp emerald abajo.
- **ParentAsistencia.tsx** (~290 líneas):
  - Estados mes (1-12) y anio inicializados con Date actual. mesPrev/mesSig con wrap de año.
  - useEffect re-carga al cambiar mes/anio. Carga api.obtenerAsistenciaHijo + api.obtenerPerfil.
  - Header: Volver + "Asistencia de {hijo}" + selector mes con ChevronLeft/ChevronRight en píldora bg-white/10 + nombreMesAnio capitalize es-NI.
  - Helpers: diasEnMes(anio, mes) = new Date(anio, mes, 0).getDate(); primerDiaSemanaLun0 = (getDay() + 6) % 7 para ajustar Sunday=0 a Monday=0.
  - KPIs grid grid-cols-2 sm:grid-cols-4: % Asistencia emerald (TrendingUp), Presentes emerald (Check), Ausentes rose (X), Tardanzas amber (Clock). Justificados como nota abajo si >0.
  - Calendario grid grid-cols-7: headers Lun-Dom; empty cells (offsetInicial) en bg-white/5; días 1..diasEnMes con dot coloreado (emerald/amber/rose/stone según estado). Ring-2 cyan-300/60 si es hoy. Tooltip title con estado+fecha larga.
  - Lista detallada max-h-96: registros ordenados asc, badge con icon, fecha larga capitalize, asignatura+sección, observación italic.
- **ParentAvisos.tsx** (~340 líneas):
  - Carga api.obtenerAvisosPadre. Contador noLeidos en header como badge pulse rose.
  - Filtros tabs (4 botones btn-3d): Todos | Urgentes | Recordatorios | Eventos. useMemo filtra en cliente + sort fechaEnvio desc. Contador urgentes en badge.
  - Lista scrollable max-h-[70vh]. Cada aviso: card-premium con border-l-4 según prioridad (rose p≥3, amber p=2, cyan p=1). Badge tipo con emoji (🚨 URGENTE rose, 📋 RECORDATORIO amber, 🎉 EVENTO cyan, 📢 CIRCULAR stone). NEW pulse si !leido. ✓ Firmado emerald si firmado. Badge "Requiere firma" amber si pendiente.
  - Contenido truncable: si >180 chars → recorta + "…" + botón "Ver más"/"Ver menos" con ChevronDown/Up.
  - Metadata border-t pt-3: fecha envío (Calendar cyan), fecha evento si existe (Calendar amber capitalize), maestro (User fuchsia), sección destinataria (Megaphone emerald).
  - Acciones: btn "Firmar" (btn-3d amber→orange gradient con PenLine) si requiereFirma && !firmado → setAvisoFirmar. btn "Marcar leído" (bg-white/10 discreto) si !leido → api.marcarAvisoLeido → toast + recargar.
  - AlertDialog controlled con open={!!avisoFirmar}: bg-stone-950/95 backdrop-blur-xl border amber-300/40. Muestra tipo+emoji, título, contenido completo max-h-48 overflow-y-auto, fecha evento, maestro, fecha envío. Action "Firmar y confirmar" (gradient amber→orange) con loader firmarLoading → api.firmarAviso → toast éxito → cerrar + recargar. Cancel disabled mientras loading.
- **Verificaciones**:
  - `npx tsc --noEmit --skipLibCheck 2>&1 | grep -E "(ParentCalificaciones|ParentAsistencia|ParentAvisos)"` → vacío (0 errores en mis 3 archivos).
  - `npx eslint src/components/ParentCalificaciones.tsx src/components/ParentAsistencia.tsx src/components/ParentAvisos.tsx` → exit 0 (0 errores, 0 warnings).
  - Dev server sigue respondiendo 200 OK en / tras guardar todos los archivos.

## Stage Summary
- 3 componentes cliente creados, todos "use client" + useApp() + api + tipos + recharts + AlertDialog shadcn/ui + lucide-react.
- Convenciones premium respetadas: card-premium rounded-3xl p-5/6, btn-3d, animate-pop escalonado (style={{animationDelay}}), animate-bounce-in en headers.
- Paleta: solo amber→orange, emerald→teal, rose→fuchsia, orange→rose. NO indigo/blue. Cyan solo para badges informativos (EVENTO) y borders de prioridad baja.
- Formateo fechas es-NI con toLocaleDateString. mostrarToast para feedback. Responsive mobile-first (grid sm:grid-cols-4, max-h-* overflow-y-auto, breakpoints sm/lg).
- Cableado en page.tsx ya estaba listo; solo faltaban los 3 archivos. Las 3 vistas ahora compilan sin Module not found.
- Dependencias externas usadas: recharts (RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Cell, LabelList, ResponsiveContainer), @/components/ui/alert-dialog (Radix wrapper).
