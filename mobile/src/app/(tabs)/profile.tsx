import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Placeholder, Screen } from '@/components';
import { spacing } from '@/theme';

export default function ProfileScreen() {
  return (
    <Screen edges={['top']} style={styles.container}>
      <Placeholder title="Perfil" description="O teu perfil, fotos e preferências." />
      <View>
        {/* TEMPORÁRIO: volta ao início até existir sessão a sério. */}
        <Button
          title="Terminar sessão"
          variant="secondary"
          onPress={() => router.replace('/welcome')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingBottom: spacing.lg,
  },
});
