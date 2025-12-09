import { supabase } from '@/utils/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

// =====================================================
// TYPES
// =====================================================

export interface ChatUser {
  id: string;
  name: string;
  role: 'farmer' | 'buyer';
  phone?: string;
  avatar?: string;
}

export interface Chat {
  id: string;
  farmer_id: string;
  buyer_id: string;
  last_message?: string;
  updated_at: string;
  created_at: string;
  other_user?: ChatUser;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  text: string;
  image_url?: string;
  created_at: string;
}

// =====================================================
// CHAT MANAGEMENT
// =====================================================

/**
 * Create or get existing chat between farmer and buyer
 */
export async function createOrGetChat(
  farmerId: string,
  buyerId: string
): Promise<{ data: Chat | null; error: any }> {
  try {
    // First, try to get existing chat
    const { data: existingChat, error: fetchError } = await supabase
      .from('chats')
      .select('*')
      .eq('farmer_id', farmerId)
      .eq('buyer_id', buyerId)
      .single();

    if (existingChat) {
      return { data: existingChat, error: null };
    }

    // If no existing chat, create new one
    const { data: newChat, error: createError } = await supabase
      .from('chats')
      .insert({
        farmer_id: farmerId,
        buyer_id: buyerId,
        last_message: null,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      return { data: null, error: createError };
    }

    return { data: newChat, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get all chats for a user
 */
export async function getChats(userId: string): Promise<{ data: Chat[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        farmer:users!chats_farmer_id_fkey(id, name, role, phone, avatar),
        buyer:users!chats_buyer_id_fkey(id, name, role, phone, avatar)
      `)
      .or(`farmer_id.eq.${userId},buyer_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      return { data: null, error };
    }

    // Map to include other_user
    const chatsWithOtherUser = data?.map((chat: any) => ({
      ...chat,
      other_user: chat.farmer_id === userId ? chat.buyer : chat.farmer,
    }));

    return { data: chatsWithOtherUser || [], error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Subscribe to chat list updates
 */
export function subscribeChatList(
  userId: string,
  callback: (chat: Chat) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`chats-for-user-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chats',
        filter: `farmer_id=eq.${userId}`,
      },
      async (payload) => {
        if (payload.new) {
          // Fetch full chat data with user info
          const { data } = await supabase
            .from('chats')
            .select(`
              *,
              farmer:users!chats_farmer_id_fkey(id, name, role, phone, avatar),
              buyer:users!chats_buyer_id_fkey(id, name, role, phone, avatar)
            `)
            .eq('id', (payload.new as any).id)
            .single();

          if (data) {
            callback({
              ...data,
              other_user: data.farmer_id === userId ? data.buyer : data.farmer,
            });
          }
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chats',
        filter: `buyer_id=eq.${userId}`,
      },
      async (payload) => {
        if (payload.new) {
          // Fetch full chat data with user info
          const { data } = await supabase
            .from('chats')
            .select(`
              *,
              farmer:users!chats_farmer_id_fkey(id, name, role, phone, avatar),
              buyer:users!chats_buyer_id_fkey(id, name, role, phone, avatar)
            `)
            .eq('id', (payload.new as any).id)
            .single();

          if (data) {
            callback({
              ...data,
              other_user: data.farmer_id === userId ? data.buyer : data.farmer,
            });
          }
        }
      }
    )
    .subscribe();

  return channel;
}

// =====================================================
// MESSAGE MANAGEMENT
// =====================================================

/**
 * Get all messages for a chat
 */
export async function getMessages(chatId: string): Promise<{ data: Message[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      return { data: null, error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Send a message
 */
export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string,
  imageUrl?: string
): Promise<{ data: Message | null; error: any }> {
  try {
    // Insert message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        text: text,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (messageError) {
      return { data: null, error: messageError };
    }

    // Update chat's last_message and updated_at
    const lastMessageText = imageUrl ? (text ? `📷 ${text}` : '📷 Image') : text;
    const { error: updateError } = await supabase
      .from('chats')
      .update({
        last_message: lastMessageText,
        updated_at: new Date().toISOString(),
      })
      .eq('id', chatId);

    if (updateError) {
      console.error('Error updating chat:', updateError);
    }

    return { data: message, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Subscribe to new messages in a chat
 */
export function subscribeMessages(
  chatId: string,
  callback: (message: Message) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`chat-${chatId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        if (payload.new) {
          callback(payload.new as Message);
        }
      }
    )
    .subscribe();

  return channel;
}

/**
 * Unsubscribe from a channel
 */
export function unsubscribe(channel: RealtimeChannel): void {
  supabase.removeChannel(channel);
}

// =====================================================
// USER MANAGEMENT
// =====================================================

/**
 * Get user by ID
 */
export async function getUser(userId: string): Promise<{ data: ChatUser | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Create or update user in users table
 */
export async function upsertUser(user: ChatUser): Promise<{ data: ChatUser | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(user, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Format timestamp to relative time (Yesterday, Wed, Tue, etc.)
 */
export function formatChatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    // Today - show time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    // This week - show day name
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    // Older - show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}
