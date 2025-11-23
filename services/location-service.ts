// Location Service - GPS and Geocoding Integration
// Handles location permissions, GPS fetching, and reverse geocoding

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { geocodingService } from './geocoding-service';

// Location Data Types
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface LocationAddress {
  street?: string;
  city?: string;
  region?: string; // State/Province
  country?: string;
  postalCode?: string;
  name?: string; // Place name
  formattedAddress: string;
}

export interface LocationData {
  coordinates: LocationCoordinates;
  address: LocationAddress;
  timestamp: number;
}

export interface LocationError {
  code: string;
  message: string;
  details?: any;
}

export enum LocationPermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  UNDETERMINED = 'undetermined',
}

// Location Service Class
class LocationService {
  private static instance: LocationService;
  private lastKnownLocation: LocationData | null = null;
  private locationWatchId: Location.LocationSubscription | null = null;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly LOCATION_CACHE_KEY = 'last_known_location';

  /**
   * Request location permissions
   */
  async requestLocationPermission(): Promise<LocationPermissionStatus> {
    try {
      // Check current permission status
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        return LocationPermissionStatus.GRANTED;
      }

      // Request permission if not granted
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      switch (status) {
        case 'granted':
          return LocationPermissionStatus.GRANTED;
        case 'denied':
          return LocationPermissionStatus.DENIED;
        default:
          return LocationPermissionStatus.UNDETERMINED;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      throw this.createLocationError('PERMISSION_REQUEST_FAILED', 'Failed to request location permission', error);
    }
  }

  /**
   * Check if location services are enabled
   */
  async isLocationEnabled(): Promise<boolean> {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  }

  /**
   * Analyze location accuracy and detect potential issues
   */
  private analyzeLocationAccuracy(coordinates: LocationCoordinates, accuracyMeters: number) {
    const { latitude, longitude } = coordinates;

    // Known reference points for validation
    const referencePoints = {
      tuni: { lat: 17.3591, lon: 82.5461, name: 'Tuni, Andhra Pradesh' },
      hyderabad: { lat: 17.3850, lon: 78.4867, name: 'Hyderabad, Telangana' },
      india: { latMin: 8.0, latMax: 37.0, lonMin: 68.0, lonMax: 97.0 }
    };

    // Calculate distances to reference points
    const distanceToTuni = this.calculateDistance(latitude, longitude, referencePoints.tuni.lat, referencePoints.tuni.lon);
    const distanceToHyderabad = this.calculateDistance(latitude, longitude, referencePoints.hyderabad.lat, referencePoints.hyderabad.lon);

    // Determine likely location source based on accuracy
    let locationSource = 'Unknown';
    let reliability = 'Unknown';

    if (accuracyMeters <= 10) {
      locationSource = 'GPS';
      reliability = 'High';
    } else if (accuracyMeters <= 100) {
      locationSource = 'GPS/WiFi';
      reliability = 'Medium';
    } else if (accuracyMeters <= 1000) {
      locationSource = 'WiFi/Cell';
      reliability = 'Low';
    } else {
      locationSource = 'IP/Network';
      reliability = 'Very Low';
    }

    // Check if coordinates are within India
    const isInIndia = latitude >= referencePoints.india.latMin &&
                     latitude <= referencePoints.india.latMax &&
                     longitude >= referencePoints.india.lonMin &&
                     longitude <= referencePoints.india.lonMax;

    // Determine closest known location
    const closestLocation = distanceToTuni < distanceToHyderabad ?
      { name: referencePoints.tuni.name, distance: distanceToTuni } :
      { name: referencePoints.hyderabad.name, distance: distanceToHyderabad };

    return {
      coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      accuracy: `${accuracyMeters}m`,
      locationSource,
      reliability,
      isInIndia,
      closestKnownLocation: closestLocation,
      distanceToTuni: `${distanceToTuni.toFixed(1)}km`,
      distanceToHyderabad: `${distanceToHyderabad.toFixed(1)}km`,
      warning: accuracyMeters > 1000 ? 'Low accuracy - may be using IP/network location instead of GPS' : null
    };
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Web-optimized location fetching using browser's native geolocation API
   * with enableHighAccuracy for better GPS precision
   */
  private async getWebLocation(): Promise<Location.LocationObject> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      console.log('🌐 [WEB GPS] Using browser geolocation API with high accuracy...');

      const options: PositionOptions = {
        enableHighAccuracy: true, // Request GPS instead of network/IP location
        timeout: 60000, // 60 seconds timeout
        maximumAge: 0, // Don't use cached location
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('🌐 [WEB GPS] Browser geolocation success:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            source: position.coords.accuracy && position.coords.accuracy < 100 ? 'GPS' : 'Network/IP'
          });

          // Convert browser GeolocationPosition to Expo LocationObject format
          const locationObject: Location.LocationObject = {
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed,
            },
            timestamp: position.timestamp,
          };

