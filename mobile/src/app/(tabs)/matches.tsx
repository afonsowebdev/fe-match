import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon, Screen } from '@/components';
import { findProfile, getAge, type MockProfile } from '@/mocks/profiles';
import { pendingLikes, swipe, useActivity } from '@/stores/activity';
import { colors, fontWeight, iconSize, radii, spacing, typography } from '@/theme';

export default function MatchesScreen() {
  const activity = useActivity();

  const likers = pendingLikes(activity)
    .map(findProfile)
    .filter((p): p is MockProfile => !!p);
  const matches = Object.keys(activity.matches)
    .map(findProfile)
    .filter((p): p is MockProfile => !!p)
    .sort((a, b) => activity.matches[b.id] - activity.matches[a.id]);

  // Com Premium, tocar em quem gostou de ti dá Gosto de volta (e match).
  function likeBack(id: string) {
    if (swipe(id, 'like')) router.push({ pathname: '/match', params: { id } });
  }

  return (
    <Screen edges={['top']} padded={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Matches</Text>

        {likers.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Gostam de ti</Text>
              <Text style={styles.count}>{likers.length}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.likers}>
              {likers.map((p) => (
                <Pressable
                  key={p.id}
                  accessibilityLabel={activity.premium ? `Gostar de ${p.name}` : 'Ver Premium'}
                  onPress={() => (activity.premium ? likeBack(p.id) : router.push('/premium'))}
                  style={styles.liker}>
                  <Image
                    source={{ uri: p.photos[0] }}
                    // Sem Premium, as fotos ficam desfocadas.
                    blurRadius={activity.premium ? 0 : 30}
                    style={styles.likerPhoto}
                  />
                  <Text style={styles.likerName}>{activity.premium ? p.name : '•••'}</Text>
                </Pressable>
              ))}
            </ScrollView>
            {!activity.premium && (
              <Pressable onPress={() => router.push('/premium')} style={styles.unlock}>
                <Icon name="bxs-crown" size={iconSize.sm} color={colors.onPrimary} />
                <Text style={styles.unlockText}>Vê quem gosta de ti com o Premium</Text>
              </Pressable>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Os teus matches</Text>
          {matches.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="bx-heart" size={iconSize.xxl} color={colors.textMuted} />
              <Text style={styles.emptyText}>Ainda sem matches. Continua a descobrir!</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {matches.map((profile) => (
                <Pressable
                  key={profile.id}
                  onPress={() =>
                    router.push({ pathname: '/chat/[id]', params: { id: profile.id } })
                  }
                  style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
                  <Image source={{ uri: profile.photos[0] }} style={styles.photo} />
                  <Text style={styles.name}>
                    {profile.name}, {getAge(profile.birthDate)}
                  </Text>
                  <Text style={styles.detail}>{profile.city}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.label,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  count: {
    ...typography.caption,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
    backgroundColor: colors.badge,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  likers: {
    gap: spacing.md,
  },
  liker: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  likerPhoto: {
    width: 96,
    height: 128,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  likerName: {
    ...typography.label,
    color: colors.textPrimary,
  },
  unlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  unlockText: {
    ...typography.button,
    color: colors.onPrimary,
  },
  empty: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  item: {
    width: '48%',
    gap: spacing.xxs,
  },
  pressed: {
    opacity: 0.8,
  },
  photo: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  name: {
    ...typography.label,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  detail: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
