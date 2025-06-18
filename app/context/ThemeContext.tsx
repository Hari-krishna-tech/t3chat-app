"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Theme, themes } from "@/lib/themes";

type ThemeContextType = {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with default theme
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  // Load saved theme on mount
  useEffect(() => {
    try {
      const savedThemeName = localStorage.getItem("theme");
      if (savedThemeName) {
        const savedTheme = themes.find((t) => t.name === savedThemeName);
        if (savedTheme) {
          setCurrentTheme(savedTheme);
          applyTheme(savedTheme);
        }
      } else {
        // If no saved theme, save the default theme
        localStorage.setItem("theme", themes[0].name);
        applyTheme(themes[0]);
      }
    } catch (error) {
      console.error("Error loading theme from localStorage:", error);
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    document.documentElement.style.setProperty("--foreground-rgb", theme.colors.foreground);
    document.documentElement.style.setProperty("--background-rgb", theme.colors.background);
    document.documentElement.style.setProperty("--background-dark-rgb", theme.colors.backgroundDark);
    document.documentElement.style.setProperty("--accent-primary-rgb", theme.colors.accentPrimary);
    document.documentElement.style.setProperty("--accent-primary-dark-rgb", theme.colors.accentPrimaryDark);
    document.documentElement.style.setProperty("--accent-secondary-rgb", theme.colors.accentSecondary);
  };

  const setTheme = (theme: Theme) => {
    try {
      // Save to localStorage
      localStorage.setItem("theme", theme.name);
      // Update state
      setCurrentTheme(theme);
      // Apply theme
      applyTheme(theme);
    } catch (error) {
      console.error("Error saving theme to localStorage:", error);
    }
  };

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