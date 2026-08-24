import type {
  AlertasMaestro,
  Asignatura,
  Aviso,
  Calificacion,
  ComprarResponse,
  Conversacion,
  ConversacionDetalle,
  Desafio,
  EntregaTarea,
  EquiparResponse,
  EstadoAsistencia,
  HijoVinculado,
  ItemTienda,
  MedallaEstudiante,
  MedallasHijo,
  Mensaje,
  MiAvatarResponse,
  Modulo,
  Notificacion,
  RegistroAsistencia,
  ReporteEstudiante,
  ResumenAsistencia,
  ResumenCalificaciones,
  ResumenPadre,
  ResumenSeccion,
  RespuestaProgreso,
  Rol,
  Seccion,
  Tarea,
  Usuario,
} from "./types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let mensaje = `Error ${res.status}`;
    try {
      const data = await res.json();
      mensaje = data.message || data.error || data.mensaje || mensaje;
    } catch {
      try {
        const text = await res.text();
        if (text) mensaje = text;
      } catch {
        /* ignore */
      }
    }
    throw new Error(mensaje);
  }

  // Some DELETE / void endpoints may return empty body
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as unknown as T;
  }
  const text = await res.text();
  if (!text) return undefined as unknown as T;
  return JSON.parse(text) as T;
}

