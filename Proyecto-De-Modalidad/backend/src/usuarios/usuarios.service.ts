import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

const ROLES_VALIDOS = ['ESTUDIANTE', 'PADRE', 'MAESTRO'];

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  // ===================== CREACIÓN Y LOGIN =====================

  async createUser(nombre: string, pin: string, rol: string) {
    if (!ROLES_VALIDOS.includes(rol)) {
      throw new BadRequestException(
        `Rol inválido. Debe ser uno de: ${ROLES_VALIDOS.join(', ')}`,
      );
    }

    const existente = await this.prisma.usuario.findFirst({
      where: { nombre, rol },
    });
    if (existente) {
      throw new BadRequestException(
        'Ya existe un usuario con ese nombre y rol',
      );
    }

    const usuario = await this.prisma.usuario.create({
      data: { nombre, pin, rol },
      include: { avatarConfig: true },
    });

    // Si es estudiante, crear config de avatar con valores por defecto
    if (rol === 'ESTUDIANTE' && !usuario.avatarConfig) {
      await this.prisma.avatarConfig.create({
        data: { usuarioId: usuario.id },
      });
    }

    const resultado = await this.prisma.usuario.findUnique({
      where: { id: usuario.id },
      include: { avatarConfig: true },
    });

    return resultado;
  }

  async validatePin(nombre: string, pin: string, rol?: string) {
    const where: any = { nombre };
    if (rol) where.rol = rol;

    const usuario = await this.prisma.usuario.findFirst({ where });

    if (!usuario || usuario.pin !== pin) {
      throw new UnauthorizedException('Nombre, PIN o rol incorrectos');
    }

    // Si es estudiante, asegurar avatarConfig
    if (usuario.rol === 'ESTUDIANTE') {
      const config = await this.prisma.avatarConfig.findUnique({
        where: { usuarioId: usuario.id },
      });
      if (!config) {
        await this.prisma.avatarConfig.create({
          data: { usuarioId: usuario.id },
        });
      }
    }

    const resultado = await this.prisma.usuario.findUnique({
      where: { id: usuario.id },
      include: { avatarConfig: usuario.rol === 'ESTUDIANTE' },
    });

    return resultado;
  }

  async getUserProfile(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: { avatarConfig: true },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  // ===================== MODO DEMO =====================

  private readonly DEMO_CREDENCIALES: Record<
    string,
    { nombre: string; pin: string }
  > = {
    ESTUDIANTE: { nombre: 'DemoKid', pin: '1111' },
    PADRE: { nombre: 'PadreDemo', pin: '1234' },
    MAESTRO: { nombre: 'MaestroDemo', pin: '1234' },
  };

  /**
   * Inicia sesión como usuario demo para el rol indicado.
   * Crea el usuario si no existe (idempotente) y prepara datos de prueba:
   *  - ESTUDIANTE: configura avatar por defecto.
   *  - PADRE: vincula a DemoKid como hijo.
   *  - MAESTRO: le asigna todas las asignaturas existentes para que tenga contenido.
   */
  async loginDemo(rol: string) {
    if (!ROLES_VALIDOS.includes(rol)) {
      throw new BadRequestException(
        `Rol inválido. Debe ser uno de: ${ROLES_VALIDOS.join(', ')}`,
      );
    }

    const cred = this.DEMO_CREDENCIALES[rol];

    // Buscar usuario demo existente por nombre+rol
    let usuario = await this.prisma.usuario.findFirst({
      where: { nombre: cred.nombre, rol },
    });

    if (!usuario) {
      usuario = await this.prisma.usuario.create({
        data: { nombre: cred.nombre, pin: cred.pin, rol },
      });
    } else {
      // Asegurar que el PIN sea el correcto (por si se cambió)
      if (usuario.pin !== cred.pin) {
        usuario = await this.prisma.usuario.update({
          where: { id: usuario.id },
          data: { pin: cred.pin },
        });
      }
    }

    // Configuración por rol
    if (rol === 'ESTUDIANTE') {
      const config = await this.prisma.avatarConfig.findUnique({
        where: { usuarioId: usuario.id },
      });
      if (!config) {
        await this.prisma.avatarConfig.create({
          data: { usuarioId: usuario.id },
        });
      }
    } else if (rol === 'PADRE') {
      // Vincular a DemoKid como hijo del padre demo (idempotente)
      const kid = await this.prisma.usuario.findFirst({
        where: { nombre: 'DemoKid', rol: 'ESTUDIANTE' },
      });
      if (kid) {
        const vinculo = await this.prisma.padreHijo.findUnique({
          where: {
            padreId_hijoId: { padreId: usuario.id, hijoId: kid.id },
          },
        });
        if (!vinculo) {
          await this.prisma.padreHijo.create({
            data: { padreId: usuario.id, hijoId: kid.id },
          });
        }
      }
    } else if (rol === 'MAESTRO') {
      // Asignar todas las asignaturas existentes al maestro demo
      await this.prisma.asignatura.updateMany({
        where: {},
        data: { maestroId: usuario.id },
      });
    }

    // Devolver el usuario con su avatarConfig (como lo hace validatePin)
    const resultado = await this.prisma.usuario.findUnique({
      where: { id: usuario.id },
      include: { avatarConfig: rol === 'ESTUDIANTE' },
    });

    return resultado;
  }

  // ===================== PROGRESO ESTUDIANTE =====================

  async getProgresoEstudiante(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        medallas: { include: { medalla: true } },
      },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const asignaturas = await this.prisma.asignatura.findMany({
      include: {
        modulos: {
          include: {
            desafios: true,
          },
        },
      },
    });

    const progresos = await this.prisma.progresoEstudiante.findMany({
      where: { usuarioId: id },
    });

    const progresoMap = new Map<string, (typeof progresos)[number]>();
    for (const p of progresos) progresoMap.set(p.desafioId, p);

    const resultado = asignaturas.map((asignatura) => {
      const modulos = asignatura.modulos.map((modulo) => {
        const totalDesafios = modulo.desafios.length;
        let completados = 0;
        let puntosGanados = 0;
        let puntosTotales = 0;

        for (const desafio of modulo.desafios) {
          puntosTotales += desafio.puntos;
          const prog = progresoMap.get(desafio.id);
          if (prog && prog.completado) {
            completados += 1;
            puntosGanados += prog.puntosGanados;
          }
        }

        const porcentajeCompletado =
          totalDesafios === 0 ? 0 : Math.round((completados / totalDesafios) * 100);

        return {
          id: modulo.id,
          titulo: modulo.titulo,
          totalDesafios,
          completados,
          puntosGanados,
          puntosTotales,
          porcentajeCompletado,
        };
      });

      const totalDesafios = modulos.reduce((s, m) => s + m.totalDesafios, 0);
      const completados = modulos.reduce((s, m) => s + m.completados, 0);
      const puntosGanados = modulos.reduce((s, m) => s + m.puntosGanados, 0);
      const puntosTotales = modulos.reduce((s, m) => s + m.puntosTotales, 0);
      const porcentajeCompletado =
        totalDesafios === 0 ? 0 : Math.round((completados / totalDesafios) * 100);

      return {
        id: asignatura.id,
        nombre: asignatura.nombre,
        descripcion: asignatura.descripcion,
        modulos,
        totalDesafios,
        completados,
        puntosGanados,
        puntosTotales,
        porcentajeCompletado,
      };
    });

    return {
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        puntos: usuario.puntos,
        experiencia: usuario.experiencia,
        monedas: usuario.monedas,
        gemas: usuario.gemas,
      },
      medallas: usuario.medallas.map((m) => ({
        id: m.medalla.id,
        titulo: m.medalla.titulo,
        descripcion: m.medalla.descripcion,
        iconoUrl: m.medalla.iconoUrl,
        ganadaEn: m.ganadaEn,
      })),
      asignaturas: resultado,
    };
  }

  // ===================== RANKING =====================

  async getRanking() {
    return this.prisma.usuario.findMany({
      where: { rol: 'ESTUDIANTE' },
      orderBy: { puntos: 'desc' },
      take: 20,
      select: {
        id: true,
        nombre: true,
        puntos: true,
        experiencia: true,
      },
    });
  }

  // ===================== PADRE - HIJO =====================

  async getHijosDePadre(padreId: string) {
    const vinculos = await this.prisma.padreHijo.findMany({
      where: { padreId },
      include: {
        hijo: {
          select: {
            id: true,
            nombre: true,
            puntos: true,
            experiencia: true,
            monedas: true,
            gemas: true,
          },
        },
      },
    });
    return vinculos.map((v) => v.hijo);
  }

  async vincularHijo(
    padreId: string,
    data: { hijoId?: string; nombre?: string; pin?: string },
  ) {
    let hijo;
    if (data.hijoId) {
      hijo = await this.prisma.usuario.findUnique({
        where: { id: data.hijoId },
      });
      if (!hijo || hijo.rol !== 'ESTUDIANTE') {
        throw new NotFoundException('Estudiante no encontrado');
      }
    } else {
      if (!data.nombre || !data.pin) {
        throw new BadRequestException(
          'Debe proporcionar hijoId o (nombre y pin)',
        );
      }
      hijo = await this.prisma.usuario.findFirst({
        where: { nombre: data.nombre, pin: data.pin, rol: 'ESTUDIANTE' },
      });
      if (!hijo) {
        throw new NotFoundException(
          'Estudiante no encontrado con esas credenciales',
        );
      }
    }

    // Verificar/crear el vínculo (idempotente)
    const existente = await this.prisma.padreHijo.findUnique({
      where: {
        padreId_hijoId: { padreId, hijoId: hijo.id },
      },
    });

    if (!existente) {
      await this.prisma.padreHijo.create({
        data: { padreId, hijoId: hijo.id },
      });
    }

    return {
      mensaje: existente
        ? 'El hijo ya estaba vinculado'
        : 'Hijo vinculado correctamente',
      hijo: {
        id: hijo.id,
        nombre: hijo.nombre,
        puntos: hijo.puntos,
        experiencia: hijo.experiencia,
      },
    };
  }

  async desvincularHijo(padreId: string, hijoId: string) {
    await this.prisma.padreHijo.deleteMany({
      where: { padreId, hijoId },
    });
    return { mensaje: 'Hijo desvinculado' };
  }

  // ===================== MAESTRO =====================

  async getEstudiantesParaMaestro(maestroId: string) {
    // Obtener asignaturas del maestro con sus módulos y desafíos
    const asignaturas = await this.prisma.asignatura.findMany({
      where: { maestroId },
      include: {
        modulos: {
          include: {
            desafios: { select: { id: true, puntos: true } },
          },
        },
      },
    });

    const desafioIds: string[] = [];
    let totalDesafios = 0;
    for (const a of asignaturas) {
      for (const m of a.modulos) {
        for (const d of m.desafios) {
          desafioIds.push(d.id);
          totalDesafios += 1;
        }
      }
    }

    if (desafioIds.length === 0) {
      return [];
    }

    // Obtener todos los progresos completados en estos desafíos
    const progresos = await this.prisma.progresoEstudiante.findMany({
      where: { desafioId: { in: desafioIds }, completado: true },
      select: { usuarioId: true },
    });

    const conteo = new Map<string, number>();
    for (const p of progresos) {
      conteo.set(p.usuarioId, (conteo.get(p.usuarioId) ?? 0) + 1);
    }

    // Datos de cada estudiante encontrado
    const estudianteIds = Array.from(conteo.keys());
    const estudiantes = await this.prisma.usuario.findMany({
      where: { id: { in: estudianteIds } },
      select: { id: true, nombre: true, puntos: true, experiencia: true },
    });

    return estudiantes.map((e) => {
      const completados = conteo.get(e.id) ?? 0;
      const porcentajeGlobal =
        totalDesafios === 0
          ? 0
          : Math.round((completados / totalDesafios) * 100);
      return {
        id: e.id,
        nombre: e.nombre,
        puntos: e.puntos,
        desafiosCompletados: completados,
        porcentajeGlobal,
      };
    });
  }

  async getAsignaturasDeMaestro(maestroId: string) {
    return this.prisma.asignatura.findMany({
      where: { maestroId },
      include: { _count: { select: { modulos: true } } },
      orderBy: { nombre: 'asc' },
    });
  }
}
