import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ProgresoService } from './progreso.service';

@Controller('progreso')
export class ProgresoController {
  constructor(private readonly progresoService: ProgresoService) {}

  @Post('responder')
  @HttpCode(HttpStatus.OK)
  async responder(@Body() body: { usuarioId: string; desafioId: string; opcionId: string }) {
    return this.progresoService.registrarProgreso(body.usuarioId, body.desafioId, body.opcionId);
  }

  @Get('medallas/:usuarioId')
  async medallas(@Param('usuarioId') usuarioId: string) {
    return this.progresoService.obtenerMedallasDeUsuario(usuarioId);
  }
}
