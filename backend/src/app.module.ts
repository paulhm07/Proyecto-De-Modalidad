import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DesafiosModule } from './desafios/desafios.module';
import { ProgresoModule } from './progreso/progreso.module';

@Module({
  imports: [PrismaModule, UsuariosModule, DesafiosModule, ProgresoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
