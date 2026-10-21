import { PrismaPg } from '@prisma/adapter-pg';

import { env } from '../config/env.js';
import { PrismaClient } from '../generated/prisma/client.js';

// Uma única instância para toda a app: cada PrismaClient abre o seu próprio
// pool de ligações, e criar vários esgotava as ligações do PostgreSQL.
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
