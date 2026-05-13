import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { db } from "@/server/db";
import { roadmaps, phases, topics, resources } from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";
import type { OnboardingAnswers } from "@/types";
import { SYSTEM_PROMPT, buildGenerationPrompt } from "./prompts";
import { isCommonGoal, findClosestCommonGoal, TOP_GOALS } from "./constants";

// ─── Zod Schemas for AI output ────────────────────────────────────────────────

const ResourceSchema = z.object({
  title: z.string(),
  url: z.string().regex(/^https?:\/\/.+/, "URLs must start with http:// or https://"),
  type: z.enum(["video", "article", "course", "documentation", "book", "interactive"]),
  isFree: z.boolean().default(true),
  platform: z.string().optional(),
  qualityScore: z.number().int().min(1).max(10).optional().default(7),
});

const TopicSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimatedHours: z.number().int().min(1).max(100),
  difficulty: z.enum(["easy", "medium", "hard"]),
  prerequisites: z.array(z.string()),
  resources: z.array(ResourceSchema),
});

const PhaseSchema = z.object({
  title: z.string(),
  description: z.string(),
  estimatedHours: z.number().int().min(1),
  topics: z.array(TopicSchema),
});

export const RoadmapOutputSchema = z.object({
  title: z.string(),
  description: z.string(),
  goal: z.string(),
  estimatedTotalHours: z.number().int().min(1),
  phases: z.array(PhaseSchema).min(1).max(10),
});

export type GeneratedRoadmap = z.infer<typeof RoadmapOutputSchema>;
export type GeneratedPhase = z.infer<typeof PhaseSchema>;
export type GeneratedTopic = z.infer<typeof TopicSchema>;
export type GeneratedResource = z.infer<typeof ResourceSchema>;

// ─── AI Model Selection (Groq primary, Gemini fallback) ────────────────────────

async function generateRoadmapWithAI({
  schema,
  system,
  prompt,
  temperature,
}: {
  schema: z.ZodType<GeneratedRoadmap>;
  system: string;
  prompt: string;
  temperature: number;
}) {
  const isDev = process.env.NODE_ENV === "development";
  
  try {
    // Primary: Use Groq (faster, cheaper)
    if (process.env.GROQ_API_KEY) {
      try {
        console.log("[AI_MODEL] Attempting Groq API (primary)...");
        return await generateObject({
          model: groq("mixtral-8x7b-32768"),
          schema,
          system,
          prompt,
          temperature,
        });
      } catch (groqError) {
        console.error("[AI_MODEL] Groq failed:", groqError instanceof Error ? groqError.message : String(groqError));
        // Fall through to Gemini
      }
    } else {
      console.warn("[AI_MODEL] GROQ_API_KEY is not set");
    }

    // Fallback: Use Gemini
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      try {
        console.log("[AI_MODEL] Using Gemini API (fallback)...");
        return await generateObject({
          model: google("gemini-2.5-flash"),
          schema,
          system,
          prompt,
          temperature,
        });
      } catch (geminiError) {
        console.error("[AI_MODEL] Gemini failed:", geminiError instanceof Error ? geminiError.message : String(geminiError));
        throw geminiError;
      }
    } else {
      console.warn("[AI_MODEL] GOOGLE_GENERATIVE_AI_API_KEY is not set");
    }

    // Neither API is configured
    throw new Error(
      "No AI API configured. Please set GROQ_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in environment variables."
    );
  } catch (error) {
    console.error("[AI_MODEL] All fallbacks failed:", error instanceof Error ? error.message : String(error));
    throw error;
  }
}

// ─── Post-Processing Validation ───────────────────────────────────────────────

