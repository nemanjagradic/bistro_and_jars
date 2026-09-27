import type { Metadata } from "next";
import { TermsContent } from "../../components/terms-content";
import { pageMetadata } from "../../lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Uslovi korišćenja — Bistro & Jars Coffee Bar",
  description: "Uslovi korišćenja sajta Bistro & Jars Coffee Bar.",
});

export default function TermsPage() {
  return <TermsContent />;
}
