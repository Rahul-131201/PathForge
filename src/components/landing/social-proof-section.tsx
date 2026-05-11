"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

/* ─── Brand SVG Logos ────────────────────────────────────────────────────── */

function YouTubeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function CourseraLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M11.976 0C5.362 0 0 5.372 0 12c0 6.628 5.362 12 11.976 12C18.59 24 24 18.628 24 12c0-6.628-5.41-12-12.024-12zm0 2.049c5.514 0 9.975 4.47 9.975 9.951 0 5.48-4.461 9.95-9.975 9.95C6.461 21.95 2 17.48 2 12c0-5.481 4.461-9.951 9.976-9.951zM9.415 7.169v9.662c1.004.585 2.16.907 3.377.907a6.77 6.77 0 003.388-.907l-1.692-2.93a3.428 3.428 0 01-1.696.45 3.43 3.43 0 01-3.377-2.852V7.169z" />
    </svg>
  );
}

function FreeCodeCampLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M.004 12.38c.007-3.995 1.413-7.47 4.218-10.27C4.827 1.5 5.46.938 6.163.415c.363-.267.688-.186.878.194.131.26.055.47-.124.676A11.985 11.985 0 002.074 9.96c-.29 1.49-.3 2.975-.054 4.468.282 1.709.875 3.294 1.784 4.75.69 1.107 1.531 2.082 2.543 2.896.213.172.326.363.232.644-.093.279-.293.39-.577.376-.153-.008-.274-.082-.39-.164-1.26-.91-2.327-2.017-3.194-3.306A11.977 11.977 0 01.004 12.38zm23.993-.003c.001 3.971-1.39 7.43-4.164 10.22-.61.617-1.273 1.176-2.002 1.655-.338.22-.638.14-.828-.198-.137-.245-.065-.46.121-.658a12.01 12.01 0 003.91-8.661c.012-1.534-.253-3.014-.815-4.432a12.035 12.035 0 00-3.15-4.608c-.193-.173-.297-.368-.2-.634.096-.264.291-.38.564-.364.147.01.264.083.378.162 1.27.909 2.34 2.015 3.203 3.305a11.986 11.986 0 011.983 5.213zM10.59 7.435l.864 2.19c.016.038.063.062.098.091l2.223.321c.27.039.378.372.183.563l-1.609 1.571c-.03.03-.044.09-.036.133l.38 2.218c.046.27-.237.476-.48.348l-1.989-1.046a.11.11 0 00-.104 0l-1.988 1.046c-.243.128-.526-.078-.48-.348l.38-2.218a.134.134 0 00-.036-.133L6.387 10.6c-.195-.19-.087-.524.183-.563l2.223-.321c.036-.005.08-.032.098-.07l.864-2.19c.12-.31.566-.31.686-.02l.149-.001z" />
    </svg>
  );
}

function MDNLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.342 0c-1.059.023-2.075.195-3.05.502L7.9 3.31a7.8 7.8 0 00-1.633 2.477L4.42 9.094a11.97 11.97 0 00-.605 3.798v1.166c0 .403.019.8.056 1.192l1.73-5.04a5.55 5.55 0 011.14-2.08l2.27-2.586A5.564 5.564 0 0113.095 3.6h1.49a5.55 5.55 0 013.907 1.62l.607.643.51 1.506.498 4.43-.613-1.697a5.558 5.558 0 00-1.14-2.008L16.06 6.28a5.55 5.55 0 00-3.748-1.5h-.518a5.548 5.548 0 00-3.748 1.5L5.65 9.098a5.553 5.553 0 00-1.438 3.794v.186l.47 4.179L6.45 21.65a5.55 5.55 0 003.655 2.08l2.857.258c.13.012.26.012.39.012.86 0 1.703-.164 2.487-.48L18.2 21.3a5.55 5.55 0 002.57-2.667l.94-2.13a11.937 11.937 0 00.867-4.463v-.032c0-.86-.083-1.704-.24-2.523L20.79 14.61a5.55 5.55 0 01-1.438 3.794l-2.393 2.314a5.55 5.55 0 01-3.748 1.5h-.518a5.55 5.55 0 01-3.748-1.5L6.558 18.4a5.55 5.55 0 01-1.434-3.8v-.185l.47-4.18 1.77-4.583a5.55 5.55 0 011.14-2.007l2.395-2.72A5.548 5.548 0 0114.64 0z" />
    </svg>
  );
}

function UdemyLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0L5.81 3.573v3.574l6.185-3.573 6.185 3.573V3.573zM5.81 10.148v8.144c0 1.85.94 3.476 2.354 4.44L12 21.615l3.836-2.883c1.415-.964 2.354-2.59 2.354-4.44v-8.144l-6.189 3.574z" />
    </svg>
  );
}

function GitHubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function StackOverflowLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731H17.78v-2.137H6.111v2.137zm.259-4.852l11.481 2.39.451-2.136-11.48-2.39-.452 2.136zm1.359-5.056l10.666 4.977.92-1.969-10.666-4.978-.92 1.97zm2.715-4.785l8.548 7.261 1.385-1.616-8.548-7.261-1.385 1.616zM17.18 0l-1.818 1.319 6.647 9.148 1.819-1.319L17.18 0z" />
    </svg>
  );
}

function TheOdinProjectLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 2.182A9.818 9.818 0 0121.818 12 9.818 9.818 0 0112 21.818 9.818 9.818 0 012.182 12 9.818 9.818 0 0112 2.182zm0 3.272c-3.62 0-6.545 2.925-6.545 6.546 0 3.62 2.925 6.546 6.545 6.546 3.62 0 6.546-2.926 6.546-6.546 0-3.62-2.926-6.546-6.546-6.546zm0 2.182a4.364 4.364 0 110 8.728 4.364 4.364 0 010-8.728z" />
    </svg>
  );
}

/* ─── Logo data ───────────────────────────────────────────────────────────── */

const resources = [
  { name: "YouTube", Icon: YouTubeLogo, color: "#FF0000", bg: "rgba(255,0,0,0.08)" },
  { name: "Coursera", Icon: CourseraLogo, color: "#0056D2", bg: "rgba(0,86,210,0.08)" },
  { name: "freeCodeCamp", Icon: FreeCodeCampLogo, color: "#0A0A23", bg: "rgba(10,10,35,0.08)" },
  { name: "MDN Web Docs", Icon: MDNLogo, color: "#6B4FBB", bg: "rgba(107,79,187,0.08)" },
  { name: "Udemy", Icon: UdemyLogo, color: "#A435F0", bg: "rgba(164,53,240,0.08)" },
  { name: "GitHub", Icon: GitHubLogo, color: "#6e7681", bg: "rgba(110,118,129,0.08)" },
  { name: "Stack Overflow", Icon: StackOverflowLogo, color: "#F48024", bg: "rgba(244,128,36,0.08)" },
  { name: "The Odin Project", Icon: TheOdinProjectLogo, color: "#d23c31", bg: "rgba(210,60,49,0.08)" },
];

function LogoBadge({ name, Icon, color, bg }: (typeof resources)[number]) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="mx-2.5 flex min-w-42.5 cursor-default items-center gap-3 rounded-xl border px-5 py-3 backdrop-blur-md landing-card"
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: bg }}
      >
        <span style={{ color }}>
          <Icon className="h-4.5 w-4.5" />
        </span>
      </div>
      <span className="text-sm font-semibold landing-text-body">{name}</span>
    </motion.div>
  );
}

export default function SocialProofSection() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 landing-mesh" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center justify-center gap-2 text-cyan-500"
        >
          <Sparkles className="h-4 w-4" />
          <p className="text-sm font-semibold uppercase tracking-[0.22em]">
            Curated resources from the best platforms
          </p>
        </motion.div>

        <div className="overflow-hidden rounded-2xl border py-4 landing-card">
          <div className="landing-marquee">
            <div className="landing-marquee-track">
              {resources.concat(resources).map((res, idx) => (
                <LogoBadge key={`${res.name}-${idx}`} {...res} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
