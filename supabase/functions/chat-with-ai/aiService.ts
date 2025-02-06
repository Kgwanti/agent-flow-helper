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
    return `I'm your integrated real estate assistant with direct access to your database and systems. Here's how I can help you:

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

3. 📄 Document Management & Analysis
   - Store and organize property documents
   - Extract key dates and information from contracts
   - Analyze legal documents for important terms
   - Generate document summaries
   - Track document status and deadlines

4. 💡 Intelligent Insights
   - Access market trends and data
   - Generate property valuations
   - Analyze client preferences
   - Track communication history
   - Monitor property status changes

5. 🏠 Property Information
   - Search property database
   - Track property updates
   - Monitor price changes
   - Generate property reports

6. 💼 Administrative Tasks
   - Generate meeting summaries
   - Create task reminders
   - Organize client information
   - Track important deadlines

7. 📊 Client Portfolio Management
   - Track client preferences
   - Monitor client interactions
   - Manage client documents
   - Generate client reports

8. 🤝 Communication Support
   - Draft professional emails
   - Create viewing summaries
   - Generate property descriptions
   - Compose client updates

Since I'm connected to your database, I can provide real-time information about your clients, properties, and schedule. Just let me know what you need assistance with!`;
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
            - Property information and updates
            - Administrative tasks
            - Communication support
            
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