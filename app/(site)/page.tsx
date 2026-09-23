import { AboutSection } from "../components/about-section";
import { ContactSection } from "../components/contact-section";
import { GalleryTeaser } from "../components/gallery-teaser";
import { HeroEntrance } from "../components/hero-entrance";
import { MenuTeaser } from "../components/menu-teaser";
import { ShakeProcess } from "../components/shake-process";
import { Testimonials } from "../components/testimonials";
import { getHomeTiles } from "../lib/gallery";
import { getHomeGroups } from "../lib/menu";
import { getReviews } from "../lib/reviews";

export default function Home() {
  return (
    <main>
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
