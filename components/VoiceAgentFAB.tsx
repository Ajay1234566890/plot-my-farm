import { Mic } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    TouchableOpacity,
    View,
} from 'react-native';
import VoiceAgentChat from './VoiceAgentChat';

interface VoiceAgentFABProps {
  userId: string;
  userRole: 'farmer' | 'buyer';
  language: string;
  primaryColor?: string;
}

const VoiceAgentFAB: React.FC<VoiceAgentFABProps> = ({
  userId,
  userRole,
  language,
  primaryColor = '#10B981',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const screenWidth = Dimensions.get('window').width;

  // Animated values for drag behavior
  const pan = React.useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({
        x: (pan.x as any)._value,
        y: (pan.y as any)._value,
      });
    },
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      pan.flattenOffset();
      // Add boundary checks if needed
    },
  });

  const openVoiceAgent = () => {
    setIsVisible(true);
  };

  const closeVoiceAgent = () => {
    setIsVisible(false);
  };

  const handleAction = (action: { type: string; route?: string; params?: any }) => {
    if (action.type === 'navigate' && action.route) {
      closeVoiceAgent();
      // Navigation will be handled by parent component
      console.log('Navigate to:', action.route);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        className="absolute bottom-20 right-6 z-50"
        style={[
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={openVoiceAgent}
          onLongPress={toggleRecording}
          delayLongPress={500}
          className="w-14 h-14 rounded-full items-center justify-center shadow-lg"
          style={{
            backgroundColor: isRecording ? '#EF4444' : primaryColor,
            shadowColor: primaryColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {isRecording ? (
            <View className="w-3 h-3 bg-white rounded-full animate-pulse" />
          ) : (
            <Mic size={24} color="white" />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Modal for Voice Agent Chat */}
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeVoiceAgent}
      >
        <VoiceAgentChat
          userId={userId}
          userRole={userRole}
          language={language}
          onClose={closeVoiceAgent}
          onAction={handleAction}
        />
      </Modal>
    </>
  );
};

export default VoiceAgentFAB;
