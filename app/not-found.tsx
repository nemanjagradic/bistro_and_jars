import type { Metadata } from "next";
import { NotFoundContent } from "./components/not-found-content";

export const metadata: Metadata = {
  title: "Stranica nije pronađena — Bistro & Jars Coffee Bar",
  description:
    "Tražena stranica ne postoji. Vratite se na početnu stranicu Bistro & Jars Coffee Bar.",
};

export default function NotFound() {
  return <NotFoundContent />;
}
