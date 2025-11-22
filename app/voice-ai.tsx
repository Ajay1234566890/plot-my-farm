import VoiceAgentChat from '@/components/VoiceAgentChat';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import FarmerBottomNav from './components/FarmerBottomNav';

export default function VoiceAI() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const handleAction = (action: any) => {
    if (action.type === 'navigate' && action.route) {
      router.push(action.route);
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Voice Agent Chat Component */}
      <VoiceAgentChat
        userId={user?.id || 'guest'}
        userRole="farmer"
        language={i18n.language}
        onClose={handleClose}
        onAction={handleAction}
      />

      <FarmerBottomNav activeTab="home" />
    </View>
  );
}