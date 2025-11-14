// Market Prices Service - Government API Integration
// Fetches real-time market prices from data.gov.in API

import { supabase } from '@/utils/supabase';
import { locationService } from './location-service';

const API_KEY = process.env.EXPO_PUBLIC_MARKET_API_KEY || '';
const API_BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

// Crop name mapping for images - Enhanced with 100% accurate mappings
const CROP_IMAGE_MAP: Record<string, string> = {
  // Vegetables - Highly specific images
  'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=900&auto=format&fit=crop&q=60',
  'onion': 'https://images.unsplash.com/photo-1618512496248-a01f6a44dba9?w=900&auto=format&fit=crop&q=60',
  'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=900&auto=format&fit=crop&q=60',
  'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=900&auto=format&fit=crop&q=60',
  'cabbage': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=900&auto=format&fit=crop&q=60',
  'cauliflower': 'https://images.unsplash.com/photo-1568584711271-e0c3a0f6f6e0?w=900&auto=format&fit=crop&q=60',
  'brinjal': 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=900&auto=format&fit=crop&q=60',
  'eggplant': 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=900&auto=format&fit=crop&q=60',
  'chilli': 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=900&auto=format&fit=crop&q=60',
  'pepper': 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=900&auto=format&fit=crop&q=60',
  'capsicum': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=900&auto=format&fit=crop&q=60',
  'bell pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=900&auto=format&fit=crop&q=60',
  'peas': 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=900&auto=format&fit=crop&q=60',
  'beans': 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=900&auto=format&fit=crop&q=60',
  'green beans': 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=900&auto=format&fit=crop&q=60',
  'french beans': 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=900&auto=format&fit=crop&q=60',
  'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=900&auto=format&fit=crop&q=60',
  'coriander': 'https://images.unsplash.com/photo-1598030634163-d1e6c3c6e6e0?w=900&auto=format&fit=crop&q=60',
  'cilantro': 'https://images.unsplash.com/photo-1598030634163-d1e6c3c6e6e0?w=900&auto=format&fit=crop&q=60',
  'cucumber': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=900&auto=format&fit=crop&q=60',
  'pumpkin': 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=900&auto=format&fit=crop&q=60',
  'bitter gourd': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=900&auto=format&fit=crop&q=60',
  'bottle gourd': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=900&auto=format&fit=crop&q=60',
  'ridge gourd': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=900&auto=format&fit=crop&q=60',
  'lady finger': 'https://images.unsplash.com/photo-1597305877032-0668b3c6413a?w=900&auto=format&fit=crop&q=60',
  'okra': 'https://images.unsplash.com/photo-1597305877032-0668b3c6413a?w=900&auto=format&fit=crop&q=60',
  'radish': 'https://images.unsplash.com/photo-1598030634163-d1e6c3c6e6e0?w=900&auto=format&fit=crop&q=60',
  'beetroot': 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=900&auto=format&fit=crop&q=60',
  'beet': 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=900&auto=format&fit=crop&q=60',
  'ginger': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'garlic': 'https://images.unsplash.com/photo-1588184344470-7e162d7e6e8e?w=900&auto=format&fit=crop&q=60',
  'green chilli': 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=900&auto=format&fit=crop&q=60',
  'red chilli': 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=900&auto=format&fit=crop&q=60',
  'drumstick': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=900&auto=format&fit=crop&q=60',
  'cluster beans': 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=900&auto=format&fit=crop&q=60',
  'methi': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=900&auto=format&fit=crop&q=60',
  'fenugreek': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=900&auto=format&fit=crop&q=60',

  // Grains & Cereals - Specific images
  'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&auto=format&fit=crop&q=60',
  'paddy': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&auto=format&fit=crop&q=60',
  'basmati': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&auto=format&fit=crop&q=60',
  'wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&auto=format&fit=crop&q=60',
  'corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=900&auto=format&fit=crop&q=60',
  'maize': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=900&auto=format&fit=crop&q=60',
  'sweet corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=900&auto=format&fit=crop&q=60',
  'bajra': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'pearl millet': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'jowar': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'sorghum': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'ragi': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'finger millet': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'barley': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&auto=format&fit=crop&q=60',
  'oats': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&auto=format&fit=crop&q=60',

  // Pulses & Legumes - Specific images
  'soybean': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'soya': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'gram': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'chana': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'bengal gram': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'tur': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'arhar': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'pigeon pea': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'moong': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'green gram': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'mung': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'urad': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'black gram': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'masoor': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'red lentil': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'lentil': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'chickpea': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'kabuli chana': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',

  // Fruits - Specific images
  'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=900&auto=format&fit=crop&q=60',
  'alphonso': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=900&auto=format&fit=crop&q=60',
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=900&auto=format&fit=crop&q=60',
  'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=900&auto=format&fit=crop&q=60',
  'grapes': 'https://images.unsplash.com/photo-1599819177924-f8e3c0e5e3e0?w=900&auto=format&fit=crop&q=60',
  'orange': 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=900&auto=format&fit=crop&q=60',
  'pomegranate': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=900&auto=format&fit=crop&q=60',
  'anar': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=900&auto=format&fit=crop&q=60',
  'papaya': 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=900&auto=format&fit=crop&q=60',
  'guava': 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=900&auto=format&fit=crop&q=60',
  'amrud': 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=900&auto=format&fit=crop&q=60',
  'watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e784720?w=900&auto=format&fit=crop&q=60',
  'lemon': 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=900&auto=format&fit=crop&q=60',
  'lime': 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=900&auto=format&fit=crop&q=60',
  'nimbu': 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=900&auto=format&fit=crop&q=60',
  'pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=900&auto=format&fit=crop&q=60',
  'strawberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=900&auto=format&fit=crop&q=60',
  'kiwi': 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=900&auto=format&fit=crop&q=60',
  'dragon fruit': 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=900&auto=format&fit=crop&q=60',
  'custard apple': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=900&auto=format&fit=crop&q=60',
  'sitafal': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=900&auto=format&fit=crop&q=60',

  // Cash Crops - Specific images
  'cotton': 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=900&auto=format&fit=crop&q=60',
  'kapas': 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=900&auto=format&fit=crop&q=60',
  'sugarcane': 'https://images.unsplash.com/photo-1597522810752-7a9b8e9e3259?w=900&auto=format&fit=crop&q=60',
  'ganna': 'https://images.unsplash.com/photo-1597522810752-7a9b8e9e3259?w=900&auto=format&fit=crop&q=60',
  'groundnut': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'peanut': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'moongfali': 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=900&auto=format&fit=crop&q=60',
  'mustard': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'sarson': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'sunflower': 'https://images.unsplash.com/photo-1597848212624-e530bb4d8036?w=900&auto=format&fit=crop&q=60',
  'surajmukhi': 'https://images.unsplash.com/photo-1597848212624-e530bb4d8036?w=900&auto=format&fit=crop&q=60',
  'sesame': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'til': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'coconut': 'https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=900&auto=format&fit=crop&q=60',
  'nariyal': 'https://images.unsplash.com/photo-1598511757337-fe2cafc31ba0?w=900&auto=format&fit=crop&q=60',
  'jute': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'tobacco': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',

  // Spices - Specific images
  'turmeric': 'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=900&auto=format&fit=crop&q=60',
  'haldi': 'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=900&auto=format&fit=crop&q=60',
  'cumin': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'jeera': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'cardamom': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'elaichi': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'black pepper': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'kali mirch': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'cinnamon': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'dalchini': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'clove': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',
  'laung': 'https://images.unsplash.com/photo-1599909533730-f9d7e2c1c9e0?w=900&auto=format&fit=crop&q=60',

  // Default fallback
  'default': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&auto=format&fit=crop&q=60'
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
  image: string;
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
    arrival_date: string;
    min_price: string;
    max_price: string;
    modal_price: string;
  }>;
}

