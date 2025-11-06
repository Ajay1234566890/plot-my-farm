/**
 * MapLibre View Component - OpenStreetMap Integration
 * Shows nearby farmers/buyers with custom markers and 30km radius circle
 */

import { useAuth } from '@/contexts/auth-context';
import { useWeather } from '@/contexts/weather-context';
import { fetchNearbyBuyers, fetchNearbyFarmers, NearbyUser } from '@/services/map-service';
import { RADIUS_PRESETS } from '@/utils/haversine';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { MapPin, RefreshCw, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// MapLibre license (required)
MapLibreGL.setAccessToken(null);

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
  const { user } = useAuth();
  const { locationData, isLoadingLocation } = useWeather();
  
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch nearby users
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

  useEffect(() => {
    if (locationData?.coordinates) {
      fetchNearbyUsersData();
    }
  }, [locationData, showFarmers, showBuyers, radiusInMeters]);

  // Loading state
  if (isLoadingLocation || isLoading) {
    return (
      <View style={[styles.container, styles.centerContent, style]}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading map...</Text>
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

  return (
    <View style={[styles.container, style]}>
      <MapLibreGL.MapView
        style={styles.map}
        styleURL="https://demotiles.maplibre.org/style.json"
        logoEnabled={false}
        attributionEnabled={true}
        attributionPosition={{ bottom: 8, left: 8 }}
      >
        <MapLibreGL.Camera
          zoomLevel={11}
          centerCoordinate={[userCoords.longitude, userCoords.latitude]}
          animationMode="flyTo"
          animationDuration={1000}
        />

        {/* User's current location marker */}
        <MapLibreGL.PointAnnotation
          id="user-location"
          coordinate={[userCoords.longitude, userCoords.latitude]}
        >
          <View style={styles.userMarker}>
            <View style={styles.userMarkerInner} />
          </View>
        </MapLibreGL.PointAnnotation>

        {/* 30km radius circle */}
        <MapLibreGL.ShapeSource
          id="radius-circle"
          shape={{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [userCoords.longitude, userCoords.latitude],
            },
            properties: {},
          }}
        >
          <MapLibreGL.CircleLayer
            id="radius-circle-layer"
            style={{
              circleRadius: {
                stops: [
                  [0, 0],
                  [20, radiusInMeters / 10], // Approximate visual radius
                ],
              },
              circleColor: 'rgba(22, 163, 74, 0.1)',
              circleStrokeWidth: 2,
              circleStrokeColor: 'rgba(22, 163, 74, 0.5)',
            }}
          />
        </MapLibreGL.ShapeSource>

        {/* Nearby users markers */}
        {nearbyUsers.map((nearbyUser) => (
          <MapLibreGL.PointAnnotation
            key={nearbyUser.id}
            id={`user-${nearbyUser.id}`}
            coordinate={[nearbyUser.longitude!, nearbyUser.latitude!]}
            onSelected={() => {
              if (onUserPress) {
                onUserPress(nearbyUser);
              } else {
                Alert.alert(
                  nearbyUser.full_name || 'User',
                  `${nearbyUser.role === 'farmer' ? '🌾 Farmer' : '🛒 Buyer'}\n${nearbyUser.distanceFormatted} away`
                );
              }
            }}
          >
            <View style={[
              styles.marker,
              nearbyUser.role === 'farmer' ? styles.farmerMarker : styles.buyerMarker
            ]}>
              <Text style={styles.markerIcon}>
                {nearbyUser.role === 'farmer' ? '🌾' : '🛒'}
              </Text>
            </View>
          </MapLibreGL.PointAnnotation>
        ))}
      </MapLibreGL.MapView>

      {/* Info overlay */}
      <View style={styles.infoOverlay}>
        <View style={styles.infoCard}>
          <Users size={16} color="#16a34a" />
          <Text style={styles.infoText}>
            {nearbyUsers.length} {nearbyUsers.length === 1 ? 'user' : 'users'} within {radiusInMeters / 1000}km
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchNearbyUsersData}>
          <RefreshCw size={20} color="#16a34a" />
        </TouchableOpacity>
      </View>
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
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

