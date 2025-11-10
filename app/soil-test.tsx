import FarmerBottomNav from '@/app/components/FarmerBottomNav';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Camera,
    CheckCircle,
    Droplets,
    FlaskConical,
    Leaf,
    MapPin,
    Sun,
    Upload
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function SoilTest() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const soilTests = [
    {
      id: "basic",
      title: t('soilTest.basicSoilAnalysis'),
      description: t('soilTest.basicDescription'),
      price: "₹499",
      time: t('soilTest.twoDays'),
      icon: "🧪",
    },
    {
      id: "comprehensive",
      title: t('soilTest.comprehensiveTest'),
      description: t('soilTest.comprehensiveDescription'),
      price: "₹899",
      time: t('soilTest.fourDays'),
      icon: "🔬",
    },
    {
      id: "advanced",
      title: t('soilTest.advancedAnalysis'),
      description: t('soilTest.advancedDescription'),
      price: "₹1499",
      time: t('soilTest.oneWeek'),
      icon: "🧬",
    },
  ];

  const handleSubmit = () => {
    if (!selectedTest || !location) {
      Alert.alert(t('soilTest.missingInformation'), t('soilTest.selectTestAndLocation'));
      return;
    }

    setIsSubmitted(true);
    // In a real app, this would send data to a backend
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedTest(null);
      setLocation("");
      setNotes("");
      Alert.alert(t('common.success'), t('soilTest.requestSubmitted'));
    }, 2000);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Curved Header Section */}
      <View
        className="px-6 pt-12 pb-8"
        style={{
          backgroundColor: '#7C8B3A', // Olive/army green matching farmer-home
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
              onPress={() => router.back()}
              accessibilityLabel={t('common.goBack')}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white">{t('soilTest.soilTesting')}</Text>
              <Text className="text-white/90 mt-1">{t('soilTest.soilTestingSubtitle')}</Text>
            </View>
          </View>
          <FlaskConical size={32} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>

        {/* Test Selection */}
        <View
          className="bg-white rounded-3xl p-6 shadow-lg mb-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text className="text-xl font-bold text-gray-800 mb-4">
            {t('soilTest.selectTestType')}
          </Text>

          {soilTests.map((test) => (
            <TouchableOpacity
              key={test.id}
              className={`bg-gray-50 rounded-2xl p-4 mb-4 border-2 ${
                selectedTest === test.id
                  ? "border-[#7C8B3A]"
                  : "border-transparent"
              }`}
              onPress={() => setSelectedTest(test.id)}
            >
              <View className="flex-row items-center">
                <Text className="text-3xl mr-3">{test.icon}</Text>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-800">
                    {test.title}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {test.description}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-lg font-bold" style={{ color: '#7C8B3A' }}>
                    {test.price}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {test.time}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location Input */}
        <View className="px-4 mt-2">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            {t('soilTest.farmLocation')}
          </Text>
          <View className="bg-white rounded-2xl p-4 shadow shadow-gray-200">
            <View className="flex-row items-center">
              <MapPin size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-base text-gray-800"
                placeholder={t('soilTest.enterFarmAddress')}
                placeholderTextColor="#9CA3AF"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>
        </View>

        {/* Notes */}
        <View className="px-4 mt-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            {t('soilTest.additionalNotes')}
          </Text>
          <View className="bg-white rounded-2xl p-4 shadow shadow-gray-200">
            <TextInput
              className="text-base text-gray-800 h-24"
              placeholder={t('soilTest.notesPlaceholder')}
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        {/* Soil Image Upload */}
        <View className="px-4 mt-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            {t('soilTest.soilSamplePhotos')}
          </Text>
          <View className="bg-white rounded-2xl p-6 shadow shadow-gray-200 items-center">
            <Upload size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2 text-center">
              {t('soilTest.uploadPhotos')}
            </Text>
            <TouchableOpacity className="mt-4 flex-row items-center bg-amber-100 rounded-full px-4 py-2">
              <Camera size={16} color="#EA580C" />
              <Text className="text-amber-700 font-medium ml-2">{t('soilTest.takePhoto')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Benefits Section */}
        <View className="px-4 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            {t('soilTest.whySoilTesting')}
          </Text>
          <View className="bg-white rounded-2xl p-4 shadow shadow-gray-200">
            <View className="flex-row mb-4">
              <Leaf size={24} color="#10B981" />
              <View className="ml-3">
                <Text className="font-bold text-gray-800">
                  {t('soilTest.improveCropYield')}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {t('soilTest.improveCropYieldDesc')}
                </Text>
              </View>
            </View>

            <View className="flex-row mb-4">
              <Droplets size={24} color="#3B82F6" />
              <View className="ml-3">
                <Text className="font-bold text-gray-800">
                  {t('soilTest.optimizeWaterUsage')}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {t('soilTest.optimizeWaterUsageDesc')}
                </Text>
              </View>
            </View>

            <View className="flex-row">
              <Sun size={24} color="#F59E0B" />
              <View className="ml-3">
                <Text className="font-bold text-gray-800">
                  {t('soilTest.nutrientManagement')}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {t('soilTest.nutrientManagementDesc')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View className="px-4 mt-6 mb-8">
          <TouchableOpacity
            className={`py-4 rounded-2xl items-center ${
              isSubmitted 
                ? "bg-green-500" 
                : "bg-gradient-to-r from-amber-500 to-orange-600"
            } shadow shadow-amber-300`}
            onPress={handleSubmit}
            disabled={isSubmitted}
          >
            {isSubmitted ? (
              <View className="flex-row items-center">
                <CheckCircle size={24} color="#FFFFFF" />
                <Text className="text-white font-bold ml-2">{t('soilTest.requestSubmittedButton')}</Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-lg">
                {t('soilTest.submitRequest')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}