import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, StyleProp } from 'react-native';
import { animated, useSpring } from '@react-spring/native';
import { colors, borderRadius, typography, spacing } from '../theme';

const AnimatedPressable = animated(Pressable);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const [pressed, setPressed] = React.useState(false);

  const springProps = useSpring({
    scale: pressed ? 0.95 : 1,
    opacity: pressed ? 0.8 : 1,
    config: { tension: 300, friction: 20 },
  });

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderWidth: 1,
    };

    if (variant === 'primary') {
      baseStyle.backgroundColor = colors.glass;
      baseStyle.borderColor = colors.primary;
      baseStyle.shadowColor = colors.glow;
      baseStyle.shadowOffset = { width: 0, height: 0 };
      baseStyle.shadowOpacity = 0.6;
      baseStyle.shadowRadius = 10;
      baseStyle.elevation = 8;
    } else if (variant === 'secondary') {
      baseStyle.backgroundColor = colors.cardDark;
      baseStyle.borderColor = colors.borderLight;
    } else if (variant === 'danger') {
      baseStyle.backgroundColor = colors.glassDark;
      baseStyle.borderColor = colors.error;
      baseStyle.shadowColor = colors.glowPink;
      baseStyle.shadowOpacity = 0.5;
      baseStyle.shadowRadius = 8;
      baseStyle.elevation = 6;
    } else if (variant === 'ghost') {
      baseStyle.backgroundColor = 'transparent';
      baseStyle.borderColor = colors.borderLight;
    }

    if (size === 'small') {
      baseStyle.paddingVertical = spacing.sm;
      baseStyle.paddingHorizontal = spacing.md;
    } else if (size === 'medium') {
      baseStyle.paddingVertical = spacing.md;
      baseStyle.paddingHorizontal = spacing.lg;
    } else {
      baseStyle.paddingVertical = spacing.lg;
      baseStyle.paddingHorizontal = spacing.xl;
    }

    if (disabled) {
      baseStyle.opacity = 0.4;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: variant === 'primary' ? colors.primary : colors.text,
      fontSize: typography.body,
      fontWeight: typography.semibold,
    };

    if (variant === 'danger') {
      baseStyle.color = colors.error;
    }

    if (size === 'small') {
      baseStyle.fontSize = typography.bodySmall;
    } else if (size === 'large') {
      baseStyle.fontSize = typography.h4;
    }

    return baseStyle;
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled || loading}
      // @ts-ignore - React Spring animated styles conflict with ViewStyle types
      style={[getButtonStyle(), style, springProps]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.primary : colors.text} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
};
