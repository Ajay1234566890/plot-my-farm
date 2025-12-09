// Market Prices Service - Government API Integration
// Fetches real-time market prices from data.gov.in API

import { supabase } from '@/utils/supabase';
import { locationService } from './location-service';

const API_KEY = process.env.EXPO_PUBLIC_MARKET_API_KEY || '';
const API_BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

// Crop name mapping for images - Using local accurate images from assets folder
// Comprehensive mapping with multiple variations and aliases for better API data matching
const CROP_IMAGE_MAP: Record<string, any> = {
  // Vegetables - Local accurate images with variations
  'tomato': require('@/assets/images/market/tomato.jpg'),
  'tomatoes': require('@/assets/images/market/tomato.jpg'),
  'tamatar': require('@/assets/images/market/tomato.jpg'),

  'onion': require('@/assets/images/market/onion.jpg'),
  'onions': require('@/assets/images/market/onion.jpg'),
  'pyaz': require('@/assets/images/market/onion.jpg'),
  'kanda': require('@/assets/images/market/onion.jpg'),
  'onion green': require('@/assets/images/market/onion.jpg'),

  'cauliflower': require('@/assets/images/market/cauliflower.jpg'),
  'phool gobhi': require('@/assets/images/market/cauliflower.jpg'),
  'gobi': require('@/assets/images/market/cauliflower.jpg'),

  'cabbage': require('@/assets/images/market/cauliflower.jpg'), // Fallback to cauliflower if no cabbage image
  'patta gobhi': require('@/assets/images/market/cauliflower.jpg'),

  'brinjal': require('@/assets/images/market/brinjal.jpg'),
  'eggplant': require('@/assets/images/market/brinjal.jpg'),
  'baingan': require('@/assets/images/market/brinjal.jpg'),
  'aubergine': require('@/assets/images/market/brinjal.jpg'),

  'chilli': require('@/assets/images/market/dry_chillies.jpg'),
  'chillies': require('@/assets/images/market/dry_chillies.jpg'),
  'dry chilli': require('@/assets/images/market/dry_chillies.jpg'),
  'dry chillies': require('@/assets/images/market/dry_chillies.jpg'),
  'mirchi': require('@/assets/images/market/dry_chillies.jpg'),
  'red chilli': require('@/assets/images/market/dry_chillies.jpg'),

  // Green chilli - NEW from crops folder
  'green chilli': require('@/assets/images/crops/green_chilli.jpg'),
  'green chillies': require('@/assets/images/crops/green_chilli.jpg'),
  'hari mirchi': require('@/assets/images/crops/green_chilli.jpg'),

  'cucumber': require('@/assets/images/market/cucumber.jpg'),
  'cucumbers': require('@/assets/images/market/cucumber.jpg'),
  'kheera': require('@/assets/images/market/cucumber.jpg'),
  'kakdi': require('@/assets/images/market/cucumber.jpg'),

  'bitter gourd': require('@/assets/images/market/little_gourd_kundru.jpg'),
  'karela': require('@/assets/images/market/little_gourd_kundru.jpg'),

  'bottle gourd': require('@/assets/images/market/bottle_gourd.jpg'),
  'lauki': require('@/assets/images/market/bottle_gourd.jpg'),
  'ghiya': require('@/assets/images/market/bottle_gourd.jpg'),
  'doodhi': require('@/assets/images/market/bottle_gourd.jpg'),

  'ridge gourd': require('@/assets/images/market/ridge_gourd.jpg'),
  'turai': require('@/assets/images/market/ridge_gourd.jpg'),
  'tori': require('@/assets/images/market/ridge_gourd.jpg'),
  'ridgeguard': require('@/assets/images/market/ridge_gourd.jpg'),

  'lady finger': require('@/assets/images/market/ladies_finger.jpg'),
  'ladies finger': require('@/assets/images/market/ladies_finger.jpg'),
  'okra': require('@/assets/images/market/ladies_finger.jpg'),
  'bhindi': require('@/assets/images/market/ladies_finger.jpg'),

  'radish': require('@/assets/images/market/radish.jpg'),
  'mooli': require('@/assets/images/market/radish.jpg'),
  'muli': require('@/assets/images/market/radish.jpg'),
  'raddish': require('@/assets/images/market/radish.jpg'),

  'beetroot': require('@/assets/images/market/beetroot.jpg'),
  'beet': require('@/assets/images/market/beetroot.jpg'),
  'chukandar': require('@/assets/images/market/beetroot.jpg'),

  'ginger': require('@/assets/images/market/ginger.jpg'),
  'adrak': require('@/assets/images/market/ginger.jpg'),
  'adrakh': require('@/assets/images/market/ginger.jpg'),

  'elephant yam': require('@/assets/images/market/elephant_yam.jpg'),
  'yam': require('@/assets/images/market/elephant_yam.jpg'),
  'suran': require('@/assets/images/market/elephant_yam.jpg'),
  'jimikand': require('@/assets/images/market/elephant_yam.jpg'),

  'little gourd': require('@/assets/images/market/little_gourd_kundru.jpg'),
  'kundru': require('@/assets/images/market/little_gourd_kundru.jpg'),
  'kundri': require('@/assets/images/market/little_gourd_kundru.jpg'),
  'ivy gourd': require('@/assets/images/market/little_gourd_kundru.jpg'),

  // Peas - NEW from crops folder
  'peas': require('@/assets/images/crops/peas.jpg'),
  'pea': require('@/assets/images/crops/peas.jpg'),
  'matar': require('@/assets/images/crops/peas.jpg'),
  'green peas': require('@/assets/images/crops/peas.jpg'),
  'peas cod': require('@/assets/images/crops/peas.jpg'),
  'peas wet': require('@/assets/images/crops/peas.jpg'),

  // Coriander - NEW from crops folder
  'coriander': require('@/assets/images/crops/coriander_leaves.jpg'),
  'coriander leaves': require('@/assets/images/crops/coriander_leaves.jpg'),
  'dhania': require('@/assets/images/crops/coriander_leaves.jpg'),
  'cilantro': require('@/assets/images/crops/coriander_leaves.jpg'),

  // Colacassia - NEW from crops folder
  'colacassia': require('@/assets/images/crops/colacassia.jpg'),
  'colocasia': require('@/assets/images/crops/colacassia.jpg'),
  'arvi': require('@/assets/images/crops/colacassia.jpg'),
  'taro': require('@/assets/images/crops/colacassia.jpg'),
  'taro root': require('@/assets/images/crops/colacassia.jpg'),

  // Pulses & Legumes - Local accurate images with variations
  'gram': require('@/assets/images/market/bengal_gram.jpg'),
  'chana': require('@/assets/images/market/bengal_gram.jpg'),
  'bengal gram': require('@/assets/images/market/bengal_gram.jpg'),
  'chickpea': require('@/assets/images/market/bengal_gram.jpg'),
  'chickpeas': require('@/assets/images/market/bengal_gram.jpg'),
  'kabuli chana': require('@/assets/images/market/bengal_gram.jpg'),
  'desi chana': require('@/assets/images/market/bengal_gram.jpg'),
  'garbanzo': require('@/assets/images/market/bengal_gram.jpg'),
  'green gram': require('@/assets/images/market/bengal_gram.jpg'), // Fallback

  // Tur Dal - NEW from crops folder
  'tur': require('@/assets/images/crops/tur_dal.jpg'),
  'tur dal': require('@/assets/images/crops/tur_dal.jpg'),
  'toor dal': require('@/assets/images/crops/tur_dal.jpg'),
  'arhar': require('@/assets/images/crops/tur_dal.jpg'),
  'arhar dal': require('@/assets/images/crops/tur_dal.jpg'),
  'pigeon pea': require('@/assets/images/crops/tur_dal.jpg'),
  'pigeon peas': require('@/assets/images/crops/tur_dal.jpg'),

  // Soyabean - NEW from crops folder
  'soybean': require('@/assets/images/crops/soyabean.jpg'),
  'soyabean': require('@/assets/images/crops/soyabean.jpg'),
  'soya': require('@/assets/images/crops/soyabean.jpg'),
  'soy': require('@/assets/images/crops/soyabean.jpg'),
  'soyabeans': require('@/assets/images/crops/soyabean.jpg'),

  // Fruits - Local accurate images with variations
  'pomegranate': require('@/assets/images/market/pomogranate.jpg'),
  'pomegranates': require('@/assets/images/market/pomogranate.jpg'),
  'anar': require('@/assets/images/market/pomogranate.jpg'),
  'anaar': require('@/assets/images/market/pomogranate.jpg'),

  // Lemon - NEW from crops folder
  'lemon': require('@/assets/images/crops/lemon.jpg'),
  'lemons': require('@/assets/images/crops/lemon.jpg'),
  'nimbu': require('@/assets/images/crops/lemon.jpg'),
  'lime': require('@/assets/images/crops/lemon.jpg'),

  // Sweet Lime - NEW from crops folder
  'sweet lime': require('@/assets/images/crops/sweet_lime.jpg'),
  'sweet lemon': require('@/assets/images/crops/sweet_lime.jpg'),
  'mosambi': require('@/assets/images/crops/sweet_lime.jpg'),
  'mousambi': require('@/assets/images/crops/sweet_lime.jpg'),

  // Guava - NEW from crops folder
  'guava': require('@/assets/images/crops/guava.jpg'),
  'guavas': require('@/assets/images/crops/guava.jpg'),
  'amrud': require('@/assets/images/crops/guava.jpg'),
  'peru': require('@/assets/images/crops/guava.jpg'),

  // Orange - NEW from crops folder
  'orange': require('@/assets/images/crops/orange.jpg'),
  'oranges': require('@/assets/images/crops/orange.jpg'),
  'santra': require('@/assets/images/crops/orange.jpg'),
  'narangi': require('@/assets/images/crops/orange.jpg'),

  // Pineapple - NEW from crops folder
  'pineapple': require('@/assets/images/crops/pineapple.jpg'),
  'pineapples': require('@/assets/images/crops/pineapple.jpg'),
  'ananas': require('@/assets/images/crops/pineapple.jpg'),

  // Apple
  'apple': require('@/assets/images/market/pomogranate.jpg'), // Fallback
  'seb': require('@/assets/images/market/pomogranate.jpg'),

  // Banana
  'banana': require('@/assets/images/crops/pineapple.jpg'), // Fallback
  'kela': require('@/assets/images/crops/pineapple.jpg'),

  // Grains & Cereals - NEW from crops folder
  'paddy': require('@/assets/images/crops/paddy.jpg'),
  'rice': require('@/assets/images/crops/paddy.jpg'),
  'dhan': require('@/assets/images/crops/paddy.jpg'),
  'chawal': require('@/assets/images/crops/paddy.jpg'),

  'wheat': require('@/assets/images/crops/wheat.jpg'),
  'gehun': require('@/assets/images/crops/wheat.jpg'),
  'gehu': require('@/assets/images/crops/wheat.jpg'),
  'maize': require('@/assets/images/crops/wheat.jpg'), // Fallback

  // Cash Crops - Local accurate images with variations
  'cotton': require('@/assets/images/market/cotton.jpg'),
  'kapas': require('@/assets/images/market/cotton.jpg'),
  'kappas': require('@/assets/images/market/cotton.jpg'),

  'coconut': require('@/assets/images/market/coconut.jpg'),
  'coconuts': require('@/assets/images/market/coconut.jpg'),
  'nariyal': require('@/assets/images/market/coconut.jpg'),
  'copra': require('@/assets/images/market/coconut.jpg'),

  'tender coconut': require('@/assets/images/market/tender_coconut.jpg'),
  'green coconut': require('@/assets/images/market/tender_coconut.jpg'),

  'betelnut': require('@/assets/images/market/betelnut.jpg'),
  'betel nut': require('@/assets/images/market/betelnut.jpg'),
  'areca nut': require('@/assets/images/market/betelnut.jpg'),
  'supari': require('@/assets/images/market/betelnut.jpg'),
  'supari (betelnut)': require('@/assets/images/market/betelnut.jpg'),

  // Wood - NEW from crops folder
  'wood': require('@/assets/images/crops/wood.jpg'),
  'timber': require('@/assets/images/crops/wood.jpg'),
  'lakdi': require('@/assets/images/crops/wood.jpg'),

  // Spices - Local accurate images with variations
  'turmeric': require('@/assets/images/market/turmeric.jpg'),
  'haldi': require('@/assets/images/market/turmeric.jpg'),
  'haladi': require('@/assets/images/market/turmeric.jpg'),
  'manjal': require('@/assets/images/market/turmeric.jpg'),

  // Garlic - Using ginger image as fallback (similar appearance)
  'garlic': require('@/assets/images/market/ginger.jpg'),
  'lahsun': require('@/assets/images/market/ginger.jpg'),
  'lasun': require('@/assets/images/market/ginger.jpg'),

  // Green Banana - Using pineapple as fallback
  'green banana': require('@/assets/images/crops/pineapple.jpg'),
  'raw banana': require('@/assets/images/crops/pineapple.jpg'),
  'plantain': require('@/assets/images/crops/pineapple.jpg'),
  'kachha kela': require('@/assets/images/crops/pineapple.jpg'),
  'banana - green': require('@/assets/images/crops/pineapple.jpg'),

  // Papaya - Using guava as fallback (similar tropical fruit)
  'papaya': require('@/assets/images/crops/guava.jpg'),
  'papita': require('@/assets/images/crops/guava.jpg'),
  'pawpaw': require('@/assets/images/crops/guava.jpg'),
  'papaya (raw)': require('@/assets/images/crops/guava.jpg'),

  // Jaggery - Using turmeric as fallback (similar color)
  'jaggery': require('@/assets/images/market/turmeric.jpg'),
  'gur': require('@/assets/images/market/turmeric.jpg'),
  'gud': require('@/assets/images/market/turmeric.jpg'),

  // Flowers
  'rose': require('@/assets/images/market/tomato.jpg'), // Fallback
  'jasmine': require('@/assets/images/market/tomato.jpg'), // Fallback
  'marigold': require('@/assets/images/market/tomato.jpg'), // Fallback

  // Default fallback - using tomato as default
  'default': require('@/assets/images/market/tomato.jpg')
};

