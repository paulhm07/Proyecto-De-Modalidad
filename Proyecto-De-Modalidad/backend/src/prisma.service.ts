import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';

function resolveDbUrl(): string {
  const raw = process.env.DATABASE_URL ?? 'file:./prisma/educaplay.db';
  const stripped = raw.startsWith('file:') ? raw.slice('file:'.length) : raw;

  // Candidatas en orden de preferencia
  const candidates: string[] = [];

  // 1) Si es una ruta absoluta (POSIX o Windows)
  if (stripped.startsWith('/') || /^[a-zA-Z]:[\\/]/.test(stripped)) {
    candidates.push(stripped);
  }

  // 2) Relativa al cwd actual
  candidates.push(resolve(process.cwd(), stripped));

  // 3) Ruta local conocida del backend (relativa al archivo compilado: dist/src -> ../../prisma)
  candidates.push(resolve(__dirname, '../../prisma/educaplay.db'));

  // 4) Ruta relativa al directorio de prisma
  candidates.push(resolve(__dirname, '../prisma/educaplay.db'));

  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  for (const c of candidates) {
    if (existsSync(dirname(c))) return c;
  }
  return candidates[0] || resolve(process.cwd(), 'prisma/educaplay.db');
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
