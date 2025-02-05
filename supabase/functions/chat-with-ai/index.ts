import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const apiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!apiKey) {
      console.error('OpenRouter API key not found');
      throw new Error('OpenRouter API key not configured');
    }

    const { message } = await req.json();
    if (!message) {
      throw new Error('No message provided');
    }

    console.log('Preparing request to OpenRouter API with message:', message);
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://www.nexdatasolutions.co/',
        'X-Title': 'NexData Solutions'
      },
      body: JSON.stringify({
        model: 'deepseek-coder/33b-instruct',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant for a real estate agent. Your role is to:
            1. Help answer questions about property viewings and appointments
            2. Provide information about real estate processes
            3. Assist with basic client inquiries
            4. Maintain a professional but friendly tone
            Always be helpful and accurate in your responses.`
          },
          {
            role: 'user',
            content: message
          }
        ]
      }),
    });

    console.log('OpenRouter API Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error response:', errorData);
      throw new Error(`Failed to get AI response: ${errorData}`);
    }

    const data = await response.json();
    console.log('Successfully received response from OpenRouter API');

    return new Response(
      JSON.stringify({ response: data.choices[0].message.content }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chat-with-ai function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Please check the Edge Function logs for more information'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});