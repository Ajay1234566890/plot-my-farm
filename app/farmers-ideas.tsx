import FarmerBottomNav from "@/app/components/FarmerBottomNav";
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Camera,
    FileText,
    Phone,
    Send,
    Video
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    Linking,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function FarmersIdeas() {
  const router = useRouter();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);

  // Mock data for existing doubts/ideas
  const ideas = [
    {
      id: 1,
      user: "Rajesh Kumar",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
      message: "What's the best time to plant tomatoes in Delhi region?",
      time: "2 hours ago",
      replies: 5
    },
    {
      id: 2,
      user: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
      message: "Looking for organic fertilizer recommendations",
      time: "5 hours ago",
      replies: 12
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      Alert.alert(
        t('common.success'),
        t('doubts.messageSent'),
        [{ text: t('common.ok'), onPress: () => setMessage('') }]
      );
    } else {
      Alert.alert(t('common.error'), t('doubts.enterMessage'));
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });

      if (result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        Alert.alert(t('common.success'), `${t('doubts.fileSelected')}: ${result.assets[0].name}`);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('doubts.fileUploadFailed'));
    }
  };

  const handleCall = () => {
    Alert.alert(
      t('common.call'),
      t('doubts.callExpert'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.call'), onPress: () => Linking.openURL('tel:+911234567890') }
      ]
    );
  };

  const handleVideoCall = () => {
    Alert.alert(
      t('common.videoCall'),
      t('doubts.videoCallFeatureComingSoon')
    );
  };

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
          <Text className="text-xl font-bold text-white">{t('doubts.farmersIdeas')}</Text>
        </View>
        <Text className="text-white/80">{t('doubts.shareYourDoubts')}</Text>
      </View>

      {/* Ideas List */}
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {ideas.map((idea) => (
          <View key={idea.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Image
                source={{ uri: idea.avatar }}
                className="w-12 h-12 rounded-full"
              />
              <View className="flex-1 ml-3">
                <Text className="text-gray-900 font-semibold">{idea.user}</Text>
                <Text className="text-gray-500 text-sm">{idea.time}</Text>
              </View>
            </View>
            <Text className="text-gray-700 mb-3">{idea.message}</Text>
            <Text className="text-green-600 text-sm">{idea.replies} {t('doubts.replies')}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Section */}
      <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-200">
        {selectedFile && (
          <View className="mb-2 flex-row items-center bg-gray-100 p-2 rounded-lg">
            <FileText size={16} color="#666" />
            <Text className="ml-2 text-sm text-gray-700 flex-1" numberOfLines={1}>
              {selectedFile.name}
            </Text>
          </View>
        )}

        {/* Action Buttons Row */}
        <View className="flex-row items-center mb-3 gap-2">
          <TouchableOpacity
            onPress={handleCall}
            className="bg-green-600 rounded-full p-3"
          >
            <Phone size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleVideoCall}
            className="bg-blue-600 rounded-full p-3"
          >
            <Video size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFileUpload}
            className="bg-gray-600 rounded-full p-3"
          >
            <Camera size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Message Input */}
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-gray-800"
            placeholder={t('doubts.typeYourDoubt')}
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            className="bg-green-600 rounded-full p-3"
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <FarmerBottomNav activeTab="home" />
    </View>
  );
}

