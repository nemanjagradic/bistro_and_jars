"use client";

import { useCallback, useState } from "react";
import type { GalleryPhoto } from "../lib/gallery";
import { GalleryGrid } from "./gallery-grid";
import { GalleryLightbox } from "./gallery-lightbox";
import { GalleryOpener } from "./gallery-opener";
import { ScrollReveal } from "./scroll-reveal";
import { useLanguage } from "./language-provider";

type GallerySectionProps = {
  opener: GalleryPhoto;
  tiles: GalleryPhoto[];
  lightboxPhotos: GalleryPhoto[];
};

export function GallerySection({
  opener,
  tiles,
  lightboxPhotos,
}: GallerySectionProps) {
  const { copy } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openAt = useCallback(
    (photo: GalleryPhoto) => {
      const next = lightboxPhotos.findIndex((item) => item.id === photo.id);
      if (next >= 0) setLightboxIndex(next);
    },
    [lightboxPhotos],
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  return (
    <section className="gallery-section" aria-label={copy.gallery}>
      <ScrollReveal>
        <GalleryOpener
          photo={opener}
          headingAs="h1"
          onOpen={() => openAt(opener)}
        />
      </ScrollReveal>

      <ScrollReveal>
        <GalleryGrid photos={tiles} onOpen={openAt} />
      </ScrollReveal>

      {lightboxIndex !== null ? (
        <GalleryLightbox
          photos={lightboxPhotos}
          index={lightboxIndex}
          onClose={closeLightbox}
          onIndexChange={setLightboxIndex}
        />
      ) : null}
    </section>
  );
}
