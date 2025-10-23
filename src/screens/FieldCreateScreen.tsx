import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, FieldType } from '../types';
import { Button, Input, Card } from '../components';
import { fieldAPI } from '../services/api';
import { colors, spacing, typography, borderRadius } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'FieldCreate'>;

const FIELD_TYPES: { value: FieldType; label: string; icon: string; description: string }[] = [
  { value: 'text', label: 'Text', icon: '📝', description: 'Single line text input' },
  { value: 'multiline', label: 'Multiline', icon: '📄', description: 'Multi-line text area' },
  { value: 'multiple choice', label: 'Multiple Choice', icon: '☑️', description: 'Choose from predefined options' },
  { value: 'location', label: 'Location', icon: '📍', description: 'GPS coordinates capture' },
  { value: 'image', label: 'Image', icon: '📷', description: 'Photo capture or selection' },
];

const FieldCreateScreen: React.FC<Props> = ({ navigation, route }) => {
  const { formId } = route.params;
  const [name, setName] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('text');
  const [required, setRequired] = useState(false);
  const [isNum, setIsNum] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; options?: string }>({});
  const [orderIndex, setOrderIndex] = useState(0);

  useEffect(() => {
    loadOrderIndex();
  }, []);

  const loadOrderIndex = async () => {
    try {
      const fields = await fieldAPI.getByFormId(formId);
      setOrderIndex(fields.length);
    } catch (err) {
      console.error('Failed to load field order:', err);
      Alert.alert('Warning', 'Could not determine field order. The field will be added at the end.');
    }
  };

  const validate = (): boolean => {
    const newErrors: { name?: string; options?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Field name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Field name must be at least 2 characters';
    } else if (name.trim().length > 50) {
      newErrors.name = 'Field name must be less than 50 characters';
    }

    if (fieldType === 'multiple choice' && options.length === 0) {
      newErrors.options = 'At least one option is required for multiple choice';
    } else if (fieldType === 'multiple choice' && options.length < 2) {
      newErrors.options = 'Multiple choice needs at least 2 options';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addOption = () => {
    const trimmedOption = optionInput.trim();

    if (!trimmedOption) {
      Alert.alert('Invalid Input', 'Option cannot be empty');
      return;
    }

    if (trimmedOption.length > 100) {
      Alert.alert('Invalid Input', 'Option must be less than 100 characters');
      return;
    }

    if (options.includes(trimmedOption)) {
      Alert.alert('Duplicate Option', 'This option already exists');
      return;
    }

    if (options.length >= 20) {
      Alert.alert('Limit Reached', 'Maximum 20 options allowed');
      return;
    }

    setOptions([...options, trimmedOption]);
    setOptionInput('');
    if (errors.options) {
      const newErrors = { ...errors };
      delete newErrors.options;
      setErrors(newErrors);
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting');
      return;
    }

    try {
      setLoading(true);
      await fieldAPI.create({
        form_id: formId,
        name: name.trim(),
        field_type: fieldType,
        required,
        is_num: isNum,
        order_index: orderIndex,
        options: fieldType === 'multiple choice' ? options : undefined,
      });
      Alert.alert('Success', 'Field added successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err: any) {
      console.error('Field creation error:', err);
      const errorMessage = err?.message || 'Failed to create field. Please check your connection and try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Field Type</Text>
        <View style={styles.typeGrid}>
          {FIELD_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeButton,
                fieldType === type.value && styles.typeButtonActive,
              ]}
              onPress={() => setFieldType(type.value)}
            >
              <Text style={styles.typeIcon}>{type.icon}</Text>
              <Text
                style={[
                  styles.typeLabel,
                  fieldType === type.value && styles.typeLabelActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Input
        label="Field Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (errors.name) {
            const newErrors = { ...errors };
            delete newErrors.name;
            setErrors(newErrors);
          }
        }}
        placeholder="Enter field name"
        error={errors.name}
      />

      <Card style={styles.section}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setRequired(!required)}
        >
          <View style={[styles.checkboxBox, required && styles.checkboxBoxChecked]}>
            {required && <Text style={styles.checkboxCheck}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Required field</Text>
        </TouchableOpacity>

        {fieldType === 'text' && (
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setIsNum(!isNum)}
          >
            <View style={[styles.checkboxBox, isNum && styles.checkboxBoxChecked]}>
              {isNum && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Numeric only</Text>
          </TouchableOpacity>
        )}
      </Card>

      {fieldType === 'multiple choice' && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Multiple Choice Options</Text>
          <Text style={styles.helperText}>Add at least 2 options (max 20)</Text>
          <View style={styles.optionInputContainer}>
            <Input
              value={optionInput}
              onChangeText={setOptionInput}
              placeholder="Enter option"
              containerStyle={styles.optionInput}
              error={errors.options}
            />
            <Button
              title="Add"
              onPress={addOption}
              size="small"
              style={styles.addButton}
            />
          </View>

          {options.map((option, index) => (
            <View key={index} style={styles.optionItem}>
              <Text style={styles.optionText}>{option}</Text>
              <TouchableOpacity onPress={() => removeOption(index)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card>
      )}

      <Button
        title="Add Field"
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h4,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  helperText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  typeLabel: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  typeLabelActive: {
    color: colors.primary,
    fontWeight: typography.semibold,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxCheck: {
    color: colors.textInverse,
    fontSize: typography.body,
    fontWeight: typography.bold,
  },
  checkboxLabel: {
    fontSize: typography.body,
    color: colors.text,
  },
  optionInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    marginTop: 22,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  optionText: {
    fontSize: typography.body,
    color: colors.text,
  },
  removeText: {
    fontSize: typography.bodySmall,
    color: colors.error,
  },
  button: {
    marginTop: spacing.md,
  },
});

export default FieldCreateScreen;
