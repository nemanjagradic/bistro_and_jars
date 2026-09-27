import type { MetadataRoute } from "next";
import { metadataBase } from "./lib/seo";

const PATHS = ["/", "/gallery", "/menu", "/contact", "/privacy", "/terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: new URL(path, metadataBase).href,
  }));
}
