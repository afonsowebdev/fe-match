import createIconSet from '@expo/vector-icons/createIconSet';

import glyphMap from './boxicons.json';

// Ícones Boxicons 2.1.4 (https://boxicons.com), a partir da fonte boxicons.ttf.
// Nomes iguais aos do site: `bx-*` (contorno), `bxs-*` (cheio), `bxl-*` (logótipos).
// O glyph map foi gerado a partir do boxicons.css do pacote npm `boxicons@2.1.4`.
export type IconName = keyof typeof glyphMap;

export const Icon = createIconSet(
  glyphMap as Record<IconName, number>,
  'boxicons',
  require('../../../assets/fonts/boxicons.ttf'),
);
