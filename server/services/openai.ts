import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function searchWithOpenAI(query: string): Promise<any> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant for Rhythmic Souls AI, a company that provides intelligent business solutions including:
          - Conversational AI (chatbots, voicebots, WhatsApp bots)
          - Agentic AI Solutions (dynamic workflows, automation)
          - Call Centre Solutions (agent auditing, analytics)
          - DevOps & CI/CD (pipelines, observability)
          - MLOps Platform (model training, data annotation)
          - GPU & Infrastructure Optimization (cost optimization, GPU slicing)
          
          Also provide information about our secondary services:
          - Content creation tools
          - Educational platform with code editor
          - Music tools for creators
          - Latest news and resources
          
          Contact: info@rhythmicsouls.ai, +91-9220460200
          
          Respond with relevant information based on the user's query. Format your response as JSON with 'answer' and 'related_topics' fields.`
        },
        {
          role: "user",
          content: query
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      answer: result.answer || "I can help you with information about our AI solutions and services.",
      relatedTopics: result.related_topics || [],
      query: query
    };
  } catch (error) {
    console.error("OpenAI search error:", error);
    throw new Error("Search functionality is currently unavailable");
  }
}

export async function generateContent(prompt: string, type: "blog" | "social" | "email"): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a content creator for Rhythmic Souls AI. Generate high-quality ${type} content based on the prompt. Keep it professional and aligned with our AI/tech focus.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Content generation error:", error);
    throw new Error("Content generation failed");
  }
}
