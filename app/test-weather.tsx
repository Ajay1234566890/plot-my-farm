// Test Weather Integration Screen
// For testing weather functionality and location permissions

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, RefreshCw, Settings, AlertCircle, CheckCircle, XCircle } from 'lucide-react-native';
import { useWeather } from '@/contexts/weather-context';
import { LocationPermissionStatus } from '@/services/location-service';

export default function TestWeather() {
  const router = useRouter();
  const { 
    weatherData, 
    locationData, 
    isLoadingWeather, 
    isLoadingLocation, 
    weatherError, 
    locationError,
    locationPermission,
    refreshWeather,
    refreshLocation,
    requestLocationPermission,
    setShowPermissionModal,
    clearErrors,
    lastUpdated,
    isInitialized
  } = useWeather();

  const handleRefresh = async () => {
    try {
      await Promise.all([refreshLocation(), refreshWeather()]);
    } catch (error) {
      console.error('Error refreshing:', error);
      Alert.alert('Error', 'Failed to refresh weather data');
    }
  };

  const handleRequestPermission = async () => {
    try {
      const permission = await requestLocationPermission();
      Alert.alert(
        'Permission Result', 
        `Location permission: ${permission}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error requesting permission:', error);
      Alert.alert('Error', 'Failed to request location permission');
    }
  };

  const getPermissionStatusIcon = () => {
    switch (locationPermission) {
      case LocationPermissionStatus.GRANTED:
        return <CheckCircle size={20} color="#10B981" />;
      case LocationPermissionStatus.DENIED:
        return <XCircle size={20} color="#EF4444" />;
      default:
        return <AlertCircle size={20} color="#F59E0B" />;
    }
  };

  const getPermissionStatusText = () => {
    switch (locationPermission) {
      case LocationPermissionStatus.GRANTED:
        return 'Granted';
      case LocationPermissionStatus.DENIED:
        return 'Denied';
      case LocationPermissionStatus.UNDETERMINED:
        return 'Not Requested';
      default:
        return 'Unknown';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Weather Test</Text>
          <TouchableOpacity onPress={handleRefresh} className="p-2">
            <RefreshCw 
              size={20} 
              color="white" 
              className={isLoadingWeather || isLoadingLocation ? "animate-spin" : ""}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Initialization Status */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold mb-2">Initialization Status</Text>
          <View className="flex-row items-center">
            {isInitialized ? (
              <CheckCircle size={16} color="#10B981" />
            ) : (
              <AlertCircle size={16} color="#F59E0B" />
            )}
            <Text className="ml-2 text-gray-700">
              {isInitialized ? 'Initialized' : 'Initializing...'}
            </Text>
          </View>
          {lastUpdated && (
            <Text className="text-gray-500 text-sm mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </Text>
          )}
        </View>

        {/* Location Permission Status */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold mb-3">Location Permission</Text>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              {getPermissionStatusIcon()}
              <Text className="ml-2 text-gray-700">{getPermissionStatusText()}</Text>
            </View>
            <TouchableOpacity
              onPress={handleRequestPermission}
              className="bg-blue-100 px-3 py-1 rounded-lg"
            >
              <Text className="text-blue-600 text-sm">Request</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setShowPermissionModal(true)}
            className="bg-green-100 px-3 py-2 rounded-lg"
          >
            <Text className="text-green-600 text-center">Show Permission Modal</Text>
          </TouchableOpacity>
        </View>

        {/* Location Data */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold mb-3">Location Data</Text>
          {isLoadingLocation ? (
            <Text className="text-gray-500">Loading location...</Text>
          ) : locationError ? (
            <View>
              <Text className="text-red-600 mb-2">Error: {locationError.message}</Text>
              <TouchableOpacity onPress={clearErrors} className="bg-red-100 px-3 py-1 rounded-lg">
                <Text className="text-red-600 text-sm">Clear Error</Text>
              </TouchableOpacity>
            </View>
          ) : locationData ? (
            <View>
              <View className="flex-row items-center mb-2">
                <MapPin size={16} color="#6B7280" />
                <Text className="ml-2 text-gray-700">{locationData.address.formattedAddress}</Text>
              </View>
              <Text className="text-gray-500 text-sm">
                Lat: {locationData.coordinates.latitude.toFixed(4)}, 
                Lon: {locationData.coordinates.longitude.toFixed(4)}
              </Text>
            </View>
          ) : (
            <Text className="text-gray-500">No location data</Text>
          )}
        </View>

        {/* Weather Data */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold mb-3">Weather Data</Text>
          {isLoadingWeather ? (
            <Text className="text-gray-500">Loading weather...</Text>
          ) : weatherError ? (
            <View>
              <Text className="text-red-600 mb-2">Error: {weatherError.message}</Text>
              <TouchableOpacity onPress={clearErrors} className="bg-red-100 px-3 py-1 rounded-lg">
                <Text className="text-red-600 text-sm">Clear Error</Text>
              </TouchableOpacity>
            </View>
          ) : weatherData ? (
            <View>
              <Text className="text-gray-700 mb-1">
                Location: {weatherData.location.name}
              </Text>
              <Text className="text-gray-700 mb-1">
                Temperature: {weatherData.current.temperature}°C
              </Text>
              <Text className="text-gray-700 mb-1">
                Condition: {weatherData.current.condition}
              </Text>
              <Text className="text-gray-700 mb-1">
                Humidity: {weatherData.current.humidity}%
              </Text>
              <Text className="text-gray-700 mb-1">
                Wind: {weatherData.current.windSpeed} km/h
              </Text>
              <Text className="text-gray-500 text-sm mt-2">
                Hourly forecasts: {weatherData.hourly.length}
              </Text>
              <Text className="text-gray-500 text-sm">
                Daily forecasts: {weatherData.daily.length}
              </Text>
            </View>
          ) : (
            <Text className="text-gray-500">No weather data</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View className="space-y-3 mb-8">
          <TouchableOpacity
            onPress={handleRefresh}
            className="bg-blue-600 rounded-xl py-3 px-4 flex-row items-center justify-center"
          >
            <RefreshCw size={18} color="white" />
            <Text className="text-white font-semibold ml-2">Refresh All Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => router.push('/weather')}
            className="bg-green-600 rounded-xl py-3 px-4"
          >
            <Text className="text-white font-semibold text-center">Go to Weather Screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => router.push('/farmer-weather')}
            className="bg-orange-600 rounded-xl py-3 px-4"
          >
            <Text className="text-white font-semibold text-center">Go to Farmer Weather</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
