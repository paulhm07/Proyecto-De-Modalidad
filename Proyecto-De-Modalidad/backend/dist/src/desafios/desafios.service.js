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
exports.DesafiosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const TIPO_SELECCION_MULTIPLE = 'SELECCION_MULTIPLE';
const TIPO_COMPLETAR_TEXTO = 'COMPLETAR_TEXTO';
const TIPO_VERDADERO_FALSO = 'VERDADERO_FALSO';
const TIPO_ASOCIAR = 'ASOCIAR_PAREJAS';
const TIPO_ORDENAR = 'ORDENAR_PALABRAS';
let DesafiosService = class DesafiosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAsignaturas() {
        return this.prisma.asignatura.findMany({
            include: { _count: { select: { modulos: true } } },
            orderBy: { nombre: 'asc' },
        });
    }
    async getModulos(asignaturaId) {
        return this.prisma.modulo.findMany({
            where: { asignaturaId },
            orderBy: { orden: 'asc' },
            include: { _count: { select: { desafios: true } } },
        });
    }
    async getDesafios(moduloId) {
        return this.prisma.desafio.findMany({
            where: { moduloId },
            include: {
                opciones: {
                    select: {
                        id: true,
                        texto: true,
                    },
                },
            },
            orderBy: { orden: 'asc' },
        });
    }
    async verificarRespuesta(desafioId, opcionId) {
        const opcion = await this.prisma.opcion.findUnique({
            where: { id: opcionId },
        });
        if (!opcion || opcion.desafioId !== desafioId) {
            return { esCorrecta: false, mensaje: 'Opción no válida para este desafío' };
        }
        return {
            esCorrecta: opcion.esCorrecta,
            mensaje: opcion.esCorrecta
                ? '¡Excelente! Respuesta correcta.'
                : 'Inténtalo de nuevo.',
        };
    }
    async crearAsignatura(nombre, descripcion, maestroId) {
        const maestro = await this.prisma.usuario.findUnique({ where: { id: maestroId } });
        if (!maestro)
            throw new common_1.NotFoundException('Maestro no encontrado');
        return this.prisma.asignatura.create({ data: { nombre, descripcion, maestroId } });
    }
    async actualizarAsignatura(id, data) {
        const asig = await this.prisma.asignatura.findUnique({ where: { id } });
        if (!asig)
            throw new common_1.NotFoundException('Asignatura no encontrada');
        return this.prisma.asignatura.update({ where: { id }, data });
    }
    async eliminarAsignatura(id) {
        const asig = await this.prisma.asignatura.findUnique({ where: { id } });
        if (!asig)
            throw new common_1.NotFoundException('Asignatura no encontrada');
        await this.prisma.asignatura.delete({ where: { id } });
        return { mensaje: 'Asignatura eliminada' };
    }
    async crearModulo(asignaturaId, titulo, nivelMinimo = 1, descripcion) {
        const asig = await this.prisma.asignatura.findUnique({ where: { id: asignaturaId } });
        if (!asig)
            throw new common_1.NotFoundException('Asignatura no encontrada');
        const count = await this.prisma.modulo.count({ where: { asignaturaId } });
        return this.prisma.modulo.create({
            data: { asignaturaId, titulo, descripcion: descripcion ?? null, orden: count + 1, nivelMinimo },
        });
    }
    async actualizarModulo(id, data) {
        const mod = await this.prisma.modulo.findUnique({ where: { id } });
        if (!mod)
            throw new common_1.NotFoundException('Módulo no encontrado');
        return this.prisma.modulo.update({ where: { id }, data });
    }
    async eliminarModulo(id) {
        const mod = await this.prisma.modulo.findUnique({ where: { id } });
        if (!mod)
            throw new common_1.NotFoundException('Módulo no encontrado');
        await this.prisma.modulo.delete({ where: { id } });
        return { mensaje: 'Módulo eliminado' };
    }
    async crearDesafio(data) {
        const mod = await this.prisma.modulo.findUnique({ where: { id: data.moduloId } });
        if (!mod)
            throw new common_1.NotFoundException('Módulo no encontrado');
        const tiposValidos = [TIPO_SELECCION_MULTIPLE, TIPO_COMPLETAR_TEXTO, TIPO_VERDADERO_FALSO, TIPO_ASOCIAR, TIPO_ORDENAR];
        if (!tiposValidos.includes(data.tipo)) {
            throw new common_1.BadRequestException(`Tipo de desafío inválido. Debe ser uno de: ${tiposValidos.join(', ')}`);
        }
        if (!data.opciones || data.opciones.length < 2) {
            throw new common_1.BadRequestException('Debe incluir al menos 2 opciones');
        }
        const correctas = data.opciones.filter((o) => o.esCorrecta).length;
        if (correctas !== 1) {
            throw new common_1.BadRequestException('Debe haber exactamente una opción correcta');
        }
        const count = await this.prisma.desafio.count({ where: { moduloId: data.moduloId } });
        return this.prisma.desafio.create({
            data: {
                moduloId: data.moduloId,
                tipo: data.tipo,
                pregunta: data.pregunta,
                puntos: data.puntos ?? 10,
                orden: count + 1,
                opciones: { create: data.opciones },
            },
            include: { opciones: true },
        });
    }
    async eliminarDesafio(id) {
        const d = await this.prisma.desafio.findUnique({ where: { id } });
        if (!d)
            throw new common_1.NotFoundException('Desafío no encontrado');
        await this.prisma.desafio.delete({ where: { id } });
        return { mensaje: 'Desafío eliminado' };
    }
    async seedDatabase() {
        await this.prisma.medallaEstudiante.deleteMany({});
        await this.prisma.progresoEstudiante.deleteMany({});
        await this.prisma.opcion.deleteMany({});
        await this.prisma.desafio.deleteMany({});
        await this.prisma.modulo.deleteMany({});
        await this.prisma.asignatura.deleteMany({});
        await this.prisma.medalla.deleteMany({});
        const maestro = await this.prisma.usuario.findFirst({ where: { rol: 'MAESTRO' } });
        const asignaturasData = this.buildCurriculumData();
        const medallasData = this.buildMedallasData(asignaturasData);
        let totalDesafios = 0;
        for (const asigData of asignaturasData) {
            const asignatura = await this.prisma.asignatura.create({
                data: { nombre: asigData.nombre, descripcion: asigData.descripcion, maestroId: maestro?.id },
            });
            for (let m = 0; m < asigData.modulos.length; m++) {
                const modData = asigData.modulos[m];
                const modulo = await this.prisma.modulo.create({
                    data: { asignaturaId: asignatura.id, titulo: modData.titulo, descripcion: modData.descripcion ?? null, orden: m + 1, nivelMinimo: modData.nivelMinimo },
                });
                for (let d = 0; d < modData.desafios.length; d++) {
                    const desData = modData.desafios[d];
                    const desafio = await this.prisma.desafio.create({
                        data: { moduloId: modulo.id, tipo: desData.tipo, pregunta: desData.pregunta, puntos: desData.puntos, orden: d + 1 },
                    });
                    await this.prisma.opcion.createMany({
                        data: desData.opciones.map((op) => ({ desafioId: desafio.id, texto: op.texto, esCorrecta: op.esCorrecta })),
                    });
                    totalDesafios++;
                }
            }
        }
        await this.prisma.medalla.createMany({ data: medallasData });
        return {
            mensaje: `Base de datos inicializada con ${asignaturasData.length} asignaturas, ${asignaturasData.reduce((a, s) => a + s.modulos.length, 0)} módulos y ${totalDesafios} desafíos educativos de 3er grado.`,
            asignaturas: asignaturasData.length,
            modulos: asignaturasData.reduce((a, s) => a + s.modulos.length, 0),
            desafios: totalDesafios,
            medallas: medallasData.length,
            maestroAsignado: maestro ? maestro.id : null,
        };
    }
    buildCurriculumData() {
        return [
            {
                nombre: 'Matemáticas',
                descripcion: 'Operaciones básicas, figuras, medición, patrones y resolución de problemas.',
                modulos: [
                    {
                        titulo: 'Suma y Resta Aventura',
                        descripcion: 'Incluye: Desafío de 3 dígitos, Restas sin llevar, Operaciones inversas',
                        nivelMinimo: 1,
                        desafios: [
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuál es el resultado de sumar 5 + 3?', puntos: 10,
                                opciones: [{ texto: '7', esCorrecta: false }, { texto: '8', esCorrecta: true }, { texto: '9', esCorrecta: false }] },
                            { tipo: TIPO_COMPLETAR_TEXTO, pregunta: 'Completa la operación: 10 - ___ = 4', puntos: 15,
                                opciones: [{ texto: '6', esCorrecta: true }, { texto: '5', esCorrecta: false }, { texto: '7', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'María tiene 8 manzanas y se come 3. ¿Cuántas manzanas le quedan?', puntos: 15,
                                opciones: [{ texto: '5', esCorrecta: true }, { texto: '11', esCorrecta: false }, { texto: '4', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuánto es 12 + 7?', puntos: 10,
                                opciones: [{ texto: '18', esCorrecta: false }, { texto: '19', esCorrecta: true }, { texto: '20', esCorrecta: false }] },
                            { tipo: TIPO_COMPLETAR_TEXTO, pregunta: 'Completa: 25 - ___ = 13', puntos: 15,
                                opciones: [{ texto: '12', esCorrecta: true }, { texto: '11', esCorrecta: false }, { texto: '13', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'En una granja hay 14 gallinas y llegan 9 más. ¿Cuántas gallinas hay ahora?', puntos: 20,
                                opciones: [{ texto: '22', esCorrecta: false }, { texto: '23', esCorrecta: true }, { texto: '24', esCorrecta: false }] },
                        ],
                    },
                    {
                        titulo: 'Multiplicación Mágica',
                        descripcion: 'Tablas del 2 al 9 y Problemas Cotidianos',
                        nivelMinimo: 1,
                        desafios: [
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuánto es 3 × 4?', puntos: 10,
                                opciones: [{ texto: '12', esCorrecta: true }, { texto: '7', esCorrecta: false }, { texto: '14', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuánto es 5 × 2?', puntos: 10,
                                opciones: [{ texto: '7', esCorrecta: false }, { texto: '10', esCorrecta: true }, { texto: '12', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuánto es 6 × 3?', puntos: 15,
                                opciones: [{ texto: '18', esCorrecta: true }, { texto: '9', esCorrecta: false }, { texto: '21', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'Hay 4 cajas con 6 lápices cada una. ¿Cuántos lápices hay en total?', puntos: 20,
                                opciones: [{ texto: '10', esCorrecta: false }, { texto: '24', esCorrecta: true }, { texto: '28', esCorrecta: false }] },
                            { tipo: TIPO_COMPLETAR_TEXTO, pregunta: 'Completa: 7 × 5 = ___', puntos: 15,
                                opciones: [{ texto: '35', esCorrecta: true }, { texto: '30', esCorrecta: false }, { texto: '40', esCorrecta: false }] },
                            { tipo: TIPO_COMPLETAR_TEXTO, pregunta: 'Completa: 2 × 8 = ___', puntos: 10,
                                opciones: [{ texto: '16', esCorrecta: true }, { texto: '10', esCorrecta: false }, { texto: '18', esCorrecta: false }] },
                        ],
                    },
                    {
                        titulo: 'Figuras Geométricas',
                        descripcion: 'Lados, Vértices y Cuerpos en 3D',
                        nivelMinimo: 1,
                        desafios: [
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuántos lados tiene un triángulo?', puntos: 10,
                                opciones: [{ texto: '2 lados', esCorrecta: false }, { texto: '3 lados', esCorrecta: true }, { texto: '4 lados', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuál figura tiene sus 4 lados iguales?', puntos: 15,
                                opciones: [{ texto: 'Rectángulo', esCorrecta: false }, { texto: 'Cuadrado', esCorrecta: true }, { texto: 'Triángulo', esCorrecta: false }] },
                            { tipo: TIPO_COMPLETAR_TEXTO, pregunta: 'Un círculo tiene ___ lados', puntos: 15,
                                opciones: [{ texto: '0', esCorrecta: true }, { texto: '1', esCorrecta: false }, { texto: '2', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuántos lados tiene un pentágono?', puntos: 15,
                                opciones: [{ texto: '4 lados', esCorrecta: false }, { texto: '5 lados', esCorrecta: true }, { texto: '6 lados', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuál de estas figuras NO tiene esquinas (vértices)?', puntos: 15,
                                opciones: [{ texto: 'Cuadrado', esCorrecta: false }, { texto: 'Círculo', esCorrecta: true }, { texto: 'Triángulo', esCorrecta: false }] },
                            { tipo: TIPO_VERDADERO_FALSO, pregunta: 'Un rectángulo tiene 4 lados y 4 esquinas. ¿Verdadero o falso?', puntos: 10,
                                opciones: [{ texto: 'Verdadero', esCorrecta: true }, { texto: 'Falso', esCorrecta: false }] },
                        ],
                    },
                    {
                        titulo: 'Fracciones y Lógica',
                        descripcion: 'Lectura visual de fracciones y acertijos numéricos',
                        nivelMinimo: 1,
                        desafios: [
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'Si corto una pizza en 4 partes iguales y me como 1, ¿qué fracción comí?', puntos: 15,
                                opciones: [{ texto: '1/2', esCorrecta: false }, { texto: '1/4', esCorrecta: true }, { texto: '1/3', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuál fracción representa “la mitad”?', puntos: 15,
                                opciones: [{ texto: '1/4', esCorrecta: false }, { texto: '1/2', esCorrecta: true }, { texto: '1/3', esCorrecta: false }] },
                            { tipo: TIPO_COMPLETAR_TEXTO, pregunta: 'La mitad de 10 es ___', puntos: 15,
                                opciones: [{ texto: '5', esCorrecta: true }, { texto: '2', esCorrecta: false }, { texto: '8', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'Acertijo: soy impar, mayor que 5 y menor que 9. ¿Qué número soy?', puntos: 20,
                                opciones: [{ texto: '6', esCorrecta: false }, { texto: '7', esCorrecta: true }, { texto: '8', esCorrecta: false }] },
                            { tipo: TIPO_COMPLETAR_TEXTO, pregunta: 'Descubre el patrón y completa: 2, 4, 6, 8, ___', puntos: 15,
                                opciones: [{ texto: '9', esCorrecta: false }, { texto: '10', esCorrecta: true }, { texto: '12', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'Tengo 12 galletas y las reparto en partes iguales entre 4 amigos. ¿Cuántas recibe cada uno?', puntos: 20,
                                opciones: [{ texto: '2 galletas', esCorrecta: false }, { texto: '3 galletas', esCorrecta: true }, { texto: '4 galletas', esCorrecta: false }] },
                        ],
                    },
                ],
            },
            {
                nombre: 'Lengua y Literatura',
                descripcion: 'Gramática, ortografía, sinónimos y antónimos, formación de oraciones y comprensión lectora.',
                modulos: [
                    {
                        titulo: 'Gramática Espacial',
                        descripcion: 'Sustantivos propios/comunes y Tiempos verbales',
                        nivelMinimo: 1,
                        desafios: [
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuál de estas palabras es un sustantivo PROPIO?', puntos: 15,
                                opciones: [{ texto: 'Perro', esCorrecta: false }, { texto: 'México', esCorrecta: true }, { texto: 'Casa', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuál de estas palabras es un sustantivo COMÚN?', puntos: 15,
                                opciones: [{ texto: 'Ana', esCorrecta: false }, { texto: 'Niño', esCorrecta: true }, { texto: 'Madrid', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'En “El perro corrió”, la palabra “corrió” está en…', puntos: 15,
                                opciones: [{ texto: 'Presente', esCorrecta: false }, { texto: 'Pasado', esCorrecta: true }, { texto: 'Futuro', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'En “Mañana yo jugaré”, la palabra “jugaré” indica…', puntos: 15,
                                opciones: [{ texto: 'Pasado', esCorrecta: false }, { texto: 'Presente', esCorrecta: false }, { texto: 'Futuro', esCorrecta: true }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuál de estas palabras es un verbo?', puntos: 10,
                                opciones: [{ texto: 'Mesa', esCorrecta: false }, { texto: 'Saltar', esCorrecta: true }, { texto: 'Bonito', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuál es un sustantivo común?', puntos: 15,
                                opciones: [{ texto: 'Guatemala', esCorrecta: false }, { texto: 'Perro', esCorrecta: true }, { texto: 'Juan', esCorrecta: false }] },
                        ],
                    },
                    {
                        titulo: 'Ortografía en Acción',
                        descripcion: 'Uso correcto de B, V, C, S y Z',
                        nivelMinimo: 1,
                        desafios: [
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuál palabra está escrita correctamente?', puntos: 15,
                                opciones: [{ texto: 'Baca', esCorrecta: false }, { texto: 'Vaca', esCorrecta: true }, { texto: 'Baka', esCorrecta: false }] },
                            { tipo: TIPO_COMPLETAR_TEXTO, pregunta: 'Completa con B o V: “em___udo” se escribe con…', puntos: 15,
                                opciones: [{ texto: 'b', esCorrecta: true }, { texto: 'v', esCorrecta: false }, { texto: 'h', esCorrecta: false }] },
                            { tipo: TIPO_COMPLETAR_TEXTO, pregunta: 'Completa con C o S: “ha__er” se escribe con…', puntos: 15,
                                opciones: [{ texto: 'c', esCorrecta: true }, { texto: 's', esCorrecta: false }, { texto: 'z', esCorrecta: false }] },
                            { tipo: TIPO_COMPLETAR_TEXTO, pregunta: 'Completa con C o Z: “__apato” empieza con…', puntos: 15,
                                opciones: [{ texto: 'c', esCorrecta: false }, { texto: 's', esCorrecta: false }, { texto: 'z', esCorrecta: true }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuál palabra está escrita correctamente?', puntos: 15,
                                opciones: [{ texto: 'Hacer', esCorrecta: true }, { texto: 'Haser', esCorrecta: false }, { texto: 'Hazer', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuál palabra está escrita correctamente?', puntos: 15,
                                opciones: [{ texto: 'Cebra', esCorrecta: true }, { texto: 'Sebra', esCorrecta: false }, { texto: 'Zebra', esCorrecta: false }] },
                        ],
                    },
                    {
                        titulo: 'Cazadores de Sinónimos',
                        descripcion: 'Sinónimos, Antónimos y Sílabas',
                        nivelMinimo: 1,
                        desafios: [
                            { tipo: TIPO_ASOCIAR, pregunta: 'Selecciona el sinónimo de “grande”', puntos: 15,
                                opciones: [{ texto: 'Pequeño', esCorrecta: false }, { texto: 'Enorme', esCorrecta: true }, { texto: 'Flaco', esCorrecta: false }] },
                            { tipo: TIPO_ASOCIAR, pregunta: 'Selecciona el sinónimo de “feliz”', puntos: 15,
                                opciones: [{ texto: 'Contento', esCorrecta: true }, { texto: 'Triste', esCorrecta: false }, { texto: 'Enojado', esCorrecta: false }] },
                            { tipo: TIPO_ASOCIAR, pregunta: 'Selecciona el antónimo de “frío”', puntos: 15,
                                opciones: [{ texto: 'Helado', esCorrecta: false }, { texto: 'Caliente', esCorrecta: true }, { texto: 'Tibio', esCorrecta: false }] },
                            { tipo: TIPO_ASOCIAR, pregunta: 'Selecciona el antónimo de “día”', puntos: 10,
                                opciones: [{ texto: 'Noche', esCorrecta: true }, { texto: 'Tarde', esCorrecta: false }, { texto: 'Mañana', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuántas sílabas tiene la palabra “ma-ri-po-sa”?', puntos: 15,
                                opciones: [{ texto: '2 sílabas', esCorrecta: false }, { texto: '3 sílabas', esCorrecta: false }, { texto: '4 sílabas', esCorrecta: true }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: '¿Cuántas sílabas tiene la palabra “pe-rro”?', puntos: 15,
                                opciones: [{ texto: '1 sílaba', esCorrecta: false }, { texto: '2 sílabas', esCorrecta: true }, { texto: '3 sílabas', esCorrecta: false }] },
                        ],
                    },
                    {
                        titulo: 'Super Comprensión',
                        descripcion: 'Lectura de micro-historias e ideas principales',
                        nivelMinimo: 1,
                        desafios: [
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'Lee: "Lucía fue al zoológico y vio un león". ¿A dónde fue Lucía?', puntos: 15,
                                opciones: [{ texto: 'Al parque', esCorrecta: false }, { texto: 'Al zoológico', esCorrecta: true }, { texto: 'A la escuela', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'Lee: "Pedro desayunó pan con mermelada". ¿Qué desayunó Pedro?', puntos: 15,
                                opciones: [{ texto: 'Pan con mermelada', esCorrecta: true }, { texto: 'Leche con galletas', esCorrecta: false }, { texto: 'Fruta con yogurt', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'Lee: "El gato negro corre tras el ratón". ¿De qué color es el gato?', puntos: 15,
                                opciones: [{ texto: 'Blanco', esCorrecta: false }, { texto: 'Negro', esCorrecta: true }, { texto: 'Gris', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'Lee: "En la granja hay vacas, cerdos y gallinas". ¿Qué animal NO menciona el texto?', puntos: 20,
                                opciones: [{ texto: 'Gallinas', esCorrecta: false }, { texto: 'Caballos', esCorrecta: true }, { texto: 'Cerdos', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'Lee: "Sofía dibujó una casa con flores en el jardín". ¿Qué dibujó Sofía?', puntos: 15,
                                opciones: [{ texto: 'Un coche', esCorrecta: false }, { texto: 'Una casa con flores', esCorrecta: true }, { texto: 'Un árbol', esCorrecta: false }] },
                            { tipo: TIPO_SELECCION_MULTIPLE, pregunta: 'Lee: "El tren partió a las ocho de la mañana". ¿A qué hora partió el tren?', puntos: 15,
                                opciones: [{ texto: 'A las 8 de la mañana', esCorrecta: true }, { texto: 'A las 8 de la noche', esCorrecta: false }, { texto: 'A las 10 de la mañana', esCorrecta: false }] },
                        ],
                    },
                ],
            },
        ];
    }
    buildMedallasData(asignaturas) {
        const medallas = [];
        for (const asig of asignaturas) {
            for (const mod of asig.modulos) {
                const icono = asig.nombre === 'Matemáticas' ? 'math_star' : 'book_star';
                medallas.push({
                    titulo: this.tituloMedallaPara(mod.titulo),
                    descripcion: `Otorgada por completar todos los desafíos del módulo "${mod.titulo}".`,
                    iconoUrl: icono,
                    criterio: `Completar ${mod.titulo}`,
                });
            }
        }
        return medallas;
    }
    tituloMedallaPara(tituloModulo) {
        const map = {
            'Suma y Resta Aventura': 'Matemático Estrella',
            'Multiplicación Mágica': 'Maestro de la Multiplicación',
            'Figuras Geométricas': 'Explorador de Figuras',
            'Fracciones y Lógica': 'Cazador de Fracciones',
            'Cazadores de Sinónimos': 'Rey de las Palabras',
            'Ortografía en Acción': 'Corrector Ortográfico',
            'Gramática Espacial': 'Gran Lector',
            'Super Comprensión': 'Lector Comprensivo',
        };
        return map[tituloModulo] ?? `Experto en ${tituloModulo}`;
    }
};
exports.DesafiosService = DesafiosService;
exports.DesafiosService = DesafiosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DesafiosService);
//# sourceMappingURL=desafios.service.js.map