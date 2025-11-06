/**
 * AI Matching Service - Smart Buyer/Farmer Recommendations
 * Uses real-time data to recommend best matches based on:
 * - Distance (proximity)
 * - Crop preferences
 * - Order history
 * - Ratings
 * - Price compatibility
 * NO MOCK DATA - All recommendations from Supabase
 */

import { supabase } from '@/lib/supabase';
import { calculateDistance } from '@/utils/haversine';

export interface MatchScore {
  userId: string;
  fullName: string;
  role: 'farmer' | 'buyer';
  latitude: number;
  longitude: number;
  location: string;
  score: number; // 0-100
  reasons: string[];
  distance: number;
  distanceFormatted: string;
}

export interface MatchingCriteria {
  maxDistanceKm?: number;
  preferredCrops?: string[];
  minRating?: number;
  priceRange?: { min: number; max: number };
  orderHistoryWeight?: number;
}

/**
 * Get recommended buyers for a farmer
 * REAL-TIME - Queries Supabase for actual data
 */
export async function getRecommendedBuyers(
  farmerId: string,
  criteria: MatchingCriteria = {}
): Promise<MatchScore[]> {
  try {
    // Get farmer details
    const { data: farmer, error: farmerError } = await supabase
      .from('users')
      .select('*, farmer_profile:farmer_profiles(*)')
      .eq('id', farmerId)
      .single();

    if (farmerError || !farmer) {
      console.error('❌ [AI MATCHING] Farmer not found:', farmerError);
      return [];
    }

    if (!farmer.latitude || !farmer.longitude) {
      console.error('❌ [AI MATCHING] Farmer location not available');
      return [];
    }

    // Get all buyers with their profiles
    const { data: buyers, error: buyersError } = await supabase
      .from('users')
      .select(`
        *,
        buyer_profile:buyer_profiles(*),
        orders:orders!buyer_id(id, total_amount, rating, created_at)
      `)
      .eq('role', 'buyer')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (buyersError || !buyers) {
      console.error('❌ [AI MATCHING] Failed to fetch buyers:', buyersError);
      return [];
    }

    // Calculate match scores for each buyer
    const matches: MatchScore[] = buyers.map(buyer => {
      const distance = calculateDistance(
        { latitude: farmer.latitude, longitude: farmer.longitude },
        { latitude: buyer.latitude, longitude: buyer.longitude }
      );

      const distanceKm = distance / 1000;

      // Skip if beyond max distance
      if (criteria.maxDistanceKm && distanceKm > criteria.maxDistanceKm) {
        return null;
      }

      let score = 0;
      const reasons: string[] = [];

      // 1. Distance Score (40 points max)
      // Closer = better
      const maxDistance = criteria.maxDistanceKm || 50;
      const distanceScore = Math.max(0, 40 * (1 - distanceKm / maxDistance));
      score += distanceScore;
      if (distanceKm < 10) {
        reasons.push('Very close proximity');
      } else if (distanceKm < 30) {
        reasons.push('Nearby location');
      }

      // 2. Order History Score (30 points max)
      const buyerOrders = buyer.orders || [];
      const orderCount = buyerOrders.length;
      const orderScore = Math.min(30, orderCount * 3);
      score += orderScore;
      if (orderCount > 10) {
        reasons.push('Frequent buyer');
      } else if (orderCount > 5) {
        reasons.push('Regular buyer');
      }

      // 3. Rating Score (20 points max)
      const avgRating = buyerOrders.length > 0
        ? buyerOrders.reduce((sum, order) => sum + (order.rating || 0), 0) / buyerOrders.length
        : 0;
      const ratingScore = (avgRating / 5) * 20;
      score += ratingScore;
      if (avgRating >= 4.5) {
        reasons.push('Highly rated');
      } else if (avgRating >= 4.0) {
        reasons.push('Good ratings');
      }

      // 4. Crop Preference Match (10 points max)
      if (criteria.preferredCrops && criteria.preferredCrops.length > 0) {
        const buyerPreferences = buyer.buyer_profile?.preferred_crops || [];
        const matchingCrops = criteria.preferredCrops.filter(crop =>
          buyerPreferences.includes(crop)
        );
        const cropScore = (matchingCrops.length / criteria.preferredCrops.length) * 10;
        score += cropScore;
        if (matchingCrops.length > 0) {
          reasons.push(`Interested in ${matchingCrops.join(', ')}`);
        }
      }

      // Skip if below minimum rating
      if (criteria.minRating && avgRating < criteria.minRating) {
        return null;
      }

      return {
        userId: buyer.id,
        fullName: buyer.full_name,
        role: 'buyer' as const,
        latitude: buyer.latitude,
        longitude: buyer.longitude,
        location: buyer.location,
        score: Math.round(score),
        reasons,
        distance,
        distanceFormatted: distanceKm < 1
          ? `${Math.round(distance)} m`
          : `${distanceKm.toFixed(1)} km`,
      };
    }).filter(Boolean) as MatchScore[];

    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score);

    console.log(`✅ [AI MATCHING] Found ${matches.length} recommended buyers for farmer ${farmerId}`);
    return matches;
  } catch (error) {
    console.error('❌ [AI MATCHING] Error getting recommended buyers:', error);
    return [];
  }
}

