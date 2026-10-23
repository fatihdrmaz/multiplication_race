import 'react-native-gesture-handler';
import React from 'react';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';
import { FONT_ASSETS, applyGlobalFont } from './src/theme/typography';

// Vercel Web Analytics yalnızca web build'inde çalışır
if (Platform.OS === 'web') {
  require('@vercel/analytics').inject();
}

applyGlobalFont();

export default function App() {
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);

  // Font yüklenemezse sistem fontuyla devam et
  if (!fontsLoaded && !fontError) return null;

  return <AppNavigator />;
}
