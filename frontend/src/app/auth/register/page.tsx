"use client";

import { AuthCard } from "@/features/auth/components/AuthCard";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useT } from "@/features/preferences/i18n";

export default function RegisterPage() {
  const t = useT();
  return (
    <AuthCard
      title={t("auth.registerTitle")}
      subtitle={t("auth.registerSubtitle")}
      footer={<p>{t("auth.registerFooter")}</p>}
    >
      <RegisterForm />
    </AuthCard>
  );
}
