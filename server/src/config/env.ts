import 'dotenv/config';
import { z } from 'zod';

// Valida as variáveis de ambiente no arranque. Se faltar alguma, o servidor
// recusa-se a arrancar com uma mensagem clara, em vez de falhar mais tarde
// a meio de um pedido.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().startsWith('postgresql://'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variáveis de ambiente inválidas:\n' + z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === 'production';
