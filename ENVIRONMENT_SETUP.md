# Environment Variables Setup for Hyun and Associates Website

## Required Environment Variables

Create a `.env` file in the project root directory with the following variables:

```env
# ElevenLabs TTS Configuration
VITE_ELEVENLABS_API_KEY=sk_56f583478e6968182f45b2f095be38530f452ed1afee4721
VITE_ELEVENLABS_VOICE_ID=ys3XeJJA4ArWMhRpcX1D

# Voice API Configuration
VOICE_API_BASE_URL=https://d3sgivh2kmd3c8.cloudfront.net
VOICE_API_KEY=xpectrum-ai@123

# Frontend Voice API (Vite requires VITE_ prefix)
VITE_VOICE_API_KEY=xpectrum-ai@123

# Dify Chatbot Configuration
DIFY_API_BASE_URL=https://demos.xpectrum-ai.com/v1
DIFY_API_KEY=app-qXbGcG3BX32wyKAIQP9Vlnol
```

## File Structure

```
/Users/vamsikrishna/Desktop/HYUN/
├── .env                    # Create this file with the variables above
├── backend/
│   ├── index.js           # Uses DIFY_API_BASE_URL and DIFY_API_KEY
│   └── voice.js           # Uses VOICE_API_BASE_URL and VOICE_API_KEY
└── src/
    └── components/
        └── VoiceChatWidget.tsx  # Uses VITE_VOICE_API_KEY
```

## How to Create the .env File

1. **Navigate to the project root:**
   ```bash
   cd /Users/vamsikrishna/Desktop/HYUN
   ```

2. **Create the .env file:**
   ```bash
   touch .env
   ```

3. **Add the environment variables:**
   ```bash
   echo "VOICE_API_BASE_URL=https://d3sgivh2kmd3c8.cloudfront.net" >> .env
   echo "VOICE_API_KEY=xpectrum-ai@123" >> .env
   echo "VITE_VOICE_API_KEY=xpectrum-ai@123" >> .env
   echo "DIFY_API_BASE_URL=https://demos.xpectrum-ai.com/v1" >> .env
   echo "DIFY_API_KEY=app-qXbGcG3BX32wyKAIQP9Vlnol" >> .env
   ```

## Verification

After creating the `.env` file, restart both servers:

```bash
# Stop existing servers
pkill -f "node index.js"
pkill -f "vite"

# Start backend
cd backend && node index.js &

# Start frontend
cd .. && npm run dev -- --port 1000
```

## Testing

1. **Chatbot**: Should work with real Dify responses
2. **Voice Call**: Should connect to Pravina agent using the provided API credentials

## Troubleshooting

If you see "Missing environment variables" errors:
1. Verify the `.env` file exists in the project root
2. Check that all variables are correctly spelled
3. Restart both servers after creating the `.env` file
4. Check server logs for environment variable loading
