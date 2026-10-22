import { router } from 'expo-router';
import { Alert } from 'react-native';

import { activityStore, startBoost } from '@/stores/activity';

// Fluxo do botão "Destaque" (raio), partilhado pelo Descobrir e pelo Perfil.
export function openBoost() {
  const { boosts, boostUntil } = activityStore.get();

  if (boostUntil && boostUntil > Date.now()) {
    const minutes = Math.ceil((boostUntil - Date.now()) / 60000);
    Alert.alert('Destaque ativo ⚡', `O teu perfil está em destaque durante mais ${minutes} min.`);
    return;
  }

  if (boosts <= 0) {
    Alert.alert('Sem Destaques', 'Com o Premium recebes um Destaque todos os meses.', [
      { text: 'Agora não', style: 'cancel' },
      { text: 'Ver Premium', onPress: () => router.push('/premium') },
    ]);
    return;
  }

  Alert.alert(
    'Usar um Destaque?',
    `Durante 30 minutos o teu perfil aparece primeiro a quem está perto de ti. Tens ${boosts}.`,
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Usar Destaque',
        onPress: () => {
          if (startBoost()) Alert.alert('Destaque ativo ⚡', 'O teu perfil está em destaque!');
        },
      },
    ],
  );
}

// Fluxo quando acabam os Super Gostos.
export function noSuperLikes() {
  Alert.alert(
    'Sem Super Gostos',
    'Recebes um novo amanhã. Com o Premium tens 5 Super Gostos por dia.',
    [
      { text: 'OK', style: 'cancel' },
      { text: 'Ver Premium', onPress: () => router.push('/premium') },
    ],
  );
}
