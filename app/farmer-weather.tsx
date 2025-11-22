import FarmerBottomNav from '@/app/components/FarmerBottomNav';
import { useWeather } from '@/contexts/weather-context';
import { formatLocation, getIconColor, getTextColorClass, getWeatherBackground } from "@/utils/weather-utils";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
    AlertCircle,
    ArrowLeft,
    Cloud,
    Droplets,
    Eye,
    MapPin,
    RefreshCw,
    Sun,
    ThermometerSun,
    Wind
} from "lucide-react-native";
import React from "react";
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function FarmerWeather() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    weatherData,
    locationData,
    isLoadingWeather,
    isLoadingLocation,
    weatherError,
    locationError,
    refreshWeather,
    refreshLocation,

  } = useWeather();

  // Get formatted location and weather background
  const location = formatLocation(locationData, weatherData, t);
  const weatherBackground = getWeatherBackground(weatherData);

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await Promise.all([refreshLocation(), refreshWeather()]);
    } catch (error) {
      console.error('Error refreshing weather data:', error);
    }
  };

  const farmAdvisory = [
    {
      title: t('weather.irrigation'),
      advice: t('weather.irrigationAdvice'),
      icon: Droplets,
      color: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: t('weather.pestControl'),
      advice: t('weather.pestControlAdvice'),
      icon: Eye,
      color: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: t('weather.harvesting'),
      advice: t('weather.harvestingAdvice'),
      icon: Sun,
      color: "bg-yellow-100",
      textColor: "text-yellow-600"
    },
    {
      title: t('weather.planting'),
      advice: t('weather.plantingAdvice'),
      icon: ThermometerSun,
      color: "bg-purple-100",
      textColor: "text-purple-600"
    },
  ];



  const getWeatherIconFromCode = (iconCode: string) => {
    // OpenWeather icon codes: https://openweathermap.org/weather-conditions
    const iconMap: { [key: string]: React.ReactElement } = {
      '01d': <Sun size={48} color="white" />, // clear sky day
      '01n': <Sun size={48} color="white" />, // clear sky night
      '02d': <Cloud size={48} color="white" />, // few clouds day
      '02n': <Cloud size={48} color="white" />, // few clouds night
      '03d': <Cloud size={48} color="white" />, // scattered clouds
      '03n': <Cloud size={48} color="white" />,
      '04d': <Cloud size={48} color="white" />, // broken clouds
      '04n': <Cloud size={48} color="white" />,
      '09d': <Droplets size={48} color="white" />, // shower rain
      '09n': <Droplets size={48} color="white" />,
      '10d': <Droplets size={48} color="white" />, // rain
      '10n': <Droplets size={48} color="white" />,
      '11d': <Droplets size={48} color="white" />, // thunderstorm
      '11n': <Droplets size={48} color="white" />,
      '13d': <Cloud size={48} color="white" />, // snow
      '13n': <Cloud size={48} color="white" />,
      '50d': <Cloud size={48} color="white" />, // mist
      '50n': <Cloud size={48} color="white" />,
    };

    return iconMap[iconCode] || <Sun size={48} color="white" />;
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Curved Header Section */}
      <LinearGradient
        colors={weatherBackground.gradient as [string, string, ...string[]]}
        className="px-6 pt-12 pb-8"
        style={{
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          shadowColor: weatherBackground.shadowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View className="flex-row items-center gap-3 mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            accessibilityLabel={t('common.goBack')}
          >
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text className={`${getTextColorClass(weatherBackground)} text-xl font-bold`}>{t('weather.weatherForecast')}</Text>
        </View>

        {/* Current Weather */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <MapPin color={getIconColor(weatherBackground)} size={16} />
              <Text className={`${getTextColorClass(weatherBackground)} text-lg`}>
                {location.display}
              </Text>
              {(isLoadingWeather || isLoadingLocation) && (
                <RefreshCw color={getIconColor(weatherBackground)} size={16} className="animate-spin" />
              )}
            </View>
            <Text className={`${getTextColorClass(weatherBackground)} text-5xl font-bold mt-2`}>
              {weatherData?.current.temperature ? `${weatherData.current.temperature}°` : '--°'}
            </Text>
            <Text className={`${getTextColorClass(weatherBackground)} mt-1 opacity-90`}>
              {weatherData?.current.description || weatherData?.current.condition || t('common.loading')}
            </Text>
            {(weatherError || locationError) && (
              <TouchableOpacity onPress={handleRefresh} className="flex-row items-center gap-1 mt-2">
                <AlertCircle color={getIconColor(weatherBackground)} size={14} />
                <Text className={`${getTextColorClass(weatherBackground)} text-sm opacity-80`}>{t('weather.tapToRetry')}</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={handleRefresh}>
            {weatherData?.current.icon ? (
              getWeatherIconFromCode(weatherData.current.icon)
            ) : (
              <Sun color={getIconColor(weatherBackground)} size={48} />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        {/* Weather Details Cards */}
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
          <Text className="text-xl font-bold text-gray-900 mb-4">{t('weather.weatherDetails')}</Text>
          <View className="flex-row flex-wrap gap-4">
            <View className="flex-1 min-w-[45%] bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center">
                <Droplets size={20} color="#7C8B3A" />
                <Text className="text-gray-600 ml-2">{t('weather.humidity')}</Text>
              </View>
              <Text className="text-gray-900 text-xl font-semibold mt-2">
                {weatherData?.current.humidity ? `${weatherData.current.humidity}%` : '--'}
              </Text>
            </View>

            <View className="flex-1 min-w-[45%] bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center">
                <Wind size={20} color="#7C8B3A" />
                <Text className="text-gray-600 ml-2">{t('weather.wind')}</Text>
              </View>
              <Text className="text-gray-900 text-xl font-semibold mt-2">
                {weatherData?.current.windSpeed ? `${weatherData.current.windSpeed} km/h` : '--'}
              </Text>
            </View>

            <View className="flex-1 min-w-[45%] bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center">
                <Eye size={20} color="#7C8B3A" />
                <Text className="text-gray-600 ml-2">{t('weather.visibility')}</Text>
              </View>
              <Text className="text-gray-900 text-xl font-semibold mt-2">
                {weatherData?.current.visibility ? `${weatherData.current.visibility} km` : '--'}
              </Text>
            </View>

            <View className="flex-1 min-w-[45%] bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center">
                <ThermometerSun size={20} color="#7C8B3A" />
                <Text className="text-gray-600 ml-2">{t('weather.pressure')}</Text>
              </View>
              <Text className="text-gray-900 text-xl font-semibold mt-2">
                {weatherData?.current.pressure ? `${weatherData.current.pressure} hPa` : '--'}
              </Text>
            </View>
          </View>
        </View>

        {/* Hourly Forecast */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">{t('weather.hourlyForecast')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-32">
            <View className="flex-row gap-4">
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
                    className="rounded-xl p-4 items-center shadow-sm w-24"
                    style={{
                      shadowColor: hourBackground.shadowColor,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Text className={`${getTextColorClass(hourBackground)} text-sm`}>
                      {index === 0 ? t('weather.now') : new Date(hour.time * 1000).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        hour12: true
                      })}
                    </Text>
                    <View className="my-2">
                      {getWeatherIconFromCode(hour.icon)}
                    </View>
                    <Text className={`${getTextColorClass(hourBackground)} font-medium`}>{hour.temperature}°</Text>
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
                      className="rounded-xl p-4 items-center shadow-sm w-24"
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
                      <Text className={`${getTextColorClass(defaultBackground)} font-medium`}>--°</Text>
                    </LinearGradient>
                  );
                })
              )}
            </View>
          </ScrollView>
        </View>

        {/* 7-Day Forecast */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">{t('weather.sevenDayForecast')}</Text>
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
        <View className="mt-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">{t('weather.farmAdvisory')}</Text>
          <View className="gap-4">
            {farmAdvisory.map((advice, index) => (
              <View 
                key={index} 
                className={`${advice.color} rounded-xl p-4 flex-row items-center shadow-sm`}
              >
                <View className={`p-3 rounded-full ${advice.color.replace('100', '200')}`}>
                  <advice.icon size={24} color={advice.textColor.replace('text-', '')} />
                </View>
                <View className="ml-4 flex-1">
                  <Text className={`font-semibold ${advice.textColor}`}>{advice.title}</Text>
                  <Text className="text-gray-700 mt-1">{advice.advice}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <FarmerBottomNav activeTab="farms" />
    </View>
  );
}