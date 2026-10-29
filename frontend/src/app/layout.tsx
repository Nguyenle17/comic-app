import type { Metadata } from "next";
import { Be_Vietnam_Pro, Lora } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AppProvider } from "@/app/providers/AppProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import "./globals.css";

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
});

const serif = Lora({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "NStories — Đọc và viết truyện",
  description:
    "Đọc truyện chữ, truyện tranh và sáng tác Việt. Khám phá tác phẩm mới và theo dõi tác giả bạn yêu thích.",
};

const themeInitScript = `try{var s=JSON.parse(localStorage.getItem('ui-storage')||'{}');if(s.state&&s.state.isDarkMode)document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${sans.variable} ${serif.variable} flex min-h-dvh flex-col bg-paper text-ink antialiased`}
      >
        <AppProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
