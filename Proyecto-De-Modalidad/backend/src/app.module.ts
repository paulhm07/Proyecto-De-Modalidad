import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DesafiosModule } from './desafios/desafios.module';
import { ProgresoModule } from './progreso/progreso.module';
import { AvatarsModule } from './avatars/avatars.module';
import { MaestrosModule } from './maestros/maestros.module';
import { PadresModule } from './padres/padres.module';

@Module({
  imports: [
    PrismaModule,
    UsuariosModule,
    DesafiosModule,
    ProgresoModule,
    AvatarsModule,
    MaestrosModule,
    PadresModule,
  ],
})
export class AppModule {}
