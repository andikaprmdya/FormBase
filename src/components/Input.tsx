import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { animated, useSpring } from '@react-spring/native';
import { colors, borderRadius, typography, spacing } from '../theme';

const AnimatedView = animated(View);

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  multiline?: boolean;
  numberOfLines?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderSpring = useSpring({
    borderColor: isFocused ? colors.primary : error ? colors.error : colors.border,
    shadowOpacity: isFocused ? 0.6 : 0.2,
    config: { tension: 300, friction: 25 },
  });

  const errorSpring = useSpring({
    opacity: error ? 1 : 0,
    translateY: error ? 0 : -5,
    config: { tension: 300, friction: 20 },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <AnimatedView
        style={[
          styles.inputContainer,
          multiline && styles.multilineContainer,
          borderSpring,
        ]}
      >
        <TextInput
          {...textInputProps}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          placeholderTextColor={colors.textTertiary}
        />
      </AnimatedView>
      {error && (
        <AnimatedView style={errorSpring}>
          <Text style={styles.error}>{error}</Text>
        </AnimatedView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.bodySmall,
    fontWeight: typography.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    backgroundColor: colors.glassDark,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 4,
  },
  multilineContainer: {
    minHeight: 100,
  },
  input: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.body,
    color: colors.text,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
