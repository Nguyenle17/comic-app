import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Lora } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/Toaster";
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
  title: "NNovels — Đọc và viết truyện",
  description:
    "Đọc truyện chữ, truyện tranh và sáng tác Việt. Khám phá tác phẩm mới và theo dõi tác giả bạn yêu thích.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f0e8" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:border focus:border-accent focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
        >
          Bỏ qua nội dung
        </a>
        <AppProvider>
          <AuthProvider>
            <Header />
            <div id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
              {children}
            </div>
            <Footer />
            <Toaster />
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
