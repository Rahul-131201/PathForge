"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizQuestion, OnboardingAnswers } from "@/types";

interface QuizCardProps {
  question: QuizQuestion;
  answers: Partial<OnboardingAnswers>;
  onAnswer: (field: keyof OnboardingAnswers, value: string | string[]) => void;
}

export default function QuizCard({
  question,
  answers,
  onAnswer,
}: QuizCardProps) {
  const currentValue = answers[question.field];

  const handleSelect = (value: string) => {
    if (question.type === "multi") {
      const current = (currentValue as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      onAnswer(question.field, updated);
    } else {
      onAnswer(question.field, value);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: -40, filter: "blur(8px)" }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full"
      >
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {question.question}
          </h2>
          {question.description && (
            <p className="text-muted-foreground">{question.description}</p>
          )}
        </div>

        {question.type === "text" ? (
          <input
            type="text"
            value={(currentValue as string) || ""}
            onChange={(e) => onAnswer(question.field, e.target.value)}
            placeholder="Type your answer..."
            className={cn(
              "w-full h-14 px-4 rounded-xl bg-white/5 border border-border",
              "text-foreground placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
              "transition-colors text-lg"
            )}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options?.map((option) => {
              const isSelected =
                question.type === "multi"
                  ? ((currentValue as string[]) || []).includes(option.value)
                  : currentValue === option.value;

              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200",
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-white/3 text-muted-foreground hover:border-primary/40 hover:bg-white/6 hover:text-foreground"
                  )}
                >
                  {option.icon && (
                    <span className="text-2xl">{option.icon}</span>
                  )}
                  <span className="font-medium">{option.label}</span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto shrink-0"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
