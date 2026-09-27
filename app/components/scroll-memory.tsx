"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import {
  holdPageScrollSave,
  readPageScroll,
  releasePageScrollSave,
} from "../lib/page-scroll";

function navigationType() {
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return nav?.type;
}

/**
 * Puts Menu, Gallery, Contact, and the legal pages back where they were.
 * Home waits for its video pins and restores from the hero instead.
 */
export function ScrollMemory() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useLayoutEffect(() => {
    const from = previous.current;
    previous.current = pathname;

    if (from === null && navigationType() !== "reload") return;
    if (from === pathname) return;
    if (window.location.hash) {
      releasePageScrollSave();
      return;
    }

    if (pathname === "/") {
      if (readPageScroll("/") <= 0) releasePageScrollSave();
      return;
    }

    const target = readPageScroll(pathname);
    if (target <= 0) {
      releasePageScrollSave();
      return;
    }

    holdPageScrollSave();
    queueMicrotask(() => {
      if (window.location.pathname !== pathname) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.max(0, Math.min(target, max)));
      releasePageScrollSave();
    });
  }, [pathname]);

  return null;
}
