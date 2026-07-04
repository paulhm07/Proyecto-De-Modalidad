import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DesafiosService } from './desafios.service';

@Controller('desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Get('asignaturas')
  async obtenerAsignaturas() {
    return this.desafiosService.getAsignaturas();
  }

  @Get('modulos/:asignaturaId')
  async obtenerModulos(@Param('asignaturaId') asignaturaId: string) {
    return this.desafiosService.getModulos(asignaturaId);
  }

  @Get('modulo/:moduloId')
  async obtenerDesafios(@Param('moduloId') moduloId: string) {
    return this.desafiosService.getDesafios(moduloId);
  }

  @Post('verificar')
  @HttpCode(HttpStatus.OK)
  async verificarRespuesta(@Body() body: { desafioId: string; opcionId: string }) {
    return this.desafiosService.verificarRespuesta(body.desafioId, body.opcionId);
  }

  @Post('seed')
  async inicializarDatos() {
    return this.desafiosService.seedDatabase();
  }

  @Post('asignaturas')
  @HttpCode(HttpStatus.CREATED)
  async crearAsignatura(@Body() body: { nombre: string; descripcion?: string; maestroId: string }) {
    return this.desafiosService.crearAsignatura(body.nombre, body.descripcion ?? null, body.maestroId);
  }

  @Put('asignaturas/:id')
  async actualizarAsignatura(@Param('id') id: string, @Body() body: { nombre?: string; descripcion?: string | null }) {
    return this.desafiosService.actualizarAsignatura(id, body);
  }

  @Delete('asignaturas/:id')
  async eliminarAsignatura(@Param('id') id: string) {
    return this.desafiosService.eliminarAsignatura(id);
  }

  @Post('modulos')
  @HttpCode(HttpStatus.CREATED)
  async crearModulo(@Body() body: { asignaturaId: string; titulo: string; nivelMinimo?: number; descripcion?: string }) {
    return this.desafiosService.crearModulo(body.asignaturaId, body.titulo, body.nivelMinimo ?? 1, body.descripcion);
  }

  @Put('modulos/:id')
  async actualizarModulo(@Param('id') id: string, @Body() body: { titulo?: string; descripcion?: string | null; nivelMinimo?: number }) {
    return this.desafiosService.actualizarModulo(id, body);
  }

  @Delete('modulos/:id')
  async eliminarModulo(@Param('id') id: string) {
    return this.desafiosService.eliminarModulo(id);
  }

  @Post('desafios')
  @HttpCode(HttpStatus.CREATED)
  async crearDesafio(
    @Body() body: { moduloId: string; tipo: string; pregunta: string; puntos?: number; opciones: { texto: string; esCorrecta: boolean }[] },
  ) {
    return this.desafiosService.crearDesafio(body);
  }

  @Delete('desafios/:id')
  async eliminarDesafio(@Param('id') id: string) {
    return this.desafiosService.eliminarDesafio(id);
  }
}
