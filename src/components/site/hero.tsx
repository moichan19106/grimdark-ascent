"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { latestVideo, watchUrl } from "@/content/videos";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-20 md:pt-24 lg:pt-16"
    >
      {/* Desktop Canvas Background Artwork: occupies right 76-82% with cinematic bleed */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 top-0 hidden w-[76%] lg:block xl:w-[82%]"
      >
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src="/art/hero-fates.png"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 82vw"
            className="drift-slow object-cover object-[72%_35%] scale-[1.06] origin-right"
          />
          {/* Multi-stop atmospheric vignette: smoothly melts dark negative space into #0B0D0F */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 via-35% via-background/30 via-65% to-transparent" />
          <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent" />
          {/* Top and bottom edge feathering */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col justify-center px-5 py-8 md:px-8 lg:min-h-[calc(100dvh-5rem)] lg:py-16">
        <motion.div
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="max-w-[760px] lg:max-w-[580px] xl:max-w-[660px]"
        >
          {/* Eyebrow */}
          <motion.p
            variants={item}
            className="font-mono text-xs font-medium tracking-[0.28em] text-steel sm:text-sm"
          >
            WARHAMMER 40,000 <span className="text-blood">/</span> IMMERSIVE POV
          </motion.p>

          {/* H1: Wake up in the 41st Millennium (strictly 2 lines on desktop) */}
          <motion.h1
            id="hero-heading"
            variants={item}
            className="mt-6 max-w-[14ch] font-display text-[clamp(2.8rem,8.5vw,4.8rem)] font-bold uppercase leading-[0.92] tracking-tight text-foreground sm:text-[clamp(3.8rem,8.5vw,6rem)] lg:text-[82px] xl:text-[100px]"
          >
            WAKE UP IN THE
            <br />
            41ST MILLENNIUM.
          </motion.h1>

          {/* Body (~500px width for tight vertical rhythm) */}
          <motion.p
            variants={item}
            className="mt-6 max-w-[480px] text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl"
          >
            Immersive, canon-conscious Warhammer 40K stories about what it feels
            like to live, fight, transform and survive.
          </motion.p>

          {/* CTAs: Watch Latest & Browse Episodes */}
          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10"
          >
            <a
              href={watchUrl(latestVideo.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[2px] bg-blood px-8 py-4 font-mono text-xs font-semibold tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:bg-blood-strong active:translate-y-[1px]"
            >
              WATCH LATEST
            </a>
            <a
              href="#archive"
              className="inline-flex items-center justify-center rounded-[2px] border border-border-strong px-8 py-4 font-mono text-xs font-semibold tracking-[0.2em] text-foreground transition-all duration-300 hover:border-foreground/50 hover:bg-surface active:translate-y-[1px]"
            >
              BROWSE EPISODES
            </a>
          </motion.div>
        </motion.div>

        {/* Mobile / Tablet Hero Illustration (<lg): seamless atmospheric blend */}
        <motion.div
          variants={item}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-[2px] lg:hidden"
        >
          <Image
            src="/art/hero-fates.png"
            alt="Four warriors of the 41st Millennium: Ultramarine, Death Korps trench soldier, Necron immortal, and Chaos Space Marine."
            fill
            priority
            sizes="100vw"
            className="object-cover object-[70%_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
