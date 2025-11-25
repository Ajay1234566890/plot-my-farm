import { supabase } from '@/utils/supabase';

export interface WishlistItem {
  id: string;
  buyer_id: string;
  crop_id: number;
  created_at: string;
}

class WishlistService {
  /**
   * Add a crop to the user's wishlist
   */
  async addToWishlist(buyerId: string, cropId: number): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`💝 [WISHLIST] Adding crop ${cropId} to wishlist for buyer ${buyerId}`);
      
      const { data, error } = await supabase
        .from('buyer_wishlist')
        .insert({
          buyer_id: buyerId,
          crop_id: cropId,
        })
        .select()
        .single();

      if (error) {
        // Check if it's a duplicate entry error
        if (error.code === '23505') {
          console.log(`⚠️ [WISHLIST] Crop ${cropId} already in wishlist`);
          return { success: true }; // Already in wishlist, treat as success
        }
        console.error('❌ [WISHLIST] Error adding to wishlist:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [WISHLIST] Successfully added crop ${cropId} to wishlist`);
      return { success: true };
    } catch (error) {
      console.error('❌ [WISHLIST] Unexpected error:', error);
      return { success: false, error: 'Failed to add to wishlist' };
    }
  }

  /**
   * Remove a crop from the user's wishlist
   */
  async removeFromWishlist(buyerId: string, cropId: number): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`💔 [WISHLIST] Removing crop ${cropId} from wishlist for buyer ${buyerId}`);
      
      const { error } = await supabase
        .from('buyer_wishlist')
        .delete()
        .eq('buyer_id', buyerId)
        .eq('crop_id', cropId);

      if (error) {
        console.error('❌ [WISHLIST] Error removing from wishlist:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [WISHLIST] Successfully removed crop ${cropId} from wishlist`);
      return { success: true };
    } catch (error) {
      console.error('❌ [WISHLIST] Unexpected error:', error);
      return { success: false, error: 'Failed to remove from wishlist' };
    }
  }

  /**
   * Check if a crop is in the user's wishlist
   */
  async isInWishlist(buyerId: string, cropId: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('buyer_wishlist')
        .select('id')
        .eq('buyer_id', buyerId)
        .eq('crop_id', cropId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ [WISHLIST] Error checking wishlist:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('❌ [WISHLIST] Unexpected error:', error);
      return false;
    }
  }

  /**
   * Get all wishlist items for a buyer
   */
  async getWishlist(buyerId: string): Promise<number[]> {
    try {
      const { data, error } = await supabase
        .from('buyer_wishlist')
        .select('crop_id')
        .eq('buyer_id', buyerId);

      if (error) {
        console.error('❌ [WISHLIST] Error fetching wishlist:', error);
        return [];
      }

      return data?.map(item => item.crop_id) || [];
    } catch (error) {
      console.error('❌ [WISHLIST] Unexpected error:', error);
      return [];
    }
  }

  /**
   * Toggle wishlist status for a crop
   */
  async toggleWishlist(buyerId: string, cropId: number): Promise<{ success: boolean; isInWishlist: boolean; error?: string }> {
    try {
      const isCurrentlyInWishlist = await this.isInWishlist(buyerId, cropId);
      
      if (isCurrentlyInWishlist) {
        const result = await this.removeFromWishlist(buyerId, cropId);
        return { ...result, isInWishlist: false };
      } else {
        const result = await this.addToWishlist(buyerId, cropId);
        return { ...result, isInWishlist: true };
      }
    } catch (error) {
      console.error('❌ [WISHLIST] Unexpected error:', error);
      return { success: false, isInWishlist: false, error: 'Failed to toggle wishlist' };
    }
  }
}

export const wishlistService = new WishlistService();

