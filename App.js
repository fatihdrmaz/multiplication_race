import 'react-native-gesture-handler';
import React from 'react';
import { Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// Vercel Web Analytics yalnızca web build'inde çalışır
if (Platform.OS === 'web') {
  require('@vercel/analytics').inject();
}

export default function App() {
  return <AppNavigator />;
}
