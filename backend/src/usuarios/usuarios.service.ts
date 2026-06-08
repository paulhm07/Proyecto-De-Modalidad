import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Rol } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async createStudent(nombre: string, pin: string) {
    if (!nombre || !pin || pin.length !== 4 || isNaN(Number(pin))) {
      throw new UnauthorizedException('El nombre es requerido y el PIN debe ser numérico de 4 dígitos');
    }
    return this.prisma.usuario.create({
      data: {
        nombre,
        pin,
        rol: Rol.ESTUDIANTE,
      },
    });
  }

  async validatePin(nombre: string, pin: string) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { nombre },
    });

    if (!usuario || usuario.pin !== pin) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Retorna usuario sin PIN expuesto
    const { pin: _, ...usuarioSinPin } = usuario;
    return usuarioSinPin;
  }

  async getUserProfile(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        medallas: {
          include: {
            medalla: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const { pin: _, ...usuarioSinPin } = usuario;
    return usuarioSinPin;
  }

  async updateScore(id: string, puntos: number, exp: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.prisma.usuario.update({
      where: { id },
      data: {
        puntos: usuario.puntos + puntos,
        experiencia: usuario.experiencia + exp,
      },
      select: {
        id: true,
        nombre: true,
        puntos: true,
        experiencia: true,
      },
    });
  }

  async getAllEstudiantes() {
    return this.prisma.usuario.findMany({
      where: { rol: Rol.ESTUDIANTE },
      select: {
        id: true,
        nombre: true,
        avatar: true,
        puntos: true,
        experiencia: true,
      },
      orderBy: { puntos: 'desc' },
    });
  }
}
