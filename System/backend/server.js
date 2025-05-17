const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const ALIBABA_API_URL = 'https://nlsapi.aliyun.com/robot/chat'; 
const ACCESS_KEY = 'your-access-key';
const SECRET_KEY = 'your-secret-key';

app.post('/api/chat', async (req, res) => {
  const userQuery = req.body.query;
  try {
    // Call Alibaba Cloud AI API
    const aiResponse = await axios.post(ALIBABA_API_URL, {
      query: userQuery,
      // other required params depending on API
    }, {
      headers: {
        'Authorization': `Bearer ${ACCESS_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Extract reply from Alibaba response
    const botReply = aiResponse.data.reply || "Sorry, I don't know the answer.";

    res.json({ reply: botReply });
  } catch (error) {
    console.error('Alibaba Cloud API error:', error);
    res.status(500).json({ reply: 'Error processing your request.' });
  }
});

app.listen(8080, () => console.log('Server running on port 8080'));
