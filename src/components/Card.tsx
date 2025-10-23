import React from 'react';
import { ViewStyle } from 'react-native';
import { animated, useSpring } from '@react-spring/native';
import { colors, borderRadius, spacing } from '../theme';

const AnimatedView = animated(require('react-native').View);

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'glass' | 'neon' | 'outlined';
  delay?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'glass',
  delay = 0,
}) => {
  const springProps = useSpring({
    from: {
      opacity: 0,
      scale: 0.9,
      translateY: 20,
    },
    to: {
      opacity: 1,
      scale: 1,
      translateY: 0,
    },
    delay,
    config: { tension: 150, friction: 15 },
  });

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
    };

    if (variant === 'glass') {
      baseStyle.backgroundColor = colors.glassLiquid;
      baseStyle.borderColor = 'rgba(0, 240, 255, 0.15)';
      baseStyle.shadowColor = colors.primary;
      baseStyle.shadowOffset = { width: 0, height: 4 };
      baseStyle.shadowOpacity = 0.25;
      baseStyle.shadowRadius = 16;
      baseStyle.elevation = 6;
    } else if (variant === 'neon') {
      baseStyle.backgroundColor = colors.glassDark;
      baseStyle.borderColor = colors.primary;
      baseStyle.borderWidth = 1.5;
      baseStyle.shadowColor = colors.primary;
      baseStyle.shadowOffset = { width: 0, height: 0 };
      baseStyle.shadowOpacity = 0.6;
      baseStyle.shadowRadius = 20;
      baseStyle.elevation = 12;
    } else if (variant === 'outlined') {
      baseStyle.backgroundColor = 'transparent';
      baseStyle.borderColor = colors.borderLight;
    } else {
      baseStyle.backgroundColor = colors.card;
      baseStyle.borderColor = 'rgba(0, 240, 255, 0.12)';
      baseStyle.shadowColor = colors.primary;
      baseStyle.shadowOffset = { width: 0, height: 2 };
      baseStyle.shadowOpacity = 0.18;
      baseStyle.shadowRadius = 12;
      baseStyle.elevation = 4;
    }

    return baseStyle;
  };

  return (
    <AnimatedView style={[getCardStyle(), style, springProps]}>
      {children}
    </AnimatedView>
  );
};
