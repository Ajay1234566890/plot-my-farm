import { useWeather } from "@/contexts/weather-context";
import { formatLocation, getIconColor, getTextColorClass, getWeatherBackground } from "@/utils/weather-utils";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
    AlertCircle,
    ArrowLeft,
    Cloud,
    Droplets,
    MapPin,
    RefreshCw,
    Sun,
    ThermometerSun
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function WeatherScreen() {
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

  // Get formatted location and weather background
  const location = formatLocation(locationData, weatherData);
  const weatherBackground = getWeatherBackground(weatherData);

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await Promise.all([refreshLocation(), refreshWeather()]);
    } catch (error) {
      console.error('Error refreshing weather data:', error);
    }
  };

  // Get weather icon from OpenWeather icon code
  const getWeatherIconFromCode = (iconCode: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      '01d': <Sun size={48} color="#f59e0b" />, // clear sky day
      '01n': <Sun size={48} color="#f59e0b" />, // clear sky night
      '02d': <Cloud size={48} color="#94a3b8" />, // few clouds day
      '02n': <Cloud size={48} color="#94a3b8" />, // few clouds night
      '03d': <Cloud size={48} color="#94a3b8" />, // scattered clouds
      '03n': <Cloud size={48} color="#94a3b8" />,
      '04d': <Cloud size={48} color="#94a3b8" />, // broken clouds
      '04n': <Cloud size={48} color="#94a3b8" />,
      '09d': <Droplets size={48} color="#3b82f6" />, // shower rain
      '09n': <Droplets size={48} color="#3b82f6" />,
      '10d': <Droplets size={48} color="#3b82f6" />, // rain
      '10n': <Droplets size={48} color="#3b82f6" />,
      '11d': <Droplets size={48} color="#3b82f6" />, // thunderstorm
      '11n': <Droplets size={48} color="#3b82f6" />,
      '13d': <Cloud size={48} color="#94a3b8" />, // snow
      '13n': <Cloud size={48} color="#94a3b8" />,
      '50d': <Cloud size={48} color="#94a3b8" />, // mist
      '50n': <Cloud size={48} color="#94a3b8" />,
    };

    return iconMap[iconCode] || <Sun size={48} color="#f59e0b" />;
  };

  // Generate farm advisory based on weather data
  const generateFarmAdvisory = () => {
    if (!weatherData) {
      return {
        temperature: "Loading...",
        temperatureStatus: "Fetching weather data",
        rainfall: "--",
        rainfallStatus: "Loading forecast",
        soilStatus: "Unknown",
        soilDetails: "Weather data required",
        uvIndex: "--",
        uvDetails: "Loading UV data",
      };
    }

    const temp = weatherData.current.temperature;
    const humidity = weatherData.current.humidity;
    const uvIndex = weatherData.current.uvIndex || 0;

    return {
      temperature: temp >= 20 && temp <= 30 ? "Optimal" : temp > 30 ? "High" : "Low",
      temperatureStatus: temp >= 20 && temp <= 30 ? "Good for most crops" :
                        temp > 30 ? "Consider irrigation" : "Monitor cold-sensitive crops",
      rainfall: `${humidity}%`,
      rainfallStatus: humidity > 70 ? "High humidity, monitor for diseases" :
                     humidity < 40 ? "Low humidity, increase irrigation" : "Good moisture levels",
      soilStatus: humidity >= 40 && humidity <= 70 ? "Good" : "Monitor",
      soilDetails: humidity >= 40 && humidity <= 70 ? "Optimal moisture levels" :
                  humidity > 70 ? "May be too wet" : "May need irrigation",
      uvIndex: uvIndex > 7 ? "High" : uvIndex > 3 ? "Moderate" : "Low",
      uvDetails: uvIndex > 7 ? "Use protection, limit field work" :
                uvIndex > 3 ? "Good for outdoor work" : "Safe conditions",
    };
  };

  const farmAdvisory = generateFarmAdvisory();

  return (
    <View className="flex-1 bg-blue-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#1D4ED8" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            Detailed Weather
          </Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} className="p-2">
          <RefreshCw
            size={20}
            color="#1D4ED8"
            className={isLoadingWeather || isLoadingLocation ? "animate-spin" : ""}
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Current Weather Card */}
        <LinearGradient
          colors={weatherBackground.gradient as [string, string, ...string[]]}
          className="p-6 rounded-b-3xl shadow-lg"
          style={{
            shadowColor: weatherBackground.shadowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <MapPin color={getIconColor(weatherBackground)} size={16} />
                <Text className={`${getTextColorClass(weatherBackground)} text-lg font-medium`}>
                  {location.display}
                </Text>
              </View>
              <Text className={`${getTextColorClass(weatherBackground)} text-5xl font-bold mt-2`}>
                {weatherData?.current.temperature ? `${weatherData.current.temperature}°` : '--°'}
              </Text>
              <Text className={`${getTextColorClass(weatherBackground)} mt-1 opacity-90`}>
                {weatherData?.current.description || weatherData?.current.condition || 'Loading...'}
              </Text>
              {(weatherError || locationError) && (
                <TouchableOpacity onPress={handleRefresh} className="flex-row items-center gap-1 mt-2">
                  <AlertCircle color={getIconColor(weatherBackground)} size={14} />
                  <Text className={`${getTextColorClass(weatherBackground)} text-sm opacity-80`}>Tap to retry</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={handleRefresh}>
              {weatherData?.current.icon ? (
                getWeatherIconFromCode(weatherData.current.icon)
              ) : (
                <Cloud color="white" size={48} />
              )}
            </TouchableOpacity>
          </View>

          <View className={`flex-row justify-between mt-6 rounded-xl p-4 shadow-sm ${getTextColorClass(weatherBackground) === 'text-white' ? 'bg-white/20' : 'bg-black/10'}`}>
            <View className="items-center">
              <Text className={`${getTextColorClass(weatherBackground)} opacity-80`}>Humidity</Text>
              <Text className={`${getTextColorClass(weatherBackground)} font-medium mt-1`}>
                {weatherData?.current.humidity ? `${weatherData.current.humidity}%` : '--'}
              </Text>
            </View>
            <View className="items-center">
              <Text className={`${getTextColorClass(weatherBackground)} opacity-80`}>Wind</Text>
              <Text className={`${getTextColorClass(weatherBackground)} font-medium mt-1`}>
                {weatherData?.current.windSpeed ? `${weatherData.current.windSpeed} km/h` : '--'}
              </Text>
            </View>
            <View className="items-center">
              <Text className={`${getTextColorClass(weatherBackground)} opacity-80`}>Pressure</Text>
              <Text className={`${getTextColorClass(weatherBackground)} font-medium mt-1`}>
                {weatherData?.current.pressure ? `${weatherData.current.pressure} hPa` : '--'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Hourly Forecast */}
        <View className="mt-6 px-4">
          <Text className="text-lg font-semibold mb-4">Hourly Forecast</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="max-h-32"
          >
            {weatherData?.hourly.slice(0, 8).map((hour, index) => {
              // Create weather data object for this hour to get background
              const hourWeatherData = {
                current: {
                  condition: hour.condition || 'clear',
                  icon: hour.icon || '01d'
                }
              };
              const hourBackground = getWeatherBackground(hourWeatherData as any);

              return (
                <LinearGradient
                  key={index}
                  colors={hourBackground.gradient as [string, string, ...string[]]}
                  className="items-center mr-6 p-4 rounded-xl shadow-sm w-20"
                  style={{
                    shadowColor: hourBackground.shadowColor,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text className={`${getTextColorClass(hourBackground)} text-sm`}>
                    {index === 0 ? 'Now' : new Date(hour.time * 1000).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      hour12: true
                    })}
                  </Text>
                  <View className="my-2">
                    {getWeatherIconFromCode(hour.icon)}
                  </View>
                  <Text className={`${getTextColorClass(hourBackground)} text-lg font-medium`}>{hour.temperature}°</Text>
                </LinearGradient>
              );
            }) || (
              // Fallback when no data
              Array.from({ length: 6 }, (_, index) => {
                const defaultBackground = getWeatherBackground(null);
                return (
                  <LinearGradient
                    key={index}
                    colors={defaultBackground.gradient as [string, string, ...string[]]}
                    className="items-center mr-6 p-4 rounded-xl shadow-sm w-20"
                    style={{
                      shadowColor: defaultBackground.shadowColor,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Text className={`${getTextColorClass(defaultBackground)} text-sm`}>--</Text>
                    <View className="my-2">
                      <Sun size={24} color={getIconColor(defaultBackground)} />
                    </View>
                    <Text className={`${getTextColorClass(defaultBackground)} text-lg font-medium`}>--°</Text>
                  </LinearGradient>
                );
              })
            )}
          </ScrollView>
        </View>

        {/* 5-Day Forecast */}
        <View className="mt-6 px-4">
          <Text className="text-lg font-semibold mb-4">5-Day Forecast</Text>
          <View className="bg-white rounded-xl shadow-sm overflow-hidden">
            {weatherData?.daily.map((day, index) => (
              <View
                key={index}
                className={`flex-row items-center justify-between py-4 px-4 ${index !== weatherData.daily.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <Text className="text-gray-700 w-20">{day.day}</Text>
                <View className="flex-row items-center">
                  {getWeatherIconFromCode(day.icon)}
                </View>
                <Text className="text-gray-900 font-medium">
                  {day.highTemp}°/{day.lowTemp}°
                </Text>
              </View>
            )) || (
              // Fallback when no data
              Array.from({ length: 5 }, (_, index) => (
                <View
                  key={index}
                  className={`flex-row items-center justify-between py-4 px-4 ${index !== 4 ? 'border-b border-gray-100' : ''}`}
                >
                  <Text className="text-gray-700 w-20">--</Text>
                  <View className="flex-row items-center">
                    <Sun size={24} color="#f59e0b" />
                  </View>
                  <Text className="text-gray-900 font-medium">--°/--°</Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Farm Advisory */}
        <View className="mt-6 px-4 mb-8">
          <Text className="text-lg font-semibold mb-4">Farm Advisory</Text>
          <View className="bg-white rounded-xl shadow-sm p-4 border border-blue-100">
            <View className="flex-row justify-between mb-4">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <ThermometerSun size={20} color="#4B5563" />
                  <Text className="text-gray-600 ml-2">Temperature</Text>
                </View>
                <Text className="text-gray-900 font-medium mt-1">
                  {farmAdvisory.temperature}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {farmAdvisory.temperatureStatus}
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Droplets size={20} color="#4B5563" />
                  <Text className="text-gray-600 ml-2">Rainfall</Text>
                </View>
                <Text className="text-gray-900 font-medium mt-1">
                  {farmAdvisory.rainfall}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {farmAdvisory.rainfallStatus}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between">
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Cloud size={20} color="#4B5563" />
                  <Text className="text-gray-600 ml-2">Soil Status</Text>
                </View>
                <Text className="text-gray-900 font-medium mt-1">
                  {farmAdvisory.soilStatus}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {farmAdvisory.soilDetails}
                </Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Sun size={20} color="#4B5563" />
                  <Text className="text-gray-600 ml-2">UV Index</Text>
                </View>
                <Text className="text-gray-900 font-medium mt-1">
                  {farmAdvisory.uvIndex}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {farmAdvisory.uvDetails}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
