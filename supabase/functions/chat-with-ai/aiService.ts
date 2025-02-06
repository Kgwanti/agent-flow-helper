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
    return `I'm your dedicated real estate assistant, and here's how I can help you:

1. 🏠 Property Search and Recommendations
   - Search properties by location, price, and bedrooms
   - Get personalized recommendations based on your preferences

2. 📊 Market Trend Analysis
   - Current market insights and price trends
   - Local market conditions, especially in South Africa
   - Historical price changes and future predictions

3. 💰 Financial and Legal Assistance
   - Mortgage calculations
   - Property tax estimates
   - Transfer duties and capital gains tax information
   - Net proceeds calculations for sellers

4. 📧 Communication Tools
   - Draft professional emails to agents/sellers
   - Negotiation tips and strategies
   - Pre-written communication templates

5. 📝 Step-by-Step Guides and Checklists
   - First-time buyer/seller guidance
   - Document checklists
   - Process walkthroughs

6. 🔔 Real-Time Property Updates
   - New listing notifications
   - Price change alerts
   - Property availability updates

7. 📄 Document Management
   - Form filling assistance
   - Digital document organization
   - Administrative task support

8. 🎯 Personalized Recommendations
   - Property suggestions based on your preferences
   - Tailored recommendations from past interactions

Just let me know which area you'd like assistance with, and I'll be happy to help!`;
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
            content: `You are an AI real estate assistant specialized in South African real estate. You can help with:
            - Property search and recommendations
            - Market trend analysis
            - Financial and legal assistance
            - Communication tools
            - Step-by-step guides
            - Real-time property updates
            - Document management
            - Personalized recommendations
            
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