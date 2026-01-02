# YouTube Audio Extraction Service

This service extracts audio from YouTube videos for the Chop app. It uses Scraper.Tech API (paid service) as the primary method, with ytdl-core as a fallback.

## Setup

1. **Get Scraper.Tech API Key:**
   - Sign up at https://scraper.tech
   - Get your API key from the dashboard
   - Free tier: 1,000 requests/month
   - Basic tier: $2/month for 50,000 requests

2. **Set Environment Variable in Railway:**
   - Go to your Railway project settings
   - Add environment variable: `SCRAPER_TECH_API_KEY`
   - Set value to your Scraper.Tech API key

3. **Deploy:**
   - Railway will auto-deploy from GitHub
   - The service will be available at your Railway URL

## How It Works

1. **Primary Method:** Scraper.Tech API
   - More reliable, bypasses YouTube bot detection
   - Requires API key
   - Uses paid credits

2. **Fallback Method:** ytdl-core
   - Free but may be blocked by YouTube
   - Used if Scraper.Tech fails or is not configured

## API Endpoints

- `POST /extract-audio` - Extract audio from YouTube URL
  - Body: `{ "url": "https://youtube.com/watch?v=..." }`
  - Returns: Audio stream (Content-Type: audio/mpeg or audio/webm)

- `GET /health` - Health check endpoint

## Environment Variables

- `SCRAPER_TECH_API_KEY` - Your Scraper.Tech API key (optional, but recommended)
- `PORT` - Server port (default: 3000)
