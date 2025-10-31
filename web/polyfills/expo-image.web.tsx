// Web polyfill for expo-image
// Uses regular React Native Image component for web compatibility

import React from 'react';
import { Image as RNImage, ImageProps as RNImageProps } from 'react-native';

export interface ImageProps extends RNImageProps {
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  contentPosition?: string;
  placeholder?: string | number;
  placeholderContentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: 'low' | 'normal' | 'high';
  cachePolicy?: 'memory' | 'disk' | 'memory-disk' | 'none';
  transition?: number | { duration?: number; timing?: string };
}

export const Image: React.FC<ImageProps> = ({
  contentFit = 'cover',
  style,
  ...props
}) => {
  // Map contentFit to resizeMode for React Native Image
  const resizeMode = 
    contentFit === 'cover' ? 'cover' :
    contentFit === 'contain' ? 'contain' :
    contentFit === 'fill' ? 'stretch' :
    'center';

  return (
    <RNImage
      {...props}
      resizeMode={resizeMode}
      style={style}
    />
  );
};

export default Image;
