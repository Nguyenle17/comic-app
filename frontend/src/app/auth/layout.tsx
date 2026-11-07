import type { Metadata } from "next";
import { AuthAside } from "@/features/auth/components/AuthAside";

export const metadata: Metadata = {
  title: "Tài khoản — NNovels",
  description:
    "Đăng nhập hoặc tạo tài khoản NNovels để lưu tủ truyện và theo dõi tác giả yêu thích.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="shell grid min-h-[70vh] gap-12 py-12 lg:grid-cols-[0.9fr_1fr] lg:gap-0 lg:py-16">
      <AuthAside />
      <div className="flex items-center justify-center lg:pl-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </main>
  );
}
