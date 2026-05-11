import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { roadmaps, phases, topics, userProgress } from "@/server/db/schema";
import { eq, and, inArray, desc, sql } from "drizzle-orm";

function calcStreak(dates: (Date | null)[]): number {
  const unique = new Set(
    dates
      .filter(Boolean)
      .map((d) => {
        const dd = d as Date;
        return `${dd.getFullYear()}-${dd.getMonth()}-${dd.getDate()}`;
      })
  );
  if (unique.size === 0) return 0;

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (unique.has(key)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch all roadmaps with relations
    const userRoadmaps = await db.query.roadmaps.findMany({
      where: eq(roadmaps.userId, userId),
      with: {
        phases: {
          orderBy: phases.orderIndex,
          with: {
            topics: {
              orderBy: topics.orderIndex,
            },
          },
        },
      },
    });

    if (userRoadmaps.length === 0) {
      return Response.json({
        completedRoadmaps: 0,
        totalCompleted: 0,
        streak: 0,
        totalHours: 0,
      });
    }

    // Get all topic IDs
    const allTopicIds = userRoadmaps.flatMap((r) =>
      r.phases.flatMap((p) => p.topics.map((t) => t.id))
    );

    if (allTopicIds.length === 0) {
      return Response.json({
        completedRoadmaps: 0,
        totalCompleted: 0,
        streak: 0,
        totalHours: 0,
      });
    }

    // Get progress data
    const allProgress = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), inArray(userProgress.topicId, allTopicIds)));

    const completedTopicIds = new Set(
      allProgress.filter((p) => p.status === "completed").map((p) => p.topicId)
    );

    // Calculate stats
    const totalCompleted = completedTopicIds.size;
    const allTopics = userRoadmaps.flatMap((r) => r.phases.flatMap((p) => p.topics));
    const totalHours = allTopics
      .filter((t) => completedTopicIds.has(t.id))
      .reduce((s, t) => s + (t.estimatedHours ?? 0), 0);

    const streak = calcStreak(allProgress.filter((p) => p.status === "completed").map((p) => p.completedAt));

    // Count completed roadmaps
    const completedRoadmaps = userRoadmaps.filter((r) => {
      const rTopics = r.phases.flatMap((p) => p.topics);
      const completedCount = rTopics.filter((t) => completedTopicIds.has(t.id)).length;
      return completedCount === rTopics.length && rTopics.length > 0;
    }).length;

    return Response.json({
      completedRoadmaps,
      totalCompleted,
      streak,
      totalHours,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