function post<T>(path: string, body?: unknown): Promise<T> {
  return http<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

function del<T>(path: string): Promise<T> {
  return http<T>(path, { method: "DELETE" });
}

function get<T>(path: string): Promise<T> {
  return http<T>(path, { method: "GET" });
}

export const api = {
  // Usuarios
  login(nombre: string, pin: string, rol?: Rol): Promise<Usuario> {
    return post<Usuario>("/api/usuarios/login", { nombre, pin, rol });
  },
  loginDemo(rol: Rol): Promise<Usuario> {
    return post<Usuario>("/api/usuarios/demo", { rol });
  },
  crearUsuario(nombre: string, pin: string, rol: Rol): Promise<Usuario> {
    return post<Usuario>("/api/usuarios", { nombre, pin, rol });
  },
  obtenerPerfil(id: string): Promise<Usuario> {
    return get<Usuario>(`/api/usuarios/perfil/${id}`);
  },
  obtenerProgreso(id: string): Promise<any> {
    return get<any>(`/api/usuarios/progreso/${id}`);
  },
  obtenerRanking(): Promise<{ id: string; nombre: string; puntos: number; experiencia: number }[]> {
    return get(`/api/usuarios/ranking`);
  },
  obtenerHijos(padreId: string): Promise<Usuario[]> {
    return get<Usuario[]>(`/api/usuarios/padres/${padreId}/hijos`);
  },
  vincularHijo(padreId: string, data: { hijoId?: string; nombre?: string; pin?: string }): Promise<any> {
    return post(`/api/usuarios/padres/${padreId}/hijo`, data);
  },
  desvincularHijo(padreId: string, hijoId: string): Promise<any> {
    return del(`/api/usuarios/padres/${padreId}/hijo/${hijoId}`);
  },
  obtenerEstudiantesMaestro(maestroId: string): Promise<any[]> {
    return get<any[]>(`/api/usuarios/maestros/${maestroId}/estudiantes`);
  },
  obtenerAsignaturasMaestro(maestroId: string): Promise<Asignatura[]> {
    return get<Asignatura[]>(`/api/usuarios/maestros/${maestroId}/asignaturas`);
  },

  // Desafios / Asignaturas / Modulos
  obtenerAsignaturas(): Promise<Asignatura[]> {
    return get<Asignatura[]>(`/api/desafios/asignaturas`);
  },
  obtenerModulos(asignaturaId: string): Promise<Modulo[]> {
    return get<Modulo[]>(`/api/desafios/modulos/${asignaturaId}`);
  },
  obtenerDesafios(moduloId: string): Promise<Desafio[]> {
    return get<Desafio[]>(`/api/desafios/modulo/${moduloId}`);
  },
  seedDesafios(): Promise<any> {
    return post(`/api/desafios/seed`);
  },
  crearAsignatura(nombre: string, descripcion: string | null, maestroId: string): Promise<Asignatura> {
    return post<Asignatura>(`/api/desafios/asignaturas`, { nombre, descripcion, maestroId });
  },
  crearModulo(asignaturaId: string, titulo: string, nivelMinimo: number = 1): Promise<Modulo> {
    return post<Modulo>(`/api/desafios/modulos`, { asignaturaId, titulo, nivelMinimo });
  },
  crearDesafio(data: {
    moduloId: string;
    tipo: string;
    pregunta: string;
    puntos?: number;
    opciones: { texto: string; esCorrecta: boolean }[];
  }): Promise<Desafio> {
    return post<Desafio>(`/api/desafios/desafios`, data);
  },
  eliminarAsignatura(id: string): Promise<any> {
    return del(`/api/desafios/asignaturas/${id}`);
  },
  eliminarModulo(id: string): Promise<any> {
    return del(`/api/desafios/modulos/${id}`);
  },
  eliminarDesafio(id: string): Promise<any> {
    return del(`/api/desafios/desafios/${id}`);
  },

  // Progreso
  responder(usuarioId: string, desafioId: string, opcionId: string): Promise<RespuestaProgreso> {
    return post<RespuestaProgreso>(`/api/progreso/responder`, { usuarioId, desafioId, opcionId });
  },
  obtenerMedallas(usuarioId: string): Promise<MedallaEstudiante[]> {
    return get<MedallaEstudiante[]>(`/api/progreso/medallas/${usuarioId}`);
  },

  // Avatares
  obtenerTienda(): Promise<ItemTienda[]> {
    return get<ItemTienda[]>(`/api/avatars/tienda`);
  },
  obtenerMiAvatar(usuarioId: string): Promise<MiAvatarResponse> {
    return get<MiAvatarResponse>(`/api/avatars/mi-avatar/${usuarioId}`);
  },
  comprar(usuarioId: string, itemId: string): Promise<ComprarResponse> {
    return post<ComprarResponse>(`/api/avatars/comprar/${usuarioId}`, { itemId });
  },
  equipar(usuarioId: string, itemId: string): Promise<EquiparResponse> {
    return post<EquiparResponse>(`/api/avatars/equipar/${usuarioId}`, { itemId });
  },
  seedTienda(): Promise<any> {
    return post(`/api/avatars/seed`);
  },

  // ===================== MÓDULO DE MAESTRO =====================

  // Secciones
  obtenerSeccionesMaestro(maestroId: string): Promise<Seccion[]> {
    return get<Seccion[]>(`/api/maestros/secciones/maestro/${maestroId}`);
  },
  obtenerSeccion(id: string): Promise<Seccion> {
    return get<Seccion>(`/api/maestros/secciones/${id}`);
  },
  crearSeccion(data: {
    nombre: string;
    grado?: number;
    maestroId: string;
    asignaturaId?: string;
  }): Promise<Seccion> {
    return post<Seccion>(`/api/maestros/secciones`, data);
  },
  actualizarSeccion(id: string, data: { nombre?: string; grado?: number; asignaturaId?: string | null }): Promise<Seccion> {
    return http<Seccion>(`/api/maestros/secciones/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  eliminarSeccion(id: string): Promise<any> {
    return del(`/api/maestros/secciones/${id}`);
  },
  inscribirEstudiante(seccionId: string, estudianteId: string): Promise<any> {
    return post(`/api/maestros/secciones/${seccionId}/inscribir`, { estudianteId });
  },
  desinscribirEstudiante(seccionId: string, estudianteId: string): Promise<any> {
    return del(`/api/maestros/secciones/${seccionId}/inscribir/${estudianteId}`);
  },
  obtenerEstudiantesSeccion(seccionId: string): Promise<any[]> {
    return get<any[]>(`/api/maestros/secciones/${seccionId}/estudiantes`);
  },

  // Tareas
  obtenerTareasSeccion(seccionId: string): Promise<Tarea[]> {
    return get<Tarea[]>(`/api/maestros/tareas/seccion/${seccionId}`);
  },
  obtenerTarea(id: string): Promise<Tarea & { entregas: EntregaTarea[]; calificaciones: Calificacion[] }> {
    return get(`/api/maestros/tareas/${id}`);
  },
  crearTarea(data: {
    seccionId: string;
    desafioId: string;
    titulo: string;
    descripcion?: string;
    fechaLimite: string;
  }): Promise<Tarea> {
    return post<Tarea>(`/api/maestros/tareas`, data);
  },
  actualizarTarea(id: string, data: { titulo?: string; descripcion?: string | null; fechaLimite?: string; estado?: string }): Promise<Tarea> {
    return http<Tarea>(`/api/maestros/tareas/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  cerrarTarea(id: string): Promise<any> {
    return post(`/api/maestros/tareas/${id}/cerrar`);
  },
  eliminarTarea(id: string): Promise<any> {
    return del(`/api/maestros/tareas/${id}`);
  },

  // Calificaciones
  registrarCalificacion(data: {
    tareaId: string;
    estudianteId: string;
    nota: number;
    comentario?: string;
    maestroId: string;
  }): Promise<Calificacion> {
    return post<Calificacion>(`/api/maestros/calificaciones`, data);
  },
  obtenerCalificacionesTarea(tareaId: string): Promise<Calificacion[]> {
    return get<Calificacion[]>(`/api/maestros/calificaciones/tarea/${tareaId}`);
  },
  obtenerCalificacionesEstudiante(estudianteId: string): Promise<Calificacion[]> {
    return get<Calificacion[]>(`/api/maestros/calificaciones/estudiante/${estudianteId}`);
  },

  // Asistencia
  registrarAsistencia(registros: {
    seccionId: string;
    estudianteId: string;
    fecha: string;
    estado: EstadoAsistencia;
    observacion?: string;
  }[]): Promise<any> {
    return post(`/api/maestros/asistencia`, { registros });
  },
  obtenerAsistenciaSeccion(seccionId: string, fecha?: string): Promise<RegistroAsistencia[]> {
    const q = fecha ? `?fecha=${encodeURIComponent(fecha)}` : "";
    return get<RegistroAsistencia[]>(`/api/maestros/asistencia/seccion/${seccionId}${q}`);
  },
  obtenerAsistenciaEstudiante(estudianteId: string): Promise<{ registros: RegistroAsistencia[]; resumen: any }> {
    return get(`/api/maestros/asistencia/estudiante/${estudianteId}`);
  },

  // Reportes
  obtenerResumenSeccion(seccionId: string): Promise<ResumenSeccion> {
    return get<ResumenSeccion>(`/api/maestros/reportes/seccion/${seccionId}/resumen`);
  },
  obtenerReporteEstudiante(estudianteId: string): Promise<ReporteEstudiante> {
    return get<ReporteEstudiante>(`/api/maestros/reportes/estudiante/${estudianteId}/acumulado`);
  },
  obtenerAlertasMaestro(maestroId: string): Promise<AlertasMaestro> {
    return get<AlertasMaestro>(`/api/maestros/alertas/${maestroId}`);
  },

  // Seed
  seedMaestroDemo(maestroId: string): Promise<any> {
    return post(`/api/maestros/seed/${maestroId}`);
  },

  // ===================== MÓDULO DE PADRES =====================

  seedPadreDemo(padreId: string): Promise<{ ok: boolean; mensaje: string }> {
    return post(`/api/padres/${padreId}/seed-demo`);
  },

  obtenerHijosPadre(padreId: string): Promise<HijoVinculado[]> {
    return get<HijoVinculado[]>(`/api/padres/${padreId}/hijos`);
  },

  solicitarVinculoHijo(padreId: string, data: { nombre: string; pin: string; parentesco?: string }): Promise<any> {
    return post(`/api/padres/${padreId}/hijos`, data);
  },

  vincularHijoPorId(padreId: string, hijoId: string, parentesco?: string): Promise<any> {
    return post(`/api/padres/${padreId}/hijos/${hijoId}/vincular`, { parentesco });
  },

  desvincularHijoPadre(padreId: string, hijoId: string): Promise<any> {
    return del(`/api/padres/${padreId}/hijos/${hijoId}`);
  },

  obtenerResumenPadre(padreId: string, hijoId: string): Promise<ResumenPadre> {
    return get<ResumenPadre>(`/api/padres/${padreId}/hijos/${hijoId}/resumen`);
  },

  obtenerCalificacionesHijo(
    padreId: string,
    hijoId: string,
    opts?: { asignaturaId?: string; desde?: string; hasta?: string }
  ): Promise<ResumenCalificaciones> {
    const params = new URLSearchParams();
    if (opts?.asignaturaId) params.set('asignaturaId', opts.asignaturaId);
    if (opts?.desde) params.set('desde', opts.desde);
    if (opts?.hasta) params.set('hasta', opts.hasta);
    const q = params.toString() ? `?${params.toString()}` : '';
    return get<ResumenCalificaciones>(`/api/padres/${padreId}/hijos/${hijoId}/calificaciones${q}`);
  },

  obtenerAsistenciaHijo(
    padreId: string,
    hijoId: string,
    opts?: { mes?: number; anio?: number }
  ): Promise<ResumenAsistencia> {
    const params = new URLSearchParams();
    if (opts?.mes !== undefined) params.set('mes', String(opts.mes));
    if (opts?.anio !== undefined) params.set('anio', String(opts.anio));
    const q = params.toString() ? `?${params.toString()}` : '';
    return get<ResumenAsistencia>(`/api/padres/${padreId}/hijos/${hijoId}/asistencia${q}`);
  },

  obtenerTareasHijo(padreId: string, hijoId: string, estado?: string): Promise<any[]> {
    const q = estado ? `?estado=${estado}` : '';
    return get<any[]>(`/api/padres/${padreId}/hijos/${hijoId}/tareas${q}`);
  },

  obtenerMedallasHijo(padreId: string, hijoId: string): Promise<MedallasHijo> {
    return get<MedallasHijo>(`/api/padres/${padreId}/hijos/${hijoId}/medallas`);
  },

  obtenerAvisosPadre(padreId: string, opts?: { tipo?: string; soloNoLeidos?: boolean }): Promise<Aviso[]> {
    const params = new URLSearchParams();
    if (opts?.tipo) params.set('tipo', opts.tipo);
    if (opts?.soloNoLeidos) params.set('soloNoLeidos', 'true');
    const q = params.toString() ? `?${params.toString()}` : '';
    return get<Aviso[]>(`/api/padres/${padreId}/avisos${q}`);
  },

  marcarAvisoLeido(padreId: string, avisoId: string): Promise<any> {
    return post(`/api/padres/${padreId}/avisos/${avisoId}/leer`);
  },

  firmarAviso(padreId: string, avisoId: string): Promise<any> {
    return post(`/api/padres/${padreId}/avisos/${avisoId}/firmar`);
  },

  obtenerConversaciones(padreId: string): Promise<Conversacion[]> {
    return get<Conversacion[]>(`/api/padres/${padreId}/conversaciones`);
  },

  obtenerConversacion(padreId: string, conversacionId: string): Promise<ConversacionDetalle> {
    return get<ConversacionDetalle>(`/api/padres/${padreId}/conversaciones/${conversacionId}`);
  },

  enviarMensajePadre(padreId: string, conversacionId: string, cuerpo: string): Promise<Mensaje> {
    return post<Mensaje>(`/api/padres/${padreId}/conversaciones/${conversacionId}/mensajes`, { cuerpo });
  },

  iniciarConversacion(
    padreId: string,
    data: { maestroId: string; hijoId: string; asunto: string; seccionId?: string; mensajeInicial?: string }
  ): Promise<ConversacionDetalle> {
    return post<ConversacionDetalle>(`/api/padres/${padreId}/conversaciones`, data);
  },

  obtenerNotificaciones(padreId: string, soloNoLeidos?: boolean): Promise<Notificacion[]> {
    const q = soloNoLeidos ? '?soloNoLeidos=true' : '';
    return get<Notificacion[]>(`/api/padres/${padreId}/notificaciones${q}`);
  },

  marcarNotificacionLeida(padreId: string, notificacionId: string): Promise<any> {
    return post(`/api/padres/${padreId}/notificaciones/${notificacionId}/leer`);
  },

  marcarTodasNotificacionesLeidas(padreId: string): Promise<{ actualizadas: number }> {
    return post(`/api/padres/${padreId}/notificaciones/leer-todas`);
  },
};
