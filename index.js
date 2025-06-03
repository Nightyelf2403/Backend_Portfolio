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
  const lowerMsg = message.toLowerCase();

  // Handle special cases BEFORE calling Cohere
  if (lowerMsg.includes("show resume")) {
    return res.json({ reply: "Sure! You can download my resume here: [Download Resume](files/Lalith_Resume.pdf)" });
  }

  if (lowerMsg.includes("what projects have you built") || lowerMsg.includes("your projects")) {
    return res.json({
      reply:
        `Here are a few key projects I've built:\n\n` +
        `📍 **Full Stack Weather App** – Real-time forecast with MongoDB, OpenWeather, YouTube, and Google Maps.\n` +
        `📍 **AI-Based Accident Detection System** – Alerts using OpenCV and ML for road safety.\n` +
        `📍 **Adversarial Robustness Toolkit** – Evaluates model resilience to FGSM, PGD, ZOO attacks.\n` +
        `📍 **Unity Escape Room Game** – Android puzzle game with clues and animations.\n` +
        `📍 **BarterDB Trading Platform** – Item bartering app with user and admin dashboards.\n\n` +
        `Let me know if you'd like links or more info on any of these!`
    });
  }

  // Default case: use Cohere for general questions
  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command",
        prompt: `You are Lalith Aditya, a front-end/full-stack developer from the University of Idaho. You’ve worked on real-world projects and specialize in technologies like HTML, CSS, JavaScript, PHP, Node.js, MongoDB, and Express.js. Respond to this user message as yourself:\n\nUser: ${message}\nLalith:`,
        max_tokens: 200,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: "NONE"
      })
    });

    const data = await response.json();
    const reply = data.generations?.[0]?.text?.trim() || "No reply";
    res.json({ reply });

  } catch (error) {
    console.error("❌ Error in Cohere fetch:", error);
    res.status(500).json({ reply: "Server error. Try again later." });
  }
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
