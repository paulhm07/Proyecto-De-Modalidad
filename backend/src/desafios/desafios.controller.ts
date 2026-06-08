import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
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
  async verificarRespuesta(
    @Body() body: { desafioId: string; opcionId: string },
  ) {
    return this.desafiosService.verificarRespuesta(body.desafioId, body.opcionId);
  }

  @Post('seed')
  async inicializarDatos() {
    return this.desafiosService.seedDatabase();
  }
}
