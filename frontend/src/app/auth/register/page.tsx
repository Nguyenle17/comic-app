import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản — TruyenViet",
  description: "Tạo tài khoản miễn phí tại TruyenViet, nhận ngay 100 xu thưởng thành viên mới.",
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
