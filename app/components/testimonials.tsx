"use client";

import { forwardRef, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  GOOGLE_BUSINESS_PROFILE_URL,
  type Review,
} from "../lib/reviews";
import { MOBILE_QUERY } from "../lib/scroll-video";
import { ScrollReveal } from "./scroll-reveal";
import { useLanguage } from "./language-provider";

type TestimonialsProps = {
  reviews: Review[];
};

const DESKTOP_PAGE_SIZE = 3;

function StarRating({ stars, label }: { stars: number; label: string }) {
  return (
    <div className="testimonials-stars" role="img" aria-label={label}>
      {Array.from({ length: stars }, (_, index) => (
        <svg
          key={index}
          className="testimonials-star"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.9l-4.94 2.81.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

const ReviewCard = forwardRef<
  HTMLElement,
  { review: Review; starsLabel: string }
>(function ReviewCard({ review, starsLabel }, ref) {
  return (
    <article
      ref={ref}
      className="testimonials-card"
      data-review-id={review.id}
    >
      <span className="testimonials-quote-mark" aria-hidden>
        “
      </span>
      <blockquote className="testimonials-quote">
        <p>{review.text}</p>
      </blockquote>
      <div className="testimonials-rule" aria-hidden />
      <footer className="testimonials-meta">
        <cite className="testimonials-name not-italic">{review.name}</cite>
        <StarRating stars={review.stars} label={starsLabel} />
      </footer>
    </article>
  );
});

function CarouselArrow({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`testimonials-arrow testimonials-arrow-${direction}`}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d={direction === "prev" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"}
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function Testimonials({ reviews }: TestimonialsProps) {
  const { copy, locale } = useLanguage();
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [desktopPage, setDesktopPage] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const desktopPageCount = Math.ceil(reviews.length / DESKTOP_PAGE_SIZE);
  const starsLabel =
    locale === "en" ? "5 out of 5 stars" : "5 od 5 zvezdica";

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const sync = () => {
      setIsMobile(media.matches);
      setMobileIndex(0);
      setDesktopPage(0);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (cards.length === 0) return;

    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.intersectionRatio);
        }

        let bestIndex = 0;
        let bestRatio = 0;
        cards.forEach((card, index) => {
          const ratio = ratios.get(card) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = index;
          }
        });

        setMobileIndex(bestIndex);
      },
      {
        root: viewport,
        threshold: [0.35, 0.5, 0.65, 0.8],
      },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [isMobile, reviews.length]);

  const scrollToCard = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
    setMobileIndex(index);
  };

  const goToDesktopPage = (page: number) => {
    setDesktopPage(Math.max(0, Math.min(desktopPageCount - 1, page)));
  };

  const trackStyle = isMobile
    ? undefined
    : ({
        "--testimonial-pages": desktopPageCount,
        transform: `translateX(-${desktopPage * (100 / desktopPageCount)}%)`,
      } as CSSProperties);

  return (
    <section
      className="testimonials-section gold-rule bg-anthracite px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28"
      aria-labelledby="testimonials-heading"
    >
      <ScrollReveal>
      <div className="mx-auto max-w-6xl text-center">
        <p className="site-kicker">{copy.testimonialsKicker}</p>
        <h2
          id="testimonials-heading"
          className="mt-5 font-heading text-3xl font-medium leading-tight text-ivory sm:text-4xl md:text-[2.75rem] md:leading-tight"
        >
          {copy.testimonialsHeading}
        </h2>
      </div>

      <div className="testimonials-carousel mx-auto mt-10 max-w-6xl sm:mt-12">
        {!isMobile ? (
          <CarouselArrow
            direction="prev"
            label={copy.lightboxPrev}
            disabled={desktopPage === 0}
            onClick={() => goToDesktopPage(desktopPage - 1)}
          />
        ) : null}

        <div
          ref={viewportRef}
          className={`testimonials-viewport${
            isMobile ? " is-mobile" : " is-desktop"
          }`}
          aria-label={copy.testimonialsHeading}
          aria-live="polite"
        >
          <div
            className={`testimonials-track${
              reducedMotion ? " motion-reduce" : ""
            }`}
            style={trackStyle}
          >
            {reviews.map((review, index) => (
              <ReviewCard
                key={review.id}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                review={review}
                starsLabel={starsLabel}
              />
            ))}
          </div>
        </div>

        {!isMobile ? (
          <CarouselArrow
            direction="next"
            label={copy.lightboxNext}
            disabled={desktopPage >= desktopPageCount - 1}
            onClick={() => goToDesktopPage(desktopPage + 1)}
          />
        ) : null}
      </div>

      {isMobile ? (
        <div
          className="testimonials-dots testimonials-dots-mobile"
          role="tablist"
          aria-label={copy.testimonialsHeading}
        >
          {reviews.map((review, index) => (
            <button
              key={review.id}
              type="button"
              role="tab"
              className="testimonials-dot"
              aria-label={`${review.name}, ${index + 1} / ${reviews.length}`}
              aria-selected={mobileIndex === index}
              data-active={mobileIndex === index ? "true" : undefined}
              onClick={() => scrollToCard(index)}
            />
          ))}
        </div>
      ) : (
        <div
          className="testimonials-dots testimonials-dots-desktop"
          role="tablist"
          aria-label={copy.testimonialsHeading}
        >
          {Array.from({ length: desktopPageCount }, (_, page) => (
            <button
              key={page}
              type="button"
              role="tab"
              className="testimonials-dot"
              aria-label={`${page + 1} / ${desktopPageCount}`}
              aria-selected={desktopPage === page}
              data-active={desktopPage === page ? "true" : undefined}
              onClick={() => goToDesktopPage(page)}
            />
          ))}
        </div>
      )}

      <p className="mt-10 text-center sm:mt-12">
        <a
          href={GOOGLE_BUSINESS_PROFILE_URL}
          className="site-cta-pill site-cta-pill-fill"
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy.viewAllReviews}
        </a>
      </p>
      </ScrollReveal>
    </section>
  );
}
