// components/MapLibreView.tsx
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

// ---------------------------------------------------------------
// 🔑 MAPTILER - your key (streets-v4)
const MAPTILER_API_KEY = "pKIhItgWM6mrmgkXmdVy";
const STYLE_URL = `https://api.maptiler.com/maps/streets-v4/style.json?key=${MAPTILER_API_KEY}`;

// ---------------------------------------------------------------
// Global settings
MapLibreGL.setAccessToken(null);
MapLibreGL.setConnected(true);

try {
  (MapLibreGL.offlineManager as any).invalidateAmbientCache?.();
  // @ts-ignore
  MapLibreGL.offlineManager.clearDatabase?.();
} catch (e) {
  // ignore if not available
}

const DEFAULT_COORDS: [number, number] = [78.9629, 20.5937];

interface MapLibreViewProps {
  showFarmers?: boolean;
  showBuyers?: boolean;
  radiusInMeters?: number;
  onUserPress?: (user: any) => void;
}

export default function MapLibreView(props: MapLibreViewProps) {
  const { user } = useAuth();
  const mapRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  const [mapError, setMapError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number]>(DEFAULT_COORDS);
  const [currentLocationObj, setCurrentLocationObj] = useState<{ latitude: number; longitude: number } | undefined>();

  const { nearbyUsers } = useRealtimeLocations(currentLocationObj);
  const markers = useMapMarkers(nearbyUsers, currentLocationObj);

  useEffect(() => {
    let mounted = true;
    async function loadLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!mounted) return;
        if (status !== 'granted') {
          setIsReady(true);
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!mounted) return;
        setUserCoords([loc.coords.longitude, loc.coords.latitude]);
        setCurrentLocationObj({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        setIsReady(true);
      } catch (err) {
        console.error('Location error:', err);
        if (mounted) setIsReady(true);
      }
    }
    loadLocation();
    return () => { mounted = false; };
  }, [user?.id]);

  if (!isReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading map…</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.center}>
        <Text>Map not supported on web</Text>
      </View>
    );
  }

  if (mapError) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red', fontWeight: '600' }}>{mapError}</Text>
        <Text style={{ marginTop: 6 }}>Check API key / network</Text>
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
        onDidFailLoadingMap={() => setMapError('Map failed to load')}
        onDidFinishLoadingMap={() => console.log('Map finished loading')}

        // -----------------------------
        // CRITICAL: inject key for ALL tile/font/sprite/glyph requests
        // -----------------------------
        transformRequest={(url) => {
          const lower = url.toLowerCase();
          const needsKey =
            lower.includes('api.maptiler.com') ||
            lower.includes('tiles.maptiler.com') ||
            lower.includes('fonts.maptiler.com') ||
            lower.includes('maps.maptiler.com') ||
            lower.includes('/tiles/') ||
            lower.includes('/fonts/') ||
            lower.includes('/glyphs') ||
            lower.includes('/sprite') ||
            lower.includes('tilehosting');

          if (!needsKey) return { url };

          const cleaned = url.replace(/([?&])key=[^&]*/g, '').replace(/[?&]$/, '');
          const sep = cleaned.includes('?') ? '&' : '?';
          return { url: `${cleaned}${sep}key=${MAPTILER_API_KEY}` };
        }}
      >
        <MapLibreGL.UserLocation visible={true} androidRenderMode="gps" showsUserHeadingIndicator={true} />

        <MapLibreGL.Camera
          ref={cameraRef}
          zoomLevel={15}
          centerCoordinate={userCoords}
          followUserLocation={true}
          followUserMode="normal"
        />

        {markers.map((m: any) => {
          if (!m.coordinates || m.coordinates.length !== 2) return null;
          return (
            <MapLibreGL.MarkerView key={m.id} id={m.id} coordinate={m.coordinates}>
              <TouchableOpacity onPress={() => props.onUserPress?.(m)}>
                <View style={styles.marker}>
                  <View style={styles.avatarWrap}>
                    <Image source={{ uri: m.avatar || 'https://www.gravatar.com/avatar/?d=mp' }} style={styles.avatar} />
                  </View>
                  {m.distance && (
                    <View style={styles.badge}><Text style={styles.badgeText}>{m.distance}</Text></View>
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
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  marker: { alignItems: 'center', justifyContent: 'center', width: 46, height: 46 },
  avatarWrap: { width: 38, height: 38, borderRadius: 19, overflow: 'hidden', borderWidth: 2, borderColor: '#fff', backgroundColor: '#fff' },
  avatar: { width: '100%', height: '100%' },
  badge: { position: 'absolute', bottom: -6, backgroundColor: 'rgba(0,0,0,0.75)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 5 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' }
});
