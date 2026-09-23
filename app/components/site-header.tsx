"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { OVERLAY_LINKS } from "../lib/chrome-copy";
import {
  getHeroNavSignal,
  subscribeHeroNav,
  type HeroNavSignal,
} from "../lib/hero-nav-progress";
import {
  HERO_TIMING,
  HERO_VIDEO_QUERY,
  progressInRange,
} from "../lib/scroll-video";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "./language-provider";

function solidFromSignal(signal: HeroNavSignal, isPhone: boolean) {
  if (signal.kind !== "pin") return 0;
  const timing = isPhone ? HERO_TIMING.mobile : HERO_TIMING.landscape;
  return progressInRange(
    signal.progress,
    timing.overlayOut[0],
    timing.overlayOut[1],
  );
}

function applyHeaderSolid(el: HTMLElement, solid: number) {
  el.style.setProperty("--nav-solid", String(solid));
  el.dataset.solid = solid > 0.12 ? "1" : "0";
}

export function SiteHeader() {
  const pathname = usePathname();
  const { copy } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const overlayId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === "/";

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    if (!isHome) {
      applyHeaderSolid(header, 1);
      return;
    }

    const media = window.matchMedia(HERO_VIDEO_QUERY);
    let isPhone = media.matches;
    let signal = getHeroNavSignal();
    let io: IntersectionObserver | undefined;

    const paint = () => {
      if (signal.kind === "static") return;
      applyHeaderSolid(header, solidFromSignal(signal, isPhone));
    };

    const observeStatic = () => {
      io?.disconnect();
      io = undefined;
      const hero = document.getElementById("hero-entrance");
      if (!hero) {
        applyHeaderSolid(header, 0);
        return;
      }
      io = new IntersectionObserver(
        ([entry]) => {
          const covering =
            entry.isIntersecting && entry.intersectionRatio > 0.2;
          applyHeaderSolid(header, covering ? 0 : 1);
        },
        { threshold: [0, 0.2, 1] },
      );
      io.observe(hero);
    };

    const onSignal = (next: HeroNavSignal) => {
      signal = next;
      if (next.kind === "static") {
        observeStatic();
        return;
      }
      io?.disconnect();
      io = undefined;
      paint();
    };

    const onVideoQuery = () => {
      isPhone = media.matches;
      paint();
    };

    const unsubscribe = subscribeHeroNav(onSignal);
    media.addEventListener("change", onVideoQuery);
    paint();

    return () => {
      unsubscribe();
      media.removeEventListener("change", onVideoQuery);
      io?.disconnect();
    };
  }, [isHome]);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      restoreFocusRef.current?.focus();
    };
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (desktop.matches) closeMenu();
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [closeMenu]);

  const onWordmarkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    event.preventDefault();
    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      ref={headerRef}
      className="site-header"
      data-menu-open={menuOpen ? "1" : "0"}
      data-page={pathname === "/menu" ? "menu" : undefined}
    >
      <div className="site-header-bar">
        <Link
          href="/"
          onClick={onWordmarkClick}
          className="site-header-wordmark"
        >
          <Image
            src="/brand/logo.png"
            alt="Bistro & Jars Coffee Bar"
            width={975}
            height={409}
            sizes="(min-width: 768px) 8rem, 7rem"
          />
        </Link>

        <div className="site-header-cluster">
          <nav className="site-header-desktop-nav" aria-label="Primary">
            {OVERLAY_LINKS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`site-header-link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {copy[item.key]}
                </Link>
              );
            })}
          </nav>

          <LanguageSwitcher className="site-header-lang-desktop" />

          <Link
            href="/contact"
            className="site-header-cta site-cta-pill"
            onClick={closeMenu}
          >
            {copy.contact}
          </Link>

          <button
            ref={closeRef}
            type="button"
            className={`site-header-burger${menuOpen ? " is-open" : ""}`}
            aria-expanded={menuOpen}
            aria-controls={overlayId}
            aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="site-header-burger-line" aria-hidden />
            <span className="site-header-burger-line" aria-hidden />
          </button>
        </div>
      </div>

      <div
        id={overlayId}
        className={`site-header-overlay${menuOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal={menuOpen}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        aria-label={copy.openMenu}
      >
        <nav className="site-header-overlay-nav" aria-label="Primary">
          {OVERLAY_LINKS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`site-header-overlay-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={closeMenu}
              >
                {copy[item.key]}
              </Link>
            );
          })}
        </nav>
        <div className="site-header-overlay-footer">
          <Link
            href="/contact"
            className="site-header-cta site-cta-pill site-header-overlay-cta"
            onClick={closeMenu}
          >
            {copy.contact}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
