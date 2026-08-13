import type {
  AlertasMaestro,
  Asignatura,
  Calificacion,
  ComprarResponse,
  Desafio,
  EntregaTarea,
  EquiparResponse,
  EstadoAsistencia,
  ItemTienda,
  MedallaEstudiante,
  MiAvatarResponse,
  Modulo,
  RegistroAsistencia,
  ReporteEstudiante,
  ResumenSeccion,
  RespuestaProgreso,
  Rol,
  Seccion,
  Tarea,
  Usuario,
} from "./types";

const PORT = "XTransformPort=3001";

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const sep = path.includes("?") ? "&" : "?";
  const url = `${path}${sep}${PORT}`;
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
};
