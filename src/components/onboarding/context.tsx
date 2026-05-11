'use client';

import { createContext, useContext, ReactNode } from 'react';
import { trackOnboardingStep, trackRoadmapGeneration, identifyUser } from '@/lib/analytics';

interface OnboardingContextType {
  trackStep: (stepNumber: number, completed: boolean) => void;
  trackGeneration: (status: 'started' | 'completed' | 'failed', properties?: Record<string, unknown>) => void;
  setUserData: (userId: string, userData: Record<string, unknown>) => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const trackStep = (stepNumber: number, completed: boolean) => {
    trackOnboardingStep(stepNumber, completed);
  };

  const trackGeneration = (status: 'started' | 'completed' | 'failed', properties?: Record<string, unknown>) => {
    trackRoadmapGeneration(status, properties);
  };

  const setUserData = (userId: string, userData: Record<string, unknown>) => {
    identifyUser(userId, userData);
  };

  const value: OnboardingContextType = {
    trackStep,
    trackGeneration,
    setUserData,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
