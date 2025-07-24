/// <reference types="https://esm.sh/@supabase/functions-js@2" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.52.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `
You are a team of expert career coaches and writers. Your goal is to create a compelling, professional cover letter based on a user's resume and a specific job description. You will output the result as a single, valid JSON object.

The JSON object must have the following structure:
{
  "coverLetterContent": "string"
}

Here is your collaborative workflow:
1.  **Agent 1 (Job Analyst):** Meticulously analyze the provided Job Description. Identify the top 5-7 key requirements, skills, and qualifications the employer is looking for. Note the company's tone and industry.
2.  **Agent 2 (Candidate Profiler):** Carefully review the user's Resume. Extract the most relevant experiences, skills, and achievements that align with the key requirements identified by the Job Analyst.
3.  **Agent 3 (Master Writer):** Synthesize the insights from the other agents to draft a powerful cover letter.
    -   **Introduction:** Start with a strong opening that grabs the reader's attention, mentions the specific job title, and states your enthusiasm.
    -   **Body Paragraphs (2-3):** This is the core. For each key requirement from the job description, create a concise paragraph that demonstrates how the user's experience (from their resume) directly meets that need. Use the "Show, don't just tell" principle. Use keywords from the job description naturally.
    -   **Closing Paragraph:** Reiterate your interest in the role and the company. Confidently state your value proposition and include a clear call to action (e.g., "I am eager to discuss how my skills in... can benefit your team.").
    -   **Formatting:** Ensure the letter is professional, well-structured, and has a positive and confident tone.
4.  **Agent 4 (JSON Formatter):** Place the final, complete cover letter text into the "coverLetterContent" field of the JSON object. Ensure the entire response is only this single, valid JSON object.
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

    const { jobDescription, resumeText } = await req.json();

    if (!jobDescription || !resumeText) {
      return new Response(JSON.stringify({ error: "jobDescription and resumeText are required." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Job Description: """${jobDescription}"""\n\nResume Text: """${resumeText}"""` },
      ],
      temperature: 0.7,
    });

    const coverLetterJson = completion.choices[0].message.content;

    if (!coverLetterJson) {
      throw new Error("Failed to get a response from the AI model.");
    }

    return new Response(coverLetterJson, {
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