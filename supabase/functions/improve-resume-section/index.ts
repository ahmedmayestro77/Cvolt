/// <reference types="https://esm.sh/@supabase/functions-js@2/src/edge-runtime.d.ts" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mock AI responses for demonstration purposes
const mockResponses = {
  summary: "As a highly motivated and results-oriented professional with over five years of experience in project management, I have a proven track record of delivering complex projects on time and within budget. My expertise in Agile methodologies and cross-functional team leadership has consistently driven efficiency and stakeholder satisfaction. I am seeking to leverage my skills to contribute to a dynamic organization that values innovation and growth.",
  experience: "Spearheaded the development of a new client onboarding system, which reduced processing time by 30% and improved customer satisfaction scores by 15% within the first quarter. Managed a portfolio of 10+ projects simultaneously, with budgets ranging from $50,000 to $1M, ensuring all deliverables met quality standards and deadlines. Collaborated with international teams across three time zones, fostering a culture of open communication and shared success.",
  education: "Master of Business Administration (MBA) from Stanford University, Graduate School of Business, with a specialization in Strategic Management. Bachelor of Science in Computer Science from the Massachusetts Institute of Technology (MIT), where I graduated with honors and was actively involved in the university's AI research lab.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { section, text } = await req.json();

    if (!section || !text || !mockResponses[section]) {
      return new Response(JSON.stringify({ error: "Missing or invalid 'section' or 'text' in request body" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // In a real application, you would call an LLM API (e.g., OpenAI) here.
    // For now, we'll return a mocked, improved version.
    // Simulate a network delay for a realistic user experience.
    await new Promise(resolve => setTimeout(resolve, 1500));

    const improvedText = mockResponses[section];

    return new Response(JSON.stringify({ improvedText }), {
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