// Netlify Function: ElevenLabs TTS proxy
// Accepts POST { text: string, voiceId?: string }
// Returns audio/mpeg as base64 (isBase64Encoded=true)

const https = require('https');

function fetchElevenLabsAudio(voiceId, apiKey, text) {
  const payload = JSON.stringify({
    text,
    model_id: 'eleven_monolingual_v1',
    voice_settings: { stability: 0.5, similarity_boost: 0.5 },
  });

  const options = {
    hostname: 'api.elevenlabs.io',
    path: `/v1/text-to-speech/${voiceId}`,
    method: 'POST',
    headers: {
      Accept: 'audio/mpeg',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'xi-api-key': apiKey,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(Buffer.concat(chunks));
        } else {
          reject(new Error(`ElevenLabs error ${res.statusCode}: ${Buffer.concat(chunks).toString('utf8')}`));
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const text = (body.text || '').toString();
    const requestedVoiceId = (body.voiceId || '').toString();

    if (!text.trim()) {
      return { statusCode: 400, headers: corsHeaders, body: 'Missing text' };
    }

    // Prefer Netlify env; fall back to public VITE_ versions for convenience
    const apiKey = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;
    const envVoiceId = process.env.ELEVENLABS_VOICE_ID || process.env.VITE_ELEVENLABS_VOICE_ID;
    const voiceId = requestedVoiceId || envVoiceId;

    if (!apiKey || !voiceId) {
      return { statusCode: 500, headers: corsHeaders, body: 'TTS not configured on server' };
    }

    const audioBuffer = await fetchElevenLabsAudio(voiceId, apiKey, text);
    const base64Audio = audioBuffer.toString('base64');

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'audio/mpeg' },
      isBase64Encoded: true,
      body: base64Audio,
    };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: `Error: ${err.message}` };
  }
};


