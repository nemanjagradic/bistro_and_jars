"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import { createPortal } from "react-dom";
import { GALLERY_ALT, type GalleryPhoto } from "../lib/gallery";
import { useLanguage } from "./language-provider";

type GalleryLightboxProps = {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

const SWIPE_PX = 50;
const STAGE_SIZES = "100vw";
// Heavily blurred, so a thumbnail is visually identical and far cheaper to decode and blur.
const BACKDROP_SIZES = "64px";

export function GalleryLightbox({
  photos,
  index,
  onClose,
  onIndexChange,
}: GalleryLightboxProps) {
  const { copy } = useLanguage();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const indexRef = useRef(index);
  const labelId = useId();
  const photo = photos[index];
  const [shown, setShown] = useState(photo);
  const [backdrop, setBackdrop] = useState(photo);
  const [backdropReadyId, setBackdropReadyId] = useState<string | null>(null);
  const total = photos.length;

  useLayoutEffect(() => {
    indexRef.current = index;
  }, [index]);
  const prevPhoto = total > 0 ? photos[(index - 1 + total) % total] : undefined;
  const nextPhoto = total > 0 ? photos[(index + 1) % total] : undefined;

  const go = useCallback(
    (delta: number) => {
      if (total === 0) return;
      setBackdropReadyId(null);
      onIndexChange((indexRef.current + delta + total) % total);
    },
    [onIndexChange, total],
  );

  useEffect(() => {
    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
        return;
      }
      if (event.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;
      const focusable = [
        ...root.querySelectorAll<HTMLElement>("button:not([disabled])"),
      ];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      restoreFocusRef.current?.focus();
    };
  }, [go, onClose]);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = event.changedTouches[0]?.clientX;
    if (end == null) return;
    const delta = end - start;
    if (delta > SWIPE_PX) go(-1);
    if (delta < -SWIPE_PX) go(1);
  };

  if (!photo) return null;

  const stageLayers =
    shown && shown.id !== photo.id ? [shown, photo] : [photo];
  const backdropLayers =
    backdrop && backdrop.id !== photo.id ? [backdrop, photo] : [photo];
  const neighbors = [prevPhoto, nextPhoto].filter(
    (neighbor, i, list): neighbor is GalleryPhoto =>
      !!neighbor &&
      neighbor.id !== photo.id &&
      list.findIndex((other) => other?.id === neighbor.id) === i,
  );

  return createPortal(
    <div
      ref={dialogRef}
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {backdropLayers.map((layer) => {
        const incoming = layer.id !== backdrop?.id;
        const state = !incoming
          ? ""
          : backdropReadyId === layer.id
            ? " is-entering"
            : " is-pending";
        return (
          <div
            key={layer.id}
            className={`gallery-lightbox-backdrop${state}`}
            aria-hidden
            onAnimationEnd={
              incoming
                ? (event) => {
                    if (event.target !== event.currentTarget) return;
                    setBackdrop(layer);
                    setBackdropReadyId(null);
                  }
                : undefined
            }
          >
            <Image
              src={layer.src}
              alt=""
              fill
              sizes={BACKDROP_SIZES}
              loading="eager"
              className="gallery-lightbox-backdrop-img"
              onLoad={
                incoming ? () => setBackdropReadyId(layer.id) : undefined
              }
            />
          </div>
        );
      })}
      <div className="gallery-lightbox-dim" aria-hidden />

      <p id={labelId} className="sr-only">
        {copy.gallery}
      </p>

      <button
        ref={closeRef}
        type="button"
        className="gallery-lightbox-close"
        onClick={onClose}
        aria-label={copy.lightboxClose}
      >
        <span aria-hidden>×</span>
      </button>

      <button
        type="button"
        className="gallery-lightbox-arrow gallery-lightbox-arrow--prev"
        onClick={() => go(-1)}
        aria-label={copy.lightboxPrev}
      >
        <span aria-hidden>‹</span>
      </button>

      <figure className="gallery-lightbox-stage">
        {stageLayers.map((layer) => {
          const current = layer.id === photo.id;
          const pending = current && layer.id !== shown?.id;
          return (
            <Image
              key={layer.id}
              src={layer.src}
              alt={current ? GALLERY_ALT : ""}
              aria-hidden={current ? undefined : true}
              fill
              sizes={STAGE_SIZES}
              loading="eager"
              className={`gallery-photo gallery-photo--contain${
                pending ? " is-pending" : ""
              }`}
              onLoad={() => {
                if (photos[indexRef.current]?.id === layer.id) setShown(layer);
              }}
            />
          );
        })}
      </figure>

      <div className="gallery-lightbox-preload" aria-hidden>
        {neighbors.map((neighbor) => (
          <span key={neighbor.id}>
            <Image
              src={neighbor.src}
              alt=""
              width={1}
              height={1}
              sizes={STAGE_SIZES}
              loading="eager"
            />
          </span>
        ))}
      </div>

      <button
        type="button"
        className="gallery-lightbox-arrow gallery-lightbox-arrow--next"
        onClick={() => go(1)}
        aria-label={copy.lightboxNext}
      >
        <span aria-hidden>›</span>
      </button>

      <p className="gallery-lightbox-count" aria-live="polite">
        {index + 1} / {total}
      </p>
    </div>,
    document.body,
  );
}
