import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

interface ItemSeed {
  categoria: string;
  clave: string;
  nombre: string;
  descripcion: string;
  precioMonedas: number;
  precioGemas: number;
  raridad: string;
  nivelRequerido: number;
}

const ITEMS_CATALOGO: ItemSeed[] = [
  // CUERPO
  { categoria: 'CUERPO', clave: 'cuerpo-claro', nombre: 'Piel Clara', descripcion: 'Tono de piel claro', precioMonedas: 0, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'CUERPO', clave: 'cuerpo-medio', nombre: 'Piel Media', descripcion: 'Tono de piel medio', precioMonedas: 15, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'CUERPO', clave: 'cuerpo-oscuro', nombre: 'Piel Oscura', descripcion: 'Tono de piel oscuro', precioMonedas: 15, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'CUERPO', clave: 'cuerpo-verde', nombre: 'Alien', descripcion: '¡De otro planeta!', precioMonedas: 30, precioGemas: 0, raridad: 'RARA', nivelRequerido: 1 },

  // OJOS
  { categoria: 'OJOS', clave: 'ojos-normales', nombre: 'Normales', descripcion: 'Ojos básicos redondos', precioMonedas: 0, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'OJOS', clave: 'ojos-felices', nombre: 'Felices', descripcion: 'Ojos cerrados de felicidad', precioMonedas: 15, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'OJOS', clave: 'ojos-grandes', nombre: 'Grandes', descripcion: 'Ojos estilo anime', precioMonedas: 20, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'OJOS', clave: 'ojos-corazon', nombre: 'Corazón', descripcion: 'Ojos en forma de corazón', precioMonedas: 30, precioGemas: 0, raridad: 'RARA', nivelRequerido: 2 },
  { categoria: 'OJOS', clave: 'ojos-estrella', nombre: 'Estrella', descripcion: 'Ojos con brillo de estrella', precioMonedas: 0, precioGemas: 2, raridad: 'EPICA', nivelRequerido: 3 },
  { categoria: 'OJOS', clave: 'ojos-cerrados', nombre: 'Relajados', descripcion: 'Ojos cerrados suaves', precioMonedas: 10, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },

  // BOCA
  { categoria: 'BOCA', clave: 'boca-sonrisa', nombre: 'Sonrisa', descripcion: 'Una sonrisa suave', precioMonedas: 0, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'BOCA', clave: 'boca-gran-sonrisa', nombre: 'Gran Sonrisa', descripcion: 'Sonrisa abierta con dientes', precioMonedas: 15, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'BOCA', clave: 'boca-lengua', nombre: 'Travieso', descripcion: 'Sonrisa con lengua afuera', precioMonedas: 20, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'BOCA', clave: 'boca-serio', nombre: 'Serio', descripcion: 'Boca recta y seria', precioMonedas: 10, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },

  // CABELLO
  { categoria: 'CABELLO', clave: 'cabello-nada', nombre: 'Sin pelo', descripcion: 'Cabeza sin cabello', precioMonedas: 0, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'CABELLO', clave: 'cabello-corto', nombre: 'Corto', descripcion: 'Cabello corto con brillo', precioMonedas: 20, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'CABELLO', clave: 'cabello-largo', nombre: 'Largo', descripcion: 'Cabello largo que cae', precioMonedas: 25, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'CABELLO', clave: 'cabello-mohawk', nombre: 'Mohawk', descripcion: 'Cresta de colores fuego', precioMonedas: 35, precioGemas: 0, raridad: 'RARA', nivelRequerido: 2 },
  { categoria: 'CABELLO', clave: 'cabello-corona', nombre: 'Corona', descripcion: 'Corona dorada con joyas', precioMonedas: 0, precioGemas: 3, raridad: 'LEGENDARIA', nivelRequerido: 4 },
  { categoria: 'CABELLO', clave: 'cabello-gorro-graduacion', nombre: 'Gorro de Graduación', descripcion: '¡Graduado con honores!', precioMonedas: 0, precioGemas: 5, raridad: 'LEGENDARIA', nivelRequerido: 5 },

  // ROPA
  { categoria: 'ROPA', clave: 'ropa-basica', nombre: 'Básica', descripcion: 'Camiseta turquesa', precioMonedas: 0, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'ROPA', clave: 'ropa-uniforme', nombre: 'Uniforme', descripcion: 'Uniforme escolar con corbata', precioMonedas: 25, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'ROPA', clave: 'ropa-capucha', nombre: 'Capucha', descripcion: 'Sudadera con capucha', precioMonedas: 30, precioGemas: 0, raridad: 'RARA', nivelRequerido: 1 },
  { categoria: 'ROPA', clave: 'ropa-capas', nombre: 'Capa de Héroe', descripcion: 'Traje de superhéroe con capa', precioMonedas: 0, precioGemas: 2, raridad: 'EPICA', nivelRequerido: 3 },
  { categoria: 'ROPA', clave: 'ropa-arcoiris', nombre: 'Arcoíris', descripcion: 'Camiseta mágica arcoíris', precioMonedas: 0, precioGemas: 4, raridad: 'LEGENDARIA', nivelRequerido: 4 },

  // ACCESORIO
  { categoria: 'ACCESORIO', clave: 'accesorio-nada', nombre: 'Ninguno', descripcion: 'Sin accesorios', precioMonedas: 0, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'ACCESORIO', clave: 'accesorio-gafas', nombre: 'Gafas', descripcion: 'Gafas redondas transparentes', precioMonedas: 20, precioGemas: 0, raridad: 'COMUN', nivelRequerido: 1 },
  { categoria: 'ACCESORIO', clave: 'accesorio-gafas-sol', nombre: 'Gafas de Sol', descripcion: 'Gafas oscuras estilo cool', precioMonedas: 30, precioGemas: 0, raridad: 'RARA', nivelRequerido: 2 },
  { categoria: 'ACCESORIO', clave: 'accesorio-varita', nombre: 'Varita Mágica', descripcion: 'Varita con estrella brillante', precioMonedas: 0, precioGemas: 2, raridad: 'EPICA', nivelRequerido: 3 },
  { categoria: 'ACCESORIO', clave: 'accesorio-estrella', nombre: 'Estrella Compañera', descripcion: 'Una estrella amiga que te acompaña', precioMonedas: 25, precioGemas: 0, raridad: 'RARA', nivelRequerido: 1 },
  { categoria: 'ACCESORIO', clave: 'accesorio-mascara', nombre: 'Máscara de Héroe', descripcion: 'Máscara de superhéroe', precioMonedas: 35, precioGemas: 0, raridad: 'EPICA', nivelRequerido: 2 },
];

