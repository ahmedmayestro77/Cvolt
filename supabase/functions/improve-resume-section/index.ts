/// <reference types="https://esm.sh/@supabase/functions-js@2" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getPrompt = (section: string, text: string): string => {
  switch (section) {
    case 'summary':
      return `Rewrite the following professional summary to be more impactful and concise for a resume. Focus on action verbs and quantifiable achievements. The summary is: "${text}"`;
    case 'experience':
      return `Rewrite the following work experience description for a resume. Use the STAR method (Situation, Task, Action, Result) to frame the accomplishments. Make it professional and highlight key achievements. The experience is: "${text}"`;
    case 'education':
      return `Rewrite the following education section for a resume. Ensure it is clear, professional, and concise. Include degrees, universities, and graduation dates where available. The education description is: "${text}"`;
    default:
      return `Improve the following text for a resume: "${text}"`;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      throw new Error("OpenAI API key is not set in project secrets.");
    }
    const openai = new OpenAI({ apiKey: openAIKey });

    const { section, text } = await req.json();

    if (!section || !text) {
      return new Response(JSON.stringify({ error: "Missing 'section' or 'text' in request body" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const prompt = getPrompt(section, text);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert resume writing assistant. You provide clear, professional, and impactful content for resumes." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const improvedText = completion.choices[0].message.content?.trim();

    if (!improvedText) {
      throw new Error("Failed to get a response from the AI model.");
    }

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