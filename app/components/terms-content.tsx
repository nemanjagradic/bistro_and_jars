"use client";

import Link from "next/link";
import { mailtoLink, telLink, VENUE } from "../lib/contact";
import {
  TERMS_COPY,
  TERMS_LAST_UPDATED,
  TERMS_LAST_UPDATED_ISO,
} from "../lib/terms-copy";
import { useLanguage } from "./language-provider";

export function TermsContent() {
  const { locale } = useLanguage();
  const copy = TERMS_COPY[locale];

  return (
    <main className="site-page privacy-page bg-anthracite">
      <div className="privacy-page-inner">
        <header className="privacy-header">
          <p className="site-kicker">{copy.kicker}</p>
          <h1 className="privacy-title">{copy.title}</h1>
          <p className="privacy-updated">
            {copy.lastUpdatedPrefix}{" "}
            <time dateTime={TERMS_LAST_UPDATED_ISO}>
              {TERMS_LAST_UPDATED[locale]}
            </time>
          </p>
          <p className="privacy-intro">{copy.intro}</p>
        </header>

        <article className="privacy-body">
          {copy.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="privacy-section"
              aria-labelledby={`terms-${section.id}-heading`}
            >
              <h2
                id={`terms-${section.id}-heading`}
                className="privacy-section-title"
              >
                {section.title}
              </h2>
              <hr className="privacy-divider" />
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <section
            id="privacy"
            className="privacy-section"
            aria-labelledby="terms-privacy-heading"
          >
            <h2 id="terms-privacy-heading" className="privacy-section-title">
              {copy.privacyTitle}
            </h2>
            <hr className="privacy-divider" />
            <p>
              {copy.privacyBefore}
              <Link href="/privacy" className="privacy-link">
                {copy.privacyLink}
              </Link>.
            </p>
          </section>

          <section
            id="contact"
            className="privacy-section"
            aria-labelledby="terms-contact-heading"
          >
            <h2 id="terms-contact-heading" className="privacy-section-title">
              {copy.contactTitle}
            </h2>
            <hr className="privacy-divider" />
            <p>
              {copy.contactIntro}{" "}
              <a href={telLink()} className="privacy-link">
                {VENUE.phoneDisplay}
              </a>{" "}
              {copy.contactOr}{" "}
              <a href={mailtoLink()} className="privacy-link">
                {VENUE.email}
              </a>.
            </p>
          </section>
        </article>

        <p className="privacy-back">
          <Link href="/contact" className="privacy-link">
            {copy.backToContact}
          </Link>
        </p>
      </div>
    </main>
  );
}
