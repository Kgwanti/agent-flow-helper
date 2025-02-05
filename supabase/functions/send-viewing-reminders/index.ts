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

async function sendReminderEmail(
  email: string,
  firstName: string,
  address: string,
  viewingDate: string,
  viewingTime: string,
  reminderType: "week" | "day" | "hour"
) {
  const subject = {
    week: "Upcoming Viewing Next Week",
    day: "Your Viewing is Tomorrow",
    hour: "Your Viewing is in 1 Hour",
  }[reminderType];

  const timeframe = {
    week: "next week",
    day: "tomorrow",
    hour: "in 1 hour",
  }[reminderType];

  try {
    await resend.emails.send({
      from: "Real Estate Assistant <onboarding@resend.dev>",
      to: [email],
      subject,
      html: `
        <h1>Viewing Reminder</h1>
        <p>Hello ${firstName},</p>
        <p>This is a reminder that you have a property viewing scheduled ${timeframe}.</p>
        <p><strong>Details:</strong></p>
        <ul>
          <li>Property: ${address}</li>
          <li>Date: ${viewingDate}</li>
          <li>Time: ${viewingTime}</li>
        </ul>
        <p>If you need to reschedule or have any questions, please contact us.</p>
        <p>Best regards,<br>Your Real Estate Team</p>
      `,
    });
    console.log(`Sent ${reminderType} reminder email to ${email}`);
  } catch (error) {
    console.error(`Failed to send ${reminderType} reminder email to ${email}:`, error);
  }
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
      await sendReminderEmail(
        viewing.profile.email,
        viewing.profile.first_name,
        viewing.address || "Address not provided",
        viewing.viewing_date,
        viewing.viewing_time,
        "week"
      );
    }

    // Send 1-day reminder
    if (hoursUntilViewing >= 23 && hoursUntilViewing <= 25) {
      await sendReminderEmail(
        viewing.profile.email,
        viewing.profile.first_name,
        viewing.address || "Address not provided",
        viewing.viewing_date,
        viewing.viewing_time,
        "day"
      );
    }

    // Send 1-hour reminder
    if (hoursUntilViewing >= 0.9 && hoursUntilViewing <= 1.1) {
      await sendReminderEmail(
        viewing.profile.email,
        viewing.profile.first_name,
        viewing.address || "Address not provided",
        viewing.viewing_date,
        viewing.viewing_time,
        "hour"
      );
    }
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