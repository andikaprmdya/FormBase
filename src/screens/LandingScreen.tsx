import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Button } from '../components';
import { colors, spacing, typography, borderRadius } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

const LandingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>📋</Text>
          <Text style={styles.title}>FormBase</Text>
          <Text style={styles.subtitle}>Mobile Data Collection</Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureTitle}>Create Custom Forms</Text>
            <Text style={styles.featureText}>
              Build forms with text, multiple choice, locations, images and more
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📍</Text>
            <Text style={styles.featureTitle}>Collect Field Data</Text>
            <Text style={styles.featureText}>
              Capture GPS coordinates and photos in the field
            </Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🗺️</Text>
            <Text style={styles.featureTitle}>Visualize on Maps</Text>
            <Text style={styles.featureText}>
              See all your location data on an interactive map
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Start Building Forms"
          onPress={() => navigation.replace('MainTabs')}
          size="large"
          style={styles.button}
        />
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.xl,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  icon: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.h1,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.h4,
    color: colors.textSecondary,
  },
  features: {
    marginTop: spacing.lg,
  },
  feature: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  featureTitle: {
    fontSize: typography.h4,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  featureText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  button: {
    marginBottom: spacing.md,
  },
  version: {
    fontSize: typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});

export default LandingScreen;
