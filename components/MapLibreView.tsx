/**
 * MapLibre View Component - Production Ready
 * Using MapTiler + OpenStreetMap with real-time location
 */

import Geolocation from "@react-native-community/geolocation";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, PermissionsAndroid, Platform, StyleSheet, Text, View } from "react-native";

// Conditional MapLibre import - only for native platforms
let MapboxGL: any = null;
let isMapLibreAvailable = false;

if (Platform.OS !== 'web') {
  try {
    MapboxGL = require('@maplibre/maplibre-react-native').default;

    // Configure MapLibre
    if (MapboxGL) {
      MapboxGL.setAccessToken(null);
      MapboxGL.setConnected(true);
      MapboxGL.setTelemetryEnabled(false);
      isMapLibreAvailable = true;
      console.log('✅ [MapLibre] Module loaded successfully');
    }
  } catch (error: any) {
    console.error('❌ [MapLibre] Failed to load:', error?.message);
    isMapLibreAvailable = false;
  }
} else {
  console.log('ℹ️ [MapLibre] Web platform - MapLibre not available');
}

// MapTiler API Key - hardcoded for production (streets-v2 for proper glyphs/sprites)
const MAPTILER_API_KEY = "S1newPOTVEpCrOQg9RYx";

export default function MapLibreView() {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log("❌ Location permission denied");
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn("❌ Permission error:", err);
          setIsLoading(false);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (pos) => {
          const location: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          setCoords(location);
          setIsLoading(false);
          console.log("✅ Location obtained:", location);
        },
        (err) => {
          console.error("❌ Location error:", err);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    })();
  }, []);

  // Web or MapLibre not available fallback
  if (Platform.OS === 'web' || !isMapLibreAvailable) {
    return (
      <View style={styles.center}>
        <Text style={styles.fallbackText}>
          {Platform.OS === 'web'
            ? 'Map view is available on mobile devices'
            : 'Map feature temporarily unavailable'}
        </Text>
      </View>
    );
  }

  // Loading state
  if (isLoading || !coords) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  // Render map with MapLibre - Using streets-v2 for CORS-safe glyphs/sprites
  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        // ✅ Use MapTiler's v2 style (has correct glyph + sprite URLs)
        styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=S1newPOTVEpCrOQg9RYx`}

        // ✅ CRITICAL: Disable local font lookup (forces network glyph fetching)
        localIdeographFontFamily={false}

        // ✅ Production-safe options
        logoEnabled={false}
        attributionEnabled={true}
        attributionPosition={{ bottom: 8, left: 8 }}

        onDidFinishLoadingMap={() => {
          console.log('✅ [MapLibre] Map with labels loaded successfully');
          setIsLoading(false);
        }}
        onDidFailLoadingMap={(error: any) => {
          console.error('❌ [MapLibre] Map failed to load:', error);
          setError('Failed to load map');
          setIsLoading(false);
        }}
      >
        <MapboxGL.Camera
          zoomLevel={13}
          centerCoordinate={coords}
          animationMode="flyTo"
        />
        <MapboxGL.UserLocation visible={true} androidRenderMode="compass" />
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  fallbackText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  marker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#007AFF",
    borderWidth: 2,
    borderColor: "#fff",
  },
});

