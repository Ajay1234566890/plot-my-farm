import { ArrowLeft, Bell, CheckCircle, Clock, MessageSquare, Package } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import FarmerBottomNav from './components/FarmerBottomNav';

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "New Offer: 10% off on Fresh Tomatoes",
      message: "Fresh Green Farm's limited time offer, valid until tomorrow.",
      icon: <Bell size={24} color="#7C8B3A" />,
      time: "15 mins ago",
      isUnread: true,
      type: "offer"
    },
    {
      id: 2,
      title: "Order Shipped",
      message: "Your order #12345 for Sweet Corn has been shipped and will reach you by today",
      icon: <Package size={24} color="#7C8B3A" />,
      time: "1 hour ago",
      isUnread: true,
      type: "order"
    },
    {
      id: 3,
      title: "New Message from Sarah",
      message: "Hi John, the orders you requested are ready for pickup.",
      icon: <MessageSquare size={24} color="#7C8B3A" />,
      time: "Yesterday, 5:30 AM",
      isUnread: false,
      type: "message"
    },
    {
      id: 4,
      title: "Order Delivered",
      message: "Your order #12344 for Organic Apples has been successfully delivered",
      icon: <CheckCircle size={24} color="#7C8B3A" />,
      time: "Yesterday, 2:15 AM",
      isUnread: false,
      type: "order"
    },
    {
      id: 5,
      title: "Offer Expired",
      message: "The special offer on Berries has expired.",
      icon: <Clock size={24} color="#7C8B3A" />,
      time: "Yesterday, 8:00 AM",
      isUnread: false,
      type: "offer"
    },
  ];

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.isUnread);

  const clearAllNotifications = () => {
    // In a real app, this would clear notifications in the backend
    console.log('Clearing all notifications');
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
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20 mr-4"
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white">
              Notifications
            </Text>
          </View>
          <TouchableOpacity
            onPress={clearAllNotifications}
            className="active:opacity-70"
          >
            <Text className="text-white text-sm">Clear All</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-white/80">
          Stay updated with your farm activities
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 bg-white">
        <TouchableOpacity
          onPress={() => setActiveTab('all')}
          className={`flex-1 py-3 ${activeTab === 'all' ? 'border-b-2' : ''}`}
          style={activeTab === 'all' ? { borderBottomColor: '#7C8B3A' } : {}}
        >
          <Text className={`text-center ${activeTab === 'all' ? 'font-semibold' : 'text-gray-600'}`}
                style={activeTab === 'all' ? { color: '#7C8B3A' } : {}}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('unread')}
          className={`flex-1 py-3 ${activeTab === 'unread' ? 'border-b-2' : ''}`}
          style={activeTab === 'unread' ? { borderBottomColor: '#7C8B3A' } : {}}
        >
          <Text className={`text-center ${activeTab === 'unread' ? 'font-semibold' : 'text-gray-600'}`}
                style={activeTab === 'unread' ? { color: '#7C8B3A' } : {}}>
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Today Section */}
        <View className="px-4 py-3">
          <Text className="text-sm font-medium text-gray-500">Today</Text>
        </View>
        {filteredNotifications
          .filter(n => n.time.includes('mins') || n.time.includes('hour'))
          .map((notification) => (
            <TouchableOpacity
              key={notification.id}
              className={`px-4 py-3 border-b border-gray-100 ${notification.isUnread ? 'bg-blue-50' : 'bg-white'}`}
              accessibilityRole="button"
            >
              <View className="flex-row items-start">
                <View className="bg-blue-100 p-2 rounded-full">
                  {notification.icon}
                </View>
                <View className="flex-1 ml-3">
                  <Text className={`text-base ${notification.isUnread ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                    {notification.title}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {notification.time}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

        {/* Yesterday Section */}
        <View className="px-4 py-3">
          <Text className="text-sm font-medium text-gray-500">Yesterday</Text>
        </View>
        {filteredNotifications
          .filter(n => n.time.includes('Yesterday'))
          .map((notification) => (
            <TouchableOpacity
              key={notification.id}
              className={`px-4 py-3 border-b border-gray-100 ${notification.isUnread ? 'bg-blue-50' : 'bg-white'}`}
              accessibilityRole="button"
            >
              <View className="flex-row items-start">
                <View className="bg-blue-100 p-2 rounded-full">
                  {notification.icon}
                </View>
                <View className="flex-1 ml-3">
                  <Text className={`text-base ${notification.isUnread ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                    {notification.title}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {notification.time}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>

      <FarmerBottomNav activeTab="messages" />
    </View>
  );
}