import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

// Ensure your API Key is verified
const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY || 'YOUR_KEY_HERE';

// Use Streets-v2 for Google Maps-like detail (Roads, Rivers, Labels)
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

// Fix for MapLibre setAccessToken
MapLibreGL.setAccessToken(null);

// VERY IMPORTANT FOR ANDROID - Fix blank map
MapLibreGL.setConnected(true);

export default function MapLibreView() {
    return (
        <View style={styles.page}>
            <MapLibreGL.MapView
                style={styles.map}
                styleURL={STYLE_URL}
                logoEnabled={false}
                attributionEnabled={true} // Attribution is required by MapTiler free plan
            >
                <MapLibreGL.Camera
                    defaultSettings={{
                        centerCoordinate: [78.9629, 20.5937], // India Center
                        zoomLevel: 4,
                    }}
                />

                <MapLibreGL.UserLocation visible={true} />
            </MapLibreGL.MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        height: 300,
        width: '100%',
        overflow: 'hidden',
        borderRadius: 16,
    },
    map: {
        flex: 1,
    },
});
