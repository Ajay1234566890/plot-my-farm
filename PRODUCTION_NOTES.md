# Production & Security Notes

## Security Checklist

- [ ] **Secure Secrets**: NEVER embed `AGORA_APP_CERT` in the React Native client. It must only exist on the secure Token Server.
- [ ] **HTTPS**: Deploy the Token Server with HTTPS enabled.
- [ ] **Auth Validation**: Ensure the Token Server validates the `Authorization: Bearer <token>` header against Supabase Auth for every request.
- [ ] **Short TTL**: Keep `TOKEN_TTL_SECONDS` short (e.g., 120s - 300s) to minimize risk if a token is leaked. Implement client-side refresh logic if calls last longer than privilege expiry (though Agora tokens usually cover the session join, privilege expiry is different).
- [ ] **Rate Limiting**: The Token Server includes `express-rate-limit`. Adjust the window and max requests based on expected traffic to prevent abuse.
- [ ] **RLS Policies**: Verify Supabase RLS policies for `calls` and `call_audit` tables are active and correctly restrict access to only participants.

## Production Deployment

- [ ] **Token Server**: Deploy to Vercel, AWS Lambda, or a container service (Docker provided). Set environment variables in the deployment platform.
- [ ] **Supabase**: Run the `supabase/video-calls-schema.sql` migration in your production database. Enable Realtime for the `calls` table.
- [ ] **Push Notifications**: Deploy the Edge Function for push notifications. Configure Apple APNs and Google FCM credentials in your Supabase project or Firebase project.
- [ ] **Logging**: Enable structured logging on the Token Server to track token generation requests and errors.

## Client-Side Optimization

- [ ] **Permissions**: Ensure `react-native-permissions` is correctly configured for Camera and Microphone on both iOS (Info.plist) and Android (AndroidManifest.xml).
- [ ] **Background Modes**: For iOS, enable "Voice over IP" background mode if you want calls to ring while the app is backgrounded (requires CallKit integration, which is an advanced step beyond this basic implementation).
- [ ] **Network Handling**: Handle network disconnections gracefully in `agoraService` event listeners.

## Monitoring

- [ ] **Agora Console**: Use Agora Analytics to monitor call quality and usage.
- [ ] **Supabase Logs**: Monitor Edge Function logs for push notification delivery status.
