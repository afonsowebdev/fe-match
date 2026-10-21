import { Router } from 'express';

import { healthRoutes } from './health.routes.js';

// Ponto único onde se montam todas as rotas da API.
export const routes = Router();

routes.use('/health', healthRoutes);
