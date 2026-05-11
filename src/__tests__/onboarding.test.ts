import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Validation schema for onboarding
const OnboardingSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  weeklyHours: z.string().refine((h) => !isNaN(parseInt(h)) && parseInt(h) > 0, {
    message: 'Weekly hours must be a positive number',
  }),
  learningStyles: z.array(z.string()).min(1, 'Select at least one learning style'),
  additionalContext: z.string().optional(),
});

describe('Onboarding Validation', () => {
  describe('Topic validation', () => {
    it('should reject empty topic', () => {
      const result = OnboardingSchema.safeParse({
        topic: '',
        currentLevel: 'beginner',
        weeklyHours: '5',
        learningStyles: ['video'],
      });
      expect(result.success).toBe(false);
    });

    it('should reject topics shorter than 3 characters', () => {
      const result = OnboardingSchema.safeParse({
        topic: 'JS',
        currentLevel: 'beginner',
        weeklyHours: '5',
        learningStyles: ['video'],
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid topics', () => {
      const result = OnboardingSchema.safeParse({
        topic: 'React Advanced Patterns',
        currentLevel: 'beginner',
        weeklyHours: '5',
        learningStyles: ['video'],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Level validation', () => {
    it('should reject invalid difficulty levels', () => {
      const result = OnboardingSchema.safeParse({
        topic: 'React',
        currentLevel: 'expert',
        weeklyHours: '5',
        learningStyles: ['video'],
      });
      expect(result.success).toBe(false);
    });

    it('should accept valid difficulty levels', () => {
      ['beginner', 'intermediate', 'advanced'].forEach((level) => {
        const result = OnboardingSchema.safeParse({
          topic: 'React',
          currentLevel: level,
          weeklyHours: '5',
          learningStyles: ['video'],
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Weekly hours validation', () => {
    it('should reject non-numeric hours', () => {
      const result = OnboardingSchema.safeParse({
        topic: 'React',
        currentLevel: 'beginner',
        weeklyHours: 'abc',
        learningStyles: ['video'],
      });
      expect(result.success).toBe(false);
    });

    it('should reject zero or negative hours', () => {
      const result1 = OnboardingSchema.safeParse({
        topic: 'React',
        currentLevel: 'beginner',
        weeklyHours: '0',
        learningStyles: ['video'],
      });
      const result2 = OnboardingSchema.safeParse({
        topic: 'React',
        currentLevel: 'beginner',
        weeklyHours: '-5',
        learningStyles: ['video'],
      });
      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });

    it('should accept positive hours', () => {
      const result = OnboardingSchema.safeParse({
        topic: 'React',
        currentLevel: 'beginner',
        weeklyHours: '10',
        learningStyles: ['video'],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Learning styles validation', () => {
    it('should reject empty learning styles array', () => {
      const result = OnboardingSchema.safeParse({
        topic: 'React',
        currentLevel: 'beginner',
        weeklyHours: '5',
        learningStyles: [],
      });
      expect(result.success).toBe(false);
    });

    it('should accept multiple learning styles', () => {
      const result = OnboardingSchema.safeParse({
        topic: 'React',
        currentLevel: 'beginner',
        weeklyHours: '5',
        learningStyles: ['video', 'documentation', 'hands-on'],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Additional context validation', () => {
    it('should allow optional additional context', () => {
      const result = OnboardingSchema.safeParse({
        topic: 'React',
        currentLevel: 'beginner',
        weeklyHours: '5',
        learningStyles: ['video'],
        additionalContext: '',
      });
      expect(result.success).toBe(true);
    });

    it('should accept additional context when provided', () => {
      const result = OnboardingSchema.safeParse({
        topic: 'React',
        currentLevel: 'beginner',
        weeklyHours: '5',
        learningStyles: ['video'],
        additionalContext: 'I already know JavaScript basics',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Complete form validation', () => {
    it('should validate complete valid form', () => {
      const result = OnboardingSchema.safeParse({
        topic: 'Advanced React Patterns',
        currentLevel: 'intermediate',
        weeklyHours: '8',
        learningStyles: ['video', 'documentation', 'hands-on'],
        additionalContext: 'Looking to master performance optimization',
      });
      expect(result.success).toBe(true);
    });
  });
});
