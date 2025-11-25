/**
 * Request Response Service
 * Manages farmer responses to buyer purchase requests
 * Uses farmer_request_responses table (V2 schema)
 */

import { supabase } from '@/utils/supabase';

export interface RequestResponse {
  id: string;
  request_id: string;
  farmer_id: string;
  offered_price: number;
  offered_quantity: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

class RequestResponseService {
  /**
   * Create a response to a purchase request
   */
  async createResponse(response: Omit<RequestResponse, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<{ success: boolean; data?: RequestResponse; error?: string }> {
    try {
      console.log(`📝 [REQUEST_RESPONSE] Creating response for request ${response.request_id}`);

      const { data, error } = await supabase
        .from('farmer_request_responses')
        .insert({
          ...response,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [REQUEST_RESPONSE] Error creating response:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [REQUEST_RESPONSE] Successfully created response ${data.id}`);
      return { success: true, data };
    } catch (error) {
      console.error('❌ [REQUEST_RESPONSE] Unexpected error:', error);
      return { success: false, error: 'Failed to create response' };
    }
  }

  /**
   * Get all responses for a specific purchase request
   */
  async getResponsesForRequest(requestId: string): Promise<RequestResponse[]> {
    try {
      console.log(`📋 [REQUEST_RESPONSE] Fetching responses for request ${requestId}`);

      const { data, error } = await supabase
        .from('farmer_request_responses')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [REQUEST_RESPONSE] Error fetching responses:', error);
        return [];
      }

      console.log(`✅ [REQUEST_RESPONSE] Found ${data?.length || 0} responses`);
      return data || [];
    } catch (error) {
      console.error('❌ [REQUEST_RESPONSE] Unexpected error:', error);
      return [];
    }
  }

  /**
   * Get all responses from a farmer
   */
  async getFarmerResponses(farmerId: string): Promise<RequestResponse[]> {
    try {
      console.log(`📋 [REQUEST_RESPONSE] Fetching responses from farmer ${farmerId}`);

      const { data, error } = await supabase
        .from('farmer_request_responses')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [REQUEST_RESPONSE] Error fetching farmer responses:', error);
        return [];
      }

      console.log(`✅ [REQUEST_RESPONSE] Found ${data?.length || 0} responses`);
      return data || [];
    } catch (error) {
      console.error('❌ [REQUEST_RESPONSE] Unexpected error:', error);
      return [];
    }
  }

  /**
   * Update response status (buyer accepts/rejects)
   */
  async updateStatus(responseId: string, status: 'accepted' | 'rejected'): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`📝 [REQUEST_RESPONSE] Updating response ${responseId} status to ${status}`);

      const { error } = await supabase
        .from('farmer_request_responses')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', responseId);

      if (error) {
        console.error('❌ [REQUEST_RESPONSE] Error updating status:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [REQUEST_RESPONSE] Successfully updated status`);
      return { success: true };
    } catch (error) {
      console.error('❌ [REQUEST_RESPONSE] Unexpected error:', error);
      return { success: false, error: 'Failed to update status' };
    }
  }

  /**
   * Delete a response
   */
  async deleteResponse(responseId: string, farmerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🗑️ [REQUEST_RESPONSE] Deleting response ${responseId}`);

      const { error } = await supabase
        .from('farmer_request_responses')
        .delete()
        .eq('id', responseId)
        .eq('farmer_id', farmerId);

      if (error) {
        console.error('❌ [REQUEST_RESPONSE] Error deleting response:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [REQUEST_RESPONSE] Successfully deleted response`);
      return { success: true };
    } catch (error) {
      console.error('❌ [REQUEST_RESPONSE] Unexpected error:', error);
      return { success: false, error: 'Failed to delete response' };
    }
  }
}

export const requestResponseService = new RequestResponseService();

