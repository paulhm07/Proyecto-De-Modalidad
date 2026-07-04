import { PrismaService } from '../prisma.service';
export declare class AvatarsService {
    private prisma;
    constructor(prisma: PrismaService);
    getTienda(): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
        categoria: string;
        clave: string;
        precioMonedas: number;
        precioGemas: number;
        raridad: string;
        nivelRequerido: number;
    }[]>;
    seedTienda(): Promise<{
        mensaje: string;
        total: number;
    }>;
    getMiAvatar(usuarioId: string): Promise<{
        config: {
            updatedAt: Date;
            usuarioId: string;
            cuerpo: string;
            ojos: string;
            boca: string;
            cabello: string;
            ropa: string;
            accesorio: string;
        };
        itemsOwned: string[];
        monedas: number;
        gemas: number;
        nivel: number;
        experiencia: number;
    }>;
    comprar(usuarioId: string, itemId: string): Promise<{
        mensaje: string;
        monedas: number;
        gemas: number;
    }>;
    equipar(usuarioId: string, itemId: string): Promise<{
        mensaje: string;
        config: {
            updatedAt: Date;
            usuarioId: string;
            cuerpo: string;
            ojos: string;
            boca: string;
            cabello: string;
            ropa: string;
            accesorio: string;
        };
    }>;
}
