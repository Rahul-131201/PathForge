"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type QualityLevel = "high" | "medium" | "low";

interface AdaptiveQualityValue {
  quality: QualityLevel;
  isMobile: boolean;
  isLowPowerDevice: boolean;
  enable3D: boolean;
  enableParticles: boolean;
  enableComplexAnimations: boolean;
}

const AdaptiveQualityContext = createContext<AdaptiveQualityValue | null>(null);

function detectQuality(): Omit<AdaptiveQualityValue, "enable3D" | "enableParticles" | "enableComplexAnimations"> & {
  quality: QualityLevel;
} {
  if (typeof window === "undefined") {
    return {
      quality: "high",
      isMobile: false,
      isLowPowerDevice: false,
    };
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: {
      effectiveType?: string;
      saveData?: boolean;
    };
  };

  const isMobile = window.matchMedia("(max-width: 1023px)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const effectiveType = nav.connection?.effectiveType ?? "4g";
  const saveData = nav.connection?.saveData ?? false;

  const lowPowerSignals =
    prefersReducedMotion ||
    saveData ||
    cores <= 4 ||
    memory <= 4 ||
    effectiveType.includes("2g");

  const mediumSignals =
    isMobile || cores <= 6 || memory <= 8 || effectiveType.includes("3g");

  const quality: QualityLevel = lowPowerSignals
    ? "low"
    : mediumSignals
      ? "medium"
      : "high";

  return {
    quality,
    isMobile,
    isLowPowerDevice: lowPowerSignals,
  };
}

export default function AdaptiveQualityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(() => detectQuality());

  useEffect(() => {
    const update = () => setState(detectQuality());

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  const value = useMemo<AdaptiveQualityValue>(() => {
    const enable3D = state.quality === "high";
    const enableParticles = state.quality !== "low";
    const enableComplexAnimations = state.quality === "high";

    return {
      ...state,
      enable3D,
      enableParticles,
      enableComplexAnimations,
    };
  }, [state]);

  return (
    <AdaptiveQualityContext.Provider value={value}>
      {children}
    </AdaptiveQualityContext.Provider>
  );
}

export function useAdaptiveQuality() {
  const context = useContext(AdaptiveQualityContext);

  if (!context) {
    throw new Error("useAdaptiveQuality must be used within AdaptiveQualityProvider");
  }

  return context;
}
