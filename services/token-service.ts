import { supabase } from '@/utils/supabase';
import axios from 'axios';

const TOKEN_SERVER_URL = process.env.EXPO_PUBLIC_TOKEN_SERVER_URL || 'https://<your-token-server>';

export interface TokenResponse {
    appId: string;
    token: string;
    channel: string;
    uid: number;
    expiresAt: string;
    ttl: number;
}

/**
 * Fetch Agora RTC token from token server
 */
export async function fetchToken(
    channel: string,
    uid: number,
    role: 'publisher' | 'subscriber' = 'publisher'
): Promise<{ data: TokenResponse | null; error: any }> {
    try {
        // Get current Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            return { data: null, error: new Error('No active session') };
        }

        // Request token from server
        const response = await axios.get(`${TOKEN_SERVER_URL}/api/token`, {
            params: { channel, uid, role },
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
            },
            timeout: 10000, // 10 second timeout
        });

        return { data: response.data, error: null };
    } catch (error) {
        console.error('Token fetch error:', error);
        return { data: null, error };
    }
}

/**
 * Refresh token before expiry
 */
export async function refreshToken(
    channel: string,
    uid: number,
    role: 'publisher' | 'subscriber' = 'publisher'
): Promise<{ data: TokenResponse | null; error: any }> {
    return fetchToken(channel, uid, role);
}
