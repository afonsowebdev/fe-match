import { router } from 'expo-router';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Button, Icon, ProfileCard, type IconName } from '@/components';
import { noSuperLikes, openBoost } from '@/lib/boost';
import { distanceKm } from '@/lib/geo';
import { promptText } from '@/lib/prompts';
import { useNow } from '@/lib/useNow';
import { FILTERS } from '@/lib/discoverFilters';
import { mockProfiles, type MockProfile } from '@/mocks/profiles';
import {
  resetPasses,
  rewind,
  swipe as recordSwipe,
  useActivity,
  type SwipeType,
} from '@/stores/activity';
import { matchesPreferences, setPreferences, usePreferences } from '@/stores/preferences';
import { colors, iconSize, radii, spacing, typography } from '@/theme';

// Altura reservada no fundo do cartão para a fila de botões.
const ACTIONS_SPACE = 120;

// TEMPORÁRIO: usa perfis fictícios (mocks/profiles.ts) até a API devolver perfis.
export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const prefs = usePreferences();
  const activity = useActivity();
  const filter = FILTERS.find((f) => f.label === prefs.quickFilter) ?? FILTERS[0];

  // Perfis por ver. Se acabarem e as opções "mostrar mais" estiverem ligadas,
  // alarga a distância/idade.
  const deck = useMemo(() => {
    const unseen = mockProfiles.filter((p) => !activity.swipes[p.id] && filter.matches(p));
    const strict = unseen.filter((p) => matchesPreferences(p, prefs));
    return strict.length > 0 ? strict : unseen.filter((p) => matchesPreferences(p, prefs, true));
  }, [activity.swipes, filter, prefs]);

  const profile = deck[0];
  const nextProfile = deck[1];
  const now = useNow();
  const boostActive = !!activity.boostUntil && activity.boostUntil > now;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const swipeThreshold = width * 0.3;
  const headerSpace = insets.top + 64;

  // O gesto pode chamar uma versão antiga de handleSwiped; a ref garante que o swipe
  // fica registado no perfil que está mesmo no topo.
  const currentId = useRef<string | undefined>(undefined);
  useLayoutEffect(() => {
    currentId.current = profile?.id;
  });

  function handleSwiped(type: SwipeType, message?: string) {
    const id = currentId.current;
    if (!id) return;
    const matched = recordSwipe(id, type, message);
    translateX.value = 0;
    translateY.value = 0;
    if (matched) router.push({ pathname: '/match', params: { id } });
  }

  function animateSwipe(type: SwipeType, message?: string) {
    const direction = type === 'pass' ? -1 : 1;
    translateX.value = withTiming(direction * width * 1.5, { duration: 250 }, (done) => {
      if (done) scheduleOnRN(handleSwiped, type, message);
    });
  }

  function superLike() {
    if (activity.superLikes <= 0) return noSuperLikes();
    animateSwipe('superlike');
  }

  function messageWithSuperLike() {
    if (!profile) return;
    if (activity.superLikes <= 0) return noSuperLikes();
    promptText(
      `Mensagem para ${profile.name}`,
      'Vai junto com um Super Gosto. Se der match, a conversa começa por aqui.',
      undefined,
      (text) => {
        if (text) animateSwipe('superlike', text);
      },
    );
  }

  const pan = usePanGesture({
    activeOffsetX: [-10, 10],
    onUpdate: (e) => {
      'worklet';
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    },
    onDeactivate: (e) => {
      'worklet';
      if (Math.abs(e.translationX) > swipeThreshold || Math.abs(e.velocityX) > 800) {
        const liked = e.translationX > 0;
        translateX.value = withTiming((liked ? 1 : -1) * width * 1.5, { duration: 200 }, () => {
          scheduleOnRN(handleSwiped, liked ? 'like' : 'pass');
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${interpolate(translateX.value, [-width, 0, width], [-12, 0, 12])}deg` },
    ],
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          Math.abs(translateX.value),
          [0, swipeThreshold],
          [0.94, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const likeStampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, swipeThreshold], [0, 1], Extrapolation.CLAMP),
  }));
  const passStampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-swipeThreshold, 0], [1, 0], Extrapolation.CLAMP),
  }));

  const card = (p: MockProfile) => (
    <ProfileCard
      key={p.id}
      profile={p}
      distance={distanceKm(prefs.location, p)}
      headerSpace={headerSpace}
      footerSpace={ACTIONS_SPACE}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.deck}>
        {profile ? (
          <>
            {nextProfile && (
              <Animated.View style={[StyleSheet.absoluteFill, nextCardStyle]}>
                {card(nextProfile)}
              </Animated.View>
            )}

            <GestureDetector gesture={pan}>
              <Animated.View key={profile.id} style={[StyleSheet.absoluteFill, cardStyle]}>
                {card(profile)}
                <Animated.Text
                  style={[
                    styles.stamp,
                    styles.likeStamp,
                    { top: headerSpace + 40 },
                    likeStampStyle,
                  ]}>
                  GOSTO
                </Animated.Text>
                <Animated.Text
                  style={[
                    styles.stamp,
                    styles.passStamp,
                    { top: headerSpace + 40 },
                    passStampStyle,
                  ]}>
                  PASSAR
                </Animated.Text>
              </Animated.View>
            </GestureDetector>

            <View style={styles.actions} pointerEvents="box-none">
              <ActionButton
                icon="bx-revision"
                label="Voltar atrás"
                color={colors.textPrimary}
                disabled={activity.history.length === 0}
                onPress={rewind}
              />
              <ActionButton
                icon="bx-x"
                label="Passar"
                size="large"
                color={colors.textPrimary}
                onPress={() => animateSwipe('pass')}
              />
              <ActionButton
                icon="bxs-star"
                label={`Super Gosto (${activity.superLikes})`}
                color={colors.superLike}
                count={activity.superLikes}
                onPress={superLike}
              />
              <ActionButton
                icon="bxs-heart"
                label="Gosto"
                size="large"
                color={colors.primary}
                onPress={() => animateSwipe('like')}
              />
              <ActionButton
                icon="bxs-send"
                label="Enviar mensagem com Super Gosto"
                color={colors.superLike}
                onPress={messageWithSuperLike}
              />
            </View>
          </>
        ) : (
          <View style={[styles.empty, { paddingTop: headerSpace }]}>
            <Icon name="bx-search-alt" size={iconSize.xxl} color={colors.primary} />
            <Text style={styles.emptyText}>
              Já viste todos os perfis com estes filtros. Volta a ver quem passaste ou ajusta as
              preferências.
            </Text>
            <Button title="Ver de novo" variant="secondary" onPress={resetPasses} />
            <Button
              title="Ajustar preferências"
              variant="secondary"
              onPress={() => router.push('/preferences')}
            />
          </View>
        )}

        <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Preferências de pesquisa"
            onPress={() => router.push('/preferences')}>
            <Icon name="bx-slider-alt" size={iconSize.lg} color={colors.textPrimary} />
          </Pressable>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}>
            {FILTERS.map((f) => (
              <Pressable
                key={f.label}
                accessibilityRole="button"
                accessibilityState={{ selected: f === filter }}
                onPress={() => setPreferences({ quickFilter: f.label })}
                style={[styles.chip, f === filter && styles.chipSelected]}>
                <Text style={styles.chipLabel}>{f.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Destacar o meu perfil"
            onPress={openBoost}
            style={[styles.boost, boostActive && styles.boostActive]}>
            <Icon
              name="bxs-zap"
              size={iconSize.lg}
              color={boostActive ? colors.onPrimary : colors.primary}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type ActionButtonProps = {
  icon: IconName;
  label: string;
  color: string;
  size?: 'regular' | 'large';
  disabled?: boolean;
  // Número pequeno no canto (ex.: Super Gostos que restam).
  count?: number;
  onPress: () => void;
};

function ActionButton({
  icon,
  label,
  color,
  size = 'regular',
  disabled = false,
  count,
  onPress,
}: ActionButtonProps) {
  const large = size === 'large';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        large && styles.actionLarge,
        pressed && styles.actionPressed,
        disabled && styles.actionDisabled,
      ]}>
      <Icon name={icon} size={large ? iconSize.xl : iconSize.lg} color={color} />
      {count !== undefined && <Text style={styles.count}>{count}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  count: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 22,
    ...typography.caption,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.onPrimary,
    backgroundColor: colors.superLike,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xs,
    overflow: 'hidden',
  },
  boost: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boostActive: {
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDeep,
  },
  deck: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  chips: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: colors.overlay,
    borderColor: colors.border,
  },
  chipLabel: {
    ...typography.button,
    color: colors.textPrimary,
  },
  stamp: {
    position: 'absolute',
    ...typography.title,
    letterSpacing: 2,
    borderWidth: 4,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
  },
  likeStamp: {
    left: spacing.lg,
    color: colors.primary,
    borderColor: colors.primary,
    transform: [{ rotate: '-15deg' }],
  },
  passStamp: {
    right: spacing.lg,
    color: colors.danger,
    borderColor: colors.danger,
    transform: [{ rotate: '15deg' }],
  },
  actions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  action: {
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLarge: {
    width: 74,
    height: 74,
  },
  actionPressed: {
    transform: [{ scale: 0.92 }],
  },
  actionDisabled: {
    opacity: 0.4,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
