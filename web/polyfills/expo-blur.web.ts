// Web polyfill for expo-blur
// Provides a CSS-based blur effect for web

import React from 'react';
import { View, ViewProps } from 'react-native';

export interface BlurViewProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  experimentalBlurMethod?: 'dimezisBlurView' | 'none';
}

export const BlurView: React.FC<BlurViewProps> = ({
  intensity = 50,
  tint = 'default',
  style,
  children,
  ...props
}) => {
  const blurStyle = {
    backdropFilter: `blur(${intensity / 10}px)`,
    WebkitBackdropFilter: `blur(${intensity / 10}px)`,
    backgroundColor: 
      tint === 'light' 
        ? 'rgba(255, 255, 255, 0.8)' 
        : tint === 'dark' 
        ? 'rgba(0, 0, 0, 0.8)' 
        : 'rgba(255, 255, 255, 0.5)',
  };

  return React.createElement(View, {
    ...props,
    style: [blurStyle, style],
  }, children);
};

export default BlurView;
