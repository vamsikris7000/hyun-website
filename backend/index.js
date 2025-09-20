const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = 'https://d22yt2oewbcglh.cloudfront.net/v1/chat-messages';
const API_KEY = 'app-XZXaC4TTf0ZLjbBNqMXS3DVh';

app.post('/chat', async (req, res) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    res.setHeader('Content-Type', 'application/json');
    response.body.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Chatbot proxy server running on port ${PORT}`);
}); 