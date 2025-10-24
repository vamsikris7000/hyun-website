// Chatbot proxy function using only built-in Node.js modules
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Helper function to make HTTP requests without external dependencies
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 30000
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
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
    const { httpMethod, body } = event;
    
    console.log('=== CHATBOT PROXY DEBUG ===');
    console.log('HTTP Method:', httpMethod);
    console.log('Body:', body);

    // Get environment variables
    const apiKey = process.env.DIFY_API_KEY;
    const apiUrl = process.env.DIFY_API_BASE_URL;
    
    console.log('API Key present:', !!apiKey);
    console.log('API URL present:', !!apiUrl);

    if (!apiKey || !apiUrl) {
      console.error('Missing environment variables for chatbot');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Missing chatbot API configuration' }),
      };
    }

    if (httpMethod === 'POST') {
      const requestBody = JSON.parse(body || '{}');
      const requestUrl = `${apiUrl}/chat-messages`;
      
      console.log(`Calling Dify API: ${requestUrl}`);
      
      try {
        const response = await makeRequest(requestUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        console.log(`Dify API response status: ${response.status}`);

        if (response.status >= 200 && response.status < 300) {
          return {
            statusCode: 200,
            headers: {
              ...headers,
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
            body: response.data,
          };
        } else {
          console.error(`Dify API error: ${response.status} - ${response.data}`);
          // Don't return error responses - let Dify handle it
          return {
            statusCode: 200,
            headers: {
              ...headers,
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
            body: response.data,
          };
        }
      } catch (error) {
        console.error('Request error:', error);
        // Don't return error responses - let Dify handle it
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
          body: `data: {"event": "agent_message", "answer": "I apologize, but I'm having trouble processing your request right now. Please try again.", "conversation_id": "error-${Date.now()}"}\n\n`,
        };
      }
    }

    // Default response for GET requests
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Chatbot proxy function is running',
        endpoints: ['POST /chat']
      }),
    };

  } catch (error) {
    console.error('Chatbot proxy function error:', error);
    // Don't return error responses - let Dify handle it
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
      body: `data: {"event": "agent_message", "answer": "I apologize, but I'm having trouble processing your request right now. Please try again.", "conversation_id": "error-${Date.now()}"}\n\n`,
    };
  }
};
