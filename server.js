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
const { stream } = require('play-dl');
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

    // Validate YouTube URL (basic check)
    if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    console.log(`Extracting audio from: ${url}`);

    try {
      // Use play-dl to stream audio - it's more resistant to YouTube's bot detection
      console.log('Streaming audio using play-dl...');
      
      // Get audio stream from play-dl
      const audioStream = await stream(url, {
        quality: 2, // High quality audio
        discordPlayerCompatibility: false,
      });
      
      // Set response headers for audio streaming
      res.setHeader('Content-Type', 'audio/webm');
      res.setHeader('Content-Disposition', `attachment; filename="audio.webm"`);
      
      // Handle stream errors
      audioStream.stream.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ 
            error: 'Failed to stream audio',
            details: error.message 
          });
        }
      });
      
      // Pipe the stream directly to response
      audioStream.stream.pipe(res);
      
      // Note: We don't return here - the stream will handle the response
      return;
    } catch (streamError) {
      console.error('Streaming error:', streamError);
      return res.status(500).json({ 
        error: 'Failed to extract audio',
        details: streamError.message 
      });
    }

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

    if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Use play-dl to stream audio
    const audioStream = await stream(url, {
      quality: 2,
      discordPlayerCompatibility: false,
    });
    
    res.setHeader('Content-Type', 'audio/webm');
    audioStream.stream.pipe(res);

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

