import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Logo, Screen } from '@/components';
import { APP_NAME, APP_SLOGAN } from '@/config';
import { DEMO_EMAIL, DEMO_PASSWORD, signInAsDemo } from '@/stores/session';
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
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            Alert.alert(
              'Entrar com a conta demo?',
              `Cria uma conta de teste com o perfil já preenchido.\n\nEmail: ${DEMO_EMAIL}\nPalavra-passe: ${DEMO_PASSWORD}`,
              [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Entrar',
                  onPress: async () => {
                    await signInAsDemo();
                    router.replace('/discover');
                  },
                },
              ],
            )
          }
          style={styles.demo}>
          <Text style={styles.demoText}>Experimentar com a conta demo</Text>
        </Pressable>
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
  demo: {
    paddingVertical: spacing.sm,
  },
  demoText: {
    ...typography.label,
    color: colors.primary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
