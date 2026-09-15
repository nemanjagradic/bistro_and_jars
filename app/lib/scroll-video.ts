"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export const MOBILE_QUERY = "(max-width: 767px)";
/** Portrait hero clip — phones only, not the 640–767 tablet/narrow-desktop band. */
export const HERO_VIDEO_QUERY = "(max-width: 639px)";
export const VIDEO_SCRUB = 0.78;
export const VIDEO_LERP = 0.18;
export const VIDEO_SEEK_STEP = 1 / 30;
export const VIDEO_SNAP_PROGRESS = 0.008;

export function whenVideoCanScrub(
  video: HTMLVideoElement,
  onReady: () => void,
) {
  if (video.readyState >= 4) {
    onReady();
    return () => {};
  }

  let done = false;
  let timer = 0;
  const finish = () => {
    if (done) return;
    done = true;
    video.removeEventListener("canplaythrough", finish);
    video.removeEventListener("canplay", onCanPlay);
    window.clearTimeout(timer);
    onReady();
  };

  const onCanPlay = () => {
    if (video.readyState >= 3) finish();
  };

  video.addEventListener("canplaythrough", finish);
  video.addEventListener("canplay", onCanPlay);
  timer = window.setTimeout(finish, 2500);

  return () => {
    done = true;
    video.removeEventListener("canplaythrough", finish);
    video.removeEventListener("canplay", onCanPlay);
    window.clearTimeout(timer);
  };
}

export function matchesMobile() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

let refreshTimer = 0;

export function scheduleScrollTriggerRefresh() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    refreshTimer = 0;
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, 150);
}

if (typeof window !== "undefined") {
  if (document.readyState === "complete") {
    scheduleScrollTriggerRefresh();
  } else {
    window.addEventListener("load", () => scheduleScrollTriggerRefresh(), {
      once: true,
    });
  }
}

export function heroPinDistance(duration: number) {
  const mobile = matchesMobile();
  const viewports = mobile
    ? Math.min(3, Math.max(2.5, duration * 0.3))
    : Math.min(4.5, Math.max(3.5, duration * 0.4));
  return viewports * window.innerHeight;
}

export const HERO_TIMING = {
  mobile: {
    wordmarkIn: [0.2, 0.32],
    overlayOut: [0.72, 0.88],
    cueOut: [0.02, 0.1],
  },
  landscape: {
    wordmarkIn: [0.3, 0.42],
    overlayOut: [0.75, 0.9],
    cueOut: [0.02, 0.1],
  },
} as const;

export function progressInRange(progress: number, from: number, to: number) {
  if (to <= from) return progress >= from ? 1 : 0;
  const x = Math.min(1, Math.max(0, (progress - from) / (to - from)));
  return x * x * (3 - 2 * x);
}
