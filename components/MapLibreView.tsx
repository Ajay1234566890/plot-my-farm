/**
 * 🗺️ Real-Time MapLibre View Component
 * MapTiler + Supabase + Real-time location updates
 * Shows nearby farmers/buyers with custom markers
 */

import { useAuth } from '@/contexts/auth-context';
import { useMapMarkers, useRealtimeLocations } from '@/hooks/useRealtimeLocations';
import { getUserLocation } from '@/services/realtime-map-service';
import MapLibreGL from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// MapLibre configuration
MapLibreGL.setAccessToken(null);
MapLibreGL.setConnected(true);

const MAPTILER_API_KEY = 'S1newPOTVEpCrOQg9RYx';
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`;

// Default location (India center)
const DEFAULT_COORDS: [number, number] = [78.9629, 20.5937];

interface MapLibreViewProps {
  showFarmers?: boolean;
  showBuyers?: boolean;
  radiusInMeters?: number;
  onUserPress?: (user: any) => void;
}

export default function MapLibreView(props: MapLibreViewProps) {
  const { user } = useAuth();
  const [coords, setCoords] = useState<[number, number]>(DEFAULT_COORDS);
  const [isReady, setIsReady] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | undefined>();
  const mapRef = useRef<MapLibreGL.MapView>(null);

  // Get real-time nearby users
  const { nearbyUsers, loading } = useRealtimeLocations(currentLocation);
  const markers = useMapMarkers(nearbyUsers, currentLocation);

  // Get user location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // First try to get from Supabase
        if (user?.id) {
          const { data: savedLocation } = await getUserLocation(user.id);
          if (savedLocation) {
            setCoords([savedLocation.longitude, savedLocation.latitude]);
            setCurrentLocation(savedLocation);
            setIsReady(true);
            return;
          }
        }

        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('❌ Location permission denied - using default location');
          setIsReady(true);
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const newCoords: [number, number] = [
          location.coords.longitude,
          location.coords.latitude,
        ];
        setCoords(newCoords);
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setIsReady(true);
        console.log('✅ Location obtained:', newCoords);
      } catch (error) {
        console.error('❌ Location error:', error);
        setIsReady(true);
      }
    };

    fetchLocation();
  }, [user?.id]);

  // Web platform fallback
  if (Platform.OS === 'web') {
    return (
      <View style={styles.center}>
        <Text style={styles.fallbackText}>Map view is available on mobile devices</Text>
      </View>
    );
  }

  // Show loading
  if (!isReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={STYLE_URL}
        logoEnabled={false}
        attributionEnabled={true}
        attributionPosition={{ bottom: 8, left: 8 }}
        onDidFinishLoadingMap={() => console.log('✅ Map loaded')}
      >
        <MapLibreGL.Camera
          zoomLevel={13}
          centerCoordinate={coords}
          animationMode="flyTo"
          animationDuration={1000}
        />

        <MapLibreGL.UserLocation
          visible={true}
          androidRenderMode="compass"
          showsUserHeadingIndicator={true}
        />

        {/* Render markers for nearby users */}
        {markers.map((marker) => (
          <MapLibreGL.MarkerView
            key={marker.id}
            id={marker.id}
            coordinate={marker.coordinates}
          >
            <View style={styles.markerContainer}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: marker.avatar }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </View>
              {marker.distance && (
                <View style={styles.distanceContainer}>
                  <Text style={styles.distanceText}>{marker.distance}</Text>
                </View>
              )}
            </View>
          </MapLibreGL.MarkerView>
        ))}
      </MapLibreGL.MapView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  fallbackText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  distanceContainer: {
    marginTop: 4,
    backgroundColor: '#000000CC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFFFFFEE',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
