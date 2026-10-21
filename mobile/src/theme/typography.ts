import type { TextStyle } from 'react-native';

// Por agora usamos a fonte do sistema (San Francisco no iOS, Roboto no Android).
// Quando houver uma fonte da marca, carrega-se com expo-font e junta-se
// `fontFamily` aos estilos de `typography` abaixo.

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const satisfies Record<string, TextStyle['fontWeight']>;

// Estilos de texto prontos a usar: `<Text style={typography.title}>`
export const typography = {
  display: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, lineHeight: 44 },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, lineHeight: 34 },
  subtitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, lineHeight: 26 },
  body: { fontSize: fontSize.md, fontWeight: fontWeight.regular, lineHeight: 24 },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, lineHeight: 20 },
  caption: { fontSize: fontSize.xs, fontWeight: fontWeight.regular, lineHeight: 16 },
  button: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, lineHeight: 20 },
} as const satisfies Record<string, TextStyle>;
