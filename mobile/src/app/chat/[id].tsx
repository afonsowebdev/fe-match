import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components';
import { findProfile } from '@/mocks/profiles';
import {
  markRead,
  sendMessage,
  unmatch,
  useActivity,
  useTyping,
  type Message,
} from '@/stores/activity';
import { colors, fontWeight, iconSize, radii, spacing, typography } from '@/theme';

const SUGGESTIONS = [
  'Olá! 👋',
  'Qual é o teu versículo favorito?',
  'Em que igreja andas?',
  'O que te fez sorrir esta semana?',
];

function formatTime(at: number) {
  return new Date(at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = findProfile(id);
  const activity = useActivity();
  const typing = useTyping(id);
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');

  const messages = activity.conversations[id] ?? [];
  const matchedAt = activity.matches[id];

  // Enquanto a conversa está aberta, as mensagens novas contam como lidas.
  useEffect(() => {
    markRead(id);
  }, [id, messages.length]);

  if (!profile || !matchedAt) {
    return (
      <View style={[styles.container, styles.gone, { paddingTop: insets.top }]}>
        <Text style={styles.goneText}>Esta conversa já não existe.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  function send(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    sendMessage(id, trimmed);
    setText('');
  }

  function openMenu() {
    if (!profile) return;
    Alert.alert(profile.name, undefined, [
      {
        text: 'Ver perfil',
        onPress: () => router.push({ pathname: '/profile-preview', params: { id } }),
      },
      {
        text: 'Desfazer match',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Desfazer match?', `Deixas de poder falar com ${profile.name}.`, [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Desfazer',
              style: 'destructive',
              onPress: () => {
                unmatch(id);
                router.back();
              },
            },
          ]),
      },
      {
        text: 'Denunciar',
        style: 'destructive',
        onPress: () =>
          Alert.alert(
            'Denúncia enviada',
            `Obrigado. Vamos analisar o perfil de ${profile.name}. O match foi desfeito.`,
            [
              {
                text: 'OK',
                onPress: () => {
                  unmatch(id);
                  router.back();
                },
              },
            ],
          ),
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  // A lista está invertida (mais recente em baixo), por isso vai do fim para o início.
  const reversed = [...messages].reverse();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          style={styles.headerButton}>
          <Icon name="bx-chevron-left" size={iconSize.lg} color={colors.textPrimary} />
        </Pressable>
        <Pressable
          style={styles.headerProfile}
          onPress={() => router.push({ pathname: '/profile-preview', params: { id } })}>
          <Image source={{ uri: profile.photos[0] }} style={styles.headerAvatar} />
          <View>
            <Text style={styles.headerName}>{profile.name}</Text>
            <Text style={styles.headerStatus}>{typing ? 'a escrever…' : profile.city}</Text>
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mais opções"
          onPress={openMenu}
          style={styles.headerButton}>
          <Icon name="bx-dots-horizontal-rounded" size={iconSize.lg} color={colors.textPrimary} />
        </Pressable>
      </View>

      <FlatList
        data={reversed}
        inverted
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        keyboardDismissMode="interactive"
        renderItem={({ item }) => <Bubble message={item} />}
        ListHeaderComponent={
          typing ? (
            <View style={[styles.bubble, styles.theirs]}>
              <Text style={styles.typing}>•••</Text>
            </View>
          ) : undefined
        }
        ListFooterComponent={
          <View style={styles.intro}>
            <Image source={{ uri: profile.photos[0] }} style={styles.introAvatar} />
            <Text style={styles.introText}>
              Deste match com {profile.name} a{' '}
              {new Date(matchedAt).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })}.
            </Text>
          </View>
        }
      />

      {messages.length === 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestions}
          style={styles.suggestionsBar}>
          {SUGGESTIONS.map((suggestion) => (
            <Pressable
              key={suggestion}
              onPress={() => send(suggestion)}
              style={({ pressed }) => [styles.suggestion, pressed && styles.pressed]}>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Escreve uma mensagem…"
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.textPrimary}
          style={styles.input}
          multiline
          maxLength={2000}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enviar"
          disabled={!text.trim()}
          onPress={() => send(text)}
          style={[styles.send, !text.trim() && styles.sendDisabled]}>
          <Icon name="bxs-send" size={iconSize.md} color={colors.onPrimary} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ message }: { message: Message }) {
  const mine = message.from === 'me';
  return (
    <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
      <Text style={[styles.bubbleText, mine && styles.mineText]}>{message.text}</Text>
      <Text style={[styles.time, mine && styles.mineTime]}>{formatTime(message.at)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDeep,
  },
  gone: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  goneText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  link: {
    ...typography.button,
    color: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  headerName: {
    ...typography.body,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  headerStatus: {
    ...typography.caption,
    color: colors.textMuted,
  },
  list: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  intro: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  introAvatar: {
    width: 88,
    height: 88,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  introText: {
    ...typography.label,
    color: colors.textMuted,
    textAlign: 'center',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    gap: spacing.xxs,
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: radii.sm / 2,
  },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfacePressed,
    borderBottomLeftRadius: radii.sm / 2,
  },
  bubbleText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  mineText: {
    color: colors.onPrimary,
  },
  time: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    alignSelf: 'flex-end',
  },
  mineTime: {
    color: colors.onPrimary,
    opacity: 0.6,
  },
  typing: {
    ...typography.body,
    color: colors.textSecondary,
    letterSpacing: 2,
  },
  suggestionsBar: {
    flexGrow: 0,
  },
  suggestions: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  suggestion: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  suggestionText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm + 2,
    paddingBottom: spacing.sm + 2,
    maxHeight: 120,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.4,
  },
});
