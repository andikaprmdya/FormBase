import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { GlassHeader } from './GlassHeader';
import { colors } from '../theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showMenu?: boolean;
  onMenuPress?: () => void;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  title,
  subtitle,
  showMenu = true,
  onMenuPress,
}) => {
  return (
    <View style={styles.container}>
      <GlassHeader
        title={title}
        subtitle={subtitle}
        showMenu={showMenu}
        onMenuPress={onMenuPress}
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 85 : 65, // Account for tab bar
  },
});
