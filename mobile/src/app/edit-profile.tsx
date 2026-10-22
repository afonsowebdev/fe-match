import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Divider, Icon, NavRow } from '@/components';
import { PROFILE_FIELDS } from '@/config/profileFields';
import { addPhotoFromLibrary, editField, photoOptions } from '@/lib/profileEditing';
import { MAX_PHOTOS, setMe, useMe } from '@/stores/me';
import { colors, fontWeight, iconSize, radii, spacing, typography } from '@/theme';

const BIO_MAX = 500;

// "Editar perfil": fotos, bio e todos os campos do perfil.
export default function EditProfileScreen() {
  const me = useMe();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Editar perfil</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Concluir"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.done, pressed && styles.pressed]}>
          <Icon name="bx-check" size={iconSize.xl} color={colors.onPrimary} />
        </Pressable>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Text style={styles.sectionTitle}>Fotos</Text>
        <Text style={styles.hint}>
          Toca numa foto para a tornar principal ou remover. A primeira é a que aparece no
          Descobrir.
        </Text>
        <View style={styles.photoGrid}>
          {Array.from({ length: MAX_PHOTOS }, (_, i) => {
            const uri = me.photos[i];
            return uri ? (
              <Pressable key={uri} onPress={() => photoOptions(i)} style={styles.photoCell}>
                <Image source={{ uri }} style={styles.photo} />
                {i === 0 && <Text style={styles.mainTag}>Principal</Text>}
              </Pressable>
            ) : (
              <Pressable
                key={`empty-${i}`}
                accessibilityRole="button"
                accessibilityLabel="Adicionar foto"
                onPress={addPhotoFromLibrary}
                style={[styles.photoCell, styles.photoEmpty]}>
                <View style={styles.addCircle}>
                  <Icon name="bx-plus" size={iconSize.md} color={colors.onPrimary} />
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Sobre mim</Text>
        <View style={styles.card}>
          <TextInput
            value={me.bio}
            onChangeText={(bio) => setMe({ bio })}
            placeholder="Conta um pouco sobre ti, a tua fé e o que procuras."
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.textPrimary}
            multiline
            maxLength={BIO_MAX}
            style={styles.bio}
          />
          <Text style={styles.counter}>
            {me.bio.length}/{BIO_MAX}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Sobre a minha vida</Text>
        <View style={styles.card}>
          {PROFILE_FIELDS.map((field, i) => (
            <View key={field.id}>
              {i > 0 && <Divider />}
              <NavRow
                icon={field.icon}
                label={field.label}
                value={me.fields[field.id] ?? 'Adicionar'}
                onPress={() => editField(field)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDeep,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  done: {
    position: 'absolute',
    right: spacing.md,
    width: 52,
    height: 52,
    borderRadius: radii.pill,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    paddingHorizontal: spacing.xs,
    marginTop: spacing.sm,
  },
  hint: {
    ...typography.label,
    color: colors.textSecondary,
    paddingHorizontal: spacing.xs,
    marginTop: -spacing.sm,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  photoCell: {
    width: '32%',
    aspectRatio: 3 / 4,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  addCircle: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTag: {
    position: 'absolute',
    left: spacing.xs,
    bottom: spacing.xs,
    ...typography.caption,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
  },
  bio: {
    ...typography.body,
    color: colors.textPrimary,
    minHeight: 110,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  counter: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'right',
    paddingBottom: spacing.sm,
  },
});
