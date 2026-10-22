import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Divider, Icon, NavRow, Slider, SwitchRow, type IconName } from '@/components';
import {
  setChoice,
  setPreferences,
  usePreferences,
  type ChoiceId,
  type DiscoveryPreferences,
} from '@/stores/preferences';
import { pickOption, promptText } from '@/lib/prompts';
import { colors, iconSize, radii, spacing, typography } from '@/theme';

const CHOICES: { id: ChoiceId; label: string; icon: IconName; options: string[] }[] = [
  {
    id: 'intention',
    label: 'À procura de',
    icon: 'bx-show',
    options: ['Amizade', 'Namoro', 'Casamento'],
  },
  {
    id: 'denomination',
    label: 'Denominação',
    icon: 'bx-church',
    options: [
      'Católica',
      'Evangélica',
      'Batista',
      'Assembleia de Deus',
      'Presbiteriana',
      'Metodista',
      'Adventista',
      'Ortodoxa',
      'Outra',
    ],
  },
  {
    id: 'attendance',
    label: 'Frequência na igreja',
    icon: 'bx-calendar-check',
    options: ['Várias vezes por semana', 'Semanal', 'Quinzenal', 'Mensal', 'Ocasional'],
  },
  {
    id: 'ministry',
    label: 'Ministério',
    icon: 'bx-donate-heart',
    options: ['Serve num ministério'],
  },
  {
    id: 'languages',
    label: 'Adicionar línguas',
    icon: 'bx-world',
    options: ['Português', 'Inglês', 'Espanhol', 'Francês'],
  },
  {
    id: 'education',
    label: 'Educação',
    icon: 'bx-book-reader',
    options: ['Secundário', 'Licenciatura', 'Mestrado', 'Doutoramento'],
  },
  {
    id: 'family',
    label: 'Planos de família',
    icon: 'bx-child',
    options: ['Quero ter filhos', 'Não quero ter filhos', 'Ainda não sei'],
  },
  {
    id: 'communication',
    label: 'Estilo de comunicação',
    icon: 'bx-message-alt-dots',
    options: ['Mensagens', 'Chamadas', 'Ao vivo'],
  },
  {
    id: 'pets',
    label: 'Animais de estimação',
    icon: 'bxs-dog',
    options: ['Cão', 'Gato', 'Outro', 'Sem animais'],
  },
  {
    id: 'drinking',
    label: 'Beber',
    icon: 'bx-drink',
    options: ['Não bebo', 'Socialmente'],
  },
  {
    id: 'smoking',
    label: 'Com que frequência fumas?',
    icon: 'bx-no-entry',
    options: ['Não fumo', 'Às vezes'],
  },
  {
    id: 'workout',
    label: 'Treino físico',
    icon: 'bx-dumbbell',
    options: ['Todos os dias', 'Às vezes', 'Nunca'],
  },
];

const INTERESTED_IN: DiscoveryPreferences['interestedIn'][] = ['Mulheres', 'Homens', 'Todos'];

// Usa o GPS ou uma cidade escrita, e guarda o nome e as coordenadas (para a distância).
function changeLocation() {
  Alert.alert('Localização', undefined, [
    { text: 'Usar a minha localização atual', onPress: useCurrentLocation },
    {
      text: 'Escrever uma cidade',
      onPress: () =>
        promptText('Cidade', 'Ex.: Porto', undefined, (city) => {
          if (city) searchCity(city);
        }),
    },
    { text: 'Cancelar', style: 'cancel' },
  ]);
}

async function useCurrentLocation() {
  try {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      Alert.alert(
        'Sem acesso à localização',
        'Autoriza nas Definições do iPhone ou escreve uma cidade.',
      );
      return;
    }
    const { coords } = await Location.getCurrentPositionAsync({});
    const [place] = await Location.reverseGeocodeAsync(coords);
    const label = [place?.city ?? place?.subregion, place?.region ?? place?.country]
      .filter(Boolean)
      .join(', ');
    setPreferences({
      location: {
        label: label || 'Localização atual',
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });
  } catch {
    Alert.alert('Não foi possível obter a localização', 'Tenta de novo ou escreve uma cidade.');
  }
}

async function searchCity(city: string) {
  try {
    const [result] = await Location.geocodeAsync(city);
    if (!result) throw new Error('not found');
    setPreferences({
      location: { label: city, latitude: result.latitude, longitude: result.longitude },
    });
  } catch {
    Alert.alert('Cidade não encontrada', `Não encontrámos "${city}". Verifica o nome.`);
  }
}

