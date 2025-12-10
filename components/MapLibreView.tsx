// MapLibreView.tsx — FINAL REAL-TIME VERSION WITH AUTO-KEY INSERTION
import MapLibreGL from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import { reportMapError } from "../src/utils/reportError";

/* ============================================================
   🚀 DO NOT EDIT — YOUR MAPTILER PRODUCTION KEY
   (Automatically used everywhere in code)
   ============================================================ */
const MAPTILER_KEY = "8MaoCcKOtQUbnHcNOBQn";

/* ============================================================
   🚀 PRIMARY VECTOR STYLE (MapTiler Streets)
   Automatically includes your key
   ============================================================ */
const MAPTILER_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

/* ============================================================
   🚨 OSM FALLBACK — No key needed
   ============================================================ */
const OSM_STYLE = {
  version: 8,
  name: "OSM-Fallback",
  sources: {
    osm: {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm-layer",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

MapLibreGL.setAccessToken(null);
MapLibreGL.setConnected(true);

export default function MapLibreView() {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [styleURL, setStyleURL] = useState<string | null>(null);
  const [checkingStyle, setCheckingStyle] = useState(true);

  // Convert fallback JSON → URI
  const OSM_DATA_URI = useMemo(() => {
    return `data:application/json;utf8,${encodeURIComponent(JSON.stringify(OSM_STYLE))}`;
  }, []);

  /* ============================================================
     🔍 CHECK MAPTILER REAL-TIME BEFORE SHOWING MAP
     ============================================================ */
  const testPrimaryStyle = async () => {
    try {
      const res = await fetch(MAPTILER_STYLE, { method: "HEAD" });
      if (res.ok) {
        setStyleURL(MAPTILER_STYLE);
      } else {
        setStyleURL(OSM_DATA_URI);
      }
    } catch {
      setStyleURL(OSM_DATA_URI);
    } finally {
      setCheckingStyle(false);
    }
  };

  /* ============================================================
     📍 GET USER LOCATION + START MAP STYLE CHECK
     ============================================================ */
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          const msg = "Location permission denied";
          setLocationError(msg);
          reportMapError(msg, "MapLibreView");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setCoords([loc.coords.longitude, loc.coords.latitude]);
      } catch (err: any) {
        const msg = `Location fetch error: ${err.message}`;
        setLocationError(msg);
        reportMapError(msg, "MapLibreView");
      }

      await testPrimaryStyle();
    })();
  }, []);

  /* ============================================================
     UI STATES
     ============================================================ */
  if (Platform.OS === "web") {
    return (
      <View style={styles.center}>
        <Text>Map is not supported on Web</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load location</Text>
        <Text style={styles.errorSubText}>{locationError}</Text>
      </View>
    );
  }

  if (!coords || !styleURL || checkingStyle) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading map…</Text>
      </View>
    );
  }

  /* ============================================================
     🚀 FINAL MAP VIEW
     ============================================================ */
  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        style={styles.map}
        styleURL={styleURL}
        logoEnabled={false}
        attributionEnabled={true}
        attributionPosition={{ bottom: 8, left: 8 }}
        onDidFailLoadingMap={() => {
          reportMapError("Map failed to load", "MapLibreView");

          // AUTO-SWITCH TO OSM
          if (styleURL === MAPTILER_STYLE) {
            setStyleURL(OSM_DATA_URI);
          }
        }}
        transformRequest={(url) => {
          try {
            if (url.includes("api.maptiler.com")) {
              const u = new URL(url);

              // AUTO-APPEND KEY
              if (!u.searchParams.has("key")) {
                u.searchParams.append("key", MAPTILER_KEY);
              }

              return { url: u.toString() };
            }
            return { url };
          } catch (err: any) {
            reportMapError(`Transform request error: ${err.message}`, "MapLibreView");
            return { url };
          }
        }}
      >
        <MapLibreGL.UserLocation visible={true} androidRenderMode="normal" />

        <MapLibreGL.Camera
          followUserLocation={true}
          zoomLevel={14}
          centerCoordinate={coords}
        />
      </MapLibreGL.MapView>
    </View>
  );
}

/* ============================================================
   🎨 STYLES
   ============================================================ */
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, fontWeight: "bold", color: "#d32f2f", marginBottom: 8 },
  errorSubText: { fontSize: 14, color: "#666", textAlign: "center", paddingHorizontal: 20 },
});
