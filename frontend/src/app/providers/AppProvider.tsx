"use client";

import { useEffect } from "react";
import { useUIStore } from "@/features/preferences/stores/ui-store";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const language = useUIStore((s) => s.language);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return <>{children}</>;
}
