# Scraper.Tech API Setup

## Which API to Use

**Use the "Download All in One!" API (⭐ 5.0)** from the [Scraper.Tech Marketplace](https://scraper.tech/en/marketplace/).

**Why NOT the YouTube API:**
- ❌ **YouTube API** (⭐ 4.3) - Only provides metadata (info, comments, search), **NO downloads**
- ❌ **YouTube Captions** - Only for captions/transcripts
- ❌ **Youtube Transcriptor API** - Only for transcripts  
- ❌ **YouTube Video Summarizer** - Only for summaries

The "Download All in One!" API supports YouTube audio/video downloads.

## Setup Steps

1. **Sign up at Scraper.Tech:**
   - Go to https://scraper.tech
   - Create an account

2. **Subscribe to "Download All in One!" API:**
   - Go to https://scraper.tech/en/marketplace/
   - Find "Download All in One!" (⭐ 5.0)
   - Click "Pricing" to see plans
   - Subscribe to a plan
   - Check if there's a free tier available

3. **Get Your API Key:**
   - Go to your Scraper.Tech dashboard
   - Find your API key for "Download All in One!" API
   - Copy it

4. **Check API Documentation:**
   - Click on "Download All in One!" in the marketplace
   - Click "Playground" or "Docs" to see:
     - Exact endpoint URL (likely `/download` or similar)
     - Request format (probably needs `url`, `platform: 'youtube'`, `format: 'audio'`)
     - Response format (should return download URL or stream)
     - Authentication method

5. **Update Railway Environment Variable:**
   - Add `SCRAPER_TECH_API_KEY` with your API key

6. **Update Code if Needed:**
   - The current code uses: `https://api.scraper.tech/download`
   - If Scraper.Tech uses a different endpoint, update `server.js`:
     ```javascript
     const SCRAPER_TECH_API_URL = 'https://api.scraper.tech/download'; // Update this
     ```

## Common API Endpoint Patterns

The "Download All in One!" API might use:
- `POST https://api.scraper.tech/download`
- `POST https://api.scraper.tech/api/download`
- `POST https://api.scraper.tech/v1/download`

Check their documentation for the exact format!

## Request Format

The code currently sends:
```json
{
  "url": "https://youtube.com/watch?v=...",
  "platform": "youtube",
  "format": "audio",
  "quality": "highest"
}
```

**Important:** Check Scraper.Tech's "Download All in One!" API documentation for the exact request format. It might need:
- Different field names
- Different format values (e.g., "mp3", "m4a", "bestaudio")
- Additional parameters

## Response Format

The code expects one of:
- `audio_url` or `download_url` or `url` field with audio download link
- Direct audio stream (Content-Type: audio/*)

Adjust parsing in `server.js` if their response format differs.

