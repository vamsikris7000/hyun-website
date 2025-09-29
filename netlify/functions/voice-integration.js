exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, x-api-key',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { httpMethod, path, queryStringParameters, body } = event;
    
    console.log('=== NETLIFY VOICE FUNCTION DEBUG ===');
    console.log('HTTP Method:', httpMethod);
    console.log('Path:', path);
    console.log('Query params:', queryStringParameters);

    // Handle different endpoints
    if (path.includes('/tokens/generate')) {
      const agentName = queryStringParameters?.agent_name || 'hyun';
      
      // Return a mock token for testing
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          token: 'mock_token_for_netlify_testing',
          room_name: `${agentName}-${Date.now()}`,
          agent_name: agentName,
          unique_id: Date.now().toString(),
          client_ip: '127.0.0.1',
          livekit_url: 'wss://multi-agent-prod-eks-deployment-kqx0th32.livekit.cloud',
          message: 'Mock token for Netlify testing'
        }),
      };
    }

    if (path.includes('/agents/join')) {
      const requestBody = JSON.parse(body || '{}');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Mock agent join for Netlify testing',
          room_name: requestBody.room_name || 'test-room',
          agent_name: requestBody.agent_name || 'hyun'
        }),
      };
    }

    // Default response for root path
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Voice integration function is running',
        endpoints: ['/tokens/generate', '/agents/join'],
        version: '1.0'
      }),
    };

  } catch (error) {
    console.error('Voice integration function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
    };
  }
};
