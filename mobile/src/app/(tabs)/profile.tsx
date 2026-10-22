import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Alert, Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Divider, Icon, NavRow, type IconName } from '@/components';
import { APP_NAME } from '@/config';
import { PROFILE_FIELDS, type ProfileField } from '@/config/profileFields';
import { openBoost } from '@/lib/boost';
import { addPhotoFromLibrary, editField, photoOptions } from '@/lib/profileEditing';
import { promptText } from '@/lib/prompts';
import { getAge } from '@/mocks/profiles';
import { useActivity } from '@/stores/activity';
import { MAX_PHOTOS, setInterest, setTopic, useMe, type Me } from '@/stores/me';
import { colors, fontFamily, fontWeight, iconSize, radii, spacing, typography } from '@/theme';

const AVATAR = 112;

const TOPICS = ['Sobre mim', 'O meu testemunho'];

const INTERESTS: { icon: IconName; title: string; placeholder: string }[] = [
  { icon: 'bx-heart-circle', title: 'Interesse atual', placeholder: 'Ex.: Voluntariado, Louvor' },
  { icon: 'bx-book-open', title: 'A ler', placeholder: 'Ex.: Provérbios, um capítulo por dia' },
  { icon: 'bx-bookmark-heart', title: 'Versículo favorito', placeholder: 'Ex.: Salmos 46:10' },
  { icon: 'bx-music', title: 'Louvor favorito', placeholder: 'Ex.: Oceans, Hillsong United' },
  { icon: 'bx-movie-play', title: 'Noite de cinema', placeholder: 'Ex.: O Escolhido' },
  { icon: 'bx-football', title: 'A torcer por', placeholder: 'Ex.: Benfica' },
  { icon: 'bx-joystick', title: 'A jogar', placeholder: 'Ex.: Xadrez' },
  { icon: 'bx-group', title: 'Grupo na igreja', placeholder: 'Ex.: Grupo de jovens' },
];

const FAITH_FIELDS = PROFILE_FIELDS.filter((field) => field.group === 'faith');
const ABOUT_FIELDS = PROFILE_FIELDS.filter((field) => field.group === 'about');
const IMPORTANT_FIELDS = PROFILE_FIELDS.filter((field) => field.important);
const MIN_PHOTOS = 3;

function answerTopic(topic: string, current?: string) {
  promptText(topic, 'Escreve uma resposta curta. Deixa vazio para apagar.', current, (value) =>
    setTopic(topic, value),
  );
}

type Task = { label: string; done: boolean; onPress: () => void };

