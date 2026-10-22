import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Divider, Icon, SwitchRow } from '@/components';
import { activityStore } from '@/stores/activity';
import { setMe, useMe } from '@/stores/me';
import { signOut, useSession } from '@/stores/session';
import { colors, iconSize, radii, spacing, typography } from '@/theme';

// Ocultar idade/distância é Premium: sem Premium, ligar abre o ecrã do Premium.
function setPremiumOption(patch: { hideAge?: boolean; hideDistance?: boolean }) {
  const turningOn = Object.values(patch).some(Boolean);
  if (turningOn && !activityStore.get().premium) {
    Alert.alert('Funcionalidade Premium', 'Com o Premium controlas o que os outros veem.', [
      { text: 'Agora não', style: 'cancel' },
      { text: 'Ver Premium', onPress: () => router.push('/premium') },
    ]);
    return;
  }
  setMe(patch);
}

// Folha "Definições de perfil", aberta pela roda dentada do ecrã Perfil.
export default function ProfileSettingsScreen() {
  const settings = useMe();
  const { account } = useSession();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + spacing.lg }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
          <Icon name="bx-x" size={iconSize.lg} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Definições de perfil</Text>
      </View>

      <Text style={styles.sectionTitle}>Fotos</Text>
      <View style={styles.card}>
        <SwitchRow
          label="Fotos inteligentes"
          value={settings.smartPhotos}
          onChange={(smartPhotos) => setMe({ smartPhotos })}
        />
      </View>
      <Text style={styles.note}>
        As Fotos Inteligentes testam continuamente todas as fotos do teu perfil e escolhem a melhor
        para mostrar primeiro.
      </Text>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Controla a tua visibilidade</Text>
        <Text style={styles.badge}>Premium</Text>
      </View>
      <View style={styles.card}>
        <SwitchRow
          label="Ocultar a minha idade"
          value={settings.hideAge}
          onChange={(hideAge) => setPremiumOption({ hideAge })}
        />
        <Divider />
        <SwitchRow
          label="Ocultar a minha distância"
          value={settings.hideDistance}
          onChange={(hideDistance) => setPremiumOption({ hideDistance })}
        />
      </View>

      <View style={styles.logout}>
        {account && <Text style={styles.account}>Sessão iniciada como {account.email}</Text>}
        <Button
          title="Terminar sessão"
          variant="secondary"
          onPress={() =>
            Alert.alert('Terminar sessão?', 'Os teus dados ficam guardados neste telemóvel.', [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Terminar sessão',
                style: 'destructive',
                onPress: () => {
                  signOut();
                  router.dismissAll();
                  router.replace('/welcome');
                },
              },
            ])
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundDeep,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  close: {
    position: 'absolute',
    left: 0,
    width: 52,
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.surfacePressed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  badge: {
    ...typography.label,
    fontWeight: typography.button.fontWeight,
    color: colors.onPrimary,
    backgroundColor: colors.badge,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
  },
  note: {
    ...typography.label,
    color: colors.textSecondary,
  },
  logout: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  account: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
