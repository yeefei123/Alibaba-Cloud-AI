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
        model: "qwen2.5-72b-instruct",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userPrompt },
        ],
        knowledgeBaseId: "pq3gfaz9bh",
      },
      {
        headers: {
          Authorization: "Bearer sk-059def50570e4193bdfd653c1a776860",
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to call Qwen API" });
  }
});

app.listen(8080, () => {
  console.log("✅ Server running on http://localhost:8080");
});
