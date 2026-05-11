"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";
import { Flame, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/shared/AuthButton";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#demo", label: "Demo" },
  { href: "#testimonials", label: "Testimonials" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isExplorePage, setIsExplorePage] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { scrollY } = useScroll();

  const isLoggedIn = !!session?.user;
  const hasClientSession = hasHydrated && isMounted && isLoggedIn;
  const backHref = hasClientSession ? "/dashboard" : "/";
  const logoHref = hasClientSession ? "/dashboard" : "/";

  useEffect(() => {
    setIsMounted(true);
    setHasHydrated(true);
    setIsExplorePage(pathname.startsWith("/explore"));
  }, [pathname]);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 20);
  });

  return (
    <>
      <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-background/80 border-b border-border/60 shadow-xl shadow-black/20"
          : "bg-transparent"
      )}
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16" suppressHydrationWarning>
          {/* Logo */}
          <Link href={logoHref} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg group-hover:shadow-brand-primary/40 transition-shadow">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text-primary">
              PathForge
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {hasHydrated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={isExplorePage ? "inline-flex" : "hidden"}
                >
                  <Link href={backHref}>{"<- Back"}</Link>
                </Button>

                <nav className={cn("items-center gap-1", isExplorePage ? "hidden" : "flex")}>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </>
            ) : null}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isMounted ? <ThemeToggle /> : null}
            {hasClientSession && !isExplorePage ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <AuthButton />
              </>
            ) : !hasClientSession ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button variant="gradient" size="sm" asChild>
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </>
            ) : null}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

    </motion.header>

      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="fixed inset-y-0 right-0 z-[60] w-72 border-l border-border/60 bg-background/95 p-6 backdrop-blur-2xl md:hidden"
      >
        <div className="mb-8 flex items-center justify-between">
          <span className="font-semibold gradient-text-primary">Menu</span>
          <button onClick={() => setMobileOpen(false)} className="rounded-md p-1.5 hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>

        {!isExplorePage ? (
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex gap-2">
          {isMounted ? <ThemeToggle /> : null}
          {isExplorePage ? (
            <Button variant="ghost" size="sm" className="flex-1" asChild>
              <Link href={backHref} onClick={() => setMobileOpen(false)}>
                {"<- Back"}
              </Link>
            </Button>
          ) : null}
          {hasClientSession && !isExplorePage ? (
            <Button variant="ghost" size="sm" className="flex-1" asChild>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
            </Button>
          ) : !hasClientSession ? (
            <>
              <Button variant="ghost" size="sm" className="flex-1" asChild>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button variant="gradient" size="sm" className="flex-1" asChild>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </>
          ) : null}
        </div>
      </motion.aside>

      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[55] bg-black/50 md:hidden"
        />
      )}
    </>
  );
}
