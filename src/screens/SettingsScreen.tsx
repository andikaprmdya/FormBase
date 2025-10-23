import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Card } from '../components';
import { useSettings, ThemeMode, FontSize } from '../contexts/SettingsContext';
import { colors, spacing, typography, borderRadius } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC<Props> = () => {
  const { themeMode, fontSize, setThemeMode, setFontSize } = useSettings();

  const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Light Mode', icon: '☀️' },
    { value: 'dark', label: 'Dark Mode', icon: '🌙' },
  ];

  const fontSizeOptions: { value: FontSize; label: string; description: string }[] = [
    { value: 'small', label: 'Small', description: 'Compact text size' },
    { value: 'medium', label: 'Medium', description: 'Default text size' },
    { value: 'large', label: 'Large', description: 'Larger, easier to read' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>⚙️</Text>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your app experience</Text>
        </View>

        {/* Theme Settings */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <Text style={styles.sectionDescription}>
            Choose between light and dark mode
          </Text>

          <View style={styles.optionsContainer}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  themeMode === option.value && styles.optionSelected,
                ]}
                onPress={() => setThemeMode(option.value)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      themeMode === option.value && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
                {themeMode === option.value && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.noteBox}>
            <Text style={styles.noteIcon}>💡</Text>
            <Text style={styles.noteText}>
              Note: Light mode is currently in beta. Some screens may still appear in dark mode.
            </Text>
          </View>
        </Card>

        {/* Font Size Settings */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Text Size</Text>
          <Text style={styles.sectionDescription}>
            Adjust the size of text throughout the app
          </Text>

          <View style={styles.optionsContainer}>
            {fontSizeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  fontSize === option.value && styles.optionSelected,
                ]}
                onPress={() => setFontSize(option.value)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <View style={styles.fontOptionContent}>
                    <Text
                      style={[
                        styles.optionLabel,
                        fontSize === option.value && styles.optionLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        fontSize === option.value && styles.optionDescriptionSelected,
                      ]}
                    >
                      {option.description}
                    </Text>
                  </View>
                </View>
                {fontSize === option.value && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.noteBox}>
            <Text style={styles.noteIcon}>💡</Text>
            <Text style={styles.noteText}>
              Note: Font size changes are currently in beta and may not apply to all screens.
            </Text>
          </View>
        </Card>

        {/* App Info */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>About FormBase</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2025.01</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Platform</Text>
            <Text style={styles.infoValue}>{Platform.OS === 'ios' ? 'iOS' : 'Android'}</Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  icon: {
    fontSize: 60,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  optionsContainer: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 60,
  },
  optionSelected: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderColor: colors.primary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  optionLabel: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.text,
  },
  optionLabelSelected: {
    color: colors.primary,
  },
  fontOptionContent: {
    flex: 1,
  },
  optionDescription: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  optionDescriptionSelected: {
    color: colors.textSecondary,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  checkmarkIcon: {
    fontSize: typography.body,
    fontWeight: typography.bold,
    color: colors.background,
  },
  noteBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#FFA500',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  noteIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  noteText: {
    flex: 1,
    fontSize: typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.text,
  },
});

export default SettingsScreen;
