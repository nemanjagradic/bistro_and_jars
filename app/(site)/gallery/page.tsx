import type { Metadata } from "next";
import { GallerySection } from "../../components/gallery-section";
import {
  getFullTiles,
  getGalleryPhotos,
  getOpenerPhoto,
} from "../../lib/gallery";
import { pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Galerija — Bistro & Jars Coffee Bar",
  description: "Neki trenuci jednostavno bolje izgledaju uživo.",
});

export default function GalleryPage() {
  return (
    <main>
      <GallerySection
        opener={getOpenerPhoto()}
        tiles={getFullTiles()}
        lightboxPhotos={getGalleryPhotos()}
      />
    </main>
  );
}
