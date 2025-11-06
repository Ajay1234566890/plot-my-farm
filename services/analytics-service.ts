/**
 * Analytics Service - Real-time Map Usage Tracking
 * Logs all map interactions to Supabase for analytics
 * NO MOCK DATA - All events stored in Supabase analytics table
 */

import { supabase } from '@/lib/supabase';

export type AnalyticsEventType =
  | 'map_view'
  | 'map_refresh'
  | 'marker_tap'
  | 'filter_change'
  | 'radius_change'
  | 'location_update'
  | 'route_view'
  | 'search'
  | 'navigation';

export interface AnalyticsEvent {
  id?: string;
  user_id: string;
  event_type: AnalyticsEventType;
  screen_name: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

/**
 * Log analytics event to Supabase
 * REAL-TIME - Stores in database immediately
 */
export async function logAnalyticsEvent(
  userId: string,
  eventType: AnalyticsEventType,
  screenName: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const event: AnalyticsEvent = {
      user_id: userId,
      event_type: eventType,
      screen_name: screenName,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('analytics_events')
      .insert(event);

    if (error) {
      console.error('❌ [ANALYTICS] Failed to log event:', error);
      return;
    }

    console.log(`📊 [ANALYTICS] Logged: ${eventType} on ${screenName}`);
  } catch (error) {
    console.error('❌ [ANALYTICS] Error logging event:', error);
  }
}

/**
 * Log map view event
 */
export async function logMapView(
  userId: string,
  screenName: string,
  metadata?: {
    showFarmers?: boolean;
    showBuyers?: boolean;
    radiusKm?: number;
    userCount?: number;
  }
): Promise<void> {
  await logAnalyticsEvent(userId, 'map_view', screenName, metadata);
}

/**
 * Log map refresh event
 */
export async function logMapRefresh(
  userId: string,
  screenName: string,
  metadata?: {
    previousCount?: number;
    newCount?: number;
  }
): Promise<void> {
  await logAnalyticsEvent(userId, 'map_refresh', screenName, metadata);
}

/**
 * Log marker tap event
 */
export async function logMarkerTap(
  userId: string,
  screenName: string,
  metadata: {
    targetUserId: string;
    targetRole: 'farmer' | 'buyer';
    distanceKm: number;
  }
): Promise<void> {
  await logAnalyticsEvent(userId, 'marker_tap', screenName, metadata);
}

/**
 * Log filter change event
 */
export async function logFilterChange(
  userId: string,
  screenName: string,
  metadata: {
    filterType: 'farmers' | 'buyers' | 'both';
    previousFilter?: string;
  }
): Promise<void> {
  await logAnalyticsEvent(userId, 'filter_change', screenName, metadata);
}

/**
 * Log radius change event
 */
export async function logRadiusChange(
  userId: string,
  screenName: string,
  metadata: {
    previousRadiusKm: number;
    newRadiusKm: number;
  }
): Promise<void> {
  await logAnalyticsEvent(userId, 'radius_change', screenName, metadata);
}

/**
 * Log location update event
 */
export async function logLocationUpdate(
  userId: string,
  metadata: {
    latitude: number;
    longitude: number;
    location?: string;
    accuracy?: number;
  }
): Promise<void> {
  await logAnalyticsEvent(userId, 'location_update', 'background', metadata);
}

/**
 * Log route view event
 */
export async function logRouteView(
  userId: string,
  screenName: string,
  metadata: {
    orderId: string;
    distanceKm: number;
    durationMin: number;
  }
): Promise<void> {
  await logAnalyticsEvent(userId, 'route_view', screenName, metadata);
}

/**
 * Get analytics summary for a user
 * REAL-TIME - Queries from database
 */
export async function getUserAnalyticsSummary(
  userId: string,
  days: number = 7
): Promise<{
  totalEvents: number;
  mapViews: number;
  markerTaps: number;
  mostViewedScreen: string;
  averageUsersViewed: number;
}> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error || !data) {
      console.error('❌ [ANALYTICS] Failed to fetch summary:', error);
      return {
        totalEvents: 0,
        mapViews: 0,
        markerTaps: 0,
        mostViewedScreen: 'unknown',
        averageUsersViewed: 0,
      };
    }

    const mapViews = data.filter(e => e.event_type === 'map_view').length;
    const markerTaps = data.filter(e => e.event_type === 'marker_tap').length;

    // Find most viewed screen
    const screenCounts: Record<string, number> = {};
    data.forEach(event => {
      screenCounts[event.screen_name] = (screenCounts[event.screen_name] || 0) + 1;
    });
    const mostViewedScreen = Object.keys(screenCounts).reduce((a, b) =>
      screenCounts[a] > screenCounts[b] ? a : b, 'unknown'
    );

    // Calculate average users viewed
    const mapViewEvents = data.filter(e => e.event_type === 'map_view' && e.metadata?.userCount);
    const averageUsersViewed = mapViewEvents.length > 0
      ? mapViewEvents.reduce((sum, e) => sum + (e.metadata?.userCount || 0), 0) / mapViewEvents.length
      : 0;

    return {
      totalEvents: data.length,
      mapViews,
      markerTaps,
      mostViewedScreen,
      averageUsersViewed: Math.round(averageUsersViewed),
    };
  } catch (error) {
    console.error('❌ [ANALYTICS] Error fetching summary:', error);
    return {
      totalEvents: 0,
      mapViews: 0,
      markerTaps: 0,
      mostViewedScreen: 'unknown',
      averageUsersViewed: 0,
    };
  }
}

/**
 * Get popular filters/radius settings
 * Helps understand user preferences
 */
export async function getPopularMapSettings(): Promise<{
  mostUsedRadius: number;
  mostUsedFilter: 'farmers' | 'buyers' | 'both';
  averageSessionDuration: number;
}> {
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .in('event_type', ['radius_change', 'filter_change'])
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error || !data) {
      return {
        mostUsedRadius: 30,
        mostUsedFilter: 'both',
        averageSessionDuration: 0,
      };
    }

    // Analyze radius changes
    const radiusChanges = data.filter(e => e.event_type === 'radius_change');
    const radiusCounts: Record<number, number> = {};
    radiusChanges.forEach(event => {
      const radius = event.metadata?.newRadiusKm || 30;
      radiusCounts[radius] = (radiusCounts[radius] || 0) + 1;
    });
    const mostUsedRadius = Object.keys(radiusCounts).length > 0
      ? Number(Object.keys(radiusCounts).reduce((a, b) =>
          radiusCounts[Number(a)] > radiusCounts[Number(b)] ? a : b
        ))
      : 30;

    // Analyze filter changes
    const filterChanges = data.filter(e => e.event_type === 'filter_change');
    const filterCounts: Record<string, number> = {};
    filterChanges.forEach(event => {
      const filter = event.metadata?.filterType || 'both';
      filterCounts[filter] = (filterCounts[filter] || 0) + 1;
    });
    const mostUsedFilter = Object.keys(filterCounts).length > 0
      ? Object.keys(filterCounts).reduce((a, b) =>
          filterCounts[a] > filterCounts[b] ? a : b
        ) as 'farmers' | 'buyers' | 'both'
      : 'both';

    return {
      mostUsedRadius,
      mostUsedFilter,
      averageSessionDuration: 0, // Can be calculated from session start/end events
    };
  } catch (error) {
    console.error('❌ [ANALYTICS] Error fetching popular settings:', error);
    return {
      mostUsedRadius: 30,
      mostUsedFilter: 'both',
      averageSessionDuration: 0,
    };
  }
}

