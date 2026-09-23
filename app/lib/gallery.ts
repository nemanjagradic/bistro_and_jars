import manifest from "./gallery.json";

export const GALLERY_ALT = "Bistro & Jars Coffee Bar";

export type GallerySpan = "wide" | "tall" | "normal" | "large";

export type GalleryPhoto = {
  id: string;
  src: string;
  span: GallerySpan;
  home?: boolean;
  opener?: boolean;
  /** CSS object-position, e.g. "center 62%" or "70% 45%" */
  focus?: string;
};

const photos = manifest as GalleryPhoto[];

export function getGalleryPhotos(): GalleryPhoto[] {
  return photos;
}

export function getOpenerPhoto(): GalleryPhoto {
  const opener = photos.find((photo) => photo.opener);
  if (!opener) {
    throw new Error("gallery.json is missing an opener photo");
  }
  return opener;
}

export function getHomeTiles(): GalleryPhoto[] {
  return photos.filter((photo) => photo.home);
}

export function getFullTiles(): GalleryPhoto[] {
  return photos.filter((photo) => !photo.opener);
}

export function tileSizes(span: GallerySpan): string {
  if (span === "wide" || span === "large") {
    return "(max-width: 767px) 100vw, 50vw";
  }
  return "(max-width: 767px) 50vw, 25vw";
}

export function teaserSizes(): string {
  return "(max-width: 767px) 50vw, (max-width: 1152px) 33vw, 384px";
}

export function photoFocusStyle(
  focus?: string,
): { objectPosition: string } | undefined {
  return focus ? { objectPosition: focus } : undefined;
}
