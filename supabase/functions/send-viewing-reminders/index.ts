import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

function generateEmailContent(
  firstName: string,
  address: string,
  viewingDate: string,
  viewingTime: string,
  reminderType: "week" | "day" | "hour"
) {
  const timeframe = {
    week: "next week",
    day: "tomorrow",
    hour: "in 1 hour",
  }[reminderType];

  const subject = {
    week: "Upcoming Property Viewing Next Week",
    day: "Your Property Viewing is Tomorrow",
    hour: "Your Property Viewing is in 1 Hour",
  }[reminderType];

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Property Viewing Reminder</h1>
      <p>Hello ${firstName},</p>
      <p>This is a friendly reminder about your upcoming property viewing ${timeframe}.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h2 style="color: #2c5282; margin-top: 0;">Viewing Details</h2>
        <p><strong>Property:</strong> ${address}</p>
        <p><strong>Date:</strong> ${viewingDate}</p>
        <p><strong>Time:</strong> ${viewingTime}</p>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #2c5282;">Important Notes</h3>
        <ul>
          <li>Please arrive 5-10 minutes before your scheduled time</li>
          <li>Bring a valid form of identification</li>
          <li>Feel free to take photos during the viewing</li>
          <li>Don't hesitate to ask questions about the property</li>
        </ul>
      </div>

      <p>If you need to reschedule or have any questions, please contact us immediately.</p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        Your Real Estate Team
      </p>
    </div>
  `;

  return { subject, html };
}

async function processReminders() {
  const now = new Date();
  
  // Get upcoming viewings with profile information
  const { data: viewings, error } = await supabase
    .from("viewing_appointments")
    .select(`
      *,
      profile:profiles (
        email,
        first_name
      )
    `)
    .gte("viewing_date", now.toISOString().split("T")[0]);

  if (error) {
    console.error("Error fetching viewings:", error);
    return;
  }

  for (const viewing of viewings) {
    if (!viewing.profile?.email || !viewing.profile?.first_name) continue;

    const viewingDateTime = new Date(
      `${viewing.viewing_date}T${viewing.viewing_time}`
    );
    const timeUntilViewing = viewingDateTime.getTime() - now.getTime();
    const hoursUntilViewing = timeUntilViewing / (1000 * 60 * 60);

    // Send 1-week reminder
    if (hoursUntilViewing >= 167 && hoursUntilViewing <= 169) {
      const { subject, html } = generateEmailContent(
        viewing.profile.first_name,
        viewing.address || "Address not provided",
        viewing.viewing_date,
        viewing.viewing_time,
        "week"
      );
      
      await sendReminderEmail(viewing.profile.email, subject, html);
      console.log(`Sent week reminder to ${viewing.profile.email}`);
    }

    // Send 1-day reminder
    if (hoursUntilViewing >= 23 && hoursUntilViewing <= 25) {
      const { subject, html } = generateEmailContent(
        viewing.profile.first_name,
        viewing.address || "Address not provided",
        viewing.viewing_date,
        viewing.viewing_time,
        "day"
      );
      
      await sendReminderEmail(viewing.profile.email, subject, html);
      console.log(`Sent day reminder to ${viewing.profile.email}`);
    }

    // Send 1-hour reminder
    if (hoursUntilViewing >= 0.9 && hoursUntilViewing <= 1.1) {
      const { subject, html } = generateEmailContent(
        viewing.profile.first_name,
        viewing.address || "Address not provided",
        viewing.viewing_date,
        viewing.viewing_time,
        "hour"
      );
      
      await sendReminderEmail(viewing.profile.email, subject, html);
      console.log(`Sent hour reminder to ${viewing.profile.email}`);
    }
  }
}

async function sendReminderEmail(email: string, subject: string, html: string) {
  try {
    await resend.emails.send({
      from: "Real Estate Assistant <onboarding@resend.dev>",
      to: [email],
      subject,
      html,
    });
  } catch (error) {
    console.error(`Failed to send reminder email to ${email}:`, error);
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    await processReminders();
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing reminders:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process reminders" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);