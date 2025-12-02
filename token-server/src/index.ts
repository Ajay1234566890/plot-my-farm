import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { authMiddleware } from './middleware/auth';
import { rateLimiter } from './middleware/rateLimiter';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - restrict to your client origin in production
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || '*',
    credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Token generation endpoint
app.get('/api/token', rateLimiter, authMiddleware, (req: Request, res: Response) => {
    try {
        const { channel, uid, role = 'publisher' } = req.query;

        if (!channel || !uid) {
            return res.status(400).json({ error: 'Missing channel or uid parameter' });
        }

        const appId = process.env.AGORA_APP_ID;
        const appCertificate = process.env.AGORA_APP_CERT;
        const tokenTTL = parseInt(process.env.TOKEN_TTL_SECONDS || '120', 10);

        if (!appId || !appCertificate) {
            console.error('Missing AGORA_APP_ID or AGORA_APP_CERT');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const channelName = channel as string;
        const uidNumber = parseInt(uid as string, 10);
        const agoraRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + tokenTTL;

        const token = RtcTokenBuilder.buildTokenWithUid(
            appId,
            appCertificate,
            channelName,
            uidNumber,
            agoraRole,
            privilegeExpiredTs
        );

        res.json({
            appId,
            token,
            channel: channelName,
            uid: uidNumber,
            expiresAt: new Date(privilegeExpiredTs * 1000).toISOString(),
            ttl: tokenTTL
        });
    } catch (error) {
        console.error('Token generation error:', error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Agora Token Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
