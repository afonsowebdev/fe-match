import { Alert } from 'react-native';

// Pequenos diálogos nativos para escolher uma opção ou escrever um texto curto.

type PickOptions = {
  // Mostra uma opção para limpar o valor (ex.: "Qualquer" ou "Remover").
  clearLabel?: string;
  message?: string;
};

export function pickOption(
  title: string,
  options: string[],
  onPick: (value: string | null) => void,
  { clearLabel, message }: PickOptions = {},
) {
  Alert.alert(title, message, [
    ...options.map((option) => ({ text: option, onPress: () => onPick(option) })),
    ...(clearLabel
      ? [{ text: clearLabel, style: 'destructive' as const, onPress: () => onPick(null) }]
      : []),
    { text: 'Cancelar', style: 'cancel' as const },
  ]);
}

// Texto livre. Uma resposta vazia devolve null (serve para apagar o valor).
export function promptText(
  title: string,
  message: string,
  current: string | undefined,
  onSubmit: (value: string | null) => void,
) {
  // Alert.prompt só existe no iOS.
  if (!Alert.prompt) {
    Alert.alert(title, 'Disponível em breve neste sistema.');
    return;
  }
  Alert.prompt(
    title,
    message,
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Guardar', onPress: (value?: string) => onSubmit(value?.trim() || null) },
    ],
    'plain-text',
    current,
  );
}
