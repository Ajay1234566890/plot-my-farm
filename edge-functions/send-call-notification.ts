import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Placeholder for FCM Server Key
const FCM_SERVER_KEY = Deno.env.get('FCM_SERVER_KEY') ?? '<YOUR_FCM_SERVER_KEY>';

interface CallPayload {
    record: {
        id: string;
        caller_id: string;
        callee_id: string;
        status: string;
        channel: string;
    };
}

/**
 * Supabase Edge Function to send push notifications for incoming calls
 * Trigger this via Database Webhook on 'INSERT' to public.calls
 */
Deno.serve(async (req) => {
    try {
        const payload: CallPayload = await req.json();
        const { record } = payload;

        // Only notify on 'ringing' status
        if (record.status !== 'ringing') {
            return new Response(JSON.stringify({ message: 'Not a ringing call' }), { status: 200 });
        }

        // 1. Fetch Callee's FCM Token from your users table or profiles table
        // Assuming you have a 'fcm_token' column in 'users' or a separate 'devices' table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('fcm_token, name')
            .eq('id', record.callee_id)
            .single();

        if (userError || !userData?.fcm_token) {
            console.error('Callee has no FCM token');
            return new Response(JSON.stringify({ message: 'No FCM token found' }), { status: 200 });
        }

        // 2. Fetch Caller Name for the notification body
        const { data: callerData } = await supabase
            .from('users')
            .select('name')
            .eq('id', record.caller_id)
            .single();

        const callerName = callerData?.name || 'Someone';

        // 3. Send Push Notification via FCM (Firebase Cloud Messaging)
        const fcmPayload = {
            to: userData.fcm_token,
            notification: {
                title: 'Incoming Video Call',
                body: `${callerName} is calling you...`,
                sound: 'default', // or a custom ringtone
            },
            data: {
                type: 'video_call',
                call_id: record.id,
                channel: record.channel,
                caller_id: record.caller_id,
                caller_name: callerName,
            },
            priority: 'high',
            ttl: 60, // Short TTL for calls
        };

        const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${FCM_SERVER_KEY}`,
            },
            body: JSON.stringify(fcmPayload),
        });

        const fcmResult = await fcmResponse.json();
        console.log('FCM Result:', fcmResult);

        return new Response(JSON.stringify({ message: 'Notification sent', result: fcmResult }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error('Error sending notification:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});
