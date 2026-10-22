import { Alert } from 'react-native';

import type { ProfileField } from '@/config/profileFields';
import { pickProfilePhoto } from '@/lib/photos';
import { pickOption, promptText } from '@/lib/prompts';
import { addPhoto, makeMainPhoto, MAX_PHOTOS, meStore, removePhoto, setField } from '@/stores/me';

// Ações de edição do próprio perfil, partilhadas pelo Perfil e pelo "Editar perfil".

export function editField(field: ProfileField) {
  const current = meStore.get().fields[field.id];
  if (field.options) {
    pickOption(field.label, field.options, (value) => setField(field.id, value), {
      clearLabel: current ? 'Remover' : undefined,
    });
  } else {
    promptText(field.label, field.placeholder ?? '', current, (value) => setField(field.id, value));
  }
}

export async function addPhotoFromLibrary() {
  if (meStore.get().photos.length >= MAX_PHOTOS) {
    Alert.alert('Máximo de fotos', `Podes ter até ${MAX_PHOTOS} fotos. Remove uma primeiro.`);
    return;
  }
  const uri = await pickProfilePhoto();
  if (uri) addPhoto(uri);
}

export function photoOptions(index: number) {
  Alert.alert('Foto', undefined, [
    ...(index > 0 ? [{ text: 'Tornar principal', onPress: () => makeMainPhoto(index) }] : []),
    {
      text: 'Remover',
      style: 'destructive' as const,
      onPress: () => removePhoto(index),
    },
    { text: 'Cancelar', style: 'cancel' as const },
  ]);
}
