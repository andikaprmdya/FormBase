import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Button } from '../components';
import { colors, spacing, typography, borderRadius } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

const LandingScreen: React.FC<Props> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Fade in and slide up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Button pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 40,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 0.98,
          tension: 40,
          friction: 3,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
        <View style={styles.header}>
          <Text style={styles.title}>FormBase</Text>
          <Text style={styles.subtitle}>Mobile Data Collection</Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureTitle}>Create Forms</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📍</Text>
            <Text style={styles.featureTitle}>Collect Data</Text>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🗺️</Text>
            <Text style={styles.featureTitle}>View Maps</Text>
          </View>
        </View>

        <Text style={styles.description}>
          Build custom forms with text, multiple choice, locations, and images. Capture GPS coordinates and photos in the field, then visualize your data on interactive maps.
        </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
              transform: [{ scale: buttonScale }],
            },
          ]}
        >
          <Button
            title="Start Building Forms"
            onPress={() => navigation.replace('MainTabs')}
            size="large"
            style={styles.button}
          />
          <Text style={styles.version}>Version 1.0.0</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    maxWidth: 480,
    alignSelf: 'center',
    width: '90%',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: spacing.xs,
  },
  featureTitle: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    maxWidth: 480,
    alignSelf: 'center',
    width: '90%',
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
