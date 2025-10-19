import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <MotiView style={{ flex: 1 }}>
      <AppNavigator />
      <StatusBar style="dark" />
    </MotiView>
  );
}
