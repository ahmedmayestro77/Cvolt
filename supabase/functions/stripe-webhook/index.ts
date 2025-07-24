/// <reference types="https://esm.sh/@supabase/functions-js@2" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@16.2.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();

  if (!signature) {
    return new Response("Stripe-Signature header is required.", { status: 400, headers: corsHeaders });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET")!
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(err.message, { status: 400, headers: corsHeaders });
  }

  if (relevantEvents.has(event.type)) {
    try {
      let customerId: string | null = null;
      let subscriptionStatus: 'pro' | 'free' | null = null;

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          customerId = session.customer as string;
          subscriptionStatus = 'pro';
          break;
        }
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          customerId = subscription.customer as string;
          subscriptionStatus = subscription.status === 'active' || subscription.status === 'trialing' ? 'pro' : 'free';
          break;
        }
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          customerId = subscription.customer as string;
          subscriptionStatus = 'free';
          break;
        }
        default:
          throw new Error('Unhandled relevant event!');
      }

      if (!customerId) {
        throw new Error(`Webhook Error: Missing customer ID for event type ${event.type}.`);
      }

      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ subscription_status: subscriptionStatus })
        .eq("stripe_customer_id", customerId);

      if (error) {
        throw new Error(`Webhook Error: Failed to update profile for customer ${customerId}. ${error.message}`);
      }
      
      console.log(`Successfully processed event ${event.type} for customer: ${customerId}`);

    } catch (error) {
      console.error(error.message);
      return new Response(
        JSON.stringify({ error: `Webhook handler failed: ${error.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});