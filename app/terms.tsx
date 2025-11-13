import { useRouter } from 'expo-router';
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Terms() {
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
          <Text className="text-xl font-bold text-white">{t('settings.termsConditions')}</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </Text>
          
          <Text className="text-base font-semibold text-gray-800 mb-2">
            1. Acceptance of Terms
          </Text>
          <Text className="text-gray-600 mb-4">
            By accessing and using Plot My Farm, you accept and agree to be bound by the terms and provision of this agreement.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mb-2">
            2. Use License
          </Text>
          <Text className="text-gray-600 mb-4">
            Permission is granted to temporarily download one copy of the materials on Plot My Farm for personal, non-commercial transitory viewing only.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mb-2">
            3. User Responsibilities
          </Text>
          <Text className="text-gray-600 mb-4">
            Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mb-2">
            4. Transactions
          </Text>
          <Text className="text-gray-600 mb-4">
            All transactions between farmers and buyers are conducted at their own risk. Plot My Farm acts as a platform to connect parties but is not responsible for the quality, safety, or legality of items advertised.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mb-2">
            5. Privacy Policy
          </Text>
          <Text className="text-gray-600 mb-4">
            Your privacy is important to us. We collect and use your personal information in accordance with our Privacy Policy.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mb-2">
            6. Modifications
          </Text>
          <Text className="text-gray-600 mb-4">
            Plot My Farm may revise these terms of service at any time without notice. By using this app, you are agreeing to be bound by the current version of these terms.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mb-2">
            7. Governing Law
          </Text>
          <Text className="text-gray-600 mb-4">
            These terms and conditions are governed by and construed in accordance with the laws of India.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mb-2">
            8. Contact Information
          </Text>
          <Text className="text-gray-600 mb-4">
            If you have any questions about these Terms, please contact us at support@plotmyfarm.com
          </Text>

          <Text className="text-sm text-gray-500 mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

