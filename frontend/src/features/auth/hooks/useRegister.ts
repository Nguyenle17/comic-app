"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas/auth";
import { register as registerApi } from "@/features/auth/api";
import { ApiError } from "@/lib/api-client";
import { useT } from "@/features/preferences/i18n";

export function useRegister() {
  const router = useRouter();
  const t = useT();
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
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (
          err.code === "AUTH_RESOURCE_CONFLICT" ||
          err.statusCode === 409
        ) {
          setServerError(t("auth.emailInUse"));
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
