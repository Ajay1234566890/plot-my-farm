// Geocoding Service - Web-compatible reverse geocoding using OpenStreetMap Nominatim API
// This replaces the deprecated Expo Location geocoding API

export interface GeocodingAddress {
  street?: string;
  city?: string;
  region?: string; // state/province
  country?: string;
  postalCode?: string;
  name?: string;
  formattedAddress: string;
}

export interface GeocodingError {
  code: string;
  message: string;
  details?: any;
}

// Nominatim API response interface
interface NominatimResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    region?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox: string[];
}

class GeocodingService {
  private cache: Map<string, { data: GeocodingAddress; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly BASE_URL = 'https://nominatim.openstreetmap.org';

  /**
   * Reverse geocode coordinates to address using OpenStreetMap Nominatim API
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodingAddress> {
    const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    
    console.log('🌍 [GEOCODING] Starting reverse geocoding for:', { latitude, longitude });

    // Check cache first
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log('✅ [GEOCODING] Using cached result:', cached);
      return cached;
    }

    try {
      const url = `${this.BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      
      console.log('🌍 [GEOCODING] Fetching from Nominatim:', url);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PlotMyFarm/1.0.0 (React Native App)', // Required by Nominatim
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: NominatimResponse = await response.json();
      console.log('🌍 [GEOCODING] Raw Nominatim response:', data);

      if (!data || !data.address) {
        throw new Error('No address data in response');
      }

      // Extract address components
      const address = data.address;
      const result = this.parseNominatimAddress(address, data.display_name);
      
      console.log('✅ [GEOCODING] Parsed result:', result);

      // Cache the result
      this.setCachedData(cacheKey, result);

      return result;
    } catch (error) {
      console.error('❌ [GEOCODING] Error in reverse geocoding:', error);
      
      // Return fallback
      const fallback: GeocodingAddress = {
        formattedAddress: 'Location unavailable',
        city: 'Unknown Location',
        country: 'Unknown',
      };
      
      console.log('🔄 [GEOCODING] Using fallback:', fallback);
      return fallback;
    }
  }

  /**
   * Parse Nominatim address response into our format
   */
  private parseNominatimAddress(address: NominatimResponse['address'], displayName: string): GeocodingAddress {
    // Extract city - try multiple fields in order of preference
    const city = address.city || 
                 address.town || 
                 address.village || 
                 address.municipality || 
                 address.suburb ||
                 address.neighbourhood;

    // Extract region (state/province)
    const region = address.state || address.region;

    // Extract street
    const street = address.road ? 
      (address.house_number ? `${address.house_number} ${address.road}` : address.road) : 
      undefined;

    // Build formatted address parts
    const parts: string[] = [];
    if (city) parts.push(city);
    if (region) parts.push(region);
    if (address.country) parts.push(address.country);

    const formattedAddress = parts.length > 0 ? parts.join(', ') : displayName;

    return {
      street,
      city: city || undefined,
      region: region || undefined,
      country: address.country || undefined,
      postalCode: address.postcode || undefined,
      name: undefined, // Nominatim doesn't provide a specific name field
      formattedAddress,
    };
  }

  /**
   * Get cached geocoding data
   */
  private getCachedData(key: string): GeocodingAddress | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    
    // Remove expired cache
    if (cached) {
      this.cache.delete(key);
    }
    
    return null;
  }

  /**
   * Set cached geocoding data
   */
  private setCachedData(key: string, data: GeocodingAddress): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ [GEOCODING] Cache cleared');
  }
}

// Export singleton instance
export const geocodingService = new GeocodingService();
