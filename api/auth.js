export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzJppw9S0jT9wDjbzjpS5d2AJcaNu4TAT4wrWmLSH68bLg6y20fihcn6zhri095scAj2Q/exec";
  if (!GOOGLE_SCRIPT_URL) {
    return res.status(500).json({ message: "Missing Google Script URL" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        status: "error",
        message: "Invalid response from Google Script",
        detail: text,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Failed to connect to Google Script",
      error: err.message,
    });
  }
}
