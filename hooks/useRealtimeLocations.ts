import { useAuth } from '@/contexts/auth-context';
import {
    formatDistance,
    getDistanceInKm,
    getNearbyUsers,
    MapUser,
    subscribeToUserLocationUpdates,
    unsubscribeFromLocationUpdates,
    UserLocation,
} from '@/services/realtime-map-service';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

/**
 * Hook to get and manage real-time nearby users
 */
export function useRealtimeLocations(currentLocation?: UserLocation) {
    const { user } = useAuth();
    const [nearbyUsers, setNearbyUsers] = useState<MapUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);

    useEffect(() => {
        if (!user?.id || !user?.role) {
            setLoading(false);
            return;
        }

        loadNearbyUsers();
        setupRealtimeSubscription();

        return () => {
            if (subscription) {
                unsubscribeFromLocationUpdates(subscription);
            }
        };
    }, [user?.id, user?.role, currentLocation]);

    const loadNearbyUsers = async () => {
        if (!user?.id || !user?.role) return;

        try {
            setLoading(true);
            const { data, error: fetchError } = await getNearbyUsers(
                user.id,
                user.role as 'farmer' | 'buyer',
                currentLocation
            );

            if (fetchError) {
                setError(fetchError);
            } else if (data) {
                setNearbyUsers(data);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const setupRealtimeSubscription = () => {
        if (!user?.role) return;

        const channel = subscribeToUserLocationUpdates(
            user.role as 'farmer' | 'buyer',
            (updatedUser) => {
                setNearbyUsers((prev) => {
                    const existingIndex = prev.findIndex((u) => u.id === updatedUser.id);

                    // Calculate distance if current location is available
                    if (currentLocation) {
                        updatedUser.distance = getDistanceInKm(
                            currentLocation.latitude,
                            currentLocation.longitude,
                            updatedUser.latitude,
                            updatedUser.longitude
                        );
                    }

                    if (existingIndex >= 0) {
                        // Update existing user
                        const updated = [...prev];
                        updated[existingIndex] = updatedUser;
                        return updated.sort((a, b) => (a.distance || 0) - (b.distance || 0));
                    } else {
                        // Add new user
                        const newList = [...prev, updatedUser];
                        return newList.sort((a, b) => (a.distance || 0) - (b.distance || 0));
                    }
                });
            }
        );

        setSubscription(channel);
    };

    const refresh = () => {
        loadNearbyUsers();
    };

    return {
        nearbyUsers,
        loading,
        error,
        refresh,
    };
}

/**
 * Hook to format user data for map markers
 */
export function useMapMarkers(nearbyUsers: MapUser[], currentLocation?: UserLocation) {
    const [markers, setMarkers] = useState<any[]>([]);

    useEffect(() => {
        const formattedMarkers = nearbyUsers.map((user) => {
            let distance = user.distance;

            // Recalculate distance if not available
            if (!distance && currentLocation) {
                distance = getDistanceInKm(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    user.latitude,
                    user.longitude
                );
            }

            return {
                id: user.id,
                name: user.name,
                role: user.role,
                avatar: user.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg',
                phone: user.phone,
                coordinates: [user.longitude, user.latitude], // MapLibre uses [lng, lat]
                distance: distance ? formatDistance(distance) : undefined,
                distanceKm: distance,
            };
        });

        setMarkers(formattedMarkers);
    }, [nearbyUsers, currentLocation]);

    return markers;
}
