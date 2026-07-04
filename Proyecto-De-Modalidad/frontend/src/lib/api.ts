import type {
  Asignatura,
  ComprarResponse,
  Desafio,
  EquiparResponse,
  ItemTienda,
  MedallaEstudiante,
  MiAvatarResponse,
  Modulo,
  RespuestaProgreso,
  Rol,
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
};
