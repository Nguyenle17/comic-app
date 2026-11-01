"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { becomeAuthor } from "@/features/user/api";
import { ApiError } from "@/lib/api-client";
import { useT } from "@/features/preferences/i18n";
import { useUiStore } from "@/features/preferences/stores/ui-store";

export function useBecomeAuthor(redirectTo?: string) {
  const router = useRouter();
  const t = useT();
  const addToast = useUiStore((state) => state.addToast);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit() {
    setError(null);
    setIsSubmitting(true);

    try {
      await becomeAuthor();
      addToast({ type: "success", message: t("toast.becomeAuthorSuccess") });
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    } catch (cause) {
      const message =
        cause instanceof ApiError ? cause.message : t("error.roleUpdate");
      setError(message);
      addToast({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return { error, isSubmitting, onSubmit };
}
