import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  // Lados onde respeitar a safe area (notch, barra inferior do iPhone...).
  // Ecrãs com cabeçalho não precisam de 'top'; ecrãs com tab bar não precisam de 'bottom'.
  edges?: Edge[];
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, edges = ['top', 'bottom'], padded = true, style }: ScreenProps) {
  return (
    <LinearGradient colors={colors.backgroundGradient} style={styles.gradient}>
      <SafeAreaView edges={edges} style={[styles.content, padded && styles.padded, style]}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
