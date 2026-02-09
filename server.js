import express from "express";
import fetch from "node-fetch";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔴 CHANGE THIS TO YOUR SCRIPT URL
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzJppw9S0jT9wDjbzjpS5d2AJcaNu4TAT4wrWmLSH68bLg6y20fihcn6zhri095scAj2Q/exec";

app.use(express.json());
app.use(express.static("public"));

app.post("/api/auth", async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch {
      res.status(500).json({
        status: "error",
        message: "Invalid response from Google Script",
        raw: text,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Google Script unreachable",
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
