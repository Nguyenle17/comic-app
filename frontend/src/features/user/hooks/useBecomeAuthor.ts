"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { becomeAuthor } from "@/features/user/api";
import { ApiError } from "@/lib/api-client";
import { useT } from "@/features/preferences/i18n";

export function useBecomeAuthor(redirectTo?: string) {
  const router = useRouter();
  const t = useT();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit() {
    setError(null);
    setIsSubmitting(true);

    try {
      await becomeAuthor();
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : t("error.roleUpdate")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return { error, isSubmitting, onSubmit };
}
