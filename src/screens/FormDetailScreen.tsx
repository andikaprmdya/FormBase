import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, Field } from '../types';
import { Button, Card, Loading, ErrorView } from '../components';
import { fieldAPI } from '../services/api';
import { colors, spacing, typography } from '../theme';
import { logger } from '../utils/logger';
import { getErrorMessage } from '../utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'FormDetail'>;

const FormDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { formId, formName } = route.params;
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fieldAPI.getByFormId(formId);
      setFields(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logger.error('Load fields error:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFields();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const handleDeleteField = (id: number, name: string) => {
    Alert.alert(
      'Delete Field',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await fieldAPI.delete(id);
              loadFields();
            } catch (err) {
              const errorMessage = getErrorMessage(err);
              Alert.alert('Error', errorMessage || 'Failed to delete field');
              logger.error('Delete field error:', err);
            }
          },
        },
      ]
    );
  };

  const getFieldTypeIcon = (type: string): string => {
    switch (type) {
      case 'text':
        return '📝';
      case 'multiline':
        return '📄';
      case 'multiple choice':
        return '📋';
      case 'location':
        return '📍';
      case 'image':
        return '📷';
      default:
        return '📝';
    }
  };

  if (loading) {
    return <Loading message="Loading fields..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadFields} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Button
            title="Fill Form"
            onPress={() => navigation.navigate('RecordCreate', { formId, formName })}
            size="large"
            style={styles.actionButton}
          />
          <Button
            title="View Records"
            onPress={() => navigation.navigate('RecordList', { formId, formName })}
            variant="secondary"
            size="large"
            style={styles.actionButton}
          />
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fields ({fields.length})</Text>
            <Button
              title="Add Field"
              onPress={() => navigation.navigate('FieldCreate', { formId })}
              size="small"
            />
          </View>

          {fields.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>No fields yet</Text>
              <Text style={styles.emptySubtext}>Add fields to start collecting data</Text>
            </View>
          ) : (
            fields.map((field) => (
              <View key={field.id} style={styles.fieldItem}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldIcon}>{getFieldTypeIcon(field.field_type)}</Text>
                  <View style={styles.fieldInfo}>
                    <Text style={styles.fieldName}>
                      {field.name}
                      {field.required && <Text style={styles.required}> *</Text>}
                    </Text>
                    <Text style={styles.fieldType}>{field.field_type}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteField(field.id, field.name)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
                {field.options && field.options.length > 0 && (
                  <Text style={styles.options}>
                    Options: {field.options.join(', ')}
                  </Text>
                )}
              </View>
            ))
          )}
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
  content: {
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  fieldItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingVertical: spacing.md,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldName: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.text,
  },
  required: {
    color: colors.error,
  },
  fieldType: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  options: {
    fontSize: typography.bodySmall,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    marginLeft: 32,
  },
  deleteButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  deleteText: {
    fontSize: typography.bodySmall,
    color: colors.error,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.bodySmall,
    color: colors.textTertiary,
  },
});

export default FormDetailScreen;
