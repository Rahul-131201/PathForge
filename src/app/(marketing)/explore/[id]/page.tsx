import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock3 } from "lucide-react";
import { and, eq, inArray } from "drizzle-orm";
import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { db } from "@/server/db";
import { phases, resources, roadmaps, topics, users } from "@/server/db/schema";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchPublicRoadmap(id: string) {
  const [roadmap] = await db
    .select({
      id: roadmaps.id,
      title: roadmaps.title,
      description: roadmaps.description,
      goal: roadmaps.goal,
      skillLevel: roadmaps.skillLevel,
      estimatedTotalHours: roadmaps.estimatedTotalHours,
      createdAt: roadmaps.createdAt,
      creatorName: users.name,
      creatorImage: users.image,
    })
    .from(roadmaps)
    .leftJoin(users, eq(users.id, roadmaps.userId))
    .where(and(eq(roadmaps.id, id), eq(roadmaps.isPublic, true)))
    .limit(1);

  if (!roadmap) return null;

  const phaseRows = await db
    .select()
    .from(phases)
    .where(eq(phases.roadmapId, roadmap.id))
    .orderBy(phases.orderIndex);

  const phaseIds = phaseRows.map((phase) => phase.id);
  const topicRows =
    phaseIds.length > 0
      ? await db
          .select()
          .from(topics)
          .where(inArray(topics.phaseId, phaseIds))
          .orderBy(topics.orderIndex)
      : [];

  const topicIds = topicRows.map((topic) => topic.id);
  const resourceRows =
    topicIds.length > 0
      ? await db.select().from(resources).where(inArray(resources.topicId, topicIds))
      : [];

  return {
    roadmap,
    phaseRows,
    topicRows,
    resourceRows,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await fetchPublicRoadmap(id);

  if (!data) {
    return {
      title: "Public Roadmap",
      description: "Read-only community roadmap on PathForge.",
    };
  }

  const topicsCount = data.topicRows.length;
  const hours = data.roadmap.estimatedTotalHours ?? 0;

  const og = new URLSearchParams({
    title: data.roadmap.title,
    topics: String(topicsCount),
    hours: String(hours),
  });

  return {
    title: `${data.roadmap.title} | PathForge`,
    description: data.roadmap.description ?? `Public roadmap for ${data.roadmap.goal}`,
    openGraph: {
      title: data.roadmap.title,
      description: data.roadmap.description ?? `Public roadmap for ${data.roadmap.goal}`,
      type: "article",
      images: [`/api/og?${og.toString()}`],
    },
    twitter: {
      card: "summary_large_image",
      title: data.roadmap.title,
      description: data.roadmap.description ?? `Public roadmap for ${data.roadmap.goal}`,
      images: [`/api/og?${og.toString()}`],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function PublicRoadmapPage({ params }: PageProps) {
  const { id } = await params;
  const data = await fetchPublicRoadmap(id);

  if (!data) {
    notFound();
  }

  const resourcesByTopic = data.resourceRows.reduce<Record<string, typeof data.resourceRows>>(
    (acc, resource) => {
      if (!acc[resource.topicId]) acc[resource.topicId] = [];
      acc[resource.topicId].push(resource);
      return acc;
    },
    {}
  );

  const topicsByPhase = data.topicRows.reduce<Record<string, typeof data.topicRows>>((acc, topic) => {
    if (!acc[topic.phaseId]) acc[topic.phaseId] = [];
    acc[topic.phaseId].push(topic);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#050510]">
      <LandingNavbar />

      <div className="mx-auto max-w-4xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <Link
          href="/explore"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-muted-foreground transition hover:border-cyan-400/35 hover:text-cyan-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore
        </Link>

        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-cyan-400/30 text-cyan-200">
              {data.roadmap.skillLevel}
            </Badge>
            <Badge variant="outline" className="border-white/20 text-muted-foreground">
              <BookOpen className="mr-1 h-3 w-3" />
              {data.topicRows.length} topics
            </Badge>
            {data.roadmap.estimatedTotalHours != null && (
              <Badge variant="outline" className="border-white/20 text-muted-foreground">
                <Clock3 className="mr-1 h-3 w-3" />
                {data.roadmap.estimatedTotalHours}h
              </Badge>
            )}
          </div>

          <h1 className="mb-3 text-3xl font-bold leading-tight sm:text-4xl">{data.roadmap.title}</h1>
          <p className="text-sm text-muted-foreground">{data.roadmap.description ?? data.roadmap.goal}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Shared by {data.roadmap.creatorName ?? "PathForge Community"}
          </p>
        </section>

        <div className="space-y-4">
          {data.phaseRows.map((phase, phaseIndex) => {
            const phaseTopics = topicsByPhase[phase.id] ?? [];

            return (
              <section
                key={phase.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-lg"
              >
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-500/15 text-xs font-semibold text-cyan-200">
                    {phaseIndex + 1}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{phase.title}</h2>
                    {phase.description && (
                      <p className="text-sm text-muted-foreground">{phase.description}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {phaseTopics.map((topic) => {
                    const topicResources = resourcesByTopic[topic.id] ?? [];
                    return (
                      <article key={topic.id} className="rounded-xl border border-white/10 bg-black/25 p-3">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="font-medium">{topic.title}</h3>
                          <Badge variant="outline" className="text-[10px]">
                            {topic.difficulty}
                          </Badge>
                          {topic.estimatedHours != null && (
                            <Badge variant="outline" className="text-[10px]">
                              {topic.estimatedHours}h
                            </Badge>
                          )}
                        </div>
                        {topic.description && (
                          <p className="text-sm text-muted-foreground">{topic.description}</p>
                        )}

                        {topicResources.length > 0 && (
                          <ul className="mt-3 space-y-1.5 text-sm text-cyan-200">
                            {topicResources.map((resource) => (
                              <li key={resource.id}>
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 hover:text-cyan-100"
                                >
                                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                                  {resource.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
