import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon, Screen } from '@/components';
import { findProfile, type MockProfile } from '@/mocks/profiles';
import { useActivity } from '@/stores/activity';
import { colors, fontWeight, iconSize, radii, spacing, typography } from '@/theme';

function formatWhen(at: number) {
  const date = new Date(at);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  }
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
  return date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
}

function openChat(id: string) {
  router.push({ pathname: '/chat/[id]', params: { id } });
}

export default function ChatsScreen() {
  const activity = useActivity();

  const matched = Object.keys(activity.matches)
    .map(findProfile)
    .filter((p): p is MockProfile => !!p);
  // Matches sem mensagens aparecem em cima, como "novos matches".
  const newMatches = matched
    .filter((p) => !activity.conversations[p.id]?.length)
    .sort((a, b) => activity.matches[b.id] - activity.matches[a.id]);
  const chats = matched
    .filter((p) => activity.conversations[p.id]?.length)
    .map((p) => ({ profile: p, last: activity.conversations[p.id].at(-1)! }))
    .sort((a, b) => b.last.at - a.last.at);

  return (
    <Screen edges={['top']} padded={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Conversas</Text>

        {newMatches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Novos matches</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.newMatches}>
              {newMatches.map((p) => (
                <Pressable key={p.id} onPress={() => openChat(p.id)} style={styles.newMatch}>
                  <Image source={{ uri: p.photos[0] }} style={styles.newMatchPhoto} />
                  <Text style={styles.newMatchName}>{p.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mensagens</Text>
          {chats.length === 0 ? (
            <View style={styles.empty}>
              <Icon name="bx-message-rounded-dots" size={iconSize.xxl} color={colors.textMuted} />
              <Text style={styles.emptyText}>
                Ainda não tens conversas. Dá Gosto a alguém no Descobrir e começa a falar quando
                derem match.
              </Text>
            </View>
          ) : (
            chats.map(({ profile, last }) => {
              const unread = activity.unread[profile.id] ?? 0;
              return (
                <Pressable
                  key={profile.id}
                  onPress={() => openChat(profile.id)}
                  style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
                  <Image source={{ uri: profile.photos[0] }} style={styles.avatar} />
                  <View style={styles.text}>
                    <View style={styles.header}>
                      <Text style={styles.name}>{profile.name}</Text>
                      <Text style={styles.time}>{formatWhen(last.at)}</Text>
                    </View>
                    <Text style={[styles.message, unread > 0 && styles.unread]} numberOfLines={1}>
                      {last.from === 'me' ? 'Tu: ' : ''}
                      {last.text}
                    </Text>
                  </View>
                  {unread > 0 && <Text style={styles.badge}>{unread}</Text>}
                </Pressable>
              );
            })
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
  sectionTitle: {
    ...typography.label,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  newMatches: {
    gap: spacing.md,
  },
  newMatch: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  newMatchPhoto: {
    width: 76,
    height: 100,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  newMatchName: {
    ...typography.label,
    color: colors.textPrimary,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  text: {
    flex: 1,
    gap: spacing.xxs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    ...typography.body,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
  },
  message: {
    ...typography.label,
    color: colors.textMuted,
  },
  unread: {
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold,
  },
  badge: {
    ...typography.caption,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
    backgroundColor: colors.badge,
    minWidth: 22,
    textAlign: 'center',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    overflow: 'hidden',
  },
});
