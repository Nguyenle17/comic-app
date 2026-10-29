import type { Metadata } from "next";
import { AuthAside } from "@/features/auth/components/AuthAside";

export const metadata: Metadata = {
  title: "Tài khoản — NStories",
  description:
    "Đăng nhập hoặc tạo tài khoản NStories để lưu tủ truyện và theo dõi tác giả yêu thích.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[70vh] w-full max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:gap-0 lg:px-8 lg:py-16">
      <AuthAside />
      <div className="flex items-center justify-center lg:pl-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
