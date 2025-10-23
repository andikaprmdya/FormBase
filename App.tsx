import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SettingsProvider } from './src/contexts/SettingsContext';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <View style={{ flex: 1 }}>
          <AppNavigator />
          <StatusBar style="light" />
        </View>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
