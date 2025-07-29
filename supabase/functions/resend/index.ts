// Setup Supabase Edge Runtime & SMTP
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SmtpClient } from "jsr:@xtool/smtp";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Start the Edge Function
Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response("Email is required", { status: 400 });
    }

    // 1. Generate token and link
    const resetToken = crypto.randomUUID();
    const resetLink =
      `https://yourfrontend.com/reset-password?token=${resetToken}`;

    // 2. Setup Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 3. Insert token into `password_resets` table (expires in 1 hour)
    const { error: insertError } = await supabase.from("password_resets")
      .insert({
        email,
        token: resetToken,
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour expiry
      });

    if (insertError) {
      console.error("Token insert failed:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save reset token." }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // 4. Setup SMTP client
    const client = new SmtpClient();
    await client.connect({
      hostname: "smtp.gmail.com",
      port: 465,
      username: Deno.env.get("SENDER_USERNAME")!,
      password: Deno.env.get("SENDER_PASSWORD")!,
      tls: true,
    });

    // 5. Send the email
    await client.send({
      from: Deno.env.get("SENDER_USERNAME")!,
      to: email,
      subject: "Reset your password",
      html: `
        <p>Hi,</p>
        <p>You requested a password reset.</p>
        <p>Click this link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
        <br/>
        <p>— Your App Team</p>
      `,
    });

    // 6. Close the SMTP connection
    client.close();

    return new Response(
      JSON.stringify({ message: "Password reset email sent." }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
