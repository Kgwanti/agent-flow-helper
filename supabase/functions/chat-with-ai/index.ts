import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

interface ChatMessage {
  message: string;
}

serve(async (req) => {
  try {
    const { message } = await req.json() as ChatMessage;
    const apiKey = Deno.env.get('DEEPSEEK_API_KEY');

    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not set');
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a helpful real estate assistant. You help users with property-related questions, market insights, and general real estate advice. Keep responses concise and professional."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get AI response');
    }

    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});