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
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command",                // ✅ switch from command-nightly to command
        prompt: `You are a helpful assistant on a software portfolio website. Answer this briefly and professionally:\n\n${message}`,
        max_tokens: 100,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: "NONE"
      })
    });

    const data = await response.json();
    console.log("🧠 Cohere response:", JSON.stringify(data, null, 2));

    const reply = data.generations?.[0]?.text?.trim() || "No reply";
    res.json({ reply });

  } catch (error) {
    console.error("❌ Error in Cohere fetch:", error);
    res.status(500).json({ reply: "Server error. Try again later." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Cohere-based chatbot server running on port ${PORT}`);
});