          resolve(locationObject);
        },
        (error) => {
          console.error('🌐 [WEB GPS] Browser geolocation error:', error.message);
          console.log('🌐 [WEB GPS] Error code:', error.code, '- PERMISSION_DENIED=1, POSITION_UNAVAILABLE=2, TIMEOUT=3');
          reject(new Error(`Web geolocation failed: ${error.message}`));
        },
        options
      );
    });
  }

  /**
   * Get current location with maximum accuracy
   * Uses web-optimized GPS on browsers, native GPS on mobile
   */
  async getCurrentLocation(useCache: boolean = false): Promise<LocationData> {
    try {
      // Check cache first if requested
      if (useCache) {
        const cached = await this.getCachedLocation();
        if (cached) {
          this.lastKnownLocation = cached;
          return cached;
        }
      }

      // Check permissions
      const permissionStatus = await this.requestLocationPermission();
      if (permissionStatus !== LocationPermissionStatus.GRANTED) {
        throw this.createLocationError('PERMISSION_DENIED', 'Location permission not granted');
      }

      // Check if location services are enabled
      const isEnabled = await this.isLocationEnabled();
      if (!isEnabled) {
        throw this.createLocationError('LOCATION_DISABLED', 'Location services are disabled');
      }

      // Use platform-specific location fetching
      console.log('🎯 [GPS] Requesting high-precision GPS location...');
      console.log('🎯 [GPS] Platform:', Platform.OS);
      const startTime = Date.now();

      let location: Location.LocationObject;

      if (Platform.OS === 'web') {
        // Use web-optimized GPS with browser geolocation API
        location = await this.getWebLocation();
      } else {
        // Use native GPS for mobile devices
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation, // Highest possible accuracy
          timeInterval: 60000, // 60 seconds timeout for better GPS fix
          distanceInterval: 0, // No distance filtering
        });
      }

      const gpsTime = Date.now() - startTime;
      console.log(`🎯 [GPS] Location acquired in ${gpsTime}ms`);
      console.log('🎯 [GPS] Raw location data:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude,
        heading: location.coords.heading,
        speed: location.coords.speed,
        timestamp: location.timestamp
      });

      const coordinates: LocationCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || undefined,
        altitude: location.coords.altitude || undefined,
        heading: location.coords.heading || undefined,
        speed: location.coords.speed || undefined,
      };

      // Log GPS accuracy information
      const accuracyMeters = location.coords.accuracy || 0;
      let accuracyDescription = 'Unknown';
      if (accuracyMeters <= 5) accuracyDescription = 'Excellent (≤5m)';
      else if (accuracyMeters <= 10) accuracyDescription = 'Very Good (≤10m)';
      else if (accuracyMeters <= 20) accuracyDescription = 'Good (≤20m)';
      else if (accuracyMeters <= 50) accuracyDescription = 'Fair (≤50m)';
      else if (accuracyMeters <= 100) accuracyDescription = 'Poor (≤100m)';
      else accuracyDescription = 'Very Poor (>100m)';

      console.log(`🎯 [GPS] Accuracy: ${accuracyMeters}m (${accuracyDescription})`);
      console.log(`🎯 [GPS] Coordinates: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`);

      // Validate coordinates and detect location source
      const locationAnalysis = this.analyzeLocationAccuracy(coordinates, accuracyMeters);
      console.log('🔍 [GPS] Location Analysis:', locationAnalysis);

      // Get address from coordinates
      const address = await this.reverseGeocode(coordinates.latitude, coordinates.longitude);

      const locationData: LocationData = {
        coordinates,
        address,
        timestamp: Date.now(),
      };

      // Cache the location
      await this.cacheLocation(locationData);
      this.lastKnownLocation = locationData;

      return locationData;
    } catch (error) {
      console.error('Error getting current location:', error);
      
      // Try to return cached location as fallback
      const cached = await this.getCachedLocation();
      if (cached) {
        console.log('Returning cached location as fallback');
        return cached;
      }

      throw this.createLocationError('LOCATION_FETCH_FAILED', 'Failed to get current location', error);
    }
  }

  /**
   * Reverse geocoding - convert coordinates to address using web-compatible service
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<LocationAddress> {
    console.log('🔍 [REVERSE GEOCODE] Starting reverse geocoding for:', { latitude, longitude });

    try {
      // Use our new geocoding service instead of deprecated Expo API
      const geocodingResult = await geocodingService.reverseGeocode(latitude, longitude);

      // Convert GeocodingAddress to LocationAddress format
      const result: LocationAddress = {
        street: geocodingResult.street,
        city: geocodingResult.city,
        region: geocodingResult.region,
        country: geocodingResult.country,
        postalCode: geocodingResult.postalCode,
        name: geocodingResult.name,
        formattedAddress: geocodingResult.formattedAddress,
      };

      console.log('✅ [REVERSE GEOCODE] Final result:', result);
      return result;
    } catch (error) {
      console.error('❌ [REVERSE GEOCODE] Error in reverse geocoding:', error);

      // Return a more user-friendly fallback instead of coordinates
      const fallback: LocationAddress = {
        formattedAddress: 'Location unavailable',
        city: 'Unknown Location',
        country: 'Unknown',
      };

      console.log('🔄 [REVERSE GEOCODE] Using fallback:', fallback);
      return fallback;
    }
  }

  /**
   * Forward geocoding - convert address to coordinates
   */
  async geocodeAddress(address: string): Promise<LocationCoordinates[]> {
    try {
      const locations = await Location.geocodeAsync(address);
      
      return locations.map(location => ({
        latitude: location.latitude,
        longitude: location.longitude,
      }));
    } catch (error) {
      console.error('Error in geocoding:', error);
      throw this.createLocationError('GEOCODING_FAILED', 'Failed to geocode address', error);
    }
  }

  /**
   * Start watching location changes
   */
  async startLocationWatch(callback: (location: LocationData) => void): Promise<void> {
    try {
      // Check permissions first
      const permissionStatus = await this.requestLocationPermission();
      if (permissionStatus !== LocationPermissionStatus.GRANTED) {
        throw this.createLocationError('PERMISSION_DENIED', 'Location permission not granted');
      }

      // Stop existing watch if any
      await this.stopLocationWatch();

      // Start watching location with high accuracy
      this.locationWatchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High, // High accuracy for continuous tracking
          timeInterval: 30000, // Update every 30 seconds
          distanceInterval: 50, // Update every 50 meters (more sensitive)
        },
        async (location) => {
          try {
            const coordinates: LocationCoordinates = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy || undefined,
              altitude: location.coords.altitude || undefined,
              heading: location.coords.heading || undefined,
              speed: location.coords.speed || undefined,
            };

            const address = await this.reverseGeocode(coordinates.latitude, coordinates.longitude);

            const locationData: LocationData = {
              coordinates,
              address,
              timestamp: Date.now(),
            };

            this.lastKnownLocation = locationData;
            await this.cacheLocation(locationData);
            callback(locationData);
          } catch (error) {
            console.error('Error processing location update:', error);
          }
        }
      );
    } catch (error) {
      console.error('Error starting location watch:', error);
      throw this.createLocationError('WATCH_START_FAILED', 'Failed to start location watching', error);
    }
  }

  /**
   * Stop watching location changes
   */
  async stopLocationWatch(): Promise<void> {
    if (this.locationWatchId) {
      this.locationWatchId.remove();
      this.locationWatchId = null;
    }
  }

  /**
   * Get last known location
   */
  getLastKnownLocation(): LocationData | null {
    return this.lastKnownLocation;
  }

  /**
   * Cache management
   */
  private async cacheLocation(location: LocationData): Promise<void> {
    try {
      await AsyncStorage.setItem(this.LOCATION_CACHE_KEY, JSON.stringify(location));
    } catch (error) {
      console.error('Error caching location:', error);
    }
  }

  private async getCachedLocation(): Promise<LocationData | null> {
    try {
      const cached = await AsyncStorage.getItem(this.LOCATION_CACHE_KEY);
      if (cached) {
        const location: LocationData = JSON.parse(cached);
        
        // Check if cache is still valid
        if (Date.now() - location.timestamp < this.CACHE_DURATION) {
          return location;
        }
        
        // Remove expired cache
        await AsyncStorage.removeItem(this.LOCATION_CACHE_KEY);
      }
    } catch (error) {
      console.error('Error reading cached location:', error);
    }
    return null;
  }

  /**
   * Clear location cache
   */
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.LOCATION_CACHE_KEY);
      this.lastKnownLocation = null;
    } catch (error) {
      console.error('Error clearing location cache:', error);
    }
  }



  /**
   * Utility methods
   */
  private createLocationError(code: string, message: string, details?: any): LocationError {
    return {
      code,
      message,
      details,
    };
  }

  /**
   * Format coordinates for display
   */
  formatCoordinates(lat: number, lon: number): string {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
  }

  /**
   * Check if coordinates are valid
   */
  isValidCoordinates(lat: number, lon: number): boolean {
    return (
      typeof lat === 'number' &&
      typeof lon === 'number' &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180 &&
      !isNaN(lat) &&
      !isNaN(lon)
    );
  }
}

// Export singleton instance
export const locationService = LocationService.getInstance();
export { LocationService };
export default locationService;
