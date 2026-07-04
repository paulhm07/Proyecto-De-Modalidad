import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';

function resolveDbUrl(): string {
  // Prisma 7 driver adapter espera una ruta de archivo SQLite (sin el prefijo `file:`).
  // Resolvemos a una ruta ABSOLUTA probando varias estrategias para que better-sqlite3
  // encuentre el archivo sin importar el cwd del proceso hijo (`nest start --watch`)
  // ni variables de entorno globales que apunten a otra base de datos del sandbox.
  const raw = process.env.DATABASE_URL ?? 'file:./prisma/educaplay.db';
  const stripped = raw.startsWith('file:') ? raw.slice('file:'.length) : raw;

  // Candidatas en orden de preferencia
  const candidates: string[] = [];

  // 1) Ruta absoluta del env
  if (stripped.startsWith('/')) candidates.push(stripped);

  // 2) Relativa al cwd actual
  candidates.push(resolve(process.cwd(), stripped));

  // 3) Ruta local conocida del backend (relativa al archivo compilado: dist/src -> ../../prisma)
  candidates.push(resolve(__dirname, '../../prisma/educaplay.db'));

  // 4) Último recurso: ruta absoluta conocida del sandbox
  candidates.push('/home/z/my-project/Proyecto-De-Modalidad/backend/prisma/educaplay.db');

  // Devolver la PRIMERA candidata cuyo directorio exista Y, preferiblemente,
  // cuyo archivo también exista. Si ninguna tiene archivo, devolver la primera
  // con directorio válido (para que Prisma lo cree).
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  for (const c of candidates) {
    if (existsSync(dirname(c))) return c;
  }
  return candidates[candidates.length - 1];
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaBetterSqlite3({ url: resolveDbUrl() });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
