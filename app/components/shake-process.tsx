"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  HERO_VIDEO_QUERY,
  VIDEO_LERP,
  VIDEO_SCRUB,
  VIDEO_SEEK_INTERVAL_PHONE,
  VIDEO_SEEK_STEP,
  VIDEO_SEEK_STEP_PHONE,
  VIDEO_SNAP_PROGRESS,
  matchesHeroPhone,
  refreshScrollTriggersNow,
  scheduleScrollTriggerRefresh,
  shakePinDistance,
  videoHasDuration,
  whenVideoCanScrub,
} from "../lib/scroll-video";

type Step = {
  at: number;
  label: string;
  line: string;
};

const SHAKE_VIDEOS = {
  phone: "/shake_phone.mp4",
  wide: "/shake_wide.mp4",
} as const;

const SHAKE_POSTERS = {
  phone: "/shake_phone_poster.jpg",
  wide: "/shake_wide_poster.jpg",
} as const;

const SHAKE_FINISHED = {
  phone: "/shake_phone_finished.jpg",
  wide: "/shake_wide_finished.jpg",
} as const;

const SHAKE_AMBIENTS = [
  "/shake_wide_ambient_01.jpg",
  "/shake_wide_ambient_02.jpg",
  "/shake_wide_ambient_03.jpg",
  "/shake_wide_ambient_04.jpg",
  "/shake_wide_ambient_05.jpg",
] as const;

/** Cut times shared by shake_phone.mp4 and shake_wide.mp4 (same 21.1s timeline). */
const STEPS: Step[] = [
  {
    at: 1.2,
    label: "Osnova",
    line: "Sladoled od vanile, mleko i slatka pavlaka.",
  },
  {
    at: 4.8,
    label: "Tegla",
    line: "Prvi deo dekoracije: čokolada iznutra, Nutella po obodu, pa šarene mrvice.",
  },
  {
    at: 10.9,
    label: "Punjenje",
    line: "Šejk se sipa u pripremljenu teglu.",
  },
  {
    at: 13.6,
    label: "Kruna",
    line: "Šlag na vrh, pa Kinder čokolada i Kinder Surprise jaje.",
  },
  {
    at: 18.0,
    label: "Završni detalj",
    line: "Čokoladni preliv i šarene mrvice preko šlaga — Monster Shake je gotov.",
  },
];

/** One wallpaper per caption. Beat 0 starts at t=0 so the field is ready before Osnova. */
const AMBIENT_AT = [0, 4.8, 10.9, 13.6, 18.0] as const;

function activeStepIndex(time: number) {
  let idx = 0;
  for (let i = 0; i < STEPS.length; i++) {
    if (time >= STEPS[i].at) idx = i;
  }
  return idx;
}

function activeAmbientIndex(time: number) {
  let idx = 0;
  for (let i = 0; i < AMBIENT_AT.length; i++) {
    if (time >= AMBIENT_AT[i]) idx = i;
  }
  return idx;
}

function pickShakeAssets() {
  const phone = window.matchMedia(HERO_VIDEO_QUERY).matches;
  return {
    video: phone ? SHAKE_VIDEOS.phone : SHAKE_VIDEOS.wide,
    poster: phone ? SHAKE_POSTERS.phone : SHAKE_POSTERS.wide,
    finished: phone ? SHAKE_FINISHED.phone : SHAKE_FINISHED.wide,
  };
}

function StepDashes({
  activeStep,
  className = "",
}: {
  activeStep: number;
  className?: string;
}) {
  return (
    <div
      className={`shake-step-dashes${className ? ` ${className}` : ""}`}
      aria-hidden
    >
      {STEPS.map((step, i) => (
        <span
          key={step.label}
          className={`shake-step-dash${i === activeStep ? " is-active" : ""}`}
        />
      ))}
    </div>
  );
}

function StepCaption({
  activeStep,
  kind,
  className = "",
}: {
  activeStep: number;
  kind: "label" | "line";
  className?: string;
}) {
  const typeClass =
    kind === "label"
      ? "font-sans text-[0.65rem] uppercase tracking-[0.22em] text-gold"
      : "text-base leading-relaxed text-ivory sm:text-lg xl:text-xl";

  return (
    <div
      className={`shake-step-swap${kind === "line" ? " shake-step-swap--line" : ""}${className ? ` ${className}` : ""}`}
    >
      {STEPS.map((step, i) => (
        <p
          key={step.label}
          className={`${typeClass}${i === activeStep ? " is-active" : ""}`}
          aria-hidden={i !== activeStep}
        >
          {kind === "label" ? step.label : step.line}
        </p>
      ))}
    </div>
  );
}

