"use client";

import { useEffect, useRef, useState } from "react";
import { CaretUp } from "@phosphor-icons/react/dist/ssr";

/**
 * "Back to top" utility for the long single page.
 *
 * Visibility is driven by an IntersectionObserver on a sentinel placed one
 * viewport below the page top, so there is no scroll listener and no state
 * updated per scroll frame (spec performance rules). Scrolling to the top
 * defers to the CSS `scroll-behavior` property, which already collapses to
 * `auto` under prefers-reduced-motion.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[100dvh] h-px w-px"
      />
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        data-back-to-top
        tabIndex={visible ? 0 : -1}
        className={`fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-[4px] border border-border-strong bg-surface/90 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:border-blood hover:text-blood-strong ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <CaretUp size={18} weight="bold" aria-hidden="true" />
      </button>
    </>
  );
}
