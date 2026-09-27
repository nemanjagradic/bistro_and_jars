"use client";

/**
 * Remembers each page's scroll offset for this tab.
 * Only user scrolling writes the map, so Next's jump to the top on a link
 * click cannot replace a saved position with 0.
 */
const PAGE_SCROLL_KEY = "bj:page-scroll";
const LEGACY_HOME_SCROLL_KEY = "bj:home-scroll";
const SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
]);

const memory: Record<string, number> = {};

let saveHeld = false;
let userScroll = false;
let pointerOnScrollbar = false;
let calmTimer = 0;
let holdTimer = 0;
let flushFrame = 0;
let homeVisits = 0;
let seenHomeMount = false;

function hydrate() {
  try {
    const raw = sessionStorage.getItem(PAGE_SCROLL_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    if (parsed && typeof parsed === "object") {
      for (const [path, value] of Object.entries(parsed)) {
        const y = Number(value);
        if (Number.isFinite(y) && y >= 0) memory[path] = Math.round(y);
      }
    }
    const legacy = Number(sessionStorage.getItem(LEGACY_HOME_SCROLL_KEY));
    if (Number.isFinite(legacy) && legacy > 0 && memory["/"] == null) {
      memory["/"] = Math.round(legacy);
    }
    sessionStorage.removeItem(LEGACY_HOME_SCROLL_KEY);
  } catch {}
}

function flush() {
  flushFrame = 0;
  try {
    sessionStorage.setItem(PAGE_SCROLL_KEY, JSON.stringify(memory));
  } catch {}
}

function scheduleFlush() {
  if (flushFrame) return;
  flushFrame = window.requestAnimationFrame(flush);
}

function write(path: string, y: number) {
  const rounded = Math.max(0, Math.round(y));
  if (memory[path] === rounded) return;
  memory[path] = rounded;
  scheduleFlush();
}

function armUserScroll() {
  userScroll = true;
  window.clearTimeout(calmTimer);
  calmTimer = window.setTimeout(() => {
    userScroll = false;
  }, 180);
}

function editableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.closest("input, textarea, select") !== null)
  );
}

export function readPageScroll(path: string) {
  const value = memory[path];
  return Number.isFinite(value) ? value : 0;
}

/** Writes even while saves are paused. Used when the logo scrolls Home to the top. */
export function rememberPageScroll(path: string, y: number) {
  userScroll = false;
  pointerOnScrollbar = false;
  write(path, y);
}

export function holdPageScrollSave() {
  saveHeld = true;
  userScroll = false;
  pointerOnScrollbar = false;
  window.clearTimeout(calmTimer);
  window.clearTimeout(holdTimer);
  holdTimer = window.setTimeout(() => {
    saveHeld = false;
  }, 4000);
}

export function releasePageScrollSave() {
  saveHeld = false;
  window.clearTimeout(holdTimer);
  holdTimer = 0;
}

/**
 * True when this Home visit should jump back to a saved offset.
 * The first paint of a document that was opened on Home stays put
 * (a reload of Home is armed earlier, before hydration).
 * Strict-mode's extra mount in the same turn counts as one visit.
 */
export function homeVisitShouldRestore() {
  if (!seenHomeMount) {
    homeVisits += 1;
    seenHomeMount = true;
    queueMicrotask(() => {
      seenHomeMount = false;
    });
  }
  if (readPageScroll("/") <= 0) return false;
  if (homeVisits > 1) return true;
  try {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    return !!nav && new URL(nav.name).pathname !== "/";
  } catch {
    return false;
  }
}

function onScroll() {
  if (saveHeld || document.body.style.position === "fixed") return;
  if (!userScroll && !pointerOnScrollbar) return;
  if (userScroll) armUserScroll();
  write(window.location.pathname, window.scrollY);
}

function onKeyDown(event: KeyboardEvent) {
  if (!SCROLL_KEYS.has(event.key) || editableTarget(event.target)) return;
  armUserScroll();
}

function onPointerDown(event: PointerEvent) {
  const root = document.documentElement;
  const scrollbar = root.offsetWidth - root.clientWidth;
  if (scrollbar <= 0) return;
  if (event.clientX >= window.innerWidth - scrollbar - 2) pointerOnScrollbar = true;
}

function onPointerUp() {
  pointerOnScrollbar = false;
}

function isLeavingClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const anchor = (event.target as Element | null)?.closest?.("a");
  if (!(anchor instanceof HTMLAnchorElement)) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return false;
  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  return url.pathname !== window.location.pathname;
}

if (typeof window !== "undefined") {
  hydrate();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("wheel", armUserScroll, { passive: true });
  window.addEventListener("touchmove", armUserScroll, { passive: true });
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("pointerup", onPointerUp, true);
  window.addEventListener("pointercancel", onPointerUp, true);
  window.addEventListener("pagehide", flush);
  window.addEventListener(
    "click",
    (event) => {
      if (!isLeavingClick(event)) return;
      write(window.location.pathname, window.scrollY);
      holdPageScrollSave();
    },
    true,
  );
  window.addEventListener("popstate", holdPageScrollSave);
}
