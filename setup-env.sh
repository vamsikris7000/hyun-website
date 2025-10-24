#!/bin/bash

# Environment Setup Script for Hyun and Associates Website
echo "Setting up environment variables for Hyun and Associates website..."

# Create .env file with the required variables
cat > .env << EOF
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
EOF

echo "✅ .env file created successfully!"
echo ""
echo "Environment variables configured:"
echo "- VITE_ELEVENLABS_API_KEY: sk_56f583478e6968182f45b2f095be38530f452ed1afee4721"
echo "- VITE_ELEVENLABS_VOICE_ID: ys3XeJJA4ArWMhRpcX1D"
echo "- VOICE_API_BASE_URL: https://d3sgivh2kmd3c8.cloudfront.net"
echo "- VOICE_API_KEY: xpectrum-ai@123"
echo "- VITE_VOICE_API_KEY: xpectrum-ai@123"
echo "- DIFY_API_BASE_URL: https://demos.xpectrum-ai.com/v1"
echo "- DIFY_API_KEY: app-qXbGcG3BX32wyKAIQP9Vlnol"
echo ""
echo "🚀 You can now restart your servers to use the environment variables!"
echo ""
echo "To restart servers:"
echo "1. Stop existing: pkill -f 'node index.js' && pkill -f 'vite'"
echo "2. Start backend: cd backend && node index.js &"
echo "3. Start frontend: npm run dev -- --port 1000"
