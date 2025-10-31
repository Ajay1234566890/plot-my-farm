// Web polyfill for @gorhom/bottom-sheet
// Provides a modal-based implementation for web

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Modal, TouchableOpacity, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetProps {
  children: React.ReactNode;
  snapPoints: (string | number)[];
  index?: number;
  enablePanDownToClose?: boolean;
  backgroundStyle?: any;
  handleStyle?: any;
  handleIndicatorStyle?: any;
  onChange?: (index: number) => void;
  onClose?: () => void;
}

export interface BottomSheetMethods {
  snapToIndex: (index: number) => void;
  close: () => void;
  expand: () => void;
  collapse: () => void;
}

export const BottomSheet = forwardRef<BottomSheetMethods, BottomSheetProps>(
  ({ children, snapPoints, index = -1, onChange, onClose, backgroundStyle }, ref) => {
    const [isVisible, setIsVisible] = useState(index >= 0);
    const [currentIndex, setCurrentIndex] = useState(index);

    useImperativeHandle(ref, () => ({
      snapToIndex: (newIndex: number) => {
        setCurrentIndex(newIndex);
        setIsVisible(newIndex >= 0);
        onChange?.(newIndex);
      },
      close: () => {
        setCurrentIndex(-1);
        setIsVisible(false);
        onChange?.(-1);
        onClose?.();
      },
      expand: () => {
        const maxIndex = snapPoints.length - 1;
        setCurrentIndex(maxIndex);
        setIsVisible(true);
        onChange?.(maxIndex);
      },
      collapse: () => {
        setCurrentIndex(0);
        setIsVisible(true);
        onChange?.(0);
      },
    }));

    const handleBackdropPress = () => {
      setCurrentIndex(-1);
      setIsVisible(false);
      onChange?.(-1);
      onClose?.();
    };

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={handleBackdropPress}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TouchableOpacity 
            style={{ flex: 1 }} 
            onPress={handleBackdropPress}
            activeOpacity={1}
          />
          <View
            style={[
              {
                backgroundColor: 'white',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                minHeight: 200,
                maxHeight: SCREEN_HEIGHT * 0.9,
              },
              backgroundStyle,
            ]}
          >
            {/* Handle indicator */}
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: '#ccc',
                borderRadius: 2,
                alignSelf: 'center',
                marginTop: 8,
                marginBottom: 16,
              }}
            />
            {children}
          </View>
        </View>
      </Modal>
    );
  }
);

export const BottomSheetView: React.FC<{ children: React.ReactNode; style?: any }> = ({ 
  children, 
  style 
}) => {
  return <View style={style}>{children}</View>;
};

export const BottomSheetScrollView: React.FC<{ children: React.ReactNode; style?: any }> = ({ 
  children, 
  style 
}) => {
  return <View style={style}>{children}</View>;
};

export default BottomSheet;
