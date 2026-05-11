import type { MetadataRoute } from "next";
import { db } from "@/server/db";
import { roadmaps } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://pathforge.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Dynamic public roadmap pages
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const publicRoadmaps = await db
      .select({ id: roadmaps.id, updatedAt: roadmaps.updatedAt })
      .from(roadmaps)
      .where(eq(roadmaps.isPublic, true));

    dynamicRoutes = publicRoadmaps.map((r) => ({
      url: `${BASE_URL}/explore/${r.id}`,
      lastModified: r.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB unavailable at build time — return static routes only
  }

  return [...staticRoutes, ...dynamicRoutes];
}
