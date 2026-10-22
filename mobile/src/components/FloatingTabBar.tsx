import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontWeight, iconSize, radii, spacing, typography } from '@/theme';

// Medidas da barra: todas as tabs têm a mesma altura e o mesmo ícone,
// e a cápsula ativa fica com a mesma folga (BAR_PADDING) em toda a volta.
const BAR_PADDING = spacing.xs + spacing.xxs;
const ITEM_HEIGHT = 56;

// Barra de separadores em forma de cápsula, a "flutuar" por cima do fundo.
// A tab ativa fica com um fundo mais escuro à volta.
export function FloatingTabBar({ state, descriptors, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const color = focused ? colors.textPrimary : colors.textMuted;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.title}
              onPress={() => navigateToTab(route.key)}
              style={({ pressed }) => [
                styles.item,
                focused && styles.itemFocused,
                pressed && !focused && styles.itemPressed,
              ]}>
              {options.tabBarIcon?.({ focused, color, size: iconSize.md })}
              <Text
                style={[styles.label, focused && styles.labelFocused, { color }]}
                numberOfLines={1}>
                {options.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundDeep,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  bar: {
    flexDirection: 'row',
    padding: BAR_PADDING,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  item: {
    flex: 1,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    borderRadius: radii.pill,
  },
  itemFocused: {
    backgroundColor: colors.backgroundDeep,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  itemPressed: {
    backgroundColor: colors.surfacePressed,
  },
  label: {
    ...typography.caption,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: fontWeight.medium,
  },
  labelFocused: {
    fontWeight: fontWeight.bold,
  },
});
