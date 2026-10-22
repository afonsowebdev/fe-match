import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon } from '@/components';
import { findProfile } from '@/mocks/profiles';
import { useMe } from '@/stores/me';
import { colors, iconSize, radii, spacing, typography } from '@/theme';

// "É um match!": aparece por cima do Descobrir quando os dois deram Gosto.
export default function MatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = findProfile(id);
  const me = useMe();
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12 });
  }, [scale]);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (!profile) return null;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg },
      ]}>
      <Animated.View style={[styles.hero, popStyle]}>
        <Text style={styles.title}>É um match! 🙏</Text>
        <Text style={styles.subtitle}>Tu e {profile.name} gostaram um do outro.</Text>

        <View style={styles.photos}>
          <Avatar uri={me.photos[0]} style={styles.left} />
          <Avatar uri={profile.photos[0]} style={styles.right} />
          <View style={styles.heart}>
            <Icon name="bxs-heart" size={iconSize.lg} color={colors.onPrimary} />
          </View>
        </View>
      </Animated.View>

      <View style={styles.actions}>
        <Button
          title="Enviar mensagem"
          onPress={() => router.replace({ pathname: '/chat/[id]', params: { id: profile.id } })}
        />
        <Button title="Continuar a ver" variant="secondary" onPress={() => router.back()} />
      </View>
    </View>
  );
}

function Avatar({ uri, style }: { uri?: string; style: object }) {
  return uri ? (
    <Image source={{ uri }} style={[styles.avatar, style]} />
  ) : (
    <View style={[styles.avatar, styles.avatarEmpty, style]}>
      <Icon name="bx-user" size={iconSize.xxl} color={colors.textMuted} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDeep,
    paddingHorizontal: spacing.lg,
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
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  photos: {
    flexDirection: 'row',
    marginTop: spacing.xl,
  },
  avatar: {
    width: 140,
    height: 186,
    borderRadius: radii.lg,
    borderWidth: 3,
    borderColor: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  avatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  left: {
    transform: [{ rotate: '-8deg' }],
    marginRight: -spacing.md,
  },
  right: {
    transform: [{ rotate: '8deg' }],
    marginLeft: -spacing.md,
  },
  heart: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    marginLeft: -26,
    bottom: -20,
    width: 52,
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.backgroundDeep,
  },
  actions: {
    gap: spacing.sm,
  },
});
