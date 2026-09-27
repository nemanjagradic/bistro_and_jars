import type { Metadata } from "next";
import { ContactSection } from "../../components/contact-section";
import { pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt — Bistro & Jars Coffee Bar",
  description:
    "Pronađi nas na adresi Pariske komune 59, na Novom Beogradu. Svaki dan 07:30–23:30.",
});

export default function ContactPage() {
  return (
    <main>
      <ContactSection pageMode />
    </main>
  );
}
