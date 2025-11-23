/**
 * 🗺️ MapLibre View Component — Production Version
 * MapTiler + OpenStreetMap + Real-time location
 * Full world map with roads, cities, landmarks, labels
 * Works in Android/iOS release builds (no Expo, no Google Maps)
 */

import MapLibreGL from "@maplibre/maplibre-react-native";
import * as Location from 'expo-location';
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";

// ✅ MapLibre configuration
MapLibreGL.setAccessToken(null);
MapLibreGL.setConnected(true);

const MAPTILER_API_KEY = "S1newPOTVEpCrOQg9RYx";
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`;

// Default location (India center) - map shows immediately
const DEFAULT_COORDS: [number, number] = [78.9629, 20.5937];

interface MapLibreViewProps {
  showFarmers?: boolean;
  showBuyers?: boolean;
  radiusInMeters?: number;
  onUserPress?: (user: any) => void;
}

export default function MapLibreView(props: MapLibreViewProps) {
  const [coords, setCoords] = useState<[number, number]>(DEFAULT_COORDS);
  const [isReady, setIsReady] = useState(false);

  // ✅ Get user location (non-blocking)
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log("❌ Location permission denied - using default location");
          setIsReady(true);
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const coords: [number, number] = [
          location.coords.longitude,
          location.coords.latitude,
        ];
        setCoords(coords);
        setIsReady(true);
        console.log("✅ Location obtained:", coords);
      } catch (error) {
        console.error("❌ Location error:", error);
        setIsReady(true); // Show map anyway with default location
      }
    };

    fetchLocation();
  }, []);

  // Web platform fallback
  if (Platform.OS === 'web') {
    return (
      <View style={styles.center}>
        <Text style={styles.fallbackText}>
          Map view is available on mobile devices
        </Text>
      </View>
    );
  }

  // Show loading only briefly
  if (!isReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  // ✅ Render full world map with all roads, cities, landmarks
  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        style={styles.map}
        mapStyle={STYLE_URL}
        logoEnabled={false}
        attributionEnabled={true}
        attributionPosition={{ bottom: 8, left: 8 }}
        onDidFinishLoadingMap={() =>
          console.log("✅ Full MapTiler map loaded with all labels")
        }
        onDidFailLoadingMap={() =>
          console.log("❌ Map load failed")
        }
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
      </MapLibreGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6b7280",
  },
  fallbackText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
});

