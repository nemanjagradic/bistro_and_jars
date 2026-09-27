import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { LanguageProvider } from "./components/language-provider";
import { metadataBase, pageMetadata } from "./lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

const homeTitle = "Bistro & Jars Coffee Bar — Novi Beograd";

export const metadata: Metadata = {
  metadataBase,
  ...pageMetadata({
    title: homeTitle,
    description:
      "Kafa te dovede. Atmosfera te zadrži. Uz slatke tegle, dobro društvo i sve što Bistro & Jars čini posebnim.",
  }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sr"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-ivory">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
