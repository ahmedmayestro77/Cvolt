/// <reference types="https://esm.sh/@supabase/functions-js@2/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// In a real-world scenario, this data could come from a database or a more complex config.
// IMPORTANT: The priceId values must correspond to Price IDs in your Stripe account.
const pricingData = {
  US: { price: "9", currency: "USD", currencySymbol: "$", priceId: Deno.env.get("STRIPE_PRO_PRICE_ID_USD")! },
  EG: { price: "275", currency: "EGP", currencySymbol: "E£", priceId: Deno.env.get("STRIPE_PRO_PRICE_ID_EGP")! },
  GB: { price: "7", currency: "GBP", currencySymbol: "£", priceId: Deno.env.get("STRIPE_PRO_PRICE_ID_GBP")! },
  // Add more countries and currencies as needed
  default: { price: "9", currency: "USD", currencySymbol: "$", priceId: Deno.env.get("STRIPE_PRO_PRICE_ID_USD")! },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Deno.conn.remoteAddr is not available in Supabase Edge Functions.
    // Instead, Supabase provides geo-location data in the request object.
    // @ts-ignore: Supabase-specific request properties
    const country = req.geo?.country?.code || 'default';

    const geoPrice = pricingData[country] || pricingData.default;

    if (!geoPrice.priceId) {
      console.error(`Stripe Price ID not configured for country: ${country}`);
      // Fallback to default if a specific price ID is missing.
      return new Response(JSON.stringify(pricingData.default), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify(geoPrice), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});