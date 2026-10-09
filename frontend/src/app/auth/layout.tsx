import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài khoản — TruyenViet",
  description: "Đăng nhập hoặc đăng ký tài khoản TruyenViet để lưu tủ truyện, theo dõi tác giả và nhận xu miễn phí.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-amber-400/15 blur-3xl dark:bg-amber-400/10" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-rose-500/15 blur-3xl dark:bg-rose-500/10" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />

      {/* Main Container */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
