/**
 * Saved Users Service
 * Manages saved farmers (for buyers) and saved buyers (for farmers)
 * Uses buyer_saved_farmers and farmer_saved_buyers tables (V2 schema)
 */

import { supabase } from '@/utils/supabase';

export interface SavedFarmer {
  id: string;
  buyer_id: string;
  farmer_id: string;
  created_at: string;
}

export interface SavedBuyer {
  id: string;
  farmer_id: string;
  buyer_id: string;
  created_at: string;
}

class SavedUsersService {
  // ============ BUYER OPERATIONS (Saving Farmers) ============
  
  /**
   * Buyer saves a farmer
   */
  async saveFarmer(buyerId: string, farmerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`💾 [SAVED_USERS] Buyer ${buyerId} saving farmer ${farmerId}`);

      const { data, error } = await supabase
        .from('buyer_saved_farmers')
        .insert({
          buyer_id: buyerId,
          farmer_id: farmerId,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          console.log(`⚠️ [SAVED_USERS] Farmer already saved`);
          return { success: true };
        }
        console.error('❌ [SAVED_USERS] Error saving farmer:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [SAVED_USERS] Successfully saved farmer`);
      return { success: true };
    } catch (error) {
      console.error('❌ [SAVED_USERS] Unexpected error:', error);
      return { success: false, error: 'Failed to save farmer' };
    }
  }

  /**
   * Buyer unsaves a farmer
   */
  async unsaveFarmer(buyerId: string, farmerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🗑️ [SAVED_USERS] Buyer ${buyerId} unsaving farmer ${farmerId}`);

      const { error } = await supabase
        .from('buyer_saved_farmers')
        .delete()
        .eq('buyer_id', buyerId)
        .eq('farmer_id', farmerId);

      if (error) {
        console.error('❌ [SAVED_USERS] Error unsaving farmer:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [SAVED_USERS] Successfully unsaved farmer`);
      return { success: true };
    } catch (error) {
      console.error('❌ [SAVED_USERS] Unexpected error:', error);
      return { success: false, error: 'Failed to unsave farmer' };
    }
  }

  /**
   * Get all saved farmers for a buyer
   */
  async getSavedFarmers(buyerId: string): Promise<string[]> {
    try {
      console.log(`📋 [SAVED_USERS] Fetching saved farmers for buyer ${buyerId}`);

      const { data, error } = await supabase
        .from('buyer_saved_farmers')
        .select('farmer_id')
        .eq('buyer_id', buyerId);

      if (error) {
        console.error('❌ [SAVED_USERS] Error fetching saved farmers:', error);
        return [];
      }

      const farmerIds = data?.map(item => item.farmer_id) || [];
      console.log(`✅ [SAVED_USERS] Found ${farmerIds.length} saved farmers`);
      return farmerIds;
    } catch (error) {
      console.error('❌ [SAVED_USERS] Unexpected error:', error);
      return [];
    }
  }

  /**
   * Check if buyer has saved a farmer
   */
  async isFarmerSaved(buyerId: string, farmerId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('buyer_saved_farmers')
        .select('id')
        .eq('buyer_id', buyerId)
        .eq('farmer_id', farmerId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [SAVED_USERS] Error checking saved farmer:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('❌ [SAVED_USERS] Unexpected error:', error);
      return false;
    }
  }

  // ============ FARMER OPERATIONS (Saving Buyers) ============
  
  /**
   * Farmer saves a buyer
   */
  async saveBuyer(farmerId: string, buyerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`💾 [SAVED_USERS] Farmer ${farmerId} saving buyer ${buyerId}`);

      const { data, error } = await supabase
        .from('farmer_saved_buyers')
        .insert({
          farmer_id: farmerId,
          buyer_id: buyerId,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          console.log(`⚠️ [SAVED_USERS] Buyer already saved`);
          return { success: true };
        }
        console.error('❌ [SAVED_USERS] Error saving buyer:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [SAVED_USERS] Successfully saved buyer`);
      return { success: true };
    } catch (error) {
      console.error('❌ [SAVED_USERS] Unexpected error:', error);
      return { success: false, error: 'Failed to save buyer' };
    }
  }

  /**
   * Farmer unsaves a buyer
   */
  async unsaveBuyer(farmerId: string, buyerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🗑️ [SAVED_USERS] Farmer ${farmerId} unsaving buyer ${buyerId}`);

      const { error } = await supabase
        .from('farmer_saved_buyers')
        .delete()
        .eq('farmer_id', farmerId)
        .eq('buyer_id', buyerId);

      if (error) {
        console.error('❌ [SAVED_USERS] Error unsaving buyer:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [SAVED_USERS] Successfully unsaved buyer`);
      return { success: true };
    } catch (error) {
      console.error('❌ [SAVED_USERS] Unexpected error:', error);
      return { success: false, error: 'Failed to unsave buyer' };
    }
  }

  /**
   * Get all saved buyers for a farmer
   */
  async getSavedBuyers(farmerId: string): Promise<string[]> {
    try {
      console.log(`📋 [SAVED_USERS] Fetching saved buyers for farmer ${farmerId}`);

      const { data, error } = await supabase
        .from('farmer_saved_buyers')
        .select('buyer_id')
        .eq('farmer_id', farmerId);

      if (error) {
        console.error('❌ [SAVED_USERS] Error fetching saved buyers:', error);
        return [];
      }

      const buyerIds = data?.map(item => item.buyer_id) || [];
      console.log(`✅ [SAVED_USERS] Found ${buyerIds.length} saved buyers`);
      return buyerIds;
    } catch (error) {
      console.error('❌ [SAVED_USERS] Unexpected error:', error);
      return [];
    }
  }

  /**
   * Check if farmer has saved a buyer
   */
  async isBuyerSaved(farmerId: string, buyerId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('farmer_saved_buyers')
        .select('id')
        .eq('farmer_id', farmerId)
        .eq('buyer_id', buyerId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [SAVED_USERS] Error checking saved buyer:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('❌ [SAVED_USERS] Unexpected error:', error);
      return false;
    }
  }

  /**
   * Toggle saved farmer status
   */
  async toggleSavedFarmer(buyerId: string, farmerId: string): Promise<{ success: boolean; isSaved: boolean; error?: string }> {
    try {
      const isCurrentlySaved = await this.isFarmerSaved(buyerId, farmerId);

      if (isCurrentlySaved) {
        const result = await this.unsaveFarmer(buyerId, farmerId);
        return { ...result, isSaved: false };
      } else {
        const result = await this.saveFarmer(buyerId, farmerId);
        return { ...result, isSaved: true };
      }
    } catch (error) {
      console.error('❌ [SAVED_USERS] Unexpected error:', error);
      return { success: false, isSaved: false, error: 'Failed to toggle saved farmer' };
    }
  }

  /**
   * Toggle saved buyer status
   */
  async toggleSavedBuyer(farmerId: string, buyerId: string): Promise<{ success: boolean; isSaved: boolean; error?: string }> {
    try {
      const isCurrentlySaved = await this.isBuyerSaved(farmerId, buyerId);

      if (isCurrentlySaved) {
        const result = await this.unsaveBuyer(farmerId, buyerId);
        return { ...result, isSaved: false };
      } else {
        const result = await this.saveBuyer(farmerId, buyerId);
        return { ...result, isSaved: true };
      }
    } catch (error) {
      console.error('❌ [SAVED_USERS] Unexpected error:', error);
      return { success: false, isSaved: false, error: 'Failed to toggle saved buyer' };
    }
  }
}

export const savedUsersService = new SavedUsersService();

