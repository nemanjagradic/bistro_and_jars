import type { Metadata } from "next";
import { GallerySection } from "../../components/gallery-section";
import {
  getFullTiles,
  getGalleryPhotos,
  getOpenerPhoto,
} from "../../lib/gallery";

export const metadata: Metadata = {
  title: "Galerija — Bistro & Jars Coffee Bar",
  description: "Kafa te dovede. Atmosfera te zadrži.",
};

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
