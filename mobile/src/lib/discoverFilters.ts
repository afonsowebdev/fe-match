import type { MockProfile } from '@/mocks/profiles';

// Chips do topo do Descobrir. O Explorar abre o Descobrir com um destes filtros (pelo `label`).
type Filter = { label: string; matches: (p: MockProfile) => boolean };

export const FILTERS: Filter[] = [
  { label: 'Para ti', matches: () => true },
  { label: 'Casamento', matches: (p) => p.intention === 'Casamento' },
  { label: 'Namoro', matches: (p) => p.intention === 'Namoro' },
  { label: 'Amizade', matches: (p) => p.intention === 'Amizade' },
  { label: 'Louvor', matches: (p) => p.ministry === 'Louvor' },
  { label: 'Jovens', matches: (p) => p.ministry === 'Jovens' },
  { label: 'Verificados', matches: (p) => p.isVerified },
];
