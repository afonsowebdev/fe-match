import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { isProduction } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';

// Middleware de erros centralizado. O Express reconhece-o por ter 4 parâmetros.
// No Express 5, erros lançados em handlers async também chegam aqui sozinhos.
// Todas as respostas de erro têm o mesmo formato: { error: { message, code, details? } }
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: { message: err.message, code: err.code } });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: { message: 'Dados inválidos', code: 'VALIDATION_ERROR', details: err.issues },
    });
    return;
  }

  // JSON mal formado no corpo do pedido (lançado pelo express.json()).
  if (isBodyParseError(err)) {
    res.status(400).json({ error: { message: 'JSON inválido', code: 'INVALID_JSON' } });
    return;
  }

  // Erro inesperado: regista tudo no servidor, mas não expõe detalhes internos
  // ao cliente em produção.
  console.error(err);
  const message = !isProduction && err instanceof Error ? err.message : 'Erro interno do servidor';
  res.status(500).json({ error: { message, code: 'INTERNAL_ERROR' } });
}

function isBodyParseError(err: unknown): boolean {
  return (
    typeof err === 'object' && err !== null && 'type' in err && err.type === 'entity.parse.failed'
  );
}
