'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const themeVariables: Record<Theme, Record<string, string>> = {
  dark: {
    '--background': '234 60% 3%',
    '--foreground': '213 31% 91%',
    '--card': '234 40% 5%',
    '--card-foreground': '213 31% 91%',
    '--popover': '234 30% 6%',
    '--popover-foreground': '213 31% 91%',
    '--primary': '239 84% 67%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '192 91% 53%',
    '--secondary-foreground': '220 60% 10%',
    '--muted': '217 33% 11%',
    '--muted-foreground': '215 20% 55%',
    '--accent': '271 91% 65%',
    '--accent-foreground': '0 0% 100%',
    '--destructive': '0 72% 51%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '217 33% 14%',
    '--input': '217 33% 12%',
    '--ring': '239 84% 67%',
  },
  light: {
    '--background': '0 0% 100%',
    '--foreground': '220 9% 20%',
    '--card': '0 0% 96%',
    '--card-foreground': '220 9% 20%',
    '--popover': '0 0% 100%',
    '--popover-foreground': '220 9% 20%',
    '--primary': '239 84% 57%',
    '--primary-foreground': '0 0% 100%',
    '--secondary': '192 91% 43%',
    '--secondary-foreground': '0 0% 100%',
    '--muted': '220 13% 91%',
    '--muted-foreground': '220 9% 46%',
    '--accent': '271 91% 55%',
    '--accent-foreground': '0 0% 100%',
    '--destructive': '0 72% 51%',
    '--destructive-foreground': '0 0% 100%',
    '--border': '220 13% 91%',
    '--input': '220 13% 91%',
    '--ring': '239 84% 57%',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [initialized, setInitialized] = useState(false);

  // Initialize theme from localStorage on mount.
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const themeToApply: Theme = savedTheme === 'light' ? 'light' : 'dark';

    setTheme(themeToApply);
    setInitialized(true);
  }, []);

  // Apply theme and persist after React has committed updates.
  useEffect(() => {
    if (!initialized) return;

    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme, initialized]);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      return prevTheme === 'dark' ? 'light' : 'dark';
    });
  };

  const applyTheme = (selectedTheme: Theme) => {
    const html = document.documentElement;
    const body = document.body;

    if (selectedTheme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }

    const vars = themeVariables[selectedTheme];
    for (const [name, value] of Object.entries(vars)) {
      html.style.setProperty(name, value);
      body?.style.setProperty(name, value);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
