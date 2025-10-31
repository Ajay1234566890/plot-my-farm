import { useWeather } from '@/contexts/weather-context';
import { formatLocation } from '@/utils/weather-utils';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, RefreshCw } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function DebugLocationScreen() {
  const router = useRouter();
  const {
    weatherData,
    locationData,
    isLoadingWeather,
    isLoadingLocation,
    weatherError,
    locationError,
    refreshWeather,
    refreshLocation
  } = useWeather();

  const location = formatLocation(locationData, weatherData);

  const handleRefresh = async () => {
    console.log('🔄 [DEBUG] Manual refresh triggered');
    try {
      await Promise.all([refreshLocation(), refreshWeather()]);
    } catch (error) {
      console.error('❌ [DEBUG] Error refreshing:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 px-6 pt-12 pb-6">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-semibold">Debug Location</Text>
        </View>
      </View>

      <View className="p-4 space-y-4">
        {/* Refresh Button */}
        <TouchableOpacity
          onPress={handleRefresh}
          className="bg-blue-600 p-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <RefreshCw color="white" size={20} />
          <Text className="text-white font-medium">Refresh Location & Weather</Text>
        </TouchableOpacity>

        {/* Current Display */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-semibold mb-3">Current Location Display</Text>
          <View className="flex-row items-center gap-2">
            <MapPin size={16} color="#6B7280" />
            <Text className="text-gray-700 text-lg">{location.display}</Text>
          </View>
          <Text className="text-gray-500 text-sm mt-1">Short: {location.short}</Text>
          <Text className="text-gray-500 text-sm">Full: {location.full}</Text>
        </View>

        {/* Loading States */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-semibold mb-3">Loading States</Text>
          <Text className="text-gray-700">Location Loading: {isLoadingLocation ? 'Yes' : 'No'}</Text>
          <Text className="text-gray-700">Weather Loading: {isLoadingWeather ? 'Yes' : 'No'}</Text>
        </View>

        {/* Errors */}
        {(locationError || weatherError) && (
          <View className="bg-red-50 rounded-xl p-4 border border-red-200">
            <Text className="text-lg font-semibold mb-3 text-red-800">Errors</Text>
            {locationError && (
              <Text className="text-red-600 mb-2">Location Error: {locationError.message}</Text>
            )}
            {weatherError && (
              <Text className="text-red-600">Weather Error: {weatherError.message}</Text>
            )}
          </View>
        )}

        {/* Raw Location Data */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-semibold mb-3">Raw Location Data</Text>
          {locationData ? (
            <View>
              <Text className="text-gray-700 font-medium mb-2">Coordinates:</Text>
              <Text className="text-gray-600 text-sm mb-1">
                Lat: {locationData.coordinates.latitude.toFixed(6)}
              </Text>
              <Text className="text-gray-600 text-sm mb-1">
                Lon: {locationData.coordinates.longitude.toFixed(6)}
              </Text>
              <Text className="text-gray-600 text-sm mb-1">
                Accuracy: {locationData.coordinates.accuracy ? `${locationData.coordinates.accuracy.toFixed(1)}m` : 'Unknown'}
              </Text>
              <Text className="text-gray-600 text-sm mb-3">
                Altitude: {locationData.coordinates.altitude ? `${locationData.coordinates.altitude.toFixed(1)}m` : 'Unknown'}
              </Text>
              
              <Text className="text-gray-700 font-medium mb-2">Address:</Text>
              <Text className="text-gray-600 text-sm mb-1">
                City: {locationData.address.city || 'null'}
              </Text>
              <Text className="text-gray-600 text-sm mb-1">
                State/Region: {locationData.address.region || 'null'}
              </Text>
              <Text className="text-gray-600 text-sm mb-1">
                Country: {locationData.address.country || 'null'}
              </Text>
              <Text className="text-gray-600 text-sm mb-1">
                Formatted: {locationData.address.formattedAddress || 'null'}
              </Text>
              <Text className="text-gray-600 text-sm">
                Name: {locationData.address.name || 'null'}
              </Text>
            </View>
          ) : (
            <Text className="text-gray-500">No location data available</Text>
          )}
        </View>

        {/* Raw Weather Data */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-semibold mb-3">Raw Weather Data</Text>
          {weatherData ? (
            <View>
              <Text className="text-gray-700 font-medium mb-2">Location from Weather API:</Text>
              <Text className="text-gray-600 text-sm mb-1">
                Name: {weatherData.location.name || 'null'}
              </Text>
              <Text className="text-gray-600 text-sm mb-1">
                Country: {weatherData.location.country || 'null'}
              </Text>
              <Text className="text-gray-600 text-sm mb-1">
                State: {weatherData.location.state || 'null'}
              </Text>
              <Text className="text-gray-600 text-sm mb-1">
                Lat: {weatherData.location.lat}
              </Text>
              <Text className="text-gray-600 text-sm">
                Lon: {weatherData.location.lon}
              </Text>
            </View>
          ) : (
            <Text className="text-gray-500">No weather data available</Text>
          )}
        </View>

        {/* Coordinate Verification */}
        <View className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <Text className="text-lg font-semibold mb-3 text-blue-800">Coordinate Verification</Text>
          <Text className="text-blue-700 text-sm mb-2">
            <Text className="font-medium">Tuni, Andhra Pradesh:</Text> 17.3591°N, 82.5461°E
          </Text>
          <Text className="text-blue-700 text-sm mb-2">
            <Text className="font-medium">Hyderabad, Telangana:</Text> ~17.3850°N, 78.4867°E
          </Text>
          {locationData && (
            <Text className="text-blue-700 text-sm mb-2">
              <Text className="font-medium">Your GPS Location:</Text> {locationData.coordinates.latitude.toFixed(4)}°N, {locationData.coordinates.longitude.toFixed(4)}°E
            </Text>
          )}
          <Text className="text-blue-600 text-xs">
            Check console logs for detailed location analysis including accuracy and source detection
          </Text>
        </View>

        {/* Platform Information */}
        <View className="bg-orange-50 rounded-xl p-4 border border-orange-200">
          <Text className="text-lg font-semibold mb-3 text-orange-800">Platform Limitations</Text>
          <Text className="text-orange-700 text-sm mb-2">
            <Text className="font-medium">Web Browser GPS:</Text> Limited accuracy, may use IP/WiFi location
          </Text>
          <Text className="text-orange-700 text-sm mb-2">
            <Text className="font-medium">Native Mobile:</Text> Direct GPS access, much higher accuracy
          </Text>
          <Text className="text-orange-600 text-xs">
            For accurate GPS coordinates, test on a physical mobile device instead of web browser
          </Text>
        </View>

        {/* Instructions */}
        <View className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <Text className="text-lg font-semibold mb-3 text-yellow-800">Debug Instructions</Text>
          <Text className="text-yellow-700 text-sm mb-2">
            1. Open browser developer tools (F12)
          </Text>
          <Text className="text-yellow-700 text-sm mb-2">
            2. Go to Console tab
          </Text>
          <Text className="text-yellow-700 text-sm mb-2">
            3. Tap "Refresh Location & Weather" button
          </Text>
          <Text className="text-yellow-700 text-sm">
            4. Look for logs starting with 🎯, 🌍, 📍, ✅, ❌, ⚠️
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
