import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenAI } from "@google/genai";

type Msg = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are a warm, elegant, knowledgeable hair-care advisor for a luxury hair boutique.

We offer:
- Premium hand-crafted wigs (Brazilian, Peruvian, body wave, deep curly, kinky straight, bone straight, knotless braids, pixie cuts and more — various lengths from 6" to 36")
- Professional hair treatments and care products
- Salon-grade hair styling equipment
- Worldwide shipping

Help customers with: choosing the right wig (texture, length, color), hair care advice, product recommendations, order questions, and styling tips. Be concise (2–4 short paragraphs), elegant, and friendly. Use a refined tone. For order tracking or account-specific issues, suggest contacting support.`;

export const Route = createFileRoute("/api/chat")({

  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const { messages } = (await request.json()) as { messages?: Msg[] };
          if (!Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: "Messages required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          // Use CHATBOT_API_KEY from .env file
          const key = process.env.CHATBOT_API_KEY;
          if (!key) {
            return new Response(
              JSON.stringify({ error: "Missing CHATBOT_API_KEY in environment. Please add it to your .env file." }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          // Call Google GenAI directly using the official SDK
          try {
            const ai = new GoogleGenAI({ apiKey: key });

            // Build a text prompt from the messages array
            const prompt = [{ role: "system", content: SYSTEM_PROMPT }, ...messages]
              .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
              .join("\n\n");

            const response = await ai.models.generateContent({
              model: "gemini-3.5-flash",
              contents: prompt,
            });

            // SDK usually returns `text` on the response for simple usage
            // Fallback to nested paths if necessary
            // @ts-ignore
            const content = response?.text ?? response?.output?.[0]?.content?.[0]?.text ?? "";

            return new Response(JSON.stringify({ content }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            // Map common error messages to friendly statuses
            if (msg?.toLowerCase().includes("rate")) {
              return new Response(JSON.stringify({ error: "Rate limit reached. Please try again shortly." }), {
                status: 429,
                headers: { "Content-Type": "application/json" },
              });
            }
            return new Response(JSON.stringify({ error: msg || "AI request failed" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
        } catch (err) {
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
