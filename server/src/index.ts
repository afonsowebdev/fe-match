import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`Servidor a correr em http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

// Encerramento limpo: deixa terminar os pedidos em curso e fecha as ligações à BD.
function shutdown(signal: string) {
  console.log(`${signal} recebido, a encerrar...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