export interface MarketPrice {
  id: string;
  commodity: string;
  variety?: string;
  market: string;
  state: string;
  district?: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceDate: string;
  unit: string; // 'kg' after conversion
  image: string | any; // Can be URL string or require() result
  priceChange?: number;
  trend?: 'up' | 'down' | 'stable';
}

interface APIResponse {
  records: Array<{
    state: string;
    district?: string;
    market: string;
    commodity: string;
    variety?: string;
    arrival_date?: string;
    Arrival_Date?: string;
    min_price?: string;
    max_price?: string;
    modal_price?: string;
    Min_x0020_Price?: string;
    Max_x0020_Price?: string;
    Modal_x0020_Price?: string;
  }>;
}

class MarketPricesService {
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly QUINTAL_TO_KG = 100; // 1 quintal = 100 kg

  /**
   * Get crop image based on commodity name
   * Prioritizes longer matches (more specific) over shorter ones
   */
  private getCropImage(commodity: string): string {
    const normalizedName = commodity.toLowerCase().trim();

    // Sort keys by length descending to match specific names first
    // e.g. "Green Chilli" should match "green chilli" before "chilli"
    const keys = Object.keys(CROP_IMAGE_MAP).sort((a, b) => b.length - a.length);

    for (const key of keys) {
      if (normalizedName.includes(key)) {
        return CROP_IMAGE_MAP[key];
      }
    }

    return CROP_IMAGE_MAP.default;
  }

