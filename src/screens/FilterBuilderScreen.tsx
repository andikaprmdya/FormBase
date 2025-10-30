import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Field, FilterCriteria, FilterOperator, FilterLogic, Record, LocationValue } from '../types';
import { Button, Input, Card, Loading, ErrorView } from '../components';
import { fieldAPI, recordAPI } from '../services/api';
import { colors, spacing, typography, borderRadius } from '../theme';
import { logger } from '../utils/logger';
import { getErrorMessage } from '../utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'FilterBuilder'>;

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'like', label: 'Starts With' },
  { value: 'ilike', label: 'Contains' },
  { value: 'eq', label: 'Equals' },
  { value: 'gt', label: 'Greater Than' },
  { value: 'lt', label: 'Less Than' },
  { value: 'gte', label: 'Greater or Equal' },
  { value: 'lte', label: 'Less or Equal' },
];

const FilterBuilderScreen: React.FC<Props> = ({ navigation, route }) => {
  const { formId, formName } = route.params;
  const [fields, setFields] = useState<Field[]>([]);
  const [filters, setFilters] = useState<FilterCriteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Record[] | null>(null);

  useEffect(() => {
    loadFields();
  }, []);

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

  const addFilter = () => {
    if (fields.length === 0) {
      Alert.alert('No Fields', 'Add fields to the form first');
      return;
    }

    const newFilter: FilterCriteria = {
      field: fields[0].name,
      operator: 'ilike',
      value: '',
      logic: 'and',
    };

    setFilters([...filters, newFilter]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, updates: Partial<FilterCriteria>) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], ...updates };
    setFilters(newFilters);
  };

  const handleSearch = async () => {
    const invalidFilters = filters.filter(f => !f.value.trim());
    if (invalidFilters.length > 0) {
      Alert.alert('Validation Error', 'All filter values must be filled');
      return;
    }

    try {
      setSearching(true);
      const data = await recordAPI.getByFormId(formId, filters);
      setResults(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      Alert.alert('Error', errorMessage || 'Failed to search records. Please try again.');
      logger.error('Search records error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleClearFilters = () => {
    setFilters([]);
    setResults(null);
  };

  /**
   * Render record value as a display string
   * Handles location objects, images, and null values
   *
   * @param key - Field name (unused but kept for consistency)
   * @param value - The value to render
   * @returns Formatted string representation of the value
   */
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
          <Text style={styles.sectionTitle}>Build Filter Criteria</Text>
          <Text style={styles.subtitle}>
            Create filters to search records. Multiple filters can use AND or OR logic.
          </Text>

          {filters.map((filter, index) => (
            <Card key={index} variant="outlined" style={styles.filterCard}>
              <View style={styles.filterHeader}>
                <Text style={styles.filterNumber}>Filter {index + 1}</Text>
                <TouchableOpacity onPress={() => removeFilter(index)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>

              {/* Field Selection */}
              <Text style={styles.label}>Field</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                <View style={styles.options}>
                  {fields.map((field) => (
                    <TouchableOpacity
                      key={field.id}
                      style={[
                        styles.option,
                        filter.field === field.name && styles.optionSelected,
                      ]}
                      onPress={() => updateFilter(index, { field: field.name })}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          filter.field === field.name && styles.optionTextSelected,
                        ]}
                      >
                        {field.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Operator Selection */}
              <Text style={styles.label}>Operator</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                <View style={styles.options}>
                  {OPERATORS.map((op) => (
                    <TouchableOpacity
                      key={op.value}
                      style={[
                        styles.option,
                        filter.operator === op.value && styles.optionSelected,
                      ]}
                      onPress={() => updateFilter(index, { operator: op.value })}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          filter.operator === op.value && styles.optionTextSelected,
                        ]}
                      >
                        {op.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Value Input */}
              <Input
                label="Value"
                value={filter.value}
                onChangeText={(text) => updateFilter(index, { value: text })}
                placeholder="Enter filter value"
                containerStyle={styles.valueInput}
              />

              {/* Logic Selection (only for non-last filters) */}
              {index < filters.length - 1 && (
                <>
                  <Text style={styles.label}>Logic for Next Filter</Text>
                  <View style={styles.logicOptions}>
                    <TouchableOpacity
                      style={[
                        styles.logicOption,
                        filter.logic === 'and' && styles.optionSelected,
                      ]}
                      onPress={() => updateFilter(index, { logic: 'and' })}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          filter.logic === 'and' && styles.optionTextSelected,
                        ]}
                      >
                        AND
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.logicOption,
                        filter.logic === 'or' && styles.optionSelected,
                      ]}
                      onPress={() => updateFilter(index, { logic: 'or' })}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          filter.logic === 'or' && styles.optionTextSelected,
                        ]}
                      >
                        OR
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </Card>
          ))}

          <View style={styles.actions}>
            <Button
              title="Add Filter"
              onPress={addFilter}
              variant="secondary"
              size="small"
              style={styles.actionButton}
            />
            <Button
              title="Clear All"
              onPress={handleClearFilters}
              variant="danger"
              size="small"
              style={styles.actionButton}
            />
          </View>

          <Button
            title="Search Records"
            onPress={handleSearch}
            loading={searching}
            disabled={searching || filters.length === 0}
            size="large"
            style={styles.searchButton}
          />
        </Card>

        {/* Results Section */}
        {results !== null && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>
              Results ({results.length} {results.length === 1 ? 'record' : 'records'})
            </Text>

            {results.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>No records found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
              </View>
            ) : (
              results.map((record) => (
                <Card key={record.id} variant="outlined" style={styles.resultCard}>
                  <Text style={styles.recordId}>Record #{record.id}</Text>
                  <View style={styles.values}>
                    {Object.entries(record.values).map(([key, value]) => (
                      <View key={key} style={styles.valueRow}>
                        <Text style={styles.valueKey}>{key}:</Text>
                        <Text style={styles.valueText}>{renderValue(key, value)}</Text>
                      </View>
                    ))}
                  </View>
                </Card>
              ))
            )}
          </Card>
        )}
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
  sectionTitle: {
    fontSize: typography.h3,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  filterCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  filterNumber: {
    fontSize: typography.body,
    fontWeight: typography.semibold,
    color: colors.text,
  },
  removeText: {
    fontSize: typography.bodySmall,
    color: colors.error,
  },
  label: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  optionsScroll: {
    marginBottom: spacing.md,
  },
  options: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: typography.bodySmall,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.textInverse,
    fontWeight: typography.semibold,
  },
  valueInput: {
    marginBottom: spacing.sm,
  },
  logicOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  logicOption: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  searchButton: {
    marginTop: spacing.md,
  },
  resultCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  recordId: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  values: {
    gap: spacing.sm,
  },
  valueRow: {
    flexDirection: 'row',
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

export default FilterBuilderScreen;
