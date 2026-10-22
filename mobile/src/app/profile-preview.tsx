import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, ProfileCard } from '@/components';
import { distanceKm } from '@/lib/geo';
import { findProfile } from '@/mocks/profiles';
import { toCardProfile, useMe } from '@/stores/me';
import { usePreferences } from '@/stores/preferences';
import { colors, iconSize, radii, spacing } from '@/theme';

// Perfil em ecrã inteiro. Sem `id` mostra o próprio perfil tal como os outros o veem
// ("Pré-visualizar"); com `id` mostra outra pessoa (ex.: a partir de uma conversa).
export default function ProfilePreviewScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const me = useMe();
  const prefs = usePreferences();
  const other = id ? findProfile(id) : undefined;

  return (
    <View style={styles.container}>
      <ProfileCard
        profile={other ?? toCardProfile(me)}
        hideAge={!other && me.hideAge}
        distance={other ? distanceKm(prefs.location, other) : undefined}
        headerSpace={insets.top + spacing.sm}
        footerSpace={insets.bottom + spacing.lg}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Fechar"
        onPress={() => router.back()}
        style={[styles.close, { top: insets.top + spacing.lg }]}>
        <Icon name="bx-x" size={iconSize.lg} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDeep,
  },
  close: {
    position: 'absolute',
    right: spacing.md,
    width: 48,
    height: 48,
    borderRadius: radii.pill,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
