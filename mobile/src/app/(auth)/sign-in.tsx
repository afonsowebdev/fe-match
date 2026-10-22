import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Input, Screen } from '@/components';
import { signIn } from '@/stores/session';
import { colors, spacing, typography } from '@/theme';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim() || !password) {
      setError('Preenche o email e a palavra-passe.');
      return;
    }
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result === 'ok') router.replace('/discover');
    else if (result === 'no-account')
      setError('Ainda não há nenhuma conta neste telemóvel. Cria uma primeiro.');
    else setError('Email ou palavra-passe incorretos.');
  }

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
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError(null);
          }}
        />
        <Input
          label="Palavra-passe"
          placeholder="••••••••"
          secureTextEntry
          autoComplete="password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError(null);
          }}
          onSubmitEditing={submit}
          error={error ?? undefined}
        />
      </View>

      <Button title="Entrar" loading={loading} onPress={submit} />

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
