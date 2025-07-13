# Rekhta Dictionary Integration Setup

This guide explains how to enable Rekhta Dictionary access for your poetry website.

## Problem Solved
The GitHub repository [RekhtaDictionaryExtension](https://github.com/bhavykhatri/RekhtaDictionaryExtension) showed us that **Rekhta Dictionary access IS possible** by using a backend proxy to bypass CORS restrictions.

## Solution Provided

### 1. **Proxy Server** (`rekhta-proxy.js`)
- Simple Node.js server that acts as a proxy
- Makes server-side requests to Rekhta (no CORS issues)
- Transforms responses to match our dictionary format

### 2. **Updated Dictionary Service**
- Already integrated to use Rekhta when proxy is available
- Falls back gracefully to basic dictionary + Free Dictionary API
- Automatically detects if proxy server is running

## Setup Instructions

### Option A: Local Development
1. **Install dependencies:**
   ```bash
   # Rename package-proxy.json to package.json in a new directory
   mkdir rekhta-proxy
   cd rekhta-proxy
   cp ../package-proxy.json package.json
   cp ../rekhta-proxy.js .
   npm install
   ```

2. **Start proxy server:**
   ```bash
   npm start
   # Runs on http://localhost:3001
   ```

3. **Your poetry website will automatically detect and use it!**

### Option B: Deploy to Cloud (Recommended)

#### Deploy to Vercel:
1. Create new repo with `rekhta-proxy.js` and `package.json`
2. Deploy to Vercel
3. Set environment variable: `REACT_APP_REKHTA_PROXY_URL=https://your-proxy.vercel.app`

#### Deploy to Railway/Render:
1. Upload the proxy files
2. Set environment variable with your proxy URL

#### Deploy to Heroku:
1. Create Heroku app with proxy code
2. Set `REACT_APP_REKHTA_PROXY_URL` config var

## Configuration

### Environment Variables
Add to your `.env.local`:
```env
REACT_APP_REKHTA_PROXY_URL=http://localhost:3001
# or your deployed proxy URL
```

### Current Behavior
- ✅ **Basic Dictionary**: Instant results for 150+ common words
- ✅ **Rekhta via Proxy**: High-quality poetry definitions (if proxy available)
- ✅ **Free Dictionary**: English word definitions
- ✅ **Graceful Fallback**: Works even if proxy is down

## Benefits of Rekhta Integration

### With Rekhta Proxy:
- 🎯 **Perfect for poetry**: Specialized Urdu/Hindi literary dictionary
- 📚 **Rich definitions**: Etymology, examples, proper literary context
- 🔄 **Real-time lookup**: Fresh data from Rekhta's comprehensive database
- 💯 **High coverage**: Covers classical and modern poetry vocabulary

### Example Results:
```javascript
// Basic Dictionary: "heart, mind, soul"
// Rekhta Dictionary: "The seat of emotions and feelings; the heart as the center of love and spiritual yearning in classical poetry; from Persian دل"
```

## Security Notes
- Proxy server only forwards dictionary requests
- No user data is stored or logged
- Uses same API that Rekhta's own website uses
- Respects Rekhta's terms by making reasonable, spaced requests

## Testing
Once proxy is running, test any word in your poetry:
1. Click on any Hindi/Urdu word
2. If proxy is available: Get rich Rekhta definitions
3. If proxy unavailable: Fallback to basic dictionary + English API

## Inspiration Credit
Thanks to [@bhavykhatri](https://github.com/bhavykhatri) for proving this approach works with their RekhtaDictionaryExtension project! 🙏