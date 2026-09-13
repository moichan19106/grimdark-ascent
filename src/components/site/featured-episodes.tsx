import Image from "next/image";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import {
  featuredVideos,
  thumbnailUrl,
  watchUrl,
  type FeaturedVideo,
} from "@/content/videos";

export function FeaturedEpisodes() {
  const [primary, ...secondary] = featuredVideos;

  return (
    <section
      id="watch"
      aria-labelledby="watch-heading"
      className="scroll-mt-20 border-t border-border py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div id="watch-heading">
          <SectionHeading
            title="Start with a fate."
            supporting="Three different doors into the 41st Millennium."
          />
        </div>

        {/* 12-Column Editorial Grid: 7 cols primary, 5 cols secondary stacked */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Dominant Hero Feature (7 cols) */}
          <Reveal className="lg:col-span-7">
            <PrimaryFeaturedCard video={primary} />
          </Reveal>

          {/* Secondary Stacked Column (5 cols) */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            {secondary.map((video, index) => (
              <Reveal key={video.id} delay={0.08 * (index + 1)}>
                <SecondaryFeaturedCard video={video} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PrimaryFeaturedCard({ video }: { video: FeaturedVideo }) {
  const href = watchUrl(video.id);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood"
    >
      {/* Thumbnail Frame: subtle dark framing with thin hairlines */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2px] border border-border/80 bg-surface shadow-2xl transition-all duration-500 group-hover:border-border-strong">
        <Image
          src={thumbnailUrl(video.id)}
          alt={video.title}
          fill
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
        {/* Dark framing gradient vignette around edge to ground bright rank thumbnails */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_60%,rgba(11,13,15,0.65)_100%)]" />
        
        {/* Small duration badge in bottom corner */}
        <div className="absolute bottom-3 right-3 rounded-[2px] bg-background/90 px-2.5 py-1 font-mono text-[11px] font-medium tracking-[0.1em] text-foreground backdrop-blur-sm">
          {video.duration}
        </div>
      </div>

      {/* Editorial Content Block */}
      <div className="mt-5 flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.24em] text-blood">
          {video.category}
        </span>
        <h3 className="font-display text-2xl font-bold uppercase leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-blood-strong sm:text-3xl lg:text-[34px]">
          {video.title}
        </h3>
      </div>
    </a>
  );
}

function SecondaryFeaturedCard({ video }: { video: FeaturedVideo }) {
  const href = watchUrl(video.id);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2px] border border-border/80 bg-surface transition-all duration-500 group-hover:border-border-strong">
        <Image
          src={thumbnailUrl(video.id)}
          alt={video.title}
          fill
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_60%,rgba(11,13,15,0.65)_100%)]" />

        <div className="absolute bottom-2.5 right-2.5 rounded-[2px] bg-background/90 px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.1em] text-foreground backdrop-blur-sm">
          {video.duration}
        </div>
      </div>

      <div className="mt-3.5 flex flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-blood">
          {video.category}
        </span>
        <h3 className="font-display text-xl font-bold uppercase leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-blood-strong sm:text-2xl">
          {video.title}
        </h3>
      </div>
    </a>
  );
}
