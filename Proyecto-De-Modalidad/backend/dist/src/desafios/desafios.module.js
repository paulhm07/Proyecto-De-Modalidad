"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesafiosModule = void 0;
const common_1 = require("@nestjs/common");
const desafios_service_1 = require("./desafios.service");
const desafios_controller_1 = require("./desafios.controller");
let DesafiosModule = class DesafiosModule {
};
exports.DesafiosModule = DesafiosModule;
exports.DesafiosModule = DesafiosModule = __decorate([
    (0, common_1.Module)({
        providers: [desafios_service_1.DesafiosService],
        controllers: [desafios_controller_1.DesafiosController],
    })
], DesafiosModule);
//# sourceMappingURL=desafios.module.js.map