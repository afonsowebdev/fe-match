import brand from './brand.json';

// Identidade da app. Para mudar o nome ou o slogan, edita brand.json:
// é a única fonte, lida tanto pela app como pelo app.config.ts
// (que define o nome que aparece debaixo do ícone no telemóvel).
// Está em JSON porque o app.config.ts corre no Node e não consegue importar ficheiros .ts.
export const APP_NAME: string = brand.name;
export const APP_SLOGAN: string = brand.slogan;

// Idade mínima para usar a app. O servidor faz a validação a sério;
// aqui serve para textos e validação prévia nos formulários.
export const MIN_AGE = 18;
