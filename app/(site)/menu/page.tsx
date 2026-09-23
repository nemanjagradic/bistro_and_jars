import type { Metadata } from "next";
import { MenuSection } from "../../components/menu-section";

export const metadata: Metadata = {
  title: "Meni — Bistro & Jars Coffee Bar",
  description: "Kafa te dovede. Atmosfera te zadrži.",
};

export default function MenuPage() {
  return (
    <main className="site-page site-page--menu bg-anthracite">
      <MenuSection />
    </main>
  );
}
