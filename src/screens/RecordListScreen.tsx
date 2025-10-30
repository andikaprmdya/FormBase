import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Image, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { RootStackParamList, Record, LocationValue } from '../types';
import { Button, Card, Loading, ErrorView } from '../components';
import { recordAPI } from '../services/api';
import { colors, spacing, typography, borderRadius } from '../theme';
import { logger } from '../utils/logger';
import { getErrorMessage } from '../utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'RecordList'>;

const RecordListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { formId, formName } = route.params;
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recordAPI.getByFormId(formId);
      setRecords(data || []);
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
      loadRecords();
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
              Alert.alert('Success', 'Record deleted successfully');
              loadRecords();
            } catch (err: any) {
              const errorMessage = getErrorMessage(err);
              Alert.alert('Error', errorMessage || 'Failed to delete record. Please try again.');
              logger.error('Delete record error:', err);
            }
          },
        },
      ]
    );
  };

  const handleCopy = async (record: Record) => {
    try {
      const recordText = JSON.stringify(record.values, null, 2);
      await Clipboard.setStringAsync(recordText);
      Alert.alert('Success', 'Record copied to clipboard');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      Alert.alert('Error', errorMessage || 'Failed to copy record');
      logger.error('Copy record error:', err);
    }
  };

  const renderValue = (key: string, value: any): React.ReactElement | string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }

    if (typeof value === 'object' && 'lat' in value && 'lng' in value) {
      const loc = value as LocationValue;
      return `${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`;
    }

    if (typeof value === 'string' && value.startsWith('data:image')) {
      return (
        <TouchableOpacity onPress={() => setSelectedImage(value)} activeOpacity={0.8}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: value }} style={styles.thumbnail} resizeMode="cover" />
            <Text style={styles.imageLabel}>Tap to view full image</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return String(value);
  };

  if (loading) {
    return <Loading message="Loading records..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadRecords} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Filter Records"
          onPress={() => navigation.navigate('FilterBuilder', { formId, formName })}
          variant="secondary"
          size="small"
          style={styles.filterButton}
        />
      </View>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyText}>No records yet</Text>
            <Text style={styles.emptySubtext}>Fill the form to create your first record</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.recordCard}>
            <Text style={styles.recordId}>Record #{item.id}</Text>

            <View style={styles.values}>
              {Object.entries(item.values).map(([key, value]) => {
                const renderedValue = renderValue(key, value);
                const isImageElement = typeof renderedValue !== 'string';

                return (
                  <View key={key} style={styles.valueRow}>
                    <Text style={styles.valueKey}>{key}:</Text>
                    {isImageElement ? (
                      <View style={styles.imageValueContainer}>{renderedValue}</View>
                    ) : (
                      <Text style={styles.valueText}>{renderedValue}</Text>
                    )}
                  </View>
                );
              })}
            </View>

            <View style={styles.actions}>
              <Button
                title="Copy"
                onPress={() => handleCopy(item)}
                variant="secondary"
                size="small"
                style={styles.actionButton}
              />
              <Button
                title="Delete"
                onPress={() => handleDelete(item.id)}
                variant="danger"
                size="small"
                style={styles.actionButton}
              />
            </View>
          </Card>
        )}
      />

      <View style={styles.footer}>
        <Button
          title="Fill Form"
          onPress={() => navigation.navigate('RecordCreate', { formId, formName })}
          size="large"
        />
      </View>

      {/* Image Preview Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedImage(null)}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedImage(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  filterButton: {
    alignSelf: 'flex-end',
  },
  list: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  recordCard: {
    marginBottom: spacing.md,
  },
  recordId: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  values: {
    marginBottom: spacing.md,
  },
  valueRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
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
  imageValueContainer: {
    flex: 1,
  },
  imageContainer: {
    marginTop: spacing.xs,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  imageLabel: {
    fontSize: typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.xxl,
    right: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: typography.h3,
    color: colors.primary,
    fontWeight: typography.bold,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
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
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default RecordListScreen;
