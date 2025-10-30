import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <View style={{ flex: 1 }}>
        <AppNavigator />
        <StatusBar style="light" />
      </View>
    </ErrorBoundary>
  );
}
