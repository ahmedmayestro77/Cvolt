import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";
import Stripe from "https://esm.sh/stripe@15.12.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Stripe client
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

// This is the Price ID from your Stripe product.
// Replace this with your actual Price ID.
const PRO_PRICE_ID = "REPLACE_WITH_YOUR_STRIPE_PRICE_ID";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the user's auth token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Get user and their profile
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("User not found");

    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    let stripeCustomerId = profile.stripe_customer_id;

    // If user doesn't have a stripe_customer_id, create one
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_id: user.id },
      });
      stripeCustomerId = customer.id;

      // Save the new customer ID to the user's profile
      await supabaseClient
        .from("profiles")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", user.id);
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: stripeCustomerId,
      line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
      mode: "subscription",
      success_url: `${Deno.env.get("SITE_URL")!}/dashboard`,
      cancel_url: `${Deno.env.get("SITE_URL")!}/pricing`,
    });

    return new Response(JSON.stringify({ sessionId: session.id, checkoutUrl: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});