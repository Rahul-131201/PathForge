import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { userProgress, topics } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { checkRateLimit, RateLimits, createRateLimitResponse } from "@/server/rate-limiter";

const BodySchema = z.object({
  topicId: z.string().min(1),
  status: z.enum(["not_started", "in_progress", "completed", "skipped"]),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimitCheck = checkRateLimit(
      `progress:${session.user.id}`,
      RateLimits.PROGRESS_UPDATE
    );
    if (!rateLimitCheck.allowed) {
      return createRateLimitResponse(rateLimitCheck.retryAfter);
    }

    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { topicId, status, notes } = parsed.data;
    const userId = session.user.id;

    // Verify topic exists
    const [topic] = await db
      .select({ id: topics.id })
      .from(topics)
      .where(eq(topics.id, topicId))
      .limit(1);

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const now = new Date();

    const [existing] = await db
      .select({ id: userProgress.id })
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.topicId, topicId)))
      .limit(1);

    if (existing) {
      await db
        .update(userProgress)
        .set({
          status,
          notes: notes ?? null,
          startedAt: status !== "not_started" ? now : null,
          completedAt: status === "completed" ? now : null,
          updatedAt: now,
        })
        .where(eq(userProgress.id, existing.id));
    } else {
      await db.insert(userProgress).values({
        userId,
        topicId,
        status,
        notes: notes ?? null,
        startedAt: status !== "not_started" ? now : null,
        completedAt: status === "completed" ? now : null,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PROGRESS_UPDATE]", err);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
