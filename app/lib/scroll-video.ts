"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export const MOBILE_QUERY = "(max-width: 767px)";
/** Portrait hero clip — phones only, not the 640–767 tablet/narrow-desktop band. */
export const HERO_VIDEO_QUERY = "(max-width: 639px)";
export const VIDEO_SCRUB = 0.78;
/** Hero only. Shake keeps VIDEO_SCRUB so the recipe steps stay readable. */
export const HERO_SCRUB = 0.45;
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

/*
 * Home scroll restore. Pins are created only after video metadata loads and add
 * several viewports of spacing, so the browser's native restore lands on a stale
 * pixel offset (usually mid-shake). Instead the offset is saved on unload and
 * re-applied once every pin exists, when the layout matches the one it came from.
 */
const HOME_SCROLL_KEY = "bj:home-scroll";
const HOME_PINS = ["hero", "shake"] as const;
const RESTORE_FALLBACK_MS = 4000;
const USER_SCROLL_EVENTS = ["wheel", "touchmove", "keydown"] as const;

export type HomePin = (typeof HOME_PINS)[number];

const readyPins = new Set<HomePin>();
let pendingRestore: number | null = null;
let restoreFallback = 0;

function readSavedHomeScroll() {
  try {
    const value = Number(sessionStorage.getItem(HOME_SCROLL_KEY));
    sessionStorage.removeItem(HOME_SCROLL_KEY);
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

function saveHomeScroll() {
  try {
    if (window.location.pathname === "/") {
      sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.round(window.scrollY)));
    } else {
      sessionStorage.removeItem(HOME_SCROLL_KEY);
    }
  } catch {}
}

function cancelPendingRestore() {
  pendingRestore = null;
  window.clearTimeout(restoreFallback);
  USER_SCROLL_EVENTS.forEach((type) =>
    window.removeEventListener(type, cancelPendingRestore),
  );
}

function applyPendingRestore() {
  const target = pendingRestore;
  cancelPendingRestore();
  if (target === null) return;
  refreshScrollTriggersNow();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo(0, Math.max(0, Math.min(target, max)));
}

/** Runs once when the home bundle is evaluated, before hydration. */
export function setupHomeScrollRestore() {
  if (typeof window === "undefined" || window.location.pathname !== "/") return;

  ScrollTrigger.clearScrollMemory("manual");
  window.addEventListener("pagehide", saveHomeScroll);

  const saved = readSavedHomeScroll();
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  const reloadedHome =
    nav?.type === "reload" && new URL(nav.name).pathname === "/";
  if (!reloadedHome || saved <= 0) return;

  pendingRestore = saved;
  window.scrollTo(0, 0);
  USER_SCROLL_EVENTS.forEach((type) =>
    window.addEventListener(type, cancelPendingRestore, { passive: true }),
  );
  restoreFallback = window.setTimeout(applyPendingRestore, RESTORE_FALLBACK_MS);
}

/** Called by each pinned home section once its pin (or static fallback) is in place. */
export function markHomePinReady(pin: HomePin) {
  readyPins.add(pin);
  if (HOME_PINS.every((name) => readyPins.has(name))) applyPendingRestore();
}

/**
 * Native restoration stays off while the home page is mounted and is handed back
 * on leave, so other pages keep the browser default.
 */
export function holdHomeScrollRestoration() {
  ScrollTrigger.clearScrollMemory("manual");
  return () => {
    readyPins.clear();
    ScrollTrigger.clearScrollMemory("auto");
  };
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
    : Math.min(3.4, Math.max(3, duration * 0.4));
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
    wordmarkIn: [0.08, 0.2],
    overlayOut: [0.72, 0.88],
    cueOut: [0.02, 0.1],
  },
  landscape: {
    wordmarkIn: [0.08, 0.2],
    overlayOut: [0.75, 0.9],
    cueOut: [0.02, 0.1],
  },
} as const;

export function progressInRange(progress: number, from: number, to: number) {
  if (to <= from) return progress >= from ? 1 : 0;
  const x = Math.min(1, Math.max(0, (progress - from) / (to - from)));
  return x * x * (3 - 2 * x);
}
