/**
 * MapLibre View Component - OpenStreetMap Integration
 * Shows user location and 20km radius circle
 */

import { useAuth } from '@/contexts/auth-context';
import { useWeather } from '@/contexts/weather-context';
import { fetchNearbyBuyers, fetchNearbyFarmers, NearbyUser } from '@/services/map-service';
import { RADIUS_PRESETS } from '@/utils/haversine';
import { MapPin, RefreshCw, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Conditional MapLibre import - only for native platforms
// Import as named exports (v10+ pattern)
let MapView: any = null;
let Camera: any = null;
let UserLocation: any = null;
let isMapLibreAvailable = false;

if (Platform.OS !== 'web') {
  try {
    console.log('🔍 [MapLibre] Attempting to load MapLibre module...');

    // Import MapLibre components as named exports (v10+ structure)
    const MapLibreRN = require('@maplibre/maplibre-react-native');

    console.log('🔍 [MapLibre] Module loaded, checking exports...');
    console.log('🔍 [MapLibre] Available exports:', Object.keys(MapLibreRN).slice(0, 10).join(', '));

    MapView = MapLibreRN.MapView;
    Camera = MapLibreRN.Camera;
    UserLocation = MapLibreRN.UserLocation;

    console.log('🔍 [MapLibre] Component check:');
    console.log('  - MapView:', typeof MapView, MapView ? '✅' : '❌');
    console.log('  - Camera:', typeof Camera, Camera ? '✅' : '❌');
    console.log('  - UserLocation:', typeof UserLocation, UserLocation ? '✅' : '❌');

    // Verify the module has the required components
    if (MapView && Camera && UserLocation) {
      isMapLibreAvailable = true;
      console.log('✅ [MapLibre] All components loaded successfully!');
    } else {
      console.error('❌ [MapLibre] Module incomplete - missing required components');
      console.error('   MapView:', MapView ? 'OK' : 'MISSING');
      console.error('   Camera:', Camera ? 'OK' : 'MISSING');
      console.error('   UserLocation:', UserLocation ? 'OK' : 'MISSING');
      isMapLibreAvailable = false;
    }
  } catch (error: any) {
    console.error('❌ [MapLibre] Failed to load:', error);
    console.error('   Error name:', error?.name);
    console.error('   Error message:', error?.message);
    console.error('   Error stack:', error?.stack?.split('\n').slice(0, 3).join('\n'));
    isMapLibreAvailable = false;
  }
} else {
  console.log('ℹ️ [MapLibre] Web platform detected - MapLibre not available');
}



interface MapLibreViewProps {
  showFarmers?: boolean;
  showBuyers?: boolean;
  radiusInMeters?: number;
  onUserPress?: (user: NearbyUser) => void;
  style?: any;
}

export default function MapLibreView({
  showFarmers = true,
  showBuyers = true,
  radiusInMeters = RADIUS_PRESETS.DEFAULT,
  onUserPress,
  style,
}: MapLibreViewProps) {
  // ⚠️ IMPORTANT: All hooks MUST be called before any conditional returns
  // This is a React rule - hooks must be called in the same order every render
  const { user } = useAuth();
  const { locationData, isLoadingLocation } = useWeather();

  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch nearby users function
  const fetchNearbyUsersData = async () => {
    if (!locationData?.coordinates) {
      setError('Location not available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const userLocation = {
        latitude: locationData.coordinates.latitude,
        longitude: locationData.coordinates.longitude,
      };

      let allNearbyUsers: NearbyUser[] = [];

      // Fetch farmers if enabled
      if (showFarmers) {
        const farmers = await fetchNearbyFarmers(userLocation, radiusInMeters);
        allNearbyUsers = [...allNearbyUsers, ...farmers];
      }

      // Fetch buyers if enabled
      if (showBuyers) {
        const buyers = await fetchNearbyBuyers(userLocation, radiusInMeters);
        allNearbyUsers = [...allNearbyUsers, ...buyers];
      }

      // Filter out current user
      const filteredUsers = allNearbyUsers.filter(u => u.id !== user?.id);

      setNearbyUsers(filteredUsers);
      console.log(`✅ [MAP] Loaded ${filteredUsers.length} nearby users`);
    } catch (err: any) {
      console.error('❌ [MAP] Error fetching nearby users:', err);
      setError(err.message || 'Failed to load nearby users');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch nearby users when location changes
  useEffect(() => {
    console.log('🔄 [MAP] Location data changed:', {
      hasLocation: !!locationData?.coordinates,
      isLoadingLocation,
      latitude: locationData?.coordinates?.latitude,
      longitude: locationData?.coordinates?.longitude,
    });

    if (locationData?.coordinates) {
      console.log('✅ [MAP] Location available, fetching nearby users...');
      fetchNearbyUsersData();
    } else if (!isLoadingLocation) {
      console.log('⚠️ [MAP] Location not available and not loading');
      setIsLoading(false);
      setError('Location not available. Please enable location services.');
    }
  }, [locationData, showFarmers, showBuyers, radiusInMeters]);

  // NOW we can do conditional returns AFTER all hooks are called
  // Web fallback - MapLibre is not available on web or native module not loaded
  if (Platform.OS === 'web' || !isMapLibreAvailable) {
    console.log('ℹ️ [MapLibre] Showing fallback UI');
    console.log('   Platform:', Platform.OS);
    console.log('   isMapLibreAvailable:', isMapLibreAvailable);

    const fallbackMessage = Platform.OS === 'web'
      ? 'Interactive maps are available on mobile devices.'
      : 'Map feature is temporarily unavailable. You can still view nearby users below.';

    return (
      <View style={[styles.container, style]}>
        <View style={styles.webFallback}>
          <MapPin size={48} color="#3B82F6" />
          <Text style={styles.webFallbackTitle}>Map View</Text>
          <Text style={styles.webFallbackText}>
            {fallbackMessage}
          </Text>
          {Platform.OS === 'web' && (
            <Text style={styles.webFallbackSubtext}>
              Install the app on Android/iOS to view nearby farmers and buyers on the map.
            </Text>
          )}

          {/* Show nearby users list instead */}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => fetchNearbyUsersData()}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <RefreshCw size={16} color="#FFFFFF" />
            )}
            <Text style={styles.refreshButtonText}>
              {isLoading ? 'Loading...' : 'Load Nearby Users'}
            </Text>
          </TouchableOpacity>

          {nearbyUsers.length > 0 && (
            <View style={styles.usersList}>
              <Text style={styles.usersListTitle}>
                <Users size={16} color="#374151" /> {nearbyUsers.length} nearby users
              </Text>
              {nearbyUsers.slice(0, 5).map((nearbyUser, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.userItem}
                  onPress={() => onUserPress?.(nearbyUser)}
                >
                  <Text style={styles.userName}>{nearbyUser.full_name || 'User'}</Text>
                  <Text style={styles.userDistance}>{nearbyUser.distance.toFixed(1)}km away</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }

  // Loading state - only show if location is loading AND we don't have coordinates yet
  if (isLoadingLocation && !locationData?.coordinates) {
    console.log('⏳ [MAP] Waiting for location...');
    return (
      <View style={[styles.container, styles.centerContent, style]}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  // Error state
  if (error || !locationData?.coordinates) {
    return (
      <View style={[styles.container, styles.centerContent, style]}>
        <MapPin size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error || 'Location not available'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchNearbyUsersData}>
          <RefreshCw size={20} color="white" />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const userCoords = locationData.coordinates;

  // Additional safety check - if MapLibre is not available, show fallback
  if (!isMapLibreAvailable || !MapView || !Camera) {
    console.warn('⚠️ [MapLibre] Components not available for rendering');
    console.warn('   isMapLibreAvailable:', isMapLibreAvailable);
    console.warn('   MapView:', !!MapView);
    console.warn('   Camera:', !!Camera);
    console.warn('   UserLocation:', !!UserLocation);

    return (
      <View style={[styles.container, styles.centerContent, style]}>
        <MapPin size={48} color="#3B82F6" />
        <Text style={styles.errorText}>Map feature is temporarily unavailable</Text>
        <Text style={styles.webFallbackSubtext}>
          {nearbyUsers.length} nearby users found within {(radiusInMeters / 1000).toFixed(0)}km
        </Text>
        {nearbyUsers.length > 0 && (
          <View style={styles.usersList}>
            {nearbyUsers.slice(0, 5).map((nearbyUser, index) => (
              <TouchableOpacity
                key={index}
                style={styles.userItem}
                onPress={() => onUserPress?.(nearbyUser)}
              >
                <Text style={styles.userName}>{nearbyUser.full_name || 'User'}</Text>
                <Text style={styles.userDistance}>{nearbyUser.distance.toFixed(1)}km away</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  // Simplified map view - just user location and 20km radius
  console.log('✅ [MapLibre] Rendering map view');
  console.log('   User coordinates:', userCoords);
  console.log('   Nearby users:', nearbyUsers.length);
  console.log('   Radius:', (radiusInMeters / 1000).toFixed(0), 'km');

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        styleURL={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_API_KEY}`}
        logoEnabled={false}
        attributionEnabled={true}
        attributionPosition={{ bottom: 8, left: 8 }}
        onDidFinishLoadingMap={() => {
          console.log('✅ [MapLibre] Map loaded successfully');
          setIsLoading(false);
        }}
        onDidFailLoadingMap={(error: any) => {
          console.error('❌ [MapLibre] Map failed to load:', error);
          setError('Failed to load map');
          setIsLoading(false);
        }}
      >
        <Camera
          zoomLevel={11}
          centerCoordinate={[userCoords.longitude, userCoords.latitude]}
        />

        {/* User's current location with native component */}
        <UserLocation
          visible={true}
          renderMode="native"
          androidRenderMode="compass"
        />
      </MapView>

      {/* Loading overlay - shown while fetching nearby users */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#16a34a" />
          <Text style={styles.loadingOverlayText}>Loading nearby users...</Text>
        </View>
      )}

      {/* Info overlay */}
      <View style={styles.infoOverlay}>
        <View style={styles.infoCard}>
          <MapPin size={16} color="#16a34a" />
          <Text style={styles.infoText}>
            Your location • {(radiusInMeters / 1000).toFixed(0)}km radius
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchNearbyUsersData}>
          <RefreshCw size={20} color="#16a34a" />
        </TouchableOpacity>
      </View>

      {/* Nearby users list below map */}
      {nearbyUsers.length > 0 && (
        <View style={styles.nearbyUsersList}>
          <Text style={styles.nearbyUsersTitle}>
            <Users size={16} color="#374151" /> {nearbyUsers.length} nearby users
          </Text>
          {nearbyUsers.slice(0, 3).map((nearbyUser, index) => (
            <TouchableOpacity
              key={index}
              style={styles.userItem}
              onPress={() => onUserPress?.(nearbyUser)}
            >
              <Text style={styles.userName}>
                {nearbyUser.role === 'farmer' ? '🌾' : '🛒'} {nearbyUser.full_name || 'User'}
              </Text>
              <Text style={styles.userDistance}>{nearbyUser.distance.toFixed(1)}km away</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  map: {
    flex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  userMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  farmerMarker: {
    backgroundColor: '#16a34a',
  },
  buyerMarker: {
    backgroundColor: '#B27E4C',
  },
  markerIcon: {
    fontSize: 18,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  loadingOverlayText: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
  infoOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  refreshButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
  },
  webFallbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  webFallbackText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  webFallbackSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  usersList: {
    width: '100%',
    maxWidth: 400,
    marginTop: 24,
  },
  usersListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userDistance: {
    fontSize: 14,
    color: '#6B7280',
  },
  nearbyUsersList: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: 200,
  },
  nearbyUsersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

