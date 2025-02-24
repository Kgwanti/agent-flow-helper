
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Received request:', {
      message,
      userId: req.headers.get('x-user-id'),  // Log user ID if available
      sendEmail: false,
      documentId: undefined,
      action: undefined
    });

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'HTTP-Referer': 'https://lovable.dev',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'system',
            content: `You are a helpful real estate assistant. You help users with:
              - Property viewings and scheduling
              - Real estate market information
              - Document management
              - Client communication
              Be concise and professional in your responses.`
          },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.text();
      console.error('OpenRouter API Error Response:', errorData);
      throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
    }

    const data = await openRouterResponse.json();
    console.log('OpenRouter API Response received');

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    return new Response(JSON.stringify({ response: data.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    
    // Send a more specific error message back to the client
    const errorMessage = error.message || 'An unexpected error occurred';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'If this persists, please contact support.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
