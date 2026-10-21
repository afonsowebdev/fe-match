import type { NextFunction, Request, Response } from 'express';

import { HttpError } from '../utils/http-error.js';

// Chega aqui qualquer pedido que nenhuma rota tratou.
export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `Rota não encontrada: ${req.method} ${req.path}`, 'NOT_FOUND'));
}
