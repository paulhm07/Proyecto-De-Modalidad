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
exports.ProgresoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ProgresoService = class ProgresoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async registrarProgreso(usuarioId, desafioId, opcionId) {
        const desafio = await this.prisma.desafio.findUnique({
            where: { id: desafioId },
            include: { modulo: true, opciones: true },
        });
        if (!desafio)
            throw new common_1.NotFoundException('Desafío no encontrado');
        const usuario = await this.prisma.usuario.findUnique({ where: { id: usuarioId } });
        if (!usuario)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const opcion = desafio.opciones.find((o) => o.id === opcionId);
        if (!opcion)
            throw new common_1.BadRequestException('La opción seleccionada no pertenece al desafío');
        const esCorrecta = opcion.esCorrecta;
        const progresoPrevio = await this.prisma.progresoEstudiante.findUnique({
            where: { usuarioId_desafioId: { usuarioId, desafioId } },
        });
        const yaCompletado = progresoPrevio?.completado || false;
        const progreso = await this.prisma.progresoEstudiante.upsert({
            where: { usuarioId_desafioId: { usuarioId, desafioId } },
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
        let monedasGanadas = 0;
        let gemasGanadas = 0;
        if (esCorrecta && !yaCompletado) {
            monedasGanadas = 5;
            await this.prisma.usuario.update({
                where: { id: usuarioId },
                data: {
                    puntos: { increment: desafio.puntos },
                    experiencia: { increment: desafio.puntos * 2 },
                    monedas: { increment: monedasGanadas },
                },
            });
            const moduloId = desafio.moduloId;
            const desafiosDelModulo = await this.prisma.desafio.findMany({
                where: { moduloId },
                select: { id: true },
            });
            const progresosDelModulo = await this.prisma.progresoEstudiante.findMany({
                where: { usuarioId, desafioId: { in: desafiosDelModulo.map((d) => d.id) }, completado: true },
            });
            if (progresosDelModulo.length === desafiosDelModulo.length) {
                gemasGanadas = 1;
                await this.prisma.usuario.update({
                    where: { id: usuarioId },
                    data: { gemas: { increment: gemasGanadas }, monedas: { increment: 20 } },
                });
                const criterioBuscado = `Completar ${desafio.modulo.titulo}`;
                const medalla = await this.prisma.medalla.findFirst({ where: { criterio: criterioBuscado } });
                if (medalla) {
                    const yaTieneMedalla = await this.prisma.medallaEstudiante.findUnique({
                        where: { usuarioId_medallaId: { usuarioId, medallaId: medalla.id } },
                    });
                    if (!yaTieneMedalla) {
                        await this.prisma.medallaEstudiante.create({ data: { usuarioId, medallaId: medalla.id } });
                        medallaGanada = medalla;
                    }
                }
            }
        }
        return {
            esCorrecta,
            puntosGanados: (esCorrecta && !yaCompletado) ? desafio.puntos : 0,
            monedasGanadas,
            gemasGanadas,
            medallaGanada,
            progresoActual: progreso,
        };
    }
    async obtenerMedallasDeUsuario(usuarioId) {
        return this.prisma.medallaEstudiante.findMany({
            where: { usuarioId },
            include: { medalla: true },
        });
    }
};
exports.ProgresoService = ProgresoService;
exports.ProgresoService = ProgresoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgresoService);
//# sourceMappingURL=progreso.service.js.map