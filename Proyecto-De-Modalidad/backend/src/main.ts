import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para el frontend en Next.js
  app.enableCors();

  // Establecer prefijo global para endpoints
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3001;
  // Escuchar en 0.0.0.0 para ser accesible desde el gateway Caddy
  await app.listen(port, '0.0.0.0');
  console.log(`Servidor NestJS corriendo en: http://0.0.0.0:${port}/api`);
}
bootstrap();
