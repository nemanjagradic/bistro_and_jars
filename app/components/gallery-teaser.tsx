"use client";

import Image from "next/image";
import Link from "next/link";
import {
  GALLERY_ALT,
  photoFocusStyle,
  teaserSizes,
  type GalleryPhoto,
} from "../lib/gallery";
import { ScrollReveal } from "./scroll-reveal";
import { useLanguage } from "./language-provider";

type GalleryTeaserProps = {
  photos: GalleryPhoto[];
};

export function GalleryTeaser({ photos }: GalleryTeaserProps) {
  const { copy } = useLanguage();

  return (
    <section
      className="gold-rule bg-anthracite px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28"
      aria-labelledby="gallery-teaser-heading"
    >
      <ScrollReveal className="mx-auto max-w-6xl">
        <p className="site-kicker">{copy.gallery}</p>
        <h2
          id="gallery-teaser-heading"
          className="mt-5 font-heading text-3xl font-medium italic leading-tight text-ivory sm:text-4xl md:text-[2.75rem] md:leading-tight"
        >
          {copy.galleryLine}
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-1.5 sm:mt-12 md:grid-cols-3 md:gap-2">
          {photos.map((photo) => (
            <Link
              key={photo.id}
              href="/gallery"
              aria-label={GALLERY_ALT}
              className="group relative block aspect-[4/3] overflow-hidden bg-anthracite focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-3 focus-visible:outline-gold"
            >
              <Image
                src={photo.src}
                alt={GALLERY_ALT}
                fill
                sizes={teaserSizes()}
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
                style={photoFocusStyle(photo.focus)}
              />
            </Link>
          ))}
        </div>

        <p className="mt-8 text-left sm:mt-10">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 font-sans text-sm text-gold no-underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold sm:text-base"
          >
            {copy.viewFullGallery}
            <svg
              className="h-3.5 w-3.5 translate-x-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M2.5 8h11M9.5 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </p>
      </ScrollReveal>
    </section>
  );
}
