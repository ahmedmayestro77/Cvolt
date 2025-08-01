/// <reference types="https://esm.sh/@supabase/functions-js@2" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Create Supabase client with user's auth token
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // 2. Check if user is authenticated and is an admin
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("User not found");

    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;
    if (profile.role !== 'admin') {
      return new Response(JSON.stringify({ error: "Forbidden: Not an admin" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Create admin client to call RPC
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 4. Call the RPC function
    const { data: growthData, error: rpcError } = await supabaseAdmin.rpc('get_user_growth_data', { days_limit: 30 });

    if (rpcError) {
      console.error('RPC Error:', rpcError);
      throw rpcError;
    }

    // 5. Return the data
    return new Response(JSON.stringify(growthData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});