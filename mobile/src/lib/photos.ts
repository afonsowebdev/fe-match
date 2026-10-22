import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

// Escolhe uma foto da galeria e copia-a para a pasta do app (a cópia do
// seletor fica numa pasta temporária que o iOS pode apagar). Devolve o URI ou null.
export async function pickProfilePhoto(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert(
      'Sem acesso às fotos',
      'Autoriza o acesso às fotos nas Definições do iPhone para adicionares fotos ao perfil.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir Definições', onPress: () => Linking.openSettings() },
      ],
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.8,
  });
  if (result.canceled || !result.assets[0]) return null;

  try {
    const folder = new Directory(Paths.document, 'photos');
    folder.create({ idempotent: true, intermediates: true });
    const source = new File(result.assets[0].uri);
    const target = new File(folder, `${Date.now()}.jpg`);
    await source.copy(target);
    return target.uri;
  } catch {
    // Se a cópia falhar, usa a foto onde está.
    return result.assets[0].uri;
  }
}

// Apaga a cópia guardada pelo app (as fotos da galeria nunca são tocadas).
export function deleteProfilePhoto(uri: string) {
  try {
    const file = new File(uri);
    if (file.exists && uri.startsWith(Paths.document.uri)) file.delete();
  } catch {
    // Nada a fazer: no pior caso fica um ficheiro órfão.
  }
}
