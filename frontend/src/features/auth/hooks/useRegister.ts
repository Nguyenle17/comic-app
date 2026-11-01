"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas/auth";
import { register as registerApi } from "@/features/auth/api";
import { ApiError } from "@/lib/api-client";
import { useT } from "@/features/preferences/i18n";
import { useUiStore } from "@/features/preferences/stores/ui-store";

export function useRegister() {
  const router = useRouter();
  const t = useT();
  const addToast = useUiStore((state) => state.addToast);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    try {
      await registerApi(data);
      addToast({ type: "success", message: t("toast.registerSuccess") });
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.code === "AUTH_RESOURCE_CONFLICT" || err.statusCode === 409
            ? t("auth.emailInUse")
            : err.message
          : err instanceof Error
            ? err.message
            : t("auth.connectionError");

      setServerError(message);
      addToast({ type: "error", message });
    }
  }

  return { ...form, serverError, showPassword, setShowPassword, onSubmit };
}
