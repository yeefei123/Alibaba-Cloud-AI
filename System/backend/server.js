const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

const ALIBABA_API_URL = 'https://dashscope.aliyuncs.com/api/v1';
const API_KEY = process.env.DASHSCOPE_API_KEY;

app.post('/api/chat', async (req, res) => {
  const userQuery = req.body.query;

  try {
    const response = await axios.post(
      ALIBABA_API_URL,
      {
        model: 'qwen-turbo',
        input: {
          prompt: userQuery,
        },
        parameters: {
          result_format: 'text',
        },
      },
      {
        headers: {
          'Authorization': `API-Key ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = response.data.output.text || "Sorry, I couldn't generate a response.";
    res.json({ reply: botReply });

  } catch (error) {
    console.error('Alibaba Cloud API error:', error?.response?.data || error.message);
    res.status(500).json({ reply: 'Error communicating with Alibaba Cloud AI.' });
  }
});

app.listen(8080, () => console.log('✅ Server running on http://localhost:8080'));
