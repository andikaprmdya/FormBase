import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { TabParamList, RootStackParamList, Form } from '../types';
import { Button, Card, Loading, ErrorView } from '../components';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SideDrawer } from '../components/SideDrawer';
import { formAPI } from '../services/api';
import { colors, spacing, typography } from '../theme';
import { getStandardMenuItems } from '../constants/navigationMenu';
import { logger } from '../utils/logger';
import { getErrorMessage } from '../utils/errors';
import { ERROR_MESSAGES } from '../constants/appConstants';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'FormsTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const FormListScreen: React.FC<Props> = ({ navigation }) => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = getStandardMenuItems(navigation);

  const loadForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formAPI.getAll();
      setForms(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logger.error('Load forms error:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadForms();
    }, [])
  );

  const handleDelete = (id: number, name: string) => {
    Alert.alert(
      'Delete Form',
      `Are you sure you want to delete "${name}"? This will also delete all fields and records.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await formAPI.delete(id);
              loadForms();
            } catch (err) {
              const errorMessage = getErrorMessage(err);
              Alert.alert('Error', errorMessage || ERROR_MESSAGES.DELETE_FORM_FAILED);
              logger.error('Delete form error:', err);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ScreenWrapper title="My Forms" onMenuPress={() => setDrawerVisible(true)}>
        <Loading message="Loading forms..." />
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper title="My Forms" onMenuPress={() => setDrawerVisible(true)}>
        <ErrorView message={error} onRetry={loadForms} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper title="My Forms" onMenuPress={() => setDrawerVisible(true)}>
      <View style={styles.container}>
        <FlatList
          data={forms}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No forms yet</Text>
            <Text style={styles.emptySubtext}>Create your first form to get started</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.formCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate('FormDetail', { formId: item.id, formName: item.name })}
            >
              <Text style={styles.formName}>{item.name}</Text>
              <Text style={styles.formDescription}>{item.description}</Text>
            </TouchableOpacity>
            <View style={styles.actions}>
              <Button
                title="View"
                onPress={() => navigation.navigate('FormDetail', { formId: item.id, formName: item.name })}
                size="small"
                style={styles.actionButton}
              />
              <Button
                title="Edit"
                onPress={() => navigation.navigate('FormEdit', { formId: item.id })}
                variant="secondary"
                size="small"
                style={styles.actionButton}
              />
              <Button
                title="Delete"
                onPress={() => handleDelete(item.id, item.name)}
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
            title="Create New Form"
            onPress={() => navigation.navigate('FormCreate')}
            size="large"
          />
        </View>
      </View>

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
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  formCard: {
    marginBottom: spacing.md,
  },
  formName: {
    fontSize: typography.h3,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  formDescription: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
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
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 240, 255, 0.2)',
  },
});

export default FormListScreen;
