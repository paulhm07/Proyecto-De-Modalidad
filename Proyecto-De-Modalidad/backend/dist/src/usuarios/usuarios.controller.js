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
exports.UsuariosController = void 0;
const common_1 = require("@nestjs/common");
const usuarios_service_1 = require("./usuarios.service");
let UsuariosController = class UsuariosController {
    usuariosService;
    constructor(usuariosService) {
        this.usuariosService = usuariosService;
    }
    async createUser(body) {
        return this.usuariosService.createUser(body.nombre, body.pin, body.rol);
    }
    async login(body) {
        return this.usuariosService.validatePin(body.nombre, body.pin, body.rol);
    }
    async loginDemo(body) {
        return this.usuariosService.loginDemo(body.rol);
    }
    async getPerfil(id) {
        return this.usuariosService.getUserProfile(id);
    }
    async getProgreso(id) {
        return this.usuariosService.getProgresoEstudiante(id);
    }
    async getRanking() {
        return this.usuariosService.getRanking();
    }
    async getHijosDePadre(id) {
        return this.usuariosService.getHijosDePadre(id);
    }
    async vincularHijo(id, body) {
        return this.usuariosService.vincularHijo(id, body);
    }
    async desvincularHijo(id, hijoId) {
        return this.usuariosService.desvincularHijo(id, hijoId);
    }
    async getEstudiantesParaMaestro(id) {
        return this.usuariosService.getEstudiantesParaMaestro(id);
    }
    async getAsignaturasDeMaestro(id) {
        return this.usuariosService.getAsignaturasDeMaestro(id);
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('demo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "loginDemo", null);
__decorate([
    (0, common_1.Get)('perfil/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "getPerfil", null);
__decorate([
    (0, common_1.Get)('progreso/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "getProgreso", null);
__decorate([
    (0, common_1.Get)('ranking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "getRanking", null);
__decorate([
    (0, common_1.Get)('padres/:id/hijos'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "getHijosDePadre", null);
__decorate([
    (0, common_1.Post)('padres/:id/hijo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "vincularHijo", null);
__decorate([
    (0, common_1.Delete)('padres/:id/hijo/:hijoId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('hijoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "desvincularHijo", null);
__decorate([
    (0, common_1.Get)('maestros/:id/estudiantes'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "getEstudiantesParaMaestro", null);
__decorate([
    (0, common_1.Get)('maestros/:id/asignaturas'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "getAsignaturasDeMaestro", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, common_1.Controller)('usuarios'),
    __metadata("design:paramtypes", [usuarios_service_1.UsuariosService])
], UsuariosController);
//# sourceMappingURL=usuarios.controller.js.map