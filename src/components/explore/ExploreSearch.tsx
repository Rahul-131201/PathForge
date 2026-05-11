"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

const RECENT_KEY = "pathforge:explore:recent-searches";
const MAX_RECENT = 6;

interface ExploreSearchProps {
  initialQuery: string;
}

function readRecentSearches(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean)
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

function persistRecentSearch(query: string) {
  if (typeof window === "undefined") return;

  const value = query.trim();
  if (!value) return;

  const current = readRecentSearches();
  const next = [value, ...current.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(
    0,
    MAX_RECENT
  );

  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export default function ExploreSearch({ initialQuery }: ExploreSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    // Load recent searches on mount
    const recent = readRecentSearches();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecent(recent);
  }, []);

  const paramsString = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = query.trim();
      const params = new URLSearchParams(paramsString);

      if (next) params.set("q", next);
      else params.delete("q");

      params.delete("cursor");
      params.set("page", "1");

      const target = params.toString() ? `${pathname}?${params}` : pathname;
      router.replace(target, { scroll: false });

      if (next.length >= 2) {
        persistRecentSearch(next);
        setRecent(readRecentSearches());
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query, paramsString, pathname, router]);

  const applyRecentSearch = (value: string) => {
    setQuery(value);
    persistRecentSearch(value);
    setRecent(readRecentSearches());
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search roadmaps by goal, stack, or keywords..."
          className="h-12 w-full rounded-2xl border border-border/70 bg-card/70 pl-11 pr-11 text-sm text-foreground outline-none backdrop-blur-xl transition focus:border-cyan-400/45 focus:ring-2 focus:ring-cyan-500/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {recent.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {recent.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => applyRecentSearch(item)}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-muted-foreground transition hover:border-cyan-400/40 hover:text-cyan-200"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
