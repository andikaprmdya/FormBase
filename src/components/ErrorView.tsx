import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { Button } from './Button';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
  retryButtonText?: string;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  message,
  onRetry,
  retryButtonText = 'Try Again',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          title={retryButtonText}
          onPress={onRetry}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  message: {
    fontSize: typography.body,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.md,
  },
});
