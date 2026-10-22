import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Logo, Screen } from '@/components';
import { APP_NAME, APP_SLOGAN } from '@/config';
import { hydrateStores } from '@/stores';
import { sessionStore } from '@/stores/session';
import { colors, spacing, typography } from '@/theme';

const OPENING_DURATION_MS = 1800;

// Ecrã de abertura: carrega os dados guardados no telemóvel e, se houver sessão,
// entra direto no app; senão vai para o ecrã de boas-vindas.
export default function OpeningScreen() {
  useEffect(() => {
    let cancelled = false;
    const wait = new Promise((resolve) => setTimeout(resolve, OPENING_DURATION_MS));
    Promise.all([hydrateStores(), wait]).then(() => {
      if (cancelled) return;
      router.replace(sessionStore.get().signedIn ? '/discover' : '/welcome');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Screen style={styles.center}>
      <Logo size={120} />
      <View style={styles.texts}>
        <Text style={styles.name}>{APP_NAME}</Text>
        <Text style={styles.slogan}>{APP_SLOGAN}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  texts: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.display,
    color: colors.textPrimary,
  },
  slogan: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
