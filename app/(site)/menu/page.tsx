import type { Metadata } from "next";
import { MenuSection } from "../../components/menu-section";
import { metadataBase, pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Meni — Bistro & Jars Coffee Bar",
  description:
    "Kafa, piće i slatke tegle. Od espressa do koktela, od čaja do piva i slatke tegle kad poželiš nešto zaista slatko.",
});

const menuJsonLd = {
  "@context": "https://schema.org",
  "@type": "Menu",
  url: new URL("/menu", metadataBase).href,
  inLanguage: "sr",
};

export default function MenuPage() {
  return (
    <main className="site-page site-page--menu bg-anthracite">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(menuJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <MenuSection />
    </main>
  );
}
