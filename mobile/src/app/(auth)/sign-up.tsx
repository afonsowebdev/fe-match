import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Input, Screen } from '@/components';
import { MIN_AGE } from '@/config';
import { getAge } from '@/mocks/profiles';
import { signUp } from '@/stores/session';
import { colors, spacing, typography } from '@/theme';

type Field = 'name' | 'email' | 'birthDate' | 'password';
type Errors = Partial<Record<Field, string>>;

// "DDMMAAAA" → "DD/MM/AAAA" enquanto se escreve.
function formatDate(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/');
}

// "DD/MM/AAAA" → "AAAA-MM-DD", ou null se a data não existir.
function parseDate(text: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (date.getDate() !== Number(day) || date.getMonth() !== Number(month) - 1) return null;
  return `${year}-${month}-${day}`;
}

export default function SignUpScreen() {
  const [values, setValues] = useState<Record<Field, string>>({
    name: '',
    email: '',
    birthDate: '',
    password: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function change(field: Field, text: string) {
    setValues((v) => ({ ...v, [field]: field === 'birthDate' ? formatDate(text) : text }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function submit() {
    const next: Errors = {};
    const birthDate = parseDate(values.birthDate);

    if (values.name.trim().length < 2) next.name = 'Escreve o teu primeiro nome.';
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) next.email = 'Email inválido.';
    if (!birthDate) next.birthDate = 'Data inválida. Usa DD/MM/AAAA.';
    else if (getAge(birthDate) < MIN_AGE)
      next.birthDate = `O Fé Match é só para maiores de ${MIN_AGE} anos.`;
    if (values.password.length < 8) next.password = 'Mínimo 8 caracteres.';

    setErrors(next);
    if (Object.keys(next).length > 0 || !birthDate) return;

    setLoading(true);
    await signUp({ ...values, birthDate });
    setLoading(false);
    router.replace('/profile');
  }

  return (
    <Screen edges={['bottom']} padded={false}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Apenas para maiores de {MIN_AGE} anos.</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome"
            placeholder="O teu primeiro nome"
            autoComplete="given-name"
            value={values.name}
            onChangeText={(text) => change('name', text)}
            error={errors.name}
          />
          <Input
            label="Email"
            placeholder="nome@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={values.email}
            onChangeText={(text) => change('email', text)}
            error={errors.email}
          />
          <Input
            label="Data de nascimento"
            placeholder="DD/MM/AAAA"
            keyboardType="number-pad"
            autoComplete="birthdate-full"
            value={values.birthDate}
            onChangeText={(text) => change('birthDate', text)}
            error={errors.birthDate}
          />
          <Input
            label="Palavra-passe"
            placeholder="Mínimo 8 caracteres"
            secureTextEntry
            autoComplete="new-password"
            value={values.password}
            onChangeText={(text) => change('password', text)}
            error={errors.password}
          />
        </View>

        <Button title="Criar conta" loading={loading} onPress={submit} />

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
