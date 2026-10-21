import { StyleSheet, Text, View } from 'react-native';

import { APP_NAME } from '@/config';
import { colors, fontWeight } from '@/theme';

type LogoProps = {
  size?: number;
};

// Espaço reservado para o logótipo. Quando houver a imagem final,
// substituir o conteúdo por <Image source={require('@/assets/images/logo.png')} />.
export function Logo({ size = 96 }: LogoProps) {
  const initials = APP_NAME.split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`Logótipo ${APP_NAME}`}
      style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 2,
    borderColor: colors.logo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.logo,
    fontWeight: fontWeight.bold,
  },
});
