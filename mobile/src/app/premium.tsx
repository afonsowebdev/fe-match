import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, type IconName } from '@/components';
import { APP_NAME } from '@/config';
import { activatePremium, cancelPremium, useActivity } from '@/stores/activity';
import { colors, fontWeight, iconSize, radii, spacing, typography } from '@/theme';

const BENEFITS: { icon: IconName; text: string }[] = [
  { icon: 'bxs-heart', text: 'Vê quem gosta de ti e dá match logo' },
  { icon: 'bxs-star', text: '5 Super Gostos por dia' },
  { icon: 'bxs-zap', text: '1 Destaque por mês' },
  { icon: 'bx-hide', text: 'Oculta a tua idade e distância' },
  { icon: 'bx-slider-alt', text: 'Preferências de descoberta avançadas' },
];

const PLANS = [
  { id: '1 mês', price: '9,99 €', perMonth: '9,99 €/mês' },
  { id: '6 meses', price: '35,94 €', perMonth: '5,99 €/mês', tag: 'Popular' },
  { id: '12 meses', price: '47,88 €', perMonth: '3,99 €/mês', tag: 'Poupa 60%' },
];

// TEMPORÁRIO: modo de teste. Ainda não há pagamentos (precisam de compras na App Store).
export default function PremiumScreen() {
  const activity = useActivity();
  const insets = useSafeAreaInsets();
  const [plan, setPlan] = useState(PLANS[1].id);

  function subscribe() {
    activatePremium(plan);
    Alert.alert('Premium ativo 👑', 'Aproveita! Recebeste 5 Super Gostos e 1 Destaque.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.premiumGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          onPress={() => router.back()}
          style={styles.close}>
          <Icon name="bx-x" size={iconSize.lg} color={colors.onPrimary} />
        </Pressable>
        <Icon name="bxs-crown" size={iconSize.xxl} color={colors.onPrimary} />
        <Text style={styles.heroTitle}>{APP_NAME} Premium</Text>
        <Text style={styles.heroSubtitle}>Encontra mais depressa quem partilha a tua fé.</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.benefits}>
          {BENEFITS.map((benefit) => (
            <View key={benefit.text} style={styles.benefit}>
              <View style={styles.benefitIcon}>
                <Icon name={benefit.icon} size={iconSize.sm} color={colors.primary} />
              </View>
              <Text style={styles.benefitText}>{benefit.text}</Text>
            </View>
          ))}
        </View>

        {activity.premium ? (
          <View style={styles.active}>
            <Text style={styles.activeTitle}>O teu Premium está ativo</Text>
            <Text style={styles.activeText}>Plano: {activity.premiumPlan}</Text>
            <Button
              title="Cancelar Premium"
              variant="secondary"
              onPress={() =>
                Alert.alert('Cancelar Premium?', 'Perdes os benefícios Premium.', [
                  { text: 'Manter', style: 'cancel' },
                  { text: 'Cancelar Premium', style: 'destructive', onPress: cancelPremium },
                ])
              }
            />
          </View>
        ) : (
          <>
            <View style={styles.plans}>
              {PLANS.map((p) => {
                const selected = p.id === plan;
                return (
                  <Pressable
                    key={p.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => setPlan(p.id)}
                    style={[styles.plan, selected && styles.planSelected]}>
                    {p.tag && <Text style={styles.planTag}>{p.tag}</Text>}
                    <Text style={styles.planName}>{p.id}</Text>
                    <Text style={styles.planPerMonth}>{p.perMonth}</Text>
                    <Text style={styles.planPrice}>{p.price}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Button title={`Continuar com ${plan}`} onPress={subscribe} />
            <Text style={styles.note}>
              Modo de teste: nenhum valor é cobrado. Os pagamentos chegam com a publicação na App
              Store.
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDeep,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  close: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    ...typography.title,
    color: colors.onPrimary,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.onPrimary,
    textAlign: 'center',
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  benefits: {
    gap: spacing.md,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  plans: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  plan: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  planSelected: {
    borderColor: colors.primary,
  },
  planTag: {
    position: 'absolute',
    top: -12,
    ...typography.caption,
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.onPrimary,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    overflow: 'hidden',
  },
  planName: {
    ...typography.body,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  planPerMonth: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  planPrice: {
    ...typography.label,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  note: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  active: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
  },
  activeTitle: {
    ...typography.subtitle,
    color: colors.primary,
  },
  activeText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