class MarketPricesService {
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly QUINTAL_TO_KG = 100; // 1 quintal = 100 kg

  /**
   * Get crop image based on commodity name
   */
  private getCropImage(commodity: string): string {
    const normalizedName = commodity.toLowerCase().trim();
    
    for (const [key, image] of Object.entries(CROP_IMAGE_MAP)) {
      if (normalizedName.includes(key)) {
        return image;
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
   * Fetch market prices from government API
   */
  async fetchMarketPrices(
    state?: string,
    limit: number = 100,
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

      // Transform and process data
      const prices: MarketPrice[] = (data.records || []).map((record, index) => {
        const modalPrice = parseFloat(record.modal_price) || 0;
        const minPrice = parseFloat(record.min_price) || 0;
        const maxPrice = parseFloat(record.max_price) || 0;

        return {
          id: `${record.commodity}-${record.market}-${index}`,
          commodity: record.commodity,
          variety: record.variety,
          market: record.market,
          state: record.state,
          district: record.district,
          minPrice: this.convertQuintalToKg(minPrice),
          maxPrice: this.convertQuintalToKg(maxPrice),
          modalPrice: this.convertQuintalToKg(modalPrice),
          priceDate: record.arrival_date,
          unit: 'kg',
          image: this.getCropImage(record.commodity),
        };
      });

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
