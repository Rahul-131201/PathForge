'use client';

import posthog from 'posthog-js';

// ─── PostHog Initialization ────────────────────────────────────────────────────

export function initializeAnalytics() {
  if (typeof window === 'undefined') return;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

  if (!apiKey) {
    console.warn('PostHog API key not configured. Analytics disabled.');
    return;
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    loaded: (ph) => {
      // PostHog loaded
      console.log('✓ Analytics initialized');
    },
  });
}

// ─── Event Tracking ───────────────────────────────────────────────────────────

export const AnalyticsEvents = {
  // Auth events
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  LOGIN_STARTED: 'login_started',
  LOGIN_COMPLETED: 'login_completed',
  LOGOUT: 'logout',

  // Onboarding events
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',

  // Roadmap events
  ROADMAP_GENERATION_STARTED: 'roadmap_generation_started',
  ROADMAP_GENERATION_COMPLETED: 'roadmap_generation_completed',
  ROADMAP_GENERATION_FAILED: 'roadmap_generation_failed',
  ROADMAP_VIEWED: 'roadmap_viewed',
  ROADMAP_SHARED: 'roadmap_shared',

  // Progress tracking
  TOPIC_STARTED: 'topic_started',
  TOPIC_COMPLETED: 'topic_completed',
  RESOURCE_OPENED: 'resource_opened',

  // Engagement
  EXPLORE_SEARCHED: 'explore_searched',
  DASHBOARD_VISITED: 'dashboard_visited',
  SETTINGS_UPDATED: 'settings_updated',

  // Errors
  ERROR_OCCURRED: 'error_occurred',
};

interface EventProperties {
  [key: string]: any;
}

/**
 * Track an analytics event
 */
export function trackEvent(event: string, properties?: EventProperties) {
  if (typeof window === 'undefined') return;

  try {
    posthog.capture(event, properties);
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

/**
 * Set user properties
 */
export function setUserProperties(properties: EventProperties) {
  if (typeof window === 'undefined') return;

  try {
    posthog.people.set(properties);
  } catch (error) {
    console.error('Analytics set user error:', error);
  }
}

/**
 * Identify user
 */
export function identifyUser(userId: string, properties?: EventProperties) {
  if (typeof window === 'undefined') return;

  try {
    posthog.identify(userId, properties);
  } catch (error) {
    console.error('Analytics identify error:', error);
  }
}

/**
 * Reset analytics (logout)
 */
export function resetAnalytics() {
  if (typeof window === 'undefined') return;

  try {
    posthog.reset();
  } catch (error) {
    console.error('Analytics reset error:', error);
  }
}

// ─── Convenience Helpers ──────────────────────────────────────────────────────

export function trackAuthEvent(action: 'signup' | 'login' | 'logout') {
  const eventMap = {
    signup: AnalyticsEvents.SIGNUP_COMPLETED,
    login: AnalyticsEvents.LOGIN_COMPLETED,
    logout: AnalyticsEvents.LOGOUT,
  };

  trackEvent(eventMap[action]);
}

export function trackRoadmapGeneration(
  status: 'started' | 'completed' | 'failed',
  properties?: EventProperties
) {
  const eventMap = {
    started: AnalyticsEvents.ROADMAP_GENERATION_STARTED,
    completed: AnalyticsEvents.ROADMAP_GENERATION_COMPLETED,
    failed: AnalyticsEvents.ROADMAP_GENERATION_FAILED,
  };

  trackEvent(eventMap[status], {
    timestamp: new Date().toISOString(),
    ...properties,
  });
}

export function trackOnboardingStep(step: number, completed: boolean) {
  trackEvent(AnalyticsEvents.ONBOARDING_STEP_COMPLETED, {
    step,
    completed,
    timestamp: new Date().toISOString(),
  });
}

export function trackError(error: Error, context?: EventProperties) {
  trackEvent(AnalyticsEvents.ERROR_OCCURRED, {
    error_message: error.message,
    error_name: error.name,
    stack: error.stack,
    ...context,
  });
}

export function trackPageView(pageName: string, properties?: EventProperties) {
  trackEvent('page_view', {
    page: pageName,
    ...properties,
  });
}
