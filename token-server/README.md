# Agora Token Server

Secure token generation server for Agora RTC video calls.

## Features
- Short-lived RTC tokens (default 120s TTL)
- Supabase JWT authentication
- Rate limiting (10 req/min per IP)
- CORS protection
- Production-ready

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in values:
```bash
cp .env.example .env
```

3. Build:
```bash
npm run build
```

4. Start:
```bash
npm start
```

## Development

```bash
npm run dev
```

## Deployment

### Docker
```bash
docker build -t agora-token-server .
docker run -p 3001:3001 --env-file .env agora-token-server
```

### Vercel
```bash
vercel --prod
```

Set environment variables in Vercel dashboard.

## API

### GET /api/token
Generate Agora RTC token

**Headers:**
- `Authorization: Bearer <supabase_jwt>`

**Query Params:**
- `channel` (required): Channel name
- `uid` (required): User ID (numeric)
- `role` (optional): 'publisher' or 'subscriber' (default: 'publisher')

**Response:**
```json
{
  "appId": "xxx",
  "token": "xxx",
  "channel": "call_123",
  "uid": 12345,
  "expiresAt": "2024-01-01T00:02:00.000Z",
  "ttl": 120
}
```

## Security Notes

- Never expose `AGORA_APP_CERT` to client
- Use HTTPS in production
- Validate JWT on every request
- Monitor rate limits
- Rotate secrets regularly
- Enable logging and monitoring
