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
exports.MaestrosController = void 0;
const common_1 = require("@nestjs/common");
const maestros_service_1 = require("./maestros.service");
let MaestrosController = class MaestrosController {
    maestrosService;
    constructor(maestrosService) {
        this.maestrosService = maestrosService;
    }
    async crearSeccion(body) {
        return this.maestrosService.crearSeccion(body);
    }
    async obtenerSeccionesDeMaestro(maestroId) {
        return this.maestrosService.obtenerSeccionesDeMaestro(maestroId);
    }
    async obtenerSeccion(id) {
        return this.maestrosService.obtenerSeccion(id);
    }
    async actualizarSeccion(id, body) {
        return this.maestrosService.actualizarSeccion(id, body);
    }
    async eliminarSeccion(id) {
        return this.maestrosService.eliminarSeccion(id);
    }
    async inscribirEstudiante(id, body) {
        return this.maestrosService.inscribirEstudiante(id, body.estudianteId);
    }
    async desinscribirEstudiante(id, estudianteId) {
        return this.maestrosService.desinscribirEstudiante(id, estudianteId);
    }
    async obtenerEstudiantesDeSeccion(id) {
        return this.maestrosService.obtenerEstudiantesDeSeccion(id);
    }
    async crearTarea(body) {
        return this.maestrosService.crearTarea(body);
    }
    async obtenerTareasDeSeccion(seccionId) {
        return this.maestrosService.obtenerTareasDeSeccion(seccionId);
    }
    async obtenerTarea(id) {
        return this.maestrosService.obtenerTarea(id);
    }
    async actualizarTarea(id, body) {
        return this.maestrosService.actualizarTarea(id, body);
    }
    async cerrarTarea(id) {
        return this.maestrosService.cerrarTarea(id);
    }
    async eliminarTarea(id) {
        return this.maestrosService.eliminarTarea(id);
    }
    async registrarCalificacion(body) {
        return this.maestrosService.registrarCalificacion(body);
    }
    async obtenerCalificacionesDeTarea(tareaId) {
        return this.maestrosService.obtenerCalificacionesDeTarea(tareaId);
    }
    async obtenerCalificacionesDeEstudiante(estudianteId) {
        return this.maestrosService.obtenerCalificacionesDeEstudiante(estudianteId);
    }
    async registrarAsistencia(body) {
        return this.maestrosService.registrarAsistenciaBatch(body.registros);
    }
    async obtenerAsistenciaDeSeccion(seccionId, fecha) {
        return this.maestrosService.obtenerAsistenciaDeSeccion(seccionId, fecha);
    }
    async obtenerAsistenciaDeEstudiante(estudianteId) {
        return this.maestrosService.obtenerAsistenciaDeEstudiante(estudianteId);
    }
    async actualizarAsistencia(id, body) {
        return this.maestrosService.actualizarAsistencia(id, body);
    }
    async resumenSeccion(seccionId) {
        return this.maestrosService.resumenSeccion(seccionId);
    }
    async reporteEstudiante(estudianteId) {
        return this.maestrosService.reporteEstudiante(estudianteId);
    }
    async alertasMaestro(maestroId) {
        return this.maestrosService.alertasMaestro(maestroId);
    }
    async seedDemo(maestroId) {
        return this.maestrosService.seedDemo(maestroId);
    }
};
exports.MaestrosController = MaestrosController;
__decorate([
    (0, common_1.Post)('secciones'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "crearSeccion", null);
__decorate([
    (0, common_1.Get)('secciones/maestro/:maestroId'),
    __param(0, (0, common_1.Param)('maestroId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "obtenerSeccionesDeMaestro", null);
__decorate([
    (0, common_1.Get)('secciones/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "obtenerSeccion", null);
__decorate([
    (0, common_1.Put)('secciones/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "actualizarSeccion", null);
__decorate([
    (0, common_1.Delete)('secciones/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "eliminarSeccion", null);
__decorate([
    (0, common_1.Post)('secciones/:id/inscribir'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "inscribirEstudiante", null);
__decorate([
    (0, common_1.Delete)('secciones/:id/inscribir/:estudianteId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('estudianteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "desinscribirEstudiante", null);
__decorate([
    (0, common_1.Get)('secciones/:id/estudiantes'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "obtenerEstudiantesDeSeccion", null);
__decorate([
    (0, common_1.Post)('tareas'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "crearTarea", null);
__decorate([
    (0, common_1.Get)('tareas/seccion/:seccionId'),
    __param(0, (0, common_1.Param)('seccionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "obtenerTareasDeSeccion", null);
__decorate([
    (0, common_1.Get)('tareas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "obtenerTarea", null);
__decorate([
    (0, common_1.Put)('tareas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "actualizarTarea", null);
__decorate([
    (0, common_1.Post)('tareas/:id/cerrar'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "cerrarTarea", null);
__decorate([
    (0, common_1.Delete)('tareas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "eliminarTarea", null);
__decorate([
    (0, common_1.Post)('calificaciones'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "registrarCalificacion", null);
__decorate([
    (0, common_1.Get)('calificaciones/tarea/:tareaId'),
    __param(0, (0, common_1.Param)('tareaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "obtenerCalificacionesDeTarea", null);
__decorate([
    (0, common_1.Get)('calificaciones/estudiante/:estudianteId'),
    __param(0, (0, common_1.Param)('estudianteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "obtenerCalificacionesDeEstudiante", null);
__decorate([
    (0, common_1.Post)('asistencia'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "registrarAsistencia", null);
__decorate([
    (0, common_1.Get)('asistencia/seccion/:seccionId'),
    __param(0, (0, common_1.Param)('seccionId')),
    __param(1, (0, common_1.Query)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "obtenerAsistenciaDeSeccion", null);
__decorate([
    (0, common_1.Get)('asistencia/estudiante/:estudianteId'),
    __param(0, (0, common_1.Param)('estudianteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "obtenerAsistenciaDeEstudiante", null);
__decorate([
    (0, common_1.Put)('asistencia/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "actualizarAsistencia", null);
__decorate([
    (0, common_1.Get)('reportes/seccion/:seccionId/resumen'),
    __param(0, (0, common_1.Param)('seccionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "resumenSeccion", null);
__decorate([
    (0, common_1.Get)('reportes/estudiante/:estudianteId/acumulado'),
    __param(0, (0, common_1.Param)('estudianteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "reporteEstudiante", null);
__decorate([
    (0, common_1.Get)('alertas/:maestroId'),
    __param(0, (0, common_1.Param)('maestroId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "alertasMaestro", null);
__decorate([
    (0, common_1.Post)('seed/:maestroId'),
    __param(0, (0, common_1.Param)('maestroId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaestrosController.prototype, "seedDemo", null);
exports.MaestrosController = MaestrosController = __decorate([
    (0, common_1.Controller)('maestros'),
    __metadata("design:paramtypes", [maestros_service_1.MaestrosService])
], MaestrosController);
//# sourceMappingURL=maestros.controller.js.map