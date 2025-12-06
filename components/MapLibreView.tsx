import { useAuth } from '@/contexts/auth-context';
import { useMapMarkers, useRealtimeLocations } from '@/hooks/useRealtimeLocations';
import MapLibreGL from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// ✅ 1. MAPTILER CONFIG & API KEY
const MAPTILER_API_KEY = "8MaoCcKOtQUbnHCNOBQn";
const STYLE_URL = `https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_API_KEY}`;

// Fix for Android Release & Debug Logging
MapLibreGL.setAccessToken(null);
MapLibreGL.setConnected(true);
MapLibreGL.setLogLevel(MapLibreGL.LogLevel.verbose);

const DEFAULT_COORDS: [number, number] = [78.9629, 20.5937]; // India Center fallback

interface MapLibreViewProps {
  showFarmers?: boolean;
  showBuyers?: boolean;
  radiusInMeters?: number;
  onUserPress?: (user: any) => void;
}

export default function MapLibreView(props: MapLibreViewProps) {
  const { user } = useAuth();
  const mapRef = useRef<MapLibreGL.MapView>(null);
  const cameraRef = useRef<MapLibreGL.Camera>(null);

  const [isReady, setIsReady] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number]>(DEFAULT_COORDS);
  const [currentLocationObj, setCurrentLocationObj] = useState<{ latitude: number, longitude: number } | undefined>();

  // Real-time data hooks
  const { nearbyUsers, loading } = useRealtimeLocations(currentLocationObj);
  const markers = useMapMarkers(nearbyUsers, currentLocationObj);

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      try {
        // 1. Permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!mounted) return;

        if (status !== 'granted') {
          console.log('Permission denied');
          setIsReady(true);
          return;
        }
        setPermissionGranted(true);

        // 2. Get Location
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!mounted) return;

        const newCoords: [number, number] = [loc.coords.longitude, loc.coords.latitude];
        setUserCoords(newCoords);
        setCurrentLocationObj({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        });

        setIsReady(true);
      } catch (e) {
        console.error("Map Init Error:", e);
        if (mounted) setIsReady(true);
      }
    };

    initMap();

    return () => { mounted = false; };
  }, [user?.id]);

  // Loading State
  if (!isReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7C8B3A" />
        <Text style={{ marginTop: 10, color: '#555' }}>Loading Map...</Text>
      </View>
    );
  }

  // Web Fallback
  if (Platform.OS === 'web') {
    return (
      <View style={styles.center}>
        <Text>Map is available on mobile only.</Text>
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
        // ✅ EXACT transformRequest as required
        transformRequest={(url) => {
          const lower = url.toLowerCase();
          if (
            lower.includes("maptiler") ||
            lower.includes("tiles") ||
            lower.includes("tilehosting") ||
            lower.includes("maps.") ||
            lower.includes("/tiles/") ||
            lower.includes("/fonts/")
          ) {
            const sep = url.includes("?") ? "&" : "?";
            return { url: `${url}${sep}key=8MaoCcKOtQUbnHCNOBQn` };
          }
          return { url };
        }}
        onDidFinishLoadingMap={() => console.log('✅ Map Fully Loaded')}
      >
        <MapLibreGL.Camera
          ref={cameraRef}
          zoomLevel={15}
          centerCoordinate={userCoords}
          animationMode="flyTo"
          animationDuration={2000}
          followUserLocation={true}
          followUserMode="normal"
        />

        {/* ✅ Show User Location */}
        <MapLibreGL.UserLocation
          visible={true}
          androidRenderMode="gps"
          showsUserHeadingIndicator={true}
        />

        {/* ✅ Render Markers */}
        {markers.map((marker) => {
          if (!marker.coordinates || marker.coordinates.length !== 2) return null;

          return (
            <MapLibreGL.MarkerView
              key={marker.id}
              id={marker.id}
              coordinate={marker.coordinates}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => props.onUserPress && props.onUserPress({
                  id: marker.id,
                  role: marker.id.startsWith('farmer') ? 'farmer' : 'buyer'
                })}
              >
                <View style={[styles.markerContainer, { borderColor: marker.id === user?.id ? '#2196F3' : '#fff' }]}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: marker.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" }}
                      style={styles.avatar}
                      resizeMode="cover"
                    />
                  </View>
                  {marker.distance && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{marker.distance}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </MapLibreGL.MarkerView>
          );
        })}

      </MapLibreGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0e0e0' },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' }
});
