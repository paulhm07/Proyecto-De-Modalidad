import { PrismaService } from '../prisma.service';
export declare class PadresService {
    private prisma;
    constructor(prisma: PrismaService);
    obtenerHijos(padreId: string): Promise<{
        parentesco: string;
        verificado: boolean;
        id: string;
        nombre: string;
        rol: string;
        avatar: string;
        puntos: number;
        experiencia: number;
        monedas: number;
        gemas: number;
    }[]>;
    solicitarVinculo(padreId: string, data: {
        nombre: string;
        pin: string;
        parentesco?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        padreId: string;
        hijoId: string;
        parentesco: string;
        verificado: boolean;
        solicitadoEn: Date;
        verificadoEn: Date | null;
        verificadoPor: string | null;
        activo: boolean;
    }>;
    vincularPorHijoId(padreId: string, hijoId: string, parentesco?: string): Promise<{
        id: string;
        createdAt: Date;
        padreId: string;
        hijoId: string;
        parentesco: string;
        verificado: boolean;
        solicitadoEn: Date;
        verificadoEn: Date | null;
        verificadoPor: string | null;
        activo: boolean;
    }>;
    desvincularHijo(padreId: string, hijoId: string): Promise<{
        id: string;
        createdAt: Date;
        padreId: string;
        hijoId: string;
        parentesco: string;
        verificado: boolean;
        solicitadoEn: Date;
        verificadoEn: Date | null;
        verificadoPor: string | null;
        activo: boolean;
    }>;
    verificarAccesoHijo(padreId: string, hijoId: string): Promise<{
        id: string;
        createdAt: Date;
        padreId: string;
        hijoId: string;
        parentesco: string;
        verificado: boolean;
        solicitadoEn: Date;
        verificadoEn: Date | null;
        verificadoPor: string | null;
        activo: boolean;
    }>;
    obtenerResumen(padreId: string, hijoId: string): Promise<{
        hijo: {
            id: string;
            nombre: string;
            avatar: string;
            puntos: number;
            experiencia: number;
            monedas: number;
            gemas: number;
        };
        nivel: number;
        secciones: {
            asignatura: {
                id: string;
                nombre: string;
            };
            id: string;
            nombre: string;
            maestro: {
                id: string;
                nombre: string;
            };
            grado: number;
        }[];
        kpis: {
            promedioNotas: number;
            porcentajeProgreso: number;
            porcentajeAsistencia: number;
        };
        tareasActivas: {
            entregada: boolean;
            entrega: {
                id: string;
                puntosGanados: number;
                correcta: boolean;
                entregadaEn: Date;
                tarde: boolean;
            };
            desafio: {
                id: string;
                puntos: number;
                pregunta: string;
            };
            seccion: {
                asignatura: {
                    nombre: string;
                };
                nombre: string;
            };
            entregas: {
                id: string;
                puntosGanados: number;
                correcta: boolean;
                entregadaEn: Date;
                tarde: boolean;
            }[];
            id: string;
            createdAt: Date;
            descripcion: string | null;
            desafioId: string;
            titulo: string;
            seccionId: string;
            fechaAsignada: Date;
            fechaLimite: Date;
            estado: string;
        }[];
        calificacionesRecientes: ({
            tarea: {
                seccion: {
                    asignatura: {
                        nombre: string;
                    };
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
        })[];
        medallas: ({
            medalla: {
                id: string;
                descripcion: string;
                titulo: string;
                iconoUrl: string;
            };
        } & {
            id: string;
            usuarioId: string;
            medallaId: string;
            ganadaEn: Date;
        })[];
        avisosNoLeidos: ({
            seccion: {
                nombre: string;
            };
            maestro: {
                nombre: string;
            };
        } & {
            id: string;
            activo: boolean;
            maestroId: string;
            titulo: string;
            tipo: string;
            seccionId: string;
            contenido: string;
            prioridad: number;
            fechaEnvio: Date;
            fechaEvento: Date | null;
            requiereFirma: boolean;
        })[];
    }>;
    obtenerCalificaciones(padreId: string, hijoId: string, opts?: {
        asignaturaId?: string;
        desde?: string;
        hasta?: string;
    }): Promise<{
        calificaciones: ({
            tarea: {
                seccion: {
                    asignatura: {
                        id: string;
                        nombre: string;
                    };
                    id: string;
                    nombre: string;
                };
                id: string;
                titulo: string;
                fechaLimite: Date;
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
        promedioGeneral: number;
        resumenPorAsignatura: {
            asignaturaId: string;
            nombre: string;
            promedio: number;
            cantidad: number;
        }[];
        total: number;
    }>;
    obtenerAsistencia(padreId: string, hijoId: string, opts?: {
        mes?: number;
        anio?: number;
    }): Promise<{
        mes: number;
        anio: number;
        registros: ({
            seccion: {
                asignatura: {
                    nombre: string;
                };
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
        })[];
        conteo: Record<string, number>;
        total: number;
        porcentaje: number;
    }>;
    obtenerAvisos(padreId: string, opts?: {
        tipo?: string;
        soloNoLeidos?: boolean;
    }): Promise<{
        leido: boolean;
        firmado: boolean;
        hijosDestinatarios: string[];
        seccion: {
            asignatura: {
                nombre: string;
            };
            id: string;
            nombre: string;
            inscripciones: {
                estudianteId: string;
            }[];
        };
        maestro: {
            id: string;
            nombre: string;
        };
        lecturas: {
            id: string;
            padreId: string;
            avisoId: string;
            leidoEn: Date;
            firmado: boolean;
            firmaEn: Date | null;
        }[];
        id: string;
        activo: boolean;
        maestroId: string;
        titulo: string;
        tipo: string;
        seccionId: string;
        contenido: string;
        prioridad: number;
        fechaEnvio: Date;
        fechaEvento: Date | null;
        requiereFirma: boolean;
    }[]>;
    marcarAvisoLeido(padreId: string, avisoId: string): Promise<{
        id: string;
        padreId: string;
        avisoId: string;
        leidoEn: Date;
        firmado: boolean;
        firmaEn: Date | null;
    }>;
    firmarAviso(padreId: string, avisoId: string): Promise<{
        id: string;
        padreId: string;
        avisoId: string;
        leidoEn: Date;
        firmado: boolean;
        firmaEn: Date | null;
    }>;
    obtenerConversaciones(padreId: string): Promise<{
        noLeidos: number;
        seccion: {
            asignatura: {
                nombre: string;
            };
            id: string;
            nombre: string;
        };
        hijo: {
            id: string;
            nombre: string;
        };
        maestro: {
            id: string;
            nombre: string;
            avatar: string;
        };
        mensajes: {
            cuerpo: string;
            leidoEn: Date;
            enviadoEn: Date;
            remitenteId: string;
        }[];
        id: string;
        padreId: string;
        hijoId: string;
        maestroId: string;
        seccionId: string | null;
        asunto: string;
        ultimaActividad: Date;
    }[]>;
    obtenerConversacion(padreId: string, conversacionId: string): Promise<{
        mensajes: ({
            remitente: {
                id: string;
                nombre: string;
                avatar: string;
            };
        } & {
            id: string;
            cuerpo: string;
            leidoEn: Date | null;
            enviadoEn: Date;
            conversacionId: string;
            remitenteId: string;
        })[];
        seccion: {
            asignatura: {
                nombre: string;
            };
            id: string;
            nombre: string;
        };
        hijo: {
            id: string;
            nombre: string;
        };
        maestro: {
            id: string;
            nombre: string;
            avatar: string;
        };
        id: string;
        padreId: string;
        hijoId: string;
        maestroId: string;
        seccionId: string | null;
        asunto: string;
        ultimaActividad: Date;
    }>;
    enviarMensaje(padreId: string, conversacionId: string, cuerpo: string): Promise<{
        remitente: {
            id: string;
            nombre: string;
            avatar: string;
        };
    } & {
        id: string;
        cuerpo: string;
        leidoEn: Date | null;
        enviadoEn: Date;
        conversacionId: string;
        remitenteId: string;
    }>;
    iniciarConversacion(padreId: string, data: {
        maestroId: string;
        hijoId: string;
        asunto: string;
        seccionId?: string;
        mensajeInicial?: string;
    }): Promise<{
        mensajes: ({
            remitente: {
                id: string;
                nombre: string;
                avatar: string;
            };
        } & {
            id: string;
            cuerpo: string;
            leidoEn: Date | null;
            enviadoEn: Date;
            conversacionId: string;
            remitenteId: string;
        })[];
        seccion: {
            asignatura: {
                nombre: string;
            };
            id: string;
            nombre: string;
        };
        hijo: {
            id: string;
            nombre: string;
        };
        maestro: {
            id: string;
            nombre: string;
            avatar: string;
        };
        id: string;
        padreId: string;
        hijoId: string;
        maestroId: string;
        seccionId: string | null;
        asunto: string;
        ultimaActividad: Date;
    }>;
    obtenerNotificaciones(padreId: string, opts?: {
        soloNoLeidos?: boolean;
    }): Promise<{
        id: string;
        data: string | null;
        usuarioId: string;
        cuerpo: string;
        titulo: string;
        tipo: string;
        leida: boolean;
        enviadaPush: boolean;
        creadaEn: Date;
    }[]>;
    marcarNotificacionLeida(padreId: string, notificacionId: string): Promise<{
        id: string;
        data: string | null;
        usuarioId: string;
        cuerpo: string;
        titulo: string;
        tipo: string;
        leida: boolean;
        enviadaPush: boolean;
        creadaEn: Date;
    }>;
    marcarTodasLeidas(padreId: string): Promise<{
        actualizadas: number;
    }>;
    suscribirPush(padreId: string, data: {
        endpoint: string;
        p256dh: string;
        auth: string;
        dispositivo?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        usuarioId: string;
        activa: boolean;
        endpoint: string;
        p256dh: string;
        auth: string;
        dispositivo: string | null;
    }>;
    desuscribirPush(padreId: string, endpoint: string): Promise<{
        id: string;
        createdAt: Date;
        usuarioId: string;
        activa: boolean;
        endpoint: string;
        p256dh: string;
        auth: string;
        dispositivo: string | null;
    } | {
        ok: boolean;
    }>;
    obtenerTareasHijo(padreId: string, hijoId: string, opts?: {
        estado?: string;
    }): Promise<({
        desafio: {
            id: string;
            puntos: number;
            pregunta: string;
        };
        seccion: {
            asignatura: {
                id: string;
                nombre: string;
            };
            id: string;
            nombre: string;
        };
        entregas: {
            id: string;
            puntosGanados: number;
            correcta: boolean;
            entregadaEn: Date;
            tarde: boolean;
        }[];
        calificaciones: {
            nota: number;
            comentario: string;
            calificadaEn: Date;
        }[];
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
    obtenerMedallasHijo(padreId: string, hijoId: string): Promise<{
        ganadas: ({
            medalla: {
                id: string;
                descripcion: string;
                titulo: string;
                iconoUrl: string;
                criterio: string;
            };
        } & {
            id: string;
            usuarioId: string;
            medallaId: string;
            ganadaEn: Date;
        })[];
        bloqueadas: {
            id: string;
            descripcion: string;
            titulo: string;
            iconoUrl: string;
            criterio: string;
        }[];
        total: number;
        desbloqueadas: number;
    }>;
    seedPadreDemo(padreId: string): Promise<{
        ok: boolean;
        mensaje: string;
    }>;
}
