"use client";

import { useEffect, useState } from "react";

export function useAdaptiveQuality() {
  const [reducedQuality, setReducedQuality] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallScreen = window.matchMedia("(max-width: 1023px)").matches;
    const lowMemory = typeof nav.deviceMemory === "number" ? nav.deviceMemory <= 4 : false;
    const saveData = !!nav.connection?.saveData;
    const lowCoreCount = typeof nav.hardwareConcurrency === "number" ? nav.hardwareConcurrency <= 4 : false;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedQuality(prefersReducedMotion || isSmallScreen || lowMemory || saveData || lowCoreCount);
  }, []);

  return { reducedQuality };
}
