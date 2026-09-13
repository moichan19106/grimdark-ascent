"use client";

import { useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

interface FateGate {
  id: string;
  title: string;
  body: string;
  image: string;
  alt: string;
}

const GATES: FateGate[] = [
  {
    id: "pov-lives",
    title: "POV LIVES",
    body: "Live one fate from the inside, from first breath to final battle.",
    image: "/art/path-pov.png",
    alt: "A lone gas-masked trench infantry soldier moving through gothic ruins.",
  },
  {
    id: "ranks-hierarchies",
    title: "RANKS & HIERARCHIES",
    body: "See how real chains of command, roles and authority actually work.",
    image: "/art/path-hierarchy.png",
    alt: "Three officers of an Imperial Naval hierarchy showing progressive authority.",
  },
  {
    id: "transformations",
    title: "TRANSFORMATIONS & UPRISINGS",
    body: "Follow escalation only where the lore actually supports the connection.",
    image: "/art/path-transformation.png",
    alt: "Three sequential stages of one human transforming into a fully armored Space Marine.",
  },
  {
    id: "worlds-survival",
    title: "WORLDS & SURVIVAL",
    body: "Experience the planets, trenches, hives and battlefields that shape every life inside them.",
    image: "/art/path-worlds.png",
    alt: "A survivor overlooking a lethal alien death world with distant hive spires.",
  },
];

export function ChooseYourPath() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section
      id="paths"
      aria-labelledby="paths-heading"
      className="scroll-mt-20 border-t border-border py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div id="paths-heading">
          <SectionHeading
            title="Choose how you enter."
            supporting="Different stories. Different rules. Different fates."
          />
        </div>

        {/* ================================================================
            DESKTOP SIGNATURE COMPONENT: THE FOUR FATE GATES (Accordion Row)
            Initial: ~25% each. Active: expands to ~40%.
            Labels always visible; description smoothly reveals on active.
            ================================================================ */}
        <div className="mt-14 hidden lg:flex h-[600px] xl:h-[660px] w-full gap-3 overflow-hidden">
          {GATES.map((gate, index) => {
            const isActive = active === index;

            return (
              <div
                key={gate.id}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                aria-label={`${gate.title}: ${gate.body}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(index);
                  }
                }}
                style={{
                  flex: isActive ? "1.8 1 0%" : "1 1 0%",
                }}
                className={`relative h-full cursor-pointer overflow-hidden rounded-[2px] border transition-[flex,border-color] ${
                  reduce ? "duration-0" : "duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                } ${
                  isActive
                    ? "border-blood/60 shadow-[0_0_30px_rgba(196,58,50,0.12)]"
                    : "border-border/80 hover:border-border-strong"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood`}
              >
                {/* Full-bleed generated artwork with crisp midtone separation */}
                <Image
                  src={gate.image}
                  alt={gate.alt}
                  fill
                  sizes="(max-width: 1400px) 45vw, 600px"
                  className={`object-cover object-center brightness-105 contrast-105 transition-transform ${
                    reduce ? "duration-0" : "duration-700 ease-out"
                  } ${isActive ? "scale-[1.03]" : "scale-100 opacity-90"}`}
                />

                {/* Controlled bottom dark vignette: protects title/body readability without swallowing upper midtones */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background/30 to-transparent" />

                {/* Text Content positioned low in the panel */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 xl:p-8">
                  {/* Gate index / eyebrow */}
                  <span
                    aria-hidden="true"
                    className={`font-mono text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors duration-300 ${
                      isActive ? "text-blood" : "text-steel"
                    }`}
                  >
                    GATE 0{index + 1}
                  </span>

                  {/* Panel Label: visible on every panel at all times */}
                  <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-none tracking-tight text-foreground xl:text-3xl">
                    {gate.title}
                  </h3>

                  {/* Short Description: smoothly expands and reveals on active */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] ${
                      reduce ? "duration-0" : "duration-500 ease-out"
                    } ${
                      isActive
                        ? "mt-3 grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[34ch] text-sm leading-relaxed text-muted-foreground xl:text-base">
                        {gate.body}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================
            TABLET: 2 x 2 Visual Grid (no accordion requirement)
            ================================================================ */}
        <div className="mt-12 hidden md:grid lg:hidden grid-cols-2 gap-5">
          {GATES.map((gate, index) => (
            <div
              key={gate.id}
              className="relative aspect-[4/3] overflow-hidden rounded-[2px] border border-border/80 bg-surface"
            >
              <Image
                src={gate.image}
                alt={gate.alt}
                fill
                sizes="50vw"
                className="object-cover object-center brightness-105 contrast-105"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-blood">
                  GATE 0{index + 1}
                </span>
                <h3 className="mt-1.5 font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                  {gate.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {gate.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================================================================
            MOBILE: Four Large Stacked Image Blocks (<md)
            Image first. Label and copy immediately below. No hover dependency.
            ================================================================ */}
        <div className="mt-10 flex flex-col gap-8 md:hidden">
          {GATES.map((gate, index) => (
            <Reveal key={gate.id} delay={index * 0.06}>
              <article className="flex flex-col overflow-hidden rounded-[2px] border border-border/80 bg-surface">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={gate.image}
                    alt={gate.alt}
                    fill
                    sizes="100vw"
                    className="object-cover object-center brightness-105 contrast-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-blood">
                    GATE 0{index + 1}
                  </span>
                  <h3 className="mt-1.5 font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                    {gate.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {gate.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
