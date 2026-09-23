"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../lib/chrome-copy";
import { instagramLink, mailtoLink, VENUE } from "../lib/contact";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "./language-provider";

function InstagramIcon() {
  return (
    <svg
      className="site-footer-instagram-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  const { copy } = useLanguage();

  return (
    <footer className="site-footer bg-anthracite">
      <div className="site-footer-inner">
        <Link href="/" className="site-footer-logo">
          <Image
            src="/brand/logo.png"
            alt="Bistro & Jars Coffee Bar"
            width={975}
            height={409}
            sizes="(min-width: 640px) 13rem, 60vw"
          />
        </Link>

        <p className="site-footer-meta">
          <span>
            {VENUE.addressLine1}, {VENUE.addressLine2}
          </span>
          <span className="site-footer-sep" aria-hidden>
            ·
          </span>
          <a href={mailtoLink()}>{VENUE.email}</a>
        </p>

        <nav className="site-footer-nav" aria-label="Footer">
          {NAV_LINKS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`site-footer-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {copy[item.key]}
              </Link>
            );
          })}
        </nav>

        <a
          href={instagramLink()}
          className="site-footer-instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon />
          <span>@{VENUE.instagramHandle}</span>
        </a>

        <LanguageSwitcher className="site-footer-lang" />

        <p className="site-footer-copy">{copy.footerCopyright}</p>
      </div>
    </footer>
  );
}
