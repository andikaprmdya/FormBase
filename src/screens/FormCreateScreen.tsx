import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Button, Input } from '../components';
import { formAPI } from '../services/api';
import { colors, spacing } from '../theme';
import { logger } from '../utils/logger';
import { getErrorMessage } from '../utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'FormCreate'>;

const FormCreateScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

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

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const form = await formAPI.create({
        name: name.trim(),
        description: description.trim(),
      });
      Alert.alert('Success', 'Form created successfully', [
        {
          text: 'OK',
          onPress: () => navigation.replace('FormDetail', { formId: form.id, formName: form.name }),
        },
      ]);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      Alert.alert('Error', errorMessage || 'Failed to create form. Please try again.');
      logger.error('Form creation error:', err);
    } finally {
      setLoading(false);
    }
  };

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
        title="Create Form"
        onPress={handleCreate}
        loading={loading}
        disabled={loading}
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

export default FormCreateScreen;
