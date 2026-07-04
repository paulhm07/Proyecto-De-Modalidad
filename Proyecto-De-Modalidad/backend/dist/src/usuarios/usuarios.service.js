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
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const ROLES_VALIDOS = ['ESTUDIANTE', 'PADRE', 'MAESTRO'];
let UsuariosService = class UsuariosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(nombre, pin, rol) {
        if (!ROLES_VALIDOS.includes(rol)) {
            throw new common_1.BadRequestException(`Rol inválido. Debe ser uno de: ${ROLES_VALIDOS.join(', ')}`);
        }
        const existente = await this.prisma.usuario.findFirst({
            where: { nombre, rol },
        });
        if (existente) {
            throw new common_1.BadRequestException('Ya existe un usuario con ese nombre y rol');
        }
        const usuario = await this.prisma.usuario.create({
            data: { nombre, pin, rol },
            include: { avatarConfig: true },
        });
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
    async validatePin(nombre, pin, rol) {
        const where = { nombre };
        if (rol)
            where.rol = rol;
        const usuario = await this.prisma.usuario.findFirst({ where });
        if (!usuario || usuario.pin !== pin) {
            throw new common_1.UnauthorizedException('Nombre, PIN o rol incorrectos');
        }
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
    async getUserProfile(id) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id },
            include: { avatarConfig: true },
        });
        if (!usuario)
            throw new common_1.NotFoundException('Usuario no encontrado');
        return usuario;
    }
    DEMO_CREDENCIALES = {
        ESTUDIANTE: { nombre: 'DemoKid', pin: '1111' },
        PADRE: { nombre: 'PadreDemo', pin: '1234' },
        MAESTRO: { nombre: 'MaestroDemo', pin: '1234' },
    };
    async loginDemo(rol) {
        if (!ROLES_VALIDOS.includes(rol)) {
            throw new common_1.BadRequestException(`Rol inválido. Debe ser uno de: ${ROLES_VALIDOS.join(', ')}`);
        }
        const cred = this.DEMO_CREDENCIALES[rol];
        let usuario = await this.prisma.usuario.findFirst({
            where: { nombre: cred.nombre, rol },
        });
        if (!usuario) {
            usuario = await this.prisma.usuario.create({
                data: { nombre: cred.nombre, pin: cred.pin, rol },
            });
        }
        else {
            if (usuario.pin !== cred.pin) {
                usuario = await this.prisma.usuario.update({
                    where: { id: usuario.id },
                    data: { pin: cred.pin },
                });
            }
        }
        if (rol === 'ESTUDIANTE') {
            const config = await this.prisma.avatarConfig.findUnique({
                where: { usuarioId: usuario.id },
            });
            if (!config) {
                await this.prisma.avatarConfig.create({
                    data: { usuarioId: usuario.id },
                });
            }
        }
        else if (rol === 'PADRE') {
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
        }
        else if (rol === 'MAESTRO') {
            await this.prisma.asignatura.updateMany({
                where: {},
                data: { maestroId: usuario.id },
            });
        }
        const resultado = await this.prisma.usuario.findUnique({
            where: { id: usuario.id },
            include: { avatarConfig: rol === 'ESTUDIANTE' },
        });
        return resultado;
    }
    async getProgresoEstudiante(id) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id },
            include: {
                medallas: { include: { medalla: true } },
            },
        });
        if (!usuario)
            throw new common_1.NotFoundException('Usuario no encontrado');
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
        const progresoMap = new Map();
        for (const p of progresos)
            progresoMap.set(p.desafioId, p);
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
                const porcentajeCompletado = totalDesafios === 0 ? 0 : Math.round((completados / totalDesafios) * 100);
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
            const porcentajeCompletado = totalDesafios === 0 ? 0 : Math.round((completados / totalDesafios) * 100);
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
    async getHijosDePadre(padreId) {
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
    async vincularHijo(padreId, data) {
        let hijo;
        if (data.hijoId) {
            hijo = await this.prisma.usuario.findUnique({
                where: { id: data.hijoId },
            });
            if (!hijo || hijo.rol !== 'ESTUDIANTE') {
                throw new common_1.NotFoundException('Estudiante no encontrado');
            }
        }
        else {
            if (!data.nombre || !data.pin) {
                throw new common_1.BadRequestException('Debe proporcionar hijoId o (nombre y pin)');
            }
            hijo = await this.prisma.usuario.findFirst({
                where: { nombre: data.nombre, pin: data.pin, rol: 'ESTUDIANTE' },
            });
            if (!hijo) {
                throw new common_1.NotFoundException('Estudiante no encontrado con esas credenciales');
            }
        }
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
    async desvincularHijo(padreId, hijoId) {
        await this.prisma.padreHijo.deleteMany({
            where: { padreId, hijoId },
        });
        return { mensaje: 'Hijo desvinculado' };
    }
    async getEstudiantesParaMaestro(maestroId) {
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
        const desafioIds = [];
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
        const progresos = await this.prisma.progresoEstudiante.findMany({
            where: { desafioId: { in: desafioIds }, completado: true },
            select: { usuarioId: true },
        });
        const conteo = new Map();
        for (const p of progresos) {
            conteo.set(p.usuarioId, (conteo.get(p.usuarioId) ?? 0) + 1);
        }
        const estudianteIds = Array.from(conteo.keys());
        const estudiantes = await this.prisma.usuario.findMany({
            where: { id: { in: estudianteIds } },
            select: { id: true, nombre: true, puntos: true, experiencia: true },
        });
        return estudiantes.map((e) => {
            const completados = conteo.get(e.id) ?? 0;
            const porcentajeGlobal = totalDesafios === 0
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
    async getAsignaturasDeMaestro(maestroId) {
        return this.prisma.asignatura.findMany({
            where: { maestroId },
            include: { _count: { select: { modulos: true } } },
            orderBy: { nombre: 'asc' },
        });
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map