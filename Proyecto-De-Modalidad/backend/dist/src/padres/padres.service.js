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
exports.PadresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let PadresService = class PadresService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async obtenerHijos(padreId) {
        const vinculos = await this.prisma.padreHijo.findMany({
            where: { padreId, activo: true, verificado: true },
            include: {
                hijo: {
                    select: {
                        id: true,
                        nombre: true,
                        avatar: true,
                        puntos: true,
                        experiencia: true,
                        monedas: true,
                        gemas: true,
                        rol: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return vinculos.map((v) => ({
            ...v.hijo,
            parentesco: v.parentesco,
            verificado: v.verificado,
        }));
    }
    async solicitarVinculo(padreId, data) {
        const padre = await this.prisma.usuario.findFirst({ where: { id: padreId, rol: 'PADRE' } });
        if (!padre)
            throw new common_1.BadRequestException('Padre no encontrado');
        const hijo = await this.prisma.usuario.findFirst({
            where: { nombre: data.nombre, pin: data.pin, rol: 'ESTUDIANTE' },
        });
        if (!hijo)
            throw new common_1.NotFoundException('No encontramos un estudiante con ese nombre y PIN');
        const existente = await this.prisma.padreHijo.findUnique({
            where: { padreId_hijoId: { padreId, hijoId: hijo.id } },
        });
        if (existente) {
            if (!existente.activo) {
                return this.prisma.padreHijo.update({
                    where: { id: existente.id },
                    data: { activo: true },
                });
            }
            throw new common_1.BadRequestException('Ya tienes vinculado a este estudiante');
        }
        return this.prisma.padreHijo.create({
            data: {
                padreId,
                hijoId: hijo.id,
                parentesco: data.parentesco ?? 'OTRO',
                verificado: true,
                verificadoEn: new Date(),
                verificadoPor: padreId,
            },
        });
    }
    async vincularPorHijoId(padreId, hijoId, parentesco) {
        const padre = await this.prisma.usuario.findFirst({ where: { id: padreId, rol: 'PADRE' } });
        if (!padre)
            throw new common_1.BadRequestException('Padre no encontrado');
        const hijo = await this.prisma.usuario.findFirst({ where: { id: hijoId, rol: 'ESTUDIANTE' } });
        if (!hijo)
            throw new common_1.NotFoundException('Estudiante no encontrado');
        const existente = await this.prisma.padreHijo.findUnique({
            where: { padreId_hijoId: { padreId, hijoId } },
        });
        if (existente) {
            return this.prisma.padreHijo.update({
                where: { id: existente.id },
                data: { activo: true, verificado: true, verificadoEn: new Date() },
            });
        }
        return this.prisma.padreHijo.create({
            data: {
                padreId,
                hijoId,
                parentesco: parentesco ?? 'OTRO',
                verificado: true,
                verificadoEn: new Date(),
                verificadoPor: padreId,
            },
        });
    }
    async desvincularHijo(padreId, hijoId) {
        const vinculo = await this.prisma.padreHijo.findUnique({
            where: { padreId_hijoId: { padreId, hijoId } },
        });
        if (!vinculo)
            throw new common_1.NotFoundException('Vínculo no encontrado');
        return this.prisma.padreHijo.update({
            where: { id: vinculo.id },
            data: { activo: false },
        });
    }
    async verificarAccesoHijo(padreId, hijoId) {
        const vinculo = await this.prisma.padreHijo.findUnique({
            where: { padreId_hijoId: { padreId, hijoId } },
        });
        if (!vinculo || !vinculo.activo || !vinculo.verificado) {
            throw new common_1.ForbiddenException('No tienes acceso a este estudiante');
        }
        return vinculo;
    }
    async obtenerResumen(padreId, hijoId) {
        await this.verificarAccesoHijo(padreId, hijoId);
        const hijo = await this.prisma.usuario.findUnique({
            where: { id: hijoId },
            select: {
                id: true,
                nombre: true,
                avatar: true,
                puntos: true,
                experiencia: true,
                monedas: true,
                gemas: true,
            },
        });
        if (!hijo)
            throw new common_1.NotFoundException('Estudiante no encontrado');
        const nivel = Math.floor(hijo.experiencia / 100) + 1;
        const inscripciones = await this.prisma.inscripcion.findMany({
            where: { estudianteId: hijoId, activa: true },
            include: {
                seccion: {
                    select: {
                        id: true,
                        nombre: true,
                        grado: true,
                        asignatura: { select: { id: true, nombre: true } },
                        maestro: { select: { id: true, nombre: true } },
                    },
                },
            },
        });
        const secciones = inscripciones.map((i) => i.seccion);
        const seccionIds = secciones.map((s) => s.id);
        const tareasActivas = await this.prisma.tarea.findMany({
            where: {
                seccionId: { in: seccionIds },
                estado: 'ACTIVA',
            },
            include: {
                desafio: { select: { id: true, pregunta: true, puntos: true } },
                seccion: { select: { nombre: true, asignatura: { select: { nombre: true } } } },
                entregas: {
                    where: { estudianteId: hijoId },
                    select: { id: true, entregadaEn: true, tarde: true, correcta: true, puntosGanados: true },
                },
            },
            orderBy: { fechaLimite: 'asc' },
            take: 10,
        });
        const calificacionesRecientes = await this.prisma.calificacion.findMany({
            where: { estudianteId: hijoId },
            include: {
                tarea: {
                    select: {
                        id: true,
                        titulo: true,
                        seccion: { select: { asignatura: { select: { nombre: true } } } },
                    },
                },
            },
            orderBy: { calificadaEn: 'desc' },
            take: 5,
        });
        const todasCalificaciones = await this.prisma.calificacion.findMany({
            where: { estudianteId: hijoId },
            select: { nota: true },
        });
        const promedioNotas = todasCalificaciones.length > 0
            ? todasCalificaciones.reduce((s, c) => s + c.nota, 0) / todasCalificaciones.length
            : 0;
        const progresos = await this.prisma.progresoEstudiante.findMany({
            where: { usuarioId: hijoId },
            select: { completado: true },
        });
        const totalProgresos = progresos.length;
        const completados = progresos.filter((p) => p.completado).length;
        const porcentajeProgreso = totalProgresos > 0 ? (completados / totalProgresos) * 100 : 0;
        const ahora = new Date();
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        const asistenciasMes = await this.prisma.asistencia.findMany({
            where: { estudianteId: hijoId, fecha: { gte: inicioMes } },
            select: { estado: true },
        });
        const totalAsistencias = asistenciasMes.length;
        const presentes = asistenciasMes.filter((a) => a.estado === 'PRESENTE').length;
        const porcentajeAsistencia = totalAsistencias > 0 ? (presentes / totalAsistencias) * 100 : 100;
        const medallas = await this.prisma.medallaEstudiante.findMany({
            where: { usuarioId: hijoId },
            include: { medalla: { select: { id: true, titulo: true, descripcion: true, iconoUrl: true } } },
            orderBy: { ganadaEn: 'desc' },
        });
        const avisosNoLeidos = await this.prisma.aviso.findMany({
            where: {
                seccionId: { in: seccionIds },
                activo: true,
                lecturas: { none: { padreId } },
            },
            orderBy: [{ prioridad: 'desc' }, { fechaEnvio: 'desc' }],
            take: 5,
            include: {
                seccion: { select: { nombre: true } },
                maestro: { select: { nombre: true } },
            },
        });
        return {
            hijo,
            nivel,
            secciones,
            kpis: {
                promedioNotas: Math.round(promedioNotas * 10) / 10,
                porcentajeProgreso: Math.round(porcentajeProgreso),
                porcentajeAsistencia: Math.round(porcentajeAsistencia),
            },
            tareasActivas: tareasActivas.map((t) => ({
                ...t,
                entregada: t.entregas.length > 0,
                entrega: t.entregas[0] ?? null,
            })),
            calificacionesRecientes,
            medallas,
            avisosNoLeidos,
        };
    }
    async obtenerCalificaciones(padreId, hijoId, opts) {
        await this.verificarAccesoHijo(padreId, hijoId);
        const where = { estudianteId: hijoId };
        if (opts?.desde || opts?.hasta) {
            where.calificadaEn = {};
            if (opts?.desde)
                where.calificadaEn.gte = new Date(opts.desde);
            if (opts?.hasta)
                where.calificadaEn.lte = new Date(opts.hasta);
        }
        if (opts?.asignaturaId) {
            where.tarea = { seccion: { asignaturaId: opts.asignaturaId } };
        }
        const calificaciones = await this.prisma.calificacion.findMany({
            where,
            include: {
                tarea: {
                    select: {
                        id: true,
                        titulo: true,
                        fechaLimite: true,
                        seccion: {
                            select: {
                                id: true,
                                nombre: true,
                                asignatura: { select: { id: true, nombre: true } },
                            },
                        },
                    },
                },
            },
            orderBy: { calificadaEn: 'desc' },
        });
        const porAsignatura = {};
        for (const c of calificaciones) {
            const asig = c.tarea.seccion.asignatura;
            if (!asig)
                continue;
            if (!porAsignatura[asig.id]) {
                porAsignatura[asig.id] = { nombre: asig.nombre, notas: [] };
            }
            porAsignatura[asig.id].notas.push(c.nota);
        }
        const resumenPorAsignatura = Object.entries(porAsignatura).map(([id, v]) => ({
            asignaturaId: id,
            nombre: v.nombre,
            promedio: v.notas.length > 0 ? v.notas.reduce((s, n) => s + n, 0) / v.notas.length : 0,
            cantidad: v.notas.length,
        }));
        const todasNotas = calificaciones.map((c) => c.nota);
        const promedioGeneral = todasNotas.length > 0 ? todasNotas.reduce((s, n) => s + n, 0) / todasNotas.length : 0;
        return {
            calificaciones,
            promedioGeneral: Math.round(promedioGeneral * 10) / 10,
            resumenPorAsignatura,
            total: calificaciones.length,
        };
    }
    async obtenerAsistencia(padreId, hijoId, opts) {
        await this.verificarAccesoHijo(padreId, hijoId);
        const ahora = new Date();
        const mes = opts?.mes ?? ahora.getMonth();
        const anio = opts?.anio ?? ahora.getFullYear();
        const inicioMes = new Date(anio, mes, 1);
        const finMes = new Date(anio, mes + 1, 0, 23, 59, 59);
        const registros = await this.prisma.asistencia.findMany({
            where: {
                estudianteId: hijoId,
                fecha: { gte: inicioMes, lte: finMes },
            },
            include: {
                seccion: { select: { nombre: true, asignatura: { select: { nombre: true } } } },
            },
            orderBy: { fecha: 'asc' },
        });
        const conteo = {
            PRESENTE: 0,
            AUSENTE: 0,
            TARDANZA: 0,
            JUSTIFICADO: 0,
        };
        for (const r of registros) {
            conteo[r.estado] = (conteo[r.estado] || 0) + 1;
        }
        const total = registros.length;
        const porcentaje = total > 0 ? (conteo.PRESENTE / total) * 100 : 100;
        return {
            mes,
            anio,
            registros,
            conteo,
            total,
            porcentaje: Math.round(porcentaje),
        };
    }
    async obtenerAvisos(padreId, opts) {
        const vinculos = await this.prisma.padreHijo.findMany({
            where: { padreId, activo: true, verificado: true },
            select: { hijoId: true },
        });
        const hijoIds = vinculos.map((v) => v.hijoId);
        const inscripciones = await this.prisma.inscripcion.findMany({
            where: { estudianteId: { in: hijoIds }, activa: true },
            select: { seccionId: true },
        });
        const seccionIds = inscripciones.map((i) => i.seccionId);
        const where = { seccionId: { in: seccionIds }, activo: true };
        if (opts?.tipo)
            where.tipo = opts.tipo;
        const avisos = await this.prisma.aviso.findMany({
            where,
            include: {
                seccion: {
                    select: {
                        id: true,
                        nombre: true,
                        asignatura: { select: { nombre: true } },
                        inscripciones: {
                            where: { estudianteId: { in: hijoIds }, activa: true },
                            select: { estudianteId: true },
                        },
                    },
                },
                maestro: { select: { id: true, nombre: true } },
                lecturas: { where: { padreId } },
            },
            orderBy: [{ prioridad: 'desc' }, { fechaEnvio: 'desc' }],
            take: 50,
        });
        const resultado = avisos.map((a) => ({
            ...a,
            leido: a.lecturas.length > 0,
            firmado: a.lecturas[0]?.firmado ?? false,
            hijosDestinatarios: a.seccion.inscripciones.map((i) => i.estudianteId),
        }));
        if (opts?.soloNoLeidos) {
            return resultado.filter((a) => !a.leido);
        }
        return resultado;
    }
    async marcarAvisoLeido(padreId, avisoId) {
        const aviso = await this.prisma.aviso.findUnique({ where: { id: avisoId } });
        if (!aviso)
            throw new common_1.NotFoundException('Aviso no encontrado');
        const existente = await this.prisma.avisoLeido.findUnique({
            where: { avisoId_padreId: { avisoId, padreId } },
        });
        if (existente)
            return existente;
        return this.prisma.avisoLeido.create({
            data: { avisoId, padreId, leidoEn: new Date() },
        });
    }
    async firmarAviso(padreId, avisoId) {
        const aviso = await this.prisma.aviso.findUnique({ where: { id: avisoId } });
        if (!aviso)
            throw new common_1.NotFoundException('Aviso no encontrado');
        if (!aviso.requiereFirma) {
            throw new common_1.BadRequestException('Este aviso no requiere firma');
        }
        const existente = await this.prisma.avisoLeido.findUnique({
            where: { avisoId_padreId: { avisoId, padreId } },
        });
        if (existente) {
            return this.prisma.avisoLeido.update({
                where: { id: existente.id },
                data: { firmado: true, firmaEn: new Date(), leidoEn: existente.leidoEn ?? new Date() },
            });
        }
        return this.prisma.avisoLeido.create({
            data: {
                avisoId,
                padreId,
                leidoEn: new Date(),
                firmado: true,
                firmaEn: new Date(),
            },
        });
    }
    async obtenerConversaciones(padreId) {
        const conversaciones = await this.prisma.conversacion.findMany({
            where: { padreId },
            include: {
                maestro: { select: { id: true, nombre: true, avatar: true } },
                hijo: { select: { id: true, nombre: true } },
                seccion: { select: { id: true, nombre: true, asignatura: { select: { nombre: true } } } },
                mensajes: {
                    orderBy: { enviadoEn: 'desc' },
                    take: 1,
                    select: { cuerpo: true, enviadoEn: true, remitenteId: true, leidoEn: true },
                },
            },
            orderBy: { ultimaActividad: 'desc' },
        });
        const conNoLeidos = await Promise.all(conversaciones.map(async (c) => {
            const noLeidos = await this.prisma.mensaje.count({
                where: {
                    conversacionId: c.id,
                    remitenteId: { not: padreId },
                    leidoEn: null,
                },
            });
            return { ...c, noLeidos };
        }));
        return conNoLeidos;
    }
    async obtenerConversacion(padreId, conversacionId) {
        const conv = await this.prisma.conversacion.findUnique({
            where: { id: conversacionId },
            include: {
                maestro: { select: { id: true, nombre: true, avatar: true } },
                hijo: { select: { id: true, nombre: true } },
                seccion: { select: { id: true, nombre: true, asignatura: { select: { nombre: true } } } },
            },
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversación no encontrada');
        if (conv.padreId !== padreId)
            throw new common_1.ForbiddenException('Sin acceso a esta conversación');
        const mensajes = await this.prisma.mensaje.findMany({
            where: { conversacionId },
            include: {
                remitente: { select: { id: true, nombre: true, avatar: true } },
            },
            orderBy: { enviadoEn: 'asc' },
        });
        await this.prisma.mensaje.updateMany({
            where: {
                conversacionId,
                remitenteId: { not: padreId },
                leidoEn: null,
            },
            data: { leidoEn: new Date() },
        });
        return { ...conv, mensajes };
    }
    async enviarMensaje(padreId, conversacionId, cuerpo) {
        const conv = await this.prisma.conversacion.findUnique({
            where: { id: conversacionId },
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversación no encontrada');
        if (conv.padreId !== padreId)
            throw new common_1.ForbiddenException('Sin acceso a esta conversación');
        if (!cuerpo?.trim())
            throw new common_1.BadRequestException('El mensaje no puede estar vacío');
        const mensaje = await this.prisma.mensaje.create({
            data: {
                conversacionId,
                remitenteId: padreId,
                cuerpo: cuerpo.trim(),
            },
            include: {
                remitente: { select: { id: true, nombre: true, avatar: true } },
            },
        });
        await this.prisma.conversacion.update({
            where: { id: conversacionId },
            data: { ultimaActividad: new Date() },
        });
        await this.prisma.notificacion.create({
            data: {
                usuarioId: conv.maestroId,
                tipo: 'MENSAJE_DOCENTE',
                titulo: '💬 Nuevo mensaje de padre',
                cuerpo: `${cuerpo.slice(0, 80)}${cuerpo.length > 80 ? '...' : ''}`,
                data: JSON.stringify({ conversacionId, padreId, hijoId: conv.hijoId }),
            },
        });
        return mensaje;
    }
    async iniciarConversacion(padreId, data) {
        await this.verificarAccesoHijo(padreId, data.hijoId);
        const seccionesMaestro = await this.prisma.seccion.findMany({
            where: {
                maestroId: data.maestroId,
                inscripciones: { some: { estudianteId: data.hijoId, activa: true } },
            },
            select: { id: true },
        });
        if (seccionesMaestro.length === 0) {
            throw new common_1.BadRequestException('Este maestro no enseña a tu hijo/a');
        }
        const seccionId = data.seccionId ?? seccionesMaestro[0].id;
        const existente = await this.prisma.conversacion.findUnique({
            where: {
                padreId_maestroId_hijoId: {
                    padreId,
                    maestroId: data.maestroId,
                    hijoId: data.hijoId,
                },
            },
        });
        if (existente) {
            return this.obtenerConversacion(padreId, existente.id);
        }
        const conv = await this.prisma.conversacion.create({
            data: {
                padreId,
                maestroId: data.maestroId,
                hijoId: data.hijoId,
                seccionId,
                asunto: data.asunto,
            },
        });
        if (data.mensajeInicial?.trim()) {
            await this.prisma.mensaje.create({
                data: {
                    conversacionId: conv.id,
                    remitenteId: padreId,
                    cuerpo: data.mensajeInicial.trim(),
                },
            });
            await this.prisma.conversacion.update({
                where: { id: conv.id },
                data: { ultimaActividad: new Date() },
            });
        }
        return this.obtenerConversacion(padreId, conv.id);
    }
    async obtenerNotificaciones(padreId, opts) {
        const where = { usuarioId: padreId };
        if (opts?.soloNoLeidos)
            where.leida = false;
        return this.prisma.notificacion.findMany({
            where,
            orderBy: { creadaEn: 'desc' },
            take: 50,
        });
    }
    async marcarNotificacionLeida(padreId, notificacionId) {
        const notif = await this.prisma.notificacion.findUnique({
            where: { id: notificacionId },
        });
        if (!notif)
            throw new common_1.NotFoundException('Notificación no encontrada');
        if (notif.usuarioId !== padreId)
            throw new common_1.ForbiddenException('Sin acceso');
        return this.prisma.notificacion.update({
            where: { id: notificacionId },
            data: { leida: true },
        });
    }
    async marcarTodasLeidas(padreId) {
        const result = await this.prisma.notificacion.updateMany({
            where: { usuarioId: padreId, leida: false },
            data: { leida: true },
        });
        return { actualizadas: result.count };
    }
    async suscribirPush(padreId, data) {
        const existente = await this.prisma.pushSubscription.findUnique({
            where: { endpoint: data.endpoint },
        });
        if (existente) {
            return this.prisma.pushSubscription.update({
                where: { id: existente.id },
                data: { usuarioId: padreId, activa: true, dispositivo: data.dispositivo },
            });
        }
        return this.prisma.pushSubscription.create({
            data: {
                usuarioId: padreId,
                endpoint: data.endpoint,
                p256dh: data.p256dh,
                auth: data.auth,
                dispositivo: data.dispositivo,
            },
        });
    }
    async desuscribirPush(padreId, endpoint) {
        const sub = await this.prisma.pushSubscription.findUnique({
            where: { endpoint },
        });
        if (!sub)
            return { ok: true };
        if (sub.usuarioId !== padreId)
            throw new common_1.ForbiddenException('Sin acceso');
        return this.prisma.pushSubscription.update({
            where: { id: sub.id },
            data: { activa: false },
        });
    }
    async obtenerTareasHijo(padreId, hijoId, opts) {
        await this.verificarAccesoHijo(padreId, hijoId);
        const inscripciones = await this.prisma.inscripcion.findMany({
            where: { estudianteId: hijoId, activa: true },
            select: { seccionId: true },
        });
        const seccionIds = inscripciones.map((i) => i.seccionId);
        const where = { seccionId: { in: seccionIds } };
        if (opts?.estado)
            where.estado = opts.estado;
        return this.prisma.tarea.findMany({
            where,
            include: {
                desafio: { select: { id: true, pregunta: true, puntos: true } },
                seccion: {
                    select: {
                        id: true,
                        nombre: true,
                        asignatura: { select: { id: true, nombre: true } },
                    },
                },
                entregas: {
                    where: { estudianteId: hijoId },
                    select: { id: true, entregadaEn: true, tarde: true, correcta: true, puntosGanados: true },
                },
                calificaciones: {
                    where: { estudianteId: hijoId },
                    select: { nota: true, comentario: true, calificadaEn: true },
                },
            },
            orderBy: { fechaLimite: 'asc' },
        });
    }
    async obtenerMedallasHijo(padreId, hijoId) {
        await this.verificarAccesoHijo(padreId, hijoId);
        const ganadas = await this.prisma.medallaEstudiante.findMany({
            where: { usuarioId: hijoId },
            include: { medalla: true },
            orderBy: { ganadaEn: 'desc' },
        });
        const todas = await this.prisma.medalla.findMany();
        const ganadasIds = new Set(ganadas.map((g) => g.medallaId));
        return {
            ganadas,
            bloqueadas: todas.filter((m) => !ganadasIds.has(m.id)),
            total: todas.length,
            desbloqueadas: ganadas.length,
        };
    }
    async seedPadreDemo(padreId) {
        const padre = await this.prisma.usuario.findFirst({ where: { id: padreId, rol: 'PADRE' } });
        if (!padre)
            throw new common_1.BadRequestException('Padre no encontrado');
        const hijo = await this.prisma.usuario.findFirst({
            where: { nombre: 'DemoKid', rol: 'ESTUDIANTE' },
        });
        if (!hijo)
            throw new common_1.NotFoundException('DemoKid no encontrado. Inicia sesión como estudiante primero.');
        const vinculoExistente = await this.prisma.padreHijo.findUnique({
            where: { padreId_hijoId: { padreId, hijoId: hijo.id } },
        });
        if (!vinculoExistente) {
            await this.prisma.padreHijo.create({
                data: {
                    padreId,
                    hijoId: hijo.id,
                    parentesco: 'PADRE',
                    verificado: true,
                    verificadoEn: new Date(),
                    verificadoPor: padreId,
                },
            });
        }
        else if (!vinculoExistente.verificado) {
            await this.prisma.padreHijo.update({
                where: { id: vinculoExistente.id },
                data: {
                    verificado: true,
                    verificadoEn: new Date(),
                    verificadoPor: padreId,
                    activo: true,
                },
            });
        }
        const inscripcion = await this.prisma.inscripcion.findFirst({
            where: { estudianteId: hijo.id, activa: true },
            include: { seccion: true },
        });
        if (inscripcion) {
            const seccion = inscripcion.seccion;
            const avisosExistentes = await this.prisma.aviso.count({ where: { seccionId: seccion.id } });
            if (avisosExistentes === 0) {
                await this.prisma.aviso.createMany({
                    data: [
                        {
                            seccionId: seccion.id,
                            maestroId: seccion.maestroId,
                            tipo: 'URGENTE',
                            titulo: 'Reunión de padres',
                            contenido: 'Estimados padres, les invitamos a la reunión general del jueves 15 de agosto a las 5:00 PM. Hablaremos sobre el progreso académico del bimestre.',
                            prioridad: 3,
                            fechaEvento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                            requiereFirma: true,
                        },
                        {
                            seccionId: seccion.id,
                            maestroId: seccion.maestroId,
                            tipo: 'RECORDATORIO',
                            titulo: 'Entrega de boletas',
                            contenido: 'Las boletas del segundo bimestre se entregarán el viernes. Favor de pasar a recogerlas en horario de 8:00 AM a 12:00 MD.',
                            prioridad: 2,
                        },
                        {
                            seccionId: seccion.id,
                            maestroId: seccion.maestroId,
                            tipo: 'EVENTO',
                            titulo: 'Día del estudiante',
                            contenido: 'El viernes 23 de agosto celebraremos el Día del Estudiante. Los niños pueden venir con ropa deportiva.',
                            prioridad: 1,
                            fechaEvento: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                        },
                    ],
                });
            }
            const convExistente = await this.prisma.conversacion.findUnique({
                where: {
                    padreId_maestroId_hijoId: {
                        padreId,
                        maestroId: seccion.maestroId,
                        hijoId: hijo.id,
                    },
                },
            });
            if (!convExistente) {
                const conv = await this.prisma.conversacion.create({
                    data: {
                        padreId,
                        maestroId: seccion.maestroId,
                        hijoId: hijo.id,
                        seccionId: seccion.id,
                        asunto: 'Sobre el progreso de DemoKid',
                    },
                });
                await this.prisma.mensaje.create({
                    data: {
                        conversacionId: conv.id,
                        remitenteId: seccion.maestroId,
                        cuerpo: 'Hola, queríamos comentarle que DemoKid ha mejorado mucho en fracciones esta semana. ¡Felicitaciones por el apoyo en casa!',
                        enviadoEn: new Date(Date.now() - 60 * 60 * 1000),
                    },
                });
            }
        }
        const notifsExistentes = await this.prisma.notificacion.count({ where: { usuarioId: padreId } });
        if (notifsExistentes === 0) {
            await this.prisma.notificacion.createMany({
                data: [
                    {
                        usuarioId: padreId,
                        tipo: 'NUEVO_AVISO',
                        titulo: '📢 Nuevo aviso urgente',
                        cuerpo: 'Reunión de padres — Jueves 15 de agosto, 5:00 PM',
                        data: JSON.stringify({ tipo: 'aviso' }),
                        creadaEn: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    },
                    {
                        usuarioId: padreId,
                        tipo: 'MENSAJE_DOCENTE',
                        titulo: '💬 Nuevo mensaje de la maestra',
                        cuerpo: 'DemoKid ha mejorado mucho en fracciones esta semana...',
                        data: JSON.stringify({ tipo: 'mensaje' }),
                        creadaEn: new Date(Date.now() - 60 * 60 * 1000),
                    },
                    {
                        usuarioId: padreId,
                        tipo: 'LOGRO',
                        titulo: '🏆 ¡DemoKid ganó una medalla!',
                        cuerpo: 'Desbloqueó: Maestro de las Fracciones.',
                        data: JSON.stringify({ tipo: 'logro' }),
                        creadaEn: new Date(Date.now() - 24 * 60 * 60 * 1000),
                        leida: true,
                    },
                ],
            });
        }
        return { ok: true, mensaje: 'Seed de padre demo completado' };
    }
};
exports.PadresService = PadresService;
exports.PadresService = PadresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PadresService);
//# sourceMappingURL=padres.service.js.map