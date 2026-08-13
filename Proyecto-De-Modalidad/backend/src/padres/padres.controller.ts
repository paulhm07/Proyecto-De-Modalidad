import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PadresService } from './padres.service';

@Controller('padres')
export class PadresController {
  constructor(private readonly padresService: PadresService) {}

  // ===================== SEED DEMO =====================
  @Post(':padreId/seed-demo')
  @HttpCode(HttpStatus.OK)
  async seedDemo(@Param('padreId') padreId: string) {
    return this.padresService.seedPadreDemo(padreId);
  }

  // ===================== VINCULACIÓN =====================
  @Get(':padreId/hijos')
  async obtenerHijos(@Param('padreId') padreId: string) {
    return this.padresService.obtenerHijos(padreId);
  }

  @Post(':padreId/hijos')
  @HttpCode(HttpStatus.CREATED)
  async solicitarVinculo(
    @Param('padreId') padreId: string,
    @Body() body: { nombre: string; pin: string; parentesco?: string }
  ) {
    return this.padresService.solicitarVinculo(padreId, body);
  }

  @Post(':padreId/hijos/:hijoId/vincular')
  @HttpCode(HttpStatus.OK)
  async vincularPorHijoId(
    @Param('padreId') padreId: string,
    @Param('hijoId') hijoId: string,
    @Body() body: { parentesco?: string }
  ) {
    return this.padresService.vincularPorHijoId(padreId, hijoId, body.parentesco);
  }

  @Delete(':padreId/hijos/:hijoId')
  async desvincularHijo(
    @Param('padreId') padreId: string,
    @Param('hijoId') hijoId: string
  ) {
    return this.padresService.desvincularHijo(padreId, hijoId);
  }

  // ===================== RESUMEN (HOME) =====================
  @Get(':padreId/hijos/:hijoId/resumen')
  async obtenerResumen(
    @Param('padreId') padreId: string,
    @Param('hijoId') hijoId: string
  ) {
    return this.padresService.obtenerResumen(padreId, hijoId);
  }

  // ===================== CALIFICACIONES =====================
  @Get(':padreId/hijos/:hijoId/calificaciones')
  async obtenerCalificaciones(
    @Param('padreId') padreId: string,
    @Param('hijoId') hijoId: string,
    @Query('asignaturaId') asignaturaId?: string,
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string
  ) {
    return this.padresService.obtenerCalificaciones(padreId, hijoId, {
      asignaturaId,
      desde,
      hasta,
    });
  }

  // ===================== ASISTENCIA =====================
  @Get(':padreId/hijos/:hijoId/asistencia')
  async obtenerAsistencia(
    @Param('padreId') padreId: string,
    @Param('hijoId') hijoId: string,
    @Query('mes') mes?: string,
    @Query('anio') anio?: string
  ) {
    return this.padresService.obtenerAsistencia(padreId, hijoId, {
      mes: mes ? Number(mes) : undefined,
      anio: anio ? Number(anio) : undefined,
    });
  }

  // ===================== TAREAS DEL HIJO =====================
  @Get(':padreId/hijos/:hijoId/tareas')
  async obtenerTareasHijo(
    @Param('padreId') padreId: string,
    @Param('hijoId') hijoId: string,
    @Query('estado') estado?: string
  ) {
    return this.padresService.obtenerTareasHijo(padreId, hijoId, { estado });
  }

  // ===================== MEDALLAS DEL HIJO =====================
  @Get(':padreId/hijos/:hijoId/medallas')
  async obtenerMedallasHijo(
    @Param('padreId') padreId: string,
    @Param('hijoId') hijoId: string
  ) {
    return this.padresService.obtenerMedallasHijo(padreId, hijoId);
  }

  // ===================== AVISOS =====================
  @Get(':padreId/avisos')
  async obtenerAvisos(
    @Param('padreId') padreId: string,
    @Query('tipo') tipo?: string,
    @Query('soloNoLeidos') soloNoLeidos?: string
  ) {
    return this.padresService.obtenerAvisos(padreId, {
      tipo,
      soloNoLeidos: soloNoLeidos === 'true' || soloNoLeidos === '1',
    });
  }

  @Post(':padreId/avisos/:avisoId/leer')
  @HttpCode(HttpStatus.OK)
  async marcarAvisoLeido(
    @Param('padreId') padreId: string,
    @Param('avisoId') avisoId: string
  ) {
    return this.padresService.marcarAvisoLeido(padreId, avisoId);
  }

  @Post(':padreId/avisos/:avisoId/firmar')
  @HttpCode(HttpStatus.OK)
  async firmarAviso(
    @Param('padreId') padreId: string,
    @Param('avisoId') avisoId: string
  ) {
    return this.padresService.firmarAviso(padreId, avisoId);
  }

  // ===================== CONVERSACIONES Y MENSAJES =====================
  @Get(':padreId/conversaciones')
  async obtenerConversaciones(@Param('padreId') padreId: string) {
    return this.padresService.obtenerConversaciones(padreId);
  }

  @Get(':padreId/conversaciones/:id')
  async obtenerConversacion(
    @Param('padreId') padreId: string,
    @Param('id') id: string
  ) {
    return this.padresService.obtenerConversacion(padreId, id);
  }

  @Post(':padreId/conversaciones/:id/mensajes')
  @HttpCode(HttpStatus.CREATED)
  async enviarMensaje(
    @Param('padreId') padreId: string,
    @Param('id') id: string,
    @Body() body: { cuerpo: string }
  ) {
    return this.padresService.enviarMensaje(padreId, id, body.cuerpo);
  }

  @Post(':padreId/conversaciones')
  @HttpCode(HttpStatus.CREATED)
  async iniciarConversacion(
    @Param('padreId') padreId: string,
    @Body() body: {
      maestroId: string;
      hijoId: string;
      asunto: string;
      seccionId?: string;
      mensajeInicial?: string;
    }
  ) {
    return this.padresService.iniciarConversacion(padreId, body);
  }

  // ===================== NOTIFICACIONES =====================
  @Get(':padreId/notificaciones')
  async obtenerNotificaciones(
    @Param('padreId') padreId: string,
    @Query('soloNoLeidos') soloNoLeidos?: string
  ) {
    return this.padresService.obtenerNotificaciones(padreId, {
      soloNoLeidos: soloNoLeidos === 'true' || soloNoLeidos === '1',
    });
  }

  @Post(':padreId/notificaciones/:id/leer')
  @HttpCode(HttpStatus.OK)
  async marcarNotificacionLeida(
    @Param('padreId') padreId: string,
    @Param('id') id: string
  ) {
    return this.padresService.marcarNotificacionLeida(padreId, id);
  }

  @Post(':padreId/notificaciones/leer-todas')
  @HttpCode(HttpStatus.OK)
  async marcarTodasLeidas(@Param('padreId') padreId: string) {
    return this.padresService.marcarTodasLeidas(padreId);
  }

  // ===================== PUSH SUBSCRIPTIONS =====================
  @Post(':padreId/push/subscribe')
  @HttpCode(HttpStatus.CREATED)
  async suscribirPush(
    @Param('padreId') padreId: string,
    @Body() body: { endpoint: string; p256dh: string; auth: string; dispositivo?: string }
  ) {
    return this.padresService.suscribirPush(padreId, body);
  }

  @Delete(':padreId/push/subscribe')
  async desuscribirPush(
    @Param('padreId') padreId: string,
    @Body() body: { endpoint: string }
  ) {
    return this.padresService.desuscribirPush(padreId, body.endpoint);
  }
}
