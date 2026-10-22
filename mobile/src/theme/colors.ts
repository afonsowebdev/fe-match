// Cores em bruto da marca. Não usar diretamente nos componentes:
// usar `colors` (abaixo), que dá um papel a cada cor.
// Paleta "café": preto quente, castanho e bege, com branco para o texto.
export const palette = {
  black: '#0E0B09',
  espresso: '#1E1814',
  brown: '#7A5A43',
  beige: '#D8C3A5',
  sand: '#EFE4D3',
  white: '#FBF8F3',
  terracotta: '#D9826F',
  caramel: '#C9935F',
} as const;

const withAlpha = (hex: string, alpha: number) => {
  const value = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${value}`;
};

export const colors = {
  // Fundo: gradiente de cima (espresso) para baixo (preto)
  backgroundGradient: [palette.espresso, palette.black] as const,
  background: palette.espresso,
  backgroundDeep: palette.black,

  // Destaque bege: só botões principais, logótipo e selos
  primary: palette.beige,
  onPrimary: palette.black,
  logo: palette.beige,
  badge: palette.beige,
  premiumGradient: [palette.sand, palette.brown] as const,

  textPrimary: palette.white,
  textSecondary: withAlpha(palette.white, 0.72),
  textMuted: withAlpha(palette.white, 0.5),

  surface: withAlpha(palette.beige, 0.08),
  surfacePressed: withAlpha(palette.beige, 0.16),
  border: withAlpha(palette.beige, 0.22),
  borderFocused: palette.beige,

  danger: palette.terracotta,

  // Botões redondos por cima das fotos (ecrã Descobrir)
  overlay: withAlpha(palette.black, 0.6),
  superLike: palette.caramel,
} as const;
