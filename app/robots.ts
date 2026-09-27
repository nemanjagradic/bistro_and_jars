import type { MetadataRoute } from "next";
import { metadataBase, SITE_PUBLIC } from "./lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(SITE_PUBLIC ? { allow: "/" } : { disallow: "/" }),
    },
    sitemap: new URL("/sitemap.xml", metadataBase).href,
  };
}
