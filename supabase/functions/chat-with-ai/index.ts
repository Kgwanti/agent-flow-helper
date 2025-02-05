
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { fetchUserData } from './userDataService.ts';
import { generateAIResponse } from './aiService.ts';
import { sendEmailTranscript } from './emailService.ts';

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials');
    }

    const { message, userId, sendEmail = false, documentId, action } = await req.json();
    console.log('Received request:', { message, userId, sendEmail, documentId, action });

    if (!message && !documentId) {
      throw new Error('No message or document provided');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle document analysis if documentId is provided
    if (documentId && action) {
      // For now, we'll use mock document content
      const mockDocumentContent = `This sales contract, dated January 15, 2024, is between ABC Properties (Seller) 
        and John Smith (Buyer) for the property at 123 Main Street. The purchase price is $450,000 with a closing 
        date of March 1, 2024. The buyer has completed a home inspection and requests minor repairs to the roof 
        and HVAC system. Property taxes are current, and all utilities will be transferred at closing.`;

      let prompt = '';
      if (action === 'analyze') {
        prompt = `Please analyze this document and extract key information such as dates, names, prices, and important terms: ${mockDocumentContent}`;
      } else if (action === 'summarize') {
        prompt = `Please provide a concise summary of this document: ${mockDocumentContent}`;
      }

      const aiResponse = await generateAIResponse(prompt, '');
      console.log('Generated AI response for document:', aiResponse);

      // Store the analysis result
      const { error: analysisError } = await supabase
        .from('document_analysis')
        .insert({
          document_id: documentId,
          content: aiResponse,
          profile_id: userId,
          analysis_type: action // Store the analysis type
        });

      if (analysisError) throw analysisError;

      return new Response(
        JSON.stringify({ response: aiResponse }),
        {
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
        }
      );
    }

    // Fetch user data for context
    const userData = await fetchUserData(userId);
    console.log('Fetched user data successfully');

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
    console.log('Generated AI response successfully');

    // Handle email sending if requested
    if (sendEmail && userData.profile?.email) {
      await sendEmailTranscript(
        userData.profile.email,
        userData.profile.first_name,
        message,
        aiResponse
      );
      console.log('Email sent successfully');
    }

    // Log the interaction
    await supabase
      .from('communication_logs')
      .insert([{
        profile_id: userId,
        message_type: 'ai_chat',
        content: message
      }]);
    console.log('Logged communication successfully');

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
