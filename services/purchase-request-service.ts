/**
 * Purchase Request Service
 * Manages buyer purchase requests to farmers
 * Uses buyer_purchase_requests table (V2 schema)
 */

import { supabase } from '@/utils/supabase';

export interface PurchaseRequest {
  id: string;
  buyer_id: string;
  crop_type: string;
  quantity: number;
  unit: string;
  target_price?: number;
  delivery_location?: string;
  delivery_date?: string;
  description?: string;
  status: 'open' | 'responded' | 'closed';
  created_at: string;
  updated_at: string;
}

class PurchaseRequestService {
  /**
   * Create a new purchase request
   */
  async createRequest(request: Omit<PurchaseRequest, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<{ success: boolean; data?: PurchaseRequest; error?: string }> {
    try {
      console.log(`📝 [PURCHASE_REQUEST] Creating request for ${request.crop_type}`);

      const { data, error } = await supabase
        .from('buyer_purchase_requests')
        .insert({
          ...request,
          status: 'open',
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [PURCHASE_REQUEST] Error creating request:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [PURCHASE_REQUEST] Successfully created request ${data.id}`);
      return { success: true, data };
    } catch (error) {
      console.error('❌ [PURCHASE_REQUEST] Unexpected error:', error);
      return { success: false, error: 'Failed to create purchase request' };
    }
  }

  /**
   * Get all requests for a buyer
   */
  async getBuyerRequests(buyerId: string): Promise<PurchaseRequest[]> {
    try {
      console.log(`📋 [PURCHASE_REQUEST] Fetching requests for buyer ${buyerId}`);

      const { data, error } = await supabase
        .from('buyer_purchase_requests')
        .select('*')
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [PURCHASE_REQUEST] Error fetching requests:', error);
        return [];
      }

      console.log(`✅ [PURCHASE_REQUEST] Found ${data?.length || 0} requests`);
      return data || [];
    } catch (error) {
      console.error('❌ [PURCHASE_REQUEST] Unexpected error:', error);
      return [];
    }
  }

  /**
   * Get all open requests (for farmers to browse)
   */
  async getOpenRequests(filters?: { crop_type?: string; location?: string }): Promise<PurchaseRequest[]> {
    try {
      console.log(`📋 [PURCHASE_REQUEST] Fetching open requests`);

      let query = supabase
        .from('buyer_purchase_requests')
        .select('*')
        .eq('status', 'open');

      if (filters?.crop_type) {
        query = query.eq('crop_type', filters.crop_type);
      }

      if (filters?.location) {
        query = query.ilike('delivery_location', `%${filters.location}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [PURCHASE_REQUEST] Error fetching open requests:', error);
        return [];
      }

      console.log(`✅ [PURCHASE_REQUEST] Found ${data?.length || 0} open requests`);
      return data || [];
    } catch (error) {
      console.error('❌ [PURCHASE_REQUEST] Unexpected error:', error);
      return [];
    }
  }

  /**
   * Update request status
   */
  async updateStatus(requestId: string, status: 'open' | 'responded' | 'closed'): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`📝 [PURCHASE_REQUEST] Updating request ${requestId} status to ${status}`);

      const { error } = await supabase
        .from('buyer_purchase_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) {
        console.error('❌ [PURCHASE_REQUEST] Error updating status:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [PURCHASE_REQUEST] Successfully updated status`);
      return { success: true };
    } catch (error) {
      console.error('❌ [PURCHASE_REQUEST] Unexpected error:', error);
      return { success: false, error: 'Failed to update status' };
    }
  }

  /**
   * Delete a request
   */
  async deleteRequest(requestId: string, buyerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🗑️ [PURCHASE_REQUEST] Deleting request ${requestId}`);

      const { error } = await supabase
        .from('buyer_purchase_requests')
        .delete()
        .eq('id', requestId)
        .eq('buyer_id', buyerId);

      if (error) {
        console.error('❌ [PURCHASE_REQUEST] Error deleting request:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [PURCHASE_REQUEST] Successfully deleted request`);
      return { success: true };
    } catch (error) {
      console.error('❌ [PURCHASE_REQUEST] Unexpected error:', error);
      return { success: false, error: 'Failed to delete request' };
    }
  }
}

export const purchaseRequestService = new PurchaseRequestService();

