"use client";

import Image from "next/image";
import Link from "next/link";
import { GALLERY_ALT, photoFocusStyle, type GalleryPhoto } from "../lib/gallery";
import { useLanguage } from "./language-provider";

type GalleryOpenerProps = {
  photo: GalleryPhoto;
  headingAs?: "h1" | "h2";
  priority?: boolean;
} & ({ href: string; onOpen?: never } | { href?: never; onOpen: () => void });

export function GalleryOpener({
  photo,
  headingAs = "h2",
  priority = true,
  href,
  onOpen,
}: GalleryOpenerProps) {
  const { copy } = useLanguage();
  const Heading = headingAs;

  const frame = (
    <>
      <Image
        src={photo.src}
        alt={GALLERY_ALT}
        fill
        priority={priority}
        sizes="100vw"
        className="gallery-photo gallery-photo--cover"
        style={photoFocusStyle(photo.focus)}
      />
      <div className="gallery-opener-veil" aria-hidden />
      <div className="gallery-opener-copy">
        <p className="site-kicker">{copy.gallery}</p>
        <Heading className="gallery-heading">{copy.galleryLine}</Heading>
      </div>
    </>
  );

  return (
    <div className="gallery-opener">
      {href ? (
        <Link href={href} className="gallery-opener-hit">
          {frame}
        </Link>
      ) : (
        <button type="button" className="gallery-opener-hit" onClick={onOpen}>
          {frame}
        </button>
      )}
    </div>
  );
}
