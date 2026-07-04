import { AvatarsService } from './avatars.service';
export declare class AvatarsController {
    private readonly avatarsService;
    constructor(avatarsService: AvatarsService);
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
    comprar(usuarioId: string, body: {
        itemId: string;
    }): Promise<{
        mensaje: string;
        monedas: number;
        gemas: number;
    }>;
    equipar(usuarioId: string, body: {
        itemId: string;
    }): Promise<{
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
