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
exports.MaestrosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const ESTADOS_ASISTENCIA = ['PRESENTE', 'AUSENTE', 'TARDANZA', 'JUSTIFICADO'];
const ESTADOS_TAREA = ['ACTIVA', 'CERRADA', 'BORRADOR'];
let MaestrosService = class MaestrosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crearSeccion(data) {
        const maestro = await this.prisma.usuario.findFirst({
            where: { id: data.maestroId, rol: 'MAESTRO' },
        });
        if (!maestro)
            throw new common_1.BadRequestException('Maestro no encontrado');
        return this.prisma.seccion.create({
            data: {
                nombre: data.nombre,
                grado: data.grado ?? 3,
                maestroId: data.maestroId,
                asignaturaId: data.asignaturaId ?? null,
                anioEscolar: data.anioEscolar ?? new Date().getFullYear(),
            },
            include: { _count: { select: { inscripciones: true, tareas: true } } },
        });
    }
    async obtenerSeccionesDeMaestro(maestroId) {
        return this.prisma.seccion.findMany({
            where: { maestroId, activa: true },
            include: {
                asignatura: { select: { id: true, nombre: true } },
                _count: { select: { inscripciones: true, tareas: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async obtenerSeccion(id) {
        const seccion = await this.prisma.seccion.findUnique({
            where: { id },
            include: {
                asignatura: true,
                _count: { select: { inscripciones: true, tareas: true } },
            },
        });
        if (!seccion)
            throw new common_1.NotFoundException('Sección no encontrada');
        return seccion;
    }
    async actualizarSeccion(id, data) {
        return this.prisma.seccion.update({
            where: { id },
            data,
            include: { _count: { select: { inscripciones: true, tareas: true } } },
        });
    }
    async eliminarSeccion(id) {
        return this.prisma.seccion.update({
            where: { id },
            data: { activa: false },
        });
    }
    async inscribirEstudiante(seccionId, estudianteId) {
        const [seccion, estudiante] = await Promise.all([
            this.prisma.seccion.findUnique({ where: { id: seccionId } }),
            this.prisma.usuario.findFirst({
                where: { id: estudianteId, rol: 'ESTUDIANTE' },
            }),
        ]);
        if (!seccion)
            throw new common_1.NotFoundException('Sección no encontrada');
        if (!estudiante)
            throw new common_1.NotFoundException('Estudiante no encontrado');
        const existente = await this.prisma.inscripcion.findUnique({
            where: { seccionId_estudianteId: { seccionId, estudianteId } },
        });
        if (existente) {
            if (existente.activa)
                return { mensaje: 'Ya inscrito', inscripcion: existente };
            const reactivada = await this.prisma.inscripcion.update({
                where: { id: existente.id },
                data: { activa: true },
            });
            return { mensaje: 'Inscripción reactivada', inscripcion: reactivada };
        }
        const inscripcion = await this.prisma.inscripcion.create({
            data: { seccionId, estudianteId },
        });
        return { mensaje: 'Estudiante inscrito', inscripcion };
    }
    async desinscribirEstudiante(seccionId, estudianteId) {
        await this.prisma.inscripcion.updateMany({
            where: { seccionId, estudianteId },
            data: { activa: false },
        });
        return { mensaje: 'Estudiante desinscrito' };
    }
    async obtenerEstudiantesDeSeccion(seccionId) {
        const inscripciones = await this.prisma.inscripcion.findMany({
            where: { seccionId, activa: true },
            include: {
                estudiante: {
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
            orderBy: { estudiante: { nombre: 'asc' } },
        });
        return inscripciones.map((i) => i.estudiante);
    }
    async crearTarea(data) {
        const [seccion, desafio] = await Promise.all([
            this.prisma.seccion.findUnique({ where: { id: data.seccionId } }),
            this.prisma.desafio.findUnique({ where: { id: data.desafioId } }),
        ]);
        if (!seccion)
            throw new common_1.NotFoundException('Sección no encontrada');
        if (!desafio)
            throw new common_1.NotFoundException('Desafío no encontrado');
        const fechaLimite = new Date(data.fechaLimite);
        if (isNaN(fechaLimite.getTime())) {
            throw new common_1.BadRequestException('fechaLimite inválida');
        }
        return this.prisma.tarea.create({
            data: {
                seccionId: data.seccionId,
                desafioId: data.desafioId,
                titulo: data.titulo,
                descripcion: data.descripcion ?? null,
                fechaLimite,
            },
            include: {
                desafio: { select: { id: true, pregunta: true, puntos: true } },
                seccion: { select: { id: true, nombre: true } },
                _count: { select: { entregas: true, calificaciones: true } },
            },
        });
    }
    async obtenerTareasDeSeccion(seccionId) {
        return this.prisma.tarea.findMany({
            where: { seccionId },
            include: {
                desafio: { select: { id: true, pregunta: true, puntos: true } },
                _count: { select: { entregas: true, calificaciones: true } },
            },
            orderBy: { fechaAsignada: 'desc' },
        });
    }
    async obtenerTarea(id) {
        const tarea = await this.prisma.tarea.findUnique({
            where: { id },
            include: {
                desafio: { include: { opciones: true } },
                seccion: true,
                entregas: {
                    include: { estudiante: { select: { id: true, nombre: true } } },
                },
                calificaciones: {
                    include: { estudiante: { select: { id: true, nombre: true } } },
                },
            },
        });
        if (!tarea)
            throw new common_1.NotFoundException('Tarea no encontrada');
        return tarea;
    }
    async actualizarTarea(id, data) {
        const updateData = {};
        if (data.titulo !== undefined)
            updateData.titulo = data.titulo;
        if (data.descripcion !== undefined)
            updateData.descripcion = data.descripcion;
        if (data.fechaLimite !== undefined) {
            const fecha = new Date(data.fechaLimite);
            if (isNaN(fecha.getTime()))
                throw new common_1.BadRequestException('fechaLimite inválida');
            updateData.fechaLimite = fecha;
        }
        if (data.estado !== undefined) {
            if (!ESTADOS_TAREA.includes(data.estado)) {
                throw new common_1.BadRequestException(`Estado inválido. Debe ser uno de: ${ESTADOS_TAREA.join(', ')}`);
            }
            updateData.estado = data.estado;
        }
        return this.prisma.tarea.update({ where: { id }, data: updateData });
    }
    async cerrarTarea(id) {
        return this.prisma.tarea.update({ where: { id }, data: { estado: 'CERRADA' } });
    }
    async eliminarTarea(id) {
        return this.prisma.tarea.delete({ where: { id } });
    }
    async registrarCalificacion(data) {
        if (data.nota < 0 || data.nota > 100) {
            throw new common_1.BadRequestException('La nota debe estar entre 0 y 100');
        }
        const [tarea, estudiante] = await Promise.all([
            this.prisma.tarea.findUnique({ where: { id: data.tareaId } }),
            this.prisma.usuario.findFirst({ where: { id: data.estudianteId, rol: 'ESTUDIANTE' } }),
        ]);
        if (!tarea)
            throw new common_1.NotFoundException('Tarea no encontrada');
        if (!estudiante)
            throw new common_1.NotFoundException('Estudiante no encontrado');
        const existente = await this.prisma.calificacion.findUnique({
            where: { tareaId_estudianteId: { tareaId: data.tareaId, estudianteId: data.estudianteId } },
        });
        if (existente) {
            return this.prisma.calificacion.update({
                where: { id: existente.id },
                data: { nota: data.nota, comentario: data.comentario ?? null, maestroId: data.maestroId },
            });
        }
        return this.prisma.calificacion.create({
            data: {
                tareaId: data.tareaId,
                estudianteId: data.estudianteId,
                nota: data.nota,
                comentario: data.comentario ?? null,
                maestroId: data.maestroId,
            },
        });
    }
    async obtenerCalificacionesDeTarea(tareaId) {
        return this.prisma.calificacion.findMany({
            where: { tareaId },
            include: { estudiante: { select: { id: true, nombre: true } } },
        });
    }
    async obtenerCalificacionesDeEstudiante(estudianteId) {
        return this.prisma.calificacion.findMany({
            where: { estudianteId },
            include: { tarea: { select: { id: true, titulo: true, seccion: { select: { nombre: true } } } } },
            orderBy: { calificadaEn: 'desc' },
        });
    }
    async registrarAsistenciaBatch(registros) {
        const resultados = [];
        for (const r of registros) {
            if (!ESTADOS_ASISTENCIA.includes(r.estado)) {
                throw new common_1.BadRequestException(`Estado inválido: ${r.estado}`);
            }
            const fecha = new Date(r.fecha);
            if (isNaN(fecha.getTime()))
                throw new common_1.BadRequestException(`Fecha inválida: ${r.fecha}`);
            const existente = await this.prisma.asistencia.findUnique({
                where: { seccionId_estudianteId_fecha: { seccionId: r.seccionId, estudianteId: r.estudianteId, fecha } },
            });
            if (existente) {
                const upd = await this.prisma.asistencia.update({
                    where: { id: existente.id },
                    data: { estado: r.estado, observacion: r.observacion ?? null },
                });
                resultados.push(upd);
            }
            else {
                const creada = await this.prisma.asistencia.create({
                    data: { seccionId: r.seccionId, estudianteId: r.estudianteId, fecha, estado: r.estado, observacion: r.observacion ?? null },
                });
                resultados.push(creada);
            }
        }
        return { mensaje: `${resultados.length} registros guardados`, registros: resultados };
    }
    async obtenerAsistenciaDeSeccion(seccionId, fecha) {
        const where = { seccionId };
        if (fecha) {
            const f = new Date(fecha);
            if (!isNaN(f.getTime()))
                where.fecha = f;
        }
        return this.prisma.asistencia.findMany({
            where,
            include: { estudiante: { select: { id: true, nombre: true } } },
            orderBy: { fecha: 'desc' },
        });
    }
    async obtenerAsistenciaDeEstudiante(estudianteId) {
        const registros = await this.prisma.asistencia.findMany({
            where: { estudianteId },
            orderBy: { fecha: 'desc' },
        });
        const total = registros.length;
        const presentes = registros.filter((r) => r.estado === 'PRESENTE').length;
        const tardanzas = registros.filter((r) => r.estado === 'TARDANZA').length;
        const ausentes = registros.filter((r) => r.estado === 'AUSENTE').length;
        const justificados = registros.filter((r) => r.estado === 'JUSTIFICADO').length;
        const porcentaje = total === 0 ? 0 : Math.round(((presentes + 0.5 * tardanzas + justificados) / total) * 100);
        return { registros, resumen: { total, presentes, tardanzas, ausentes, justificados, porcentaje } };
    }
    async actualizarAsistencia(id, data) {
        if (data.estado && !ESTADOS_ASISTENCIA.includes(data.estado)) {
            throw new common_1.BadRequestException(`Estado inválido. Debe ser uno de: ${ESTADOS_ASISTENCIA.join(', ')}`);
        }
        return this.prisma.asistencia.update({ where: { id }, data });
    }
    async resumenSeccion(seccionId) {
        const seccion = await this.prisma.seccion.findUnique({
            where: { id: seccionId },
            include: {
                asignatura: { include: { modulos: { include: { desafios: { select: { id: true } } } } } },
                inscripciones: {
                    where: { activa: true },
                    include: { estudiante: { select: { id: true, nombre: true, puntos: true, experiencia: true } } },
                },
                tareas: { include: { _count: { select: { entregas: true, calificaciones: true } } } },
            },
        });
        if (!seccion)
            throw new common_1.NotFoundException('Sección no encontrada');
        const totalEstudiantes = seccion.inscripciones.length;
        const totalTareas = seccion.tareas.length;
        const tareasActivas = seccion.tareas.filter((t) => t.estado === 'ACTIVA').length;
        const desafioIds = seccion.asignatura
            ? seccion.asignatura.modulos.flatMap((m) => m.desafios.map((d) => d.id))
            : [];
        const totalDesafios = desafioIds.length;
        let promedioProgreso = 0;
        let promedioNotas = 0;
        if (totalEstudiantes > 0) {
            const progresos = await this.prisma.progresoEstudiante.findMany({
                where: { desafioId: { in: desafioIds }, completado: true },
            });
            const porEstudiante = seccion.inscripciones.map((i) => {
                const completados = progresos.filter((p) => p.usuarioId === i.estudiante.id).length;
                return totalDesafios === 0 ? 0 : Math.round((completados / totalDesafios) * 100);
            });
            promedioProgreso = porEstudiante.length
                ? Math.round(porEstudiante.reduce((s, n) => s + n, 0) / porEstudiante.length)
                : 0;
            const calificaciones = await this.prisma.calificacion.findMany({
                where: { tarea: { seccionId } },
            });
            promedioNotas = calificaciones.length
                ? Math.round((calificaciones.reduce((s, c) => s + c.nota, 0) / calificaciones.length) * 10) / 10
                : 0;
        }
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const asistenciasHoy = await this.prisma.asistencia.findMany({
            where: { seccionId, fecha: hoy },
        });
        const presentesHoy = asistenciasHoy.filter((a) => a.estado === 'PRESENTE').length;
        const porcentajeAsistencia = totalEstudiantes === 0 ? 0 : Math.round((presentesHoy / totalEstudiantes) * 100);
        return {
            seccion: {
                id: seccion.id,
                nombre: seccion.nombre,
                grado: seccion.grado,
                asignatura: seccion.asignatura ? { id: seccion.asignatura.id, nombre: seccion.asignatura.nombre } : null,
            },
            totalEstudiantes,
            totalTareas,
            tareasActivas,
            promedioProgreso,
            promedioNotas,
            porcentajeAsistencia,
            estudiantes: seccion.inscripciones.map((i) => ({
                id: i.estudiante.id,
                nombre: i.estudiante.nombre,
                puntos: i.estudiante.puntos,
                nivel: Math.floor((i.estudiante.experiencia ?? 0) / 100) + 1,
            })),
        };
    }
    async reporteEstudiante(estudianteId) {
        const estudiante = await this.prisma.usuario.findUnique({
            where: { id: estudianteId },
            include: { medallas: { include: { medalla: true } } },
        });
        if (!estudiante)
            throw new common_1.NotFoundException('Estudiante no encontrado');
        const asignaturas = await this.prisma.asignatura.findMany({
            include: { modulos: { include: { desafios: { select: { id: true, puntos: true } } } } },
        });
        const progresos = await this.prisma.progresoEstudiante.findMany({
            where: { usuarioId: estudianteId },
        });
        const progresoMap = new Map(progresos.map((p) => [p.desafioId, p]));
        const progresoPorAsignatura = asignaturas.map((a) => {
            const modulos = a.modulos.map((m) => {
                const total = m.desafios.length;
                let completados = 0;
                let puntosGanados = 0;
                for (const d of m.desafios) {
                    const p = progresoMap.get(d.id);
                    if (p && p.completado) {
                        completados += 1;
                        puntosGanados += p.puntosGanados;
                    }
                }
                return {
                    id: m.id,
                    titulo: m.titulo,
                    totalDesafios: total,
                    completados,
                    porcentaje: total === 0 ? 0 : Math.round((completados / total) * 100),
                };
            });
            const totalDesafios = modulos.reduce((s, m) => s + m.totalDesafios, 0);
            const completados = modulos.reduce((s, m) => s + m.completados, 0);
            return {
                id: a.id,
                nombre: a.nombre,
                totalDesafios,
                completados,
                porcentaje: totalDesafios === 0 ? 0 : Math.round((completados / totalDesafios) * 100),
                modulos,
            };
        });
        const calificaciones = await this.prisma.calificacion.findMany({
            where: { estudianteId },
            include: { tarea: { select: { id: true, titulo: true, seccion: { select: { nombre: true } } } } },
            orderBy: { calificadaEn: 'desc' },
        });
        const promedioNotas = calificaciones.length
            ? Math.round((calificaciones.reduce((s, c) => s + c.nota, 0) / calificaciones.length) * 10) / 10
            : 0;
        const entregas = await this.prisma.entregaTarea.findMany({
            where: { estudianteId },
            include: { tarea: { select: { titulo: true } } },
            orderBy: { entregadaEn: 'desc' },
        });
        const asistencias = await this.prisma.asistencia.findMany({
            where: { estudianteId },
            orderBy: { fecha: 'desc' },
        });
        const totalAsist = asistencias.length;
        const presentes = asistencias.filter((a) => a.estado === 'PRESENTE').length;
        const tardanzas = asistencias.filter((a) => a.estado === 'TARDANZA').length;
        const ausentes = asistencias.filter((a) => a.estado === 'AUSENTE').length;
        const justificados = asistencias.filter((a) => a.estado === 'JUSTIFICADO').length;
        const porcentajeAsistencia = totalAsist === 0 ? 0 : Math.round(((presentes + 0.5 * tardanzas + justificados) / totalAsist) * 100);
        const totalDesafiosGlobal = progresoPorAsignatura.reduce((s, a) => s + a.totalDesafios, 0);
        const completadosGlobal = progresoPorAsignatura.reduce((s, a) => s + a.completados, 0);
        const porcentajeGlobal = totalDesafiosGlobal === 0 ? 0 : Math.round((completadosGlobal / totalDesafiosGlobal) * 100);
        const estadoAvance = porcentajeGlobal >= 80 ? 'AL_DIA' : porcentajeGlobal >= 50 ? 'EN_PROGRESO' : 'REZAGADO';
        return {
            estudiante: {
                id: estudiante.id,
                nombre: estudiante.nombre,
                puntos: estudiante.puntos,
                experiencia: estudiante.experiencia,
                nivel: Math.floor((estudiante.experiencia ?? 0) / 100) + 1,
                monedas: estudiante.monedas,
                gemas: estudiante.gemas,
            },
            progresoPorAsignatura,
            calificaciones: calificaciones.map((c) => ({
                id: c.id,
                nota: c.nota,
                comentario: c.comentario,
                fecha: c.calificadaEn,
                tarea: c.tarea.titulo,
                seccion: c.tarea.seccion?.nombre ?? null,
            })),
            promedioNotas,
            entregas: entregas.map((e) => ({
                id: e.id,
                correcta: e.correcta,
                puntosGanados: e.puntosGanados,
                tarde: e.tarde,
                fecha: e.entregadaEn,
                tarea: e.tarea.titulo,
            })),
            asistencia: {
                total: totalAsist,
                presentes,
                tardanzas,
                ausentes,
                justificados,
                porcentaje: porcentajeAsistencia,
                registros: asistencias.slice(0, 10),
            },
            medallas: estudiante.medallas.map((m) => ({
                id: m.medalla.id,
                titulo: m.medalla.titulo,
                descripcion: m.medalla.descripcion,
                iconoUrl: m.medalla.iconoUrl,
                ganadaEn: m.ganadaEn,
            })),
            resumen: {
                porcentajeGlobal,
                estadoAvance,
                totalDesafios: totalDesafiosGlobal,
                completados: completadosGlobal,
            },
        };
    }
    async alertasMaestro(maestroId) {
        const secciones = await this.prisma.seccion.findMany({
            where: { maestroId, activa: true },
            select: { id: true, nombre: true },
        });
        const seccionIds = secciones.map((s) => s.id);
        if (seccionIds.length === 0) {
            return { tareasPorCalificar: 0, asistenciasPendientesHoy: 0, entregasTardias: 0, totalAlertas: 0 };
        }
        const tareas = await this.prisma.tarea.findMany({
            where: { seccionId: { in: seccionIds }, estado: 'ACTIVA' },
            select: { id: true },
        });
        const tareaIds = tareas.map((t) => t.id);
        const tareasPorCalificar = await this.prisma.entregaTarea.count({
            where: { tareaId: { in: tareaIds } },
        });
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const asistenciasHoy = await this.prisma.asistencia.findMany({
            where: { seccionId: { in: seccionIds }, fecha: hoy },
            select: { seccionId: true },
            distinct: ['seccionId'],
        });
        const seccionesConAsistenciaHoy = new Set(asistenciasHoy.map((a) => a.seccionId));
        const asistenciasPendientesHoy = secciones.filter((s) => !seccionesConAsistenciaHoy.has(s.id)).length;
        const entregasTardias = await this.prisma.entregaTarea.count({
            where: { tareaId: { in: tareaIds }, tarde: true },
        });
        const totalAlertas = tareasPorCalificar + asistenciasPendientesHoy + entregasTardias;
        return { tareasPorCalificar, asistenciasPendientesHoy, entregasTardias, totalAlertas };
    }
    async seedDemo(maestroId) {
        const maestro = await this.prisma.usuario.findFirst({
            where: { id: maestroId, rol: 'MAESTRO' },
        });
        if (!maestro)
            throw new common_1.NotFoundException('Maestro no encontrado');
        let seccion = await this.prisma.seccion.findFirst({
            where: { maestroId, nombre: '3ro A' },
        });
        if (!seccion) {
            const asignatura = await this.prisma.asignatura.findFirst({
                where: { maestroId },
            });
            seccion = await this.prisma.seccion.create({
                data: {
                    nombre: '3ro A',
                    grado: 3,
                    maestroId,
                    asignaturaId: asignatura?.id ?? null,
                    anioEscolar: new Date().getFullYear(),
                },
            });
        }
        const nombresEstudiantes = ['Ana López', 'Carlos Pérez', 'Lucía Martínez', 'Sofía Ramírez'];
        const estudiantesCreados = [];
        const demoKid = await this.prisma.usuario.findFirst({
            where: { nombre: 'DemoKid', rol: 'ESTUDIANTE' },
        });
        if (demoKid)
            estudiantesCreados.push(demoKid);
        for (const nombre of nombresEstudiantes) {
            let est = await this.prisma.usuario.findFirst({
                where: { nombre, rol: 'ESTUDIANTE' },
            });
            if (!est) {
                est = await this.prisma.usuario.create({
                    data: { nombre, pin: '1234', rol: 'ESTUDIANTE' },
                });
                await this.prisma.avatarConfig.create({ data: { usuarioId: est.id } });
            }
            estudiantesCreados.push(est);
        }
        for (const est of estudiantesCreados) {
            const existente = await this.prisma.inscripcion.findUnique({
                where: { seccionId_estudianteId: { seccionId: seccion.id, estudianteId: est.id } },
            });
            if (!existente) {
                await this.prisma.inscripcion.create({
                    data: { seccionId: seccion.id, estudianteId: est.id },
                });
            }
        }
        return {
            mensaje: 'Seed demo creado',
            seccion: { id: seccion.id, nombre: seccion.nombre },
            estudiantesInscritos: estudiantesCreados.length,
        };
    }
};
exports.MaestrosService = MaestrosService;
exports.MaestrosService = MaestrosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaestrosService);
//# sourceMappingURL=maestros.service.js.map