import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';
export type FontSize = 'small' | 'medium' | 'large';

interface SettingsContextType {
  themeMode: ThemeMode;
  fontSize: FontSize;
  setThemeMode: (mode: ThemeMode) => void;
  setFontSize: (size: FontSize) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const THEME_KEY = '@formbase_theme_mode';
const FONT_SIZE_KEY = '@formbase_font_size';

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      const savedFontSize = await AsyncStorage.getItem(FONT_SIZE_KEY);

      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeModeState(savedTheme);
      }

      if (savedFontSize === 'small' || savedFontSize === 'medium' || savedFontSize === 'large') {
        setFontSizeState(savedFontSize);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  };

  const setFontSize = async (size: FontSize) => {
    try {
      await AsyncStorage.setItem(FONT_SIZE_KEY, size);
      setFontSizeState(size);
    } catch (error) {
      console.error('Failed to save font size:', error);
    }
  };

  if (isLoading) {
    return null; // or a loading screen
  }

  return (
    <SettingsContext.Provider
      value={{
        themeMode,
        fontSize,
        setThemeMode,
        setFontSize,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
