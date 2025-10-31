import { Camera, ChevronDown, ChevronLeft, MapPin, Mic } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function FarmerProfileSetup() {
const [cropType, setCropType] = useState('');
const [isCropTypeOpen, setIsCropTypeOpen] = useState(false);

const cropTypes = [
'Rice',
'Wheat',
'Cotton',
'Sugarcane',
'Vegetables',
'Fruits',
];

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
{/* Header */}
<View className="flex-row items-center mb-4">
<TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4">
<ChevronLeft size={24} color="#FFFFFF" />
</TouchableOpacity>
<Text className="text-xl font-bold text-white">
Profile Setup
</Text>
</View>
<Text className="text-white/80">
Complete your profile to get started
</Text>
</View>

<ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
{/* Form Card */}
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

{/* Profile Picture Section */}
<View className="items-center mb-8">
<View className="relative">
<View className="w-24 h-24 rounded-full bg-green-50 items-center justify-center">
<Image 
source={{ uri: 'https://example.com/default-avatar.png' }}
className="w-24 h-24 rounded-full"
/>
</View>
<TouchableOpacity
className="absolute bottom-0 right-0 p-2 rounded-full"
style={{ backgroundColor: '#7C8B3A' }}
>
<Camera size={20} color="white" />
</TouchableOpacity>
</View>
</View>

{/* Form Fields */}
<View className="space-y-4">
{/* Name Input */}
<View>
<Text className="text-sm font-medium text-gray-700 mb-1">Name</Text>
<TextInput
placeholder="Enter your name"
className="p-4 rounded-xl border border-gray-200 text-gray-900"
/>
</View>

{/* Address Input */}
<View>
<Text className="text-sm font-medium text-gray-700 mb-1">Address</Text>
<TouchableOpacity className="p-4 rounded-xl border border-gray-200 flex-row items-center justify-between">
<View className="flex-row items-center flex-1">
<MapPin size={20} color="#374151" />
<Text className="text-gray-400 ml-2">Auto-fetched by GPS</Text>
</View>
</TouchableOpacity>
</View>

{/* Soil Test Selection */}
<View>
<Text className="text-sm font-medium text-gray-700 mb-1">Soil Test</Text>
<TouchableOpacity 
onPress={() => setIsCropTypeOpen(!isCropTypeOpen)}
className="p-4 rounded-xl border border-gray-200 flex-row items-center justify-between"
>
<Text className="text-gray-900">
{cropType || 'Select soil test'}
</Text>
<ChevronDown 
size={20} 
color="#374151"
className={`transform ${isCropTypeOpen ? 'rotate-180' : 'rotate-0'}`}
/>
</TouchableOpacity>

{isCropTypeOpen && (
<View className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
{cropTypes.map((crop) => (
<TouchableOpacity
key={crop}
onPress={() => {
setCropType(crop);
setIsCropTypeOpen(false);
}}
className={`p-4 ${
cropType === crop ? 'bg-green-50' : 'bg-white'
}`}
>
<Text
className={`text-base ${
cropType === crop ? 'text-green-600' : 'text-gray-900'
}`}
>
{crop}
</Text>
</TouchableOpacity>
))}
</View>
)}
</View>

{/* Land Size Input */}
<View>
<Text className="text-sm font-medium text-gray-700 mb-1">Land Acres</Text>
<TextInput
placeholder="Enter land size"
keyboardType="numeric"
className="p-4 rounded-xl border border-gray-200 text-gray-900"
/>
</View>

{/* Location Fields */}
<View className="flex-row gap-4">
<View className="flex-1">
<Text className="text-sm font-medium text-gray-700 mb-1">State</Text>
<TextInput
placeholder="Enter state"
className="p-4 rounded-xl border border-gray-200 text-gray-900"
/>
</View>
<View className="flex-1">
<Text className="text-sm font-medium text-gray-700 mb-1">City</Text>
<TextInput
placeholder="Enter city"
className="p-4 rounded-xl border border-gray-200 text-gray-900"
/>
</View>
</View>

{/* Pincode Input */}
<View>
<Text className="text-sm font-medium text-gray-700 mb-1">Pincode</Text>
<View className="relative">
<TextInput
placeholder="Enter pincode"
keyboardType="numeric"
className="p-4 rounded-xl border border-gray-200 text-gray-900 pr-12"
/>
<TouchableOpacity 
className="absolute right-4 top-1/2 -mt-4"
>
<Mic size={20} color="#374151" />
</TouchableOpacity>
</View>
</View>
</View>

{/* Action Buttons */}
<View className="flex-row gap-4 mt-8">
<TouchableOpacity className="flex-1 p-4 rounded-xl" style={{ backgroundColor: '#F5F3F0' }}>
<Text className="text-center text-lg font-semibold" style={{ color: '#7C8B3A' }}>
Save
</Text>
</TouchableOpacity>
<TouchableOpacity className="flex-1 p-4 rounded-xl" style={{ backgroundColor: '#7C8B3A' }}>
<Text className="text-white text-center text-lg font-semibold">
Continue
</Text>
</TouchableOpacity>
</View>
</View>
</ScrollView>
</View>
);
}