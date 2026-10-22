import { useSyncExternalStore } from 'react';

import type { CardProfile } from '@/components/ProfileCard';
import type { FieldId } from '@/config/profileFields';
import { deleteProfilePhoto } from '@/lib/photos';

import { createStore } from './createStore';

// O perfil de quem está a usar o app, guardado no telemóvel.
// TEMPORÁRIO: quando houver API, passa a ser guardado no servidor.

export const MAX_PHOTOS = 6;

export type Me = {
  name: string;
  // AAAA-MM-DD
  birthDate: string;
  photos: string[];
  bio: string;
  fields: Partial<Record<FieldId, string>>;
  // Título do tópico/interesse → resposta.
  topics: Record<string, string>;
  interests: Record<string, string>;
  smartPhotos: boolean;
  hideAge: boolean;
  hideDistance: boolean;
};

const store = createStore<Me>(
  {
    name: '',
    birthDate: '2000-01-01',
    photos: [],
    bio: '',
    fields: {},
    topics: {},
    interests: {},
    smartPhotos: true,
    hideAge: false,
    hideDistance: false,
  },
  'fematch.me',
);

export const meStore = store;
export const setMe = store.set;

export function useMe() {
  return useSyncExternalStore(store.subscribe, store.get);
}

// Conta nova: perfil limpo só com nome e data de nascimento.
export function resetMe(name: string, birthDate: string) {
  store.get().photos.forEach(deleteProfilePhoto);
  store.reset({ name, birthDate });
}

// Grava `value` em `record[key]`, ou apaga a chave quando o valor é null.
function withValue<K extends string>(
  record: Partial<Record<K, string>>,
  key: K,
  value: string | null,
) {
  const next = { ...record };
  if (value) next[key] = value;
  else delete next[key];
  return next;
}

export function setField(id: FieldId, value: string | null) {
  store.set({ fields: withValue(store.get().fields, id, value) });
}

export function setTopic(title: string, value: string | null) {
  store.set({ topics: withValue(store.get().topics, title, value) as Record<string, string> });
}

export function setInterest(title: string, value: string | null) {
  store.set({
    interests: withValue(store.get().interests, title, value) as Record<string, string>,
  });
}

export function addPhoto(uri: string) {
  const { photos } = store.get();
  if (photos.length < MAX_PHOTOS) store.set({ photos: [...photos, uri] });
}

export function removePhoto(index: number) {
  const { photos } = store.get();
  deleteProfilePhoto(photos[index]);
  store.set({ photos: photos.filter((_, i) => i !== index) });
}

export function makeMainPhoto(index: number) {
  const { photos } = store.get();
  store.set({ photos: [photos[index], ...photos.filter((_, i) => i !== index)] });
}

// O próprio perfil no formato do cartão do Descobrir (para a pré-visualização).
export function toCardProfile(me: Me): CardProfile {
  return {
    name: me.name || 'Eu',
    birthDate: me.birthDate,
    city: me.fields.city ?? '',
    denomination: me.fields.denomination ?? '',
    church: me.fields.church ?? '',
    ministry: me.fields.ministry ?? null,
    favoriteVerse: me.interests['Versículo favorito'] ?? '',
    intention: me.fields.intention ?? '',
    bio: me.bio,
    isVerified: false,
    photos: me.photos,
  };
}
