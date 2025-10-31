import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Home, Sprout, Mic, MessageCircle, User } from 'lucide-react-native';

export default function BottomTabs() {
return (
<View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
<View className="flex-row items-center justify-between px-3 pb-6 pt-2">
{/* Home Tab */}
<TouchableOpacity 
className="items-center justify-center"
accessibilityLabel="Home tab"
accessibilityRole="tab"
>
<Home size={24} color="#16a34a" strokeWidth={2} />
<Text className="text-xs text-green-600 mt-1">Home</Text>
</TouchableOpacity>

{/* My Farms Tab */}
<TouchableOpacity 
className="items-center justify-center"
accessibilityLabel="My Farms tab"
accessibilityRole="tab"
>
<Sprout size={24} color="#6b7280" strokeWidth={2} />
<Text className="text-xs text-gray-500 mt-1">My Farms</Text>
</TouchableOpacity>

{/* Mic Button */}
<TouchableOpacity 
className="items-center justify-center -mt-5 bg-green-600 rounded-full w-14 h-14 shadow-lg"
accessibilityLabel="Voice command"
accessibilityRole="button"
>
<Mic size={28} color="white" strokeWidth={2} />
</TouchableOpacity>

{/* Messages Tab */}
<TouchableOpacity 
className="items-center justify-center"
accessibilityLabel="Messages tab"
accessibilityRole="tab"
>
<MessageCircle size={24} color="#6b7280" strokeWidth={2} />
<Text className="text-xs text-gray-500 mt-1">Messages</Text>
</TouchableOpacity>

{/* Profile Tab */}
<TouchableOpacity 
className="items-center justify-center"
accessibilityLabel="Profile tab"
accessibilityRole="tab"
>
<User size={24} color="#6b7280" strokeWidth={2} />
<Text className="text-xs text-gray-500 mt-1">Profile</Text>
</TouchableOpacity>
</View>

{/* Safe Area Spacing for iOS */}
<View className="h-[12px] bg-white" />
</View>
);
}