import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import type { OnboardingAnswers } from "@/types";
import { RoadmapOutputSchema, type GeneratedRoadmap } from "./generate-roadmap";
import { SYSTEM_PROMPT, buildStreamingPrompt } from "./prompts";

/**
 * Streaming roadmap generation.
 * Returns a ReadableStream of partial roadmap objects for progressive loading.
 * Use this for real-time UI updates as the AI generates content.
 */
export async function streamRoadmap(
  answers: OnboardingAnswers
): Promise<ReadableStream<string>> {
  const prompt = buildStreamingPrompt({
    goal: answers.topic,
    currentLevel: answers.currentLevel,
    targetLevel: answers.targetLevel!,
    hoursPerWeek: parseInt(answers.weeklyHours as string) || 10,
    learningStyle: answers.learningStyle!,
    additionalContext: answers.goals?.join(", "),
  });

  // Try Groq first (primary), fallback to Gemini
  let result;
  if (process.env.GROQ_API_KEY) {
    try {
      if (process.env.NODE_ENV === "development") {
        console.log("[AI_MODEL] Attempting Groq API (primary)...");
      }
      result = await generateObject({
        model: groq("mixtral-8x7b-32768"),
        schema: RoadmapOutputSchema,
        system: SYSTEM_PROMPT,
        prompt,
        temperature: 0.7,
      });
    } catch (groqError) {
      if (process.env.NODE_ENV === "development") {
        console.log("[AI_MODEL] Groq failed, falling back to Gemini:", groqError);
      }
      result = await generateObject({
        model: google("gemini-2.5-flash"),
        schema: RoadmapOutputSchema,
        system: SYSTEM_PROMPT,
        prompt,
        temperature: 0.7,
      });
    }
  } else {
    // No Groq key, use Gemini directly
    result = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: RoadmapOutputSchema,
      system: SYSTEM_PROMPT,
      prompt,
      temperature: 0.7,
    });
  }

  // For streaming, we need to return the result in a way that can be streamed
  // Since generateObject doesn't directly support streaming, we'll return the result as a stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send the complete result as a single chunk for now
      // In a real streaming implementation, we'd need to use a streaming model
      controller.enqueue(encoder.encode(JSON.stringify(result.object)));
      controller.close();
    }
  });

  return stream;
}

/**
 * Alternative streaming approach: use TransformStream to emit JSON lines.
 * Each complete object is sent as a newline-delimited JSON object.
 */
export async function streamRoadmapAsJson(
  answers: OnboardingAnswers
): Promise<ReadableStream<Uint8Array>> {
  const prompt = buildStreamingPrompt({
    goal: answers.topic,
    currentLevel: answers.currentLevel,
    targetLevel: answers.targetLevel!,
    hoursPerWeek: parseInt(answers.weeklyHours as string) || 10,
    learningStyle: answers.learningStyle!,
    additionalContext: answers.goals?.join(", "),
  });

  // Try Groq first (primary), fallback to Gemini
  let result;
  if (process.env.GROQ_API_KEY) {
    try {
      if (process.env.NODE_ENV === "development") {
        console.log("[AI_MODEL] Attempting Groq API (primary)...");
      }
      result = await generateObject({
        model: groq("mixtral-8x7b-32768"),
        schema: RoadmapOutputSchema,
        system: SYSTEM_PROMPT,
        prompt,
        temperature: 0.7,
      });
    } catch (groqError) {
      if (process.env.NODE_ENV === "development") {
        console.log("[AI_MODEL] Groq failed, falling back to Gemini:", groqError);
      }
      result = await generateObject({
        model: google("gemini-2.5-flash"),
        schema: RoadmapOutputSchema,
        system: SYSTEM_PROMPT,
        prompt,
        temperature: 0.7,
      });
    }
  } else {
    // No Groq key, use Gemini directly
    result = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: RoadmapOutputSchema,
      system: SYSTEM_PROMPT,
      prompt,
      temperature: 0.7,
    });
  }

  // For now, return the result as a single chunk stream
  // True streaming would require a different approach
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(JSON.stringify(result.object) + "\n"));
      controller.close();
    }
  });

  return stream;
}
