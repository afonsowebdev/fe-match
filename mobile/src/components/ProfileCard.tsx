import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { getAge } from '@/mocks/profiles';
import { colors, iconSize, radii, spacing, typography } from '@/theme';

import { Icon } from './Icon';

// O que o cartão mostra. Serve tanto para os perfis fictícios como para o próprio perfil.
export type CardProfile = {
  name: string;
  birthDate: string;
  city: string;
  denomination: string;
  church: string;
  ministry: string | null;
  favoriteVerse: string;
  intention: string;
  bio: string;
  isVerified: boolean;
  photos: string[];
};

type ProfileCardProps = {
  profile: CardProfile;
  hideAge?: boolean;
  // Distância a mostrar no subtítulo (em km), se for conhecida.
  distance?: number;
  // Espaço livre em baixo para os botões de ação que ficam por cima do cartão.
  footerSpace?: number;
  // Espaço livre em cima para os filtros que ficam por cima do cartão.
  headerSpace?: number;
};

// Cartão de perfil do ecrã Descobrir: foto a ocupar o ecrã inteiro, barras com
// as fotos em cima e os dados em baixo. Tocar à esquerda/direita muda de foto.
export function ProfileCard({
  profile,
  hideAge = false,
  distance,
  footerSpace = 0,
  headerSpace = 0,
}: ProfileCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const lastPhoto = profile.photos.length - 1;
  const subtitle = [
    profile.denomination,
    profile.city,
    distance !== undefined ? `a ${Math.max(Math.round(distance), 1)} km` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.card}>
      {profile.photos.length > 0 ? (
        <Image source={{ uri: profile.photos[photoIndex] }} style={StyleSheet.absoluteFill} />
      ) : (
        <View style={styles.noPhoto}>
          <Icon name="bx-camera" size={iconSize.xxl} color={colors.textMuted} />
          <Text style={styles.noPhotoText}>Ainda sem fotos</Text>
        </View>
      )}
      <LinearGradient
        colors={[colors.overlay, 'transparent', 'transparent', colors.backgroundDeep]}
        locations={[0, 0.2, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.tapZones}>
        <Pressable
          accessibilityLabel="Foto anterior"
          style={styles.tapZone}
          onPress={() => setPhotoIndex((i) => Math.max(i - 1, 0))}
        />
        <Pressable
          accessibilityLabel="Foto seguinte"
          style={styles.tapZone}
          onPress={() => setPhotoIndex((i) => Math.min(i + 1, lastPhoto))}
        />
      </View>

      <View style={[styles.bars, { top: headerSpace }]} pointerEvents="none">
        {profile.photos.map((url, i) => (
          <View key={url} style={[styles.bar, i === photoIndex && styles.barActive]} />
        ))}
      </View>

      <View style={[styles.info, { paddingBottom: footerSpace }]} pointerEvents="box-none">
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{profile.name}</Text>
              {!hideAge && <Text style={styles.age}>{getAge(profile.birthDate)}</Text>}
              {profile.isVerified && (
                <Icon name="bxs-badge-check" size={iconSize.lg} color={colors.badge} />
              )}
            </View>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={expanded ? 'Esconder detalhes' : 'Ver detalhes'}
            onPress={() => setExpanded((e) => !e)}
            style={styles.infoButton}>
            <Icon
              name={expanded ? 'bx-down-arrow-alt' : 'bx-up-arrow-alt'}
              size={iconSize.md}
              color={colors.onPrimary}
            />
          </Pressable>
        </View>

        {expanded && (
          <View style={styles.details}>
            <View style={styles.tags}>
              {profile.intention ? <Text style={styles.tag}>💍 {profile.intention}</Text> : null}
              {profile.ministry ? <Text style={styles.tag}>🙌 {profile.ministry}</Text> : null}
            </View>
            {profile.church ? <Text style={styles.detailText}>⛪ {profile.church}</Text> : null}
            {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
            {profile.favoriteVerse ? (
              <Text style={styles.verse}>📖 {profile.favoriteVerse}</Text>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noPhoto: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  noPhotoText: {
    ...typography.body,
    color: colors.textMuted,
  },
  card: {
    flex: 1,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    overflow: 'hidden',
    backgroundColor: colors.background,
    justifyContent: 'flex-end',
  },
  tapZones: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
  },
  tapZone: {
    flex: 1,
  },
  bars: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  bar: {
    width: 22,
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  barActive: {
    backgroundColor: colors.textPrimary,
  },
  info: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    ...typography.display,
    color: colors.textPrimary,
  },
  age: {
    ...typography.display,
    fontWeight: typography.body.fontWeight,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.subtitle,
    fontWeight: typography.body.fontWeight,
    color: colors.textPrimary,
  },
  infoButton: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    gap: spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    ...typography.label,
    color: colors.textPrimary,
    backgroundColor: colors.surfacePressed,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    overflow: 'hidden',
  },
  detailText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  bio: {
    ...typography.body,
    color: colors.textPrimary,
  },
  verse: {
    ...typography.label,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
