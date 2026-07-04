import { UsuariosService } from './usuarios.service';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    createUser(body: {
        nombre: string;
        pin: string;
        rol: string;
    }): Promise<{
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
    login(body: {
        nombre: string;
        pin: string;
        rol?: string;
    }): Promise<{
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
    loginDemo(body: {
        rol: string;
    }): Promise<{
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
    getPerfil(id: string): Promise<{
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
    getProgreso(id: string): Promise<{
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
    getHijosDePadre(id: string): Promise<{
        id: string;
        nombre: string;
        puntos: number;
        experiencia: number;
        monedas: number;
        gemas: number;
    }[]>;
    vincularHijo(id: string, body: {
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
    desvincularHijo(id: string, hijoId: string): Promise<{
        mensaje: string;
    }>;
    getEstudiantesParaMaestro(id: string): Promise<{
        id: string;
        nombre: string;
        puntos: number;
        desafiosCompletados: number;
        porcentajeGlobal: number;
    }[]>;
    getAsignaturasDeMaestro(id: string): Promise<({
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
