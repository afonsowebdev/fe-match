import type { ExpoConfig } from 'expo/config';

// O app.config.ts corre no Node e só consegue importar JSON (não .ts), por isso
// o nome e a cor do ecrã nativo de arranque vêm de brand.json.
import brand from './src/config/brand.json';

const config: ExpoConfig = {
  name: brand.name,
  slug: 'fe-match',
  scheme: 'fematch',
  version: '1.0.0',
  orientation: 'portrait',
  platforms: ['ios', 'android'],
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'dark',
  backgroundColor: brand.nativeBackground,
  ios: {
    icon: './assets/expo.icon',
    supportsTablet: false,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: brand.nativeBackground,
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: brand.nativeBackground,
        image: './assets/images/splash-icon.png',
        imageWidth: 76,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
