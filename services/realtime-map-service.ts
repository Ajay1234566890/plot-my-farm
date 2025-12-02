import { supabase } from '@/utils/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

// =====================================================
// TYPES
// =====================================================

export interface MapUser {
    id: string;
    name: string;
    role: 'farmer' | 'buyer';
    avatar_url?: string;
    phone?: string;
    latitude: number;
    longitude: number;
    distance?: number;
    location_updated_at?: string;
}

export interface UserLocation {
    latitude: number;
    longitude: number;
}

// =====================================================
// HAVERSINE DISTANCE CALCULATION
// =====================================================

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function getDistanceInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
    if (km < 1) {
        return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
}

// =====================================================
// LOCATION SERVICES
// =====================================================

/**
 * Get all nearby users based on role
 */
export async function getNearbyUsers(
    currentUserId: string,
    currentUserRole: 'farmer' | 'buyer',
    currentLocation?: UserLocation
): Promise<{ data: MapUser[] | null; error: any }> {
    try {
        // Get opposite role users
        const targetRole = currentUserRole === 'farmer' ? 'buyer' : 'farmer';

        const { data, error } = await supabase
            .from('users')
            .select('id, name, role, avatar, phone, latitude, longitude, location_updated_at')
            .eq('role', targetRole)
            .not('latitude', 'is', null)
            .not('longitude', 'is', null)
            .neq('id', currentUserId);

        if (error) {
            return { data: null, error };
        }

        // Calculate distances if current location is provided
        const usersWithDistance = (data || []).map((user: any) => {
            const mapUser: MapUser = {
                id: user.id,
                name: user.name,
                role: user.role,
                avatar_url: user.avatar,
                phone: user.phone,
                latitude: user.latitude,
                longitude: user.longitude,
                location_updated_at: user.location_updated_at,
            };

            if (currentLocation) {
                mapUser.distance = getDistanceInKm(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    user.latitude,
                    user.longitude
                );
            }

            return mapUser;
        });

        // Sort by distance if available
        if (currentLocation) {
            usersWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        }

        return { data: usersWithDistance, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Update user's location
 */
export async function updateUserLocation(
    userId: string,
    latitude: number,
    longitude: number
): Promise<{ error: any }> {
    try {
        const { error } = await supabase
            .from('users')
            .update({
                latitude,
                longitude,
                location_updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

        if (error) {
            return { error };
        }

        return { error: null };
    } catch (error) {
        return { error };
    }
}

/**
 * Subscribe to real-time location updates
 */
export function subscribeToUserLocationUpdates(
    currentUserRole: 'farmer' | 'buyer',
    callback: (user: MapUser) => void
): RealtimeChannel {
    const targetRole = currentUserRole === 'farmer' ? 'buyer' : 'farmer';

    const channel = supabase
        .channel('users-location')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'users',
                filter: `role=eq.${targetRole}`,
            },
            (payload) => {
                if (payload.new && payload.new.latitude && payload.new.longitude) {
                    const user: MapUser = {
                        id: payload.new.id,
                        name: payload.new.name,
                        role: payload.new.role,
                        avatar_url: payload.new.avatar,
                        phone: payload.new.phone,
                        latitude: payload.new.latitude,
                        longitude: payload.new.longitude,
                        location_updated_at: payload.new.location_updated_at,
                    };
                    callback(user);
                }
            }
        )
        .subscribe();

    return channel;
}

/**
 * Unsubscribe from location updates
 */
export function unsubscribeFromLocationUpdates(channel: RealtimeChannel): void {
    supabase.removeChannel(channel);
}

/**
 * Get user's current location from users table
 */
export async function getUserLocation(
    userId: string
): Promise<{ data: UserLocation | null; error: any }> {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('latitude, longitude')
            .eq('id', userId)
            .single();

        if (error) {
            return { data: null, error };
        }

        if (!data.latitude || !data.longitude) {
            return { data: null, error: new Error('Location not set') };
        }

        return {
            data: {
                latitude: data.latitude,
                longitude: data.longitude,
            },
            error: null,
        };
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Get nearby users within radius
 */
export async function getNearbyUsersWithinRadius(
    currentUserId: string,
    currentUserRole: 'farmer' | 'buyer',
    currentLocation: UserLocation,
    radiusKm: number
): Promise<{ data: MapUser[] | null; error: any }> {
    const { data: allUsers, error } = await getNearbyUsers(
        currentUserId,
        currentUserRole,
        currentLocation
    );

    if (error || !allUsers) {
        return { data: null, error };
    }

    const usersWithinRadius = allUsers.filter(
        (user) => user.distance !== undefined && user.distance <= radiusKm
    );

    return { data: usersWithinRadius, error: null };
}
