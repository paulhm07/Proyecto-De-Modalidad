export type Rol = 'ESTUDIANTE' | 'PADRE' | 'MAESTRO';
export type TipoDesafio = 'SELECCION_MULTIPLE' | 'COMPLETAR_TEXTO' | 'VERDADERO_FALSO' | 'ASOCIAR_PAREJAS' | 'ORDENAR_PALABRAS';
export type CategoriaAvatar = 'CUERPO' | 'OJOS' | 'BOCA' | 'CABELLO' | 'ROPA' | 'ACCESORIO';

export interface AvatarConfig {
  usuarioId: string;
  cuerpo: string;
  ojos: string;
  boca: string;
  cabello: string;
  ropa: string;
  accesorio: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  pin: string;
  rol: Rol;
  avatar: string;
  puntos: number;
  experiencia: number;
  monedas: number;
  gemas: number;
  avatarConfig?: AvatarConfig | null;
}

export interface Opcion {
  id: string;
  texto: string;
}

export interface Desafio {
  id: string;
  moduloId: string;
  tipo: TipoDesafio;
  pregunta: string;
  recursoUrl?: string | null;
  puntos: number;
  orden: number;
  opciones: Opcion[];
}

export interface Modulo {
  id: string;
  asignaturaId: string;
  titulo: string;
  descripcion?: string | null;
  orden: number;
  nivelMinimo: number;
  _count?: { desafios: number };
}

export interface Asignatura {
  id: string;
  nombre: string;
  descripcion?: string | null;
  maestroId?: string | null;
  _count?: { modulos: number };
}

export interface Medalla {
  id: string;
  titulo: string;
  descripcion: string;
  iconoUrl: string;
  criterio: string;
}

export interface MedallaEstudiante {
  id: string;
  medalla: Medalla;
  ganadaEn: string;
}

export interface ItemTienda {
  id: string;
  categoria: CategoriaAvatar;
  clave: string;
  nombre: string;
  descripcion?: string | null;
  precioMonedas: number;
  precioGemas: number;
  raridad: string;
  nivelRequerido: number;
}

export interface RespuestaProgreso {
  esCorrecta: boolean;
  puntosGanados: number;
  monedasGanadas: number;
  gemasGanadas: number;
  medallaGanada: Medalla | null;
  progresoActual: any;
}

export interface MiAvatarResponse {
  config: AvatarConfig;
  itemsOwned: string[];
  monedas: number;
  gemas: number;
  nivel: number;
  experiencia: number;
}

export interface ComprarResponse {
  mensaje: string;
  monedas: number;
  gemas: number;
}

export interface EquiparResponse {
  mensaje: string;
  config: AvatarConfig;
}

// ===================== MÓDULO DE MAESTRO =====================

export interface Seccion {
  id: string;
  nombre: string;
  grado: number;
  maestroId: string;
  asignaturaId?: string | null;
  asignatura?: { id: string; nombre: string } | null;
  anioEscolar: number;
  activa: boolean;
  createdAt: string;
  _count?: { inscripciones: number; tareas: number };
}

export interface EstudianteSeccion {
  id: string;
  nombre: string;
  puntos: number;
  experiencia: number;
  monedas: number;
  gemas: number;
  nivel?: number;
  porcentajeGlobal?: number;
  desafiosCompletados?: number;
}

export interface Tarea {
  id: string;
  seccionId: string;
  desafioId: string;
  titulo: string;
  descripcion?: string | null;
  fechaAsignada: string;
  fechaLimite: string;
  estado: 'ACTIVA' | 'CERRADA' | 'BORRADOR';
  desafio?: { id: string; pregunta: string; puntos: number };
  seccion?: { id: string; nombre: string };
  _count?: { entregas: number; calificaciones: number };
}

export interface EntregaTarea {
  id: string;
  tareaId: string;
  estudianteId: string;
  estudiante: { id: string; nombre: string };
  opcionId?: string | null;
  correcta?: boolean | null;
  puntosGanados: number;
  entregadaEn: string;
  tarde: boolean;
}

export interface Calificacion {
  id: string;
  tareaId: string;
  estudianteId: string;
  estudiante: { id: string; nombre: string };
  nota: number;
  comentario?: string | null;
  calificadaEn: string;
  maestroId: string;
}

export type EstadoAsistencia = 'PRESENTE' | 'AUSENTE' | 'TARDANZA' | 'JUSTIFICADO';

export interface RegistroAsistencia {
  id: string;
  seccionId: string;
  estudianteId: string;
  estudiante: { id: string; nombre: string };
  fecha: string;
  estado: EstadoAsistencia;
  observacion?: string | null;
}

export interface AlertasMaestro {
  tareasPorCalificar: number;
  asistenciasPendientesHoy: number;
  entregasTardias: number;
  totalAlertas: number;
}

export interface ResumenSeccion {
  seccion: { id: string; nombre: string; grado: number; asignatura: { id: string; nombre: string } | null };
  totalEstudiantes: number;
  totalTareas: number;
  tareasActivas: number;
  promedioProgreso: number;
  promedioNotas: number;
  porcentajeAsistencia: number;
  estudiantes: { id: string; nombre: string; puntos: number; nivel: number }[];
}

export interface ReporteEstudiante {
  estudiante: {
    id: string;
    nombre: string;
    puntos: number;
    experiencia: number;
    nivel: number;
    monedas: number;
    gemas: number;
  };
  progresoPorAsignatura: {
    id: string;
    nombre: string;
    totalDesafios: number;
    completados: number;
    porcentaje: number;
    modulos: { id: string; titulo: string; totalDesafios: number; completados: number; porcentaje: number }[];
  }[];
  calificaciones: {
    id: string;
    nota: number;
    comentario?: string | null;
    fecha: string;
    tarea: string;
    seccion?: string | null;
  }[];
  promedioNotas: number;
  entregas: {
    id: string;
    correcta?: boolean | null;
    puntosGanados: number;
    tarde: boolean;
    fecha: string;
    tarea: string;
  }[];
  asistencia: {
    total: number;
    presentes: number;
    tardanzas: number;
    ausentes: number;
    justificados: number;
    porcentaje: number;
    registros: RegistroAsistencia[];
  };
  medallas: {
    id: string;
    titulo: string;
    descripcion: string;
    iconoUrl: string;
    ganadaEn: string;
  }[];
  resumen: {
    porcentajeGlobal: number;
    estadoAvance: 'AL_DIA' | 'EN_PROGRESO' | 'REZAGADO';
    totalDesafios: number;
    completados: number;
  };
}
