"use client";

import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "./language-provider";

export function NotFoundContent() {
  const { copy } = useLanguage();

  return (
    <main className="not-found-page">
      <LanguageSwitcher className="not-found-lang" />

      <div className="not-found-inner not-found-enter">
        <p className="not-found-code" aria-hidden>
          {copy.notFoundCode}
        </p>

        <picture className="not-found-brand">
          <source
            media="(min-width: 640px)"
            srcSet="/brand/wordmark.png"
            width={2250}
            height={272}
          />
          <img
            src="/brand/wordmark-stacked.png"
            alt="Bistro & Jars Coffee Bar"
            width={1315}
            height={627}
            className="not-found-logo"
            decoding="async"
          />
        </picture>

        <h1 className="not-found-heading">{copy.notFoundHeading}</h1>
        <p className="not-found-body">{copy.notFoundBody}</p>

        <Link href="/" className="site-cta-pill site-cta-pill-fill not-found-cta">
          {copy.notFoundHomeCta}
        </Link>
      </div>
    </main>
  );
}
