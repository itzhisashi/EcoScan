export default {
  async fetch(req, env) {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Future:
    // - Verify Supabase JWT
    // - Call OpenAI / Gemini
    // - Return result

    return new Response(
      JSON.stringify({
        status: "ok",
        message: "AI endpoint ready"
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
};
