/**
 * Simple YouTube Audio Extraction Service
 * 
 * Deploy this to Railway, Render, Fly.io, or any Node.js hosting service
 * 
 * Setup:
 * 1. npm init -y
 * 2. npm install express @distube/ytdl-core cors
 * 3. Deploy this file
 * 4. Set YOUTUBE_AUDIO_SERVICE_URL in Supabase to your deployed URL
 */

// Polyfill for File API in Node.js < 20
if (typeof File === 'undefined') {
  global.File = class File {
    constructor(bits, name, options = {}) {
      this.name = name;
      this.lastModified = options.lastModified || Date.now();
      this.size = bits.reduce((acc, bit) => acc + (bit.byteLength || bit.size || 0), 0);
      this.type = options.type || '';
      this._bits = bits;
    }
    
    stream() {
      return new ReadableStream({
        start(controller) {
          for (const bit of this._bits) {
            controller.enqueue(bit);
          }
          controller.close();
        }
      });
    }
    
    arrayBuffer() {
      return Promise.resolve(
        this._bits.reduce((acc, bit) => {
          const buf = Buffer.from(bit);
          return Buffer.concat([acc, buf]);
        }, Buffer.alloc(0))
      );
    }
  };
}

const express = require('express');
const ytdl = require('@distube/ytdl-core');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for Supabase Edge Functions
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'youtube-audio-extractor' });
});

// Extract audio endpoint
app.post('/extract-audio', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    console.log(`Extracting audio from: ${url}`);

    // Get video info
    const videoInfo = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      }
    });

    // Find best audio format
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });

    if (!audioFormat || !audioFormat.url) {
      return res.status(500).json({ error: 'No audio format available for this video' });
    }

    // Stream audio directly instead of returning URL to avoid 403 errors
    // Set proper headers for the audio stream
    const audioResponse = await fetch(audioFormat.url, {
      headers: {
        'Referer': url,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Origin': 'https://www.youtube.com',
      }
    });

    if (!audioResponse.ok) {
      // If direct streaming fails, fallback to returning URL
      console.log('Direct streaming failed, returning URL instead');
      return res.json({
        downloadUrl: audioFormat.url,
        title: videoInfo.videoDetails.title,
        duration: videoInfo.videoDetails.lengthSeconds,
        format: {
          mimeType: audioFormat.mimeType,
          bitrate: audioFormat.bitrate,
        }
      });
    }

    // Stream the audio directly - this avoids 403 errors
    res.setHeader('Content-Type', audioFormat.mimeType || 'audio/webm');
    res.setHeader('Content-Disposition', `attachment; filename="audio.webm"`);
    const contentLength = audioResponse.headers.get('content-length');
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    
    // Pipe the audio stream to the response
    audioResponse.body.pipe(res);

  } catch (error) {
    console.error('Error extracting audio:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to extract audio',
      details: error.toString()
    });
  }
});

// Alternative endpoint that returns audio directly (for smaller files)
app.get('/extract-audio', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL query parameter is required' });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const videoInfo = await ytdl.getInfo(url);
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });

    if (!audioFormat || !audioFormat.url) {
      return res.status(500).json({ error: 'No audio format available' });
    }

    // Redirect to audio URL
    res.redirect(audioFormat.url);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`YouTube Audio Extraction Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Extract endpoint: POST http://localhost:${PORT}/extract-audio`);
});

