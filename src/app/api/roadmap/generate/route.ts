import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { generateRoadmap } from "@/server/ai/generate-roadmap";
import { streamRoadmap } from "@/server/ai/stream-roadmap";
import { db } from "@/server/db";
import { roadmaps, phases, topics, resources } from "@/server/db/schema";
import { z } from "zod";
import { checkRateLimit, RateLimits, createRateLimitResponse } from "@/server/rate-limiter";

// ─── Types ───────────────────────────────────────────────────────────────────────

interface RoadmapResource {
  title: string;
  url: string;
  type: "video" | "article" | "course" | "documentation" | "book" | "interactive";
  isFree?: boolean;
  platform?: string | null;
  qualityScore?: number;
}

interface RoadmapTopic {
  title: string;
  description: string;
  estimatedHours: number;
  difficulty: "easy" | "medium" | "hard";
  prerequisites: string[];
  resources: RoadmapResource[];
}

interface RoadmapPhase {
  title: string;
  description: string;
  estimatedHours: number;
  topics: RoadmapTopic[];
}

interface RoadmapData {
  title: string;
  description: string;
  goal: string;
  estimatedTotalHours: number;
  phases: RoadmapPhase[];
}

interface EnrichedInput {
  topic: string;
  currentLevel: "beginner" | "intermediate" | "advanced";
  weeklyHours: string;
  learningStyles: string[];
  additionalContext?: string;
  targetLevel: "beginner" | "intermediate" | "advanced";
  learningStyle: "visual" | "reading" | "hands-on" | "mixed";
  goals: string[];
}

// ─── Input Validation ─────────────────────────────────────────────────────────

const GenerationInputSchema = z.object({
  topic: z.string().min(1).max(200),
  currentLevel: z.enum(["beginner", "intermediate", "advanced"]),
  weeklyHours: z.string().refine((h) => !isNaN(parseInt(h)) && parseInt(h) > 0, {
    message: "weeklyHours must be a positive number string",
  }),
  learningStyles: z.array(z.string()).min(1),
  additionalContext: z.string().optional().default(""),
});

// ─── Helper: Save roadmap to DB ───────────────────────────────────────────────

async function saveRoadmapToDb(
  roadmapData: RoadmapData,
  userId: string,
  input: EnrichedInput
) {
  // Insert roadmap
  const [roadmapRow] = await db
    .insert(roadmaps)
    .values({
      userId,
      title: roadmapData.title,
      description: roadmapData.description,
      goal: roadmapData.goal,
      skillLevel: input.targetLevel,
      hoursPerWeek: parseInt(input.weeklyHours),
      estimatedTotalHours: roadmapData.estimatedTotalHours,
      isPublic: false,
      isTemplate: false,
      metadata: {
        quizAnswers: {
          topic: input.topic,
          currentLevel: input.currentLevel,
          weeklyHours: input.weeklyHours,
          learningStyles: input.learningStyles,
        },
        preferences: {
          preferredLanguage: "en",
        },
        generatedAt: new Date().toISOString(),
      },
    })
    .returning({ id: roadmaps.id });

  // Insert phases → topics → resources
  for (let pi = 0; pi < roadmapData.phases.length; pi++) {
    const phase = roadmapData.phases[pi];

    const [phaseRow] = await db
      .insert(phases)
      .values({
        roadmapId: roadmapRow.id,
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
          topic.resources.map((r: RoadmapResource) => ({
            topicId: topicRow.id,
            title: r.title,
            url: r.url,
            type: r.type,
            isFree: r.isFree ?? true,
            platform: r.platform ?? null,
            qualityScore: r.qualityScore ?? 7,
          }))
        );
      }
    }
  }

  return roadmapRow.id;
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate input
    const body = await req.json();
    const parsed = GenerationInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Derive targetLevel and learningStyle from new schema
    const levelOrder: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2 };
    const levels = ["beginner", "intermediate", "advanced"] as const;
    const currentIdx = levelOrder[parsed.data.currentLevel] ?? 0;
    const targetLevel = levels[Math.min(currentIdx + 1, 2)];

    const styleMap: Record<string, "visual" | "reading" | "hands-on" | "mixed"> = {
      video: "visual",
      articles: "reading",
      documentation: "reading",
      books: "reading",
      "hands-on": "hands-on",
      mixed: "mixed",
    };
    const styles = parsed.data.learningStyles;
    const learningStyle =
      styles.length > 1 || styles.includes("mixed")
        ? "mixed"
        : (styleMap[styles[0]] ?? "mixed");

    const goals = parsed.data.additionalContext
      ? [parsed.data.additionalContext]
      : ["master the fundamentals and build practical projects"];

    const enrichedInput = {
      ...parsed.data,
      targetLevel,
      learningStyle,
      goals,
    };

    // Check rate limit
    const rateLimitCheck = checkRateLimit(
      `generate:${session.user.id}`,
      RateLimits.ROADMAP_GENERATION
    );
    if (!rateLimitCheck.allowed) {
      return createRateLimitResponse(rateLimitCheck.retryAfter);
    }

    // Check if streaming is requested
    const isStreaming = req.nextUrl.searchParams.get("stream") === "true";

    if (isStreaming) {
      // Stream mode - return progressive updates
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stream = await streamRoadmap(enrichedInput as any);

        return new NextResponse(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      } catch (err: unknown) {
        console.error("[ROADMAP_STREAM]", err);
        const message = err instanceof Error ? err.message : "Stream generation failed";
        return NextResponse.json(
          { error: handleAiError(message) },
          { status: 500 }
        );
      }
    } else {
      // Standard mode - generate and save
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const roadmapData = await generateRoadmap(enrichedInput as any);
      const roadmapId = await saveRoadmapToDb(roadmapData, session.user.id, enrichedInput);

      return NextResponse.json({ roadmapId });
    }
  } catch (err: unknown) {
    console.error("[ROADMAP_GENERATE]", err);
    const message = err instanceof Error ? err.message : "Failed to generate roadmap";
    const errorMessage = handleAiError(message);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// ─── Error Handler ────────────────────────────────────────────────────────────

function handleAiError(message: string): string {
  console.error("[ROADMAP_ERROR]", message);
  
  if (message.includes("quota") || message.includes("RESOURCE_EXHAUSTED")) {
    return "AI quota exceeded. Please check your Google AI API key billing.";
  }
  if (message.includes("429") || message.includes("rate limit")) {
    return "AI rate limit hit. Please wait a minute and try again.";
  }
  if (message.includes("HTTPS")) {
    return "Generated roadmap contains invalid URLs. Please try again.";
  }
  if (message.includes("API key") || message.includes("unauthorized") || message.includes("Unauthorized")) {
    return "AI API key is invalid or expired. Please update server configuration.";
  }
  if (message.includes("No AI API configured")) {
    return "AI service is not configured. Please ensure GROQ_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is set in server environment variables.";
  }
  return "Failed to generate roadmap. Please try again later.";
}


