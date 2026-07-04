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
exports.AvatarsController = void 0;
const common_1 = require("@nestjs/common");
const avatars_service_1 = require("./avatars.service");
let AvatarsController = class AvatarsController {
    avatarsService;
    constructor(avatarsService) {
        this.avatarsService = avatarsService;
    }
    async getTienda() {
        return this.avatarsService.getTienda();
    }
    async seedTienda() {
        return this.avatarsService.seedTienda();
    }
    async getMiAvatar(usuarioId) {
        return this.avatarsService.getMiAvatar(usuarioId);
    }
    async comprar(usuarioId, body) {
        return this.avatarsService.comprar(usuarioId, body.itemId);
    }
    async equipar(usuarioId, body) {
        return this.avatarsService.equipar(usuarioId, body.itemId);
    }
};
exports.AvatarsController = AvatarsController;
__decorate([
    (0, common_1.Get)('tienda'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AvatarsController.prototype, "getTienda", null);
__decorate([
    (0, common_1.Post)('seed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AvatarsController.prototype, "seedTienda", null);
__decorate([
    (0, common_1.Get)('mi-avatar/:usuarioId'),
    __param(0, (0, common_1.Param)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AvatarsController.prototype, "getMiAvatar", null);
__decorate([
    (0, common_1.Post)('comprar/:usuarioId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('usuarioId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AvatarsController.prototype, "comprar", null);
__decorate([
    (0, common_1.Post)('equipar/:usuarioId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('usuarioId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AvatarsController.prototype, "equipar", null);
exports.AvatarsController = AvatarsController = __decorate([
    (0, common_1.Controller)('avatars'),
    __metadata("design:paramtypes", [avatars_service_1.AvatarsService])
], AvatarsController);
//# sourceMappingURL=avatars.controller.js.map