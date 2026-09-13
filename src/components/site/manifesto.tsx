import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { ManifestoOutlineLine } from "@/components/site/manifesto-outline-line";

/**
 * Manifesto section: high-impact typographic statement with 3 staggered lines
 * and the 6 unified circular fate portraits interacting directly with the copy.
 */
export function Manifesto() {
  return (
    <section
      aria-labelledby="manifesto-heading"
      className="overflow-hidden border-t border-border py-24 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <h2 id="manifesto-heading" className="sr-only">
          Every Rank. Every Faction. Every Fate.
        </h2>

        {/* Staggered 3-Line Headline with Deliberately Different Starting Points */}
        <div aria-hidden="true" className="flex flex-col gap-2">
          {/* Line 1: Left-aligned */}
          <Reveal delay={0.05} y={24} amount={0.4}>
            <p className="font-display text-[clamp(2.5rem,9vw,8.5rem)] font-bold uppercase leading-[0.93] tracking-tight text-foreground">
              EVERY RANK.
            </p>
          </Reveal>

          {/* Line 2: Indented with safe mobile padding, Outlined with High Stroke Contrast */}
          <Reveal delay={0.15} y={24} amount={0.4}>
            <ManifestoOutlineLine line="EVERY FACTION." />
          </Reveal>

          {/* Line 3: Indented with safe mobile padding */}
          <Reveal delay={0.25} y={24} amount={0.4}>
            <p className="pl-8 sm:pl-[12vw] font-display text-[clamp(2.5rem,9vw,8.5rem)] font-bold uppercase leading-[0.93] tracking-tight text-foreground">
              EVERY FATE.
            </p>
          </Reveal>
        </div>

        {/* Supporting Line */}
        <Reveal delay={0.3} className="mt-8 sm:mt-10">
          <p className="max-w-[44ch] text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl">
            The galaxy does not give everyone the same story.
          </p>
        </Reveal>

        {/* Fate Portraits Strip: 6 bust medallions positioned below and interacting with the type */}
        <Reveal delay={0.2} className="mt-14 sm:mt-18 lg:mt-20">
          <div className="relative mx-auto aspect-[16/6] w-full max-w-[1400px] overflow-hidden sm:aspect-[16/5] lg:aspect-[16/4]">
            <Image
              src="/art/fate-portraits.png"
              alt="Six distinct circular medal portraits representing different fates across the 41st Millennium."
              fill
              sizes="(max-width: 768px) 100vw, 1400px"
              className="drift-pan object-cover object-center"
            />
            {/* Seamless edge feathering into deep #0B0D0F background */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-background to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-8 sm:h-12 bg-gradient-to-b from-background to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 sm:h-12 bg-gradient-to-t from-background to-transparent z-10" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
