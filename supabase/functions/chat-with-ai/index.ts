import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openRouterApiKey) {
      console.error('OpenRouter API key not found');
      throw new Error('OpenRouter API key not configured');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials not found');
      throw new Error('Supabase credentials not configured');
    }

    const { message, userId } = await req.json();
    if (!message) {
      throw new Error('No message provided');
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all relevant user data in parallel
    const [
      profileResult,
      viewingsResult,
      preferencesResult,
      communicationLogsResult
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(),
      supabase
        .from('viewing_appointments')
        .select('*')
        .eq('profile_id', userId)
        .order('viewing_date', { ascending: true }),
      supabase
        .from('client_preferences')
        .select('*')
        .eq('profile_id', userId)
        .single(),
      supabase
        .from('communication_logs')
        .select('*')
        .eq('profile_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    const profile = profileResult.data;
    const viewings = viewingsResult.data;
    const preferences = preferencesResult.data;
    const recentCommunications = communicationLogsResult.data;

    // Create comprehensive context about the user and their data
    const userContext = `
Current user: ${profile?.first_name || 'User'} ${profile?.last_name || ''}
Contact: ${profile?.email || 'No email'}, ${profile?.phone || 'No phone'}

Upcoming viewings: ${viewings?.length ? viewings.map(v => 
  `\n- ${v.address} on ${v.viewing_date} at ${v.viewing_time}`
).join('') : 'No upcoming viewings'}

Client preferences: ${preferences ? `
- Property types: ${preferences.preferred_property_types?.join(', ') || 'Not specified'}
- Price range: ${preferences.min_price || 'Any'} - ${preferences.max_price || 'Any'}
- Preferred viewing times: ${preferences.preferred_viewing_times?.join(', ') || 'Not specified'}
` : 'No preferences set'}

Recent communications: ${recentCommunications?.length ? 
  recentCommunications.map(c => `\n- ${c.message_type}: ${c.content}`).join('') 
  : 'No recent communications'}`;

    console.log('Preparing request to OpenRouter API with context:', userContext);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': 'https://www.nexdatasolutions.co/',
        'X-Title': 'NexData Solutions'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant for a real estate agent. Your role is to:
            1. Help answer questions about property viewings and appointments
            2. Provide information about real estate processes
            3. Assist with basic client inquiries
            4. Maintain a professional but friendly tone
            
            Here is the context about the current user:
            ${userContext}
            
            IMPORTANT INSTRUCTIONS:
            1. Always prioritize using the actual user data provided above when responding
            2. Reference specific details from their profile, viewings, and preferences
            3. If making suggestions, base them on their stated preferences
            4. For viewing-related queries, check their upcoming viewings first
            5. Keep responses concise but informative
            6. If information is missing, encourage them to update their preferences or profile`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error response:', errorData);
      throw new Error(`Failed to get AI response: ${errorData}`);
    }

    const data = await response.json();
    console.log('Successfully received response from OpenRouter API');

    // Log the interaction
    await supabase
      .from('communication_logs')
      .insert([
        {
          profile_id: userId,
          message_type: 'ai_chat',
          content: message
        }
      ]);

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