"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuizProgressBar from "@/components/onboarding/progress-bar";
import StepGoal from "@/components/onboarding/step-goal";
import StepLevel from "@/components/onboarding/step-level";
import StepHours from "@/components/onboarding/step-hours";
import StepStyle from "@/components/onboarding/step-style";
import StepContext from "@/components/onboarding/step-context";
import { toast } from "sonner";
import type { OnboardingAnswers, DifficultyLevel, LearningStyleOption } from "@/types";

const STEP_COUNT = 5;
const STEP_LABELS = ["Goal", "Level", "Hours", "Style", "Context"];

const LOADING_MESSAGES = [
  "Reading your preferences...",
  "Planning your journey...",
  "Crafting your roadmap...",
  "Adding resources...",
  "Almost there...",
];

const STEP_META = [
  {
    title: "What do you want to learn?",
    description: "Be specific — the more detail, the better your roadmap.",
  },
  {
    title: "What's your current level?",
    description: "Be honest — this helps us set the right starting point.",
  },
  {
    title: "How much time can you commit?",
    description: "We'll fit the roadmap to your schedule.",
  },
  {
    title: "How do you learn best?",
    description: "Select everything that applies — we'll mix resources accordingly.",
  },
  {
    title: "Anything else we should know?",
    description: "Optional — skip if you're ready to generate.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [generating, setGenerating] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  const [answers, setAnswers] = useState<OnboardingAnswers>({
    topic: "",
    currentLevel: "beginner" as DifficultyLevel,
    weeklyHours: "",
    learningStyles: [] as LearningStyleOption[],
    additionalContext: "",
  });

  // Cycle loading messages
  useEffect(() => {
    if (!generating) return;
    const interval = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [generating]);

  const canAdvance = useCallback(() => {
    switch (step) {
      case 0: return answers.topic.trim().length > 0;
      case 1: return Boolean(answers.currentLevel);
      case 2: return answers.weeklyHours !== "";
      case 3: return answers.learningStyles.length > 0;
      case 4: return true;
      default: return false;
    }
  }, [step, answers]);

  const goNext = useCallback(() => {
    if (!canAdvance()) {
      toast.error("Please complete this step before continuing.");
      return;
    }
    if (step < STEP_COUNT - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [step, canAdvance]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (generating) return;
      if (e.key === "Enter" && step < STEP_COUNT - 1) goNext();
      if (e.key === "Escape" || (e.key === "ArrowLeft" && e.altKey)) goBack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [generating, step, goNext, goBack]);

  const handleSubmit = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: answers.topic,
          currentLevel: answers.currentLevel,
          weeklyHours: answers.weeklyHours,
          learningStyles: answers.learningStyles,
          additionalContext: answers.additionalContext,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      toast.success("Your roadmap is ready!");
      router.push(`/roadmap/${data.roadmapId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate roadmap. Please try again.";
      toast.error(msg, { duration: 8000 });
      setGenerating(false);
    }
  };

  const stepVariants = {
    enter: (dir: number) => ({
      x: dir * 80,
      opacity: 0,
      filter: "blur(8px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      x: dir * -80,
      opacity: 0,
      filter: "blur(8px)",
    }),
  };

  if (generating) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-8"
        style={{ background: "#050510" }}
      >
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(99,102,241,0.12),transparent)] pointer-events-none" />

        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl"
        >
          🧠
        </motion.div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold gradient-text">Forging your roadmap...</h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingMsgIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-muted-foreground text-sm min-h-[1.25rem]"
            >
              {LOADING_MESSAGES[loadingMsgIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </div>
    );
  }

  const meta = STEP_META[step];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#050510" }}>
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(99,102,241,0.08),transparent)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold gradient-text-primary">PathForge</span>
        </div>
        <div className="text-xs text-muted-foreground/60">
          Step {step + 1} of {STEP_COUNT}
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl space-y-7">
          {/* Progress bar */}
          <QuizProgressBar current={step} total={STEP_COUNT} labels={STEP_LABELS} />

          {/* Step card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] backdrop-blur-sm">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="p-6 sm:p-8">
              {/* Step heading */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`heading-${step}`}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="mb-6"
                >
                  <h2 className="text-xl sm:text-2xl font-bold">{meta.title}</h2>
                  {meta.description && (
                    <p className="text-sm text-muted-foreground mt-1">{meta.description}</p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Step content */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`content-${step}`}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {step === 0 && (
                    <StepGoal
                      value={answers.topic}
                      onChange={(v) => setAnswers((a) => ({ ...a, topic: v }))}
                    />
                  )}
                  {step === 1 && (
                    <StepLevel
                      value={answers.currentLevel}
                      onChange={(v) => setAnswers((a) => ({ ...a, currentLevel: v }))}
                    />
                  )}
                  {step === 2 && (
                    <StepHours
                      value={answers.weeklyHours}
                      onChange={(v) => setAnswers((a) => ({ ...a, weeklyHours: v }))}
                    />
                  )}
                  {step === 3 && (
                    <StepStyle
                      value={answers.learningStyles}
                      onChange={(v) => setAnswers((a) => ({ ...a, learningStyles: v }))}
                    />
                  )}
                  {step === 4 && (
                    <StepContext
                      value={answers.additionalContext}
                      onChange={(v) => setAnswers((a) => ({ ...a, additionalContext: v }))}
                      onSubmit={handleSubmit}
                      onSkip={handleSubmit}
                      isLoading={generating}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation (steps 1–4) */}
          {step < STEP_COUNT - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between pt-1"
            >
              <Button
                variant="ghost"
                onClick={goBack}
                disabled={step === 0}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <Button
                variant="gradient"
                onClick={goNext}
                disabled={!canAdvance()}
                className="gap-2 group"
              >
                Continue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {/* Back only on last step */}
          {step === STEP_COUNT - 1 && (
            <div className="flex justify-start">
              <Button variant="ghost" onClick={goBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
