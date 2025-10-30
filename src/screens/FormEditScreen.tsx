import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Button, Input, Loading, ErrorView } from '../components';
import { formAPI } from '../services/api';
import { colors, spacing } from '../theme';
import { logger } from '../utils/logger';
import { getErrorMessage } from '../utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'FormEdit'>;

const FormEditScreen: React.FC<Props> = ({ navigation, route }) => {
  const { formId } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  useEffect(() => {
    loadForm();
  }, []);

  const loadForm = async () => {
    try {
      setLoading(true);
      setError(null);
      const form = await formAPI.getById(formId);
      setName(form.name);
      setDescription(form.description);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logger.error('Load form error:', err);
    } finally {
      setLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: { name?: string; description?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Form name is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      await formAPI.update(formId, {
        name: name.trim(),
        description: description.trim(),
      });
      Alert.alert('Success', 'Form updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      Alert.alert('Error', errorMessage || 'Failed to update form. Please try again.');
      logger.error('Update form error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading message="Loading form..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadForm} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Input
        label="Form Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (errors.name) {
            const newErrors = { ...errors };
            delete newErrors.name;
            setErrors(newErrors);
          }
        }}
        placeholder="Enter form name"
        error={errors.name}
      />

      <Input
        label="Description"
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          if (errors.description) {
            const newErrors = { ...errors };
            delete newErrors.description;
            setErrors(newErrors);
          }
        }}
        placeholder="Enter form description"
        multiline
        numberOfLines={4}
        error={errors.description}
      />

      <Button
        title="Update Form"
        onPress={handleUpdate}
        loading={saving}
        disabled={saving}
        size="large"
        style={styles.button}
      />
    </ScrollView>
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
  button: {
    marginTop: spacing.md,
  },
});

export default FormEditScreen;
