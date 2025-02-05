import { Resend } from "npm:resend@2.0.0";

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const resend = new Resend(resendApiKey);

export const sendEmailTranscript = async (
  email: string,
  name: string,
  userMessage: string,
  aiResponse: string
) => {
  if (!email) {
    throw new Error('No email address provided');
  }

  try {
    const emailResponse = await resend.emails.send({
      from: "Real Estate Assistant <onboarding@resend.dev>",
      to: [email],
      subject: "Your Real Estate Assistant Update",
      html: `
        <h1>Hello ${name || 'there'}!</h1>
        <p>Here's a copy of our recent conversation:</p>
        <p><strong>Your message:</strong><br>${userMessage}</p>
        <p><strong>My response:</strong><br>${aiResponse}</p>
        <p>Best regards,<br>Your Real Estate Assistant</p>
      `,
    });
    console.log('Email sent successfully:', emailResponse);
    return emailResponse;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};