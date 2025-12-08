import { useAuth } from '@/contexts/auth-context';
import { useMapMarkers, useRealtimeLocations } from '@/hooks/useRealtimeLocations';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Constants from 'expo-constants';
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

// ---------------------------------------------------------------
// ✅ MAPTILER CONFIG (Production Safe)
// ---------------------------------------------------------------
const MAPTILER_API_KEY =
  Constants.expoConfig?.extra?.MAPTILER_API_KEY ||
  Constants.manifest?.extra?.MAPTILER_API_KEY ||
  "8MaoCcKOtQUbnHcNOBQn"; // Fallback if extra config fails

const STYLE_URL = `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`;

// ---------------------------------------------------------------
// ⚙️ MAPLIBRE GLOBAL SETTINGS
// ---------------------------------------------------------------
MapLibreGL.setAccessToken(null);
MapLibreGL.setConnected(true);
MapLibreGL.setLogLevel(MapLibreGL.LogLevel.none);

// Clear offline database to prevent caching issues (blank tiles)
// Note: clearDatabase might not exist on all versions types, but effectively clears cache
// Type casting as any to bypass TS check if method exists at runtime
(MapLibreGL.offlineManager as any).deletePack?.('default');
(MapLibreGL.offlineManager as any).invalidateAmbientCache?.();
// Or simplified reset attempt if available, wrapped in try-catch
try {
  // @ts-ignore
  MapLibreGL.offlineManager.clearDatabase?.();
} catch (e) {
  // Ignore if not supported in this version
}

// ---------------------------------------------------------------
// 📍 DEFAULT COORDINATES (India center fallback)
// ---------------------------------------------------------------
const DEFAULT_COORDS: [number, number] = [78.9629, 20.5937];

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

  const [mapError, setMapError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [userCoords, setUserCoords] =
    useState<[number, number]>(DEFAULT_COORDS);

  const [currentLocationObj, setCurrentLocationObj] = useState<
    { latitude: number; longitude: number } | undefined
  >();

  // ---------------------------------------------------------------
  // 🔄 REALTIME DATA (Markers)
  // ---------------------------------------------------------------
  const { nearbyUsers } = useRealtimeLocations(currentLocationObj);
  const markers = useMapMarkers(nearbyUsers, currentLocationObj);

  // ---------------------------------------------------------------
  // 📍 GET USER LOCATION
  // ---------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    async function loadLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!mounted) return;

        if (status !== 'granted') {
          console.warn('⚠️ Location permission denied.');
          setIsReady(true);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!mounted) return;

        const coords: [number, number] = [
          loc.coords.longitude,
          loc.coords.latitude,
        ];

        setUserCoords(coords);
        setCurrentLocationObj({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        setIsReady(true);
      } catch (err) {
        console.error('❌ Location error:', err);
        if (mounted) setIsReady(true);
      }
    }

    loadLocation();
    return () => {
      mounted = false;
    };
  }, []);

  // ---------------------------------------------------------------
  // ⏳ LOADING SCREEN
  // ---------------------------------------------------------------
  if (!isReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7C8B3A" />
        <Text style={styles.loadingText}>Loading map…</Text>
      </View>
    );
  }

  // ---------------------------------------------------------------
  // 🌐 WEB BLOCKER
  // ---------------------------------------------------------------
  if (Platform.OS === 'web') {
    return (
      <View style={styles.center}>
        <Text>Map is available only on mobile devices.</Text>
      </View>
    );
  }

  // ---------------------------------------------------------------
  // ❌ MAP LOAD ERROR FALLBACK
  // ---------------------------------------------------------------
  if (mapError) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#B91C1C', fontWeight: '600' }}>
          {mapError}
        </Text>
        <Text style={{ marginTop: 6, color: '#555' }}>
          Please check internet or API key.
        </Text>
      </View>
    );
  }

  // ---------------------------------------------------------------
  // 🗺️ RENDER MAP
  // ---------------------------------------------------------------
  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={STYLE_URL}
        logoEnabled={false}
        attributionEnabled={true}
        attributionPosition={{ bottom: 8, left: 8 }}
        onDidFailLoadingMap={() => {
          console.log('❌ Map failed to load.');
          setMapError('Map failed to load.');
        }}
        onDidFinishLoadingMap={() => console.log('✅ Map loaded successfully')}

        // -----------------------------------------------------------
        // 🔑 TRANSFORM REQUEST FOR FONTS + TILES
        // -----------------------------------------------------------
        transformRequest={(url) => {
          const lower = url.toLowerCase();

          if (
            lower.includes('maptiler') ||
            lower.includes('/tiles/') ||
            lower.includes('/fonts/') ||
            lower.includes('tilehosting')
          ) {
            const clean = url.replace(/([?&])key=[^&]*/g, '').replace(/[?&]$/, '');
            const sep = clean.includes('?') ? '&' : '?';
            return { url: `${clean}${sep}key=${MAPTILER_API_KEY}` };
          }

          return { url };
        }}
      >
        {/* 👤 USER BLUE DOT */}
        <MapLibreGL.UserLocation
          visible={true}
          androidRenderMode="gps"
          showsUserHeadingIndicator={true}
        />

        {/* 🎥 CAMERA */}
        <MapLibreGL.Camera
          ref={cameraRef}
          zoomLevel={15}
          centerCoordinate={userCoords}
          followUserLocation={true}
          followUserMode="normal"
          animationDuration={1000}
        />

        {/* 📍 REALTIME MARKERS */}
        {markers.map((m) => (
          <MapLibreGL.MarkerView key={m.id} id={m.id} coordinate={m.coordinates}>
            <TouchableOpacity
              onPress={() =>
                props.onUserPress?.({
                  id: m.id,
                  role: m.id.startsWith('farmer') ? 'farmer' : 'buyer',
                })
              }
            >
              <View style={styles.marker}>
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: m.avatar }} style={styles.avatar} />
                </View>

                {m.distance && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{m.distance}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </MapLibreGL.MarkerView>
        ))}
      </MapLibreGL.MapView>
    </View>
  );
}

// ---------------------------------------------------------------
// 🎨 STYLES
// ---------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, color: '#555' },

  marker: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 46,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
    elevation: 5,
  },
  avatar: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
