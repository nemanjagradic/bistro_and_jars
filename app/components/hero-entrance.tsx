"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  HERO_SCRUB,
  HERO_TIMING,
  HERO_VIDEO_QUERY,
  VIDEO_LERP,
  VIDEO_SEEK_INTERVAL_PHONE,
  VIDEO_SEEK_STEP,
  VIDEO_SEEK_STEP_PHONE,
  VIDEO_SNAP_PROGRESS,
  heroPinDistance,
  holdHomeScrollRestoration,
  markHomePinReady,
  matchesHeroPhone,
  progressInRange,
  scheduleScrollTriggerRefresh,
  setupHomeScrollRestore,
  videoHasDuration,
  whenVideoCanScrub,
} from "../lib/scroll-video";
import { setHeroNavSignal } from "../lib/hero-nav-progress";
import { HOME_COPY } from "../lib/home-copy";
import { useLanguage } from "./language-provider";

setupHomeScrollRestore();

const HERO_VIDEOS = {
  mobile: "/hero/mobile.mp4",
  landscape: "/hero/desktop.mp4",
} as const;

const HERO_POSTERS = {
  mobile: "/hero/mobile-poster.jpg",
  landscape: "/hero/desktop-poster.jpg",
} as const;

const HERO_END_FRAMES = {
  mobile: "/hero/mobile-end.jpg",
  landscape: "/hero/desktop-end.jpg",
} as const;

function pickVideoSrc() {
  return window.matchMedia(HERO_VIDEO_QUERY).matches
    ? HERO_VIDEOS.mobile
    : HERO_VIDEOS.landscape;
}

