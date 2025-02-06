const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

export async function generateAIResponse(message: string, context: string) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  // Add special handling for help request variations
  const helpPhrases = [
    'what can you help me with',
    'what can you do',
    'help',
    'how can you help',
    'what are your capabilities'
  ];

  if (helpPhrases.includes(message.toLowerCase().trim())) {
    return `**AI Chatbot Response:**

I'm your integrated real estate assistant with direct access to your database and systems. Here's how I can help you:

1. 📧 Automated Client Communications  
   - Send automated emails to clients  
   - Draft and send viewing confirmations  
   - Handle routine client inquiries  
   - Manage client follow-ups  

2. 📅 Viewings Management  
   - Access and manage your viewing schedule  
   - Send automated viewing reminders  
   - Track upcoming appointments  
   - Handle viewing rescheduling requests  

3. 🧩 Client Management  
   - Organize and maintain your client list  
   - Update client contact details  
   - Manage client relationships and interactions  
   - Create new client profiles  

4. 📄 Document Management  
   - Analyze and summarize real estate documents  
   - Draft lease agreements and FICA documents  
   - Streamline and automate document processes  
   - Ensure compliance with legal requirements  

How can I assist you today?`;
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
            content: `You are an AI real estate assistant specialized in South African real estate. You have direct access to the user's database and can help with:
            - Automated email communications
            - Viewing schedule management
            - Document analysis and management
            - Client portfolio management
            
            Use the following context about the user to provide relevant and personalized responses:
            
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