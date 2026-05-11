"use client";

import { useMemo, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  tilt?: boolean;
}

export default function GlassCard({
  className,
  children,
  hover = true,
  tilt = false,
}: GlassCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const rawRotateX = useTransform(mouseY, [0, 100], [8, -8]);
  const rawRotateY = useTransform(mouseX, [0, 100], [-8, 8]);
  const rotateX = useSpring(rawRotateX, { stiffness: 180, damping: 20, mass: 0.6 });
  const rotateY = useSpring(rawRotateY, { stiffness: 180, damping: 20, mass: 0.6 });

  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.18), transparent 70%)`;

  const handlers = useMemo(
    () => ({
      onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        mouseX.set(x);
        mouseY.set(y);
      },
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    }),
    [mouseX, mouseY]
  );

  return (
    <motion.div
      {...handlers}
      style={
        tilt
          ? {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
        hover && "transition-colors hover:border-indigo-500/30",
        className
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundImage: spotlight, opacity: isHovered ? 1 : 0 }}
      />

      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}
