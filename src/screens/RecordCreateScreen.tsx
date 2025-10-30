import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList, Field, RecordValues, LocationValue } from '../types';
import { Button, Input, Card, Loading, ErrorView } from '../components';
import { fieldAPI, recordAPI } from '../services/api';
import { colors, spacing, typography, borderRadius } from '../theme';
import { optimizeImage } from '../utils/imageOptimizer';
import { IMAGE_CONFIG } from '../constants/appConstants';
import { logger } from '../utils/logger';
import { getErrorMessage } from '../utils/errors';

type Props = NativeStackScreenProps<RootStackParamList, 'RecordCreate'>;

const RecordCreateScreen: React.FC<Props> = ({ navigation, route }) => {
  const { formId, formName } = route.params;
  const [fields, setFields] = useState<Field[]>([]);
  const [values, setValues] = useState<RecordValues>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fieldAPI.getByFormId(formId);

      if (!data || data.length === 0) {
        setError('This form has no fields yet. Please add fields first.');
        setFields([]);
        return;
      }

      setFields(data);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      logger.error('Load fields error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationCapture = async (fieldName: string) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const locationValue: LocationValue = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      setValues({ ...values, [fieldName]: locationValue });

      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      Alert.alert('Error', errorMessage || 'Failed to get location. Please try again.');
      logger.error('Location capture error:', err);
    }
  };

  /**
   * Handle image capture from camera or photo library
   * Enforces 10MB hard limit and 5MB warning threshold
   *
   * @param fieldName - Name of the form field to store the image
   * @param useCamera - If true, launch camera; if false, open photo library
   */
  const handleImageCapture = async (fieldName: string, useCamera: boolean) => {
    try {
      let result;

      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Camera permission is required');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: IMAGE_CONFIG.QUALITY,
          allowsEditing: true,
          aspect: IMAGE_CONFIG.ASPECT_RATIO,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Photo library permission is required');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: IMAGE_CONFIG.QUALITY,
          allowsEditing: true,
          aspect: IMAGE_CONFIG.ASPECT_RATIO,
        });
      }

      if (!result.canceled && result.assets[0].uri) {
        // Use the new image optimizer with progressive quality reduction
        const optimized = await optimizeImage(result.assets[0].uri, {
          quality: IMAGE_CONFIG.QUALITY,
          maxWidth: 1920,
          maxHeight: 1920,
        });

        if (optimized) {
          setValues({ ...values, [fieldName]: optimized.base64 });
          const newErrors = { ...errors };
          delete newErrors[fieldName];
          setErrors(newErrors);
        }
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      Alert.alert('Error', errorMessage || 'Failed to capture image. Please try again.');
      logger.error('Image capture error:', err);
    }
  };

  /**
   * Validate form values against field requirements
   * Checks required fields, number fields, and image fields
   *
   * @returns true if validation passes, false otherwise
   */
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    fields.forEach((field) => {
      const value = values[field.name];

      // Required field validation
      if (field.required) {
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[field.name] = `${field.name} is required`;
          return;
        }
      }

      // Text field validations
      if ((field.field_type === 'text' || field.field_type === 'multiline') && value && typeof value === 'string') {
        if (value.trim().length < 1) {
          newErrors[field.name] = 'Cannot be empty';
          return;
        }
        if (value.length > 1000) {
          newErrors[field.name] = 'Maximum 1000 characters allowed';
          return;
        }
      }

      // Numeric validation
      if (field.is_num && value && typeof value === 'string') {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          newErrors[field.name] = 'Must be a valid number';
          return;
        }
      }

      // Multiple choice validation
      if (field.field_type === 'multiple choice' && field.required && !value) {
        newErrors[field.name] = 'Please select an option';
        return;
      }

      // Location validation
      if (field.field_type === 'location' && field.required && !value) {
        newErrors[field.name] = 'Please capture location';
        return;
      }

      // Image validation
      if (field.field_type === 'image' && field.required && !value) {
        newErrors[field.name] = 'Please add an image';
        return;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    try {
      setSaving(true);

      const processedValues: RecordValues = {};
      fields.forEach((field) => {
        let value = values[field.name];

        if (field.is_num && value && typeof value === 'string') {
          value = parseFloat(value);
        }

        if (value !== undefined && value !== null && value !== '') {
          processedValues[field.name] = value;
        }
      });

      await recordAPI.create({
        form_id: formId,
        values: processedValues,
      });

      Alert.alert('Success', 'Record saved successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err: any) {
      logger.error('Record save error:', err);
      let errorMessage = getErrorMessage(err);

      // Additional check for payload size
      if (err?.message?.includes('413') || err?.message?.includes('Payload Too Large')) {
        errorMessage = 'The record is too large (likely due to images). Please use smaller images.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field: Field) => {
    switch (field.field_type) {
      case 'text':
        return (
          <Input
            key={field.id}
            label={field.name}
            value={(values[field.name] as string) || ''}
            onChangeText={(text) => {
              setValues({ ...values, [field.name]: text });
              if (errors[field.name]) {
                const newErrors = { ...errors };
                delete newErrors[field.name];
                setErrors(newErrors);
              }
            }}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            keyboardType={field.is_num ? 'numeric' : 'default'}
            error={errors[field.name]}
          />
        );

      case 'multiline':
        return (
          <Input
            key={field.id}
            label={field.name}
            value={(values[field.name] as string) || ''}
            onChangeText={(text) => {
              setValues({ ...values, [field.name]: text });
              if (errors[field.name]) {
                const newErrors = { ...errors };
                delete newErrors[field.name];
                setErrors(newErrors);
              }
            }}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            multiline
            numberOfLines={4}
            error={errors[field.name]}
          />
        );

      case 'multiple choice':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.name}</Text>
            <View style={styles.multipleChoiceOptions}>
              {field.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.multipleChoiceOption,
                    values[field.name] === option && styles.multipleChoiceOptionSelected,
                  ]}
                  onPress={() => {
                    setValues({ ...values, [field.name]: option });
                    if (errors[field.name]) {
                      const newErrors = { ...errors };
                      delete newErrors[field.name];
                      setErrors(newErrors);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.multipleChoiceOptionText,
                      values[field.name] === option && styles.multipleChoiceOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors[field.name] && <Text style={styles.error}>{errors[field.name]}</Text>}
          </View>
        );

      case 'location':
        const locationValue = values[field.name] as LocationValue | undefined;
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.name}</Text>
            <Button
              title={locationValue ? 'Update Location' : 'Capture Location'}
              onPress={() => handleLocationCapture(field.name)}
              variant="secondary"
            />
            {locationValue && (
              <Text style={styles.locationText}>
                Lat: {locationValue.lat.toFixed(6)}, Lng: {locationValue.lng.toFixed(6)}
              </Text>
            )}
            {errors[field.name] && <Text style={styles.error}>{errors[field.name]}</Text>}
          </View>
        );

      case 'image':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.name}</Text>
            <View style={styles.imageButtons}>
              <Button
                title="Take Photo"
                onPress={() => handleImageCapture(field.name, true)}
                variant="secondary"
                size="small"
                style={styles.imageButton}
              />
              <Button
                title="Choose from Library"
                onPress={() => handleImageCapture(field.name, false)}
                variant="secondary"
                size="small"
                style={styles.imageButton}
              />
            </View>
            {values[field.name] && typeof values[field.name] === 'string' && (
              <Image
                source={{ uri: values[field.name] as string }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
            )}
            {errors[field.name] && <Text style={styles.error}>{errors[field.name]}</Text>}
          </View>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <Loading message="Loading form..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadFields} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Text style={styles.formName}>{formName}</Text>
        <Text style={styles.subtitle}>Fill out all required fields</Text>
      </Card>

      {fields.map((field) => renderField(field))}

      <Button
        title="Save Record"
        onPress={handleSave}
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
  card: {
    marginBottom: spacing.lg,
  },
  formName: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  multipleChoiceOptions: {
    gap: spacing.sm,
  },
  multipleChoiceOption: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  multipleChoiceOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  multipleChoiceOptionText: {
    fontSize: typography.body,
    color: colors.text,
  },
  multipleChoiceOptionTextSelected: {
    color: colors.textInverse,
    fontWeight: typography.semibold,
  },
  locationText: {
    fontSize: typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  imageButton: {
    flex: 1,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  error: {
    fontSize: typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  button: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});

export default RecordCreateScreen;
