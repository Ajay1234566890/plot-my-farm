// Weather utility functions for location formatting and dynamic backgrounds
// Provides weather-based styling and location display helpers

import { LocationData } from '@/services/location-service';
import { WeatherData } from '@/services/weather-service';

// Location formatting utilities
export interface FormattedLocation {
  display: string;
  short: string;
  full: string;
}

/**
 * Format location data for display
 * @param locationData - Location data from location service
 * @param weatherData - Weather data (fallback for location name)
 * @returns Formatted location strings
 */
export function formatLocation(
  locationData: LocationData | null,
  weatherData: WeatherData | null
): FormattedLocation {
  // Default fallback
  const fallback = {
    display: 'Loading location...',
    short: 'Loading...',
    full: 'Loading location...'
  };

  // Try weather data location first (usually city name)
  if (weatherData?.location?.name) {
    const weatherLocation = weatherData.location.name;
    return {
      display: weatherLocation,
      short: weatherLocation,
      full: weatherLocation
    };
  }

  // Try location data with proper formatting
  if (locationData?.address) {
    const { city, state, country, formattedAddress } = locationData.address;

    // Prefer "City, State" format
    if (city && state) {
      const display = `${city}, ${state}`;
      return {
        display,
        short: city,
        full: formattedAddress || display
      };
    }

    // Fallback to "City, Country"
    if (city && country) {
      const display = `${city}, ${country}`;
      return {
        display,
        short: city,
        full: formattedAddress || display
      };
    }

    // Use formatted address as last resort
    if (formattedAddress) {
      return {
        display: formattedAddress,
        short: city || formattedAddress.split(',')[0] || 'Unknown',
        full: formattedAddress
      };
    }
  }

  return fallback;
}

// Weather background styling utilities
export interface WeatherBackground {
  gradient: string[];
  textColor: string;
  iconColor: string;
  glassOpacity: number;
  shadowColor: string;
}

/**
 * Get weather-based background styling
 * @param weatherData - Current weather data
 * @param isNight - Whether it's currently night time
 * @returns Background styling configuration
 */
export function getWeatherBackground(
  weatherData: WeatherData | null,
  isNight?: boolean
): WeatherBackground {
  // Default styling (cloudy/overcast)
  const defaultStyle: WeatherBackground = {
    gradient: ['#6B7280', '#9CA3AF'], // Gray gradient
    textColor: '#FFFFFF',
    iconColor: '#F3F4F6',
    glassOpacity: 0.2,
    shadowColor: '#374151'
  };

  if (!weatherData?.current) {
    return defaultStyle;
  }

  const condition = weatherData.current.condition?.toLowerCase() || '';
  const icon = weatherData.current.icon || '';
  
  // Determine if it's night based on icon or time
  const isNightTime = isNight || icon.includes('n') || 
    (weatherData.current.sunset && weatherData.current.sunrise &&
     Date.now() / 1000 > weatherData.current.sunset || 
     Date.now() / 1000 < weatherData.current.sunrise);

  // Rainy/Stormy conditions
  if (condition.includes('rain') || condition.includes('storm') || 
      condition.includes('thunder') || condition.includes('drizzle') ||
      icon.startsWith('09') || icon.startsWith('10') || icon.startsWith('11')) {
    return {
      gradient: isNightTime ? ['#1E3A8A', '#374151'] : ['#1E40AF', '#6B7280'],
      textColor: '#FFFFFF',
      iconColor: '#E5E7EB',
      glassOpacity: 0.25,
      shadowColor: '#1F2937'
    };
  }

  // Sunny/Clear conditions
  if (condition.includes('clear') || condition.includes('sunny') ||
      icon.startsWith('01')) {
    return {
      gradient: isNightTime ? ['#1E1B4B', '#312E81'] : ['#F59E0B', '#EAB308'],
      textColor: isNightTime ? '#FFFFFF' : '#1F2937',
      iconColor: isNightTime ? '#FDE047' : '#FFFFFF',
      glassOpacity: 0.15,
      shadowColor: isNightTime ? '#1E1B4B' : '#D97706'
    };
  }

  // Partly cloudy
  if (condition.includes('partly') || condition.includes('few clouds') ||
      icon.startsWith('02') || icon.startsWith('03')) {
    return {
      gradient: isNightTime ? ['#374151', '#4B5563'] : ['#3B82F6', '#60A5FA'],
      textColor: '#FFFFFF',
      iconColor: '#F3F4F6',
      glassOpacity: 0.2,
      shadowColor: '#374151'
    };
  }

  // Cloudy/Overcast
  if (condition.includes('cloud') || condition.includes('overcast') ||
      icon.startsWith('04')) {
    return {
      gradient: isNightTime ? ['#374151', '#6B7280'] : ['#6B7280', '#9CA3AF'],
      textColor: '#FFFFFF',
      iconColor: '#F3F4F6',
      glassOpacity: 0.2,
      shadowColor: '#374151'
    };
  }

  // Windy conditions
  if (condition.includes('wind') || weatherData.current.windSpeed > 20) {
    return {
      gradient: isNightTime ? ['#1E40AF', '#3730A3'] : ['#0EA5E9', '#38BDF8'],
      textColor: '#FFFFFF',
      iconColor: '#F0F9FF',
      glassOpacity: 0.2,
      shadowColor: '#1E40AF'
    };
  }

  // Foggy/Misty conditions
  if (condition.includes('fog') || condition.includes('mist') || 
      condition.includes('haze') || icon.startsWith('50')) {
    return {
      gradient: isNightTime ? ['#4B5563', '#6B7280'] : ['#9CA3AF', '#D1D5DB'],
      textColor: isNightTime ? '#FFFFFF' : '#1F2937',
      iconColor: isNightTime ? '#F3F4F6' : '#6B7280',
      glassOpacity: 0.3,
      shadowColor: '#6B7280'
    };
  }

  // Snow conditions
  if (condition.includes('snow') || condition.includes('sleet') ||
      icon.startsWith('13')) {
    return {
      gradient: isNightTime ? ['#1E293B', '#475569'] : ['#E2E8F0', '#F1F5F9'],
      textColor: isNightTime ? '#FFFFFF' : '#1E293B',
      iconColor: isNightTime ? '#F8FAFC' : '#64748B',
      glassOpacity: 0.25,
      shadowColor: '#475569'
    };
  }

  return defaultStyle;
}

/**
 * Convert gradient colors to React Native LinearGradient format
 * @param colors - Array of hex color strings
 * @returns Colors formatted for LinearGradient
 */
export function formatGradientColors(colors: string[]): string[] {
  return colors.map(color => color.startsWith('#') ? color : `#${color}`);
}

/**
 * Get text color class for NativeWind based on background
 * @param background - Weather background configuration
 * @returns NativeWind text color class
 */
export function getTextColorClass(background: WeatherBackground): string {
  return background.textColor === '#FFFFFF' ? 'text-white' : 'text-gray-900';
}

/**
 * Get icon color for weather icons
 * @param background - Weather background configuration
 * @returns Icon color string
 */
export function getIconColor(background: WeatherBackground): string {
  return background.iconColor;
}
