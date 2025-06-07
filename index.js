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

  // === 🎯 CUSTOM REPLIES ===
  if (lowerMsg.includes("resume")) {
    return res.json({
      reply: "Sure! You can download my resume here: [Download Resume](files/Lalith_Resume.pdf)"
    });
  }

  if (lowerMsg.includes("what projects") || lowerMsg.includes("your projects")) {
    return res.json({
      reply:
        `Here are a few key projects I've built:\n\n` +
        `🔹 **Full Stack Weather App** – Real-time weather with MongoDB, OpenWeather, YouTube, and Maps.\n` +
        `🔹 **AI-Based Accident Detection** – Alerts using OpenCV and sensor data.\n` +
        `🔹 **Adversarial Robustness Toolkit** – Model testing with FGSM, PGD, ZOO attacks.\n` +
        `🔹 **Unity Escape Room Game** – Android escape puzzle game.\n` +
        `🔹 **BarterDB Trading Platform** – Barter system with dashboard, CRUD, and admin login.`
    });
  }

  if (lowerMsg.includes("skills")) {
    return res.json({
      reply:
        `Here's what I'm skilled at:\n\n` +
        `🛠️ Front-End: HTML, CSS, JavaScript, React, Bootstrap\n` +
        `⚙️ Back-End: Node.js, Express.js, PHP\n` +
        `🗃️ Database: MongoDB, MySQL\n` +
        `🧠 AI/ML Tools: Python, PyTorch, OpenCV, CleverHans\n` +
        `🔧 DevTools: Git, Postman, Figma, Vercel, Render`
    });
  }

  if (lowerMsg.includes("contact")) {
    return res.json({
      reply:
        `📧 You can reach me at: adiaditya7907@gmail.com\n` +
        `🌐 LinkedIn: [linkedin.com/in/lalith-aditya-chunduri-76573421a/](https://linkedin.com/in/lalithaditya)`
    });
  }

  if (lowerMsg.includes("certification")) {
    return res.json({
      reply:
        `Here are a few certifications I’ve completed:\n\n` +
        `✅ **Network Ethical Hacking** – Udemy (May 2024)\n` +
        `✅ **Introduction to Cybersecurity** – Cisco\n` +
        `✅ **Python Essentials 1** – Cisco\n\n` +
        `I’m always learning and adding more!`
    });
  }

  if (
    lowerMsg.includes("how did you build") ||
    lowerMsg.includes("how was this portfolio built") ||
    lowerMsg.includes("what tech used") ||
    lowerMsg.includes("how was this made")
  ) {
    return res.json({
      reply:
        `This portfolio was fully designed and developed by me using:\n\n` +
        `💻 **HTML, CSS, JavaScript** – Frontend and animations\n` +
        `📱 Responsive Design – Works great on all screen sizes\n` +
        `🔀 **Modal popups** – Built in JavaScript with project details and tech stacks\n` +
        `🌐 **Deployed on Vercel** – Fast and global hosting\n\n` +
        `It reflects my skills, projects, and certifications in a modern, engaging way!`
    });
  }

  // === 🧠 DEFAULT: Forward to Cohere ===
  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command",
        prompt: `You are Lalith Aditya, a front-end/full-stack developer from the University of Idaho. You’ve worked on real-world projects and specialize in HTML, CSS, JavaScript, Node.js, MongoDB, and PHP. Respond to this message professionally:\n\nUser: ${message}\nLalith:`,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Cohere-based chatbot server running on port ${PORT}`);
});
