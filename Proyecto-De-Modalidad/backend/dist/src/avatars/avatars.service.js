"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const ITEMS_CATALOGO = [
    { categoria: 'CUERPO', clave: 'cuerpo-claro', nombre: 'Piel Clara', descripcion: 'Tono de piel claro', precioMonedas: 0, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'CUERPO', clave: 'cuerpo-medio', nombre: 'Piel Media', descripcion: 'Tono de piel medio', precioMonedas: 15, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'CUERPO', clave: 'cuerpo-oscuro', nombre: 'Piel Oscura', descripcion: 'Tono de piel oscuro', precioMonedas: 15, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'CUERPO', clave: 'cuerpo-verde', nombre: 'Alien', descripcion: '¡De otro planeta!', precioMonedas: 30, precioGemas: 0, raridad: 'RARA', nivelRequerido: 1 },
    { categoria: 'OJOS', clave: 'ojos-normales', nombre: 'Normales', descripcion: 'Ojos básicos redondos', precioMonedas: 0, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'OJOS', clave: 'ojos-felices', nombre: 'Felices', descripcion: 'Ojos cerrados de felicidad', precioMonedas: 15, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'OJOS', clave: 'ojos-grandes', nombre: 'Grandes', descripcion: 'Ojos estilo anime', precioMonedas: 20, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'OJOS', clave: 'ojos-corazon', nombre: 'Corazón', descripcion: 'Ojos en forma de corazón', precioMonedas: 30, precioGemas: 0, raridad: 'RARA', nivelRequerido: 2 },
    { categoria: 'OJOS', clave: 'ojos-estrella', nombre: 'Estrella', descripcion: 'Ojos con brillo de estrella', precioMonedas: 0, precioGemas: 2, raridad: 'EPICA', nivelRequerido: 3 },
    { categoria: 'OJOS', clave: 'ojos-cerrados', nombre: 'Relajados', descripcion: 'Ojos cerrados suaves', precioMonedas: 10, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'BOCA', clave: 'boca-sonrisa', nombre: 'Sonrisa', descripcion: 'Una sonrisa suave', precioMonedas: 0, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'BOCA', clave: 'boca-gran-sonrisa', nombre: 'Gran Sonrisa', descripcion: 'Sonrisa abierta con dientes', precioMonedas: 15, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'BOCA', clave: 'boca-lengua', nombre: 'Travieso', descripcion: 'Sonrisa con lengua afuera', precioMonedas: 20, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'BOCA', clave: 'boca-serio', nombre: 'Serio', descripcion: 'Boca recta y seria', precioMonedas: 10, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'CABELLO', clave: 'cabello-nada', nombre: 'Sin pelo', descripcion: 'Cabeza sin cabello', precioMonedas: 0, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'CABELLO', clave: 'cabello-corto', nombre: 'Corto', descripcion: 'Cabello corto con brillo', precioMonedas: 20, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'CABELLO', clave: 'cabello-largo', nombre: 'Largo', descripcion: 'Cabello largo que cae', precioMonedas: 25, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'CABELLO', clave: 'cabello-mohawk', nombre: 'Mohawk', descripcion: 'Cresta de colores fuego', precioMonedas: 35, precioGemas: 0, raridad: 'RARA', nivelRequerido: 2 },
    { categoria: 'CABELLO', clave: 'cabello-corona', nombre: 'Corona', descripcion: 'Corona dorada con joyas', precioMonedas: 0, precioGemas: 3, raridad: 'LEGENDARIA', nivelRequerido: 4 },
    { categoria: 'CABELLO', clave: 'cabello-gorro-graduacion', nombre: 'Gorro de Graduación', descripcion: '¡Graduado con honores!', precioMonedas: 0, precioGemas: 5, raridad: 'LEGENDARIA', nivelRequerido: 5 },
    { categoria: 'ROPA', clave: 'ropa-basica', nombre: 'Básica', descripcion: 'Camiseta turquesa', precioMonedas: 0, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'ROPA', clave: 'ropa-uniforme', nombre: 'Uniforme', descripcion: 'Uniforme escolar con corbata', precioMonedas: 25, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'ROPA', clave: 'ropa-capucha', nombre: 'Capucha', descripcion: 'Sudadera con capucha', precioMonedas: 30, precioGemas: 0, raridad: 'RARA', nivelRequerido: 1 },
    { categoria: 'ROPA', clave: 'ropa-capas', nombre: 'Capa de Héroe', descripcion: 'Traje de superhéroe con capa', precioMonedas: 0, precioGemas: 2, raridad: 'EPICA', nivelRequerido: 3 },
    { categoria: 'ROPA', clave: 'ropa-arcoiris', nombre: 'Arcoíris', descripcion: 'Camiseta mágica arcoíris', precioMonedas: 0, precioGemas: 4, raridad: 'LEGENDARIA', nivelRequerido: 4 },
    { categoria: 'ACCESORIO', clave: 'accesorio-nada', nombre: 'Ninguno', descripcion: 'Sin accesorios', precioMonedas: 0, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'ACCESORIO', clave: 'accesorio-gafas', nombre: 'Gafas', descripcion: 'Gafas redondas transparentes', precioMonedas: 20, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
    { categoria: 'ACCESORIO', clave: 'accesorio-gafas-sol', nombre: 'Gafas de Sol', descripcion: 'Gafas oscuras estilo cool', precioMonedas: 30, precioGemas: 0, raridad: 'RARA', nivelRequerido: 2 },
    { categoria: 'ACCESORIO', clave: 'accesorio-varita', nombre: 'Varita Mágica', descripcion: 'Varita con estrella brillante', precioMonedas: 0, precioGemas: 2, raridad: 'EPICA', nivelRequerido: 3 },
    { categoria: 'ACCESORIO', clave: 'accesorio-estrella', nombre: 'Estrella Compañera', descripcion: 'Una estrella amiga que te acompaña', precioMonedas: 25, precioGemas: 0, raridad: 'RARA', nivelRequerido: 1 },
    { categoria: 'ACCESORIO', clave: 'accesorio-mascara', nombre: 'Máscara de Héroe', descripcion: 'Máscara de superhéroe', precioMonedas: 35, precioGemas: 0, raridad: 'EPICA', nivelRequerido: 2 },
];
const CATEGORIA_A_CAMPO = {
    CUERPO: 'cuerpo',
    OJOS: 'ojos',
    BOCA: 'boca',
    CABELLO: 'cabello',
    ROPA: 'ropa',
    ACCESORIO: 'accesorio',
};
const NOMBRES_DEMO = ['DemoKid', 'PadreDemo', 'MaestroDemo'];
function esUsuarioDemo(nombre) {
    return !!nombre && NOMBRES_DEMO.includes(nombre);
}
let AvatarsService = class AvatarsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTienda() {
        return this.prisma.itemTienda.findMany({
            orderBy: [{ categoria: 'asc' }, { precioMonedas: 'asc' }],
        });
    }
    async seedTienda() {
        await this.prisma.usuarioItem.deleteMany();
        await this.prisma.itemTienda.deleteMany();
        for (const item of ITEMS_CATALOGO) {
            await this.prisma.itemTienda.upsert({
                where: { clave: item.clave },
                update: {},
                create: item,
            });
        }
        return {
            mensaje: 'Catálogo de la tienda inicializado correctamente',
            total: ITEMS_CATALOGO.length,
        };
    }
    async getMiAvatar(usuarioId) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id: usuarioId },
        });
        if (!usuario)
            throw new common_1.NotFoundException('Usuario no encontrado');
        let avatarConfig = await this.prisma.avatarConfig.findUnique({
            where: { usuarioId },
        });
        if (!avatarConfig) {
            avatarConfig = await this.prisma.avatarConfig.create({
                data: { usuarioId },
            });
        }
        const itemsOwned = await this.prisma.usuarioItem.findMany({
            where: { usuarioId },
            select: { itemId: true },
        });
        const nivel = Math.floor(usuario.experiencia / 100) + 1;
        return {
            config: avatarConfig,
            itemsOwned: itemsOwned.map((i) => i.itemId),
            monedas: usuario.monedas,
            gemas: usuario.gemas,
            nivel,
            experiencia: usuario.experiencia,
        };
    }
    async comprar(usuarioId, itemId) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id: usuarioId },
        });
        if (!usuario)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const item = await this.prisma.itemTienda.findUnique({
            where: { id: itemId },
        });
        if (!item)
            throw new common_1.NotFoundException('Artículo no encontrado');
        const yaPosee = await this.prisma.usuarioItem.findUnique({
            where: { usuarioId_itemId: { usuarioId, itemId } },
        });
        if (yaPosee) {
            throw new common_1.BadRequestException('Ya posees este artículo');
        }
        if (esUsuarioDemo(usuario.nombre)) {
            await this.prisma.usuarioItem.create({
                data: { usuarioId, itemId },
            });
            return {
                mensaje: `¡${item.nombre} desbloqueado! (Modo Demo)`,
                monedas: usuario.monedas,
                gemas: usuario.gemas,
            };
        }
        const nivelUsuario = Math.floor(usuario.experiencia / 100) + 1;
        if (nivelUsuario < item.nivelRequerido) {
            throw new common_1.BadRequestException(`Necesitas nivel ${item.nivelRequerido} para comprar este artículo`);
        }
        let nuevasMonedas = usuario.monedas;
        let nuevasGemas = usuario.gemas;
        if (item.precioGemas > 0) {
            if (usuario.gemas < item.precioGemas) {
                throw new common_1.BadRequestException('No tienes suficientes gemas');
            }
            nuevasGemas = usuario.gemas - item.precioGemas;
        }
        else if (item.precioMonedas > 0) {
            if (usuario.monedas < item.precioMonedas) {
                throw new common_1.BadRequestException('No tienes suficientes monedas');
            }
            nuevasMonedas = usuario.monedas - item.precioMonedas;
        }
        await this.prisma.$transaction([
            this.prisma.usuario.update({
                where: { id: usuarioId },
                data: { monedas: nuevasMonedas, gemas: nuevasGemas },
            }),
            this.prisma.usuarioItem.create({
                data: { usuarioId, itemId },
            }),
        ]);
        return {
            mensaje: `¡Compraste ${item.nombre}!`,
            monedas: nuevasMonedas,
            gemas: nuevasGemas,
        };
    }
    async equipar(usuarioId, itemId) {
        const item = await this.prisma.itemTienda.findUnique({
            where: { id: itemId },
        });
        if (!item)
            throw new common_1.NotFoundException('Artículo no encontrado');
        const esGratis = item.precioMonedas === 0 && item.precioGemas === 0;
        let esDemo = false;
        if (!esGratis) {
            const usuario = await this.prisma.usuario.findUnique({
                where: { id: usuarioId },
                select: { nombre: true },
            });
            esDemo = esUsuarioDemo(usuario?.nombre);
        }
        if (!esGratis && !esDemo) {
            const posee = await this.prisma.usuarioItem.findUnique({
                where: { usuarioId_itemId: { usuarioId, itemId } },
            });
            if (!posee) {
                throw new common_1.BadRequestException('No posees este artículo');
            }
        }
        const campo = CATEGORIA_A_CAMPO[item.categoria];
        if (!campo) {
            throw new common_1.BadRequestException(`Categoría inválida: ${item.categoria}`);
        }
        let avatarConfig = await this.prisma.avatarConfig.findUnique({
            where: { usuarioId },
        });
        if (!avatarConfig) {
            avatarConfig = await this.prisma.avatarConfig.create({
                data: { usuarioId },
            });
        }
        const actualizado = await this.prisma.avatarConfig.update({
            where: { usuarioId },
            data: { [campo]: item.clave },
        });
        return {
            mensaje: `Equipado: ${item.nombre}`,
            config: actualizado,
        };
    }
};
exports.AvatarsService = AvatarsService;
exports.AvatarsService = AvatarsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AvatarsService);
//# sourceMappingURL=avatars.service.js.map