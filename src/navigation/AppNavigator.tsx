import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { colors } from '../theme';
import { TabNavigator } from './TabNavigator';

// Import screens
import LandingScreen from '../screens/LandingScreen';
import FormCreateScreen from '../screens/FormCreateScreen';
import FormEditScreen from '../screens/FormEditScreen';
import FormDetailScreen from '../screens/FormDetailScreen';
import FieldCreateScreen from '../screens/FieldCreateScreen';
import RecordCreateScreen from '../screens/RecordCreateScreen';
import RecordListScreen from '../screens/RecordListScreen';
import FilterBuilderScreen from '../screens/FilterBuilderScreen';
import HelpScreen from '../screens/HelpScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FormCreate"
          component={FormCreateScreen}
          options={{ title: 'Create Form' }}
        />
        <Stack.Screen
          name="FormEdit"
          component={FormEditScreen}
          options={{ title: 'Edit Form' }}
        />
        <Stack.Screen
          name="FormDetail"
          component={FormDetailScreen}
          options={({ route }) => ({ title: route.params.formName })}
        />
        <Stack.Screen
          name="FieldCreate"
          component={FieldCreateScreen}
          options={{ title: 'Add Field' }}
        />
        <Stack.Screen
          name="RecordCreate"
          component={RecordCreateScreen}
          options={{ title: 'Fill Form' }}
        />
        <Stack.Screen
          name="RecordList"
          component={RecordListScreen}
          options={{ title: 'Records' }}
        />
        <Stack.Screen
          name="FilterBuilder"
          component={FilterBuilderScreen}
          options={{ title: 'Filter Records' }}
        />
        <Stack.Screen
          name="Help"
          component={HelpScreen}
          options={{ title: 'Help & Guide' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
