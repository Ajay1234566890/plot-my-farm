import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, Leaf, Mail, Phone, Users } from "lucide-react-native";
import React from "react";
import { useTranslation } from 'react-i18next';
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function About() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Header */}
      <View
        className="px-6 pt-12 pb-8"
        style={{
          backgroundColor: '#7C8B3A',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">{t('settings.aboutApp')}</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* App Info Card */}
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm items-center">
          <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-4">
            <Leaf size={40} color="#7C8B3A" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Plot My Farm
          </Text>
          <Text className="text-gray-500 mb-1">Version 1.0.0</Text>
          <Text className="text-gray-600 text-center mt-2">
            Connecting Farmers and Buyers for a Better Tomorrow
          </Text>
        </View>

        {/* Mission Card */}
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
              <Heart size={20} color="#7C8B3A" />
            </View>
            <Text className="text-lg font-bold text-gray-900">Our Mission</Text>
          </View>
          <Text className="text-gray-600 leading-6">
            Plot My Farm is dedicated to empowering farmers by connecting them directly with buyers, 
            eliminating middlemen, and ensuring fair prices for agricultural produce. We believe in 
            sustainable farming and transparent trade.
          </Text>
        </View>

        {/* Features Card */}
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
              <Users size={20} color="#7C8B3A" />
            </View>
            <Text className="text-lg font-bold text-gray-900">Key Features</Text>
          </View>
          <View className="gap-2">
            <Text className="text-gray-600">• Direct farmer-buyer connection</Text>
            <Text className="text-gray-600">• Real-time market prices</Text>
            <Text className="text-gray-600">• Crop management tools</Text>
            <Text className="text-gray-600">• Weather updates</Text>
            <Text className="text-gray-600">• Secure transactions</Text>
            <Text className="text-gray-600">• Multi-language support</Text>
          </View>
        </View>

        {/* Contact Card */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">Contact Us</Text>
          
          <TouchableOpacity 
            className="flex-row items-center mb-3"
            onPress={() => Linking.openURL('mailto:support@plotmyfarm.com')}
          >
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
              <Mail size={20} color="#7C8B3A" />
            </View>
            <Text className="text-gray-700">support@plotmyfarm.com</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center"
            onPress={() => Linking.openURL('tel:+911234567890')}
          >
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
              <Phone size={20} color="#7C8B3A" />
            </View>
            <Text className="text-gray-700">+91 123 456 7890</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center mb-8">
          <Text className="text-gray-500 text-sm">
            Made with ❤️ for Farmers
          </Text>
          <Text className="text-gray-400 text-xs mt-2">
            © 2024 Plot My Farm. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

