import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  style?: any;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

/**
 * Skeleton loader component with shimmer animation
 * Used to show loading placeholders for content
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  style,
  variant = 'rectangular',
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const getVariantStyle = () => {
    switch (variant) {
      case 'text':
        return { height: 16, borderRadius: borderRadius.sm };
      case 'circular':
        return {
          width: height,
          height,
          borderRadius: height / 2
        };
      case 'card':
        return {
          height: 200,
          borderRadius: borderRadius.lg
        };
      case 'rectangular':
      default:
        return { borderRadius: borderRadius.md };
    }
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, opacity },
        getVariantStyle(),
        style,
      ]}
    />
  );
};

/**
 * Skeleton loader for form list items
 */
export const FormListSkeleton: React.FC = () => (
  <View style={styles.cardSkeleton}>
    <View style={styles.cardHeader}>
      <SkeletonLoader width="60%" height={24} variant="text" />
      <SkeletonLoader width={80} height={32} variant="rectangular" />
    </View>
    <SkeletonLoader width="100%" height={16} variant="text" style={{ marginTop: spacing.sm }} />
    <SkeletonLoader width="80%" height={16} variant="text" style={{ marginTop: spacing.xs }} />
    <View style={styles.cardFooter}>
      <SkeletonLoader width={100} height={36} variant="rectangular" />
      <SkeletonLoader width={100} height={36} variant="rectangular" />
    </View>
  </View>
);

/**
 * Skeleton loader for record list items
 */
export const RecordListSkeleton: React.FC = () => (
  <View style={styles.cardSkeleton}>
    <View style={styles.cardHeader}>
      <SkeletonLoader width="40%" height={20} variant="text" />
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <SkeletonLoader width={40} height={40} variant="circular" />
        <SkeletonLoader width={40} height={40} variant="circular" />
      </View>
    </View>
    <SkeletonLoader width="100%" height={14} variant="text" style={{ marginTop: spacing.md }} />
    <SkeletonLoader width="100%" height={14} variant="text" style={{ marginTop: spacing.xs }} />
    <SkeletonLoader width="70%" height={14} variant="text" style={{ marginTop: spacing.xs }} />
  </View>
);

/**
 * Skeleton loader for field list items
 */
export const FieldListSkeleton: React.FC = () => (
  <View style={styles.cardSkeleton}>
    <View style={styles.cardHeader}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <SkeletonLoader width={48} height={48} variant="circular" />
        <View style={{ flex: 1 }}>
          <SkeletonLoader width="60%" height={20} variant="text" />
          <SkeletonLoader width="40%" height={14} variant="text" style={{ marginTop: spacing.xs }} />
        </View>
      </View>
      <SkeletonLoader width={60} height={30} variant="rectangular" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.cardDark,
  },
  cardSkeleton: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
