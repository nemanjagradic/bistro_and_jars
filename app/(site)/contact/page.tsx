import type { Metadata } from "next";
import { ContactSection } from "../../components/contact-section";

export const metadata: Metadata = {
  title: "Kontakt — Bistro & Jars Coffee Bar",
  description: "Kafa te dovede. Atmosfera te zadrži.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactSection pageMode />
    </main>
  );
}
