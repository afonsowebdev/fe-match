import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Logo, Screen } from '@/components';
import { APP_NAME, APP_SLOGAN } from '@/config';
import { colors, spacing, typography } from '@/theme';

export default function WelcomeScreen() {
  return (
    <Screen style={styles.container}>
      <View style={styles.hero}>
        <Logo size={96} />
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.slogan}>{APP_SLOGAN}</Text>
      </View>

      <View style={styles.actions}>
        <Button title="Criar conta" onPress={() => router.push('/sign-up')} />
        <Button
          title="Já tenho conta"
          variant="secondary"
          onPress={() => router.push('/sign-in')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
  },
  slogan: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actions: {
    gap: spacing.sm,
  },
});
