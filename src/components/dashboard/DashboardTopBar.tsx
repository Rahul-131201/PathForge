"use client";

import { useEffect, useState } from "react";
import { Search, Menu } from "lucide-react";
import AuthButton from "@/components/shared/AuthButton";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface Props {
  user: { name: string | null; email: string | null; image: string | null };
  onHamburgerClick: () => void;
}

export default function DashboardTopBar({ user, onHamburgerClick }: Props) {
  const [query, setQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="shrink-0 flex items-center gap-3 px-4 py-2.5 border-b border-border/40 glass">
      {/* Hamburger — mobile only */}
      <button
        onClick={onHamburgerClick}
        className="md:hidden p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search roadmaps…"
          className="w-full pl-9 pr-4 py-1.5 text-sm rounded-xl bg-white/[0.04] border border-white/[0.06] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-primary/[0.03] transition-all"
        />
      </div>

      <div className="ml-auto">
        <div className="flex items-center gap-3">
          {isMounted ? <ThemeToggle /> : null}
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
