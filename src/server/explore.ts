import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { db } from "@/server/db";
import { phases, roadmaps, topics, users } from "@/server/db/schema";
import type { ExploreCategory, ExploreRoadmapItem, ExploreSort } from "@/lib/explore";

const CATEGORY_KEYWORDS: Record<Exclude<ExploreCategory, "all">, string[]> = {
  programming: [
    "javascript",
    "typescript",
    "python",
    "java",
    "golang",
    "c++",
    "c#",
    "software",
    "web development",
    "backend",
    "frontend",
  ],
  "data-science": [
    "data science",
    "analytics",
    "data analysis",
    "statistics",
    "pandas",
    "numpy",
    "visualization",
  ],
  design: ["design", "ui", "ux", "figma", "product design", "graphic"],
  devops: ["devops", "kubernetes", "docker", "aws", "gcp", "azure", "terraform", "ci/cd"],
  "ai-ml": [
    "ai",
    "ml",
    "machine learning",
    "deep learning",
    "llm",
    "neural",
    "nlp",
    "computer vision",
  ],
  "mobile-dev": ["android", "ios", "react native", "flutter", "swift", "kotlin", "mobile"],
  "career-skills": [
    "interview",
    "communication",
    "leadership",
    "career",
    "resume",
    "portfolio",
    "productivity",
  ],
};

type ExploreCursor = {
  score: number;
  createdAtIso: string;
  id: string;
};

export type ExploreQueryInput = {
  q: string;
  category: ExploreCategory;
  sort: ExploreSort;
  cursor?: string;
  limit?: number;
};

export type ExploreQueryResult = {
  items: ExploreRoadmapItem[];
  nextCursor: string | null;
};

function encodeCursor(cursor: ExploreCursor): string {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

function decodeCursor(raw: string | undefined): ExploreCursor | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as ExploreCursor;
    if (!parsed?.id || !parsed?.createdAtIso) return null;
    if (!Number.isFinite(parsed.score)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function inferCategory(text: string): ExploreCategory {
  const normalized = text.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return category as ExploreCategory;
    }
  }

  return "career-skills";
}

function buildCategoryCondition(category: ExploreCategory): SQL | undefined {
  if (category === "all") return undefined;

  const keywords = CATEGORY_KEYWORDS[category as Exclude<ExploreCategory, "all">] ?? [];
  if (keywords.length === 0) return undefined;

  const keywordConditions = keywords.flatMap((keyword) => [
    ilike(roadmaps.title, `%${keyword}%`),
    ilike(roadmaps.goal, `%${keyword}%`),
    ilike(roadmaps.description, `%${keyword}%`),
  ]);

  return or(...keywordConditions);
}

function buildSearchCondition(q: string): SQL | undefined {
  if (!q.trim()) return undefined;
  return or(
    ilike(roadmaps.title, `%${q}%`),
    ilike(roadmaps.goal, `%${q}%`),
    ilike(roadmaps.description, `%${q}%`)
  );
}

