import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Card } from '../components';
import { colors, spacing, typography, borderRadius } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Help'>;

const HelpScreen: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>❓</Text>
          <Text style={styles.title}>Help & Guide</Text>
          <Text style={styles.subtitle}>Learn how to use FormBase effectively</Text>
        </View>

        {/* How to Create Forms */}
        <Card style={styles.card}>
          <Text style={styles.sectionIcon}>📝</Text>
          <Text style={styles.sectionTitle}>Creating Forms</Text>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>1.</Text>
            <Text style={styles.stepText}>
              Navigate to the Forms tab or tap "Create New Form" on the home screen
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>2.</Text>
            <Text style={styles.stepText}>
              Enter a name and description for your form
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>3.</Text>
            <Text style={styles.stepText}>
              Tap "Create Form" to save
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>4.</Text>
            <Text style={styles.stepText}>
              Add fields to your form by tapping "Add Field"
            </Text>
          </View>
        </Card>

        {/* How to Add Fields */}
        <Card style={styles.card}>
          <Text style={styles.sectionIcon}>➕</Text>
          <Text style={styles.sectionTitle}>Adding Form Fields</Text>
          <View style={styles.fieldTypeContainer}>
            <Text style={styles.fieldTypeBullet}>•</Text>
            <View style={styles.fieldTypeContent}>
              <Text style={styles.fieldTypeTitle}>Text Field</Text>
              <Text style={styles.fieldTypeDesc}>
                Single-line text input for short answers
              </Text>
            </View>
          </View>
          <View style={styles.fieldTypeContainer}>
            <Text style={styles.fieldTypeBullet}>•</Text>
            <View style={styles.fieldTypeContent}>
              <Text style={styles.fieldTypeTitle}>Multiline Text</Text>
              <Text style={styles.fieldTypeDesc}>
                Multi-line text area for longer responses
              </Text>
            </View>
          </View>
          <View style={styles.fieldTypeContainer}>
            <Text style={styles.fieldTypeBullet}>•</Text>
            <View style={styles.fieldTypeContent}>
              <Text style={styles.fieldTypeTitle}>Multiple Choice</Text>
              <Text style={styles.fieldTypeDesc}>
                Select one option from a list of choices
              </Text>
            </View>
          </View>
          <View style={styles.fieldTypeContainer}>
            <Text style={styles.fieldTypeBullet}>•</Text>
            <View style={styles.fieldTypeContent}>
              <Text style={styles.fieldTypeTitle}>Location</Text>
              <Text style={styles.fieldTypeDesc}>
                Capture GPS coordinates using your device's location services
              </Text>
            </View>
          </View>
          <View style={styles.fieldTypeContainer}>
            <Text style={styles.fieldTypeBullet}>•</Text>
            <View style={styles.fieldTypeContent}>
              <Text style={styles.fieldTypeTitle}>Image</Text>
              <Text style={styles.fieldTypeDesc}>
                Take a photo or choose from your gallery (images are compressed to reduce size)
              </Text>
            </View>
          </View>
          <View style={styles.tipBox}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              Check "Required" to make a field mandatory. Enable "Numeric" for text fields that should only accept numbers.
            </Text>
          </View>
        </Card>

        {/* How to Fill Forms */}
        <Card style={styles.card}>
          <Text style={styles.sectionIcon}>✏️</Text>
          <Text style={styles.sectionTitle}>Filling Out Forms</Text>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>1.</Text>
            <Text style={styles.stepText}>
              Go to Forms tab and tap on a form to view its details
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>2.</Text>
            <Text style={styles.stepText}>
              Tap "Fill Form" to create a new record
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>3.</Text>
            <Text style={styles.stepText}>
              Fill in all required fields (marked with validation)
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>4.</Text>
            <Text style={styles.stepText}>
              For location fields, tap "Capture Location" to get your current GPS coordinates
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>5.</Text>
            <Text style={styles.stepText}>
              For image fields, choose "Take Photo" or "Choose from Library"
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>6.</Text>
            <Text style={styles.stepText}>
              Tap "Save Record" when complete
            </Text>
          </View>
        </Card>

        {/* How to View Records */}
        <Card style={styles.card}>
          <Text style={styles.sectionIcon}>📊</Text>
          <Text style={styles.sectionTitle}>Viewing & Managing Records</Text>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>1.</Text>
            <Text style={styles.stepText}>
              From a form's detail page, tap "View Records" to see all submitted data
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>2.</Text>
            <Text style={styles.stepText}>
              Each record displays all field values in a card format
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>3.</Text>
            <Text style={styles.stepText}>
              For images, tap the thumbnail to view the full-size image
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>4.</Text>
            <Text style={styles.stepText}>
              Tap "Copy" to copy record data to your clipboard
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>5.</Text>
            <Text style={styles.stepText}>
              Tap "Delete" to remove a record (this action cannot be undone)
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>6.</Text>
            <Text style={styles.stepText}>
              Use "Filter Records" to search and filter your data with AND/OR logic
            </Text>
          </View>
        </Card>

        {/* How to Use the Map */}
        <Card style={styles.card}>
          <Text style={styles.sectionIcon}>🗺️</Text>
          <Text style={styles.sectionTitle}>Map Visualization</Text>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>1.</Text>
            <Text style={styles.stepText}>
              Navigate to the Map tab from the bottom navigation
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>2.</Text>
            <Text style={styles.stepText}>
              All records with location data will appear as markers on the map
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>3.</Text>
            <Text style={styles.stepText}>
              Tap a marker to view record details in a popup
            </Text>
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>4.</Text>
            <Text style={styles.stepText}>
              Pinch to zoom and drag to pan around the map
            </Text>
          </View>
        </Card>

        {/* Tips and Best Practices */}
        <Card style={styles.card}>
          <Text style={styles.sectionIcon}>⭐</Text>
          <Text style={styles.sectionTitle}>Tips & Best Practices</Text>
          <View style={styles.tipBox}>
            <Text style={styles.tipIcon}>📸</Text>
            <Text style={styles.tipText}>
              Images are automatically compressed to reduce file size. For best results, use images smaller than 1MB.
            </Text>
          </View>
          <View style={styles.tipBox}>
            <Text style={styles.tipIcon}>📍</Text>
            <Text style={styles.tipText}>
              Enable location services before capturing GPS coordinates. Make sure you're outdoors for best accuracy.
            </Text>
          </View>
          <View style={styles.tipBox}>
            <Text style={styles.tipIcon}>🔍</Text>
            <Text style={styles.tipText}>
              Use filters to quickly find specific records. Combine multiple filters with AND/OR logic for powerful searches.
            </Text>
          </View>
          <View style={styles.tipBox}>
            <Text style={styles.tipIcon}>💾</Text>
            <Text style={styles.tipText}>
              Your data is saved to a cloud database. Make sure you have an internet connection when creating or viewing records.
            </Text>
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
  sectionIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  stepNumber: {
    fontSize: typography.body,
    fontWeight: typography.bold,
    color: colors.primary,
    marginRight: spacing.sm,
    width: 24,
  },
  stepText: {
    flex: 1,
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  fieldTypeContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  fieldTypeBullet: {
    fontSize: typography.h4,
    color: colors.primary,
    marginRight: spacing.sm,
    width: 20,
  },
  fieldTypeContent: {
    flex: 1,
  },
  fieldTypeTitle: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  fieldTypeDesc: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: typography.bodySmall,
    color: colors.text,
    lineHeight: 20,
  },
});

export default HelpScreen;
