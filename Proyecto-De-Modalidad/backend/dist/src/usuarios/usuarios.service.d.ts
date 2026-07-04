import { PrismaService } from '../prisma.service';
export declare class UsuariosService {
    private prisma;
    constructor(prisma: PrismaService);
    createUser(nombre: string, pin: string, rol: string): Promise<{
        avatarConfig: {
            updatedAt: Date;
            usuarioId: string;
            cuerpo: string;
            ojos: string;
            boca: string;
            cabello: string;
            ropa: string;
            accesorio: string;
        };
    } & {
        id: string;
        nombre: string;
        correo: string | null;
        pin: string;
        rol: string;
        avatar: string;
        puntos: number;
        experiencia: number;
        monedas: number;
        gemas: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    validatePin(nombre: string, pin: string, rol?: string): Promise<{
        avatarConfig: {
            updatedAt: Date;
            usuarioId: string;
            cuerpo: string;
            ojos: string;
            boca: string;
            cabello: string;
            ropa: string;
            accesorio: string;
        };
    } & {
        id: string;
        nombre: string;
        correo: string | null;
        pin: string;
        rol: string;
        avatar: string;
        puntos: number;
        experiencia: number;
        monedas: number;
        gemas: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserProfile(id: string): Promise<{
        avatarConfig: {
            updatedAt: Date;
            usuarioId: string;
            cuerpo: string;
            ojos: string;
            boca: string;
            cabello: string;
            ropa: string;
            accesorio: string;
        };
    } & {
        id: string;
        nombre: string;
        correo: string | null;
        pin: string;
        rol: string;
        avatar: string;
        puntos: number;
        experiencia: number;
        monedas: number;
        gemas: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private readonly DEMO_CREDENCIALES;
    loginDemo(rol: string): Promise<{
        avatarConfig: {
            updatedAt: Date;
            usuarioId: string;
            cuerpo: string;
            ojos: string;
            boca: string;
            cabello: string;
            ropa: string;
            accesorio: string;
        };
    } & {
        id: string;
        nombre: string;
        correo: string | null;
        pin: string;
        rol: string;
        avatar: string;
        puntos: number;
        experiencia: number;
        monedas: number;
        gemas: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProgresoEstudiante(id: string): Promise<{
        usuario: {
            id: string;
            nombre: string;
            puntos: number;
            experiencia: number;
            monedas: number;
            gemas: number;
        };
        medallas: {
            id: string;
            titulo: string;
            descripcion: string;
            iconoUrl: string;
            ganadaEn: Date;
        }[];
        asignaturas: {
            id: string;
            nombre: string;
            descripcion: string;
            modulos: {
                id: string;
                titulo: string;
                totalDesafios: number;
                completados: number;
                puntosGanados: number;
                puntosTotales: number;
                porcentajeCompletado: number;
            }[];
            totalDesafios: number;
            completados: number;
            puntosGanados: number;
            puntosTotales: number;
            porcentajeCompletado: number;
        }[];
    }>;
    getRanking(): Promise<{
        id: string;
        nombre: string;
        puntos: number;
        experiencia: number;
    }[]>;
    getHijosDePadre(padreId: string): Promise<{
        id: string;
        nombre: string;
        puntos: number;
        experiencia: number;
        monedas: number;
        gemas: number;
    }[]>;
    vincularHijo(padreId: string, data: {
        hijoId?: string;
        nombre?: string;
        pin?: string;
    }): Promise<{
        mensaje: string;
        hijo: {
            id: any;
            nombre: any;
            puntos: any;
            experiencia: any;
        };
    }>;
    desvincularHijo(padreId: string, hijoId: string): Promise<{
        mensaje: string;
    }>;
    getEstudiantesParaMaestro(maestroId: string): Promise<{
        id: string;
        nombre: string;
        puntos: number;
        desafiosCompletados: number;
        porcentajeGlobal: number;
    }[]>;
    getAsignaturasDeMaestro(maestroId: string): Promise<({
        _count: {
            modulos: number;
        };
    } & {
        id: string;
        nombre: string;
        descripcion: string | null;
        maestroId: string | null;
    })[]>;
}
