import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TipoDesafio } from '@prisma/client';

@Injectable()
export class DesafiosService {
  constructor(private prisma: PrismaService) {}

  async getAsignaturas() {
    return this.prisma.asignatura.findMany();
  }

  async getModulos(asignaturaId: string) {
    return this.prisma.modulo.findMany({
      where: { asignaturaId },
      orderBy: { orden: 'asc' },
    });
  }

  async getDesafios(moduloId: string) {
    return this.prisma.desafio.findMany({
      where: { moduloId },
      include: {
        opciones: {
          select: {
            id: true,
            texto: true,
            // Excluimos 'esCorrecta' para que no se filtre al frontend
          },
        },
      },
      orderBy: { orden: 'asc' },
    });
  }

  async verificarRespuesta(desafioId: string, opcionId: string) {
    const opcion = await this.prisma.opcion.findUnique({
      where: { id: opcionId },
    });

    if (!opcion || opcion.desafioId !== desafioId) {
      return { esCorrecta: false, mensaje: 'Opción no válida para este desafío' };
    }

    return {
      esCorrecta: opcion.esCorrecta,
      mensaje: opcion.esCorrecta ? '¡Excelente! Respuesta correcta.' : 'Inténtalo de nuevo.',
    };
  }

  async seedDatabase() {
    // Limpiamos base de datos previa
    await this.prisma.medallaEstudiante.deleteMany({});
    await this.prisma.progresoEstudiante.deleteMany({});
    await this.prisma.opcion.deleteMany({});
    await this.prisma.desafio.deleteMany({});
    await this.prisma.modulo.deleteMany({});
    await this.prisma.asignatura.deleteMany({});
    await this.prisma.medalla.deleteMany({});

    // Crear Asignaturas
    const mat = await this.prisma.asignatura.create({
      data: {
        nombre: 'Matemáticas',
        descripcion: 'Operaciones básicas de aritmética y lógica.',
      },
    });

    const len = await this.prisma.asignatura.create({
      data: {
        nombre: 'Lengua y Literatura',
        descripcion: 'Comprensión lectora, gramática y ortografía básica.',
      },
    });

    // Crear Módulos de Matemáticas
    const moduloMat1 = await this.prisma.modulo.create({
      data: {
        asignaturaId: mat.id,
        titulo: 'Suma y Resta Aventura',
        orden: 1,
      },
    });

    // Desafíos de Matemáticas
    const dMat1 = await this.prisma.desafio.create({
      data: {
        moduloId: moduloMat1.id,
        tipo: TipoDesafio.SELECCION_MULTIPLE,
        pregunta: '¿Cuál es el resultado de sumar 5 + 3?',
        puntos: 10,
        orden: 1,
      },
    });

    await this.prisma.opcion.createMany({
      data: [
        { desafioId: dMat1.id, texto: '7', esCorrecta: false },
        { desafioId: dMat1.id, texto: '8', esCorrecta: true },
        { desafioId: dMat1.id, texto: '9', esCorrecta: false },
      ],
    });

    const dMat2 = await this.prisma.desafio.create({
      data: {
        moduloId: moduloMat1.id,
        tipo: TipoDesafio.COMPLETAR_TEXTO,
        pregunta: 'Completa la siguiente operación: 10 - _ = 4',
        puntos: 15,
        orden: 2,
      },
    });

    await this.prisma.opcion.createMany({
      data: [
        { desafioId: dMat2.id, texto: '6', esCorrecta: true },
        { desafioId: dMat2.id, texto: '5', esCorrecta: false },
      ],
    });

    // Crear Módulos de Lengua
    const moduloLen1 = await this.prisma.modulo.create({
      data: {
        asignaturaId: len.id,
        titulo: 'Viaje Gramatical',
        orden: 1,
      },
    });

    // Desafíos de Lengua
    const dLen1 = await this.prisma.desafio.create({
      data: {
        moduloId: moduloLen1.id,
        tipo: TipoDesafio.SELECCION_MULTIPLE,
        pregunta: '¿Cuál de las siguientes palabras es un sustantivo?',
        puntos: 10,
        orden: 1,
      },
    });

    await this.prisma.opcion.createMany({
      data: [
        { desafioId: dLen1.id, texto: 'Correr', esCorrecta: false },
        { desafioId: dLen1.id, texto: 'Gato', esCorrecta: true },
        { desafioId: dLen1.id, texto: 'Rápido', esCorrecta: false },
      ],
    });

    // Crear Medallas de Recompensa
    await this.prisma.medalla.createMany({
      data: [
        {
          titulo: 'Matemático Estrella',
          descripcion: 'Otorgado por completar el primer módulo de matemáticas.',
          iconoUrl: 'star_math',
          criterio: 'Completar Suma y Resta Aventura',
        },
        {
          titulo: 'Gran Lector',
          descripcion: 'Otorgado por completar el primer módulo de lengua y literatura.',
          iconoUrl: 'book_read',
          criterio: 'Completar Viaje Gramatical',
        },
      ],
    });

    return { mensaje: 'Base de datos inicializada con éxito con datos educativos de 3er grado.' };
  }
}
