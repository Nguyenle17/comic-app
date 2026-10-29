"use client";

import { useEffect } from "react";
import { restoreSession } from "@/features/auth/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void restoreSession();
  }, []);

  return <>{children}</>;
}
