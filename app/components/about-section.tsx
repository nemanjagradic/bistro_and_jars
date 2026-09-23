"use client";

import { HOME_COPY } from "../lib/home-copy";
import { ScrollReveal } from "./scroll-reveal";
import { useLanguage } from "./language-provider";

export function AboutSection() {
  const { locale } = useLanguage();
  const copy = HOME_COPY[locale];

  return (
    <section className="gold-rule bg-anthracite px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28">
      <ScrollReveal className="mx-auto grid max-w-6xl items-start gap-x-16 gap-y-5 md:grid-cols-12">
        <p className="site-kicker md:col-span-5">{copy.aboutKicker}</p>
        <h2 className="font-heading text-3xl font-medium leading-tight text-ivory sm:text-4xl md:col-span-5 md:col-start-1 md:text-[2.75rem] md:leading-tight">
          {copy.aboutHeading}
        </h2>
        <div className="mt-4 md:col-span-7 md:col-start-6 md:row-start-2 md:mt-0">
          <div className="space-y-5 text-base leading-relaxed text-ivory/75 sm:text-lg">
            {copy.aboutParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-8 text-sm leading-relaxed text-ivory/90 sm:mt-10 sm:text-base">
            {copy.aboutLocation}
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