export function HeroEntrance() {
  const { locale } = useLanguage();
  const copy = HOME_COPY[locale];
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const endStillRef = useRef<HTMLDivElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => holdHomeScrollRestoration(), []);

  useEffect(() => {
    const media = window.matchMedia(HERO_VIDEO_QUERY);
    const sync = () => setVideoSrc(pickVideoSrc());
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const wordmark = wordmarkRef.current;
    const cue = cueRef.current;
    const endStill = endStillRef.current;
    if (!section || !video || !videoSrc) return;

    let cancelled = false;

    video.muted = true;
    video.playsInline = true;
    video.pause();

    const timing =
      videoSrc === HERO_VIDEOS.mobile ? HERO_TIMING.mobile : HERO_TIMING.landscape;

    const applyOverlay = (progress: number) => {
      setHeroNavSignal({ kind: "pin", progress });
      if (overlay) {
        overlay.style.opacity = String(
          1 - progressInRange(progress, timing.overlayOut[0], timing.overlayOut[1]),
        );
      }
      if (wordmark) {
        wordmark.style.opacity = String(
          progressInRange(progress, timing.wordmarkIn[0], timing.wordmarkIn[1]),
        );
      }
      if (cue) {
        cue.style.opacity = String(
          1 - progressInRange(progress, timing.cueOut[0], timing.cueOut[1]),
        );
      }
    };

    const applyStaticCopy = () => {
      if (overlay) overlay.style.opacity = "1";
      if (wordmark) wordmark.style.opacity = "1";
      if (cue) cue.style.opacity = "1";
    };

    const clearStaticCopy = () => {
      overlay?.style.removeProperty("opacity");
      wordmark?.style.removeProperty("opacity");
      cue?.style.removeProperty("opacity");
    };

    // Set as a background so the still is only fetched when the fallback is used.
    const showEndFrame = () => {
      if (!endStill) return;
      const src =
        videoSrc === HERO_VIDEOS.landscape
          ? HERO_END_FRAMES.landscape
          : HERO_END_FRAMES.mobile;
      endStill.style.backgroundImage = `url("${src}")`;
    };

    const hideEndFrame = () => {
      endStill?.style.removeProperty("background-image");
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setHeroNavSignal({ kind: "static", progress: 0 });
      applyStaticCopy();
      showEndFrame();
      markHomePinReady("hero");
      return () => {
        cancelled = true;
        setHeroNavSignal({ kind: "absent", progress: 0 });
        clearStaticCopy();
        hideEndFrame();
      };
    }

    let ctx: gsap.Context | undefined;
    let mode: "idle" | "scrub" | "static" = "idle";
    let raf = 0;
    let targetTime = 0;
    let displayTime = 0;
    let lastSeekAt = 0;
    const phone = matchesHeroPhone();
    const seekStep = phone ? VIDEO_SEEK_STEP_PHONE : VIDEO_SEEK_STEP;
    const seekInterval = phone ? VIDEO_SEEK_INTERVAL_PHONE : 0;

    const tick = (now: number) => {
      if (targetTime <= 0) {
        displayTime = 0;
        if (!video.seeking && video.currentTime !== 0) {
          lastSeekAt = now;
          video.currentTime = 0;
        }
      } else {
        displayTime += (targetTime - displayTime) * VIDEO_LERP;
        if (
          !video.seeking &&
          Number.isFinite(displayTime) &&
          Math.abs(video.currentTime - displayTime) > seekStep &&
          now - lastSeekAt >= seekInterval
        ) {
          lastSeekAt = now;
          video.currentTime = displayTime;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    /**
     * `permanent` locks the hero to the end still. A provisional fallback leaves
     * `mode` idle so a late `loadedmetadata` can still hand over to scrubbing.
     */
    const showStaticHero = (permanent: boolean) => {
      if (cancelled || mode === "static") return;
      if (permanent) mode = "static";
      cancelAnimationFrame(raf);
      raf = 0;
      ctx?.revert();
      ctx = undefined;
      setHeroNavSignal({ kind: "static", progress: 0 });
      applyStaticCopy();
      showEndFrame();
      if (permanent) markHomePinReady("hero");
    };

    const init = async () => {
      if (cancelled || mode !== "idle") return;

      if (!videoHasDuration(video)) {
        showStaticHero(false);
        return;
      }

      mode = "scrub";
      clearStaticCopy();
      hideEndFrame();

      try {
        await video.play();
        video.pause();
      } catch {
        video.pause();
      }

      if (cancelled || mode !== "scrub") return;

      video.currentTime = 0;
      targetTime = 0;
      displayTime = 0;

      applyOverlay(0);
      const playhead = { time: 0 };
      const duration = video.duration;

      ctx?.revert();
      ctx = gsap.context(() => {
        gsap.to(playhead, {
          time: duration,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${heroPinDistance(duration)}`,
            pin: true,
            scrub: HERO_SCRUB,
            anticipatePin: 1,
            refreshPriority: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress <= VIDEO_SNAP_PROGRESS) {
                playhead.time = 0;
                targetTime = 0;
                displayTime = 0;
                if (!video.seeking) video.currentTime = 0;
              } else {
                targetTime = playhead.time;
              }
              applyOverlay(self.progress);
            },
          },
        });
      }, section);

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
      scheduleScrollTriggerRefresh();
      markHomePinReady("hero");
    };

    const onOrientation = () => {
      scheduleScrollTriggerRefresh();
    };

    const onVideoError = () => {
      showStaticHero(true);
    };

    window.addEventListener("orientationchange", onOrientation);
    video.addEventListener("error", onVideoError);

    const cancelReady = whenVideoCanScrub(video, (scrubbable) => {
      if (scrubbable) void init();
      else showStaticHero(false);
    });

    return () => {
      cancelled = true;
      cancelReady();
      cancelAnimationFrame(raf);
      window.removeEventListener("orientationchange", onOrientation);
      video.removeEventListener("error", onVideoError);
      ctx?.revert();
      setHeroNavSignal({ kind: "absent", progress: 0 });
      clearStaticCopy();
      hideEndFrame();
    };
  }, [videoSrc]);

  return (
    <section
      id="hero-entrance"
      ref={sectionRef}
      className="relative h-dvh w-full overflow-hidden bg-background"
    >
      {videoSrc ? (
        <video
          key={videoSrc}
          ref={videoRef}
          className="hero-video absolute inset-0 h-full w-full"
          src={videoSrc}
          poster={
            videoSrc === HERO_VIDEOS.landscape
              ? HERO_POSTERS.landscape
              : HERO_POSTERS.mobile
          }
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
      ) : null}

      <div
        ref={endStillRef}
        className="hero-end-still pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      />

      <div className="hero-film-grade pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 flex h-full flex-col justify-center px-5 sm:px-10 lg:px-16"
      >
        <div className="relative mx-auto w-full max-w-md sm:mx-0 sm:max-w-lg md:max-w-xl">
          <div
            className="hero-type-veil pointer-events-none absolute -inset-x-16 -inset-y-20 sm:-inset-x-28 sm:-inset-y-28"
            aria-hidden
          />

          <div className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
            <h1 ref={wordmarkRef} className="hero-wordmark">
              <picture>
                <source
                  media="(min-width: 640px)"
                  srcSet="/brand/wordmark.png"
                  width={2250}
                  height={272}
                />
                <img
                  src="/brand/wordmark-stacked.png"
                  alt="Bistro & Jars Coffee Bar"
                  width={1315}
                  height={627}
                  className="h-auto w-[min(72vw,14.5rem)] drop-shadow-[0_2px_18px_rgba(11,10,9,0.55)] sm:w-[min(48vw,26rem)] md:w-[min(38vw,28rem)]"
                />
              </picture>
            </h1>

            <p className="font-heading mt-5 max-w-[20rem] text-lg italic leading-snug text-ivory [text-shadow:0_2px_18px_rgba(11,10,9,0.85)] sm:mt-7 sm:max-w-none sm:text-2xl md:text-3xl">
              {copy.heroTagline}
            </p>
            <p className="mt-3 max-w-[20rem] text-[0.8125rem] leading-relaxed text-ivory/90 [text-shadow:0_2px_16px_rgba(11,10,9,0.9)] sm:mt-4 sm:max-w-md sm:text-base md:max-w-lg md:text-lg">
              {copy.heroSubline}
            </p>
          </div>
        </div>
      </div>

      <div
        ref={cueRef}
        className="hero-scroll-cue pointer-events-none absolute bottom-[max(1.15rem,env(safe-area-inset-bottom))] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/80"
      >
        <span className="font-sans text-[0.6rem] tracking-[0.28em] uppercase sm:text-[0.65rem]">
          {copy.heroScrollCue}
        </span>
        <span className="hero-scroll-cue-line block h-6 w-px bg-gold/80 sm:h-8" aria-hidden />
      </div>
    </section>
  );
}
