import MapLibreGL from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Platform } from "react-native";

interface MapLibreViewProps {
  showFarmers?: boolean;
  showBuyers?: boolean;
  radiusInMeters?: number;
  onUserPress?: (user: any) => void;
}

// ? Your STYLE_URL constant
const STYLE_URL = "https://api.maptiler.com/maps/streets-v4/style.json?key=8MaoCcKOtQUbnHCNOBQn";

MapLibreGL.setAccessToken(null);
MapLibreGL.setConnected(true);

export default function MapLibreView(props: MapLibreViewProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setCoords([loc.coords.longitude, loc.coords.latitude]);
    })();
  }, []);

  if (Platform.OS === "web") return <View style={styles.center}><Text>Map not supported on Web</Text></View>;
  if (!coords) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Loading map</Text></View>;

  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        style={styles.map}
        styleURL={STYLE_URL}
        logoEnabled={false}
        attributionEnabled={true}
        attributionPosition={{ bottom: 8, left: 8 }}
        
        //  Your MapLibre transformRequest
        transformRequest={(url) => {
          if (url.startsWith("https://api.maptiler.com")) {
            const u = new URL(url);
            u.searchParams.set("key", "8MaoCcKOtQUbnHCNOBQn");
            return { url: u.toString() };
          }
          return { url };
        }}
      >
        <MapLibreGL.UserLocation visible={true} androidRenderMode="gps" />
        <MapLibreGL.Camera zoomLevel={14} centerCoordinate={coords} followUserLocation={true} />
      </MapLibreGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});
