const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
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
    console.log('Body:', body);

    // Get environment variables
    const apiKey = process.env.VOICE_API_KEY;
    const backendUrl = process.env.VOICE_API_BASE_URL;
    
    console.log('API Key present:', !!apiKey);
    console.log('Backend URL present:', !!backendUrl);

    if (!apiKey || !backendUrl) {
      console.error('Missing environment variables for voice integration');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Missing voice API configuration' }),
      };
    }

    // Handle different endpoints
    if (path.includes('/tokens/generate')) {
      const agentName = queryStringParameters?.agent_name || 'hyun';
      
      console.log(`Calling backend: ${backendUrl}/tokens/generate?agent_name=${agentName}`);
      
      const response = await fetch(`${backendUrl}/tokens/generate?agent_name=${agentName}`, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      console.log(`Backend response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend error: ${response.status} - ${errorText}`);
        return {
          statusCode: response.status,
          headers,
          body: JSON.stringify({ 
            error: 'Backend service error',
            status: response.status,
            message: errorText
          }),
        };
      }

      const data = await response.json();
      console.log(`Token generation response data:`, data);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data),
      };
    }

    if (path.includes('/agents/join')) {
      const requestBody = JSON.parse(body || '{}');
      
      console.log('Agent join request body:', requestBody);
      
      const response = await fetch(`${backendUrl}/agents/join`, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log(`Backend response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend error: ${response.status} - ${errorText}`);
        return {
          statusCode: response.status,
          headers,
          body: JSON.stringify({ 
            error: 'Backend service error',
            status: response.status,
            message: errorText
          }),
        };
      }

      const data = await response.json();
      console.log(`Agent join response data:`, data);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data),
      };
    }

    // Default response for root path
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Voice integration function is running',
        endpoints: ['/tokens/generate', '/agents/join']
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
