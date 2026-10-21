import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Logo, Screen } from '@/components';
import { APP_NAME, APP_SLOGAN } from '@/config';
import { colors, spacing, typography } from '@/theme';

const OPENING_DURATION_MS = 1800;

// Ecrã de abertura. Mais tarde, em vez de esperar um tempo fixo, vai verificar
// se existe sessão e decidir entre (auth) e (tabs).
export default function OpeningScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/welcome'), OPENING_DURATION_MS);
    return () => clearTimeout(timer);
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
