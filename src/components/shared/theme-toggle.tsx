'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep server and first client render identical to avoid hydration mismatches.
  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          'relative inline-flex items-center justify-center',
          'h-10 w-10 rounded-lg',
          'bg-muted border border-border'
        )}
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center justify-center',
        'h-10 w-10 rounded-lg',
        'bg-muted hover:bg-muted/80',
        'border border-border',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-500 transition-all duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-blue-500 transition-all duration-300" />
      )}
    </button>
  );
}
