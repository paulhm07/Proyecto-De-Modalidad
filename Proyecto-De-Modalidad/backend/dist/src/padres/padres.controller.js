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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PadresController = void 0;
const common_1 = require("@nestjs/common");
const padres_service_1 = require("./padres.service");
let PadresController = class PadresController {
    padresService;
    constructor(padresService) {
        this.padresService = padresService;
    }
    async seedDemo(padreId) {
        return this.padresService.seedPadreDemo(padreId);
    }
    async obtenerHijos(padreId) {
        return this.padresService.obtenerHijos(padreId);
    }
    async solicitarVinculo(padreId, body) {
        return this.padresService.solicitarVinculo(padreId, body);
    }
    async vincularPorHijoId(padreId, hijoId, body) {
        return this.padresService.vincularPorHijoId(padreId, hijoId, body.parentesco);
    }
    async desvincularHijo(padreId, hijoId) {
        return this.padresService.desvincularHijo(padreId, hijoId);
    }
    async obtenerResumen(padreId, hijoId) {
        return this.padresService.obtenerResumen(padreId, hijoId);
    }
    async obtenerCalificaciones(padreId, hijoId, asignaturaId, desde, hasta) {
        return this.padresService.obtenerCalificaciones(padreId, hijoId, {
            asignaturaId,
            desde,
            hasta,
        });
    }
    async obtenerAsistencia(padreId, hijoId, mes, anio) {
        return this.padresService.obtenerAsistencia(padreId, hijoId, {
            mes: mes ? Number(mes) : undefined,
            anio: anio ? Number(anio) : undefined,
        });
    }
    async obtenerTareasHijo(padreId, hijoId, estado) {
        return this.padresService.obtenerTareasHijo(padreId, hijoId, { estado });
    }
    async obtenerMedallasHijo(padreId, hijoId) {
        return this.padresService.obtenerMedallasHijo(padreId, hijoId);
    }
    async obtenerAvisos(padreId, tipo, soloNoLeidos) {
        return this.padresService.obtenerAvisos(padreId, {
            tipo,
            soloNoLeidos: soloNoLeidos === 'true' || soloNoLeidos === '1',
        });
    }
    async marcarAvisoLeido(padreId, avisoId) {
        return this.padresService.marcarAvisoLeido(padreId, avisoId);
    }
    async firmarAviso(padreId, avisoId) {
        return this.padresService.firmarAviso(padreId, avisoId);
    }
    async obtenerConversaciones(padreId) {
        return this.padresService.obtenerConversaciones(padreId);
    }
    async obtenerConversacion(padreId, id) {
        return this.padresService.obtenerConversacion(padreId, id);
    }
    async enviarMensaje(padreId, id, body) {
        return this.padresService.enviarMensaje(padreId, id, body.cuerpo);
    }
    async iniciarConversacion(padreId, body) {
        return this.padresService.iniciarConversacion(padreId, body);
    }
    async obtenerNotificaciones(padreId, soloNoLeidos) {
        return this.padresService.obtenerNotificaciones(padreId, {
            soloNoLeidos: soloNoLeidos === 'true' || soloNoLeidos === '1',
        });
    }
    async marcarNotificacionLeida(padreId, id) {
        return this.padresService.marcarNotificacionLeida(padreId, id);
    }
    async marcarTodasLeidas(padreId) {
        return this.padresService.marcarTodasLeidas(padreId);
    }
    async suscribirPush(padreId, body) {
        return this.padresService.suscribirPush(padreId, body);
    }
    async desuscribirPush(padreId, body) {
        return this.padresService.desuscribirPush(padreId, body.endpoint);
    }
};
exports.PadresController = PadresController;
__decorate([
    (0, common_1.Post)(':padreId/seed-demo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('padreId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "seedDemo", null);
__decorate([
    (0, common_1.Get)(':padreId/hijos'),
    __param(0, (0, common_1.Param)('padreId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "obtenerHijos", null);
__decorate([
    (0, common_1.Post)(':padreId/hijos'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "solicitarVinculo", null);
__decorate([
    (0, common_1.Post)(':padreId/hijos/:hijoId/vincular'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Param)('hijoId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "vincularPorHijoId", null);
__decorate([
    (0, common_1.Delete)(':padreId/hijos/:hijoId'),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Param)('hijoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "desvincularHijo", null);
__decorate([
    (0, common_1.Get)(':padreId/hijos/:hijoId/resumen'),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Param)('hijoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "obtenerResumen", null);
__decorate([
    (0, common_1.Get)(':padreId/hijos/:hijoId/calificaciones'),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Param)('hijoId')),
    __param(2, (0, common_1.Query)('asignaturaId')),
    __param(3, (0, common_1.Query)('desde')),
    __param(4, (0, common_1.Query)('hasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "obtenerCalificaciones", null);
__decorate([
    (0, common_1.Get)(':padreId/hijos/:hijoId/asistencia'),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Param)('hijoId')),
    __param(2, (0, common_1.Query)('mes')),
    __param(3, (0, common_1.Query)('anio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "obtenerAsistencia", null);
__decorate([
    (0, common_1.Get)(':padreId/hijos/:hijoId/tareas'),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Param)('hijoId')),
    __param(2, (0, common_1.Query)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "obtenerTareasHijo", null);
__decorate([
    (0, common_1.Get)(':padreId/hijos/:hijoId/medallas'),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Param)('hijoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "obtenerMedallasHijo", null);
__decorate([
    (0, common_1.Get)(':padreId/avisos'),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Query)('tipo')),
    __param(2, (0, common_1.Query)('soloNoLeidos')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "obtenerAvisos", null);
__decorate([
    (0, common_1.Post)(':padreId/avisos/:avisoId/leer'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Param)('avisoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "marcarAvisoLeido", null);
__decorate([
    (0, common_1.Post)(':padreId/avisos/:avisoId/firmar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Param)('avisoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "firmarAviso", null);
__decorate([
    (0, common_1.Get)(':padreId/conversaciones'),
    __param(0, (0, common_1.Param)('padreId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "obtenerConversaciones", null);
__decorate([
    (0, common_1.Get)(':padreId/conversaciones/:id'),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "obtenerConversacion", null);
__decorate([
    (0, common_1.Post)(':padreId/conversaciones/:id/mensajes'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "enviarMensaje", null);
__decorate([
    (0, common_1.Post)(':padreId/conversaciones'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "iniciarConversacion", null);
__decorate([
    (0, common_1.Get)(':padreId/notificaciones'),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Query)('soloNoLeidos')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "obtenerNotificaciones", null);
__decorate([
    (0, common_1.Post)(':padreId/notificaciones/:id/leer'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "marcarNotificacionLeida", null);
__decorate([
    (0, common_1.Post)(':padreId/notificaciones/leer-todas'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('padreId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "marcarTodasLeidas", null);
__decorate([
    (0, common_1.Post)(':padreId/push/subscribe'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "suscribirPush", null);
__decorate([
    (0, common_1.Delete)(':padreId/push/subscribe'),
    __param(0, (0, common_1.Param)('padreId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PadresController.prototype, "desuscribirPush", null);
exports.PadresController = PadresController = __decorate([
    (0, common_1.Controller)('padres'),
    __metadata("design:paramtypes", [padres_service_1.PadresService])
], PadresController);
//# sourceMappingURL=padres.controller.js.map