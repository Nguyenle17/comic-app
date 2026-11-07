"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/Button";
import { formatNumber } from "@/lib/utils";
import { useT } from "@/features/preferences/i18n";
import type { Story } from "@/features/story/types/story";

const typeLabelKey: Record<Story["storyType"], string> = {
  text: "story.text",
  comic: "story.comic",
  original: "story.original",
};

export function HeroBanner({ story }: { story: Story }) {
  const t = useT();
  if (!story) return null;

  return (
    <section className="border-y border-line py-8 sm:py-12">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_280px] lg:gap-14">
        <div className="order-2 lg:order-1">
          <div className="flex flex-wrap items-center gap-3 rule-label">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            <span>{t("story.featured")}</span>
            <span className="text-line-strong" aria-hidden="true">/</span>
            <Badge variant={story.storyType}>
              {t(typeLabelKey[story.storyType])}
            </Badge>
          </div>

          <Link
            href={`/truyen/${story.slug}`}
            className="mt-5 block text-balance font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-ink transition-colors hover:text-accent sm:text-5xl lg:text-6xl"
          >
            {story.title}
          </Link>

          <p className="mt-4 text-sm text-ink-soft">
            {t("story.author")}{" "}
            <span className="font-medium text-ink">{story.author.displayName}</span>
            {story.categories?.length ? (
              <span className="text-muted">
                {" "}
                · {story.categories.slice(0, 3).map((c) => c.name).join(", ")}
              </span>
            ) : null}
          </p>

          <p className="mt-5 max-w-2xl text-pretty text-sm leading-7 text-ink-soft">
            {story.description}
          </p>

          <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-5">
            <div>
              <dt className="rule-label">{t("common.views")}</dt>
              <dd className="mt-1 font-serif text-lg tabular-nums text-ink">
                {formatNumber(story.viewCount)}
              </dd>
            </div>
            <div>
              <dt className="rule-label">{t("common.chapters")}</dt>
              <dd className="mt-1 font-serif text-lg tabular-nums text-ink">
                {story.chapterCount}
              </dd>
            </div>
            <div>
              <dt className="rule-label">{t("common.ratings")}</dt>
              <dd className="mt-1 font-serif text-lg tabular-nums text-ink">
                {story.ratingAvg.toFixed(1)}
                <span className="ml-1 font-sans text-xs text-muted">
                  ({formatNumber(story.ratingCount)})
                </span>
              </dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={`/truyen/${story.slug}/chuong-1`}
              className={buttonStyles({ variant: "accent", className: "h-11 gap-2" })}
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M6.5 4.5a1 1 0 011.54-.84l8 5.5a1 1 0 010 1.68l-8 5.5A1 1 0 016.5 15.5v-11z" />
              </svg>
              {t("story.readChapter1")}
            </Link>
            <Link
              href={`/truyen/${story.slug}`}
              className="inline-flex h-11 items-center rounded-sm border border-line px-5 text-sm font-medium text-ink transition-colors hover:border-line-strong hover:bg-surface"
            >
              {t("story.viewDetails")}
            </Link>
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-[210px] sm:max-w-[240px] lg:order-2 lg:max-w-none">
          <div className="relative">
            <div
              className="absolute -left-3 -top-3 h-full w-full border border-accent/40"
              aria-hidden="true"
            />
            <Link
              href={`/truyen/${story.slug}`}
              className="group relative block aspect-[2/3] overflow-hidden border border-line bg-surface"
            >
              <Image
                src={story.coverImageUrl}
                alt={story.title}
                fill
                sizes="(max-width: 640px) 210px, 280px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                priority
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
