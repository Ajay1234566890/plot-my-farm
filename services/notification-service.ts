/**
 * Notification Service
 * Manages user notifications for both buyers and farmers
 * Uses notifications table (V2 schema)
 */

import { supabase } from '@/utils/supabase';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order' | 'offer' | 'message' | 'system' | 'request';
  is_read: boolean;
  related_id?: string;
  created_at: string;
}

class NotificationService {
  /**
   * Create a notification
   */
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'order' | 'offer' | 'message' | 'system' | 'request',
    relatedId?: string
  ): Promise<{ success: boolean; data?: Notification; error?: string }> {
    try {
      console.log(`🔔 [NOTIFICATION] Creating notification for user ${userId}`);

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type,
          related_id: relatedId,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [NOTIFICATION] Error creating notification:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [NOTIFICATION] Notification created successfully`);
      return { success: true, data };
    } catch (error) {
      console.error('❌ [NOTIFICATION] Unexpected error:', error);
      return { success: false, error: 'Failed to create notification' };
    }
  }

  /**
   * Get all notifications for a user
   */
  async getNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    try {
      console.log(`📋 [NOTIFICATION] Fetching notifications for user ${userId}`);

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId);

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [NOTIFICATION] Error fetching notifications:', error);
        return [];
      }

      console.log(`✅ [NOTIFICATION] Found ${data?.length || 0} notifications`);
      return data || [];
    } catch (error) {
      console.error('❌ [NOTIFICATION] Unexpected error:', error);
      return [];
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ [NOTIFICATION] Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('❌ [NOTIFICATION] Unexpected error:', error);
      return 0;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`✅ [NOTIFICATION] Marking notification ${notificationId} as read`);

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('❌ [NOTIFICATION] Error marking as read:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [NOTIFICATION] Notification marked as read`);
      return { success: true };
    } catch (error) {
      console.error('❌ [NOTIFICATION] Unexpected error:', error);
      return { success: false, error: 'Failed to mark notification as read' };
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`✅ [NOTIFICATION] Marking all notifications as read for user ${userId}`);

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ [NOTIFICATION] Error marking all as read:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [NOTIFICATION] All notifications marked as read`);
      return { success: true };
    } catch (error) {
      console.error('❌ [NOTIFICATION] Unexpected error:', error);
      return { success: false, error: 'Failed to mark all notifications as read' };
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🗑️ [NOTIFICATION] Deleting notification ${notificationId}`);

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) {
        console.error('❌ [NOTIFICATION] Error deleting notification:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [NOTIFICATION] Notification deleted`);
      return { success: true };
    } catch (error) {
      console.error('❌ [NOTIFICATION] Unexpected error:', error);
      return { success: false, error: 'Failed to delete notification' };
    }
  }
}

export const notificationService = new NotificationService();

