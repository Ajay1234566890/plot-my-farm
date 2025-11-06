/**
 * Map Clustering Utility
 * Handles 1000+ markers efficiently using Supercluster
 * NO MOCK DATA - Works with real user data from Supabase
 */

import Supercluster from 'supercluster';
import { NearbyUser } from '@/services/map-service';

export interface ClusterPoint {
  type: 'Feature';
  properties: {
    cluster: boolean;
    cluster_id?: number;
    point_count?: number;
    point_count_abbreviated?: string;
    user?: NearbyUser;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
}

export interface ClusterBounds {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

/**
 * Create a Supercluster instance for map clustering
 */
export function createClusterIndex(
  users: NearbyUser[],
  options: {
    radius?: number; // Cluster radius in pixels (default: 60)
    maxZoom?: number; // Max zoom to cluster points on (default: 16)
    minZoom?: number; // Min zoom to cluster points on (default: 0)
    minPoints?: number; // Minimum points to form a cluster (default: 2)
  } = {}
): Supercluster {
  const {
    radius = 60,
    maxZoom = 16,
    minZoom = 0,
    minPoints = 2,
  } = options;

  // Convert users to GeoJSON points
  const points: ClusterPoint[] = users.map(user => ({
    type: 'Feature',
    properties: {
      cluster: false,
      user,
    },
    geometry: {
      type: 'Point',
      coordinates: [user.longitude!, user.latitude!],
    },
  }));

  // Create Supercluster index
  const cluster = new Supercluster({
    radius,
    maxZoom,
    minZoom,
    minPoints,
  });

  // Load points into cluster
  cluster.load(points);

  return cluster;
}

/**
 * Get clusters for current map bounds and zoom level
 */
export function getClusters(
  clusterIndex: Supercluster,
  bounds: ClusterBounds,
  zoom: number
): ClusterPoint[] {
  return clusterIndex.getClusters(
    [bounds.minLng, bounds.minLat, bounds.maxLng, bounds.maxLat],
    Math.floor(zoom)
  );
}

/**
 * Get children of a cluster (expand cluster)
 */
export function getClusterChildren(
  clusterIndex: Supercluster,
  clusterId: number
): ClusterPoint[] {
  return clusterIndex.getChildren(clusterId);
}

/**
 * Get all points in a cluster (leaf points)
 */
export function getClusterLeaves(
  clusterIndex: Supercluster,
  clusterId: number,
  limit: number = 100
): ClusterPoint[] {
  return clusterIndex.getLeaves(clusterId, limit);
}

/**
 * Get zoom level to expand a cluster
 */
export function getClusterExpansionZoom(
  clusterIndex: Supercluster,
  clusterId: number
): number {
  return clusterIndex.getClusterExpansionZoom(clusterId);
}

/**
 * Calculate map bounds from user location and radius
 */
export function calculateBounds(
  centerLat: number,
  centerLng: number,
  radiusKm: number
): ClusterBounds {
  // Approximate degrees per km (varies by latitude)
  const latDegPerKm = 1 / 111.32;
  const lngDegPerKm = 1 / (111.32 * Math.cos(centerLat * Math.PI / 180));

  const latOffset = radiusKm * latDegPerKm;
  const lngOffset = radiusKm * lngDegPerKm;

  return {
    minLat: centerLat - latOffset,
    maxLat: centerLat + latOffset,
    minLng: centerLng - lngOffset,
    maxLng: centerLng + lngOffset,
  };
}

/**
 * Format cluster count for display
 */
export function formatClusterCount(count: number): string {
  if (count < 1000) {
    return count.toString();
  } else if (count < 10000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else {
    return `${Math.floor(count / 1000)}K`;
  }
}

/**
 * Get cluster color based on point count
 */
export function getClusterColor(pointCount: number): string {
  if (pointCount < 10) {
    return '#16a34a'; // Green
  } else if (pointCount < 50) {
    return '#eab308'; // Yellow
  } else if (pointCount < 100) {
    return '#f97316'; // Orange
  } else {
    return '#ef4444'; // Red
  }
}

/**
 * Get cluster size based on point count
 */
export function getClusterSize(pointCount: number): number {
  if (pointCount < 10) {
    return 40;
  } else if (pointCount < 50) {
    return 50;
  } else if (pointCount < 100) {
    return 60;
  } else {
    return 70;
  }
}

/**
 * Check if a feature is a cluster
 */
export function isCluster(feature: ClusterPoint): boolean {
  return feature.properties.cluster === true;
}

/**
 * Extract user from a non-cluster feature
 */
export function getUserFromFeature(feature: ClusterPoint): NearbyUser | null {
  if (isCluster(feature)) {
    return null;
  }
  return feature.properties.user || null;
}

/**
 * Get cluster statistics
 */
export function getClusterStats(clusters: ClusterPoint[]): {
  totalClusters: number;
  totalPoints: number;
  largestCluster: number;
  averageClusterSize: number;
} {
  const clusterFeatures = clusters.filter(isCluster);
  const totalClusters = clusterFeatures.length;
  const totalPoints = clusters.length - totalClusters;

  const clusterSizes = clusterFeatures.map(c => c.properties.point_count || 0);
  const largestCluster = clusterSizes.length > 0 ? Math.max(...clusterSizes) : 0;
  const averageClusterSize = clusterSizes.length > 0
    ? clusterSizes.reduce((a, b) => a + b, 0) / clusterSizes.length
    : 0;

  return {
    totalClusters,
    totalPoints,
    largestCluster,
    averageClusterSize: Math.round(averageClusterSize),
  };
}

/**
 * Filter clusters by role (farmers or buyers)
 */
export function filterClustersByRole(
  clusters: ClusterPoint[],
  role: 'farmer' | 'buyer' | 'both'
): ClusterPoint[] {
  if (role === 'both') {
    return clusters;
  }

  return clusters.filter(cluster => {
    if (isCluster(cluster)) {
      // For clusters, we keep them (they may contain mixed roles)
      return true;
    }
    // For individual points, filter by role
    const user = getUserFromFeature(cluster);
    return user?.role === role;
  });
}

