import { useSyncExternalStore } from 'react';

import { distanceKm } from '@/lib/geo';
import { getAge, type MockProfile } from '@/mocks/profiles';

import { createStore } from './createStore';

// Preferências de descoberta (ecrã "Preferências de Descoberta"), guardadas no telemóvel.
// TEMPORÁRIO: quando houver API, passam a ser guardadas no servidor e o filtro passa a ser feito lá.

export type ChoiceId =
  | 'intention'
  | 'denomination'
  | 'attendance'
  | 'ministry'
  | 'languages'
  | 'education'
  | 'family'
  | 'communication'
  | 'pets'
  | 'drinking'
  | 'smoking'
  | 'workout';

export type DiscoveryPreferences = {
  location: { label: string; latitude: number; longitude: number };
  maxDistance: number;
  expandDistance: boolean;
  interestedIn: 'Mulheres' | 'Homens' | 'Todos';
  ageRange: [number, number];
  expandAge: boolean;
  minPhotos: number;
  hasBio: boolean;
  verifiedOnly: boolean;
  // null = sem preferência ("Selecionar").
  choices: Partial<Record<ChoiceId, string | null>>;
  // Chip escolhido no topo do Descobrir (também usado pelo Explorar).
  quickFilter: string;
};

const store = createStore<DiscoveryPreferences>(
  {
    location: { label: 'Lisboa, Portugal', latitude: 38.7223, longitude: -9.1393 },
    maxDistance: 160,
    expandDistance: true,
    interestedIn: 'Todos',
    ageRange: [18, 40],
    expandAge: false,
    minPhotos: 1,
    hasBio: false,
    verifiedOnly: false,
    choices: {},
    quickFilter: 'Para ti',
  },
  'fematch.preferences',
);

export const preferencesStore = store;
export const setPreferences = store.set;

export function setChoice(id: ChoiceId, value: string | null) {
  setPreferences({ choices: { ...store.get().choices, [id]: value } });
}

export function usePreferences() {
  return useSyncExternalStore(store.subscribe, store.get);
}

// Margem usada quando se aceita mostrar pessoas "ligeiramente fora" da faixa etária.
const AGE_MARGIN = 5;

// Só filtra pelos campos que os perfis fictícios têm (frequência na igreja, por exemplo, não).
// Com `relaxed`, ignora a distância e alarga a idade, se as opções "mostrar mais" estiverem ligadas.
export function matchesPreferences(
  profile: MockProfile,
  prefs: DiscoveryPreferences,
  relaxed = false,
) {
  const age = getAge(profile.birthDate);
  const ageMargin = relaxed && prefs.expandAge ? AGE_MARGIN : 0;
  const [minAge, maxAge] = prefs.ageRange;
  const { intention, denomination, ministry } = prefs.choices;

  if (prefs.interestedIn === 'Mulheres' && profile.gender !== 'Feminino') return false;
  if (prefs.interestedIn === 'Homens' && profile.gender !== 'Masculino') return false;
  if (age < minAge - ageMargin || age > maxAge + ageMargin) return false;
  if (!(relaxed && prefs.expandDistance) && distanceKm(prefs.location, profile) > prefs.maxDistance)
    return false;
  if (profile.photos.length < prefs.minPhotos) return false;
  if (prefs.hasBio && !profile.bio) return false;
  if (prefs.verifiedOnly && !profile.isVerified) return false;
  if (intention && profile.intention !== intention) return false;
  if (denomination && profile.denomination !== denomination) return false;
  if (ministry === 'Serve num ministério' && !profile.ministry) return false;
  return true;
}
