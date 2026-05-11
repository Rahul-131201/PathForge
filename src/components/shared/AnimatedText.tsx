"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedAs = "h1" | "h2" | "h3" | "p";

interface AnimatedTextProps {
  text: string;
  as?: AnimatedAs;
  staggerDelay?: number;
  className?: string;
}

const motionMap = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const;

export default function AnimatedText({
  text,
  as = "p",
  staggerDelay = 0.1,
  className,
}: AnimatedTextProps) {
  const words = text.trim().split(/\s+/);
  const MotionTag = motionMap[as];

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.55 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="mr-[0.3em] inline-block"
          variants={{
            hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
