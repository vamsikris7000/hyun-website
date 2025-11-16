require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const voiceRoutes = require('./voice');

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = process.env.XPECTRUM_API_BASE_URL 
  ? `${process.env.XPECTRUM_API_BASE_URL}/chat-messages` 
  : process.env.DIFY_API_BASE_URL 
    ? `${process.env.DIFY_API_BASE_URL}/chat-messages` 
    : 'https://xpectrum-main-app-prod-cocfr.ondigitalocean.app/api/v1/chat-messages';
const API_KEY = process.env.XPECTRUM_API_KEY || process.env.DIFY_API_KEY || 'app-WxAWGosGXvslDCmQdLg2wlHz';

app.post('/chat', async (req, res) => {
  try {
    console.log('=== CHAT REQUEST DEBUG ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Conversation ID:', req.body.conversation_id);
    console.log('Query:', req.body.query);
    
    // Remove conversation_id for now to test if that's causing the issue
    const requestBody = { ...req.body };
    if (requestBody.conversation_id) {
      console.log('Removing conversation_id to test API compatibility');
      delete requestBody.conversation_id;
    }
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('API Response status:', response.status);
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Handle 404 responses (conversation not found)
    if (response.status === 404) {
      console.log('Conversation not found, creating new conversation...');
      
      // Create a new conversation by removing the conversation_id
      const newConversationBody = { ...req.body };
      delete newConversationBody.conversation_id;
      
      console.log('New conversation request body:', JSON.stringify(newConversationBody, null, 2));
      
      const newConversationResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConversationBody),
      });
      
      console.log('New conversation response status:', newConversationResponse.status);
      res.setHeader('Content-Type', 'application/json');
      newConversationResponse.body.pipe(res);
      return;
    }
    
    res.setHeader('Content-Type', 'application/json');
    response.body.pipe(res);
  } catch (err) {
    console.error('Chat proxy error:', err);
    // Don't return error responses - let Dify handle it
    res.status(500).json({ error: 'Service temporarily unavailable' });
  }
});

// Use voice routes
app.use('/', voiceRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Chatbot proxy server running on port ${PORT}`);
}); 