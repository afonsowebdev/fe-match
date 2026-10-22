import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { colors, iconSize, spacing, typography } from '@/theme';

import { Icon, type IconName } from './Icon';

// Linhas dos cartões de definições (Preferências de Descoberta, Definições de perfil).

export function Divider() {
  return <View style={styles.divider} />;
}

type SwitchRowProps = {
  label?: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

// Com `label` mostra o texto grande; só com `description` mostra o texto pequeno.
export function SwitchRow({ label, description, value, onChange }: SwitchRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        {label ? (
          <Text style={styles.label}>{label}</Text>
        ) : (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.primary, false: colors.surfacePressed }}
        accessibilityLabel={label ?? description}
      />
    </View>
  );
}

type NavRowProps = {
  label: string;
  value: string;
  icon?: IconName;
  description?: string;
  // Valor por preencher: mostra-o em destaque (ex.: "Adicionar").
  empty?: boolean;
  onPress: () => void;
};

// Linha que abre uma escolha: rótulo à esquerda, valor atual e seta à direita.
export function NavRow({ label, value, icon, description, empty, onPress }: NavRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      {icon && <Icon name={icon} size={iconSize.md} color={colors.textSecondary} />}
      <View style={styles.text}>
        <View style={styles.navHeader}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.value, empty && styles.valueEmpty]} numberOfLines={1}>
            {value}
          </Text>
        </View>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Icon name="bx-chevron-right" size={iconSize.md} color={colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  value: {
    ...typography.body,
    fontSize: 17,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  valueEmpty: {
    color: colors.primary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  text: {
    flex: 1,
  },
  label: {
    ...typography.body,
    fontSize: 17,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  description: {
    ...typography.label,
    color: colors.textSecondary,
  },
});
