// Weather Context - Manages weather and location state across the app
// Provides weather data, location services, and loading states

import LocationPermissionModal, { openDeviceSettings } from '@/components/LocationPermissionModal';
import { LocationData, LocationError, LocationPermissionStatus, locationService } from '@/services/location-service';
import { WeatherData, WeatherError, weatherService } from '@/services/weather-service';
import { supabase } from '@/utils/supabase';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';

// Weather Context Types
export interface WeatherContextType {
  // Weather Data
  weatherData: WeatherData | null;
  isLoadingWeather: boolean;
  weatherError: WeatherError | null;
  
  // Location Data
  locationData: LocationData | null;
  isLoadingLocation: boolean;
  locationError: LocationError | null;
  locationPermission: LocationPermissionStatus;
  
  // Actions
  refreshWeather: () => Promise<void>;
  refreshLocation: () => Promise<void>;
  requestLocationPermission: () => Promise<LocationPermissionStatus>;
  clearErrors: () => void;

  // Permission Modal
  showPermissionModal: boolean;
  setShowPermissionModal: (show: boolean) => void;

  // Utility
  lastUpdated: Date | null;
  isInitialized: boolean;
}

// Create Context
const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Weather Provider Props
interface WeatherProviderProps {
  children: ReactNode;
}

// Weather Provider Component
export function WeatherProvider({ children }: WeatherProviderProps) {
  // State Management
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<WeatherError | null>(null);
  
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<LocationError | null>(null);
  const [locationPermission, setLocationPermission] = useState<LocationPermissionStatus>(LocationPermissionStatus.UNDETERMINED);
  
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const { user } = useAuth();

  // Initialize weather and location on mount
  useEffect(() => {
    initializeWeatherAndLocation();
  }, []);

  // Update user location in database when location changes
  useEffect(() => {
    if (user && locationData) {
      updateUserLocationInDatabase();
    }
  }, [user, locationData]);

  /**
   * Initialize weather and location services
   */
  const initializeWeatherAndLocation = async () => {
    try {
      console.log('🌤️ Initializing weather and location services...');
      
      // Check location permission first
      const permission = await locationService.requestLocationPermission();
      setLocationPermission(permission);
      
      if (permission === LocationPermissionStatus.GRANTED) {
        // Get location and weather data
        await Promise.all([
          refreshLocation(),
          // Weather will be fetched after location is obtained
        ]);
      } else if (permission === LocationPermissionStatus.UNDETERMINED) {
        // Show permission modal for first-time users
        setShowPermissionModal(true);
        // Use default location while waiting for permission
        await fetchWeatherForDefaultLocation();
      } else {
        console.log('⚠️ Location permission not granted, using default location');
        // Use a default location (e.g., major city) for weather
        await fetchWeatherForDefaultLocation();
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ Error initializing weather services:', error);
      setIsInitialized(true);
    }
  };

  /**
   * Refresh location data
   */
  const refreshLocation = async (): Promise<void> => {
    if (isLoadingLocation) return;
    
    setIsLoadingLocation(true);
    setLocationError(null);
    
    try {
      console.log('📍 Fetching current location...');
      const location = await locationService.getCurrentLocation();
      setLocationData(location);

      // Fetch weather for this location
      await fetchWeatherForLocation(location.coordinates.latitude, location.coordinates.longitude, location.address.formattedAddress);

      console.log('✅ Location updated:', location.address.formattedAddress);
    } catch (error) {
      console.error('❌ Error refreshing location:', error);
      setLocationError(error as LocationError);
      
      // Try to get weather for default location as fallback
      await fetchWeatherForDefaultLocation();
    } finally {
      setIsLoadingLocation(false);
    }
  };

  /**
   * Refresh weather data
   */
  const refreshWeather = async (): Promise<void> => {
    if (isLoadingWeather) return;
    
    if (locationData) {
      await fetchWeatherForLocation(
        locationData.coordinates.latitude,
        locationData.coordinates.longitude,
        locationData.address.formattedAddress
      );
    } else {
      await fetchWeatherForDefaultLocation();
    }
  };

  /**
   * Fetch weather for specific location
   */
  const fetchWeatherForLocation = async (lat: number, lon: number, locationName: string): Promise<void> => {
    if (isLoadingWeather) return;
    
    setIsLoadingWeather(true);
    setWeatherError(null);
    
    try {
      console.log(`🌤️ Fetching weather for ${locationName}...`);
      const weather = await weatherService.getCompleteWeatherData(lat, lon, locationName);
      
      // Get UV Index separately
      try {
        const uvIndex = await weatherService.getUVIndex(lat, lon);
        weather.current.uvIndex = uvIndex;
      } catch (uvError) {
        console.log('⚠️ Could not fetch UV index:', uvError);
      }
      
      setWeatherData(weather);
      setLastUpdated(new Date());
      
      // Store weather data in database
      await storeWeatherDataInDatabase(weather);
      
      console.log('✅ Weather data updated for:', locationName);
    } catch (error) {
      console.error('❌ Error fetching weather:', error);
      setWeatherError(error as WeatherError);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  /**
   * Fetch weather for default location (fallback)
   */
  const fetchWeatherForDefaultLocation = async (): Promise<void> => {
    // Use Pune, Maharashtra as default location (major agricultural region in India)
    const defaultLat = 18.5204;
    const defaultLon = 73.8567;
    const defaultLocationName = 'Pune, Maharashtra, India';
    
    await fetchWeatherForLocation(defaultLat, defaultLon, defaultLocationName);
  };

  /**
   * Request location permission
   */
  const requestLocationPermission = async (): Promise<LocationPermissionStatus> => {
    try {
      const permission = await locationService.requestLocationPermission();
      setLocationPermission(permission);
      
      if (permission === LocationPermissionStatus.GRANTED) {
        // Refresh location and weather after permission granted
        await refreshLocation();
      }
      
      return permission;
    } catch (error) {
      console.error('❌ Error requesting location permission:', error);
      setLocationError(error as LocationError);
      return LocationPermissionStatus.DENIED;
    }
  };

  /**
   * Update user location in database
   */
  const updateUserLocationInDatabase = async (): Promise<void> => {
    if (!user || !locationData) return;
    
    try {
      const tableName = user.role === 'farmer' ? 'farmers' : 'buyers';
      
      const { error } = await supabase
        .from(tableName)
        .update({
          latitude: locationData.coordinates.latitude,
          longitude: locationData.coordinates.longitude,
          location: locationData.address.formattedAddress,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Error updating user location in database:', error);
      } else {
        console.log('✅ User location updated in database');
      }
    } catch (error) {
      console.error('❌ Error updating user location:', error);
    }
  };

  /**
   * Store weather data in database for historical tracking
   */
  const storeWeatherDataInDatabase = async (weather: WeatherData): Promise<void> => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('weather_data')
        .insert([{
          user_id: user.id,
          location: weather.location.name,
          latitude: weather.location.lat,
          longitude: weather.location.lon,
          temperature: weather.current.temperature,
          humidity: weather.current.humidity,
          wind_speed: weather.current.windSpeed,
          weather_condition: weather.current.condition,
          weather_description: weather.current.description,
          pressure: weather.current.pressure,
          visibility: weather.current.visibility,
          uv_index: weather.current.uvIndex,
          date: new Date().toISOString().split('T')[0], // Store date only
          created_at: new Date().toISOString(),
        }]);

      if (error) {
        console.error('❌ Error storing weather data:', error);
      } else {
        console.log('✅ Weather data stored in database');
      }
    } catch (error) {
      console.error('❌ Error storing weather data:', error);
    }
  };

  /**
   * Clear all errors
   */
  const clearErrors = (): void => {
    setWeatherError(null);
    setLocationError(null);
  };

  // Context Value
  const contextValue: WeatherContextType = {
    // Weather Data
    weatherData,
    isLoadingWeather,
    weatherError,
    
    // Location Data
    locationData,
    isLoadingLocation,
    locationError,
    locationPermission,
    
    // Actions
    refreshWeather,
    refreshLocation,
    requestLocationPermission,
    clearErrors,

    // Permission Modal
    showPermissionModal,
    setShowPermissionModal,

    // Utility
    lastUpdated,
    isInitialized,
  };

  // Handle permission modal actions
  const handleRequestPermission = async () => {
    const permission = await requestLocationPermission();
    if (permission === LocationPermissionStatus.GRANTED) {
      setShowPermissionModal(false);
      await refreshLocation();
    }
  };

  const handleOpenSettings = () => {
    setShowPermissionModal(false);
    openDeviceSettings();
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
      <LocationPermissionModal
        visible={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        onRequestPermission={handleRequestPermission}
        onOpenSettings={handleOpenSettings}
        permissionDenied={locationPermission === LocationPermissionStatus.DENIED}
      />
    </WeatherContext.Provider>
  );
}

// Custom Hook to use Weather Context
export function useWeather(): WeatherContextType {
  const context = useContext(WeatherContext);
  
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  
  return context;
}

// Export default
export default WeatherProvider;
