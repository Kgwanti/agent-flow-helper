
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  toEmail: string;
  firstName: string;
  lastName: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { toEmail, firstName, lastName }: EmailRequest = await req.json();
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const emailResponse = await resend.emails.send({
      from: "Real Estate Assistant <onboarding@resend.dev>",
      to: [toEmail],
      subject: "Update from Your Real Estate Agent",
      html: `
        <h1>Hello ${firstName} ${lastName}!</h1>
        <p>Thank you for choosing our real estate services. We're here to help you with your property needs.</p>
        <p>If you have any questions or concerns, please don't hesitate to reach out.</p>
        <p>Best regards,<br>Your Real Estate Team</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);
    return new Response(JSON.stringify(emailResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
