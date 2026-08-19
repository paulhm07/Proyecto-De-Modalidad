"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const desafios_module_1 = require("./desafios/desafios.module");
const progreso_module_1 = require("./progreso/progreso.module");
const avatars_module_1 = require("./avatars/avatars.module");
const maestros_module_1 = require("./maestros/maestros.module");
const padres_module_1 = require("./padres/padres.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            usuarios_module_1.UsuariosModule,
            desafios_module_1.DesafiosModule,
            progreso_module_1.ProgresoModule,
            avatars_module_1.AvatarsModule,
            maestros_module_1.MaestrosModule,
            padres_module_1.PadresModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map