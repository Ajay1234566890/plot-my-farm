import { useRouter } from 'expo-router';
import { Home, MessageCircle, Mic, Sprout, User } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface BuyerBottomNavProps {
  activeTab?: 'home' | 'crops' | 'orders' | 'profile';
}

export default function BuyerBottomNav({ activeTab = 'home' }: BuyerBottomNavProps) {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route);
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
            onPress={() => handleNavigation("/buyer-home")}
            className="items-center justify-center p-2"
            accessibilityLabel="Home tab"
            accessibilityRole="tab"
          >
            <Home
              size={24}
              color={activeTab === 'home' ? "#B27E4C" : "#ffffff"}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {/* Crops Tab */}
          <TouchableOpacity
            onPress={() => handleNavigation("/nearby-crops")}
            className="items-center justify-center p-2"
            accessibilityLabel="Crops tab"
            accessibilityRole="tab"
          >
            <Sprout
              size={24}
              color={activeTab === 'crops' ? "#B27E4C" : "#ffffff"}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {/* Voice AI Button - Center elevated button */}
          <TouchableOpacity
            onPress={() => handleNavigation("/buyer-voice-ai")}
            className="items-center justify-center -mt-6 rounded-full w-14 h-14 shadow-lg"
            style={{ backgroundColor: '#B27E4C' }}
            accessibilityLabel="Voice command"
            accessibilityRole="button"
          >
            <Mic size={28} color="white" strokeWidth={2} />
          </TouchableOpacity>

          {/* Orders Tab */}
          <TouchableOpacity
            onPress={() => handleNavigation("/my-orders")}
            className="items-center justify-center p-2"
            accessibilityLabel="Orders tab"
            accessibilityRole="tab"
          >
            <MessageCircle
              size={24}
              color={activeTab === 'orders' ? "#B27E4C" : "#ffffff"}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {/* Profile Tab */}
          <TouchableOpacity
            onPress={() => handleNavigation("/buyer-profile")}
            className="items-center justify-center p-2"
            accessibilityLabel="Profile tab"
            accessibilityRole="tab"
          >
            <User
              size={24}
              color={activeTab === 'profile' ? "#B27E4C" : "#ffffff"}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

