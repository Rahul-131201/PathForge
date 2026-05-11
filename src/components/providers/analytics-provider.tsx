'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { initializeAnalytics, identifyUser, trackPageView } from '@/lib/analytics';
import { usePathname } from 'next/navigation';

export function AnalyticsProvider() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Initialize analytics on mount
  useEffect(() => {
    initializeAnalytics();
  }, []);

  // Track page views
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  // Identify user when session changes
  useEffect(() => {
    if (session?.user) {
      identifyUser(session.user.id || '', {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      });
    }
  }, [session]);

  return null;
}
