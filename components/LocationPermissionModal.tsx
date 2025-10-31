// Location Permission Modal Component
// Handles location permission requests with user-friendly UI

import React from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, Linking } from 'react-native';
import { MapPin, Settings, X } from 'lucide-react-native';

interface LocationPermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onRequestPermission: () => Promise<void>;
  onOpenSettings: () => void;
  permissionDenied?: boolean;
}

export default function LocationPermissionModal({
  visible,
  onClose,
  onRequestPermission,
  onOpenSettings,
  permissionDenied = false
}: LocationPermissionModalProps) {

  const handleRequestPermission = async () => {
    try {
      await onRequestPermission();
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert(
        'Permission Error',
        'There was an error requesting location permission. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleOpenSettings = () => {
    Alert.alert(
      'Open Settings',
      'To enable location access, please go to your device settings and allow location permissions for Plot My Farm.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: onOpenSettings }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <MapPin size={24} color="#7C8B3A" />
              <Text className="text-lg font-bold text-gray-900 ml-2">
                Location Access
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1">
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="mb-6">
            {permissionDenied ? (
              <>
                <Text className="text-gray-700 text-base mb-3">
                  Location access is currently disabled. To get accurate weather information for your farm, please enable location permissions.
                </Text>
                <Text className="text-gray-600 text-sm">
                  • Get weather data for your exact location{'\n'}
                  • Receive location-specific farm advisories{'\n'}
                  • Connect with nearby farmers and buyers
                </Text>
              </>
            ) : (
              <>
                <Text className="text-gray-700 text-base mb-3">
                  Plot My Farm needs access to your location to provide accurate weather information and connect you with nearby farmers and buyers.
                </Text>
                <Text className="text-gray-600 text-sm">
                  • Get real-time weather for your farm{'\n'}
                  • Receive location-based advisories{'\n'}
                  • Find nearby agricultural services
                </Text>
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View className="space-y-3">
            {permissionDenied ? (
              <>
                <TouchableOpacity
                  onPress={handleOpenSettings}
                  className="bg-green-600 rounded-xl py-3 px-4 flex-row items-center justify-center"
                >
                  <Settings size={18} color="white" />
                  <Text className="text-white font-semibold ml-2">
                    Open Settings
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onClose}
                  className="bg-gray-100 rounded-xl py-3 px-4"
                >
                  <Text className="text-gray-700 font-medium text-center">
                    Continue Without Location
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={handleRequestPermission}
                  className="bg-green-600 rounded-xl py-3 px-4 flex-row items-center justify-center"
                >
                  <MapPin size={18} color="white" />
                  <Text className="text-white font-semibold ml-2">
                    Allow Location Access
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onClose}
                  className="bg-gray-100 rounded-xl py-3 px-4"
                >
                  <Text className="text-gray-700 font-medium text-center">
                    Maybe Later
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Privacy Note */}
          <Text className="text-gray-500 text-xs text-center mt-4">
            Your location data is only used to provide weather information and is not shared with third parties.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

// Helper function to open device settings
export const openDeviceSettings = async () => {
  try {
    await Linking.openSettings();
  } catch (error) {
    console.error('Error opening device settings:', error);
    Alert.alert(
      'Settings Error',
      'Unable to open device settings. Please manually go to Settings > Privacy & Security > Location Services and enable location for Plot My Farm.',
      [{ text: 'OK' }]
    );
  }
};
