import type { Metadata } from "next";
import { PrivacyContent } from "../../components/privacy-content";
import { pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Politika privatnosti — Bistro & Jars Coffee Bar",
  description:
    "Kako Bistro & Jars Coffee Bar prikuplja i koristi podatke sa ovog sajta.",
});

export default function PrivacyPage() {
  return <PrivacyContent />;
}
