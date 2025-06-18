"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Theme, themes } from "@/lib/themes";

type ThemeContextType = {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const theme = themes.find((t) => t.name === savedTheme);
      if (theme) {
        setCurrentTheme(theme);
      }
    }
  }, []);

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("theme", theme.name);
    
    // Update CSS variables
    document.documentElement.style.setProperty("--foreground-rgb", theme.colors.foreground);
    document.documentElement.style.setProperty("--background-rgb", theme.colors.background);
    document.documentElement.style.setProperty("--background-dark-rgb", theme.colors.backgroundDark);
    document.documentElement.style.setProperty("--accent-primary-rgb", theme.colors.accentPrimary);
    document.documentElement.style.setProperty("--accent-primary-dark-rgb", theme.colors.accentPrimaryDark);
    document.documentElement.style.setProperty("--accent-secondary-rgb", theme.colors.accentSecondary);
  };

  // Apply theme on mount and theme change
  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
} 