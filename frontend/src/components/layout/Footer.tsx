"use client";

import Link from "next/link";
import { useT } from "@/features/preferences/i18n";

export function Footer() {
  const t = useT();

  const columns = [
    {
      title: t("footer.explore"),
      links: [
        { href: "/", label: t("footer.home") },
        { href: "/bxh", label: t("footer.rankings") },
        { href: "/the-loai", label: t("footer.allCategories") },
        { href: "/danh-sach?loai=comic", label: t("footer.newComics") },
      ],
    },
    {
      title: t("footer.creator"),
      links: [
        { href: "/author/stories/new", label: t("common.createStory") },
        { href: "/danh-sach?loai=original", label: t("footer.originalStories") },
        { href: "/tac-gia/huong-dan", label: t("footer.comicRules") },
        { href: "/community", label: t("footer.community") },
      ],
    },
    {
      title: t("footer.info"),
      links: [
        { href: "/dieu-khoan", label: t("footer.terms") },
        { href: "/chinh-sach", label: t("footer.privacy") },
        { href: "/ban-quyen", label: t("footer.copyright") },
        { href: "/lien-he", label: t("footer.contact") },
      ],
    },
  ];

  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center bg-accent font-serif text-base font-semibold text-surface">
                N
              </span>
              <span className="font-serif text-xl font-semibold tracking-tight text-ink">
                NStories
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-xs leading-6 text-ink-soft">
              {t("footer.tagline")}
            </p>
            <p className="mt-5 text-[11px] text-muted">
              {t("footer.rights", { year: new Date().getFullYear() })}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-xs text-ink-soft">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-accent">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-line pt-6 text-[11px] leading-6 text-muted">
          {t("footer.disclaimer")}
        </p>
      </div>
    </footer>
  );
}
