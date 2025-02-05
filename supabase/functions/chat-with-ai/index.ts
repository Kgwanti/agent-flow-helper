import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { fetchUserData } from './userDataService.ts';
import { generateAIResponse } from './aiService.ts';
import { sendEmailTranscript } from './emailService.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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
    const { message, userId, sendEmail = false } = await req.json();
    console.log('Received request with message:', message, 'userId:', userId);
    
    if (!message) {
      throw new Error('No message provided');
    }

    // Initialize Supabase client
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not configured');
    }
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user data
    const userData = await fetchUserData(userId);
    console.log('Successfully fetched user data');

    // Create user context string
    const userContext = `
Current user: ${userData.profile?.first_name || 'User'} ${userData.profile?.last_name || ''}
Contact: ${userData.profile?.email || 'No email'}, ${userData.profile?.phone || 'No phone'}

Upcoming viewings: ${userData.viewings?.length ? userData.viewings.map(v => 
  `\n- ${v.address} on ${v.viewing_date} at ${v.viewing_time}`
).join('') : 'No upcoming viewings'}

Client preferences: ${userData.preferences ? `
- Property types: ${userData.preferences.preferred_property_types?.join(', ') || 'Not specified'}
- Price range: ${userData.preferences.min_price || 'Any'} - ${userData.preferences.max_price || 'Any'}
- Preferred viewing times: ${userData.preferences.preferred_viewing_times?.join(', ') || 'Not specified'}
` : 'No preferences set'}

Recent communications: ${userData.recentCommunications?.length ? 
  userData.recentCommunications.map(c => `\n- ${c.message_type}: ${c.content}`).join('') 
  : 'No recent communications'}

Documents: ${userData.documents?.length ?
  userData.documents.map(d => `\n- ${d.filename}`).join('')
  : 'No documents uploaded'}`;

    // Generate AI response
    const aiResponse = await generateAIResponse(message, userContext);
    console.log('Successfully received response from OpenRouter API');

    // Send email if requested
    if (sendEmail && userData.profile?.email) {
      await sendEmailTranscript(
        userData.profile.email,
        userData.profile.first_name,
        message,
        aiResponse
      );
    }

    // Log the interaction
    await supabase
      .from('communication_logs')
      .insert([{
        profile_id: userId,
        message_type: 'ai_chat',
        content: message
      }]);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
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