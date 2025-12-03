/**
 * Offline Map Service
 * Handles offline map region downloads for low-connectivity zones
 * Uses MapLibre's offline pack functionality
 * NO MOCK DATA - Real map tiles cached locally
 */

import MapLibreGL from '@maplibre/maplibre-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineRegion {
  name: string;
  bounds: {
    ne: [number, number]; // [lng, lat]
    sw: [number, number]; // [lng, lat]
  };
  minZoom: number;
  maxZoom: number;
  styleURL: string;
}

export interface OfflinePackStatus {
  name: string;
  state: number | string; // MapLibre uses consts, but often returns number/string
  percentage: number;
  completedResourceCount: number;
  completedResourceSize: number;
  completedTileCount: number;
  requiredResourceCount: number;
}

const OFFLINE_REGIONS_KEY = '@offline_map_regions';
const DEFAULT_STYLE_URL = 'https://api.maptiler.com/maps/streets/style.json?key=S1newPOTVEpCrOQg9RYx';

/**
 * Create an offline region for download
 * This allows users to download map tiles for offline use
 */
export async function createOfflineRegion(
  name: string,
  centerLat: number,
  centerLng: number,
  radiusKm: number = 30,
  minZoom: number = 10,
  maxZoom: number = 16
): Promise<void> {
  try {
    // Calculate bounds from center and radius
    const latDegPerKm = 1 / 111.32;
    const lngDegPerKm = 1 / (111.32 * Math.cos(centerLat * Math.PI / 180));

    const latOffset = radiusKm * latDegPerKm;
    const lngOffset = radiusKm * lngDegPerKm;

    const bounds = {
      ne: [centerLng + lngOffset, centerLat + latOffset] as [number, number],
      sw: [centerLng - lngOffset, centerLat - latOffset] as [number, number],
    };

    const region: OfflineRegion = {
      name,
      bounds,
      minZoom,
      maxZoom,
      styleURL: DEFAULT_STYLE_URL,
    };

    // Create offline pack
    await MapLibreGL.offlineManager.createPack(
      {
        name, // Required by type definition
        styleURL: region.styleURL,
        bounds: [[bounds.ne[0], bounds.ne[1]], [bounds.sw[0], bounds.sw[1]]],
        minZoom,
        maxZoom,
        metadata: { name }, // Store name in metadata
      },
      (region, status) => {
        console.log(`📥 [OFFLINE MAP] Download progress: ${status.percentage.toFixed(1)}%`);
      },
      (region, error) => {
        if (error) {
          console.error('❌ [OFFLINE MAP] Download error:', error);
        } else {
          console.log('✅ [OFFLINE MAP] Download complete:', name);
        }
      }
    );

    // Save region metadata
    await saveOfflineRegion(region);

    console.log(`✅ [OFFLINE MAP] Created offline region: ${name}`);
  } catch (error) {
    console.error('❌ [OFFLINE MAP] Failed to create offline region:', error);
    throw error;
  }
}

/**
 * Get all offline packs
 */
export async function getOfflinePacks(): Promise<OfflinePackStatus[]> {
  try {
    const packs = await MapLibreGL.offlineManager.getPacks();

    const packStatuses = await Promise.all(packs.map(async (pack) => {
      const status = await pack.status();
      const metadata = pack.metadata; // Property, not method
      return {
        name: metadata?.name || 'Unknown Region',
        state: status.state,
        percentage: status.percentage,
        completedResourceCount: status.completedResourceCount,
        completedResourceSize: status.completedResourceSize,
        completedTileCount: status.completedTileCount,
        requiredResourceCount: status.requiredResourceCount,
      };
    }));

    return packStatuses;
  } catch (error) {
    console.error('❌ [OFFLINE MAP] Failed to get offline packs:', error);
    return [];
  }
}

/**
 * Delete an offline pack
 */
export async function deleteOfflinePack(name: string): Promise<void> {
  try {
    const packs = await MapLibreGL.offlineManager.getPacks();
    for (const pack of packs) {
      const metadata = pack.metadata; // Property, not method
      if (metadata?.name === name) {
        await MapLibreGL.offlineManager.deletePack(pack.name); // Delete by internal name/ID
        console.log(`✅ [OFFLINE MAP] Deleted offline pack: ${name}`);
        break;
      }
    }
    await removeOfflineRegion(name);
  } catch (error) {
    console.error('❌ [OFFLINE MAP] Failed to delete offline pack:', error);
    throw error;
  }
}

