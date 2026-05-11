"use client";

import type { MouseEventHandler } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GradientButtonVariant = "primary" | "secondary" | "ghost";
type GradientButtonSize = "sm" | "md" | "lg";

interface GradientButtonProps {
  children: React.ReactNode;
  variant?: GradientButtonVariant;
  size?: GradientButtonSize;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  href?: string;
  className?: string;
}

const sizeClasses: Record<GradientButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

const variantClasses: Record<GradientButtonVariant, string> = {
  primary:
    "shared-shimmer-btn text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_10px_24px_rgba(99,102,241,0.25)]",
  secondary:
    "text-slate-100 bg-transparent border border-transparent bg-[linear-gradient(#090b1a,#090b1a)_padding-box,linear-gradient(130deg,#6366f1,#22d3ee)_border-box]",
  ghost:
    "relative text-slate-200 hover:text-white before:absolute before:bottom-1 before:left-3 before:h-px before:w-0 before:bg-current before:transition-all before:duration-300 hover:before:w-[calc(100%-1.5rem)]",
};

function Content({
  children,
  href,
  onClick,
  className,
  size,
  variant,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  className?: string;
  size: GradientButtonSize;
  variant: GradientButtonVariant;
}) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xl font-semibold transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70",
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export default function GradientButton({
  children,
  variant = "primary",
  size = "md",
  onClick,
  href,
  className,
}: GradientButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: variant === "ghost" ? 1 : 1.02 }}
      whileTap={{ scale: variant === "ghost" ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-flex"
    >
      <Content
        href={href}
        onClick={onClick}
        className={className}
        size={size}
        variant={variant}
      >
        {children}
      </Content>
    </motion.div>
  );
}
