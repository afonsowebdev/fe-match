import { Link, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Input, Screen } from '@/components';
import { colors, spacing, typography } from '@/theme';

export default function SignInScreen() {
  return (
    <Screen edges={['bottom']} style={styles.container}>
      <Text style={styles.title}>Entrar</Text>

      <View style={styles.form}>
        <Input
          label="Email"
          placeholder="nome@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Input
          label="Palavra-passe"
          placeholder="••••••••"
          secureTextEntry
          autoComplete="password"
        />
      </View>

      {/* TEMPORÁRIO: sem autenticação ainda, entra direto nas tabs para testar a navegação. */}
      <Button title="Entrar" onPress={() => router.replace('/discover')} />

      <Link href="/sign-up" replace style={styles.link}>
        Ainda não tens conta? Cria uma
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  form: {
    gap: spacing.md,
  },
  link: {
    ...typography.label,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
