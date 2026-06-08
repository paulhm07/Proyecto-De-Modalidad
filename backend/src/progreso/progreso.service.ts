import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProgresoService {
  constructor(private prisma: PrismaService) {}

  async registrarProgreso(usuarioId: string, desafioId: string, opcionId: string) {
    // 1. Obtener el desafío con su módulo y opciones
    const desafio = await this.prisma.desafio.findUnique({
      where: { id: desafioId },
      include: {
        modulo: true,
        opciones: true,
      },
    });

    if (!desafio) {
      throw new NotFoundException('Desafío no encontrado');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 2. Verificar la respuesta seleccionada
    const opcion = desafio.opciones.find((o) => o.id === opcionId);
    if (!opcion) {
      throw new BadRequestException('La opción seleccionada no pertenece al desafío');
    }

    const esCorrecta = opcion.esCorrecta;

    // 3. Buscar progreso previo
    const progresoPrevio = await this.prisma.progresoEstudiante.findUnique({
      where: {
        usuarioId_desafioId: {
          usuarioId,
          desafioId,
        },
      },
    });

    // Si ya lo completó anteriormente, no sumamos puntos duplicados
    const yaCompletado = progresoPrevio?.completado || false;

    // 4. Actualizar o crear registro de progreso
    const progreso = await this.prisma.progresoEstudiante.upsert({
      where: {
        usuarioId_desafioId: {
          usuarioId,
          desafioId,
        },
      },
      update: {
        completado: yaCompletado ? true : esCorrecta,
        intentos: { increment: 1 },
        puntosGanados: yaCompletado && progresoPrevio ? progresoPrevio.puntosGanados : (esCorrecta ? desafio.puntos : 0),
      },
      create: {
        usuarioId,
        desafioId,
        completado: esCorrecta,
        intentos: 1,
        puntosGanados: esCorrecta ? desafio.puntos : 0,
      },
    });

    let medallaGanada = null;

    // 5. Si la respuesta es correcta y no estaba completada antes, actualizar puntuación y validar medalla
    if (esCorrecta && !yaCompletado) {
      // Incrementar puntos y experiencia del usuario
      await this.prisma.usuario.update({
        where: { id: usuarioId },
        data: {
          puntos: { increment: desafio.puntos },
          experiencia: { increment: desafio.puntos * 2 }, // XP = Puntos x 2
        },
      });

      // Validar si completó todo el módulo para otorgar medalla
      const moduloId = desafio.moduloId;
      const desafiosDelModulo = await this.prisma.desafio.findMany({
        where: { moduloId },
        select: { id: true },
      });

      const progresosDelModulo = await this.prisma.progresoEstudiante.findMany({
        where: {
          usuarioId,
          desafioId: { in: desafiosDelModulo.map((d) => d.id) },
          completado: true,
        },
      });

      // Si completó todos los desafíos del módulo
      if (progresosDelModulo.length === desafiosDelModulo.length) {
        // Buscar medalla asociada al criterio del módulo
        const criterioBuscado = `Completar ${desafio.modulo.titulo}`;
        const medalla = await this.prisma.medalla.findFirst({
          where: { criterio: criterioBuscado },
        });

        if (medalla) {
          // Intentar otorgarla (si no la tiene ya)
          const yaTieneMedalla = await this.prisma.medallaEstudiante.findUnique({
            where: {
              usuarioId_medallaId: {
                usuarioId,
                medallaId: medalla.id,
              },
            },
          });

          if (!yaTieneMedalla) {
            await this.prisma.medallaEstudiante.create({
              data: {
                usuarioId,
                medallaId: medalla.id,
              },
            });
            medallaGanada = medalla;
          }
        }
      }
    }

    return {
      esCorrecta,
      puntosGanados: (esCorrecta && !yaCompletado) ? desafio.puntos : 0,
      medallaGanada,
      progresoActual: progreso,
    };
  }

  async obtenerMedallasDeUsuario(usuarioId: string) {
    return this.prisma.medallaEstudiante.findMany({
      where: { usuarioId },
      include: {
        medalla: true,
      },
    });
  }
}
