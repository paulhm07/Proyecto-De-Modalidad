import { Controller, Get, Post, Body, Param, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  async registrar(@Body() body: { nombre: string; pin: string }) {
    return this.usuariosService.createStudent(body.nombre, body.pin);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { nombre: string; pin: string }) {
    return this.usuariosService.validatePin(body.nombre, body.pin);
  }

  @Get('perfil/:id')
  async obtenerPerfil(@Param('id') id: string) {
    return this.usuariosService.getUserProfile(id);
  }

  @Get('ranking')
  async obtenerRanking() {
    return this.usuariosService.getAllEstudiantes();
  }

  @Put('puntos/:id')
  async actualizarPuntos(
    @Param('id') id: string,
    @Body() body: { puntos: number; experiencia: number },
  ) {
    return this.usuariosService.updateScore(id, body.puntos || 0, body.experiencia || 0);
  }
}
