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
