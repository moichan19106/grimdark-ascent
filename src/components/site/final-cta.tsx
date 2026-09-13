import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { siteConfig } from "@/config/site";

export function FinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden border-t border-border"
    >
      {/* Wide Cinematic Illustration Backdrop */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0">
          <Image
            src="/art/final-transmission.png"
            alt=""
            fill
            sizes="100vw"
            className="drift-slow object-cover object-center"
          />
        </div>
        {/* Dark tonal gradients: preserve deep dark negative space in bottom-left for action copy */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Action Content positioned bottom-left */}
      <div className="relative mx-auto flex min-h-[65dvh] max-w-[1400px] flex-col justify-end px-5 py-24 md:px-8 md:py-36">
        <Reveal>
          <div className="max-w-[620px]">
            <h2
              id="final-cta-heading"
              className="font-display text-[clamp(2.8rem,7.5vw,5.8rem)] font-bold uppercase leading-[0.93] tracking-tight text-foreground"
            >
              PICK A FATE.
              <br />
              PRESS PLAY.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              The next life begins on GrimdarkAscent.
            </p>
            <div className="mt-8 sm:mt-10">
              <a
                href={siteConfig.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-[2px] bg-blood px-9 py-4 font-mono text-xs font-semibold tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:bg-blood-strong active:translate-y-[1px]"
              >
                WATCH GRIMDARKASCENT
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
