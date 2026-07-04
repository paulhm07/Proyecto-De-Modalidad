import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para el frontend en Next.js
  app.enableCors();

  // Establecer prefijo global para endpoints
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Servidor NestJS corriendo en: http://localhost:${port}/api`);
}
bootstrap();
