import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create an account — NStories",
  description: "Create a free NStories account and start building your personal library.",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Tạo tài khoản mới"
      subtitle="Đăng ký tài khoản miễn phí, nhận ngay 100 xu đọc truyện."
      footer={
        <p>
          Bạn đã có tài khoản? Hãy chuyển sang tab Đăng nhập ở trên.
        </p>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
