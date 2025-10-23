import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList, RootStackParamList } from '../types';
import { Button, Card } from '../components';
import { GlassHeader } from '../components/GlassHeader';
import { SideDrawer } from '../components/SideDrawer';
import { colors, spacing, typography, borderRadius } from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = [
    {
      title: 'Records',
      icon: 'list' as const,
      onPress: () => navigation.navigate('FormsTab'),
    },
    {
      title: 'Help',
      icon: 'help-circle' as const,
      onPress: () => navigation.navigate('Help'),
    },
    {
      title: 'Settings',
      icon: 'settings' as const,
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  return (
    <View style={styles.container}>
      <GlassHeader
        title="FormBase"
        subtitle="Mobile Data Collection"
        onMenuPress={() => setDrawerVisible(true)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Get Started</Text>
            <Text style={styles.cardDescription}>
              Create custom forms, collect data in the field, and visualize your records on a map.
            </Text>
          </Card>

          <View style={styles.buttonGroup}>
            <Button
              title="Create New Form"
              onPress={() => navigation.navigate('FormCreate')}
              size="large"
              style={styles.button}
            />
            <Button
              title="My Forms"
              onPress={() => navigation.navigate('FormsTab')}
              variant="secondary"
              size="large"
              style={styles.button}
            />
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📝</Text>
              <Text style={styles.featureTitle}>Custom Forms</Text>
              <Text style={styles.featureText}>Create forms with multiple field types</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📍</Text>
              <Text style={styles.featureTitle}>Location Data</Text>
              <Text style={styles.featureText}>Capture GPS coordinates and view on map</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🔍</Text>
              <Text style={styles.featureTitle}>Filter Records</Text>
              <Text style={styles.featureText}>Advanced filtering with AND/OR logic</Text>
            </View>
          </View>
      </ScrollView>

      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        items={menuItems}
      />
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
  card: {
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  cardTitle: {
    fontSize: typography.h3,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  buttonGroup: {
    marginBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
  features: {
    marginTop: spacing.lg,
  },
  feature: {
    alignItems: 'center',
    marginBottom: spacing.xl,
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
  },
  featureText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
