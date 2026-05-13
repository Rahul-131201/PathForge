"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Suppress NextAuth fetch errors in development
  useEffect(() => {
    const originalError = console.error;
    console.error = function (...args: any[]) {
      // Filter out NextAuth fetch errors
      if (
        args[0]?.toString?.().includes("ClientFetchError") ||
        args[0]?.toString?.().includes("Unexpected token")
      ) {
        return;
      }
      originalError.apply(console, args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
