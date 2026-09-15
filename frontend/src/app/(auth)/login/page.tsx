import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập — TruyenViet",
  description: "Đăng nhập vào tài khoản TruyenViet để tiếp tục đọc truyện và lưu lịch sử.",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Chào mừng trở lại!"
      subtitle="Đăng nhập để tiếp tục khám phá hàng nghìn bộ truyện hấp dẫn."
      footer={
        <p>
          Bằng việc đăng nhập, bạn đồng ý với các điều khoản và quy định của TruyenViet.
        </p>
      }
    >
      <Suspense fallback={<div className="h-48 flex items-center justify-center text-sm text-zinc-400">Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
