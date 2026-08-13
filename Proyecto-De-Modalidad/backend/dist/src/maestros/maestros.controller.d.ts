import { MaestrosService } from './maestros.service';
export declare class MaestrosController {
    private readonly maestrosService;
    constructor(maestrosService: MaestrosService);
    crearSeccion(body: {
        nombre: string;
        grado?: number;
        maestroId: string;
        asignaturaId?: string;
        anioEscolar?: number;
    }): Promise<{
        _count: {
            tareas: number;
            inscripciones: number;
        };
    } & {
        id: string;
        nombre: string;
        createdAt: Date;
        maestroId: string;
        asignaturaId: string | null;
        grado: number;
        anioEscolar: number;
        activa: boolean;
    }>;
    obtenerSeccionesDeMaestro(maestroId: string): Promise<({
        asignatura: {
            id: string;
            nombre: string;
        };
        _count: {
            tareas: number;
            inscripciones: number;
        };
    } & {
        id: string;
        nombre: string;
        createdAt: Date;
        maestroId: string;
        asignaturaId: string | null;
        grado: number;
        anioEscolar: number;
        activa: boolean;
    })[]>;
    obtenerSeccion(id: string): Promise<{
        asignatura: {
            id: string;
            nombre: string;
            descripcion: string | null;
            maestroId: string | null;
        };
        _count: {
            tareas: number;
            inscripciones: number;
        };
    } & {
        id: string;
        nombre: string;
        createdAt: Date;
        maestroId: string;
        asignaturaId: string | null;
        grado: number;
        anioEscolar: number;
        activa: boolean;
    }>;
    actualizarSeccion(id: string, body: {
        nombre?: string;
        grado?: number;
        activa?: boolean;
        asignaturaId?: string | null;
    }): Promise<{
        _count: {
            tareas: number;
            inscripciones: number;
        };
    } & {
        id: string;
        nombre: string;
        createdAt: Date;
        maestroId: string;
        asignaturaId: string | null;
        grado: number;
        anioEscolar: number;
        activa: boolean;
    }>;
    eliminarSeccion(id: string): Promise<{
        id: string;
        nombre: string;
        createdAt: Date;
        maestroId: string;
        asignaturaId: string | null;
        grado: number;
        anioEscolar: number;
        activa: boolean;
    }>;
    inscribirEstudiante(id: string, body: {
        estudianteId: string;
    }): Promise<{
        mensaje: string;
        inscripcion: {
            id: string;
            createdAt: Date;
            activa: boolean;
            seccionId: string;
            estudianteId: string;
        };
    }>;
    desinscribirEstudiante(id: string, estudianteId: string): Promise<{
        mensaje: string;
    }>;
    obtenerEstudiantesDeSeccion(id: string): Promise<{
        id: string;
        nombre: string;
        puntos: number;
        experiencia: number;
        monedas: number;
        gemas: number;
    }[]>;
    crearTarea(body: {
        seccionId: string;
        desafioId: string;
        titulo: string;
        descripcion?: string;
        fechaLimite: string;
    }): Promise<{
        desafio: {
            id: string;
            puntos: number;
            pregunta: string;
        };
        seccion: {
            id: string;
            nombre: string;
        };
        _count: {
            entregas: number;
            calificaciones: number;
        };
    } & {
        id: string;
        createdAt: Date;
        descripcion: string | null;
        desafioId: string;
        titulo: string;
        seccionId: string;
        fechaAsignada: Date;
        fechaLimite: Date;
        estado: string;
    }>;
    obtenerTareasDeSeccion(seccionId: string): Promise<({
        desafio: {
            id: string;
            puntos: number;
            pregunta: string;
        };
        _count: {
            entregas: number;
            calificaciones: number;
        };
    } & {
        id: string;
        createdAt: Date;
        descripcion: string | null;
        desafioId: string;
        titulo: string;
        seccionId: string;
        fechaAsignada: Date;
        fechaLimite: Date;
        estado: string;
    })[]>;
    obtenerTarea(id: string): Promise<{
        desafio: {
            opciones: {
                id: string;
                desafioId: string;
                texto: string;
                esCorrecta: boolean;
            }[];
        } & {
            id: string;
            puntos: number;
            orden: number;
            moduloId: string;
            tipo: string;
            pregunta: string;
            recursoUrl: string | null;
        };
        seccion: {
            id: string;
            nombre: string;
            createdAt: Date;
            maestroId: string;
            asignaturaId: string | null;
            grado: number;
            anioEscolar: number;
            activa: boolean;
        };
        entregas: ({
            estudiante: {
                id: string;
                nombre: string;
            };
        } & {
            id: string;
            puntosGanados: number;
            estudianteId: string;
            tareaId: string;
            opcionId: string | null;
            correcta: boolean | null;
            entregadaEn: Date;
            tarde: boolean;
        })[];
        calificaciones: ({
            estudiante: {
                id: string;
                nombre: string;
            };
        } & {
            id: string;
            maestroId: string;
            estudianteId: string;
            tareaId: string;
            nota: number;
            comentario: string | null;
            calificadaEn: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        descripcion: string | null;
        desafioId: string;
        titulo: string;
        seccionId: string;
        fechaAsignada: Date;
        fechaLimite: Date;
        estado: string;
    }>;
    actualizarTarea(id: string, body: {
        titulo?: string;
        descripcion?: string | null;
        fechaLimite?: string;
        estado?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        descripcion: string | null;
        desafioId: string;
        titulo: string;
        seccionId: string;
        fechaAsignada: Date;
        fechaLimite: Date;
        estado: string;
    }>;
    cerrarTarea(id: string): Promise<{
        id: string;
        createdAt: Date;
        descripcion: string | null;
        desafioId: string;
        titulo: string;
        seccionId: string;
        fechaAsignada: Date;
        fechaLimite: Date;
        estado: string;
    }>;
    eliminarTarea(id: string): Promise<{
        id: string;
        createdAt: Date;
        descripcion: string | null;
        desafioId: string;
        titulo: string;
        seccionId: string;
        fechaAsignada: Date;
        fechaLimite: Date;
        estado: string;
    }>;
    registrarCalificacion(body: {
        tareaId: string;
        estudianteId: string;
        nota: number;
        comentario?: string;
        maestroId: string;
    }): Promise<{
        id: string;
        maestroId: string;
        estudianteId: string;
        tareaId: string;
        nota: number;
        comentario: string | null;
        calificadaEn: Date;
    }>;
    obtenerCalificacionesDeTarea(tareaId: string): Promise<({
        estudiante: {
            id: string;
            nombre: string;
        };
    } & {
        id: string;
        maestroId: string;
        estudianteId: string;
        tareaId: string;
        nota: number;
        comentario: string | null;
        calificadaEn: Date;
    })[]>;
    obtenerCalificacionesDeEstudiante(estudianteId: string): Promise<({
        tarea: {
            seccion: {
                nombre: string;
            };
            id: string;
            titulo: string;
        };
    } & {
        id: string;
        maestroId: string;
        estudianteId: string;
        tareaId: string;
        nota: number;
        comentario: string | null;
        calificadaEn: Date;
    })[]>;
    registrarAsistencia(body: {
        registros: {
            seccionId: string;
            estudianteId: string;
            fecha: string;
            estado: string;
            observacion?: string;
        }[];
    }): Promise<{
        mensaje: string;
        registros: any[];
    }>;
    obtenerAsistenciaDeSeccion(seccionId: string, fecha?: string): Promise<({
        estudiante: {
            id: string;
            nombre: string;
        };
    } & {
        id: string;
        createdAt: Date;
        fecha: Date;
        seccionId: string;
        estudianteId: string;
        estado: string;
        observacion: string | null;
    })[]>;
    obtenerAsistenciaDeEstudiante(estudianteId: string): Promise<{
        registros: {
            id: string;
            createdAt: Date;
            fecha: Date;
            seccionId: string;
            estudianteId: string;
            estado: string;
            observacion: string | null;
        }[];
        resumen: {
            total: number;
            presentes: number;
            tardanzas: number;
            ausentes: number;
            justificados: number;
            porcentaje: number;
        };
    }>;
    actualizarAsistencia(id: string, body: {
        estado?: string;
        observacion?: string | null;
    }): Promise<{
        id: string;
        createdAt: Date;
        fecha: Date;
        seccionId: string;
        estudianteId: string;
        estado: string;
        observacion: string | null;
    }>;
    resumenSeccion(seccionId: string): Promise<{
        seccion: {
            id: string;
            nombre: string;
            grado: number;
            asignatura: {
                id: string;
                nombre: string;
            };
        };
        totalEstudiantes: number;
        totalTareas: number;
        tareasActivas: number;
        promedioProgreso: number;
        promedioNotas: number;
        porcentajeAsistencia: number;
        estudiantes: {
            id: string;
            nombre: string;
            puntos: number;
            nivel: number;
        }[];
    }>;
    reporteEstudiante(estudianteId: string): Promise<{
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
            modulos: {
                id: string;
                titulo: string;
                totalDesafios: number;
                completados: number;
                porcentaje: number;
            }[];
        }[];
        calificaciones: {
            id: string;
            nota: number;
            comentario: string;
            fecha: Date;
            tarea: string;
            seccion: string;
        }[];
        promedioNotas: number;
        entregas: {
            id: string;
            correcta: boolean;
            puntosGanados: number;
            tarde: boolean;
            fecha: Date;
            tarea: string;
        }[];
        asistencia: {
            total: number;
            presentes: number;
            tardanzas: number;
            ausentes: number;
            justificados: number;
            porcentaje: number;
            registros: {
                id: string;
                createdAt: Date;
                fecha: Date;
                seccionId: string;
                estudianteId: string;
                estado: string;
                observacion: string | null;
            }[];
        };
        medallas: {
            id: string;
            titulo: string;
            descripcion: string;
            iconoUrl: string;
            ganadaEn: Date;
        }[];
        resumen: {
            porcentajeGlobal: number;
            estadoAvance: string;
            totalDesafios: number;
            completados: number;
        };
    }>;
    alertasMaestro(maestroId: string): Promise<{
        tareasPorCalificar: number;
        asistenciasPendientesHoy: number;
        entregasTardias: number;
        totalAlertas: number;
    }>;
    seedDemo(maestroId: string): Promise<{
        mensaje: string;
        seccion: {
            id: string;
            nombre: string;
        };
        estudiantesInscritos: number;
    }>;
}
