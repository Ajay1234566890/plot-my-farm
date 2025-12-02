import { useAuth } from '@/contexts/auth-context';
import { Call, subscribeCallsForUser, unsubscribeFromCalls, updateCallStatus } from '@/services/supabase-calls';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const CALL_TIMEOUT_MS = 30000; // 30 seconds

export function useIncomingCallSubscription() {
    const { user } = useAuth();
    const [incomingCall, setIncomingCall] = useState<Call | null>(null);
    const [callTimeoutId, setCallTimeoutId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        let subscription: RealtimeChannel | null = null;

        const setupSubscription = () => {
            subscription = subscribeCallsForUser(user.id, (call) => {
                // Only show incoming calls that are ringing
                if (call.status === 'ringing' && call.callee_id === user.id) {
                    setIncomingCall(call);

                    // Auto-decline after timeout
                    const timeoutId = setTimeout(() => {
                        handleMissedCall(call);
                    }, CALL_TIMEOUT_MS);

                    setCallTimeoutId(timeoutId);
                }

                // Clear incoming call if status changed
                if (call.id === incomingCall?.id && call.status !== 'ringing') {
                    clearIncomingCall();
                }
            });
        };

        setupSubscription();

        return () => {
            if (subscription) {
                unsubscribeFromCalls(subscription);
            }
            if (callTimeoutId) {
                clearTimeout(callTimeoutId);
            }
        };
    }, [user?.id]);

    /**
     * Handle missed call
     */
    const handleMissedCall = async (call: Call) => {
        try {
            await updateCallStatus(call.id, 'missed');
            clearIncomingCall();
        } catch (error) {
            console.error('Handle missed call error:', error);
        }
    };

    /**
     * Clear incoming call state
     */
    const clearIncomingCall = () => {
        if (callTimeoutId) {
            clearTimeout(callTimeoutId);
            setCallTimeoutId(null);
        }
        setIncomingCall(null);
    };

    return {
        incomingCall,
        clearIncomingCall,
    };
}
