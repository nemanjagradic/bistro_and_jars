"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";

export function useScrollReveal<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = node.getBoundingClientRect();
    const alreadyVisible =
      rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    if (alreadyVisible) return;

    node.dataset.reveal = "pending";

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        node.dataset.reveal = "in";
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
};

export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={className ? `scroll-reveal ${className}` : "scroll-reveal"}>
      {children}
    </div>
  );
}
