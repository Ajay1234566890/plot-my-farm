/**
 * Cart Service
 * Manages buyer shopping cart operations
 * Updated to use buyer_cart_items table (V2 schema)
 */

import { supabase } from '@/utils/supabase';

export interface CartItem {
  id: string;
  buyer_id: string;
  farmer_offer_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithDetails extends CartItem {
  offer?: {
    id: string;
    title: string;
    price: number;
    image_url?: string;
    farmer_id: string;
  };
}

class CartService {
  /**
   * Add an item to the cart
   */
  async addToCart(buyerId: string, offerId: string, quantity: number): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🛒 [CART] Adding offer ${offerId} to cart for buyer ${buyerId}`);

      const { data, error } = await supabase
        .from('buyer_cart_items')
        .insert({
          buyer_id: buyerId,
          farmer_offer_id: offerId,
          quantity: quantity,
        })
        .select()
        .single();

      if (error) {
        // Check if it's a duplicate entry error
        if (error.code === '23505') {
          console.log(`⚠️ [CART] Offer ${offerId} already in cart, updating quantity`);
          return await this.updateQuantity(buyerId, offerId, quantity);
        }
        console.error('❌ [CART] Error adding to cart:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [CART] Successfully added offer ${offerId} to cart`);
      return { success: true };
    } catch (error) {
      console.error('❌ [CART] Unexpected error:', error);
      return { success: false, error: 'Failed to add to cart' };
    }
  }

  /**
   * Remove an item from the cart
   */
  async removeFromCart(buyerId: string, offerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🗑️ [CART] Removing offer ${offerId} from cart for buyer ${buyerId}`);

      const { error } = await supabase
        .from('buyer_cart_items')
        .delete()
        .eq('buyer_id', buyerId)
        .eq('farmer_offer_id', offerId);

      if (error) {
        console.error('❌ [CART] Error removing from cart:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [CART] Successfully removed offer ${offerId} from cart`);
      return { success: true };
    } catch (error) {
      console.error('❌ [CART] Unexpected error:', error);
      return { success: false, error: 'Failed to remove from cart' };
    }
  }

  /**
   * Update quantity of an item in the cart
   */
  async updateQuantity(buyerId: string, offerId: string, quantity: number): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`📝 [CART] Updating quantity for offer ${offerId} to ${quantity}`);

      const { error } = await supabase
        .from('buyer_cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('buyer_id', buyerId)
        .eq('farmer_offer_id', offerId);

      if (error) {
        console.error('❌ [CART] Error updating quantity:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [CART] Successfully updated quantity`);
      return { success: true };
    } catch (error) {
      console.error('❌ [CART] Unexpected error:', error);
      return { success: false, error: 'Failed to update quantity' };
    }
  }

  /**
   * Get all cart items for a buyer
   */
  async getCart(buyerId: string): Promise<CartItem[]> {
    try {
      console.log(`📋 [CART] Fetching cart for buyer ${buyerId}`);

      const { data, error } = await supabase
        .from('buyer_cart_items')
        .select('*')
        .eq('buyer_id', buyerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [CART] Error fetching cart:', error);
        return [];
      }

      console.log(`✅ [CART] Found ${data?.length || 0} items in cart`);
      return data || [];
    } catch (error) {
      console.error('❌ [CART] Unexpected error:', error);
      return [];
    }
  }

  /**
   * Clear all items from the cart
   */
  async clearCart(buyerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🧹 [CART] Clearing cart for buyer ${buyerId}`);

      const { error } = await supabase
        .from('buyer_cart_items')
        .delete()
        .eq('buyer_id', buyerId);

      if (error) {
        console.error('❌ [CART] Error clearing cart:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [CART] Successfully cleared cart`);
      return { success: true };
    } catch (error) {
      console.error('❌ [CART] Unexpected error:', error);
      return { success: false, error: 'Failed to clear cart' };
    }
  }
}

export const cartService = new CartService();

