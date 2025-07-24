import { serve } from "std/http/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET")!
    );
  } catch (err) {
    console.error(err.message);
    return new Response(err.message, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const customerId = session.customer;

      if (!customerId) {
        throw new Error("Webhook Error: Missing customer ID in session.");
      }

      // Find user by stripe_customer_id and update their subscription
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ subscription_status: "pro" })
        .eq("stripe_customer_id", customerId as string);

      if (error) {
        throw new Error(`Webhook Error: Failed to update profile for customer ${customerId}. ${error.message}`);
      }
      
      console.log(`Successfully upgraded plan for customer: ${customerId}`);
    }
  } catch (error) {
    console.error(error.message);
    // We don't want to return a 400 to Stripe if it's a server error
    // as it will retry the webhook.
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});