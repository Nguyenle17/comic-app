import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";
import type { Story } from "@/lib/types";

const typeLabel: Record<Story["storyType"], string> = {
  text: "Truyện chữ",
  comic: "Truyện tranh",
  original: "Sáng tác",
};

export function HeroBanner({ story }: { story: Story }) {
  if (!story) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 p-[1.5px] shadow-xl shadow-amber-500/10">
      <div className="relative overflow-hidden rounded-[22px] bg-white/95 p-5 backdrop-blur-xl sm:p-7 dark:bg-zinc-950/90">
        {/* Ambient background glow inside card */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-rose-500/15 blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr]">
          {/* Cover image with 3D tilt effect */}
          <Link
            href={`/truyen/${story.slug}`}
            className="group relative mx-auto aspect-[2/3] w-full max-w-[180px] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10 transition duration-300 hover:scale-[1.02] sm:mx-0 sm:max-w-none"
          >
            <Image
              src={story.coverImageUrl}
              alt={story.title}
              fill
              sizes="(max-width: 640px) 180px, 200px"
              className="object-cover transition duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 flex items-end p-3">
              <span className="text-xs font-semibold text-white">Đọc ngay →</span>
            </div>
          </Link>

          {/* Story Meta & Actions */}
          <div className="flex flex-col justify-between gap-4">
            <div className="space-y-3">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm shadow-amber-500/30">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.316.492-.63 1.1-.97 1.838a25.32 25.32 0 01-1.394 2.68C7.14 8.7 6.47 9.8 5.76 10.74c-.754.996-1.57 1.942-2.126 2.766-.547.81-.884 1.57-.884 2.294 0 2.872 2.378 5.2 5.3 5.2 2.923 0 5.3-2.328 5.3-5.2 0-.82-.416-1.68-1.028-2.61a25.867 25.867 0 00-2.316-2.923c.783-.872 1.547-1.85 2.215-2.858.74-1.118 1.34-2.26 1.73-3.277.38-1 .54-1.86.3-2.47a1 1 0 00-.856-.605z" clipRule="evenodd" />
                  </svg>
                  Đề cử nổi bật
                </span>
                <Badge variant={story.storyType}>{typeLabel[story.storyType]}</Badge>
                {story.categories?.map((c) => (
                  <span
                    key={c.id}
                    className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300"
                  >
                    {c.name}
                  </span>
                ))}
              </div>

              {/* Title & Author */}
              <div>
                <Link
                  href={`/truyen/${story.slug}`}
                  className="text-2xl font-black tracking-tight text-zinc-900 transition hover:text-amber-500 sm:text-3xl dark:text-zinc-50 dark:hover:text-amber-400"
                >
                  {story.title}
                </Link>
                <p className="mt-1 flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <span>Tác giả:</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                    {story.author.displayName}
                  </span>
                </p>
              </div>

              {/* Synopsis */}
              <p className="line-clamp-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-sm">
                {story.description}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400 pt-1">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <svg className="h-4 w-4 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                  {story.ratingAvg.toFixed(1)} ({formatNumber(story.ratingCount)} đánh giá)
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {formatNumber(story.viewCount)} lượt đọc
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {story.chapterCount} chương
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/truyen/${story.slug}/chuong-1`}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 text-sm font-bold text-zinc-950 shadow-md shadow-amber-500/25 transition hover:from-amber-400 hover:to-amber-300 active:scale-95"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Đọc ngay chương 1
              </Link>
              <Link
                href={`/truyen/${story.slug}`}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-zinc-200/80 bg-white/70 px-5 text-sm font-semibold text-zinc-700 backdrop-blur transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Thông tin chi tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}