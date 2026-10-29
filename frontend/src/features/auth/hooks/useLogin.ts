"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/auth";
import { login } from "@/features/auth/api";
import { ApiError } from "@/lib/api-client";
import { useT } from "@/features/preferences/i18n";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useT();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    try {
      await login(data);
      const redirectParam = searchParams.get("redirect");
      const redirect =
        redirectParam &&
        redirectParam.startsWith("/") &&
        !redirectParam.startsWith("//")
          ? redirectParam
          : "/";
      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (
          err.code === "AUTH_INVALID_CREDENTIALS" ||
          err.statusCode === 401
        ) {
          setServerError(t("auth.invalidCredentials"));
        } else {
          setServerError(err.message);
        }
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError(t("auth.connectionError"));
      }
    }
  }

  return { ...form, serverError, showPassword, setShowPassword, onSubmit };
}
