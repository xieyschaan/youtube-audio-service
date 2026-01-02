# Scraper.Tech YouTube API Setup

## Which API to Use

Use the **YouTube API** (⭐ 4.3) from the [Scraper.Tech Marketplace](https://scraper.tech/en/marketplace/).

**NOT these APIs:**
- ❌ YouTube Captions - Only for captions/transcripts
- ❌ Youtube Transcriptor API - Only for transcripts  
- ❌ YouTube Video Summarizer - Only for summaries

## Setup Steps

1. **Sign up at Scraper.Tech:**
   - Go to https://scraper.tech
   - Create an account

2. **Subscribe to YouTube API:**
   - Go to https://scraper.tech/en/marketplace/
   - Find "YouTube API" (⭐ 4.3)
   - Click "Pricing" to see plans
   - Subscribe to a plan (Free tier: 1,000 requests/month)

3. **Get Your API Key:**
   - Go to your Scraper.Tech dashboard
   - Find your API key
   - Copy it

4. **Check API Documentation:**
   - Click on "YouTube API" in the marketplace
   - Click "Playground" or "Docs" to see:
     - Exact endpoint URL
     - Request format
     - Response format
     - Authentication method

5. **Update Railway Environment Variable:**
   - Add `SCRAPER_TECH_API_KEY` with your API key

6. **Update Code if Needed:**
   - The current code uses: `https://api.scraper.tech/youtube/video`
   - If Scraper.Tech uses a different endpoint, update `server.js`:
     ```javascript
     const SCRAPER_TECH_API_URL = 'https://api.scraper.tech/youtube'; // Update this
     ```

## Common API Endpoint Patterns

Scraper.Tech might use one of these:
- `POST https://api.scraper.tech/youtube/video`
- `POST https://api.scraper.tech/youtube/download`
- `POST https://api.scraper.tech/youtube`
- `GET https://api.scraper.tech/youtube?url=...`

Check their documentation for the exact format!

## Request Format

The code currently sends:
```json
{
  "url": "https://youtube.com/watch?v=...",
  "video_id": "...",
  "format": "audio",
  "quality": "highest"
}
```

Adjust based on Scraper.Tech's actual API requirements.

## Response Format

The code expects one of:
- `audio_url` or `download_url` or `url` field with audio download link
- Direct audio stream (Content-Type: audio/*)

Adjust parsing in `server.js` if their response format differs.

