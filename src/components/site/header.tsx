"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { List, X, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/config/site";

const NAV_ITEMS = [
  { label: "WATCH", href: "#watch" },
  { label: "PATHS", href: "#paths" },
  { label: "METHOD", href: "#method" },
  { label: "ARCHIVE", href: "#archive" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  // Damps the reading-progress hairline so it glides instead of jittering.
  // Reduced-motion users get the raw, unsmoothed value: the bar then moves
  // strictly 1:1 with their scrolling and never animates on its own.
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    mass: 0.4,
  });
  const progress = prefersReducedMotion ? scrollYProgress : smoothed;
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 16);
  });

  // Highlight the nav item whose section currently crosses the reading band.
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.href.slice(1))
    ).filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // While the menu is open the rest of the page goes inert, so keyboard
  // focus and screen readers cannot wander into the background content.
  // Removing the attribute on cleanup restores everything on close.
  useEffect(() => {
    if (!menuOpen) return;
    const backdrop = [
      document.getElementById("main"),
      document.querySelector("footer"),
      document.querySelector("[data-back-to-top]"),
    ].filter((el): el is HTMLElement => Boolean(el));
    backdrop.forEach((el) => el.setAttribute("inert", ""));
    return () => backdrop.forEach((el) => el.removeAttribute("inert"));
  }, [menuOpen]);

  // If the viewport grows past the lg breakpoint while the menu is open
  // (device rotation, window resize) the panel becomes lg:hidden but its
  // open state and inert backdrop would silently stick around. Close it.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || menuOpen
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-5 md:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 font-display text-xl font-bold uppercase tracking-wide text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood"
          aria-label="GrimdarkAscent, back to top"
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[2px] border border-border bg-surface transition-transform duration-300 group-hover:scale-105 group-hover:border-blood/50">
            <Image
              src="/logo.png"
              alt="GrimdarkAscent logo"
              width={36}
              height={36}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <span>
            GRIMDARK
            <span className="text-blood transition-colors duration-300 group-hover:text-blood-strong">
              ASCENT
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`relative py-2 font-mono text-xs tracking-[0.22em] transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-blood after:transition-all after:duration-300 ${
                  isActive
                    ? "text-foreground after:w-full"
                    : "text-muted-foreground after:w-0 hover:text-foreground hover:after:w-full"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={siteConfig.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-[4px] bg-blood px-4 py-2 font-mono text-xs font-semibold tracking-[0.18em] text-primary-foreground transition-colors duration-300 hover:bg-blood-strong active:translate-y-[1px] sm:inline-flex"
          >
            <YoutubeLogo size={18} weight="fill" aria-hidden="true" />
            YOUTUBE
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[4px] border border-border-strong text-foreground lg:hidden"
          >
            {menuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <List size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Reading-progress hairline: a 1.5px blood line that fills as the
          reader descends the page. Indicator, not decoration: it only ever
          mirrors the scroll position (transform scaleX), never animates on
          its own, so it stays legitimate under reduced-motion. */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 bottom-0 h-[1.5px] origin-left bg-blood/70"
      />

      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="border-t border-border bg-background/95 backdrop-blur-md lg:hidden"
      >
        <nav
          aria-label="Mobile"
          className="mx-auto flex max-w-[1400px] flex-col px-5 pb-6 pt-2 md:px-8"
        >
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-baseline gap-4 border-b border-border py-4 font-display text-2xl font-semibold uppercase tracking-wide transition-colors ${
                  isActive
                    ? "text-blood-strong"
                    : "text-foreground hover:text-blood-strong"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-xs font-medium tracking-[0.2em] text-steel"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </Link>
            );
          })}
          <a
            href={siteConfig.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-[4px] bg-blood px-4 py-3 font-mono text-sm font-semibold tracking-[0.18em] text-primary-foreground"
          >
            <YoutubeLogo size={20} weight="fill" aria-hidden="true" />
            YOUTUBE
          </a>
        </nav>
      </div>
    </header>
  );
}