function validateAndNormalizeRoadmap(roadmap: GeneratedRoadmap): GeneratedRoadmap {
  // Validate all URLs are http or https
  for (const phase of roadmap.phases) {
    for (const topic of phase.topics) {
      for (const resource of topic.resources) {
        if (!resource.url.startsWith("http://") && !resource.url.startsWith("https://")) {
          throw new Error(`Resource URL must be HTTP or HTTPS: ${resource.url}`);
        }
      }
    }
  }

  // Normalize time estimates
  const normalizedPhases = roadmap.phases.map((phase) => ({
    ...phase,
    estimatedHours: Math.max(1, Math.ceil(phase.estimatedHours)),
    topics: phase.topics.map((topic) => ({
      ...topic,
      estimatedHours: Math.max(1, Math.ceil(topic.estimatedHours)),
    })),
  }));

  // Recalculate total hours based on phases
  const totalHours = normalizedPhases.reduce((sum, p) => sum + p.estimatedHours, 0);

  return {
    ...roadmap,
    estimatedTotalHours: Math.max(1, Math.ceil(totalHours)),
    phases: normalizedPhases,
  };
}

// ─── Template Lookup ──────────────────────────────────────────────────────────

async function findTemplateRoadmap(
  goal: string,
  skillLevel: string
): Promise<GeneratedRoadmap | null> {
  try {
    const commonGoal = findClosestCommonGoal(goal);
    if (!commonGoal) return null;

    // Look for existing template
    const [template] = await db
      .select()
      .from(roadmaps)
      .where(
        and(
          eq(roadmaps.isTemplate, true),
          eq(roadmaps.goal, commonGoal),
          eq(roadmaps.skillLevel, skillLevel as any)
        )
      )
      .orderBy(desc(roadmaps.createdAt))
      .limit(1);

    if (!template) return null;

    if (process.env.NODE_ENV === "development") {
      console.log("[TEMPLATE_LOOKUP] Found cached template for:", goal);
    }

    // Fetch related phases, topics, resources
    const phaseRows = await db
      .select()
      .from(phases)
      .where(eq(phases.roadmapId, template.id));

    const phaseIds = phaseRows.map((p) => p.id);
    if (phaseIds.length === 0) return null;

    const topicRows = await db
      .select()
      .from(topics)
      .where(eq(topics.phaseId, phaseIds[0]));

    const topicIds = topicRows.map((t) => t.id);
    const resourceRows =
      topicIds.length > 0
        ? await db
            .select()
            .from(resources)
            .where(eq(resources.topicId, topicIds[0]))
        : [];

    // Reconstruct roadmap from template
    return {
      title: template.title,
      description: template.description ?? "",
      goal: template.goal,
      estimatedTotalHours: template.estimatedTotalHours ?? 40,
      phases: phaseRows.map((phase) => ({
        title: phase.title,
        description: phase.description ?? "",
        estimatedHours: phase.estimatedHours ?? 10,
        topics: topicRows
          .filter((t) => t.phaseId === phase.id)
          .map((topic) => ({
            title: topic.title,
            description: topic.description ?? "",
            estimatedHours: topic.estimatedHours ?? 5,
            difficulty: topic.difficulty as any,
            prerequisites: (topic.prerequisites as string[]) ?? [],
            resources: resourceRows
              .filter((r) => r.topicId === topic.id)
              .map((r) => ({
                title: r.title,
                url: r.url,
                type: r.type as any,
                isFree: r.isFree,
                platform: r.platform ?? undefined,
                qualityScore: r.qualityScore ?? 7,
              })),
          })),
      })),
    };
  } catch (err) {
    console.error("[TEMPLATE_LOOKUP]", err);
    return null;
  }
}

// ─── Main Generation Function ────────────────────────────────────────────────

