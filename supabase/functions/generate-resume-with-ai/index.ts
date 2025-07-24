/// <reference types="https://esm.sh/@supabase/functions-js@2" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.52.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `
You are a team of expert resume writing agents. Your goal is to create a complete, professional resume based on a user's prompt. You will output the result as a single, valid JSON object.

The JSON object must have the following structure and data types:
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "linkedin": "string (must be a valid URL format or an empty string)",
  "summary": "string (3-5 sentences professional summary)",
  "experience": "string (Formatted with job titles, companies, dates, and 3-5 bullet points per job, using action verbs. Use markdown for formatting, e.g., **Job Title** at Company Name.)",
  "education": "string (Formatted with degree, university, and dates. e.g., Bachelor of Science in Computer Science - University of Example (2015-2019))",
  "skills": "string (Comma-separated list of relevant skills)"
}

Here is your collaborative workflow:
1.  **Agent 1 (Profiler):** Analyze the user's prompt. Extract all personal details (name, email, phone, linkedin), professional experience, education, and skills. If information is missing, generate plausible placeholder content (e.g., a generic email like 'your.email@example.com', a placeholder name, etc.).
2.  **Agent 2 (Content Writer):** Based on the profiler's analysis, write compelling content for each section.
    -   **Summary:** Write a powerful professional summary tailored to the user's target role.
    -   **Experience:** For each role mentioned or inferred, write 3-5 impactful bullet points. Use the STAR method (Situation, Task, Action, Result). Start each bullet point with a strong action verb. Quantify achievements whenever possible (e.g., "Increased user engagement by 20%").
    -   **Education:** Format the education section professionally and clearly.
    -   **Skills:** List the most relevant technical and soft skills for the target role.
3.  **Agent 3 (JSON Formatter):** Assemble all the generated content into the final JSON structure specified above. Ensure all fields are populated with strings, the JSON is valid, and there are no trailing commas.

Do not include any text, explanations, or markdown outside of the final, single JSON object. The entire response must be only the JSON.
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

    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "A prompt is required." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User Prompt: """${prompt}"""` },
      ],
      temperature: 0.5,
    });

    const resumeJson = completion.choices[0].message.content;

    if (!resumeJson) {
      throw new Error("Failed to get a response from the AI model.");
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