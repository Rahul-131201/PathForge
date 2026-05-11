"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useMemo } from "react";

export default function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useMotionTemplate`${y}deg`, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(useMotionTemplate`${x}deg`, { stiffness: 180, damping: 22 });

  const spotlight = useMotionTemplate`radial-gradient(220px at calc(50% + ${x} * 3px) calc(50% + ${y} * 3px), rgba(255,255,255,0.22), transparent 62%)`;

  const handlers = useMemo(
    () => ({
      onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(px * 10);
        y.set(-py * 10);
      },
      onPointerLeave: () => {
        x.set(0);
        y.set(0);
      },
    }),
    [x, y]
  );

  return (
    <motion.div
      {...handlers}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      <motion.div
        style={{ backgroundImage: spotlight }}
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
