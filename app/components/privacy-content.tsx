"use client";

import Link from "next/link";
import { mailtoLink, telLink, VENUE } from "../lib/contact";
import {
  COMMISSIONER_URL,
  PRIVACY_COPY,
  PRIVACY_LAST_UPDATED,
  PRIVACY_LAST_UPDATED_ISO,
  type PrivacySection,
} from "../lib/privacy-copy";
import { useLanguage } from "./language-provider";

function SectionBody({ section }: { section: PrivacySection }) {
  if (!section.list) {
    return section.paragraphs.map((paragraph) => (
      <p key={paragraph}>{paragraph}</p>
    ));
  }

  const [lead, ...rest] = section.paragraphs;

  return (
    <>
      {lead ? <p>{lead}</p> : null}
      <ul className="privacy-list">
        {section.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {rest.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  );
}

export function PrivacyContent() {
  const { locale } = useLanguage();
  const copy = PRIVACY_COPY[locale];

  return (
    <main className="site-page privacy-page bg-anthracite">
      <div className="privacy-page-inner">
        <header className="privacy-header">
          <p className="site-kicker">{copy.kicker}</p>
          <h1 className="privacy-title">{copy.title}</h1>
          <p className="privacy-updated">
            {copy.lastUpdatedPrefix}{" "}
            <time dateTime={PRIVACY_LAST_UPDATED_ISO}>
              {PRIVACY_LAST_UPDATED[locale]}
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
              aria-labelledby={`privacy-${section.id}-heading`}
            >
              <h2
                id={`privacy-${section.id}-heading`}
                className="privacy-section-title"
              >
                {section.title}
              </h2>
              <hr className="privacy-divider" />
              <SectionBody section={section} />
            </section>
          ))}

          <section
            id="rights"
            className="privacy-section"
            aria-labelledby="privacy-rights-heading"
          >
            <h2 id="privacy-rights-heading" className="privacy-section-title">
              {copy.rightsTitle}
            </h2>
            <hr className="privacy-divider" />
            <p>{copy.rightsIntro}</p>
            <p>
              {copy.commissionerBefore}
              <a
                href={COMMISSIONER_URL[locale]}
                className="privacy-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.commissionerName}
              </a>.
            </p>
          </section>

          <section
            id="contact"
            className="privacy-section"
            aria-labelledby="privacy-contact-heading"
          >
            <h2 id="privacy-contact-heading" className="privacy-section-title">
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
