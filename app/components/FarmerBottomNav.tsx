import { useRouter } from 'expo-router';
import { Home, MessageCircle, Mic, Sprout, User } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface FarmerBottomNavProps {
  activeTab?: 'home' | 'farms' | 'messages' | 'profile';
}

export default function FarmerBottomNav({ activeTab = 'home' }: FarmerBottomNavProps) {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    (router as any).push(route);
  };

  return (
    <View className="mx-4 mb-4">
      <View
        className="bg-black rounded-full px-6 py-4"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <View className="flex-row items-center justify-between">
          {/* Home Tab */}
          <TouchableOpacity
            onPress={() => handleNavigation("/farmer-home")}
            className="items-center justify-center p-2"
            accessibilityLabel="Home tab"
            accessibilityRole="tab"
          >
            <Home
              size={24}
              color={activeTab === 'home' ? "#7C8B3A" : "#ffffff"}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {/* My Farms Tab */}
          <TouchableOpacity
            onPress={() => handleNavigation("/my-farms")}
            className="items-center justify-center p-2"
            accessibilityLabel="My Farms tab"
            accessibilityRole="tab"
          >
            <Sprout
              size={24}
              color={activeTab === 'farms' ? "#7C8B3A" : "#ffffff"}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {/* Voice AI Button - Center elevated button */}
          <TouchableOpacity
            onPress={() => handleNavigation("/voice-ai")}
            className="items-center justify-center -mt-6 rounded-full w-14 h-14 shadow-lg"
            style={{ backgroundColor: '#7C8B3A' }}
            accessibilityLabel="Voice command"
            accessibilityRole="button"
          >
            <Mic size={28} color="white" strokeWidth={2} />
          </TouchableOpacity>

          {/* Messages Tab */}
          <TouchableOpacity
            onPress={() => handleNavigation("/messages")}
            className="items-center justify-center p-2"
            accessibilityLabel="Messages tab"
            accessibilityRole="tab"
          >
            <MessageCircle
              size={24}
              color={activeTab === 'messages' ? "#7C8B3A" : "#ffffff"}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {/* Profile Tab */}
          <TouchableOpacity
            onPress={() => handleNavigation("/profile")}
            className="items-center justify-center p-2"
            accessibilityLabel="Profile tab"
            accessibilityRole="tab"
          >
            <User
              size={24}
              color={activeTab === 'profile' ? "#7C8B3A" : "#ffffff"}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