/**
 * Get recommended farmers for a buyer
 * REAL-TIME - Queries Supabase for actual data
 */
export async function getRecommendedFarmers(
  buyerId: string,
  criteria: MatchingCriteria = {}
): Promise<MatchScore[]> {
  try {
    // Get buyer details
    const { data: buyer, error: buyerError } = await supabase
      .from('users')
      .select('*, buyer_profile:buyer_profiles(*)')
      .eq('id', buyerId)
      .single();

    if (buyerError || !buyer) {
      console.error('❌ [AI MATCHING] Buyer not found:', buyerError);
      return [];
    }

    if (!buyer.latitude || !buyer.longitude) {
      console.error('❌ [AI MATCHING] Buyer location not available');
      return [];
    }

    // Get all farmers with their profiles
    const { data: farmers, error: farmersError } = await supabase
      .from('users')
      .select(`
        *,
        farmer_profile:farmer_profiles(*),
        orders:orders!farmer_id(id, total_amount, rating, created_at)
      `)
      .eq('role', 'farmer')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (farmersError || !farmers) {
      console.error('❌ [AI MATCHING] Failed to fetch farmers:', farmersError);
      return [];
    }

    // Calculate match scores for each farmer
    const matches: MatchScore[] = farmers.map(farmer => {
      const distance = calculateDistance(
        { latitude: buyer.latitude, longitude: buyer.longitude },
        { latitude: farmer.latitude, longitude: farmer.longitude }
      );

      const distanceKm = distance / 1000;

      // Skip if beyond max distance
      if (criteria.maxDistanceKm && distanceKm > criteria.maxDistanceKm) {
        return null;
      }

      let score = 0;
      const reasons: string[] = [];

      // 1. Distance Score (40 points max)
      const maxDistance = criteria.maxDistanceKm || 50;
      const distanceScore = Math.max(0, 40 * (1 - distanceKm / maxDistance));
      score += distanceScore;
      if (distanceKm < 10) {
        reasons.push('Very close proximity');
      } else if (distanceKm < 30) {
        reasons.push('Nearby location');
      }

      // 2. Order History Score (30 points max)
      const farmerOrders = farmer.orders || [];
      const orderCount = farmerOrders.length;
      const orderScore = Math.min(30, orderCount * 3);
      score += orderScore;
      if (orderCount > 10) {
        reasons.push('Experienced seller');
      } else if (orderCount > 5) {
        reasons.push('Regular seller');
      }

      // 3. Rating Score (20 points max)
      const avgRating = farmerOrders.length > 0
        ? farmerOrders.reduce((sum, order) => sum + (order.rating || 0), 0) / farmerOrders.length
        : 0;
      const ratingScore = (avgRating / 5) * 20;
      score += ratingScore;
      if (avgRating >= 4.5) {
        reasons.push('Highly rated farmer');
      } else if (avgRating >= 4.0) {
        reasons.push('Good ratings');
      }

      // 4. Crop Availability Match (10 points max)
      if (criteria.preferredCrops && criteria.preferredCrops.length > 0) {
        const farmerCrops = farmer.farmer_profile?.crops_available || [];
        const matchingCrops = criteria.preferredCrops.filter(crop =>
          farmerCrops.includes(crop)
        );
        const cropScore = (matchingCrops.length / criteria.preferredCrops.length) * 10;
        score += cropScore;
        if (matchingCrops.length > 0) {
          reasons.push(`Grows ${matchingCrops.join(', ')}`);
        }
      }

      // Skip if below minimum rating
      if (criteria.minRating && avgRating < criteria.minRating) {
        return null;
      }

      return {
        userId: farmer.id,
        fullName: farmer.full_name,
        role: 'farmer' as const,
        latitude: farmer.latitude,
        longitude: farmer.longitude,
        location: farmer.location,
        score: Math.round(score),
        reasons,
        distance,
        distanceFormatted: distanceKm < 1
          ? `${Math.round(distance)} m`
          : `${distanceKm.toFixed(1)} km`,
      };
    }).filter(Boolean) as MatchScore[];

    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score);

    console.log(`✅ [AI MATCHING] Found ${matches.length} recommended farmers for buyer ${buyerId}`);
    return matches;
  } catch (error) {
    console.error('❌ [AI MATCHING] Error getting recommended farmers:', error);
    return [];
  }
}

