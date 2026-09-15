import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Providers from "@/components/layout/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "TruyenViet — Đọc truyện chữ & truyện tranh online",
  description:
    "Đọc truyện chữ, truyện tranh và truyện sáng tác miễn phí. Hàng nghìn bộ truyện cập nhật mỗi ngày tại TruyenViet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100 selection:bg-amber-400 selection:text-zinc-950">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}