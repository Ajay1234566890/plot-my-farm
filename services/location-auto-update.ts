/**
 * Location Auto-Update Service
 * Automatically updates user location in Supabase when app starts or location changes
 */

import * as Location from 'expo-location';
import { updateUserLocation } from './map-service';
import { LocationService } from './location-service';

let locationWatchSubscription: Location.LocationSubscription | null = null;
let isWatching = false;

/**
 * Start watching user location and auto-update in Supabase
 * @param userId User ID to update location for
 * @param intervalMinutes How often to update (default: 5 minutes)
 */
export async function startLocationAutoUpdate(
  userId: string,
  intervalMinutes: number = 5
): Promise<void> {
  if (isWatching) {
    console.log('⚠️ [LOCATION AUTO-UPDATE] Already watching location');
    return;
  }

  try {
    // Request permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('❌ [LOCATION AUTO-UPDATE] Permission denied');
      return;
    }

    console.log('✅ [LOCATION AUTO-UPDATE] Starting location watch...');

    // Get initial location and update immediately
    await updateLocationNow(userId);

    // Watch location changes
    locationWatchSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: intervalMinutes * 60 * 1000, // Convert minutes to milliseconds
        distanceInterval: 100, // Update if moved 100 meters
      },
      async (location) => {
        console.log('📍 [LOCATION AUTO-UPDATE] Location changed:', {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });

        await updateLocationInSupabase(
          userId,
          location.coords.latitude,
          location.coords.longitude
        );
      }
    );

    isWatching = true;
    console.log('✅ [LOCATION AUTO-UPDATE] Location watch started');
  } catch (error) {
    console.error('❌ [LOCATION AUTO-UPDATE] Failed to start:', error);
    throw error;
  }
}

/**
 * Stop watching location updates
 */
export async function stopLocationAutoUpdate(): Promise<void> {
  if (locationWatchSubscription) {
    locationWatchSubscription.remove();
    locationWatchSubscription = null;
    isWatching = false;
    console.log('✅ [LOCATION AUTO-UPDATE] Location watch stopped');
  }
}

/**
 * Update location immediately (one-time)
 */
export async function updateLocationNow(userId: string): Promise<void> {
  try {
    console.log('📍 [LOCATION AUTO-UPDATE] Getting current location...');

    const locationService = LocationService.getInstance();
    const location = await locationService.getCurrentLocation();

    if (!location) {
      console.error('❌ [LOCATION AUTO-UPDATE] Failed to get location');
      return;
    }

    const { latitude, longitude } = location.coords;

    // Get address using reverse geocoding
    let address: string | undefined;
    try {
      const geocoded = await locationService.reverseGeocode(latitude, longitude);
      address = geocoded.display;
    } catch (error) {
      console.warn('⚠️ [LOCATION AUTO-UPDATE] Failed to geocode:', error);
    }

    await updateLocationInSupabase(userId, latitude, longitude, address);
  } catch (error) {
    console.error('❌ [LOCATION AUTO-UPDATE] Failed to update location:', error);
    throw error;
  }
}

/**
 * Internal function to update location in Supabase
 */
async function updateLocationInSupabase(
  userId: string,
  latitude: number,
  longitude: number,
  location?: string
): Promise<void> {
  try {
    await updateUserLocation(userId, latitude, longitude, location);
    console.log('✅ [LOCATION AUTO-UPDATE] Location updated in Supabase:', {
      userId,
      latitude,
      longitude,
      location,
    });
  } catch (error) {
    console.error('❌ [LOCATION AUTO-UPDATE] Failed to update in Supabase:', error);
  }
}

/**
 * Check if location auto-update is running
 */
export function isLocationAutoUpdateRunning(): boolean {
  return isWatching;
}

