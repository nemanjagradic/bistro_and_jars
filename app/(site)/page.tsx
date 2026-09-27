import { AboutSection } from "../components/about-section";
import { ContactSection } from "../components/contact-section";
import { GalleryTeaser } from "../components/gallery-teaser";
import { HeroEntrance } from "../components/hero-entrance";
import { MenuTeaser } from "../components/menu-teaser";
import { ShakeProcess } from "../components/shake-process";
import { Testimonials } from "../components/testimonials";
import { instagramLink, VENUE } from "../lib/contact";
import { getHomeTiles } from "../lib/gallery";
import { getHomeGroups } from "../lib/menu";
import { getReviews } from "../lib/reviews";
import { metadataBase, SITE_NAME } from "../lib/seo";

const cafeJsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: SITE_NAME,
  url: metadataBase.href,
  telephone: VENUE.phoneE164,
  address: {
    "@type": "PostalAddress",
    streetAddress: VENUE.addressLine1,
    postalCode: "11070",
    addressLocality: "Beograd",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "07:30",
    closes: "23:30",
  },
  sameAs: instagramLink(),
  hasMenu: new URL("/menu", metadataBase).href,
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cafeJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HeroEntrance />

      <AboutSection />

      <ShakeProcess />

      <GalleryTeaser photos={getHomeTiles()} />

      <MenuTeaser groups={getHomeGroups()} />

      <Testimonials reviews={getReviews()} />

      <ContactSection id="contact" />
    </main>
  );
}
