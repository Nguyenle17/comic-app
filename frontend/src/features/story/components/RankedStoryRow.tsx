"use client";

import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { useT } from "@/features/preferences/i18n";
import type { Story } from "@/features/story/types/story";

const typeLabelKey: Record<Story["storyType"], string> = {
  text: "story.text",
  comic: "story.comic",
  original: "story.original",
};

export function RankedStoryRow({
  story,
  rank,
}: {
  story: Story;
  rank: number;
}) {
  const t = useT();

  return (
    <Link
      href={`/truyen/${story.slug}`}
      className="group grid grid-cols-[2rem_3rem_1fr] items-center gap-3 border-b border-line py-3 sm:grid-cols-[2.5rem_3.5rem_1fr_auto] sm:gap-4"
    >
      <span className="font-serif text-2xl font-medium text-line-strong transition-colors group-hover:text-accent sm:text-3xl">
        {String(rank).padStart(2, "0")}
      </span>

      <div className="relative aspect-[2/3] w-12 overflow-hidden border border-line bg-surface sm:w-14">
        <Image
          src={story.coverImageUrl}
          alt=""
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          {t(typeLabelKey[story.storyType])} · {story.chapterCount}{" "}
          {t("common.chapters")}
        </p>
        <h3 className="mt-0.5 truncate font-serif text-base font-semibold text-ink transition-colors group-hover:text-accent">
          {story.title}
        </h3>
        <p className="truncate text-xs text-muted">{story.author.displayName}</p>
      </div>

      <div className="hidden text-right sm:block">
        <p className="font-serif text-sm text-ink">{formatNumber(story.viewCount)}</p>
        <p className="text-[10px] uppercase tracking-[0.12em] text-muted">
          {t("common.views")}
        </p>
      </div>
    </Link>
  );
}
