'use client';

import { useEffect } from 'react';
import { trackOnboardingStep } from '@/lib/analytics';

interface OnboardingStepTrackerProps {
  stepNumber: number;
  completed: boolean;
}

export function OnboardingStepTracker({ stepNumber, completed }: OnboardingStepTrackerProps) {
  useEffect(() => {
    // Track step completion with debouncing
    const timer = setTimeout(() => {
      trackOnboardingStep(stepNumber, completed);
    }, 300);

    return () => clearTimeout(timer);
  }, [stepNumber, completed]);

  return null; // This is a tracking component, no UI
}
