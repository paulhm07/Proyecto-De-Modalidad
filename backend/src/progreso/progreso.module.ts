import { Module } from '@nestjs/common';
import { ProgresoService } from './progreso.service';
import { ProgresoController } from './progreso.controller';

@Module({
  controllers: [ProgresoController],
  providers: [ProgresoService],
  exports: [ProgresoService],
})
export class ProgresoModule {}
