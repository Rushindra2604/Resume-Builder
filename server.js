const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyCv8fYGe3NwXHIByy7yMV1U1ne_7ZDgJsQ";

// ===== ROUTE =====
app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("SERVER RESPONSE:", data); // 👈 VERY IMPORTANT

    res.json(data);

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Server failed" });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});