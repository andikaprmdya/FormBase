import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, Form, Record, LocationValue } from '../types';
import { Card, Loading, ErrorView } from '../components';
import { formAPI, recordAPI } from '../services/api';
import { colors, spacing, typography, borderRadius } from '../theme';
import { logger } from '../utils/logger';
import { getErrorMessage } from '../utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'MapList'>;

interface LocationRecord {
  id: number;
  formId: number;
  formName: string;
  fieldName: string;
  location: LocationValue;
}

const MapListScreen: React.FC<Props> = ({ navigation }) => {
  const [locations, setLocations] = useState<LocationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all forms
      const forms = await formAPI.getAll();

      // Load records for each form and extract locations
      const allLocations: LocationRecord[] = [];

      for (const form of forms) {
        try {
          const records = await recordAPI.getByFormId(form.id);

          records.forEach((record: Record) => {
            Object.entries(record.values).forEach(([fieldName, value]) => {
              if (value && typeof value === 'object' && 'lat' in value && 'lng' in value) {
                allLocations.push({
                  id: record.id,
                  formId: form.id,
                  formName: form.name,
                  fieldName,
                  location: value as LocationValue,
                });
              }
            });
          });
        } catch (err) {
          logger.log(`Failed to load records for form ${form.id}:`, err);
        }
      }

      // Sort by form name, then field name
      allLocations.sort((a, b) => {
        if (a.formName !== b.formName) {
          return a.formName.localeCompare(b.formName);
        }
        return a.fieldName.localeCompare(b.fieldName);
      });

      setLocations(allLocations);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logger.error('Load locations error:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLocations();
    }, [])
  );

  const handleLocationPress = (location: LocationRecord) => {
    // Navigate to map and center on this location
    logger.log('Navigating to location:', location.location.lat, location.location.lng);
    navigation.navigate('MainTabs', {
      screen: 'MapTab',
      params: {
        centerLat: location.location.lat,
        centerLng: location.location.lng,
      },
    });
  };

  const renderLocation = ({ item }: { item: LocationRecord }) => (
    <TouchableOpacity onPress={() => handleLocationPress(item)} activeOpacity={0.7}>
      <Card style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={styles.locationInfo}>
            <Text style={styles.formName}>{item.formName}</Text>
            <Text style={styles.fieldName}>{item.fieldName}</Text>
          </View>
        </View>

        <View style={styles.coordinates}>
          <View style={styles.coordRow}>
            <Text style={styles.coordLabel}>Latitude:</Text>
            <Text style={styles.coordValue}>{item.location.lat.toFixed(6)}</Text>
          </View>
          <View style={styles.coordRow}>
            <Text style={styles.coordLabel}>Longitude:</Text>
            <Text style={styles.coordValue}>{item.location.lng.toFixed(6)}</Text>
          </View>
        </View>

        <View style={styles.recordIdContainer}>
          <Text style={styles.recordIdLabel}>Record #{item.id}</Text>
          <Text style={styles.viewMapText}>Tap to view on map →</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Loading message="Loading locations..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorView message={error} onRetry={loadLocations} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Locations</Text>
        <Text style={styles.subtitle}>
          {locations.length} location{locations.length !== 1 ? 's' : ''} saved
        </Text>
      </View>

      {locations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🗺️</Text>
          <Text style={styles.emptyText}>No Locations Yet</Text>
          <Text style={styles.emptySubtext}>
            Locations from records with GPS fields will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={locations}
          renderItem={renderLocation}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingTop: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundLight,
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
  },
  list: {
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  locationCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  locationIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  locationInfo: {
    flex: 1,
  },
  formName: {
    fontSize: typography.h4,
    fontWeight: typography.semibold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  fieldName: {
    fontSize: typography.body,
    color: colors.text,
  },
  coordinates: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  coordLabel: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
  },
  coordValue: {
    fontSize: typography.bodySmall,
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  recordIdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordIdLabel: {
    fontSize: typography.caption,
    color: colors.textTertiary,
  },
  viewMapText: {
    fontSize: typography.caption,
    color: colors.primary,
    fontWeight: typography.semibold,
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
  },
});

export default MapListScreen;
