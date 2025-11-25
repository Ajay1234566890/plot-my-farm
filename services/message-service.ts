/**
 * Message Service
 * Manages direct messaging between users (buyers and farmers)
 * Uses messages table (V2 schema)
 */

import { supabase } from '@/utils/supabase';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar?: string;
  other_user_role: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

class MessageService {
  /**
   * Send a message
   */
  async sendMessage(senderId: string, receiverId: string, content: string): Promise<{ success: boolean; data?: Message; error?: string }> {
    try {
      console.log(`📤 [MESSAGE] Sending message from ${senderId} to ${receiverId}`);

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          content: content,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ [MESSAGE] Error sending message:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [MESSAGE] Message sent successfully`);
      return { success: true, data };
    } catch (error) {
      console.error('❌ [MESSAGE] Unexpected error:', error);
      return { success: false, error: 'Failed to send message' };
    }
  }

  /**
   * Get conversation between two users
   */
  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    try {
      console.log(`📋 [MESSAGE] Fetching conversation between ${userId1} and ${userId2}`);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ [MESSAGE] Error fetching conversation:', error);
        return [];
      }

      console.log(`✅ [MESSAGE] Found ${data?.length || 0} messages`);
      return data || [];
    } catch (error) {
      console.error('❌ [MESSAGE] Unexpected error:', error);
      return [];
    }
  }

  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      console.log(`📋 [MESSAGE] Fetching conversations for user ${userId}`);

      // Get all messages where user is sender or receiver
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*, sender:users!sender_id(id, name, avatar_url, role), receiver:users!receiver_id(id, name, avatar_url, role)')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [MESSAGE] Error fetching conversations:', error);
        return [];
      }

      // Group messages by conversation partner
      const conversationsMap = new Map<string, Conversation>();
      
      messages?.forEach((msg: any) => {
        const isReceiver = msg.receiver_id === userId;
        const otherUser = isReceiver ? msg.sender : msg.receiver;
        const otherUserId = otherUser.id;

        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            id: otherUserId,
            other_user_id: otherUserId,
            other_user_name: otherUser.name || 'Unknown',
            other_user_avatar: otherUser.avatar_url,
            other_user_role: otherUser.role || 'user',
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: 0,
          });
        }

        // Count unread messages
        if (msg.receiver_id === userId && !msg.is_read) {
          const conv = conversationsMap.get(otherUserId)!;
          conv.unread_count++;
        }
      });

      const conversations = Array.from(conversationsMap.values());
      console.log(`✅ [MESSAGE] Found ${conversations.length} conversations`);
      return conversations;
    } catch (error) {
      console.error('❌ [MESSAGE] Unexpected error:', error);
      return [];
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(userId: string, senderId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`✅ [MESSAGE] Marking messages as read from ${senderId} to ${userId}`);

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('receiver_id', userId)
        .eq('sender_id', senderId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ [MESSAGE] Error marking as read:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ [MESSAGE] Messages marked as read`);
      return { success: true };
    } catch (error) {
      console.error('❌ [MESSAGE] Unexpected error:', error);
      return { success: false, error: 'Failed to mark messages as read' };
    }
  }
}

export const messageService = new MessageService();

