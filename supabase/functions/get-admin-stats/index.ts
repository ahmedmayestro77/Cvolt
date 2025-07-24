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

    // If user is admin, create a client with the service role key to fetch stats
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const [
      { count: userCount, error: userError },
      { count: resumeCount, error: resumeError },
      { count: coverLetterCount, error: coverLetterError },
    ] = await Promise.all([
      supabaseAdmin.from("profiles").select('*', { count: 'exact', head: true }),
      supabaseAdmin.from("resumes").select('*', { count: 'exact', head: true }),
      supabaseAdmin.from("cover_letters").select('*', { count: 'exact', head: true }),
    ]);

    if (userError || resumeError || coverLetterError) {
      console.error({ userError, resumeError, coverLetterError });
      throw new Error("Failed to fetch statistics.");
    }

    return new Response(JSON.stringify({ userCount, resumeCount, coverLetterCount }), {
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