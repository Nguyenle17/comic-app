"use client";

import { useEffect } from "react";
import { useUiStore } from "@/features/preferences/stores/ui-store";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const isDarkMode = useUiStore((s) => s.isDarkMode);
  const language = useUiStore((s) => s.language);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return <>{children}</>;
}
