const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/qwen", async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const response = await axios.post(
      "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        app_id:
          process.env.DASHSCOPE_APP_ID || "a2bc39502d0f4bdebcd4c57f6e7d88cf",
        model: "qwen2.5-72b-instruct",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userPrompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${
            process.env.DASHSCOPE_API_KEY ||
            "sk-e698e1d5ba504c82a214c3250fc17646"
          }`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      const aiReply = response.data.choices[0].message.content;
      res.json({ reply: aiReply });
    } else {
      res.status(500).json({ error: "Unexpected API response format." });
    }
  } catch (err) {
    console.error("DashScope API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to call DashScope API" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
