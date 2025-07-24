/// <reference types="https://esm.sh/@supabase/functions-js@2" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.52.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const prompt = `
You are an expert ATS (Applicant Tracking System) analysis tool. Your task is to compare a resume against a job description.
Analyze the provided resume text and job description.
Identify the key skills, technologies, and qualifications mentioned in the job description.
Then, determine which of these keywords are present in the resume and which are missing.
Finally, calculate a match score as a percentage based on how many of the job description's keywords are found in the resume.

Provide the output in a JSON format with the following structure:
{
  "score": number,
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "matchCount": number,
  "jobKeywordCount": number
}

Do not include any explanations or text outside of the JSON object.
`;

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

    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return new Response(JSON.stringify({ error: "Both resumeText and jobDescription are required." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Job Description: """${jobDescription}"""\n\nResume: """${resumeText}"""` },
      ],
      temperature: 0.2,
    });

    const analysisResult = completion.choices[0].message.content;

    if (!analysisResult) {
      throw new Error("Failed to get a response from the AI model.");
    }

    return new Response(analysisResult, {
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