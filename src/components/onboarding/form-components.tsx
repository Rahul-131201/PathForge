'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationHintProps {
  message?: string;
  isValid?: boolean;
  isError?: boolean;
  children?: ReactNode;
}

export function ValidationHint({ message, isValid, isError, children }: ValidationHintProps) {
  if (!message && !children) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className={cn(
        'flex items-start gap-2 text-xs p-2 rounded-md transition-colors',
        isError ? 'text-destructive bg-destructive/10' : isValid ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground bg-muted/50'
      )}
    >
      {isError && <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />}
      {isValid && <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />}
      <div>
        {children || <p>{message}</p>}
      </div>
    </motion.div>
  );
}

interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  isValid?: boolean;
  isOptional?: boolean;
  children: ReactNode;
}

export function FormField({ 
  label, 
  hint, 
  error, 
  isValid, 
  isOptional,
  children 
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium">
          {label}
          {isOptional && <span className="text-muted-foreground ml-1">(optional)</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <ValidationHint message={hint} />
      )}
      {error && (
        <ValidationHint message={error} isError={true} />
      )}
      {isValid && !error && (
        <ValidationHint isValid={true} message="Looks good!" />
      )}
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="space-y-4 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"
        />
        <p className="text-sm text-muted-foreground">Processing...</p>
      </div>
    </div>
  );
}

interface KeyboardHintProps {
  hint: string;
  variant?: 'default' | 'compact';
}

export function KeyboardHint({ hint, variant = 'default' }: KeyboardHintProps) {
  if (variant === 'compact') {
    return (
      <p className="text-xs text-muted-foreground">
        {hint}
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-md p-2 border border-muted">
      <kbd className="px-2 py-1 bg-muted border border-muted-foreground/30 rounded text-xs font-mono">
        {hint.split('→')[0]?.trim()}
      </kbd>
      <span>{hint.split('→')[1]?.trim()}</span>
    </div>
  );
}
