import { Module } from '@nestjs/common';
import { ProgresoService } from './progreso.service';
import { ProgresoController } from './progreso.controller';

@Module({
  providers: [ProgresoService],
  controllers: [ProgresoController],
})
export class ProgresoModule {}
