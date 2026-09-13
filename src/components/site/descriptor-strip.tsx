"use client";

import { Reveal } from "@/components/site/reveal";

const DESCRIPTORS = [
  "POV STORYTELLING",
  "CANON-CONSCIOUS",
  "LONG-FORM 40K",
] as const;

/**
 * Restrained typographic descriptor strip directly under the hero.
 * Thin separators, no decorative dots, no cards. Each cell carries a small
 * blood tick before the label and enters with a light staggered reveal.
 */
export function DescriptorStrip() {
  return (
    <section aria-label="Channel format" className="border-y border-border">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-border px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:px-8">
        {DESCRIPTORS.map((label, index) => (
          <Reveal key={label} delay={index * 0.1} y={10} amount={0.5}>
            <p className="py-4 text-center font-mono text-xs tracking-[0.3em] text-steel">
              <span
                aria-hidden="true"
                className="mr-3 inline-block h-px w-5 bg-blood/70 align-middle"
              />
              {label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
