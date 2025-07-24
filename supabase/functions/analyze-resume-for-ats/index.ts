/// <reference types="https://esm.sh/@supabase/functions-js@2/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// A simple function to extract keywords from text
const extractKeywords = (text: string): Set<string> => {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter(word => word.length > 2) // Filter out short words
  );
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return new Response(JSON.stringify({ error: "Both resumeText and jobDescription are required." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const resumeKeywords = extractKeywords(resumeText);
    const jobKeywords = extractKeywords(jobDescription);

    const matchedKeywords = new Set([...resumeKeywords].filter(keyword => jobKeywords.has(keyword)));
    
    const score = jobKeywords.size > 0 
      ? Math.round((matchedKeywords.size / jobKeywords.size) * 100)
      : 0;

    const missingKeywords = [...jobKeywords].filter(keyword => !resumeKeywords.has(keyword));

    // Simulate a delay for a better user experience
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysis = {
      score: Math.min(score, 100), // Cap score at 100
      matchedKeywords: Array.from(matchedKeywords),
      missingKeywords: missingKeywords.slice(0, 15), // Limit for brevity
      jobKeywordCount: jobKeywords.size,
      resumeKeywordCount: resumeKeywords.size,
      matchCount: matchedKeywords.size,
    };

    return new Response(JSON.stringify(analysis), {
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