export async function generateRoadmap(
  answers: OnboardingAnswers
): Promise<GeneratedRoadmap> {
  // Step 1: Check for cached template
  const cachedTemplate = await findTemplateRoadmap(answers.topic, answers.targetLevel!);
  if (cachedTemplate) {
    if (process.env.NODE_ENV === "development") {
      console.log("[ROADMAP_GENERATE] Using cached template for:", answers.topic);
    }
    // Personalize the schedule based on hoursPerWeek
    const weeklyHours = parseInt(answers.weeklyHours as string) || 10;
    return adjustRoadmapForWeeklyHours(cachedTemplate, weeklyHours);
  }

  // Step 2: Generate new roadmap with AI
  if (process.env.NODE_ENV === "development") {
    console.log("[ROADMAP_GENERATE] Generating new roadmap for:", answers.topic);
  }

  const prompt = buildGenerationPrompt({
    goal: answers.topic,
    currentLevel: answers.currentLevel,
    targetLevel: answers.targetLevel!,
    hoursPerWeek: parseInt(answers.weeklyHours as string) || 10,
    learningStyle: answers.learningStyle!,
    additionalContext: answers.goals?.join(", "),
  });

  // Try Groq first (faster, cheaper), fallback to Gemini
  const { object } = await generateRoadmapWithAI({
    schema: RoadmapOutputSchema,
    system: SYSTEM_PROMPT,
    prompt,
    temperature: 0.7,
  });

  // Step 3: Validate and normalize
  const validated = validateAndNormalizeRoadmap(object);

  // Step 4: Save as template if it's a common goal
  if (isCommonGoal(answers.topic)) {
    if (process.env.NODE_ENV === "development") {
      console.log("[ROADMAP_GENERATE] Saving as template:", answers.topic);
    }
    await saveAsTemplate(validated, answers.targetLevel!);
  }

  return validated;
}

// ─── Helper: Adjust roadmap for weekly hours ──────────────────────────────────

function adjustRoadmapForWeeklyHours(
  roadmap: GeneratedRoadmap,
  weeklyHours: number
): GeneratedRoadmap {
  // Simple adjustment: recalculate total weeks based on new weekly commitment
  const originalWeeklyHours = 10; // Default assumption
  const ratio = weeklyHours / originalWeeklyHours;

  return {
    ...roadmap,
    estimatedTotalHours: Math.ceil(roadmap.estimatedTotalHours / ratio),
  };
}

// ─── Helper: Save roadmap as template ────────────────────────────────────────

async function saveAsTemplate(
  roadmap: GeneratedRoadmap,
  skillLevel: string
): Promise<void> {
  try {
    // Check if template already exists for this goal+skillLevel
    const existing = await db
      .select({ id: roadmaps.id })
      .from(roadmaps)
      .where(
        and(
          eq(roadmaps.isTemplate, true),
          eq(roadmaps.goal, roadmap.goal),
          eq(roadmaps.skillLevel, skillLevel as any)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      if (process.env.NODE_ENV === "development") {
        console.log("[TEMPLATE] Template already exists, skipping save");
      }
      return;
    }

    // Insert template roadmap
    const [templateRow] = await db
      .insert(roadmaps)
      .values({
        title: roadmap.title,
        description: roadmap.description,
        goal: roadmap.goal,
        skillLevel: skillLevel as any,
        estimatedTotalHours: roadmap.estimatedTotalHours,
        isPublic: false,
        isTemplate: true,
        metadata: { generatedAt: new Date().toISOString() },
      })
      .returning({ id: roadmaps.id });

    // Insert phases, topics, resources
    for (let pi = 0; pi < roadmap.phases.length; pi++) {
      const phase = roadmap.phases[pi];

      const [phaseRow] = await db
        .insert(phases)
        .values({
          roadmapId: templateRow.id,
          title: phase.title,
          description: phase.description,
          orderIndex: pi,
          estimatedHours: phase.estimatedHours,
        })
        .returning({ id: phases.id });

      for (let ti = 0; ti < phase.topics.length; ti++) {
        const topic = phase.topics[ti];

        const [topicRow] = await db
          .insert(topics)
          .values({
            phaseId: phaseRow.id,
            title: topic.title,
            description: topic.description,
            orderIndex: ti,
            estimatedHours: topic.estimatedHours,
            difficulty: topic.difficulty,
            prerequisites: topic.prerequisites,
          })
          .returning({ id: topics.id });

        if (topic.resources.length > 0) {
          await db.insert(resources).values(
            topic.resources.map((r) => ({
              topicId: topicRow.id,
              title: r.title,
              url: r.url,
              type: r.type,
              isFree: r.isFree,
              platform: r.platform ?? null,
              qualityScore: r.qualityScore ?? 7,
            }))
          );
        }
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[TEMPLATE] Template saved successfully");
    }
  } catch (err) {
    console.error("[TEMPLATE_SAVE_ERROR]", err);
    // Don't fail the main flow if template save fails
  }
}

