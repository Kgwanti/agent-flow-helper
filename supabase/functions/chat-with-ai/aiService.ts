
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

export async function generateAIResponse(message: string, context: string) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  // Add special handling for "help" command
  if (message.toLowerCase().trim() === 'help') {
    return `I'm your AI real estate assistant, and here's how I can help you:

1. 📅 Viewing Management:
   - Check your scheduled property viewings
   - Set up new viewing appointments
   - Send viewing reminders to clients and agents

2. 📧 Communication:
   - Send automated emails to clients
   - Handle routine client inquiries
   - Manage all client communications in one place

3. 📄 Document Management:
   - Access and review uploaded documents
   - Check document status and history
   - Find specific documents quickly

4. 📆 Calendar & Reminders:
   - View your upcoming appointments
   - Set up automated reminders
   - Manage your availability

5. 👥 Client Management:
   - Review client information
   - Track client preferences
   - Monitor client interactions

Just let me know what you'd like assistance with, and I'll be happy to help!`;
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI real estate assistant. Use the following context about the user to provide relevant and personalized responses:
            
            ${context}
            
            Keep responses concise and focused on real estate matters. Be professional but friendly.`
          },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to generate AI response');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
}