export async function getPublicRoadmapsExplore({
  q,
  category,
  sort,
  cursor,
  limit = 9,
}: ExploreQueryInput): Promise<ExploreQueryResult> {
  const safeLimit = Math.min(Math.max(limit, 3), 24);
  const decodedCursor = decodeCursor(cursor);

  console.log(`[EXPLORE_QUERY] cursor=${cursor}, decoded=${JSON.stringify(decodedCursor)}, sort=${sort}`);

  const topicsCountExpr = sql<number>`(
    SELECT COUNT(*)::int
    FROM ${topics} t
    INNER JOIN ${phases} p ON p.id = t.phase_id
    WHERE p.roadmap_id = ${roadmaps.id}
  )`;

  const cloneCountExpr = sql<number>`GREATEST((
    SELECT COUNT(*)::int
    FROM ${roadmaps} r2
    WHERE r2.is_public = true
      AND LOWER(r2.goal) = LOWER(${roadmaps.goal})
  ) - 1, 0)`;

  const completionScoreExpr = sql<number>`(
    ${topicsCountExpr} * 2 + COALESCE(${roadmaps.estimatedTotalHours}, 0) / 8.0
  )`;

  const sortScoreExpr =
    sort === "popular"
      ? cloneCountExpr
      : sort === "complete"
        ? completionScoreExpr
        : sql<number>`EXTRACT(EPOCH FROM ${roadmaps.createdAt})`;

  const whereParts: SQL[] = [eq(roadmaps.isPublic, true)];

  const searchCondition = buildSearchCondition(q);
  if (searchCondition) whereParts.push(searchCondition);

  const categoryCondition = buildCategoryCondition(category);
  if (categoryCondition) whereParts.push(categoryCondition);

  if (decodedCursor) {
    const cursorDate = new Date(decodedCursor.createdAtIso);

    console.log(`[EXPLORE_QUERY] Cursor condition - score: ${decodedCursor.score}, date: ${decodedCursor.createdAtIso}, id: ${decodedCursor.id}`);
    console.log(`[EXPLORE_QUERY] Will apply cursor filtering in JavaScript`);
    
    // Note: Cursor filtering is applied in JavaScript after fetching
    // because Drizzle's raw SQL WHERE doesn't work reliably
  }

  const rows = await db
    .select({
      id: roadmaps.id,
      title: roadmaps.title,
      description: roadmaps.description,
      goal: roadmaps.goal,
      creatorName: users.name,
      creatorImage: users.image,
      skillLevel: roadmaps.skillLevel,
      estimatedTotalHours: roadmaps.estimatedTotalHours,
      createdAt: roadmaps.createdAt,
      topicsCount: topicsCountExpr,
      timesCloned: cloneCountExpr,
      sortScore: sortScoreExpr,
    })
    .from(roadmaps)
    .leftJoin(users, eq(users.id, roadmaps.userId))
    .where(and(...whereParts.filter(p => p !== undefined)))
    .orderBy(
      sort === "newest" ? desc(roadmaps.createdAt) : desc(sortScoreExpr),
      desc(roadmaps.createdAt),
      desc(roadmaps.id)
    )
    .limit(1000); // Fetch all matching rows to apply cursor filtering in JavaScript

  console.log(`[EXPLORE_QUERY] fetched ${rows.length} rows before cursor filtering (limit=1000)`);
  
  // Apply cursor filtering in JavaScript since Drizzle raw SQL WHERE isn't working
  let filteredRows = rows;
  if (decodedCursor) {
    const cursorDate = new Date(decodedCursor.createdAtIso);
    
    filteredRows = rows.filter((row) => {
      const rowScore = row.sortScore ?? 0;
      const rowDate = row.createdAt;
      
      // Apply the cursor condition based on sort type
      if (sort === "newest") {
        return (
          rowDate < cursorDate ||
          (rowDate.getTime() === cursorDate.getTime() && row.id < decodedCursor.id)
        );
      } else {
        // For other sorts: compare by score first, then createdAt, then id
        return (
          rowScore < decodedCursor.score ||
          (rowScore === decodedCursor.score && rowDate < cursorDate) ||
          (rowScore === decodedCursor.score && rowDate.getTime() === cursorDate.getTime() && row.id < decodedCursor.id)
        );
      }
    });
    
    console.log(`[EXPLORE_QUERY] filtered to ${filteredRows.length} rows after cursor filtering`);
  }

  const allRows = filteredRows;
  console.log(`[EXPLORE_QUERY] row IDs: ${allRows.slice(0, safeLimit + 1).map((r) => r.id).join(", ")}`);
  console.log(`[EXPLORE_QUERY] row scores/dates: ${allRows.slice(0, safeLimit + 1).map((r) => `${r.id}(score=${r.sortScore},date=${r.createdAt.toISOString()})`).join(" | ")}`);

  const hasMore = allRows.length > safeLimit;
  const pageRows = hasMore ? allRows.slice(0, safeLimit) : allRows;

  const items: ExploreRoadmapItem[] = pageRows.map((row) => {
    const categorySource = `${row.title} ${row.goal} ${row.description ?? ""}`;

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      goal: row.goal,
      creatorName: row.creatorName,
      creatorImage: row.creatorImage,
      topicsCount: row.topicsCount ?? 0,
      estimatedTotalHours: row.estimatedTotalHours,
      timesCloned: Math.max(0, row.timesCloned ?? 0),
      skillLevel: row.skillLevel,
      category: inferCategory(categorySource),
      createdAtIso: row.createdAt.toISOString(),
    };
  });

  const nextCursor = hasMore
    ? encodeCursor({
        score:
          sort === "newest"
            ? new Date(pageRows[pageRows.length - 1].createdAt).getTime()
            : Number(pageRows[pageRows.length - 1].sortScore ?? 0),
        createdAtIso: pageRows[pageRows.length - 1].createdAt.toISOString(),
        id: pageRows[pageRows.length - 1].id,
      })
    : null;

  return { items, nextCursor };
}