const CATEGORIA_A_CAMPO: Record<string, string> = {
  CUERPO: 'cuerpo',
  OJOS: 'ojos',
  BOCA: 'boca',
  CABELLO: 'cabello',
  ROPA: 'ropa',
  ACCESORIO: 'accesorio',
};

@Injectable()
export class AvatarsService {
  constructor(private prisma: PrismaService) {}

  async getTienda() {
    return this.prisma.itemTienda.findMany({
      orderBy: [{ categoria: 'asc' }, { precioMonedas: 'asc' }],
    });
  }

  async seedTienda() {
    // Limpiar relaciones y catálogo previo
    await this.prisma.usuarioItem.deleteMany();
    await this.prisma.itemTienda.deleteMany();

    // Crear usando upsert por clave (útil si deleteMany no borra por restricciones)
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

  async getMiAvatar(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    // Asegurar avatarConfig
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

  async comprar(usuarioId: string, itemId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const item = await this.prisma.itemTienda.findUnique({
      where: { id: itemId },
    });
    if (!item) throw new NotFoundException('Artículo no encontrado');

    // ¿Ya lo posee?
    const yaPosee = await this.prisma.usuarioItem.findUnique({
      where: { usuarioId_itemId: { usuarioId, itemId } },
    });
    if (yaPosee) {
      throw new BadRequestException('Ya posees este artículo');
    }

    // Nivel requerido
    const nivelUsuario = Math.floor(usuario.experiencia / 100) + 1;
    if (nivelUsuario < item.nivelRequerido) {
      throw new BadRequestException(
        `Necesitas nivel ${item.nivelRequerido} para comprar este artículo`,
      );
    }

    // Verificar fondos
    let nuevasMonedas = usuario.monedas;
    let nuevasGemas = usuario.gemas;

    if (item.precioGemas > 0) {
      if (usuario.gemas < item.precioGemas) {
        throw new BadRequestException('No tienes suficientes gemas');
      }
      nuevasGemas = usuario.gemas - item.precioGemas;
    } else if (item.precioMonedas > 0) {
      if (usuario.monedas < item.precioMonedas) {
        throw new BadRequestException('No tienes suficientes monedas');
      }
      nuevasMonedas = usuario.monedas - item.precioMonedas;
    }

    // Descontar y registrar compra (transacción)
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

  async equipar(usuarioId: string, itemId: string) {
    const item = await this.prisma.itemTienda.findUnique({
      where: { id: itemId },
    });
    if (!item) throw new NotFoundException('Artículo no encontrado');

    const esGratis = item.precioMonedas === 0 && item.precioGemas === 0;

    if (!esGratis) {
      const posee = await this.prisma.usuarioItem.findUnique({
        where: { usuarioId_itemId: { usuarioId, itemId } },
      });
      if (!posee) {
        throw new BadRequestException('No posees este artículo');
      }
    }

    const campo = CATEGORIA_A_CAMPO[item.categoria];
    if (!campo) {
      throw new BadRequestException(`Categoría inválida: ${item.categoria}`);
    }

    // Asegurar avatarConfig existente
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
}
