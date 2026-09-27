import type { Metadata } from "next";
import { NotFoundContent } from "./components/not-found-content";
import { pageMetadata } from "./lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Stranica nije pronađena — Bistro & Jars Coffee Bar",
  description:
    "Ova stranica ne postoji. Adresa koju ste otvorili nije deo našeg sajta. Vratite se na početnu stranicu.",
  robots: { index: false },
});

export default function NotFound() {
  return <NotFoundContent />;
}
