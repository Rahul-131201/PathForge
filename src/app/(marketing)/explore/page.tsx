import { Suspense } from "react";
import { Compass } from "lucide-react";
import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import {
  normalizeSearchParams,
  type ExploreSearchParamsInput,
  type ExploreSort,
} from "@/lib/explore";
import { getPublicRoadmapsExplore } from "@/server/explore";
import { ExploreFilters, ExploreGrid, ExploreSearch } from "@/components/explore";
import ClientOnly from "../../../components/shared/client-only";
import type { Metadata } from "next";
import Script from "next/script";

interface ExplorePageProps {
  searchParams: Promise<ExploreSearchParamsInput>;
}

const SORT_LABELS: Record<ExploreSort, string> = {
  popular: "Popular",
  newest: "Newest",
  complete: "Most Complete",
};

export async function generateMetadata({ searchParams }: ExplorePageProps): Promise<Metadata> {
  const params = normalizeSearchParams(await searchParams);

  const titlePrefix = params.q ? `Search \"${params.q}\"` : "Explore Community Roadmaps";
  const title = `${titlePrefix} | PathForge`;

  const description = `Browse public PathForge roadmaps by category, ${SORT_LABELS[params.sort]} sorting, and search query.`;

  const og = new URLSearchParams({
    title: params.q ? `Results for ${params.q}` : "Explore Community Roadmaps",
    topics: "120+",
    hours: "Custom",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`/api/og?${og.toString()}`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og?${og.toString()}`],
    },
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 60;

async function ExploreResults({ params }: { params: ReturnType<typeof normalizeSearchParams> }) {
  const { items, nextCursor } = await getPublicRoadmapsExplore({
    q: params.q,
    category: params.category,
    sort: params.sort,
    cursor: params.cursor,
    limit: 9,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PathForge Public Roadmaps",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/explore/${item.id}`,
      name: item.title,
    })),
  };

  return (
    <>
      <Script
        id="explore-itemlist-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ExploreGrid
        initialItems={items}
        initialNextCursor={nextCursor}
        q={params.q}
        category={params.category}
        sort={params.sort}
      />
    </>
  );
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = normalizeSearchParams(await searchParams);

  return (
    <main className="min-h-screen bg-background">
      <ClientOnly>
        <LandingNavbar />
      </ClientOnly>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 px-3 py-1 text-xs font-medium text-primary glass">
            <Compass className="w-3 h-3" />
            Community Roadmaps
          </div>
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
            Explore <span className="gradient-text">Learning Paths</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Browse public roadmaps from the PathForge community. Search by keyword,
            filter by category, and sort by what is trending now.
          </p>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="max-w-2xl">
            <ExploreSearch initialQuery={params.q} />
          </div>
          <ExploreFilters initialCategory={params.category} initialSort={params.sort} />
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`explore-skeleton-${idx}`}
                  className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          }
        >
          <ExploreResults params={params} />
        </Suspense>
      </div>

      <Footer />
    </main>
  );
}
