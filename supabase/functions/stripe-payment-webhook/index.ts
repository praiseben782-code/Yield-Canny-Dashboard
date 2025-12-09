// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Deno-compatible Stripe webhook handler using fetch
const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") ?? "";

Deno.serve(async (req) => {
  console.log("[Stripe Webhook] Event received");
  console.log("[Webhook] SERVICE_ROLE_KEY present:", serviceRoleKey ? "yes" : "NO - MISSING!");
  console.log("[Webhook] SUPABASE_URL:", supabaseUrl);
  
  // Parse raw body and signature
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  // Verify Stripe signature (use Stripe API or skip for local testing)
  // For production, use Stripe's official signature verification
  let event;
  try {
    event = JSON.parse(rawBody);
    console.log("[Webhook] Event type:", event.type);
  } catch (err) {
    console.error("[Webhook] Error parsing Stripe event:", err);
    return new Response(JSON.stringify({ error: "Invalid Stripe event" }), { status: 400 });
  }

  // Handle one-time payment (checkout.session.completed)
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_email;

    console.log("[Webhook] Checkout completed for:", customerEmail);

    if (customerEmail) {
      // Update user's payment status in Supabase
      const updateRes = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(customerEmail)}`, {
        method: "PATCH",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          is_paid: true,
          subscription_tier: "basic",
          updated_at: new Date().toISOString(),
        })
      });

      console.log("[Webhook] Update response status:", updateRes.status);
      
      if (updateRes.ok) {
        console.log(`[Webhook] User ${customerEmail} payment status updated to is_paid=true.`);
        // Send transactional email via Resend
        const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";
        const resendFromEmail = Deno.env.get("RESEND_FROM_EMAIL") ?? "YieldCanary HQ <hello@yieldcanary.com>";
        const subject = "You're in! YieldCanary Pro is now unlocked!";
        const body = `Hey ${customerEmail},\nWelcome to the real numbers. The blur is gone and you now see:\n• Death Clock on every ETF\n• True Income Yield after ROC\n• Take-Home Cash Return after taxes\n\nYour dashboard → https://app.yieldcanary.com\nLet's go find some dead canaries,\n-YieldCanary HQ`;
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: resendFromEmail,
            to: customerEmail,
            subject,
            text: body
          })
        });
        if (emailRes.ok) {
          console.log(`[Webhook] Payment receipt email sent to ${customerEmail}.`);
        } else {
          const errText = await emailRes.text();
          console.error("[Webhook] Error sending payment receipt email:", errText);
        }
      } else {
        const errText = await updateRes.text();
        console.error(`[Webhook] Error updating user payment status:`, errText);
      }
    }
  }
  if (["customer.subscription.created", "customer.subscription.updated"].includes(event.type)) {
    const subscription = event.data.object;
    const customerId = typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

    // Fetch customer email from Stripe API
    let email = "";
    if (customerId) {
      const stripeRes = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
        headers: {
          "Authorization": `Bearer ${stripeSecret}`,
        },
      });
      if (stripeRes.ok) {
        const customer = await stripeRes.json();
        email = customer.email;
      }
    }

    if (email) {
      // Update user's subscription status in Supabase
      const updateRes = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(email)}`, {
        method: "PATCH",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          is_paid: true,
          subscription_tier: "basic", // TODO: map price to tier
          updated_at: new Date().toISOString(),
        })
      });
      if (updateRes.ok) {
        console.log(`User ${email} subscription updated.`);
        // Send transactional email via Resend
        const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";
        const resendFromEmail = Deno.env.get("RESEND_FROM_EMAIL") ?? "YieldCanary HQ <hello@yieldcanary.com>";
        const subject = "You’re in! YieldCanary Pro is now unlocked!";
        const body = `Hey ${email},\nWelcome to the real numbers. The blur is gone and you now see:\n• Death Clock on every ETF\n• True Income Yield after ROC\n• Take-Home Cash Return after taxes\n\nYour dashboard → https://app.yieldcanary.com\nLet’s go find some dead canaries,\n-YieldCanary HQ`;
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: resendFromEmail,
            to: email,
            subject,
            text: body
          })
        });
        if (emailRes.ok) {
          console.log(`Transactional email sent to ${email}.`);
        } else {
          const errText = await emailRes.text();
          console.error("Error sending transactional email:", errText);
        }
      } else {
        const errText = await updateRes.text();
        console.error("Error updating user subscription:", errText);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { headers: { "Content-Type": "application/json" } });
});