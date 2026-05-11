"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, Loader2 } from "lucide-react";
import type { ExploreCategory, ExploreRoadmapItem, ExploreSort } from "@/lib/explore";
import ExploreCard from "./ExploreCard";

interface ExploreGridProps {
  initialItems: ExploreRoadmapItem[];
  initialNextCursor: string | null;
  q: string;
  category: ExploreCategory;
  sort: ExploreSort;
}

export default function ExploreGrid({
  initialItems,
  initialNextCursor,
  q,
  category,
  sort,
}: ExploreGridProps) {
  // Deduplicate initialItems by id
  const dedupedInitialItems = useMemo(() => {
    const seen = new Set<string>();
    return initialItems.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [initialItems]);
  const [items, setItems] = useState(dedupedInitialItems);
  const [cursor, setCursor] = useState<string | null>(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when search parameters change
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const seen = new Set<string>();
    const deduped = initialItems.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
    setItems(deduped);
    setCursor(initialNextCursor);
    setError(null);
  }, [initialItems, initialNextCursor, q, category, sort]);

  const animationKey = useMemo(() => `${q}-${category}-${sort}`, [q, category, sort]);

  // Deduplicate items by ID to prevent React key warnings
  const uniqueItems = useMemo(() => {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [items]);

  const loadMore = async () => {
    if (!cursor || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q,
        category,
        sort,
        cursor,
      });

      console.log("[EXPLORE_GRID] Loading more with cursor:", cursor);

      const res = await fetch(`/api/explore?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Could not load more roadmaps.`);
      }

      const payload = (await res.json()) as {
        items?: ExploreRoadmapItem[];
        nextCursor?: string | null;
        error?: string;
      };

      console.log("[EXPLORE_GRID] Received response with", payload.items?.length ?? 0, "items");

      // Check for API-level errors
      if (payload.error) {
        console.error("[EXPLORE_GRID] API error:", payload.error);
        throw new Error(payload.error);
      }

      // Validate response structure
      if (!payload.items || !Array.isArray(payload.items)) {
        console.error("[EXPLORE_GRID] Invalid response structure:", payload);
        throw new Error("Invalid response from server.");
      }

      const newItems = payload.items;
      console.log("[EXPLORE_GRID] Current items count:", items.length);
      console.log("[EXPLORE_GRID] New items IDs:", newItems.map((i) => i.id));

      // Add only items that aren't already in the list (deduplicate)
      const existingIds = new Set(items.map((item) => item.id));
      const filteredNewItems = newItems.filter(
        (item: ExploreRoadmapItem) => !existingIds.has(item.id)
      );

      console.log("[EXPLORE_GRID] Filtered to", filteredNewItems.length, "unique items");

      if (filteredNewItems.length === 0) {
        // All returned items were duplicates - no more unique items to show
        console.warn("[EXPLORE_GRID] All returned items were duplicates, no more items to load");
        setError("No more roadmaps to load");
        setCursor(null);
      } else {
        // Add the new unique items
        setItems((prev) => [...prev, ...filteredNewItems]);
        setCursor(payload.nextCursor ?? null);
        console.log("[EXPLORE_GRID] Updated cursor:", payload.nextCursor ?? null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not load more roadmaps.";
      console.error("[EXPLORE_GRID] Load more failed:", message, err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-border/70 bg-card/70 px-6 py-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-card">
          <Compass className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">No public roadmaps found</h3>
        <p className="text-sm text-muted-foreground">
          Try a broader search term or switch category and sort filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        key={animationKey}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.06,
              delayChildren: 0.05,
            },
          },
        }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence initial={false}>
          {uniqueItems.map((roadmap) => (
            <motion.div
              key={roadmap.id}
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
              }}
              layout
            >
              <ExploreCard roadmap={roadmap} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        {cursor && (
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-foreground transition hover:border-cyan-400/40 hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Loading..." : "Load More"}
          </button>
        )}

        {error && <p className="text-xs text-rose-300">{error}</p>}
      </div>
    </div>
  );
}
