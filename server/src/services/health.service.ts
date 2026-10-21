// Os services têm a lógica e o acesso a dados. Não sabem nada de HTTP
// (req/res), o que os torna fáceis de testar e reutilizar.
export const healthService = {
  getStatus() {
    return { status: 'ok' } as const;
  },
};
