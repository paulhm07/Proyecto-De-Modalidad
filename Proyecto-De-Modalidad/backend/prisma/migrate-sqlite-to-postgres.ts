import Database from 'better-sqlite3';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

async function migrate() {
  const sqlitePath = resolve(__dirname, 'educaplay.db');
  if (!existsSync(sqlitePath)) {
    console.error(`❌ No se encontró el archivo SQLite en: ${sqlitePath}`);
    process.exit(1);
  }

  const postgresUrl = process.env.DATABASE_URL;
  if (!postgresUrl || !postgresUrl.startsWith('postgres')) {
    console.error('❌ Debes definir la variable DATABASE_URL con la conexión a PostgreSQL.');
    console.error('Ejemplo: DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mundilex?schema=public"');
    process.exit(1);
  }

  console.log(`🚀 Iniciando migración de SQLite (${sqlitePath}) a PostgreSQL...`);

  const sqlite = new Database(sqlitePath);
  const pool = new Pool({ connectionString: postgresUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  await prisma.$connect();
  console.log('✅ Conexión establecida con PostgreSQL.');

  const tables = [
    'Usuario',
    'AvatarConfig',
    'ItemTienda',
    'UsuarioItem',
    'PadreHijo',
    'Asignatura',
    'Modulo',
    'Desafio',
    'Opcion',
    'ProgresoEstudiante',
    'Medalla',
    'MedallaEstudiante',
    'Seccion',
    'Inscripcion',
    'Tarea',
    'EntregaTarea',
    'Calificacion',
    'Asistencia',
    'Aviso',
    'AvisoLeido',
    'Conversacion',
    'Mensaje',
    'Notificacion',
    'PushSubscription',
  ];

  for (const table of tables) {
    try {
      const rows = sqlite.prepare(`SELECT * FROM "${table}"`).all();
      if (!rows || rows.length === 0) {
        console.log(`ℹ️ Tabla ${table}: sin registros.`);
        continue;
      }

      console.log(`⏳ Migrando ${rows.length} registros en "${table}"...`);

      // Convertir campos booleanos y fechas de SQLite a tipos nativos
      for (const row of rows as Record<string, any>[]) {
        for (const [key, val] of Object.entries(row)) {
          if (typeof val === 'number' && (key.startsWith('es') || key === 'completado' || key === 'activa' || key === 'activo' || key === 'verificado' || key === 'tarde' || key === 'requiereFirma' || key === 'firmado' || key === 'leida' || key === 'enviadaPush')) {
            row[key] = Boolean(val);
          }
          if (typeof val === 'string' && (key.endsWith('At') || key.endsWith('En') || key === 'fecha' || key === 'fechaLimite' || key === 'fechaAsignada' || key === 'fechaEnvio' || key === 'fechaEvento' || key === 'solicitadoEn' || key === 'verificadoEn' || key === 'calificadaEn' || key === 'leidoEn' || key === 'firmaEn' || key === 'ultimaActividad' || key === 'ganadaEn' || key === 'compradoEn')) {
            row[key] = new Date(val);
          }
        }

        const modelDelegate = (prisma as any)[table.charAt(0).toLowerCase() + table.slice(1)];
        if (modelDelegate) {
          await modelDelegate.upsert({
            where: { id: row.id || (row.usuarioId ? { usuarioId: row.usuarioId } : undefined) },
            update: row,
            create: row,
          }).catch(async () => {
            await modelDelegate.create({ data: row }).catch((err: any) => {
              console.warn(`  ⚠️ Advertencia en ${table} (ID: ${row.id}):`, err.message);
            });
          });
        }
      }

      console.log(`✅ Tabla "${table}" migrada exitosamente.`);
    } catch (err: any) {
      console.warn(`⚠️ Error al procesar tabla ${table}: ${err.message}`);
    }
  }

  console.log('\n🎉 ¡Migración de datos a PostgreSQL completada con éxito!');
  await prisma.$disconnect();
  await pool.end();
  sqlite.close();
}

migrate().catch((e) => {
  console.error('❌ Error fatal durante la migración:', e);
  process.exit(1);
});
