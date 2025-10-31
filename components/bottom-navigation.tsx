import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import {
  Home,
  Sprout,
  Mic,
  MessageCircle,
  User,
  ShoppingCart,
  Compass,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/auth-context';

export type BottomNavVariant = 'farmer' | 'buyer' | 'default';

interface BottomNavItem {
  label: string;
  icon: React.ReactNode;
  route: string;
  badge?: number;
}

interface BottomNavigationProps {
  variant?: BottomNavVariant;
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  variant = 'default',
  activeColor = '#16a34a',
  inactiveColor = '#6b7280',
  backgroundColor = '#ffffff',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userRole } = useAuth();

  const getFarmerTabs = (): BottomNavItem[] => [
    {
      label: 'Home',
      icon: <Home size={24} />,
      route: '/farmer-home',
    },
    {
      label: 'My Farms',
      icon: <Sprout size={24} />,
      route: '/my-farms',
    },
    {
      label: 'Voice',
      icon: <Mic size={28} />,
      route: '/voice-ai',
    },
    {
      label: 'Messages',
      icon: <MessageCircle size={24} />,
      route: '/messages',
    },
    {
      label: 'Profile',
      icon: <User size={24} />,
      route: '/profile',
    },
  ];

  const getBuyerTabs = (): BottomNavItem[] => [
    {
      label: 'Home',
      icon: <Home size={24} />,
      route: '/buyer-home',
    },
    {
      label: 'Crops',
      icon: <Compass size={24} />,
      route: '/nearby-crops',
    },
    {
      label: 'Voice',
      icon: <Mic size={28} />,
      route: '/voice-ai',
    },
    {
      label: 'Orders',
      icon: <ShoppingCart size={24} />,
      route: '/my-orders',
    },
    {
      label: 'Profile',
      icon: <User size={24} />,
      route: '/profile',
    },
  ];

  const getDefaultTabs = (): BottomNavItem[] => [
    {
      label: 'Home',
      icon: <Home size={24} />,
      route: '/index',
    },
    {
      label: 'Explore',
      icon: <Compass size={24} />,
      route: '/(tabs)/explore',
    },
  ];

  const getTabs = () => {
    if (variant === 'farmer') return getFarmerTabs();
    if (variant === 'buyer') return getBuyerTabs();
    return getDefaultTabs();
  };

  const tabs = getTabs();

  const isActive = (route: string) => {
    return pathname === route || pathname.startsWith(route);
  };

  const handleNavigation = (route: string) => {
    try {
      router.push(route as any);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 border-t border-gray-200"
      style={{ backgroundColor }}
    >
      <View className="flex-row items-center justify-between px-3 pb-6 pt-2">
        {tabs.map((tab, index) => {
          const active = isActive(tab.route);
          const color = active ? activeColor : inactiveColor;

          // Center item (Voice) is larger
          if (index === 2) {
            return (
              <TouchableOpacity
                key={tab.route}
                onPress={() => handleNavigation(tab.route)}
                className="items-center justify-center w-14 h-14 rounded-full"
                style={{ backgroundColor: activeColor }}
              >
                <View style={{ color: '#ffffff' }}>
                  {React.cloneElement(tab.icon as React.ReactElement, {
                    color: '#ffffff',
                  })}
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.route}
              onPress={() => handleNavigation(tab.route)}
              className="flex-1 items-center"
            >
              <View style={{ color }}>
                {React.cloneElement(tab.icon as React.ReactElement, {
                  color,
                })}
              </View>
              <Text
                className="text-xs mt-1"
                style={{ color }}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
              {tab.badge && tab.badge > 0 && (
                <View
                  className="absolute top-0 right-0 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
                >
                  <Text className="text-white text-xs font-bold">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavigation;