  /**
   * Convert quintal price to kg price
   */
  private convertQuintalToKg(quintalPrice: number): number {
    return Math.round(quintalPrice / this.QUINTAL_TO_KG);
  }

  /**
   * Normalize commodity name
   * Removes parentheses, special chars, and standardizes case
   */
  private normalizeCommodityName(name: string): string {
    if (!name) return '';
    // Remove content in parentheses, e.g., "Bhindi(Ladies Finger)" -> "Bhindi"
    let normalized = name.replace(/\s*\(.*?\)\s*/g, '').trim();
    // Remove special characters and extra spaces
    normalized = normalized.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, ' ');
    // Title case
    return normalized.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  /**
   * Parse date string to timestamp for comparison
   * Format: DD/MM/YYYY
   */
  private parseDate(dateStr: string): number {
    if (!dateStr) return 0;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      // Month is 0-indexed in JS Date
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
    }
    return 0;
  }

  /**
   * Fetch market prices from government API
   */
  async fetchMarketPrices(
    state?: string,
    limit: number = 200, // Increased limit to allow for filtering
    offset: number = 0
  ): Promise<MarketPrice[]> {
    try {
      console.log('🌾 [MARKET PRICES] Fetching from government API...');

      // Build API URL
      let apiUrl = `${API_BASE_URL}?api-key=${API_KEY}&format=json&limit=${limit}&offset=${offset}`;

      if (state) {
        apiUrl += `&filters[state]=${encodeURIComponent(state)}`;
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: APIResponse = await response.json();

      console.log(`✅ [MARKET PRICES] Fetched ${data.records?.length || 0} records`);

      // Map to store unique commodities (Deduplication Logic)
      // Key: Normalized Commodity Name, Value: MarketPrice
      const uniqueCommodities = new Map<string, MarketPrice>();

      (data.records || []).forEach((record, index) => {
        // 1. Clean Data: Skip invalid entries
        const modalPriceStr = record.modal_price || record.Modal_x0020_Price || '0';
        const minPriceStr = record.min_price || record.Min_x0020_Price || '0';
        const maxPriceStr = record.max_price || record.Max_x0020_Price || '0';

        if (!record.commodity || modalPriceStr === '0') {
          return;
        }

        const modalPrice = parseFloat(modalPriceStr) || 0;
        const minPrice = parseFloat(minPriceStr) || 0;
        const maxPrice = parseFloat(maxPriceStr) || 0;

        // 2. Normalize Name
        const normalizedName = this.normalizeCommodityName(record.commodity);
        if (!normalizedName) return;

        const arrivalDate = record.arrival_date || record.Arrival_Date || '';
        const priceDate = this.parseDate(arrivalDate);

        const newPrice: MarketPrice = {
          id: `${normalizedName}-${record.market}-${index}`,
          commodity: normalizedName, // Use normalized name
          variety: record.variety,
          market: record.market,
          state: record.state,
          district: record.district,
          minPrice: this.convertQuintalToKg(minPrice),
          maxPrice: this.convertQuintalToKg(maxPrice),
          modalPrice: this.convertQuintalToKg(modalPrice),
          priceDate: arrivalDate,
          unit: 'kg',
          image: this.getCropImage(record.commodity), // Use original name for image matching as it might have more context
        };

        // 3. Deduplicate: Keep latest price
        if (uniqueCommodities.has(normalizedName)) {
          const existing = uniqueCommodities.get(normalizedName)!;
          const existingDate = this.parseDate(existing.priceDate);

          // If new record is newer, replace
          if (priceDate > existingDate) {
            uniqueCommodities.set(normalizedName, newPrice);
          }
          // If same date, maybe prefer one with higher price (often indicates better quality/more recent update)
          // or just keep existing. Let's keep existing to be stable unless newer.
        } else {
          uniqueCommodities.set(normalizedName, newPrice);
        }
      });

      // Convert Map to Array
      const prices = Array.from(uniqueCommodities.values());

      // Cache to Supabase
      await this.cachePrices(prices);

      return prices;
    } catch (error) {
      console.error('❌ [MARKET PRICES] Error fetching prices:', error);

      // Return cached data as fallback
      return await this.getCachedPrices(state);
    }
  }

  /**
   * Get market prices with location detection
   */
  async getMarketPricesWithLocation(limit: number = 100): Promise<MarketPrice[]> {
    try {
      // Try to get user's location
      const location = await locationService.getCurrentLocation(true);
      const state = location.address.region; // State/Province from location

      console.log(`📍 [MARKET PRICES] Fetching prices for state: ${state}`);

      return await this.fetchMarketPrices(state, limit);
    } catch (error) {
      console.log('⚠️ [MARKET PRICES] Could not get location, fetching all India prices');
      return await this.fetchMarketPrices(undefined, limit);
    }
  }

  /**
   * Cache prices to Supabase
   */
  private async cachePrices(prices: MarketPrice[]): Promise<void> {
    try {
      const cacheData = prices.map(price => ({
        crop_type: price.commodity,
        location: `${price.market}, ${price.district || ''}, ${price.state}`.trim(),
        price: price.modalPrice,
        unit: price.unit,
        market_name: price.market,
        date: price.priceDate,
        created_at: new Date().toISOString(),
      }));

      // Insert or update cache
      const { error } = await supabase
        .from('market_prices')
        .upsert(cacheData, { onConflict: 'crop_type,location,date' });

      if (error) {
        console.error('❌ [MARKET PRICES] Error caching prices:', error);
      } else {
        console.log(`✅ [MARKET PRICES] Cached ${cacheData.length} prices to Supabase`);
      }
    } catch (error) {
      console.error('❌ [MARKET PRICES] Error in cachePrices:', error);
    }
  }

  /**
   * Get cached prices from Supabase
   */
  private async getCachedPrices(state?: string): Promise<MarketPrice[]> {
    try {
      let query = supabase
        .from('market_prices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (state) {
        query = query.ilike('location', `%${state}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map((record, index) => ({
        id: `cached-${record.id}`,
        commodity: record.crop_type,
        market: record.market_name || 'Unknown',
        state: state || 'India',
        minPrice: record.price,
        maxPrice: record.price,
        modalPrice: record.price,
        priceDate: record.date,
        unit: record.unit || 'kg',
        image: this.getCropImage(record.crop_type),
      }));
    } catch (error) {
      console.error('❌ [MARKET PRICES] Error getting cached prices:', error);
      return [];
    }
  }

  /**
   * Search commodities
   */
  async searchCommodities(query: string, state?: string): Promise<MarketPrice[]> {
    const allPrices = await this.fetchMarketPrices(state, 500);

    return allPrices.filter(price =>
      price.commodity.toLowerCase().includes(query.toLowerCase()) ||
      (price.variety && price.variety.toLowerCase().includes(query.toLowerCase()))
    );
  }

  /**
   * Get unique commodities list
   */
  async getUniqueCommodities(state?: string): Promise<string[]> {
    const prices = await this.fetchMarketPrices(state, 500);
    const commodities = new Set(prices.map(p => p.commodity));
    return Array.from(commodities).sort();
  }
}

// Export singleton instance
export const marketPricesService = new MarketPricesService();
export default marketPricesService;
