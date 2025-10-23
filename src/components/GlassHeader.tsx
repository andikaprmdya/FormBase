import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';

interface GlassHeaderProps {
  title: string;
  subtitle?: string;
  onMenuPress?: () => void;
  showMenu?: boolean;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  title,
  subtitle,
  onMenuPress,
  showMenu = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <BlurView
        intensity={Platform.OS === 'ios' ? 40 : 80}
        tint="dark"
        style={[styles.blurContainer, { paddingTop: insets.top }]}
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          {showMenu && (
            <TouchableOpacity
              onPress={onMenuPress}
              style={styles.menuButton}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="menu" size={26} color={colors.primary} />
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>

          {showMenu && <View style={styles.spacer} />}
        </View>

        {/* Bottom glow line */}
        <View style={styles.glowLine} />
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  blurContainer: {
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 14, 39, 0.4)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 240, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.h2,
    fontWeight: typography.bold,
    color: colors.text,
    letterSpacing: 0.5,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subtitle: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  spacer: {
    width: 44,
  },
  glowLine: {
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
});