/**
 * Get offline pack status
 */
export async function getOfflinePackStatus(name: string): Promise<OfflinePackStatus | null> {
  try {
    const packs = await getOfflinePacks();
    return packs.find(pack => pack.name === name) || null;
  } catch (error) {
    console.error('❌ [OFFLINE MAP] Failed to get pack status:', error);
    return null;
  }
}

/**
 * Pause offline pack download
 */
export async function pauseOfflinePackDownload(name: string): Promise<void> {
  try {
    const packs = await MapLibreGL.offlineManager.getPacks();
    for (const pack of packs) {
      const metadata = pack.metadata; // Property, not method
      if (metadata?.name === name) {
        await pack.pause();
        console.log(`⏸️ [OFFLINE MAP] Paused download: ${name}`);
        return;
      }
    }
    console.warn(`⚠️ [OFFLINE MAP] Pack not found to pause: ${name}`);
  } catch (error) {
    console.error('❌ [OFFLINE MAP] Failed to pause download:', error);
    throw error;
  }
}

/**
 * Resume offline pack download
 */
export async function resumeOfflinePackDownload(name: string): Promise<void> {
  try {
    const packs = await MapLibreGL.offlineManager.getPacks();
    for (const pack of packs) {
      const metadata = pack.metadata; // Property, not method
      if (metadata?.name === name) {
        await pack.resume();
        console.log(`▶️ [OFFLINE MAP] Resumed download: ${name}`);
        return;
      }
    }
    console.warn(`⚠️ [OFFLINE MAP] Pack not found to resume: ${name}`);
  } catch (error) {
    console.error('❌ [OFFLINE MAP] Failed to resume download:', error);
    throw error;
  }
}

/**
 * Save offline region metadata to AsyncStorage
 */
async function saveOfflineRegion(region: OfflineRegion): Promise<void> {
  try {
    const regionsJson = await AsyncStorage.getItem(OFFLINE_REGIONS_KEY);
    const regions: OfflineRegion[] = regionsJson ? JSON.parse(regionsJson) : [];

    // Remove existing region with same name
    const filteredRegions = regions.filter(r => r.name !== region.name);
    filteredRegions.push(region);

    await AsyncStorage.setItem(OFFLINE_REGIONS_KEY, JSON.stringify(filteredRegions));
  } catch (error) {
    console.error('❌ [OFFLINE MAP] Failed to save region metadata:', error);
  }
}

/**
 * Remove offline region metadata from AsyncStorage
 */
async function removeOfflineRegion(name: string): Promise<void> {
  try {
    const regionsJson = await AsyncStorage.getItem(OFFLINE_REGIONS_KEY);
    const regions: OfflineRegion[] = regionsJson ? JSON.parse(regionsJson) : [];

    const filteredRegions = regions.filter(r => r.name !== name);
    await AsyncStorage.setItem(OFFLINE_REGIONS_KEY, JSON.stringify(filteredRegions));
  } catch (error) {
    console.error('❌ [OFFLINE MAP] Failed to remove region metadata:', error);
  }
}

/**
 * Get saved offline regions
 */
export async function getSavedOfflineRegions(): Promise<OfflineRegion[]> {
  try {
    const regionsJson = await AsyncStorage.getItem(OFFLINE_REGIONS_KEY);
    return regionsJson ? JSON.parse(regionsJson) : [];
  } catch (error) {
    console.error('❌ [OFFLINE MAP] Failed to get saved regions:', error);
    return [];
  }
}

/**
 * Download offline map for user's current location
 * Convenience function for quick offline setup
 */
export async function downloadCurrentLocationMap(
  latitude: number,
  longitude: number,
  location: string,
  radiusKm: number = 30
): Promise<void> {
  const name = `${location}_${radiusKm}km`;
  await createOfflineRegion(name, latitude, longitude, radiusKm);
}

/**
 * Check if offline maps are available
 */
export async function hasOfflineMaps(): Promise<boolean> {
  try {
    const packs = await getOfflinePacks();
    return packs.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Get total offline map storage size
 */
export async function getOfflineMapStorageSize(): Promise<number> {
  try {
    const packs = await getOfflinePacks();
    return packs.reduce((total, pack) => total + pack.completedResourceSize, 0);
  } catch (error) {
    console.error('❌ [OFFLINE MAP] Failed to get storage size:', error);
    return 0;
  }
}

/**
 * Format storage size for display
 */
export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}

