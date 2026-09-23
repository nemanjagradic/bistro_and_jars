"use client";

import Link from "next/link";
import type { MenuHomeGroup } from "../lib/menu";
import { ScrollReveal } from "./scroll-reveal";
import { useLanguage } from "./language-provider";

type MenuTeaserProps = {
  groups: MenuHomeGroup[];
};

export function MenuTeaser({ groups }: MenuTeaserProps) {
  const { copy, locale } = useLanguage();

  return (
    <section
      className="gold-rule bg-anthracite px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28"
      aria-labelledby="menu-teaser-heading"
    >
      <ScrollReveal className="mx-auto max-w-6xl text-center">
        <h2
          id="menu-teaser-heading"
          className="font-heading text-3xl font-medium leading-tight text-ivory sm:text-4xl md:text-[2.75rem] md:leading-tight"
        >
          {copy.menuTeaserHeading}
        </h2>

        <ul className="mt-10 flex flex-wrap justify-center gap-3 sm:mt-12 sm:gap-3.5">
          {groups.map((group) => (
            <li key={group.order} className="menu-home-tab">
              {locale === "en" ? group.en : group.sr}
            </li>
          ))}
        </ul>

        <p className="mt-10 sm:mt-12">
          <Link href="/menu" className="site-cta-pill site-cta-pill-fill">
            {copy.viewFullMenu}
          </Link>
        </p>
      </ScrollReveal>
    </section>
  );
}
