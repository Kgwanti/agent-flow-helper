const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

export const generateAIResponse = async (message: string, userContext: string) => {
  if (!openRouterApiKey) {
    throw new Error('OpenRouter API key not configured');
  }

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
          1. ALWAYS prioritize using the actual user data provided above when responding
          2. Reference specific details from their profile, viewings, and preferences
          3. If making suggestions, base them on their stated preferences
          4. For viewing-related queries, check their upcoming viewings first
          5. Keep responses concise but informative
          6. If information is missing, encourage them to update their preferences or profile
          7. If the user asks about sending an email, let them know you can do that for them`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('OpenRouter API error response:', errorData);
    throw new Error(`Failed to get AI response: ${errorData}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};