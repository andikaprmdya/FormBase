import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { RootStackParamList, Record, Form, LocationValue } from '../types';
import { Button, Card, Loading, ErrorView } from '../components';
import { recordAPI, formAPI } from '../services/api';
import { colors, spacing, typography, borderRadius } from '../theme';
import { logger } from '../utils/logger';
import { getErrorMessage } from '../utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'RecordsList'>;

interface RecordWithForm extends Record {
  formName: string;
}

const RecordsListScreen: React.FC<Props> = ({ navigation }) => {
  const [records, setRecords] = useState<RecordWithForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadAllRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all forms first
      const forms = await formAPI.getAll();

      // Load records for each form
      const allRecords: RecordWithForm[] = [];

      for (const form of forms) {
        try {
          const formRecords = await recordAPI.getByFormId(form.id);
          // Add form name to each record
          const recordsWithFormName = formRecords.map(record => ({
            ...record,
            formName: form.name,
          }));
          allRecords.push(...recordsWithFormName);
        } catch (err) {
          logger.log(`Failed to load records for form ${form.id}:`, err);
        }
      }

      // Sort by record ID descending (newest first)
      allRecords.sort((a, b) => b.id - a.id);

      setRecords(allRecords);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logger.error('Load records error:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAllRecords();
    }, [])
  );

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this record? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await recordAPI.delete(id);
              setRecords(records.filter(r => r.id !== id));
              Alert.alert('Success', 'Record deleted successfully');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete record. Please try again.');
              logger.error(err);
            }
          },
        },
      ]
    );
  };

  const handleCopy = async (record: Record) => {
    try {
      await Clipboard.setStringAsync(JSON.stringify(record, null, 2));
      Alert.alert('Success', 'Record copied to clipboard');
    } catch (err) {
      Alert.alert('Error', 'Failed to copy record');
      logger.error(err);
    }
  };

  const renderValue = (key: string, value: any): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    if (typeof value === 'object' && 'lat' in value && 'lng' in value) {
      const loc = value as LocationValue;
      return `${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`;
    }

    if (typeof value === 'string' && value.startsWith('data:image')) {
      return '[Image]';
    }

    return String(value);
  };

  const renderImageValue = (key: string, value: any): React.ReactElement | null => {
    if (typeof value === 'string' && value.startsWith('data:image')) {
      return (
        <TouchableOpacity onPress={() => setSelectedImage(value)}>
          <Image source={{ uri: value }} style={styles.thumbnailImage} />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const renderRecord = ({ item }: { item: RecordWithForm }) => (
    <Card style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <View>
          <Text style={styles.recordId}>Record #{item.id}</Text>
          <Text style={styles.formName}>{item.formName}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleCopy(item)}
            style={styles.iconButton}
          >
            <Text style={styles.actionIcon}>📋</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.iconButton}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.values}>
        {Object.entries(item.values).map(([key, value]) => (
          <View key={key} style={styles.valueRow}>
            <Text style={styles.valueKey}>{key}:</Text>
            {renderImageValue(key, value) || (
              <Text style={styles.valueText}>{renderValue(key, value)}</Text>
            )}
          </View>
        ))}
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading message="Loading records..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorView message={error} onRetry={loadAllRecords} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        {records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No Records Yet</Text>
            <Text style={styles.emptySubtext}>
              Create a form and start collecting data
            </Text>
            <Button
              title="Go to Forms"
              onPress={() => navigation.navigate('MainTabs', { screen: 'FormsTab' })}
              variant="secondary"
              style={styles.emptyButton}
            />
          </View>
        ) : (
          <FlatList
            data={records}
            renderItem={renderRecord}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Image Preview Modal */}
        <Modal
          visible={selectedImage !== null}
          transparent={true}
          onRequestClose={() => setSelectedImage(null)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedImage(null)}
          >
            <View style={styles.modalContent}>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
  },
  recordCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recordId: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    color: colors.textTertiary,
    marginBottom: spacing.xs,
  },
  formName: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    padding: spacing.xs,
  },
  actionIcon: {
    fontSize: 20,
  },
  values: {
    gap: spacing.sm,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  valueKey: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    width: 120,
  },
  valueText: {
    flex: 1,
    fontSize: typography.bodySmall,
    color: colors.text,
  },
  thumbnailImage: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.h3,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyButton: {
    minWidth: 200,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  closeButtonText: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.textInverse,
  },
});

export default RecordsListScreen;
