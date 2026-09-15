import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";
import type { Story } from "@/lib/types";

const typeLabel: Record<Story["storyType"], string> = {
  text: "Chữ",
  comic: "Tranh",
  original: "Sáng tác",
};

interface StoryCardProps {
  story: Story;
  rank?: number;
}

export function StoryCard({ story, rank }: StoryCardProps) {
  const isHot = story.viewCount >= 100_000 || story.isHot;
  const isNew =
    story.isNew ||
    Date.now() - new Date(story.createdAt).getTime() < 1000 * 60 * 60 * 24 * 30;

  return (
    <Link
      href={`/truyen/${story.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 dark:bg-zinc-900/90 dark:ring-zinc-800"
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={story.coverImageUrl}
          alt={story.title}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Rank Medal (if provided) */}
        {rank !== undefined && rank <= 10 && (
          <div
            className={`absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-xl text-xs font-black shadow-md ${
              rank === 1
                ? "bg-gradient-to-br from-amber-300 to-amber-500 text-zinc-950 shadow-amber-500/40"
                : rank === 2
                ? "bg-gradient-to-br from-slate-200 to-slate-400 text-zinc-900 shadow-slate-400/30"
                : rank === 3
                ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-amber-700/30"
                : "bg-black/60 text-white backdrop-blur-sm"
            }`}
          >
            {rank}
          </div>
        )}

        {/* Badges (Hot / New) */}
        {rank === undefined && (
          <div className="absolute left-2 top-2 flex gap-1">
            {isHot && <Badge variant="hot">Hot</Badge>}
            {isNew && <Badge variant="new">Mới</Badge>}
          </div>
        )}

        {/* Story Type Badge */}
        <div className="absolute bottom-2 right-2">
          <Badge variant={story.storyType}>{typeLabel[story.storyType]}</Badge>
        </div>

        {/* Chapter counter overlay on bottom-left */}
        <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {story.chapterCount} chương
        </div>
      </div>

      {/* Story Info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-xs font-bold leading-snug text-zinc-900 transition-colors group-hover:text-amber-500 dark:text-zinc-100 dark:group-hover:text-amber-400 sm:text-sm">
          {story.title}
        </h3>
        <p className="line-clamp-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          {story.author.displayName}
        </p>

        {/* Views & Rating */}
        <div className="mt-auto flex items-center justify-between pt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <svg className="h-3 w-3 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            {formatNumber(story.viewCount)}
          </span>
          <span className="inline-flex items-center gap-0.5 font-semibold text-amber-500">
            <svg className="h-3 w-3 fill-amber-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
            </svg>
            {story.ratingAvg.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}