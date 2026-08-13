import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MaestrosService } from './maestros.service';

@Controller('maestros')
export class MaestrosController {
  constructor(private readonly maestrosService: MaestrosService) {}

  // ===================== SECCIONES =====================

  @Post('secciones')
  @HttpCode(HttpStatus.CREATED)
  async crearSeccion(@Body() body: {
    nombre: string;
    grado?: number;
    maestroId: string;
    asignaturaId?: string;
    anioEscolar?: number;
  }) {
    return this.maestrosService.crearSeccion(body);
  }

  @Get('secciones/maestro/:maestroId')
  async obtenerSeccionesDeMaestro(@Param('maestroId') maestroId: string) {
    return this.maestrosService.obtenerSeccionesDeMaestro(maestroId);
  }

  @Get('secciones/:id')
  async obtenerSeccion(@Param('id') id: string) {
    return this.maestrosService.obtenerSeccion(id);
  }

  @Put('secciones/:id')
  async actualizarSeccion(@Param('id') id: string, @Body() body: {
    nombre?: string;
    grado?: number;
    activa?: boolean;
    asignaturaId?: string | null;
  }) {
    return this.maestrosService.actualizarSeccion(id, body);
  }

  @Delete('secciones/:id')
  async eliminarSeccion(@Param('id') id: string) {
    return this.maestrosService.eliminarSeccion(id);
  }

  @Post('secciones/:id/inscribir')
  async inscribirEstudiante(@Param('id') id: string, @Body() body: { estudianteId: string }) {
    return this.maestrosService.inscribirEstudiante(id, body.estudianteId);
  }

  @Delete('secciones/:id/inscribir/:estudianteId')
  async desinscribirEstudiante(@Param('id') id: string, @Param('estudianteId') estudianteId: string) {
    return this.maestrosService.desinscribirEstudiante(id, estudianteId);
  }

  @Get('secciones/:id/estudiantes')
  async obtenerEstudiantesDeSeccion(@Param('id') id: string) {
    return this.maestrosService.obtenerEstudiantesDeSeccion(id);
  }

  // ===================== TAREAS =====================

  @Post('tareas')
  @HttpCode(HttpStatus.CREATED)
  async crearTarea(@Body() body: {
    seccionId: string;
    desafioId: string;
    titulo: string;
    descripcion?: string;
    fechaLimite: string;
  }) {
    return this.maestrosService.crearTarea(body);
  }

  @Get('tareas/seccion/:seccionId')
  async obtenerTareasDeSeccion(@Param('seccionId') seccionId: string) {
    return this.maestrosService.obtenerTareasDeSeccion(seccionId);
  }

  @Get('tareas/:id')
  async obtenerTarea(@Param('id') id: string) {
    return this.maestrosService.obtenerTarea(id);
  }

  @Put('tareas/:id')
  async actualizarTarea(@Param('id') id: string, @Body() body: {
    titulo?: string;
    descripcion?: string | null;
    fechaLimite?: string;
    estado?: string;
  }) {
    return this.maestrosService.actualizarTarea(id, body);
  }

  @Post('tareas/:id/cerrar')
  async cerrarTarea(@Param('id') id: string) {
    return this.maestrosService.cerrarTarea(id);
  }

  @Delete('tareas/:id')
  async eliminarTarea(@Param('id') id: string) {
    return this.maestrosService.eliminarTarea(id);
  }

  // ===================== CALIFICACIONES =====================

  @Post('calificaciones')
  @HttpCode(HttpStatus.CREATED)
  async registrarCalificacion(@Body() body: {
    tareaId: string;
    estudianteId: string;
    nota: number;
    comentario?: string;
    maestroId: string;
  }) {
    return this.maestrosService.registrarCalificacion(body);
  }

  @Get('calificaciones/tarea/:tareaId')
  async obtenerCalificacionesDeTarea(@Param('tareaId') tareaId: string) {
    return this.maestrosService.obtenerCalificacionesDeTarea(tareaId);
  }

  @Get('calificaciones/estudiante/:estudianteId')
  async obtenerCalificacionesDeEstudiante(@Param('estudianteId') estudianteId: string) {
    return this.maestrosService.obtenerCalificacionesDeEstudiante(estudianteId);
  }

  // ===================== ASISTENCIA =====================

  @Post('asistencia')
  @HttpCode(HttpStatus.OK)
  async registrarAsistencia(@Body() body: {
    registros: { seccionId: string; estudianteId: string; fecha: string; estado: string; observacion?: string }[];
  }) {
    return this.maestrosService.registrarAsistenciaBatch(body.registros);
  }

  @Get('asistencia/seccion/:seccionId')
  async obtenerAsistenciaDeSeccion(
    @Param('seccionId') seccionId: string,
    @Query('fecha') fecha?: string,
  ) {
    return this.maestrosService.obtenerAsistenciaDeSeccion(seccionId, fecha);
  }

  @Get('asistencia/estudiante/:estudianteId')
  async obtenerAsistenciaDeEstudiante(@Param('estudianteId') estudianteId: string) {
    return this.maestrosService.obtenerAsistenciaDeEstudiante(estudianteId);
  }

  @Put('asistencia/:id')
  async actualizarAsistencia(@Param('id') id: string, @Body() body: { estado?: string; observacion?: string | null }) {
    return this.maestrosService.actualizarAsistencia(id, body);
  }

  // ===================== REPORTES =====================

  @Get('reportes/seccion/:seccionId/resumen')
  async resumenSeccion(@Param('seccionId') seccionId: string) {
    return this.maestrosService.resumenSeccion(seccionId);
  }

  @Get('reportes/estudiante/:estudianteId/acumulado')
  async reporteEstudiante(@Param('estudianteId') estudianteId: string) {
    return this.maestrosService.reporteEstudiante(estudianteId);
  }

  @Get('alertas/:maestroId')
  async alertasMaestro(@Param('maestroId') maestroId: string) {
    return this.maestrosService.alertasMaestro(maestroId);
  }

  // ===================== SEED DEMO =====================

  @Post('seed/:maestroId')
  async seedDemo(@Param('maestroId') maestroId: string) {
    return this.maestrosService.seedDemo(maestroId);
  }
}
