import { PrismaService } from '../prisma.service';
export declare class ProgresoService {
    private prisma;
    constructor(prisma: PrismaService);
    registrarProgreso(usuarioId: string, desafioId: string, opcionId: string): Promise<{
        esCorrecta: boolean;
        puntosGanados: number;
        monedasGanadas: number;
        gemasGanadas: number;
        medallaGanada: any;
        progresoActual: {
            id: string;
            usuarioId: string;
            desafioId: string;
            completado: boolean;
            intentos: number;
            puntosGanados: number;
            fecha: Date;
        };
    }>;
    obtenerMedallasDeUsuario(usuarioId: string): Promise<({
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
    })[]>;
}
