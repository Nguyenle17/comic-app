"use client";

import { Suspense } from "react";
import { AuthCard } from "@/features/auth/components/AuthCard";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useT } from "@/features/preferences/i18n";

export default function LoginPage() {
  const t = useT();
  return (
    <AuthCard
      title={t("auth.loginTitle")}
      subtitle={t("auth.loginSubtitle")}
      footer={<p>{t("auth.loginFooter")}</p>}
    >
      <Suspense
        fallback={
          <div className="flex h-48 items-center justify-center text-sm text-muted">
            {t("common.loading")}
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
