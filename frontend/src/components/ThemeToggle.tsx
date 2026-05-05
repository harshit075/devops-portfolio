"use client";

import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setIsGlitching(true);
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    }, 150); // change theme midway through glitch
    setTimeout(() => {
      setIsGlitching(false);
    }, 400); // 400ms matches animation duration
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 p-2 border border-border-color bg-background mix-blend-difference hover:bg-foreground hover:text-background transition-colors cursor-pointer rounded-none group ${
        isGlitching ? "theme-transitioning" : ""
      }`}
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 group-hover:text-background transition-colors" />
      ) : (
        <Moon className="w-5 h-5 group-hover:text-background transition-colors" />
      )}
    </div>
  );
}
