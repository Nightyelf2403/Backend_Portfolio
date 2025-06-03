import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-0125",      
        messages: [{ role: "user", content: message }],
        max_tokens: 150,                  
        temperature: 0.7                  
      })
    });

    const data = await response.json();
    console.log("🧠 OpenAI raw response:", JSON.stringify(data, null, 2));

    const reply = data.choices?.[0]?.message?.content || "No reply";
    res.json({ reply });

  } catch (error) {
    console.error("❌ Error in GPT fetch:", error);
    res.status(500).json({ reply: "Server error. Try again later." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Chatbot server running on port ${PORT}`);
});
