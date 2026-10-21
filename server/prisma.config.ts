// Configuração do Prisma CLI (migrações, seed, ligação à BD).
// O Prisma 7 não lê o .env sozinho: é o import abaixo que o carrega.
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
