"use client";

import Image from "next/image";
import Link from "next/link";
import {
  GALLERY_ALT,
  photoFocusStyle,
  tileSizes,
  type GalleryPhoto,
} from "../lib/gallery";

type GalleryGridProps = {
  photos: GalleryPhoto[];
} & (
  | { href: string; onOpen?: never }
  | { href?: never; onOpen: (photo: GalleryPhoto) => void }
);

export function GalleryGrid({ photos, href, onOpen }: GalleryGridProps) {
  return (
    <div className="gallery-grid">
      {photos.map((photo) => {
        const image = (
          <Image
            src={photo.src}
            alt={GALLERY_ALT}
            fill
            sizes={tileSizes(photo.span)}
            className="gallery-photo gallery-photo--cover"
            style={photoFocusStyle(photo.focus)}
          />
        );

        return (
          <div
            key={photo.id}
            className={`gallery-tile gallery-tile--${photo.span}`}
          >
            {href ? (
              <Link href={href} className="gallery-tile-hit">
                {image}
              </Link>
            ) : (
              <button
                type="button"
                className="gallery-tile-hit"
                onClick={() => onOpen?.(photo)}
              >
                {image}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
