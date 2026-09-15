import Link from "next/link";
import { HeroBanner } from "@/components/story/HeroBanner";
import { SectionHeader } from "@/components/story/SectionHeader";
import { StoryCard } from "@/components/story/StoryCard";
import { mockStories } from "@/lib/mock/stories";
import { STORY_CATEGORIES } from "@/lib/constants";
import type { StoryType } from "@/lib/types";

const TYPE_FILTERS: { label: string; value: StoryType | "all" }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Truyện chữ", value: "text" },
  { label: "Truyện tranh", value: "comic" },
  { label: "Sáng tác Việt", value: "original" },
];

export default function HomePage() {
  const hero = mockStories[1] || mockStories[0];

  // Hot stories sorted by views
  const hotStories = [...mockStories]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 6);

  // Recently updated stories
  const updatedStories = [...mockStories]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 6);

  // Original Vietnamese stories
  const originalStories = mockStories
    .filter((s) => s.storyType === "original")
    .slice(0, 6);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-24 pt-4 sm:gap-14 sm:px-6 sm:pb-16 sm:pt-6 lg:px-8">
      {/* 1. Hero Spotlight */}
      <HeroBanner story={hero} />

      {/* 2. Type & Category Navigation Bar */}
      <div className="flex flex-col gap-3">
        {/* Main type pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TYPE_FILTERS.map((f, i) => (
            <Link
              key={f.value}
              href={f.value === "all" ? "/" : `/danh-sach?loai=${f.value}`}
              className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition-all duration-200 ${
                i === 0
                  ? "bg-zinc-900 text-white shadow-sm dark:bg-amber-400 dark:text-zinc-950"
                  : "border border-zinc-200/80 bg-white text-zinc-600 hover:border-amber-400 hover:text-amber-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-amber-400/50 dark:hover:text-amber-400"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {/* Popular Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-hide">
          <span className="text-zinc-400 text-[11px] font-semibold uppercase shrink-0 mr-1">
            Chủ đề:
          </span>
          {STORY_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/the-loai/${cat.slug}`}
              className="shrink-0 rounded-xl bg-zinc-100/80 px-2.5 py-1 text-[11px] font-medium text-zinc-600 hover:bg-amber-500/10 hover:text-amber-600 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-amber-400/10 dark:hover:text-amber-300 transition"
            >
              #{cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Truyện Hot / Bảng Xếp Hạng (with Top 1, 2, 3 Badges) */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.316.492-.63 1.1-.97 1.838a25.32 25.32 0 01-1.394 2.68C7.14 8.7 6.47 9.8 5.76 10.74c-.754.996-1.57 1.942-2.126 2.766-.547.81-.884 1.57-.884 2.294 0 2.872 2.378 5.2 5.3 5.2 2.923 0 5.3-2.328 5.3-5.2 0-.82-.416-1.68-1.028-2.61a25.867 25.867 0 00-2.316-2.923c.783-.872 1.547-1.85 2.215-2.858.74-1.118 1.34-2.26 1.73-3.277.38-1 .54-1.86.3-2.47a1 1 0 00-.856-.605z" clipRule="evenodd" />
                </svg>
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">
                Truyện Hot Trong Ngày
              </h2>
            </div>
            <p className="text-xs text-zinc-500 sm:text-sm dark:text-zinc-400 mt-0.5">
              Những bộ truyện được độc giả đọc nhiều nhất hôm nay
            </p>
          </div>

          <Link
            href="/bxh"
            className="group inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400"
          >
            Xem tất cả bảng xếp hạng
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {hotStories.map((story, index) => (
            <StoryCard key={story.id} story={story} rank={index + 1} />
          ))}
        </div>
      </section>

      {/* 4. Mới Cập Nhật */}
      <section>
        <SectionHeader
          title="Mới Cập Nhật"
          subtitle="Các chương truyện mới nhất vừa lên kệ"
          href="/danh-sach?sort=updated"
        />
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {updatedStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      {/* 5. Sáng Tác Việt */}
      <section>
        <SectionHeader
          title="Sáng Tác Việt"
          subtitle="Tác phẩm xuất sắc từ cộng đồng tác giả Việt Nam"
          href="/danh-sach?loai=original"
        />
        {originalStories.length === 0 ? (
          <EmptyState message="Chưa có truyện sáng tác nào. Hãy là người đầu tiên đăng tải tác phẩm!" />
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
            {originalStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Call to Action: Dành Cho Tác Giả */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 text-white sm:p-10 shadow-xl">
        <div className="relative z-10 flex flex-col items-start gap-3 sm:max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300 ring-1 ring-inset ring-amber-400/30">
            ★ Dành cho người sáng tác
          </span>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Sáng tác câu chuyện của bạn, nhận xu từ hàng vạn độc giả
          </h2>
          <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm">
            TruyenViet cung cấp nền tảng đăng truyện miễn phí với trình soạn thảo hiện đại, thống kê chi tiết lượt đọc và hệ thống donate xu trực tiếp từ độc giả.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href="/author/truyen-moi"
              className="inline-flex h-11 items-center rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 text-sm font-bold text-zinc-950 transition hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20"
            >
              Bắt đầu sáng tác ngay
            </Link>
            <Link
              href="/tac-gia/huong-dan"
              className="inline-flex h-11 items-center rounded-2xl border border-zinc-700 bg-zinc-800/60 px-5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
            >
              Tìm hiểu chính sách
            </Link>
          </div>
        </div>

        {/* Ambient colored circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-24 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-200 bg-white/50 p-10 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
      <p className="font-medium">{message}</p>
      <Link
        href="/author/truyen-moi"
        className="mt-3 inline-flex text-xs font-bold text-amber-500 hover:underline"
      >
        Đăng ký làm tác giả ngay →
      </Link>
    </div>
  );
}