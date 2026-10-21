import { Link } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Input, Screen } from '@/components';
import { MIN_AGE } from '@/config';
import { colors, spacing, typography } from '@/theme';

export default function SignUpScreen() {
  return (
    <Screen edges={['bottom']} padded={false}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Apenas para maiores de {MIN_AGE} anos.</Text>
        </View>

        <View style={styles.form}>
          <Input label="Nome" placeholder="O teu primeiro nome" autoComplete="given-name" />
          <Input
            label="Email"
            placeholder="nome@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Input
            label="Data de nascimento"
            placeholder="DD/MM/AAAA"
            keyboardType="number-pad"
            autoComplete="birthdate-full"
          />
          <Input
            label="Palavra-passe"
            placeholder="Mínimo 8 caracteres"
            secureTextEntry
            autoComplete="new-password"
          />
        </View>

        <Button
          title="Criar conta"
          onPress={() => Alert.alert('Em breve', 'O registo chega na fase de autenticação.')}
        />

        <Link href="/sign-in" replace style={styles.link}>
          Já tens conta? Entra
        </Link>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
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
