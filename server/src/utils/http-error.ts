// Erro "esperado" com código HTTP. Lança-se em services/controllers
// (ex.: `throw new HttpError(404, 'Perfil não encontrado')`) e o
// error handler transforma-o na resposta certa.
export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
