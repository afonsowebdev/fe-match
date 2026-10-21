import type { Request, Response } from 'express';

import { healthService } from '../services/health.service.js';

// Os controllers traduzem HTTP ↔ services: leem o pedido, chamam o service
// e escrevem a resposta. Não têm lógica de negócio.
export const healthController = {
  getHealth(_req: Request, res: Response) {
    res.json(healthService.getStatus());
  },
};
