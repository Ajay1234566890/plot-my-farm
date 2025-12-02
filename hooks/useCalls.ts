import { useAuth } from '@/contexts/auth-context';
import agoraService from '@/services/agora-service';
import { Call, createCall, updateCallStatus } from '@/services/supabase-calls';
import { fetchToken } from '@/services/token-service';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export function useCalls() {
    const { user } = useAuth();
    const router = useRouter();
    const [currentCall, setCurrentCall] = useState<Call | null>(null);
    const [isInitiating, setIsInitiating] = useState(false);

    /**
     * Generate deterministic channel name
     */
    const generateChannelName = (userId1: string, userId2: string): string => {
        const sorted = [userId1, userId2].sort();
        const timestamp = Date.now();
        return `call_${sorted[0]}_${sorted[1]}_${timestamp}`;
    };

    /**
     * Start a new call
     */
    const startCall = async (calleeId: string, calleeName: string, calleeAvatar?: string) => {
        if (!user?.id) {
            Alert.alert('Error', 'You must be logged in to make calls');
            return;
        }

        if (isInitiating) {
            return;
        }

        try {
            setIsInitiating(true);

            // Generate channel name
            const channel = generateChannelName(user.id, calleeId);
            const uid = parseInt(user.id.replace(/-/g, '').substring(0, 10), 16);

            // Create call record
            const { data: call, error: callError } = await createCall(user.id, calleeId, channel);

            if (callError || !call) {
                throw new Error('Failed to create call');
            }

            setCurrentCall(call);

            // Fetch token
            const { data: tokenData, error: tokenError } = await fetchToken(channel, uid, 'publisher');

            if (tokenError || !tokenData) {
                throw new Error('Failed to fetch token');
            }

            // Initialize Agora
            await agoraService.init(tokenData.appId);

            // Navigate to video call screen
            router.push({
                pathname: '/video-call-screen',
                params: {
                    callId: call.id,
                    channel: channel,
                    token: tokenData.token,
                    uid: uid.toString(),
                    isInitiator: 'true',
                    otherUserId: calleeId,
                    otherUserName: calleeName,
                    otherUserAvatar: calleeAvatar || '',
                },
            });
        } catch (error) {
            console.error('Start call error:', error);
            Alert.alert('Error', 'Failed to start call. Please try again.');

            if (currentCall) {
                await updateCallStatus(currentCall.id, 'ended');
            }

            setCurrentCall(null);
        } finally {
            setIsInitiating(false);
        }
    };

    /**
     * Accept incoming call
     */
    const acceptCall = async (call: Call, callerName: string, callerAvatar?: string) => {
        if (!user?.id) {
            return;
        }

        try {
            const uid = parseInt(user.id.replace(/-/g, '').substring(0, 10), 16);

            // Update call status
            await updateCallStatus(call.id, 'accepted');

            // Fetch token
            const { data: tokenData, error: tokenError } = await fetchToken(
                call.channel,
                uid,
                'publisher'
            );

            if (tokenError || !tokenData) {
                throw new Error('Failed to fetch token');
            }

            // Initialize Agora
            await agoraService.init(tokenData.appId);

            setCurrentCall(call);

            // Navigate to video call screen
            router.push({
                pathname: '/video-call-screen',
                params: {
                    callId: call.id,
                    channel: call.channel,
                    token: tokenData.token,
                    uid: uid.toString(),
                    isInitiator: 'false',
                    otherUserId: call.caller_id,
                    otherUserName: callerName,
                    otherUserAvatar: callerAvatar || '',
                },
            });
        } catch (error) {
            console.error('Accept call error:', error);
            Alert.alert('Error', 'Failed to accept call');
            await updateCallStatus(call.id, 'ended');
        }
    };

    /**
     * Decline incoming call
     */
    const declineCall = async (call: Call) => {
        try {
            await updateCallStatus(call.id, 'declined');
            setCurrentCall(null);
        } catch (error) {
            console.error('Decline call error:', error);
        }
    };

    /**
     * End current call
     */
    const endCall = async (callId: string) => {
        try {
            await updateCallStatus(callId, 'ended');
            await agoraService.leaveChannel();
            setCurrentCall(null);
        } catch (error) {
            console.error('End call error:', error);
        }
    };

    return {
        currentCall,
        isInitiating,
        startCall,
        acceptCall,
        declineCall,
        endCall,
    };
}
