import { PrismaService } from '../prisma.service';
export declare class DesafiosService {
    private prisma;
    constructor(prisma: PrismaService);
    getAsignaturas(): Promise<({
        _count: {
            modulos: number;
        };
    } & {
        id: string;
        nombre: string;
        descripcion: string | null;
        maestroId: string | null;
    })[]>;
    getModulos(asignaturaId: string): Promise<({
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
    getDesafios(moduloId: string): Promise<({
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
    verificarRespuesta(desafioId: string, opcionId: string): Promise<{
        esCorrecta: boolean;
        mensaje: string;
    }>;
    crearAsignatura(nombre: string, descripcion: string | null, maestroId: string): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
        maestroId: string | null;
    }>;
    actualizarAsignatura(id: string, data: {
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
    crearModulo(asignaturaId: string, titulo: string, nivelMinimo?: number, descripcion?: string): Promise<{
        id: string;
        descripcion: string | null;
        asignaturaId: string;
        titulo: string;
        orden: number;
        nivelMinimo: number;
    }>;
    actualizarModulo(id: string, data: {
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
    crearDesafio(data: {
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
    seedDatabase(): Promise<{
        mensaje: string;
        asignaturas: number;
        modulos: number;
        desafios: number;
        medallas: number;
        maestroAsignado: string;
    }>;
    private buildCurriculumData;
    private buildMedallasData;
    private tituloMedallaPara;
}