function ShakeCopy({
  activeStep,
  mobile = false,
  headingId,
}: {
  activeStep: number;
  mobile?: boolean;
  headingId?: string;
}) {
  return (
    <div className="relative">
      <h2
        id={headingId}
        className="font-heading text-3xl font-medium leading-tight text-ivory sm:text-4xl lg:text-[2.75rem] xl:text-5xl"
      >
        Monster Shake Kinder
      </h2>
      <span className="shake-title-rule" aria-hidden />
      <p className="font-heading mt-3 text-lg italic leading-snug text-ivory/85 sm:text-xl lg:mt-4 xl:text-2xl">
        Od prvog sastojka do poslednjeg detalja.
      </p>
      <StepDashes activeStep={activeStep} className="mt-5 lg:mt-6" />

      {mobile ? (
        <div className="mt-4" aria-live="polite">
          <StepCaption activeStep={activeStep} kind="label" />
          <StepCaption activeStep={activeStep} kind="line" className="mt-2" />
        </div>
      ) : (
        <div className="mt-10 xl:mt-12">
          <ol
            className="space-y-4 xl:space-y-5"
            aria-label="Koraci pripreme"
          >
            {STEPS.map((step, i) => {
              const active = i === activeStep;
              return (
                <li
                  key={step.label}
                  className="grid grid-cols-[1.375rem_1fr] items-baseline gap-x-3 xl:grid-cols-[1.625rem_1fr] xl:gap-x-4"
                  aria-current={active ? "step" : undefined}
                >
                  <span
                    aria-hidden
                    className={`shake-step-index font-sans text-[0.7rem] tabular-nums tracking-[0.14em] xl:text-[0.8rem] ${
                      active ? "is-active" : ""
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className={`shake-step-index font-sans text-[0.65rem] uppercase tracking-[0.22em] xl:text-[0.7rem] ${
                      active ? "is-active" : ""
                    }`}
                  >
                    {step.label}
                  </p>
                </li>
              );
            })}
          </ol>
          <div className="mt-8 xl:mt-10" aria-live="polite">
            <StepCaption activeStep={activeStep} kind="line" />
          </div>
        </div>
      )}
    </div>
  );
}

export function ShakeProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [activeAmbient, setActiveAmbient] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [holdFinished, setHoldFinished] = useState(false);
  const [assets, setAssets] = useState<ReturnType<
    typeof pickShakeAssets
  > | null>(null);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    const media = window.matchMedia(HERO_VIDEO_QUERY);
    const sync = () => {
      setHoldFinished(false);
      setAssets(pickShakeAssets());
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion || !assets) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    const film = filmRef.current;
    if (!section || !video) return;

    let cancelled = false;
    video.muted = true;
    video.playsInline = true;
    video.pause();

    let ctx: gsap.Context | undefined;
    let mode: "idle" | "scrub" | "static" = "idle";
    let raf = 0;
    let targetTime = 0;
    let displayTime = 0;
    let lastSeekAt = 0;
    let lastStep = 0;
    let lastAmbient = 0;
    const phone = matchesHeroPhone();
    const seekStep = phone ? VIDEO_SEEK_STEP_PHONE : VIDEO_SEEK_STEP;
    const seekInterval = phone ? VIDEO_SEEK_INTERVAL_PHONE : 0;

    const syncStep = (time: number) => {
      const step = activeStepIndex(time);
      if (step !== lastStep) {
        lastStep = step;
        setActiveStep(step);
      }
      const ambient = activeAmbientIndex(time);
      if (ambient !== lastAmbient) {
        lastAmbient = ambient;
        setActiveAmbient(ambient);
      }
    };

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
      syncStep(displayTime);
      raf = requestAnimationFrame(tick);
    };

    const showStatic = (permanent: boolean) => {
      if (cancelled || mode === "static") return;
      // Provisional: keep the poster / first frame. The video may still become scrubbable.
      if (!permanent) return;
      mode = "static";
      cancelAnimationFrame(raf);
      raf = 0;
      ctx?.revert();
      ctx = undefined;
      setHoldFinished(true);
      setActiveStep(STEPS.length - 1);
      setActiveAmbient(SHAKE_AMBIENTS.length - 1);
      if (film) film.style.opacity = "1";
    };

    const init = async () => {
      if (cancelled || mode !== "idle") return;

      if (!videoHasDuration(video)) {
        showStatic(false);
        return;
      }

      mode = "scrub";
      setHoldFinished(false);
      video.currentTime = 0;
      targetTime = 0;
      displayTime = 0;
      lastStep = 0;
      lastAmbient = 0;
      setActiveStep(0);
      setActiveAmbient(0);

      const playhead = { time: 0 };
      const duration = video.duration;
      const lastFrame = Math.max(0, duration - 1 / 30);

      ctx?.revert();
      ctx = gsap.context(() => {
        gsap.to(playhead, {
          time: lastFrame,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${shakePinDistance(duration)}`,
            pin: true,
            scrub: VIDEO_SCRUB,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress <= VIDEO_SNAP_PROGRESS) {
                playhead.time = 0;
                targetTime = 0;
                displayTime = 0;
                if (!video.seeking) video.currentTime = 0;
                syncStep(0);
              } else {
                targetTime = playhead.time;
              }
            },
          },
        });
      }, section);

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
      refreshScrollTriggersNow();

      try {
        await video.play();
        video.pause();
      } catch {
        video.pause();
      }

      if (cancelled || mode !== "scrub") return;
      if (targetTime <= 0 && !video.seeking) video.currentTime = 0;
    };

    const onOrientation = () => scheduleScrollTriggerRefresh();
    const onVideoError = () => showStatic(true);

    window.addEventListener("orientationchange", onOrientation);
    video.addEventListener("error", onVideoError);

    const cancelReady = whenVideoCanScrub(video, (scrubbable) => {
      if (scrubbable) void init();
      else showStatic(false);
    });

    return () => {
      cancelled = true;
      cancelReady();
      cancelAnimationFrame(raf);
      window.removeEventListener("orientationchange", onOrientation);
      video.removeEventListener("error", onVideoError);
      ctx?.revert();
      if (film) film.style.removeProperty("opacity");
    };
  }, [reducedMotion, assets]);

  if (reducedMotion) {
    const finishedSrc = assets?.finished ?? SHAKE_FINISHED.phone;

    return (
      <section
        aria-labelledby="shake-heading"
        className="relative bg-background lg:min-h-dvh"
      >
        <div
          className="shake-cinema-ambient pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            backgroundImage: `url("${SHAKE_AMBIENTS[SHAKE_AMBIENTS.length - 1]}")`,
          }}
          aria-hidden
        />
        <div
          className="shake-cinema-ambient-vignette pointer-events-none absolute inset-0 hidden lg:block"
          aria-hidden
        />
        <div className="relative z-10 lg:mx-auto lg:grid lg:min-h-dvh lg:max-w-7xl lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-10 lg:px-16 xl:gap-14 xl:px-20">
          <div className="relative px-5 py-16 sm:px-8 sm:py-20 lg:order-2 lg:flex lg:h-[86vh] lg:flex-col lg:justify-center lg:px-0 lg:py-0">
            <div
              className="shake-type-veil pointer-events-none absolute inset-y-0 -inset-x-12 hidden lg:block"
              aria-hidden
            />
            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
              <ShakeCopy activeStep={STEPS.length - 1} headingId="shake-heading" />
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden lg:order-1 lg:mx-0 lg:h-[86vh] lg:w-auto lg:max-w-none lg:shrink-0">
            <img
              src={finishedSrc}
              alt="Monster Shake Kinder u tegli, sa šlagom i Kinder jajetom"
              className="shake-cinema-panel-frame h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="shake-heading shake-heading-phone"
      className="relative h-dvh w-full overflow-hidden bg-background"
    >
      {SHAKE_AMBIENTS.map((src, i) => (
        <div
          key={src}
          className="shake-cinema-ambient pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            backgroundImage: `url("${src}")`,
            opacity: i === activeAmbient ? 1 : 0,
          }}
          aria-hidden
        />
      ))}
      <div
        className="shake-cinema-ambient-vignette pointer-events-none absolute inset-0 hidden lg:block"
        aria-hidden
      />

      <div className="contents lg:mx-auto lg:grid lg:h-full lg:max-w-7xl lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-10 lg:px-16 xl:gap-14 xl:px-20">
        <div className="contents lg:relative lg:block lg:shrink-0">
          <div
            ref={filmRef}
            className="absolute inset-0 overflow-hidden lg:relative lg:aspect-[4/5] lg:h-[86vh] lg:w-auto"
          >
            {assets ? (
              <video
                key={assets.video}
                ref={videoRef}
                className="shake-video absolute inset-0 h-full w-full"
                src={assets.video}
                poster={assets.poster}
                muted
                playsInline
                preload="auto"
                aria-hidden
              />
            ) : null}
            {assets && holdFinished ? (
              <img
                src={assets.finished}
                alt=""
                className="shake-end-still pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden
              />
            ) : null}
            <div
              className="shake-cinema-film-grade pointer-events-none absolute inset-0 z-[1] hidden lg:block"
              aria-hidden
            />
            <div
              className="shake-film-grade pointer-events-none absolute inset-0 z-[1] lg:hidden"
              aria-hidden
            />
            <div
              className="shake-cinema-panel-frame pointer-events-none absolute inset-0 z-[2] hidden lg:block"
              aria-hidden
            />
          </div>
        </div>

        <div className="relative z-10 hidden min-w-0 lg:flex lg:h-[86vh] lg:flex-col lg:justify-center">
          <div
            className="shake-type-veil pointer-events-none absolute inset-y-0 -inset-x-12"
            aria-hidden
          />
          <ShakeCopy activeStep={activeStep} headingId="shake-heading" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background/88 via-background/38 to-transparent px-5 pb-[max(2.25rem,env(safe-area-inset-bottom))] pt-12 sm:px-8 lg:hidden">
        <ShakeCopy
          activeStep={activeStep}
          mobile
          headingId="shake-heading-phone"
        />
      </div>
    </section>
  );
}
