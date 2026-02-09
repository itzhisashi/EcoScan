// api/auth.js
export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 2. Get the secret Google URL from environment variables
  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

  if (!GOOGLE_SCRIPT_URL) {
    return res.status(500).json({ message: 'Server Configuration Error: Missing Google URL' });
  }

  try {
    // 3. Forward the data to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        // Google Script usually prefers this or text/plain depending on your setup
        // But since we are server-side, simple JSON usually works best if your GS handles it.
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    // 4. Return Google's response back to your frontend
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: 'Failed to connect to Google Script', 
      error: error.message 
    });
  }
}
