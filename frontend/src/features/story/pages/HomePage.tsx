"use client";

import Image from "next/image";
import Link from "next/link";
import { HeroBanner } from "@/features/story/components/HeroBanner";
import { RankedStoryRow } from "@/features/story/components/RankedStoryRow";
import { SectionHeader } from "@/features/story/components/SectionHeader";
import { STORY_CATEGORIES } from "@/features/story/constants";
import { useLanguage, useT } from "@/features/preferences/i18n";
import { useHomeStories } from "@/features/story/hooks/useHomeStories";
import { buttonStyles } from "@/components/ui/Button";
import { formatNumber } from "@/lib/utils";
import type { Story, StoryType } from "@/features/story/types/story";

const TYPE_FILTERS: { key: string; value: StoryType | "all" }[] = [
  { key: "home.all", value: "all" },
  { key: "home.textStories", value: "text" },
  { key: "home.comics", value: "comic" },
  { key: "home.originalVi", value: "original" },
];

export default function HomePage() {
  const t = useT();
  const language = useLanguage();
  const { hero, hotStories, updatedStories, originalStories } =
    useHomeStories();

  return (
    <main className="shell">
      <HeroBanner story={hero} />

      <nav aria-label={t("home.categoriesLabel")} className="mt-6 border-b border-line">
        <div className="flex items-center gap-7 overflow-x-auto scrollbar-hide">
          {TYPE_FILTERS.map((filter, index) => (
            <Link
              key={filter.value}
              href={filter.value === "all" ? "/" : `/danh-sach?loai=${filter.value}`}
              aria-current={index === 0 ? "page" : undefined}
              className={`-mb-px inline-flex shrink-0 items-center border-b-2 pb-3 text-sm font-medium transition-colors ${
                index === 0
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-soft hover:border-line-strong hover:text-ink"
              }`}
            >
              {t(filter.key)}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-4 flex items-center gap-3">
        <span className="shrink-0 rule-label">{t("home.categoriesLabel")}</span>
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {STORY_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/the-loai/${category.slug}`}
              className="chip"
            >
              {language === "en" ? category.nameEn : category.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
        <section aria-labelledby="hot-heading">
          <div id="hot-heading">
            <SectionHeader
              index="01"
              title={t("home.hotTitle")}
              subtitle={t("home.hotSubtitle")}
              href="/bxh"
              actionLabel={t("home.viewAllRankings")}
            />
          </div>
          <div>
            {hotStories.map((story, index) => (
              <RankedStoryRow key={story.id} story={story} rank={index + 1} />
            ))}
          </div>
        </section>

        <aside aria-labelledby="latest-heading" className="lg:border-l lg:border-line lg:pl-8">
          <div id="latest-heading">
            <SectionHeader
              index="02"
              title={t("home.latestTitle")}
              subtitle={t("home.latestSubtitle")}
            />
          </div>
          <div className="divide-y divide-line border-b border-line">
            {updatedStories.slice(0, 5).map((story) => (
              <Link
                key={story.id}
                href={`/truyen/${story.slug}`}
                className="group flex gap-3 py-3"
              >
                <div className="relative aspect-[2/3] w-11 shrink-0 overflow-hidden border border-line bg-surface">
                  <Image
                    src={story.coverImageUrl}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 font-serif text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
                    {story.title}
                  </h3>
                  <p className="mt-0.5 truncate text-[11px] text-muted">
                    {story.author.displayName}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted">
                    {story.chapterCount} {t("common.chapters")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/danh-sach?sort=updated"
            className="mt-3 inline-flex items-center border-b border-line-strong pb-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            {t("section.viewAll")}
          </Link>
        </aside>
      </div>

      <section aria-labelledby="original-heading" className="mt-16">
        <div id="original-heading">
          <SectionHeader
            index="03"
            title={t("home.originalTitle")}
            subtitle={t("home.originalSubtitle")}
            href="/danh-sach?loai=original"
          />
        </div>
        {originalStories.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {originalStories.slice(0, 2).map((story) => (
              <OriginalFeature key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-line-strong bg-surface px-6 py-10 text-center">
            <p className="mx-auto max-w-md text-sm leading-7 text-ink-soft">
              {t("home.emptyOriginal")}
            </p>
            <Link
              href="/become-author"
              className={buttonStyles({ variant: "accent", className: "mt-5" })}
            >
              {t("home.emptyCta")}
            </Link>
          </div>
        )}
      </section>

      <section className="my-16 bg-ink px-6 py-10 text-paper sm:px-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/60">
              {t("home.ctaBadge")}
            </p>
            <h2 className="mt-3 max-w-md text-balance font-serif text-3xl font-semibold leading-tight sm:text-4xl">
              {t("home.ctaTitle")}
            </h2>
            <p className="mt-4 max-w-md text-pretty text-sm leading-7 text-paper/70">
              {t("home.ctaDesc")}
            </p>
          </div>
          <div className="flex flex-col justify-between gap-6">
            <ol className="divide-y divide-paper/15 border-y border-paper/15 text-sm">
              <li className="flex items-baseline gap-4 py-3">
                <span className="font-serif text-lg tabular-nums text-accent-soft">01</span>
                <span>{t("home.ctaStepWrite")}</span>
              </li>
              <li className="flex items-baseline gap-4 py-3">
                <span className="font-serif text-lg tabular-nums text-accent-soft">02</span>
                <span>{t("home.ctaStepPublish")}</span>
              </li>
              <li className="flex items-baseline gap-4 py-3">
                <span className="font-serif text-lg tabular-nums text-accent-soft">03</span>
                <span>{t("home.ctaStepEarn")}</span>
              </li>
            </ol>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/author/stories/new"
                className={buttonStyles({ variant: "accent", className: "h-11" })}
              >
                {t("home.ctaStart")}
              </Link>
              <Link
                href="/tac-gia/huong-dan"
                className="inline-flex h-11 items-center rounded-sm border border-paper/25 px-5 text-sm font-medium text-paper transition-colors hover:border-paper/60"
              >
                {t("home.ctaLearn")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function OriginalFeature({ story }: { story: Story }) {
  const t = useT();
  return (
    <Link
      href={`/truyen/${story.slug}`}
      className="group grid grid-cols-[88px_1fr] gap-4 border border-line bg-surface p-4 transition-colors hover:border-line-strong"
    >
      <div className="relative aspect-[2/3] overflow-hidden border border-line bg-paper">
        <Image
          src={story.coverImageUrl}
          alt=""
          fill
          sizes="96px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="min-w-0">
        <p className="rule-label">{t("story.original")}</p>
        <h3 className="mt-1 font-serif text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
          {story.title}
        </h3>
        <p className="mt-1 text-xs text-muted">{story.author.displayName}</p>
        <p className="mt-2 line-clamp-2 text-xs leading-6 text-ink-soft">
          {story.description}
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-muted">
          {story.chapterCount} {t("common.chapters")} ·{" "}
          {formatNumber(story.viewCount)} {t("common.views")}
        </p>
      </div>
    </Link>
  );
}
