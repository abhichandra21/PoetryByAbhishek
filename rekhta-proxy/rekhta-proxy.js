// Simple Node.js proxy server for Rekhta Dictionary API
// This solves the CORS issue by making server-side requests

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Rekhta Dictionary Proxy Endpoint
app.get('/api/rekhta/:word', async (req, res) => {
  try {
    const { word } = req.params;
    
    console.log(`Fetching meaning for word: "${word}"`);
    
    // Make request to Rekhta's API (server-side, no CORS issues)
    const response = await fetch('https://app-rekhta-dictionary.rekhta.org/api/v3/dict/GetGroupWordMeaning', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://www.rekhta.org/',
        'Origin': 'https://www.rekhta.org',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({
        word: word,
        language: 'urdu'
      })
    });

    console.log(`Rekhta API response status: ${response.status}`);
    console.log(`Rekhta API response headers:`, Object.fromEntries(response.headers));

    if (!response.ok) {
      throw new Error(`Rekhta API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the response to our format
    if (data && data.meanings && data.meanings.length > 0) {
      const meaning = data.meanings[0];
      const result = {
        success: true,
        data: {
          word: word,
          meaning: meaning.meaning || meaning.definition || 'Definition available',
          etymology: meaning.etymology,
          examples: meaning.examples || [],
          partOfSpeech: meaning.partOfSpeech,
          source: 'Rekhta Dictionary'
        }
      };
      res.json(result);
    } else {
      res.json({
        success: false,
        error: 'No meaning found in Rekhta dictionary'
      });
    }

  } catch (error) {
    console.error('Rekhta proxy error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch from Rekhta dictionary'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Rekhta Dictionary Proxy' });
});

// Test endpoint to debug what we're sending to Rekhta
app.get('/debug/:word', (req, res) => {
  const { word } = req.params;
  const payload = {
    word: word,
    language: 'urdu'
  };
  
  res.json({
    message: 'This is what we would send to Rekhta',
    url: 'https://app-rekhta-dictionary.rekhta.org/api/v3/dict/GetGroupWordMeaning',
    method: 'POST',
    payload: payload,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Referer': 'https://www.rekhta.org/',
      'Origin': 'https://www.rekhta.org'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Rekhta Dictionary Proxy running on port ${PORT}`);
  console.log(`Usage: GET /api/rekhta/{word}`);
});

module.exports = app;