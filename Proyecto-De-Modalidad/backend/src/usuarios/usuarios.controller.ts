import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: { nombre: string; pin: string; rol: string }) {
    return this.usuariosService.createUser(body.nombre, body.pin, body.rol);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { nombre: string; pin: string; rol?: string }) {
    return this.usuariosService.validatePin(body.nombre, body.pin, body.rol);
  }

  @Post('demo')
  @HttpCode(HttpStatus.OK)
  async loginDemo(@Body() body: { rol: string }) {
    return this.usuariosService.loginDemo(body.rol);
  }

  @Get('perfil/:id')
  async getPerfil(@Param('id') id: string) {
    return this.usuariosService.getUserProfile(id);
  }

  @Get('progreso/:id')
  async getProgreso(@Param('id') id: string) {
    return this.usuariosService.getProgresoEstudiante(id);
  }

  @Get('ranking')
  async getRanking() {
    return this.usuariosService.getRanking();
  }

  @Get('padres/:id/hijos')
  async getHijosDePadre(@Param('id') id: string) {
    return this.usuariosService.getHijosDePadre(id);
  }

  @Post('padres/:id/hijo')
  @HttpCode(HttpStatus.CREATED)
  async vincularHijo(
    @Param('id') id: string,
    @Body() body: { hijoId?: string; nombre?: string; pin?: string },
  ) {
    return this.usuariosService.vincularHijo(id, body);
  }

  @Delete('padres/:id/hijo/:hijoId')
  async desvincularHijo(
    @Param('id') id: string,
    @Param('hijoId') hijoId: string,
  ) {
    return this.usuariosService.desvincularHijo(id, hijoId);
  }

  @Get('maestros/:id/estudiantes')
  async getEstudiantesParaMaestro(@Param('id') id: string) {
    return this.usuariosService.getEstudiantesParaMaestro(id);
  }

  @Get('maestros/:id/asignaturas')
  async getAsignaturasDeMaestro(@Param('id') id: string) {
    return this.usuariosService.getAsignaturasDeMaestro(id);
  }
}
