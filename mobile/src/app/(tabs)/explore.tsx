import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components';
import { mockProfiles } from '@/mocks/profiles';
import { setPreferences } from '@/stores/preferences';
import { colors, radii, spacing, typography } from '@/theme';

// Cada categoria abre o Descobrir com o filtro do mesmo nome (lib/discoverFilters.ts).
// TEMPORÁRIO: fotos dos perfis fictícios.
const CATEGORIES = [
  {
    title: 'Rumo ao casamento',
    subtitle: 'Quem procura compromisso',
    photo: 'sara',
    filter: 'Casamento',
  },
  { title: 'Namoro sério', subtitle: 'Conhecer com calma', photo: 'mariana', filter: 'Namoro' },
  { title: 'Novas amizades', subtitle: 'Gente da tua fé', photo: 'ines', filter: 'Amizade' },
  {
    title: 'Louvor e música',
    subtitle: 'Quem serve no louvor',
    photo: 'beatriz',
    filter: 'Louvor',
  },
  {
    title: 'Ministério de jovens',
    subtitle: 'Líderes e voluntários',
    photo: 'tiago',
    filter: 'Jovens',
  },
  {
    title: 'Perfis verificados',
    subtitle: 'Identidade confirmada',
    photo: 'catarina',
    filter: 'Verificados',
  },
];

export default function ExploreScreen() {
  return (
    <Screen edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorar</Text>
        <Text style={styles.subtitle}>Encontra pessoas com os mesmos objetivos que tu.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {CATEGORIES.map((category) => {
          const profile = mockProfiles.find((p) => p.id === category.photo);
          return (
            <Pressable
              key={category.title}
              accessibilityRole="button"
              onPress={() => {
                setPreferences({ quickFilter: category.filter });
                router.navigate('/discover');
              }}
              style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}>
              <Image source={{ uri: profile?.photos[0] }} style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={['transparent', colors.backgroundDeep]}
                locations={[0.3, 1]}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.tileTitle}>{category.title}</Text>
              <Text style={styles.tileSubtitle}>{category.subtitle}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingBottom: 0,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
    paddingBottom: spacing.md,
  },
  tile: {
    width: '48%',
    aspectRatio: 3 / 4,
    borderRadius: radii.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  tilePressed: {
    opacity: 0.85,
  },
  tileTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  tileSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
