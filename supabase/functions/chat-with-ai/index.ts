
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

    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) {
      console.error('OpenRouter API key is not configured');
      throw new Error('API configuration error');
    }

    console.log('Making request to OpenRouter API...');

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://lovable.dev',  // Required for rankings
        'X-Title': 'Real Estate Assistant',     // Required for rankings
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "openai/gpt-4",  // Using their recommended model format
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API Error:', {
        status: openRouterResponse.status,
        statusText: openRouterResponse.statusText,
        response: errorText
      });
      throw new Error(`OpenRouter API error: ${openRouterResponse.status} - ${errorText}`);
    }

    const data = await openRouterResponse.json();
    console.log('OpenRouter API Response received successfully');

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from OpenRouter API');
    }

    return new Response(JSON.stringify({ response: data.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'If this persists, please contact support.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
