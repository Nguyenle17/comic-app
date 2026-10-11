import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — NStories",
  description: "Sign in to NStories to continue reading and save your reading history.",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Chào mừng trở lại!"
      subtitle="Đăng nhập để tiếp tục khám phá hàng nghìn bộ truyện hấp dẫn."
      footer={
        <p>
          By signing in, you agree to the NStories terms and policies.
        </p>
      }
    >
      <Suspense fallback={<div className="h-48 flex items-center justify-center text-sm text-zinc-400">Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
