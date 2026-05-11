import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { ArrowRight, Plus } from "lucide-react";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { roadmaps } from "@/server/db/schema";

export const metadata: Metadata = { title: "My Roadmaps - PathForge" };
export const dynamic = "force-dynamic";

export default async function MyRoadmapsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;
  if (!userId) redirect("/login");

  const items = await db
    .select({
      id: roadmaps.id,
      title: roadmaps.title,
      goal: roadmaps.goal,
      skillLevel: roadmaps.skillLevel,
      estimatedTotalHours: roadmaps.estimatedTotalHours,
      updatedAt: roadmaps.updatedAt,
    })
    .from(roadmaps)
    .where(eq(roadmaps.userId, userId))
    .orderBy(desc(roadmaps.updatedAt));

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Roadmaps</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Continue your learning plans or start a new one.
            </p>
          </div>

          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Roadmap
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="glass rounded-2xl border border-dashed border-border p-10 text-center">
            <h2 className="text-lg font-semibold">No roadmaps yet</h2>
            <p className="text-sm text-muted-foreground mt-2 mb-5">
              Generate your first AI roadmap in under 2 minutes.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Roadmap
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="glass rounded-xl border border-border/50 p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground uppercase tracking-wide">
                      {item.skillLevel}
                    </span>
                    {item.estimatedTotalHours != null ? (
                      <span className="text-xs text-muted-foreground">{item.estimatedTotalHours}h</span>
                    ) : null}
                  </div>

                  <h2 className="font-semibold truncate">{item.title}</h2>
                  <p className="text-sm text-muted-foreground truncate">{item.goal}</p>
                </div>

                <Link
                  href={`/roadmap/${item.id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Open
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
