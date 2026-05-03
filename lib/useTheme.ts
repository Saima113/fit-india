"use client";
import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

// Reads the theme that the landing page toggle saves to localStorage
// and returns CSS-ready values so dashboard/onboarding can respect it.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark"); // default dark

  useEffect(() => {
    // Read from localStorage (same key your landing page toggle uses)
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) setTheme(stored);

    // Listen for changes (if user toggles while on another tab or navigates)
    const handler = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) setTheme(e.newValue as Theme);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const isDark = theme === "dark";

  // All colours used across dashboard/onboarding
  const colors = {
    bg:            isDark ? "#0d0d0d"                    : "#faeaeb",
    bgSecondary:   isDark ? "#141414"                    : "#ffffff",
    bgTertiary:    isDark ? "rgba(255,255,255,0.04)"     : "rgba(0,0,0,0.04)",
    border:        isDark ? "rgba(255,255,255,0.08)"     : "rgba(0,0,0,0.1)",
    borderStrong:  isDark ? "rgba(255,255,255,0.15)"     : "rgba(0,0,0,0.2)",
    text:          isDark ? "#ffffff"                    : "#0d0d0d",
    textMuted:     isDark ? "rgba(255,255,255,0.4)"      : "rgba(0,0,0,0.45)",
    textSubtle:    isDark ? "rgba(255,255,255,0.25)"     : "rgba(0,0,0,0.3)",
    accent:        "#cf303b",
    accentSoft:    "#e28389",
    accentBg:      isDark ? "rgba(207,48,59,0.1)"        : "rgba(207,48,59,0.08)",
    accentBorder:  isDark ? "rgba(207,48,59,0.2)"        : "rgba(207,48,59,0.25)",
    gradient:      "linear-gradient(135deg, #d85a62 0%, #cf303b 50%, #7c1d23 100%)",
    inputBg:       isDark ? "rgba(255,255,255,0.05)"     : "rgba(0,0,0,0.05)",
    inputBorder:   isDark ? "rgba(255,255,255,0.1)"      : "rgba(0,0,0,0.12)",
    cardHover:     isDark ? "rgba(255,255,255,0.02)"     : "rgba(0,0,0,0.02)",
  };

  return { theme, isDark, colors };
}