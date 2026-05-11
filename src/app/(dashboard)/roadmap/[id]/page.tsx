import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { roadmaps, phases, topics, resources, userProgress } from "@/server/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { Suspense } from "react";
import RoadmapViewerClient from "@/components/roadmap/roadmap-viewer-client";
import { ArrowLeft, Share2, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoadmapSkeleton } from "@/components/shared";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const [roadmap] = await db
      .select({ title: roadmaps.title })
      .from(roadmaps)
      .where(eq(roadmaps.id, id))
      .limit(1);
    return { title: roadmap?.title ?? "Roadmap" };
  } catch {
    return { title: "Roadmap" };
  }
}

export const dynamic = "force-dynamic";

export default async function RoadmapPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fetch roadmap
  const [roadmap] = await db
    .select()
    .from(roadmaps)
    .where(eq(roadmaps.id, id))
    .limit(1);

  if (!roadmap) notFound();
  if (roadmap.userId !== session.user.id && !roadmap.isPublic) notFound();

  // Fetch phases
  const phaseRows = await db
    .select()
    .from(phases)
    .where(eq(phases.roadmapId, id))
    .orderBy(phases.orderIndex);

  const phaseIds = phaseRows.map((p) => p.id);

  // Fetch topics
  const topicRows =
    phaseIds.length > 0
      ? await db
          .select()
          .from(topics)
          .where(inArray(topics.phaseId, phaseIds))
          .orderBy(topics.orderIndex)
      : [];

  const topicIds = topicRows.map((t) => t.id);

  // Fetch resources
  const resourceRows =
    topicIds.length > 0
      ? await db
          .select()
          .from(resources)
          .where(inArray(resources.topicId, topicIds))
      : [];

  // Fetch user progress
  const progressRows =
    topicIds.length > 0
      ? await db
          .select()
          .from(userProgress)
          .where(
            and(
              eq(userProgress.userId, session.user.id!),
              inArray(userProgress.topicId, topicIds)
            )
          )
      : [];

  // Assemble nested structure
  const progressMap = new Map(progressRows.map((p) => [p.topicId, p.status]));

  const resourcesByTopic = resourceRows.reduce<
    Record<string, typeof resourceRows>
  >((acc, r) => {
    if (!acc[r.topicId]) acc[r.topicId] = [];
    acc[r.topicId].push(r);
    return acc;
  }, {});

  const topicsByPhase = topicRows.reduce<
    Record<
      string,
      Array<(typeof topicRows)[0] & { resources: typeof resourceRows; progressStatus: string }>
    >
  >((acc, t) => {
    if (!acc[t.phaseId]) acc[t.phaseId] = [];
    acc[t.phaseId].push({
      ...t,
      resources: resourcesByTopic[t.id] ?? [],
      progressStatus: progressMap.get(t.id) ?? "not_started",
    });
    return acc;
  }, {});

  const roadmapWithPhases = {
    ...roadmap,
    phases: phaseRows.map((p) => ({
      ...p,
      topics: topicsByPhase[p.id] ?? [],
    })),
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 shrink-0">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="glass" size="icon-sm" aria-label="Share roadmap">
            <Share2 className="w-4 h-4" aria-hidden="true" />
          </Button>
          {roadmap.userId === session.user.id && (
            <Button variant="glass" size="icon-sm" aria-label="Roadmap settings">
              <Settings className="w-4 h-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      {/* Viewer — fills remaining space, overflow handled internally */}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<RoadmapSkeleton />}>
          <RoadmapViewerClient roadmap={roadmapWithPhases} />
        </Suspense>
      </div>
    </div>
  );
}
