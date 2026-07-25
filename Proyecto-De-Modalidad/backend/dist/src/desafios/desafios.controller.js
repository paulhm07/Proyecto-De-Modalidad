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
exports.DesafiosController = void 0;
const common_1 = require("@nestjs/common");
const desafios_service_1 = require("./desafios.service");
let DesafiosController = class DesafiosController {
    desafiosService;
    constructor(desafiosService) {
        this.desafiosService = desafiosService;
    }
    async obtenerAsignaturas() {
        return this.desafiosService.getAsignaturas();
    }
    async obtenerModulos(asignaturaId) {
        return this.desafiosService.getModulos(asignaturaId);
    }
    async obtenerDesafios(moduloId) {
        return this.desafiosService.getDesafios(moduloId);
    }
    async verificarRespuesta(body) {
        return this.desafiosService.verificarRespuesta(body.desafioId, body.opcionId);
    }
    async inicializarDatos() {
        return this.desafiosService.seedDatabase();
    }
    async crearAsignatura(body) {
        return this.desafiosService.crearAsignatura(body.nombre, body.descripcion ?? null, body.maestroId);
    }
    async actualizarAsignatura(id, body) {
        return this.desafiosService.actualizarAsignatura(id, body);
    }
    async eliminarAsignatura(id) {
        return this.desafiosService.eliminarAsignatura(id);
    }
    async crearModulo(body) {
        return this.desafiosService.crearModulo(body.asignaturaId, body.titulo, body.nivelMinimo ?? 1, body.descripcion);
    }
    async actualizarModulo(id, body) {
        return this.desafiosService.actualizarModulo(id, body);
    }
    async eliminarModulo(id) {
        return this.desafiosService.eliminarModulo(id);
    }
    async crearDesafio(body) {
        return this.desafiosService.crearDesafio(body);
    }
    async eliminarDesafio(id) {
        return this.desafiosService.eliminarDesafio(id);
    }
};
exports.DesafiosController = DesafiosController;
__decorate([
    (0, common_1.Get)('asignaturas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DesafiosController.prototype, "obtenerAsignaturas", null);
__decorate([
    (0, common_1.Get)('modulos/:asignaturaId'),
    __param(0, (0, common_1.Param)('asignaturaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DesafiosController.prototype, "obtenerModulos", null);
__decorate([
    (0, common_1.Get)('modulo/:moduloId'),
    __param(0, (0, common_1.Param)('moduloId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DesafiosController.prototype, "obtenerDesafios", null);
__decorate([
    (0, common_1.Post)('verificar'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DesafiosController.prototype, "verificarRespuesta", null);
__decorate([
    (0, common_1.Post)('seed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DesafiosController.prototype, "inicializarDatos", null);
__decorate([
    (0, common_1.Post)('asignaturas'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DesafiosController.prototype, "crearAsignatura", null);
__decorate([
    (0, common_1.Put)('asignaturas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DesafiosController.prototype, "actualizarAsignatura", null);
__decorate([
    (0, common_1.Delete)('asignaturas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DesafiosController.prototype, "eliminarAsignatura", null);
__decorate([
    (0, common_1.Post)('modulos'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DesafiosController.prototype, "crearModulo", null);
__decorate([
    (0, common_1.Put)('modulos/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DesafiosController.prototype, "actualizarModulo", null);
__decorate([
    (0, common_1.Delete)('modulos/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DesafiosController.prototype, "eliminarModulo", null);
__decorate([
    (0, common_1.Post)('desafios'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DesafiosController.prototype, "crearDesafio", null);
__decorate([
    (0, common_1.Delete)('desafios/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DesafiosController.prototype, "eliminarDesafio", null);
exports.DesafiosController = DesafiosController = __decorate([
    (0, common_1.Controller)('desafios'),
    __metadata("design:paramtypes", [desafios_service_1.DesafiosService])
], DesafiosController);
//# sourceMappingURL=desafios.controller.js.map