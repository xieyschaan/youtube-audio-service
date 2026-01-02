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
     - Exact endpoint URL (code uses `/download/get-info`)
     - Request format: `{ "url": "https://youtube.com/watch?v=..." }`
     - Response format: `{ "error": false, "download_url": "...", "type": "video", ... }`
     - Authentication method (Bearer token or X-API-Key header)

5. **Update Railway Environment Variable:**
   - Add `SCRAPER_TECH_API_KEY` with your API key

6. **Update Code if Needed:**
   - The current code uses: `https://api.scraper.tech/download/get-info`
   - If Scraper.Tech uses a different endpoint, update `server.js`:
     ```javascript
     const SCRAPER_TECH_API_URL = 'https://api.scraper.tech/download/get-info'; // Update this
     ```

## API Response Format

Based on the documentation, the API returns:
```json
{
  "error": false,
  "hosting": "youtube",
  "shortcode": "https://youtube.com/watch?v=...",
  "type": "video",
  "download_url": "https://...",
  "thumb": "https://...",
  "duration": 123.456
}
```

The code extracts `download_url` from this response.

## Request Format

The code currently sends:
```json
{
  "url": "https://youtube.com/watch?v=..."
}
```

**Note:** The API may support additional parameters like:
- `format`: "audio" or "video"
- `quality`: "highest", "medium", "lowest"
- `platform`: "youtube"

Check Scraper.Tech's documentation to see if these parameters are supported and can improve audio extraction.

## Response Format

The code expects one of:
- `audio_url` or `download_url` or `url` field with audio download link
- Direct audio stream (Content-Type: audio/*)

Adjust parsing in `server.js` if their response format differs.