// Passos para completar o perfil, do mais importante para o menos.
function completionTasks(me: Me): Task[] {
  const missingField = IMPORTANT_FIELDS.find((field) => !me.fields[field.id]);
  const fieldsDone = IMPORTANT_FIELDS.filter((field) => me.fields[field.id]).length;
  const missingTopic = TOPICS.find((topic) => !me.topics[topic]);
  const topicsDone = TOPICS.filter((topic) => me.topics[topic]).length;
  const photos = Math.min(me.photos.length, MIN_PHOTOS);

  return [
    {
      label: `Adiciona pelo menos ${MIN_PHOTOS} fotos (${photos}/${MIN_PHOTOS})`,
      done: photos >= MIN_PHOTOS,
      onPress: addPhotoFromLibrary,
    },
    {
      label: 'Escreve a tua bio',
      done: !!me.bio,
      onPress: () => router.push('/edit-profile'),
    },
    {
      label: `Fala da tua fé e de ti (${fieldsDone}/${IMPORTANT_FIELDS.length})`,
      done: !missingField,
      onPress: () => missingField && editField(missingField),
    },
    {
      label: `Responde aos tópicos (${topicsDone}/${TOPICS.length})`,
      done: !missingTopic,
      onPress: () => missingTopic && answerTopic(missingTopic),
    },
  ];
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const me = useMe();
  const activity = useActivity();

  const tasks = completionTasks(me);
  const completion = Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
  const subtitle = [me.fields.city, me.fields.denomination].filter(Boolean).join(' · ');

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>Perfil</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Definições"
          onPress={() => router.push('/profile-settings')}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <Icon name="bx-cog" size={iconSize.md} color={colors.textPrimary} />
        </Pressable>
      </View>

      {/* Cabeçalho: foto, nome e as duas ações principais */}
      <View style={styles.hero}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Editar fotos"
          onPress={() => router.push('/edit-profile')}
          style={styles.avatarRing}>
          {me.photos[0] ? (
            <Image source={{ uri: me.photos[0] }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarEmpty]}>
              <Icon name="bx-camera" size={iconSize.xl} color={colors.textMuted} />
            </View>
          )}
          <Text style={styles.percent}>{completion}%</Text>
        </Pressable>

        <View style={styles.nameRow}>
          <Text style={styles.name}>
            {me.name || 'O meu perfil'}
            {!me.hideAge && <Text style={styles.age}>, {getAge(me.birthDate)}</Text>}
          </Text>
          {activity.premium && <Icon name="bxs-crown" size={iconSize.md} color={colors.badge} />}
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        <View style={styles.heroActions}>
          <View style={styles.heroAction}>
            <Button title="Editar perfil" onPress={() => router.push('/edit-profile')} />
          </View>
          <View style={styles.heroAction}>
            <Button
              title="Pré-visualizar"
              variant="secondary"
              onPress={() => router.push('/profile-preview')}
            />
          </View>
        </View>
      </View>

      {/* O que falta preencher, com um toque para cada passo */}
      {completion < 100 && (
        <View style={styles.card}>
          <View style={styles.cardPadding}>
            <View style={styles.progressHeader}>
              <Text style={styles.cardTitle}>Completa o teu perfil</Text>
              <Text style={styles.progressValue}>{completion}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${completion}%` }]} />
            </View>
          </View>
          {tasks.map((task) => (
            <Pressable
              key={task.label}
              disabled={task.done}
              onPress={task.onPress}
              style={({ pressed }) => [styles.task, pressed && styles.pressed]}>
              <Icon
                name={task.done ? 'bxs-check-circle' : 'bx-circle'}
                size={iconSize.md}
                color={task.done ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.taskText, task.done && styles.taskDone]}>{task.label}</Text>
              {!task.done && (
                <Icon name="bx-chevron-right" size={iconSize.sm} color={colors.textMuted} />
              )}
            </Pressable>
          ))}
        </View>
      )}

      <Section title="Fotos" hint={`${me.photos.length} de ${MAX_PHOTOS}`}>
        <View style={styles.photoGrid}>
          {Array.from({ length: MAX_PHOTOS }, (_, i) => {
            const uri = me.photos[i];
            return uri ? (
              <Pressable
                key={uri}
                accessibilityLabel="Opções da foto"
                onPress={() => photoOptions(i)}
                style={styles.photoCell}>
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
                <Icon name="bx-plus" size={iconSize.md} color={colors.primary} />
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Section title="Sobre mim">
        <Pressable
          onPress={() => router.push('/edit-profile')}
          style={({ pressed }) => [styles.card, styles.cardPadding, pressed && styles.pressed]}>
          <Text style={me.bio ? styles.bio : styles.bioEmpty}>
            {me.bio || 'Escreve algumas linhas sobre ti, a tua fé e o que procuras.'}
          </Text>
        </Pressable>
      </Section>

      <Section title="A minha fé">
        <FieldList fields={FAITH_FIELDS} me={me} />
      </Section>

      <Section title="Informações">
        <FieldList fields={ABOUT_FIELDS} me={me} />
      </Section>

      <Section title="Tópicos" hint="Ajudam a começar conversas">
        <RowCard
          items={TOPICS.map((topic) => ({
            key: topic,
            icon: 'bxs-quote-alt-left',
            label: topic,
            value: me.topics[topic],
            onPress: () => answerTopic(topic, me.topics[topic]),
          }))}
        />
      </Section>

      <Section title="Interesses">
        <RowCard
          items={INTERESTS.map((interest) => ({
            key: interest.title,
            icon: interest.icon,
            label: interest.title,
            value: me.interests[interest.title],
            onPress: () =>
              promptText(
                interest.title,
                interest.placeholder,
                me.interests[interest.title],
                (value) => setInterest(interest.title, value),
              ),
          }))}
        />
      </Section>

      <Section title="A minha conta">
        <RowCard
          emptyLabel=""
          items={[
            {
              key: 'premium',
              icon: 'bxs-crown',
              label: 'Premium',
              value: activity.premium ? `Ativo · ${activity.premiumPlan}` : 'Ver planos',
              onPress: () => router.push('/premium'),
            },
            {
              key: 'superlikes',
              icon: 'bxs-star',
              label: 'Super Gostos',
              value: String(activity.superLikes),
              onPress: () =>
                Alert.alert(
                  'Super Gostos ⭐',
                  `Tens ${activity.superLikes}. Renovam-se todos os dias (${activity.premium ? 5 : 1} por dia).`,
                ),
            },
            {
              key: 'boosts',
              icon: 'bxs-zap',
              label: 'Destaques',
              value: String(activity.boosts),
              onPress: openBoost,
            },
            {
              key: 'invite',
              icon: 'bx-user-plus',
              label: 'Convidar amigos',
              onPress: () =>
                Share.share({
                  message: `Junta-te a mim no ${APP_NAME}: a app de encontros para cristãos. 🙏`,
                }),
            },
          ]}
        />
      </Section>
    </ScrollView>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {hint && <Text style={styles.sectionHint}>{hint}</Text>}
      </View>
      {children}
    </View>
  );
}

function FieldList({ fields, me }: { fields: ProfileField[]; me: Me }) {
  return (
    <RowCard
      items={fields.map((field) => ({
        key: field.id,
        icon: field.icon,
        label: field.label,
        value: me.fields[field.id],
        onPress: () => editField(field),
      }))}
    />
  );
}

type RowItem = {
  key: string;
  icon: IconName;
  label: string;
  value?: string;
  onPress: () => void;
};

// Cartão com linhas: ícone, rótulo, valor (ou "Adicionar" em destaque) e seta.
function RowCard({ items, emptyLabel = 'Adicionar' }: { items: RowItem[]; emptyLabel?: string }) {
  return (
    <View style={[styles.card, styles.rowCard]}>
      {items.map((item, i) => (
        <View key={item.key}>
          {i > 0 && <Divider />}
          <NavRow
            icon={item.icon}
            label={item.label}
            value={item.value || emptyLabel}
            empty={!item.value}
            onPress={item.onPress}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDeep,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  pressed: {
    opacity: 0.75,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  avatarRing: {
    padding: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  avatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    position: 'absolute',
    bottom: -spacing.md,
    alignSelf: 'center',
    ...typography.caption,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    overflow: 'hidden',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.title,
    color: colors.textPrimary,
  },
  age: {
    fontWeight: fontWeight.regular,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  heroActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    alignSelf: 'stretch',
  },
  heroAction: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardPadding: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  rowCard: {
    paddingHorizontal: spacing.md,
  },
  cardTitle: {
    ...typography.body,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressValue: {
    ...typography.label,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  progressTrack: {
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.surfacePressed,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + spacing.xxs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  taskText: {
    ...typography.label,
    color: colors.textPrimary,
    flex: 1,
  },
  taskDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    ...typography.subtitle,
    fontFamily: fontFamily.serif,
    color: colors.textPrimary,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textMuted,
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
  bio: {
    ...typography.body,
    color: colors.textPrimary,
  },
  bioEmpty: {
    ...typography.body,
    color: colors.primary,
  },
});
