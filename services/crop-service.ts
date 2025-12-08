import { supabase } from '@/utils/supabase';
import { imageUploadService } from './image-upload-service';

export interface Crop {
  id: string;
  farmer_id: string;
  name: string;
  crop_type: string;
  description?: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  image_url?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  planting_date?: string;
  expected_harvest_date?: string;
  status: 'growing' | 'ready' | 'harvested' | 'sold';
  certification?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  farmer?: {
    id: string;
    full_name: string;
    phone: string;
    location?: string;
    profile_image_url?: string;
  };
}

export interface CreateCropData {
  farmer_id: string;
  name: string;
  crop_type: string;
  description?: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  image_uri?: string; // Local URI, will be uploaded
  location?: string;
  latitude?: number;
  longitude?: number;
  planting_date?: string;
  expected_harvest_date?: string;
  certification?: string;
}

class CropService {
  /**
   * Create a new crop
   */
  async createCrop(cropData: CreateCropData): Promise<Crop | null> {
    try {
      console.log('🌾 [CROP-SERVICE] Creating crop:', cropData.name);

      // Upload image if provided
      let imageUrl: string | null = null;
      if (cropData.image_uri) {
        console.log('📤 [CROP-SERVICE] Uploading crop image...');
        imageUrl = await imageUploadService.uploadCropImage(
          cropData.image_uri,
          cropData.farmer_id
        );
        if (!imageUrl) {
          console.warn('⚠️ [CROP-SERVICE] Image upload failed, continuing without image');
        }
      }

      // Insert crop into database
      const { data, error } = await supabase
        .from('farmer_crops')
        .insert([
          {
            farmer_id: cropData.farmer_id,
            name: cropData.name,
            crop_type: cropData.crop_type,
            description: cropData.description,
            quantity: cropData.quantity,
            unit: cropData.unit,
            price_per_unit: cropData.price_per_unit,
            image_url: imageUrl,
            location: cropData.location,
            latitude: cropData.latitude,
            longitude: cropData.longitude,
            planting_date: cropData.planting_date,
            expected_harvest_date: cropData.expected_harvest_date,
            status: 'growing',
            certification: cropData.certification,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ [CROP-SERVICE] Create failed:', error);
        return null;
      }

      console.log('✅ [CROP-SERVICE] Crop created:', data.id);
      return data;
    } catch (error) {
      console.error('❌ [CROP-SERVICE] Exception:', error);
      return null;
    }
  }

  /**
   * Get all crops (for buyers to browse)
   */
  async getAllCrops(filters?: {
    status?: string;
    crop_type?: string;
    min_price?: number;
    max_price?: number;
  }): Promise<Crop[]> {
    try {
      console.log('🌾 [CROP-SERVICE] Fetching all crops');

      let query = supabase
        .from('farmer_crops')
        .select(`
          *,
          farmer:farmers(id, full_name, phone, location, profile_image_url)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.crop_type) {
        query = query.eq('crop_type', filters.crop_type);
      }
      if (filters?.min_price) {
        query = query.gte('price_per_unit', filters.min_price);
      }
      if (filters?.max_price) {
        query = query.lte('price_per_unit', filters.max_price);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ [CROP-SERVICE] Fetch failed:', error);
        return [];
      }

      console.log(`✅ [CROP-SERVICE] Fetched ${data.length} crops`);
      return data;
    } catch (error) {
      console.error('❌ [CROP-SERVICE] Exception:', error);
      return [];
    }
  }

  /**
   * Get nearby crops based on user location
   * @param userLocation User's current location
   * @param radiusInMeters Search radius in meters (default: 50km)
   * @returns Array of nearby crops sorted by distance
   */
  async getNearbyCrops(
    userLocation: { latitude: number; longitude: number },
    radiusInMeters: number = 50000
  ): Promise<Crop[]> {
    try {
      console.log('🌾 [CROP-SERVICE] Fetching nearby crops...');
      console.log('📍 User location:', userLocation);
      console.log('📏 Radius:', radiusInMeters / 1000, 'km');

      // Fetch all crops with farmer data
      const { data, error } = await supabase
        .from('farmer_crops')
        .select(`
          *,
          farmer:farmers(id, full_name, phone, location, profile_image_url, latitude, longitude)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [CROP-SERVICE] Fetch failed:', error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log('ℹ️ [CROP-SERVICE] No crops found in database');
        return [];
      }

      // Filter crops by location if they have coordinates
      const cropsWithLocation = data.filter(crop => {
        // Check if crop has direct coordinates
        if (crop.latitude && crop.longitude) {
          return true;
        }
        // Check if farmer has coordinates
        if (crop.farmer?.latitude && crop.farmer?.longitude) {
          return true;
        }
        return false;
      });

      console.log(`📊 [CROP-SERVICE] Crops with location: ${cropsWithLocation.length}/${data.length}`);

      // Calculate distance for each crop and filter by radius
      const cropsWithDistance = cropsWithLocation
        .map(crop => {
          // Use crop coordinates if available, otherwise use farmer coordinates
          const cropLat = crop.latitude || crop.farmer?.latitude;
          const cropLng = crop.longitude || crop.farmer?.longitude;

          if (!cropLat || !cropLng) return null;

          // Calculate distance using Haversine formula
          const R = 6371e3; // Earth's radius in meters
          const φ1 = (userLocation.latitude * Math.PI) / 180;
          const φ2 = (cropLat * Math.PI) / 180;
          const Δφ = ((cropLat - userLocation.latitude) * Math.PI) / 180;
          const Δλ = ((cropLng - userLocation.longitude) * Math.PI) / 180;

          const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          return {
            ...crop,
            distance,
            distanceFormatted: distance < 1000
              ? `${Math.round(distance)} m`
              : `${(distance / 1000).toFixed(1)} km`
          };
        })
        .filter((crop): crop is NonNullable<typeof crop> => crop !== null)
        .filter(crop => crop.distance <= radiusInMeters);

      // Sort by distance (nearest first)
      const sortedCrops = cropsWithDistance.sort((a, b) => a.distance - b.distance);

      console.log(`✅ [CROP-SERVICE] Found ${sortedCrops.length} nearby crops`);
      return sortedCrops;
    } catch (error) {
      console.error('❌ [CROP-SERVICE] Exception:', error);
      return [];
    }
  }

  /**
   * Get crops by farmer ID
   */
  async getCropsByFarmer(farmerId: string): Promise<Crop[]> {
    try {
      console.log('🌾 [CROP-SERVICE] Fetching crops for farmer:', farmerId);

      const { data, error } = await supabase
        .from('farmer_crops')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [CROP-SERVICE] Fetch failed:', error);
        return [];
      }

      console.log(`✅ [CROP-SERVICE] Fetched ${data.length} crops`);
      return data;
    } catch (error) {
      console.error('❌ [CROP-SERVICE] Exception:', error);
      return [];
    }
  }

  /**
   * Get a single crop by ID
   */
  async getCropById(cropId: string): Promise<Crop | null> {
    try {
      const { data, error } = await supabase
        .from('farmer_crops')
        .select(`
          *,
          farmer:farmers(id, full_name, phone, location, profile_image_url)
        `)
        .eq('id', cropId)
        .single();

      if (error) {
        console.error('❌ [CROP-SERVICE] Fetch failed:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ [CROP-SERVICE] Exception:', error);
      return null;
    }
  }

  /**
   * Update a crop
   */
  async updateCrop(
    cropId: string,
    updates: Partial<CreateCropData>
  ): Promise<Crop | null> {
    try {
      console.log('🌾 [CROP-SERVICE] Updating crop:', cropId);

      // Upload new image if provided
      let imageUrl: string | undefined;
      if (updates.image_uri && updates.farmer_id) {
        console.log('📤 [CROP-SERVICE] Uploading new crop image...');
        const uploadedUrl = await imageUploadService.uploadCropImage(
          updates.image_uri,
          updates.farmer_id
        );
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const updateData: any = { ...updates };
      delete updateData.image_uri;
      if (imageUrl) {
        updateData.image_url = imageUrl;
      }
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('farmer_crops')
        .update(updateData)
        .eq('id', cropId)
        .select()
        .single();

      if (error) {
        console.error('❌ [CROP-SERVICE] Update failed:', error);
        return null;
      }

      console.log('✅ [CROP-SERVICE] Crop updated');
      return data;
    } catch (error) {
      console.error('❌ [CROP-SERVICE] Exception:', error);
      return null;
    }
  }

  /**
   * Delete a crop
   */
  async deleteCrop(cropId: string): Promise<boolean> {
    try {
      console.log('🌾 [CROP-SERVICE] Deleting crop:', cropId);

      const { error } = await supabase
        .from('farmer_crops')
        .delete()
        .eq('id', cropId);

      if (error) {
        console.error('❌ [CROP-SERVICE] Delete failed:', error);
        return false;
      }

      console.log('✅ [CROP-SERVICE] Crop deleted');
      return true;
    } catch (error) {
      console.error('❌ [CROP-SERVICE] Exception:', error);
      return false;
    }
  }
}

export const cropService = new CropService();
