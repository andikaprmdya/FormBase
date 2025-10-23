import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { TabParamList } from '../types';
import { colors, typography } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import FormListScreen from '../screens/FormListScreen';
import MapScreen from '../screens/MapScreen';
import AboutScreen from '../screens/AboutScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 12,
          height: Platform.OS === 'ios' ? 85 : 70,
          position: 'absolute',
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={Platform.OS === 'ios' ? 40 : 80}
            tint="dark"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden',
              backgroundColor: 'rgba(10, 14, 39, 0.4)',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: 'rgba(0, 240, 255, 0.2)',
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
            }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: typography.caption,
          fontWeight: typography.semibold,
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="FormsTab"
        component={FormListScreen}
        options={{
          title: 'Forms',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'document-text' : 'document-text-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          title: 'Map',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AboutTab"
        component={AboutScreen}
        options={{
          title: 'About',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'information-circle' : 'information-circle-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
