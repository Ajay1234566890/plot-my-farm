/**
 * Route Service - Real-time Route Drawing
 * Calculates and draws routes between locations using OpenStreetMap Routing API
 * NO MOCK DATA - Uses real OSRM (Open Source Routing Machine)
 */

import { supabase } from '@/lib/supabase';

export interface RoutePoint {
  latitude: number;
  longitude: number;
}

export interface RouteSegment {
  coordinates: [number, number][]; // [lng, lat] format for MapLibre
  distance: number; // in meters
  duration: number; // in seconds
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  coordinates: [number, number][];
}

export interface DeliveryRoute {
  orderId: string;
  pickupLocation: RoutePoint;
  deliveryLocation: RoutePoint;
  currentDriverLocation?: RoutePoint;
  route: RouteSegment;
  estimatedArrival: Date;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered';
}

/**
 * Fetch route between two points using OSRM (Open Source Routing Machine)
 * FREE and NO API KEY required
 */
export async function fetchRoute(
  start: RoutePoint,
  end: RoutePoint
): Promise<RouteSegment> {
  try {
    // Use public OSRM demo server (replace with your own OSRM instance in production)
    const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson&steps=true`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    const coordinates = route.geometry.coordinates; // Already in [lng, lat] format

    // Extract steps with instructions
    const steps: RouteStep[] = route.legs[0].steps.map((step: any) => ({
      instruction: step.maneuver.instruction || 'Continue',
      distance: step.distance,
      duration: step.duration,
      coordinates: step.geometry.coordinates,
    }));

    return {
      coordinates,
      distance: route.distance,
      duration: route.duration,
      steps,
    };
  } catch (error) {
    console.error('❌ [ROUTE SERVICE] Failed to fetch route:', error);
    throw error;
  }
}

/**
 * Get delivery route from Supabase orders table
 * REAL-TIME DATA - No mock data
 */
export async function getDeliveryRoute(orderId: string): Promise<DeliveryRoute | null> {
  try {
    // Fetch order details from Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        pickup_latitude,
        pickup_longitude,
        delivery_latitude,
        delivery_longitude,
        driver_latitude,
        driver_longitude,
        estimated_arrival,
        farmer:farmer_id(latitude, longitude),
        buyer:buyer_id(latitude, longitude)
      `)
      .eq('id', orderId)
      .single();

    if (error || !order) {
      console.error('❌ [ROUTE SERVICE] Order not found:', error);
      return null;
    }

    // Use order coordinates or fallback to farmer/buyer locations
    const pickupLocation: RoutePoint = {
      latitude: order.pickup_latitude || order.farmer?.latitude,
      longitude: order.pickup_longitude || order.farmer?.longitude,
    };

    const deliveryLocation: RoutePoint = {
      latitude: order.delivery_latitude || order.buyer?.latitude,
      longitude: order.delivery_longitude || order.buyer?.longitude,
    };

    if (!pickupLocation.latitude || !deliveryLocation.latitude) {
      console.error('❌ [ROUTE SERVICE] Missing location data for order:', orderId);
      return null;
    }

    // Fetch route from OSRM
    const route = await fetchRoute(pickupLocation, deliveryLocation);

    // Current driver location (if available)
    const currentDriverLocation = order.driver_latitude && order.driver_longitude
      ? { latitude: order.driver_latitude, longitude: order.driver_longitude }
      : undefined;

    return {
      orderId: order.id,
      pickupLocation,
      deliveryLocation,
      currentDriverLocation,
      route,
      estimatedArrival: new Date(order.estimated_arrival || Date.now() + route.duration * 1000),
      status: order.status,
    };
  } catch (error) {
    console.error('❌ [ROUTE SERVICE] Failed to get delivery route:', error);
    return null;
  }
}

/**
 * Update driver location in real-time
 * Called by driver app to update current position
 */
export async function updateDriverLocation(
  orderId: string,
  latitude: number,
  longitude: number
): Promise<void> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        driver_latitude: latitude,
        driver_longitude: longitude,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      console.error('❌ [ROUTE SERVICE] Failed to update driver location:', error);
      throw error;
    }

    console.log('✅ [ROUTE SERVICE] Driver location updated for order:', orderId);
  } catch (error) {
    console.error('❌ [ROUTE SERVICE] Error updating driver location:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time driver location updates
 * Returns unsubscribe function
 */
export function subscribeToDriverLocation(
  orderId: string,
  callback: (location: RoutePoint) => void
): () => void {
  const subscription = supabase
    .channel(`order-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      },
      (payload) => {
        const { driver_latitude, driver_longitude } = payload.new;
        if (driver_latitude && driver_longitude) {
          callback({
            latitude: driver_latitude,
            longitude: driver_longitude,
          });
        }
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Calculate ETA based on current driver location and remaining route
 */
export async function calculateETA(
  currentLocation: RoutePoint,
  destination: RoutePoint
): Promise<{ distance: number; duration: number; eta: Date }> {
  try {
    const route = await fetchRoute(currentLocation, destination);
    const eta = new Date(Date.now() + route.duration * 1000);

    return {
      distance: route.distance,
      duration: route.duration,
      eta,
    };
  } catch (error) {
    console.error('❌ [ROUTE SERVICE] Failed to calculate ETA:', error);
    throw error;
  }
}

/**
 * Format distance for display
 */
export function formatRouteDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format duration for display
 */
export function formatRouteDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

