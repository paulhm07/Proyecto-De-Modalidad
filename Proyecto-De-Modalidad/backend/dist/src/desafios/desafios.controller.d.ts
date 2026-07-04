import { DesafiosService } from './desafios.service';
export declare class DesafiosController {
    private readonly desafiosService;
    constructor(desafiosService: DesafiosService);
    obtenerAsignaturas(): Promise<({
        _count: {
            modulos: number;
        };
    } & {
        id: string;
        nombre: string;
        descripcion: string | null;
        maestroId: string | null;
    })[]>;
    obtenerModulos(asignaturaId: string): Promise<({
        _count: {
            desafios: number;
        };
    } & {
        id: string;
        descripcion: string | null;
        asignaturaId: string;
        titulo: string;
        orden: number;
        nivelMinimo: number;
    })[]>;
    obtenerDesafios(moduloId: string): Promise<({
        opciones: {
            id: string;
            texto: string;
        }[];
    } & {
        id: string;
        puntos: number;
        orden: number;
        moduloId: string;
        tipo: string;
        pregunta: string;
        recursoUrl: string | null;
    })[]>;
    verificarRespuesta(body: {
        desafioId: string;
        opcionId: string;
    }): Promise<{
        esCorrecta: boolean;
        mensaje: string;
    }>;
    inicializarDatos(): Promise<{
        mensaje: string;
        asignaturas: number;
        modulos: number;
        desafios: number;
        medallas: number;
        maestroAsignado: string;
    }>;
    crearAsignatura(body: {
        nombre: string;
        descripcion?: string;
        maestroId: string;
    }): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
        maestroId: string | null;
    }>;
    actualizarAsignatura(id: string, body: {
        nombre?: string;
        descripcion?: string | null;
    }): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
        maestroId: string | null;
    }>;
    eliminarAsignatura(id: string): Promise<{
        mensaje: string;
    }>;
    crearModulo(body: {
        asignaturaId: string;
        titulo: string;
        nivelMinimo?: number;
        descripcion?: string;
    }): Promise<{
        id: string;
        descripcion: string | null;
        asignaturaId: string;
        titulo: string;
        orden: number;
        nivelMinimo: number;
    }>;
    actualizarModulo(id: string, body: {
        titulo?: string;
        descripcion?: string | null;
        nivelMinimo?: number;
    }): Promise<{
        id: string;
        descripcion: string | null;
        asignaturaId: string;
        titulo: string;
        orden: number;
        nivelMinimo: number;
    }>;
    eliminarModulo(id: string): Promise<{
        mensaje: string;
    }>;
    crearDesafio(body: {
        moduloId: string;
        tipo: string;
        pregunta: string;
        puntos?: number;
        opciones: {
            texto: string;
            esCorrecta: boolean;
        }[];
    }): Promise<{
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
    }>;
    eliminarDesafio(id: string): Promise<{
        mensaje: string;
    }>;
}
