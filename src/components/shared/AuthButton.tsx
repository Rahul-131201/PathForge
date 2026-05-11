"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Settings, LayoutDashboard, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const [isClient, setIsClient] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div suppressHydrationWarning className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-3">
      {status === "loading" ? (
        <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
      ) : !session?.user ? (
        <Link href="/login">
          <Button variant="gradient" size="sm">
            Sign In
          </Button>
        </Link>
      ) : (
        <div className="relative">
          {/* Avatar button */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative w-10 h-10 rounded-full overflow-hidden bg-linear-to-br from-brand-primary to-brand-accent flex items-center justify-center hover:ring-2 hover:ring-brand-primary/50 transition-all duration-200"
          >
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                priority
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {(session.user.name?.[0] || session.user.email?.[0] || "U").toUpperCase()}
              </span>
            )}
          </button>

          {/* Dropdown menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />

                {/* Menu */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8, backdropFilter: "blur(0px)" }}
                  animate={{ opacity: 1, scale: 1, y: 0, backdropFilter: "blur(10px)" }}
                  exit={{ opacity: 0, scale: 0.95, y: -8, backdropFilter: "blur(0px)" }}
                  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg overflow-hidden z-50"
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-medium truncate">{session.user.name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors group"
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-foreground group-hover:text-white transition-colors">
                        Dashboard
                      </span>
                    </Link>

                    <Link
                      href="/dashboard/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors group"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-foreground group-hover:text-white transition-colors">
                        Settings
                      </span>
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors group"
                    >
                      <User className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-foreground group-hover:text-white transition-colors">
                        Profile
                      </span>
                    </Link>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut({ redirectTo: "/" });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors group border-t border-white/5 mt-2 pt-3"
                    >
                      <LogOut className="w-4 h-4 group-hover:text-red-300 transition-colors" />
                      <span className="group-hover:text-red-300 transition-colors">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
