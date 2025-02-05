import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const resend = new Resend(resendApiKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WelcomeEmailRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName }: WelcomeEmailRequest = await req.json();
    const name = firstName ? `${firstName}${lastName ? ` ${lastName}` : ''}` : 'there';

    const emailResponse = await resend.emails.send({
      from: "Real Estate Assistant <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Real Estate Assistant!",
      html: `
        <h1>Welcome ${name}!</h1>
        <p>Thank you for joining Real Estate Assistant. We're excited to help you with your real estate journey!</p>
        <p>With our platform, you can:</p>
        <ul>
          <li>Schedule property viewings</li>
          <li>Chat with our AI assistant</li>
          <li>Manage your documents</li>
          <li>Set your property preferences</li>
        </ul>
        <p>If you have any questions, feel free to use our AI chat assistant - it's available 24/7 to help you!</p>
        <p>Best regards,<br>The Real Estate Assistant Team</p>
      `,
    });

    console.log('Welcome email sent successfully:', emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);