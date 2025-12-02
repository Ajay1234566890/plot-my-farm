import { supabase } from '@/utils/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Call {
    id: string;
    channel: string;
    caller_id: string;
    callee_id: string;
    status: 'ringing' | 'accepted' | 'in_progress' | 'ended' | 'missed' | 'declined';
    started_at?: string;
    ended_at?: string;
    created_at: string;
    metadata?: any;
}

export interface CallAuditEvent {
    id: string;
    call_id: string;
    user_id: string;
    event: 'ring' | 'accept' | 'decline' | 'end' | 'missed' | 'error';
    metadata?: any;
    created_at: string;
}

/**
 * Create a new call
 */
export async function createCall(
    callerId: string,
    calleeId: string,
    channel: string
): Promise<{ data: Call | null; error: any }> {
    try {
        const { data, error } = await supabase
            .from('calls')
            .insert({
                caller_id: callerId,
                callee_id: calleeId,
                channel,
                status: 'ringing',
            })
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

/**
 * Update call status
 */
export async function updateCallStatus(
    callId: string,
    status: Call['status'],
    extra?: Partial<Call>
): Promise<{ error: any }> {
    try {
        const updateData: any = { status };

        if (status === 'accepted' || status === 'in_progress') {
            updateData.started_at = new Date().toISOString();
        }

        if (status === 'ended' || status === 'missed' || status === 'declined') {
            updateData.ended_at = new Date().toISOString();
        }

        if (extra) {
            Object.assign(updateData, extra);
        }

        const { error } = await supabase
            .from('calls')
            .update(updateData)
            .eq('id', callId);

        return { error };
    } catch (error) {
        return { error };
    }
}

/**
 * Get call by ID
 */
export async function getCall(callId: string): Promise<{ data: Call | null; error: any }> {
    try {
        const { data, error } = await supabase
            .from('calls')
            .select('*')
            .eq('id', callId)
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
 * Subscribe to calls for a user
 */
export function subscribeCallsForUser(
    userId: string,
    callback: (call: Call) => void
): RealtimeChannel {
    const channel = supabase
        .channel('calls-subscription')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'calls',
                filter: `callee_id=eq.${userId}`,
            },
            (payload) => {
                if (payload.new) {
                    callback(payload.new as Call);
                }
            }
        )
        .subscribe();

    return channel;
}

/**
 * Unsubscribe from calls
 */
export function unsubscribeFromCalls(channel: RealtimeChannel): void {
    supabase.removeChannel(channel);
}

/**
 * Create audit event
 */
export async function createCallAudit(
    callId: string,
    userId: string,
    event: CallAuditEvent['event'],
    metadata?: any
): Promise<{ error: any }> {
    try {
        const { error } = await supabase
            .from('call_audit')
            .insert({
                call_id: callId,
                user_id: userId,
                event,
                metadata: metadata || {},
            });

        return { error };
    } catch (error) {
        return { error };
    }
}

/**
 * Get user's call history
 */
export async function getCallHistory(
    userId: string,
    limit: number = 50
): Promise<{ data: Call[] | null; error: any }> {
    try {
        const { data, error } = await supabase
            .from('calls')
            .select('*')
            .or(`caller_id.eq.${userId},callee_id.eq.${userId}`)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            return { data: null, error };
        }

        return { data: data || [], error: null };
    } catch (error) {
        return { data: null, error };
    }
}
