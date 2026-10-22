// Cores em bruto da marca. Não usar diretamente nos componentes:
// usar `colors` (abaixo), que dá um papel a cada cor.
export const palette = {
  navy: '#0F2A5C',
  navyDeep: '#0A1A3A',
  gold: '#D4AF37',
  light: '#F8F9FA',
  red: '#F28B82',
  sky: '#8AB4F8',
  goldDeep: '#A8841F',
} as const;

const withAlpha = (hex: string, alpha: number) => {
  const value = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${value}`;
};

export const colors = {
  // Fundo: gradiente de cima (navy) para baixo (navyDeep)
  backgroundGradient: [palette.navy, palette.navyDeep] as const,
  background: palette.navy,
  backgroundDeep: palette.navyDeep,

  // Destaque dourado: só botões principais, logótipo e selos
  primary: palette.gold,
  onPrimary: palette.navyDeep,
  logo: palette.gold,
  badge: palette.gold,
  premiumGradient: [palette.gold, palette.goldDeep] as const,

  textPrimary: palette.light,
  textSecondary: withAlpha(palette.light, 0.72),
  textMuted: withAlpha(palette.light, 0.5),

  surface: withAlpha(palette.light, 0.08),
  surfacePressed: withAlpha(palette.light, 0.14),
  border: withAlpha(palette.light, 0.2),
  borderFocused: palette.light,

  danger: palette.red,

  // Botões redondos por cima das fotos (ecrã Descobrir)
  overlay: withAlpha(palette.navyDeep, 0.6),
  superLike: palette.sky,
} as const;
