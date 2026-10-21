import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type PlaceholderProps = {
  title: string;
  description: string;
};

// Conteúdo temporário dos ecrãs que ainda não foram implementados.
export function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
