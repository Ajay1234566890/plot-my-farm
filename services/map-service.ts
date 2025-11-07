/**
 * Map Service - Fetch nearby users (farmers/buyers) from Supabase
 * Integrates with location service and haversine filtering
 */

import { addDistanceToLocations, filterByRadius, RADIUS_PRESETS, sortByDistance } from '@/utils/haversine';
import { supabase } from '@/utils/supabase';

export interface MapUser {
  id: string;
  email: string;
  full_name: string | null;
  role: 'farmer' | 'buyer' | 'admin';
  latitude: number | null;
  longitude: number | null;
  location: string | null;
  avatar_url: string | null;
  is_verified: boolean;
}

export interface NearbyUser extends MapUser {
  distance: number;
  distanceFormatted: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

/**
 * Fetch all users with location data from Supabase
 */
export async function fetchAllUsersWithLocation(): Promise<MapUser[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, latitude, longitude, location, avatar_url, is_verified')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (error) {
      console.error('❌ [MAP SERVICE] Error fetching users:', error);
      throw error;
    }

    console.log(`✅ [MAP SERVICE] Fetched ${data?.length || 0} users with location`);
    return data || [];
  } catch (error) {
    console.error('❌ [MAP SERVICE] Failed to fetch users:', error);
    throw error;
  }
}

/**
 * Fetch nearby users within specified radius
 * @param userLocation Current user's location
 * @param radiusInMeters Radius in meters (default: 30km)
 * @param roleFilter Optional role filter ('farmer' | 'buyer')
 */
export async function fetchNearbyUsers(
  userLocation: UserLocation,
  radiusInMeters: number = RADIUS_PRESETS.DEFAULT,
  roleFilter?: 'farmer' | 'buyer'
): Promise<NearbyUser[]> {
  try {
    console.log('🗺️ [MAP SERVICE] Fetching nearby users...', {
      userLocation,
      radiusInMeters,
      roleFilter,
    });

    // Fetch all users with location
    let users = await fetchAllUsersWithLocation();

    // Apply role filter if specified
    if (roleFilter) {
      users = users.filter(user => user.role === roleFilter);
      console.log(`🔍 [MAP SERVICE] Filtered to ${users.length} ${roleFilter}s`);
    }

    // Filter by radius
    const nearbyUsers = filterByRadius(
      userLocation,
      users.map(u => ({ ...u, lat: u.latitude, lng: u.longitude })),
      radiusInMeters
    );

    console.log(`📍 [MAP SERVICE] Found ${nearbyUsers.length} users within ${radiusInMeters / 1000}km`);

    // Add distance information and sort
    const usersWithDistance = addDistanceToLocations(userLocation, nearbyUsers);
    const sortedUsers = sortByDistance(userLocation, usersWithDistance);

    return sortedUsers;
  } catch (error) {
    console.error('❌ [MAP SERVICE] Error fetching nearby users:', error);
    throw error;
  }
}

/**
 * Fetch nearby farmers only
 */
export async function fetchNearbyFarmers(
  userLocation: UserLocation,
  radiusInMeters: number = RADIUS_PRESETS.DEFAULT
): Promise<NearbyUser[]> {
  return fetchNearbyUsers(userLocation, radiusInMeters, 'farmer');
}

/**
 * Fetch nearby buyers only
 */
export async function fetchNearbyBuyers(
  userLocation: UserLocation,
  radiusInMeters: number = RADIUS_PRESETS.DEFAULT
): Promise<NearbyUser[]> {
  return fetchNearbyUsers(userLocation, radiusInMeters, 'buyer');
}

/**
 * Update user's location in Supabase
 */
export async function updateUserLocation(
  userId: string,
  latitude: number,
  longitude: number,
  location?: string
): Promise<void> {
  try {
    const updateData: any = {
      latitude,
      longitude,
      updated_at: new Date().toISOString(),
    };

    if (location) {
      updateData.location = location;
    }

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('❌ [MAP SERVICE] Error updating user location:', error);
      throw error;
    }

    console.log('✅ [MAP SERVICE] User location updated successfully');
  } catch (error) {
    console.error('❌ [MAP SERVICE] Failed to update user location:', error);
    throw error;
  }
}

/**
 * Get user's current location from Supabase
 */
export async function getUserLocationFromDB(userId: string): Promise<UserLocation | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('latitude, longitude')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ [MAP SERVICE] Error fetching user location:', error);
      throw error;
    }

    if (!data?.latitude || !data?.longitude) {
      return null;
    }

    return {
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (error) {
    console.error('❌ [MAP SERVICE] Failed to fetch user location:', error);
    return null;
  }
}

/**
 * Batch update multiple users' locations (admin function)
 */
export async function batchUpdateLocations(
  updates: Array<{ userId: string; latitude: number; longitude: number; location?: string }>
): Promise<void> {
  try {
    const promises = updates.map(update =>
      updateUserLocation(update.userId, update.latitude, update.longitude, update.location)
    );

    await Promise.all(promises);
    console.log(`✅ [MAP SERVICE] Batch updated ${updates.length} user locations`);
  } catch (error) {
    console.error('❌ [MAP SERVICE] Batch update failed:', error);
    throw error;
  }
}

