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
export const VIDEO_SEEK_STEP_PHONE = 1 / 15;
export const VIDEO_SEEK_INTERVAL_PHONE = 1000 / 15;
export const VIDEO_SNAP_PROGRESS = 0.008;

export function videoHasDuration(video: HTMLVideoElement) {
  return Number.isFinite(video.duration) && video.duration > 0;
}

/**
 * Calls `onReady(true)` once the video exposes a duration and can be scrubbed.
 * May fire earlier with `onReady(false)` when metadata is slow, so the caller can
 * show a fallback; listeners stay attached and a later `onReady(true)` upgrades it.
 */
export function whenVideoCanScrub(
  video: HTMLVideoElement,
  onReady: (scrubbable: boolean) => void,
) {
  if (video.readyState >= 1 && videoHasDuration(video)) {
    onReady(true);
    return () => {};
  }

  let done = false;
  let timer = 0;
  const finish = () => {
    if (done) return;
    done = true;
    cleanup();
    onReady(videoHasDuration(video));
  };

  const onMeta = () => {
    if (videoHasDuration(video)) finish();
  };

  const onCanPlay = () => {
    if (video.readyState >= 3 && videoHasDuration(video)) finish();
  };

  const cleanup = () => {
    video.removeEventListener("loadedmetadata", onMeta);
    video.removeEventListener("canplaythrough", onCanPlay);
    video.removeEventListener("canplay", onCanPlay);
    video.removeEventListener("error", finish);
    window.clearTimeout(timer);
  };

  video.addEventListener("loadedmetadata", onMeta);
  video.addEventListener("canplaythrough", onCanPlay);
  video.addEventListener("canplay", onCanPlay);
  video.addEventListener("error", finish);
  timer = window.setTimeout(() => {
    if (!done) onReady(false);
  }, 2500);

  return () => {
    done = true;
    cleanup();
  };
}

export function matchesMobile() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

export function matchesHeroPhone() {
  return window.matchMedia(HERO_VIDEO_QUERY).matches;
}

let refreshTimer = 0;

export function refreshScrollTriggersNow() {
  window.clearTimeout(refreshTimer);
  refreshTimer = 0;
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

export function scheduleScrollTriggerRefresh() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    refreshScrollTriggersNow();
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

/**
 * Pin length in pixels. Keyed off MOBILE_QUERY (767px) rather than the narrower
 * HERO_VIDEO_QUERY (639px), so the 640–767 band plays the landscape clip over the
 * shorter mobile pin.
 */
export function heroPinDistance(duration: number) {
  const mobile = matchesMobile();
  const viewports = mobile
    ? Math.min(3, Math.max(2.5, duration * 0.3))
    : Math.min(4.5, Math.max(3.5, duration * 0.4));
  return viewports * window.innerHeight;
}


export function shakePinDistance(duration: number) {
  const mobile = matchesMobile();
  const viewports = mobile
    ? Math.min(3.2, Math.max(2.6, duration * 0.26))
    : Math.min(3, Math.max(2.4, duration * 0.24));
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
