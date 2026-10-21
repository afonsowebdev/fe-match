import express from 'express';
import helmet from 'helmet';

import { errorHandler } from './middlewares/error-handler.js';
import { notFound } from './middlewares/not-found.js';
import { routes } from './routes/index.js';

// Cria a app sem a pôr a ouvir numa porta. Separar isto do index.ts
// permite usar a app em testes sem abrir uma porta de rede.
export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(express.json({ limit: '100kb' }));

  app.use(routes);

  // A ordem importa: o 404 e o error handler ficam sempre no fim.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
