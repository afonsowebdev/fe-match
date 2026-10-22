import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components';
import { APP_NAME } from '@/config';
import { PROFILE_FIELDS, type ProfileField } from '@/config/profileFields';
import { openBoost } from '@/lib/boost';
import { addPhotoFromLibrary, editField, photoOptions } from '@/lib/profileEditing';
import { promptText } from '@/lib/prompts';
import { useActivity } from '@/stores/activity';
import { MAX_PHOTOS, setInterest, setTopic, useMe } from '@/stores/me';
import { colors, fontFamily, fontWeight, iconSize, radii, spacing, typography } from '@/theme';

// Espaço no fundo da lista para o banner Premium, que fica por cima do conteúdo.
const PREMIUM_SPACE = 190;
const ROUND_BUTTON = 48;

// Os chips dividem-se em duas filas que deslizam juntas.
const CHIP_ROWS: ProfileField[][] = [
  PROFILE_FIELDS.slice(0, Math.ceil(PROFILE_FIELDS.length / 2)),
  PROFILE_FIELDS.slice(Math.ceil(PROFILE_FIELDS.length / 2)),
];

const TOPICS = ['Sobre mim', 'O meu testemunho'];

type Interest = {
  icon: IconName;
  title: string;
  emojis: string[];
  addLabel: string;
  placeholder: string;
};

const INTERESTS: Interest[] = [
  {
    icon: 'bx-heart-circle',
    title: 'Interesse atual',
    emojis: ['🙌', '🎸'],
    addLabel: 'Adicionar interesses',
    placeholder: 'Ex.: Voluntariado, Louvor',
  },
  {
    icon: 'bx-book-open',
    title: 'A ler',
    emojis: ['📖', '✨'],
    addLabel: 'Adicionar leitura',
    placeholder: 'Ex.: Provérbios, um capítulo por dia',
  },
  {
    icon: 'bx-bookmark-heart',
    title: 'Versículo favorito',
    emojis: ['📖'],
    addLabel: 'Escolher versículo',
    placeholder: 'Ex.: Salmos 46:10',
  },
  {
    icon: 'bx-music',
    title: 'Louvor favorito',
    emojis: ['🎵', '🙏'],
    addLabel: 'Escolher músicas',
    placeholder: 'Ex.: Oceans, Hillsong United',
  },
  {
    icon: 'bx-movie-play',
    title: 'Noite de cinema',
    emojis: ['🎬', '🍿'],
    addLabel: 'Adicionar filmes',
    placeholder: 'Ex.: O Escolhido',
  },
  {
    icon: 'bx-football',
    title: 'A torcer por',
    emojis: ['⚽️'],
    addLabel: 'Adicionar equipas',
    placeholder: 'Ex.: Benfica',
  },
  {
    icon: 'bx-joystick',
    title: 'A jogar',
    emojis: ['🎮'],
    addLabel: 'Adicionar jogos',
    placeholder: 'Ex.: Xadrez',
  },
  {
    icon: 'bx-group',
    title: 'Grupo na igreja',
    emojis: ['🤝'],
    addLabel: 'Adicionar grupo',
    placeholder: 'Ex.: Grupo de jovens',
  },
];

function answerTopic(topic: string, current?: string) {
  promptText(topic, 'Escreve uma resposta curta. Deixa vazio para apagar.', current, (value) =>
    setTopic(topic, value),
  );
}

