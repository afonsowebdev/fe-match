// Só variáveis com o prefixo EXPO_PUBLIC_ chegam à app, e ficam visíveis
// para qualquer pessoa que abra o bundle: nunca pôr segredos aqui.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
