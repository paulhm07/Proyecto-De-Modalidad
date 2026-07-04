import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AvatarsService } from './avatars.service';

@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Get('tienda')
  async getTienda() {
    return this.avatarsService.getTienda();
  }

  @Post('seed')
  async seedTienda() {
    return this.avatarsService.seedTienda();
  }

  @Get('mi-avatar/:usuarioId')
  async getMiAvatar(@Param('usuarioId') usuarioId: string) {
    return this.avatarsService.getMiAvatar(usuarioId);
  }

  @Post('comprar/:usuarioId')
  @HttpCode(HttpStatus.OK)
  async comprar(
    @Param('usuarioId') usuarioId: string,
    @Body() body: { itemId: string },
  ) {
    return this.avatarsService.comprar(usuarioId, body.itemId);
  }

  @Post('equipar/:usuarioId')
  @HttpCode(HttpStatus.OK)
  async equipar(
    @Param('usuarioId') usuarioId: string,
    @Body() body: { itemId: string },
  ) {
    return this.avatarsService.equipar(usuarioId, body.itemId);
  }
}
