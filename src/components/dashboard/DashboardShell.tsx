"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/shared/sidebar";
import DashboardTopBar from "./DashboardTopBar";

interface UserInfo {
  name: string | null;
  email: string | null;
  image: string | null;
}

interface Props {
  children: React.ReactNode;
  user: UserInfo;
}

export default function DashboardShell({ children, user }: Props) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#050510" }}>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar wrapper — fixed on mobile, normal flow on desktop */}
      <div
        className={[
          "fixed inset-y-0 left-0 z-50 md:relative md:z-auto",
          "transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <Sidebar onMobileClose={() => setMobileSidebarOpen(false)} />
      </div>

      {/* Content column */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardTopBar
          user={user}
          onHamburgerClick={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
