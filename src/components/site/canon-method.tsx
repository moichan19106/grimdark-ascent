import Image from "next/image";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";

const PRINCIPLES = [
  {
    num: "01",
    title: "POV, NOT SUMMARY",
    body: "The story starts inside a life, not above it.",
  },
  {
    num: "02",
    title: "CANON-CONSCIOUS",
    body: "Ranks, factions and transformations stay anchored to established lore.",
  },
  {
    num: "03",
    title: "SEPARATE FATES STAY SEPARATE",
    body: "When the lore describes different lives, the channel does not pretend they form one career ladder.",
  },
] as const;

export function CanonMethod() {
  return (
    <section
      id="method"
      aria-labelledby="method-heading"
      className="scroll-mt-20 border-t border-border py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div id="method-heading">
          <SectionHeading
            title="Lore stays intact."
            supporting="Immersion works better when the universe still follows its own rules."
          />
        </div>

        {/* Asymmetric Editorial Archive Layout: Dossier Artifact (~58%) + Principles (remaining) */}
        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* Dossier Illustration Artifact (Col span 7) */}
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-border bg-surface shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
              <Image
                src="/art/canon-method.png"
                alt="Imperial archive table dossier with vellum diagrams, purity seals, armor schematics, star charts, and low candlelight."
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center brightness-105 contrast-105"
              />
              {/* Metal table highlight and archival edge vignette */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_80%_at_50%_40%,transparent_60%,rgba(11,13,15,0.6)_100%)]" />
            </div>
          </Reveal>

          {/* Three Principles Column (Col span 5): Separated by thin hairlines, no cards */}
          <div className="flex flex-col justify-center lg:col-span-5">
            {PRINCIPLES.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.09}>
                <div
                  className={`py-7 first:pt-0 last:pb-0 ${
                    index > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs font-semibold tracking-[0.24em] text-blood"
                    >
                      {principle.num}
                    </span>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl">
                      {principle.title}
                    </h3>
                  </div>
                  <p className="mt-3 pl-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {principle.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
