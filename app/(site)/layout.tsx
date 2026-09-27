import { ScrollMemory } from "../components/scroll-memory";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <ScrollMemory />
      {children}
      <SiteFooter />
    </>
  );
}
