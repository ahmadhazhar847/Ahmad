const MODEL = "@cf/meta/llama-3.1-8b-instruct";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const messages = Array.isArray(body.messages) ? body.messages : [];

        const result = await env.AI.run(MODEL, {
          messages: [
            {
              role: "system",
              content: "You are JARVIS, a concise, helpful AI assistant. Answer clearly and naturally."
            },
            ...messages.slice(-20)
          ]
        });

        const response =
          result?.response ??
          result?.result?.response ??
          result?.result ??
          "";

        return Response.json({ response: String(response) });
      } catch (error) {
        return Response.json(
          { error: error?.message || "AI request failed" },
          { status: 500 }
        );
      }
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("JARVIS", { status: 200 });
  }
};
