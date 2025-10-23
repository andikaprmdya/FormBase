import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList, RootStackParamList } from '../types';
import { Card } from '../components';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SideDrawer } from '../components/SideDrawer';
import { colors, spacing, typography } from '../theme';
import { getStandardMenuItems } from '../constants/navigationMenu';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'AboutTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const AboutScreen: React.FC<Props> = ({ navigation }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = getStandardMenuItems(navigation);

  return (
    <ScreenWrapper title="About" subtitle="Learn more about FormBase" onMenuPress={() => setDrawerVisible(true)}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Text style={styles.title}>About FormBase</Text>
        <Text style={styles.description}>
          FormBase is a mobile data collection application that allows you to create custom forms,
          collect data in the field, and manage your records efficiently.
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureList}>
          <Text style={styles.feature}>• Create and manage custom forms</Text>
          <Text style={styles.feature}>• Support for 5 field types: text, multiline, multiple choice, location, and image</Text>
          <Text style={styles.feature}>• Fill forms and save records with JSONB storage</Text>
          <Text style={styles.feature}>• View, delete, and copy records to clipboard</Text>
          <Text style={styles.feature}>• Build complex filter criteria with AND/OR logic</Text>
          <Text style={styles.feature}>• Visualize location data on interactive maps</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Field Types</Text>
        <View style={styles.featureList}>
          <Text style={styles.feature}>📝 Text - Single line text input</Text>
          <Text style={styles.feature}>📄 Multiline - Multi-line text area</Text>
          <Text style={styles.feature}>☑️ Multiple Choice - Select from predefined options</Text>
          <Text style={styles.feature}>📍 Location - Capture GPS coordinates</Text>
          <Text style={styles.feature}>📷 Image - Capture or select photos</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Technology</Text>
        <View style={styles.featureList}>
          <Text style={styles.feature}>• React Native with Expo</Text>
          <Text style={styles.feature}>• TypeScript for type safety</Text>
          <Text style={styles.feature}>• PostgREST API backend</Text>
          <Text style={styles.feature}>• React Navigation for routing</Text>
          <Text style={styles.feature}>• Expo Camera, Location, and Maps APIs</Text>
        </View>
      </Card>

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2025 FormBase</Text>
        </View>
      </ScrollView>

      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        items={menuItems}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h2,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  featureList: {
    gap: spacing.sm,
  },
  feature: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xs,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  version: {
    fontSize: typography.bodySmall,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  copyright: {
    fontSize: typography.caption,
    color: colors.textTertiary,
  },
});

export default AboutScreen;
