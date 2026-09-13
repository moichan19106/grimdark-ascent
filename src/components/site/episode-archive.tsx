import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { archiveVideos, thumbnailUrl, watchUrl, type ArchiveVideo } from "@/content/videos";
import { siteConfig } from "@/config/site";

// Rhythm: Row 1 [7, 5], Row 2 [5, 7], Row 3 [7, 5] with subtle vertical offsets
const ROW_CONFIG = [
  { span: "lg:col-span-7", offset: "" },
  { span: "lg:col-span-5", offset: "lg:mt-6" },
  { span: "lg:col-span-5", offset: "lg:mt-4" },
  { span: "lg:col-span-7", offset: "" },
  { span: "lg:col-span-7", offset: "" },
  { span: "lg:col-span-5", offset: "lg:mt-8" },
];

export function EpisodeArchive() {
  return (
    <section
      id="archive"
      aria-labelledby="archive-heading"
      className="scroll-mt-20 border-t border-border py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div id="archive-heading">
          <SectionHeading
            title="Enter the archive."
            supporting="More lives from across the 41st Millennium."
          />
        </div>

        {/* 12-Column True Editorial Mosaic: tightened row rhythm */}
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-7 lg:gap-y-7">
          {archiveVideos.map((video, index) => {
            const config = ROW_CONFIG[index] ?? { span: "lg:col-span-6", offset: "" };

            return (
              <Reveal
                key={video.id}
                delay={0.07 * (index % 3)}
                className={`${config.span} ${config.offset}`}
              >
                <ArchiveCard video={video} />
              </Reveal>
            );
          })}
        </div>

        {/* End CTA: View all on YouTube */}
        <Reveal className="mt-16 sm:mt-20 flex justify-start">
          <a
            href={siteConfig.youtubeVideosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2.5 rounded-[2px] border border-border-strong px-8 py-4 font-mono text-xs font-semibold tracking-[0.2em] text-foreground transition-all duration-300 hover:border-foreground/50 hover:bg-surface active:translate-y-[1px]"
          >
            VIEW ALL ON YOUTUBE
            <ArrowUpRight
              size={15}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blood-strong"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function ArchiveCard({ video }: { video: ArchiveVideo }) {
  const href = watchUrl(video.id);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood"
    >
      {/* 16:9 Thumbnail Frame with dark framing hairlines */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2px] border border-border/80 bg-surface transition-all duration-500 group-hover:border-border-strong">
        <Image
          src={thumbnailUrl(video.id)}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 58vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
        {/* Subtle dark framing edge gradient */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_62%,rgba(11,13,15,0.6)_100%)]" />

        {/* Duration badge */}
        <div className="absolute bottom-2.5 right-2.5 rounded-[2px] bg-background/90 px-2 py-0.5 font-mono text-[10px] font-medium tracking-[0.1em] text-foreground backdrop-blur-sm">
          {video.duration}
        </div>
      </div>

      {/* Editorial Content */}
      <div className="mt-4 flex flex-col gap-1.5">
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
