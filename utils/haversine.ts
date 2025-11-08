/**
 * Haversine Distance Calculation & Radius Filtering
 * Used for finding nearby farmers/buyers within a specified radius
 */

import { getDistance, isPointWithinRadius } from 'geolib';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationPoint {
  lat?: number;
  latitude?: number;
  lng?: number;
  longitude?: number;
}

/**
 * Normalize location point to standard format
 */
function normalizeCoordinates(point: LocationPoint): Coordinates {
  return {
    latitude: point.latitude ?? point.lat ?? 0,
    longitude: point.longitude ?? point.lng ?? 0,
  };
}

/**
 * Calculate distance between two points in meters using Haversine formula
 * @param point1 First location point
 * @param point2 Second location point
 * @returns Distance in meters
 */
export function calculateDistance(point1: LocationPoint, point2: LocationPoint): number {
  const coord1 = normalizeCoordinates(point1);
  const coord2 = normalizeCoordinates(point2);
  
  return getDistance(coord1, coord2);
}

/**
 * Check if a point is within a specified radius from user location
 * @param userLocation User's current location
 * @param targetLocation Target location to check
 * @param radiusInMeters Radius in meters (default: 30000 = 30km)
 * @returns true if within radius, false otherwise
 */
export function isWithinRadius(
  userLocation: LocationPoint,
  targetLocation: LocationPoint,
  radiusInMeters: number = 30000
): boolean {
  const userCoord = normalizeCoordinates(userLocation);
  const targetCoord = normalizeCoordinates(targetLocation);
  
  return isPointWithinRadius(targetCoord, userCoord, radiusInMeters);
}

/**
 * Filter array of locations to only include those within radius
 * @param userLocation User's current location
 * @param locations Array of locations to filter
 * @param radiusInMeters Radius in meters (default: 30000 = 30km)
 * @returns Filtered array of locations within radius
 */
export function filterByRadius<T extends LocationPoint>(
  userLocation: LocationPoint,
  locations: T[],
  radiusInMeters: number = 30000
): T[] {
  return locations.filter(location => 
    isWithinRadius(userLocation, location, radiusInMeters)
  );
}

/**
 * Calculate distance and format it for display
 * @param point1 First location point
 * @param point2 Second location point
 * @returns Formatted distance string (e.g., "2.5 km" or "850 m")
 */
export function formatDistance(point1: LocationPoint, point2: LocationPoint): string {
  const distanceInMeters = calculateDistance(point1, point2);
  
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  }
  
  const distanceInKm = distanceInMeters / 1000;
  return `${distanceInKm.toFixed(1)} km`;
}

/**
 * Sort locations by distance from user location (nearest first)
 * @param userLocation User's current location
 * @param locations Array of locations to sort
 * @returns Sorted array with nearest locations first
 */
export function sortByDistance<T extends LocationPoint>(
  userLocation: LocationPoint,
  locations: T[]
): T[] {
  return [...locations].sort((a, b) => {
    const distanceA = calculateDistance(userLocation, a);
    const distanceB = calculateDistance(userLocation, b);
    return distanceA - distanceB;
  });
}

/**
 * Get locations within radius and sort by distance
 * @param userLocation User's current location
 * @param locations Array of locations to filter and sort
 * @param radiusInMeters Radius in meters (default: 30000 = 30km)
 * @returns Filtered and sorted array
 */
export function getNearbyLocationsSorted<T extends LocationPoint>(
  userLocation: LocationPoint,
  locations: T[],
  radiusInMeters: number = 30000
): T[] {
  const nearby = filterByRadius(userLocation, locations, radiusInMeters);
  return sortByDistance(userLocation, nearby);
}

/**
 * Add distance property to each location
 * @param userLocation User's current location
 * @param locations Array of locations
 * @returns Array with added distance property
 */
export function addDistanceToLocations<T extends LocationPoint>(
  userLocation: LocationPoint,
  locations: T[]
): (T & { distance: number; distanceFormatted: string })[] {
  return locations.map(location => ({
    ...location,
    distance: calculateDistance(userLocation, location),
    distanceFormatted: formatDistance(userLocation, location),
  }));
}

/**
 * Radius presets for common use cases
 */
export const RADIUS_PRESETS = {
  VERY_CLOSE: 5000,      // 5 km
  CLOSE: 10000,          // 10 km
  NEARBY: 20000,         // 20 km
  DEFAULT: 20000,        // 20 km (changed from 30km as per user requirement)
  FAR: 50000,            // 50 km
  VERY_FAR: 100000,      // 100 km
} as const;