export default function PreferencesScreen() {
  const prefs = usePreferences();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Preferências de Descoberta</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Guardar"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.done, pressed && styles.pressed]}>
          <Icon name="bx-check" size={iconSize.xl} color={colors.onPrimary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Text style={styles.sectionTitle}>Descoberta</Text>
        <View style={styles.card}>
          <NavRow
            label="Localização"
            value={prefs.location.label}
            description="Muda de localização para encontrares pessoas em qualquer lugar."
            onPress={changeLocation}
          />
          <Divider />
          <SliderRow
            label="Distância máxima"
            value={`${prefs.maxDistance} km`}
            min={2}
            max={160}
            values={[prefs.maxDistance]}
            onChange={([maxDistance]) => setPreferences({ maxDistance })}
          />
          <SwitchRow
            description="Mostrar pessoas mais longe se eu ficar sem perfis para ver."
            value={prefs.expandDistance}
            onChange={(expandDistance) => setPreferences({ expandDistance })}
          />
          <Divider />
          <NavRow
            label="Tenho interesse em"
            value={prefs.interestedIn}
            onPress={() =>
              pickOption('Tenho interesse em', INTERESTED_IN, (value) =>
                setPreferences({
                  interestedIn: (value ?? 'Todos') as DiscoveryPreferences['interestedIn'],
                }),
              )
            }
          />
          <Divider />
          <SliderRow
            label="Faixa etária"
            value={`${prefs.ageRange[0]}-${prefs.ageRange[1]}`}
            min={18}
            max={80}
            values={prefs.ageRange}
            onChange={([min, max]) => setPreferences({ ageRange: [min, max] })}
          />
          <SwitchRow
            description="Mostrar pessoas ligeiramente fora das minhas preferências de idade se eu ficar sem perfis para ver."
            value={prefs.expandAge}
            onChange={(expandAge) => setPreferences({ expandAge })}
          />
        </View>

        <View style={styles.premiumHeader}>
          <Text style={styles.premiumTitle}>Descoberta Premium</Text>
          <Text style={styles.badge}>PREMIUM</Text>
        </View>
        <Text style={styles.premiumDescription}>
          As preferências mostram-te mais pessoas que partilham os teus valores, mas não limitam
          quem vês — ainda podes dar match com pessoas fora das tuas seleções.
        </Text>

        <View style={styles.card}>
          <SliderRow
            label="Número mínimo de fotos"
            value={String(prefs.minPhotos)}
            min={1}
            max={6}
            values={[prefs.minPhotos]}
            onChange={([minPhotos]) => setPreferences({ minPhotos })}
          />
          <Divider />
          <SwitchRow
            label="Tem bio"
            value={prefs.hasBio}
            onChange={(hasBio) => setPreferences({ hasBio })}
          />
          <Divider />
          <SwitchRow
            label="Só perfis verificados"
            value={prefs.verifiedOnly}
            onChange={(verifiedOnly) => setPreferences({ verifiedOnly })}
          />
          {CHOICES.map((choice) => (
            <View key={choice.id}>
              <Divider />
              <NavRow
                icon={choice.icon}
                label={choice.label}
                value={prefs.choices[choice.id] ?? 'Selecionar'}
                onPress={() =>
                  pickOption(choice.label, choice.options, (value) => setChoice(choice.id, value), {
                    clearLabel: 'Qualquer',
                  })
                }
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

type SliderRowProps = {
  label: string;
  value: string;
  min: number;
  max: number;
  values: number[];
  onChange: (values: number[]) => void;
};

function SliderRow({ label, value, ...slider }: SliderRowProps) {
  return (
    <View style={styles.block}>
      <View style={styles.rowHeader}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Slider {...slider} />
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
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  block: {
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  label: {
    ...typography.body,
    fontSize: typography.subtitle.fontSize,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  value: {
    ...typography.body,
    fontSize: typography.subtitle.fontSize,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  description: {
    ...typography.label,
    color: colors.textSecondary,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  premiumTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  badge: {
    ...typography.caption,
    fontWeight: typography.button.fontWeight,
    color: colors.onPrimary,
    backgroundColor: colors.badge,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    overflow: 'hidden',
  },
  premiumDescription: {
    ...typography.body,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
  },
});
