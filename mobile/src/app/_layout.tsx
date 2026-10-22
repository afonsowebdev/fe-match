import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { colors } from '@/theme';

// O tema de navegação controla as cores que o React Navigation pinta por trás
// dos nossos ecrãs (por exemplo durante as transições). Pô-lo a azul evita
// "flashes" brancos.
const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.textPrimary,
    background: colors.backgroundDeep,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.border,
  },
};

export default function RootLayout() {
  return (
    // GestureHandlerRootView: necessário para os gestos (ex.: deslizar cartões no Descobrir).
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen
            name="preferences"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="profile-settings"
            options={{
              presentation: 'formSheet',
              animation: 'slide_from_bottom',
              sheetAllowedDetents: 'fitToContents',
              sheetCornerRadius: 36,
            }}
          />
          <Stack.Screen
            name="edit-profile"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="premium"
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="match"
            options={{ presentation: 'fullScreenModal', animation: 'fade' }}
          />
          <Stack.Screen name="chat/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen
            name="profile-preview"
            options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
