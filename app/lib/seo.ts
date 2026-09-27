import type { Metadata } from "next";

export const metadataBase = new URL("https://bistroandjars.com");

/** Flip to true when the site should be crawled. */
export const SITE_PUBLIC = true;

export const SITE_NAME = "Bistro & Jars Coffee Bar";

type PageMetadataInput = {
  title: string;
  description: string;
  robots?: Metadata["robots"];
};

export function pageMetadata({
  title,
  description,
  robots,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: "sr_RS",
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(robots ? { robots } : {}),
  };
}
