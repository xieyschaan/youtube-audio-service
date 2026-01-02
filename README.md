# YouTube Audio Extraction Service

A simple Node.js service for extracting audio from YouTube videos. This service is designed to work with the Chop app's automatic transcription feature.

## Quick Deploy

### Option 1: Railway (Easiest)

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect this folder/repo
4. Railway will auto-detect Node.js and deploy
5. Copy the deployed URL
6. Set in Supabase: `npx supabase secrets set YOUTUBE_AUDIO_SERVICE_URL=https://your-app.railway.app/extract-audio`

### Option 2: Render

1. Go to [Render](https://render.com)
2. Click "New" → "Web Service"
3. Connect your repo or paste this code
4. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Deploy and copy URL
6. Set in Supabase: `npx supabase secrets set YOUTUBE_AUDIO_SERVICE_URL=https://your-app.onrender.com/extract-audio`

### Option 3: Fly.io

```bash
# Install flyctl
# Then:
fly launch
fly deploy
```

### Option 4: Vercel (Serverless)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Copy URL and set in Supabase

## Local Development

```bash
npm install
npm start
```

Test:
```bash
curl -X POST http://localhost:3000/extract-audio \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

## Configuration

After deployment, configure in Supabase:

```bash
# Set your service URL
npx supabase secrets set YOUTUBE_AUDIO_SERVICE_URL=https://your-service-url.com/extract-audio

# Optional: If you add API key authentication
npx supabase secrets set YOUTUBE_AUDIO_SERVICE_API_KEY=your-api-key
```

## API Endpoints

### POST /extract-audio
Extract audio from YouTube video

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "downloadUrl": "https://...",
  "title": "Video Title",
  "duration": "3600",
  "format": {
    "mimeType": "audio/webm",
    "bitrate": 128000
  }
}
```

### GET /health
Health check endpoint

## Notes

- This service uses `@distube/ytdl-core` which may occasionally be blocked by YouTube
- For production, consider adding rate limiting and authentication
- Monitor your service for YouTube bot detection issues
- Consider using a service with IP rotation for better reliability

