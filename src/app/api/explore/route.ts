import { NextRequest, NextResponse } from "next/server";
import { normalizeSearchParams } from "@/lib/explore";
import { getPublicRoadmapsExplore } from "@/server/explore";
import { checkRateLimit, RateLimits, createRateLimitResponse } from "@/server/rate-limiter";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown").split(",")[0];
    const rateLimitCheck = checkRateLimit(`explore:${ip}`, RateLimits.EXPLORE_SEARCH);
    if (!rateLimitCheck.allowed) {
      return createRateLimitResponse(rateLimitCheck.retryAfter);
    }

    const params = normalizeSearchParams({
      q: req.nextUrl.searchParams.get("q") ?? undefined,
      category: req.nextUrl.searchParams.get("category") ?? undefined,
      sort: req.nextUrl.searchParams.get("sort") ?? undefined,
      page: req.nextUrl.searchParams.get("page") ?? undefined,
      cursor: req.nextUrl.searchParams.get("cursor") ?? undefined,
    });

    console.log("[EXPLORE_API] Received params:", { q: params.q, category: params.category, sort: params.sort, cursor: params.cursor ? `${params.cursor.substring(0, 20)}...` : undefined });

    const result = await getPublicRoadmapsExplore({
      q: params.q,
      category: params.category,
      sort: params.sort,
      cursor: params.cursor,
      limit: 9,
    });

    // Validate response structure
    if (!result || typeof result !== "object" || !Array.isArray(result.items)) {
      console.error("[EXPLORE_API] Invalid result structure:", result);
      return NextResponse.json(
        { error: "Invalid response from database.", items: [], nextCursor: null },
        { status: 200 }
      );
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    console.error("[EXPLORE_API] Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Unable to fetch explore roadmaps: ${message}`, items: [], nextCursor: null },
      { status: 200 }
    );
  }
}
