// @ts-nocheck
/// <reference types="https://esm.sh/@supabase/functions-js@2" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.52.7";
import { extract } from "https://esm.sh/pdf-text-extract@1.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `
You are an expert resume parsing agent. Your task is to analyze the text extracted from a user's resume PDF and structure it into a valid JSON object.

The JSON object must have the following structure and data types:
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "linkedin": "string (must be a valid URL format or an empty string)",
  "summary": "string (The professional summary section)",
  "experience": "string (The entire work experience section, preserving formatting like bullet points)",
  "education": "string (The entire education section, preserving formatting)",
  "skills": "string (A comma-separated list of skills extracted from the skills section)"
}

Analyze the provided text and map the content to the correct fields. Be intelligent about identifying sections even if they are not explicitly labeled. If a field (like phone or linkedin) is not found, return an empty string for it. The entire response must be only the valid JSON object.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openAIKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIKey) {
      throw new Error("OpenAI API key is not set.");
    }
    const openai = new OpenAI({ apiKey: openAIKey });

    const pdfBuffer = await req.arrayBuffer();
    let extractedText: string;
    try {
      extractedText = await extract(pdfBuffer, { splitPages: false });
    } catch (e) {
      throw new Error(`Failed to extract text from PDF: ${e.message}`);
    }

    if (!extractedText) {
      throw new Error("Could not extract any text from the provided PDF.");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Resume Text: """${extractedText}"""` },
      ],
      temperature: 0.2,
    });

    const resumeJson = completion.choices[0].message.content;
    if (!resumeJson) {
      throw new Error("AI model failed to return parsed data.");
    }

    return new Response(resumeJson, {
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