function editInterest(interest: Interest, current?: string) {
  promptText(interest.title, interest.placeholder, current, (value) =>
    setInterest(interest.title, value),
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const me = useMe();
  const activity = useActivity();
  const { topics } = me;

  const missingPhotos = MAX_PHOTOS - me.photos.length;
  const missingTopics = TOPICS.filter((topic) => !topics[topic]).length;
  const filledFields = PROFILE_FIELDS.filter((field) => me.fields[field.id]).length;
  // Média simples de fotos, bio, tópicos e campos preenchidos.
  const completion = Math.round(
    ((me.photos.length / MAX_PHOTOS +
      (me.bio ? 1 : 0) +
      (TOPICS.length - missingTopics) / TOPICS.length +
      filledFields / PROFILE_FIELDS.length) /
      4) *
      100,
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md, paddingBottom: PREMIUM_SPACE },
        ]}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar fotos"
            onPress={() => router.push('/edit-profile')}
            style={styles.photoStack}>
            <StackPhoto uri={me.photos[1]} style={styles.stackBack} />
            <StackPhoto uri={me.photos[0]} style={styles.stackFront} />
          </Pressable>
          <View style={styles.headerText}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {me.name || 'O meu perfil'}
              </Text>
              {activity.premium && (
                <Icon name="bxs-crown" size={iconSize.md} color={colors.badge} />
              )}
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/profile-preview')}
              style={styles.previewLink}>
              <Text style={styles.previewText}>Pré-visualizar</Text>
              <Icon name="bx-chevron-right" size={iconSize.sm} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/edit-profile')}
          style={({ pressed }) => [styles.fillBanner, pressed && styles.pressed]}>
          <Icon name="bxs-error-circle" size={iconSize.lg} color={colors.danger} />
          <View style={styles.fillText}>
            <View style={styles.fillRow}>
              <Text style={styles.fillTitle}>
                {completion < 100 ? 'Preenche o teu perfil' : 'Perfil completo'}
              </Text>
              <Text style={styles.fillPercent}>{completion}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${completion}%` }]} />
            </View>
          </View>
          <Icon name="bx-chevron-right" size={iconSize.md} color={colors.textSecondary} />
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bleed}
          contentContainerStyle={styles.chipRows}>
          <View style={styles.chipColumn}>
            {CHIP_ROWS.map((row) => (
              <View key={row[0].id} style={styles.chipRow}>
                {row.map((field) => (
                  <ChipButton key={field.id} field={field} value={me.fields[field.id]} />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>

        <SectionTitle
          title="As minhas fotos"
          warning={missingPhotos > 0 ? `Adiciona mais ${missingPhotos} fotos` : undefined}
        />
        <View style={styles.card}>
          <View style={styles.photoSlots}>
            {Array.from({ length: MAX_PHOTOS }, (_, i) => {
              const url = me.photos[i];
              return url ? (
                <Pressable
                  key={url}
                  accessibilityLabel="Opções da foto"
                  onPress={() => photoOptions(i)}
                  style={styles.slot}>
                  <Image source={{ uri: url }} style={styles.slotImage} />
                </Pressable>
              ) : (
                <Pressable
                  key={i}
                  accessibilityRole="button"
                  accessibilityLabel="Adicionar foto"
                  onPress={addPhotoFromLibrary}
                  style={[styles.slot, styles.slotEmpty]}>
                  <Icon name="bx-plus" size={iconSize.md} color={colors.textSecondary} />
                </Pressable>
              );
            })}
          </View>
          <View style={styles.photoFooter}>
            <Text style={styles.photoHint}>Recebe até 2x mais Gostos com 6 fotos.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/edit-profile')}
              style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}>
              <Text style={styles.editLabel}>Editar</Text>
            </Pressable>
          </View>
        </View>

        <SectionTitle
          title="Os meus tópicos"
          warning={missingTopics > 0 ? `Adiciona mais ${missingTopics} respostas` : undefined}
        />
        <View style={styles.grid}>
          {TOPICS.map((topic) => (
            <TopicCard
              key={topic}
              title={topic}
              answer={topics[topic]}
              onPress={() => answerTopic(topic, topics[topic])}
            />
          ))}
        </View>

        <SectionTitle title="Os meus interesses" />
        <View style={styles.grid}>
          {INTERESTS.map((interest) => (
            <InterestCard
              key={interest.title}
              interest={interest}
              value={me.interests[interest.title]}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.floatingButtons, { top: insets.top + spacing.sm }]}>
        <RoundButton
          icon="bx-user-plus"
          label="Convidar amigos"
          onPress={() =>
            Share.share({
              message: `Junta-te a mim no ${APP_NAME}: a app de encontros para cristãos. 🙏`,
            })
          }
        />
        <RoundButton
          icon="bx-cog"
          label="Definições de perfil"
          onPress={() => router.push('/profile-settings')}
        />
      </View>

      <View style={styles.premium}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/premium')}
          style={({ pressed }) => pressed && styles.pressed}>
          <LinearGradient
            colors={colors.premiumGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumBanner}>
            <Icon name="bxs-crown" size={iconSize.xl} color={colors.onPrimary} />
            <View style={styles.premiumText}>
              <View style={styles.premiumTitleRow}>
                <Text style={styles.premiumBrand}>{APP_NAME.toUpperCase()}</Text>
                <Text style={styles.premiumBadge}>PREMIUM</Text>
              </View>
              <Text style={styles.premiumSubtitle}>
                {activity.premium
                  ? `Premium ativo · ${activity.premiumPlan}`
                  : 'Vê quem Gosta de Ti. Dá match mais depressa.'}
              </Text>
            </View>
            <Icon name="bx-right-arrow-alt" size={iconSize.lg} color={colors.onPrimary} />
          </LinearGradient>
        </Pressable>

        <View style={styles.stats}>
          <Stat
            icon="bxs-star"
            color={colors.superLike}
            label={`${activity.superLikes} Super ${activity.superLikes === 1 ? 'Gosto' : 'Gostos'}`}
            onPress={() =>
              Alert.alert(
                'Super Gostos ⭐',
                `Tens ${activity.superLikes}. Renovam-se todos os dias (${activity.premium ? 5 : 1} por dia). Usa-os no Descobrir com a estrela.`,
                [
                  { text: 'OK', style: 'cancel' },
                  ...(activity.premium
                    ? []
                    : [{ text: 'Obter mais', onPress: () => router.push('/premium') }]),
                ],
              )
            }
          />
          <View style={styles.statDivider} />
          <Stat
            icon="bxs-zap"
            color={colors.primary}
            label={`${activity.boosts} ${activity.boosts === 1 ? 'Destaque' : 'Destaques'}`}
            onPress={openBoost}
          />
          <View style={styles.statDivider} />
          <Stat
            icon="bxs-crown"
            color={colors.primary}
            label="O meu Premium"
            onPress={() => router.push('/premium')}
          />
        </View>
      </View>
    </View>
  );
}

function SectionTitle({ title, warning }: { title: string; warning?: string }) {
  return (
    <View style={styles.sectionTitle}>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionText}>{title}</Text>
        {warning && <Icon name="bxs-error-circle" size={iconSize.md} color={colors.danger} />}
      </View>
      {warning && <Text style={styles.warning}>{warning}</Text>}
    </View>
  );
}

function ChipButton({ field, value }: { field: ProfileField; value?: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ? `${field.label}: ${value}` : `Adicionar ${field.label}`}
      onPress={() => editField(field)}
      style={({ pressed }) => [
        styles.chip,
        value ? styles.chipFilled : styles.chipEmpty,
        pressed && styles.pressed,
      ]}>
      <Icon name={field.icon} size={iconSize.sm} color={colors.textPrimary} />
      <Text style={styles.chipLabel}>{value ?? field.label}</Text>
      {!value && <Icon name="bx-plus" size={iconSize.xs} color={colors.textSecondary} />}
      {!value && field.important && <View style={styles.dot} />}
    </Pressable>
  );
}

function StackPhoto({ uri, style }: { uri?: string; style: object }) {
  return uri ? (
    <Image source={{ uri }} style={[styles.stackPhoto, style]} />
  ) : (
    <View style={[styles.stackPhoto, styles.stackEmpty, style]}>
      <Icon name="bx-camera" size={iconSize.lg} color={colors.textMuted} />
    </View>
  );
}

function AddBadge({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Adicionar"
      onPress={onPress}
      style={styles.addBadge}>
      <Icon name="bx-plus" size={iconSize.md} color={colors.onPrimary} />
    </Pressable>
  );
}

function TopicCard({
  title,
  answer,
  onPress,
}: {
  title: string;
  answer?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.gridCard, styles.centered]}>
      <Icon name="bxs-quote-alt-left" size={iconSize.xxl} color={colors.textMuted} />
      <Text style={styles.cardTitleCentered}>{title}</Text>
      <Text style={styles.cardSubtitleCentered} numberOfLines={3}>
        {answer ?? 'Responder a tópico'}
      </Text>
      {answer ? <EditBadge onPress={onPress} /> : <AddBadge onPress={onPress} />}
    </Pressable>
  );
}

function EditBadge({ onPress, label }: { onPress: () => void; label?: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label ?? 'Editar'}
      onPress={onPress}
      style={styles.editBadge}>
      <Icon name="bxs-pencil" size={iconSize.sm} color={colors.textPrimary} />
    </Pressable>
  );
}

function InterestCard({ interest, value }: { interest: Interest; value?: string }) {
  const edit = () => editInterest(interest, value);

  if (!value) {
    return (
      <Pressable onPress={edit} style={[styles.gridCard, styles.centered]}>
        <Icon name={interest.icon} size={iconSize.xxl} color={colors.textMuted} />
        <Text style={styles.cardTitleCentered}>{interest.title}</Text>
        <Text style={styles.cardSubtitleCentered}>{interest.addLabel}</Text>
        <AddBadge onPress={edit} />
      </Pressable>
    );
  }

  return (
    <Pressable onPress={edit} style={styles.gridCard}>
      <View style={styles.cardIcon}>
        <Icon name={interest.icon} size={iconSize.md} color={colors.textPrimary} />
      </View>
      <Text style={styles.cardTitle}>{interest.title}</Text>
      <Text style={styles.cardSubtitle} numberOfLines={2}>
        {value}
      </Text>
      <Text style={styles.emojis}>{interest.emojis.join(' ')}</Text>
      <EditBadge onPress={edit} label={`Editar ${interest.title}`} />
    </Pressable>
  );
}

function RoundButton({
  icon,
  label,
  onPress,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.roundButton, pressed && styles.pressed]}>
      <Icon name={icon} size={iconSize.md} color={colors.textPrimary} />
    </Pressable>
  );
}

function Stat({
  icon,
  color,
  label,
  onPress,
}: {
  icon: IconName;
  color: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.stat}>
      <Icon name={icon} size={iconSize.sm} color={color} />
      <Text style={styles.statLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDeep,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    // Espaço à direita para os botões redondos fixos.
    paddingRight: ROUND_BUTTON * 2 + spacing.sm,
  },
  photoStack: {
    width: 96,
    height: 120,
  },
  stackPhoto: {
    position: 'absolute',
    width: 76,
    height: 104,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  stackEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackBack: {
    left: 18,
    top: 4,
    transform: [{ rotate: '8deg' }],
  },
  stackFront: {
    left: 0,
    top: 10,
    transform: [{ rotate: '-4deg' }],
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.title,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  previewLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  previewText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  fillBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  fillText: {
    flex: 1,
    gap: spacing.sm,
  },
  fillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fillTitle: {
    ...typography.body,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  fillPercent: {
    ...typography.label,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  progressTrack: {
    height: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.surfacePressed,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  bleed: {
    marginHorizontal: -spacing.md,
  },
  chipRows: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  chipColumn: {
    gap: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
  },
  chipFilled: {
    backgroundColor: colors.surfacePressed,
  },
  chipEmpty: {
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  chipLabel: {
    ...typography.label,
    color: colors.textPrimary,
  },
  dot: {
    position: 'absolute',
    top: -2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.backgroundDeep,
  },
  sectionTitle: {
    gap: spacing.xxs,
    paddingHorizontal: spacing.xs,
    marginTop: spacing.sm,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionText: {
    ...typography.subtitle,
    fontFamily: fontFamily.serif,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  warning: {
    ...typography.body,
    color: colors.danger,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.sm,
    gap: spacing.md,
  },
  photoSlots: {
    flexDirection: 'row',
    borderRadius: radii.lg,
    overflow: 'hidden',
    gap: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  slot: {
    flex: 1,
    aspectRatio: 3 / 4,
    backgroundColor: colors.backgroundDeep,
  },
  slotImage: {
    width: '100%',
    height: '100%',
  },
  slotEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  photoHint: {
    ...typography.label,
    color: colors.textPrimary,
    flex: 1,
  },
  editButton: {
    backgroundColor: colors.textPrimary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    height: 44,
    justifyContent: 'center',
  },
  editLabel: {
    ...typography.button,
    color: colors.onPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  gridCard: {
    width: '48%',
    minHeight: 200,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.surfacePressed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    ...typography.body,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  cardSubtitle: {
    ...typography.label,
    color: colors.textSecondary,
  },
  cardTitleCentered: {
    ...typography.body,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  cardSubtitleCentered: {
    ...typography.label,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emojis: {
    fontSize: 36,
    lineHeight: 44,
    marginTop: spacing.sm,
  },
  addBadge: {
    position: 'absolute',
    top: -spacing.sm,
    right: -spacing.sm,
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.backgroundDeep,
  },
  editBadge: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.surfacePressed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtons: {
    position: 'absolute',
    right: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roundButton: {
    width: ROUND_BUTTON,
    height: ROUND_BUTTON,
    borderRadius: radii.pill,
    backgroundColor: colors.overlay,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premium: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.sm,
    gap: spacing.sm,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
  },
  premiumText: {
    flex: 1,
    gap: spacing.xxs,
  },
  premiumTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  premiumBrand: {
    ...typography.subtitle,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: colors.onPrimary,
  },
  premiumBadge: {
    ...typography.caption,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
    color: colors.primary,
    backgroundColor: colors.onPrimary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    overflow: 'hidden',
  },
  premiumSubtitle: {
    ...typography.caption,
    color: colors.onPrimary,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.backgroundDeep,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 24,
    backgroundColor: colors.border,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
});
