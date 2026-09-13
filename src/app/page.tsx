import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { DescriptorStrip } from "@/components/site/descriptor-strip";
import { FeaturedEpisodes } from "@/components/site/featured-episodes";
import { ChooseYourPath } from "@/components/site/choose-your-path";
import { Manifesto } from "@/components/site/manifesto";
import { CanonMethod } from "@/components/site/canon-method";
import { EpisodeArchive } from "@/components/site/episode-archive";
import { FinalCTA } from "@/components/site/final-cta";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import {
  featuredVideos,
  toIsoDuration,
  thumbnailUrl,
  watchUrl,
} from "@/content/videos";

/**
 * VideoObject structured data for the three featured episodes. Only fields
 * that are factually known are emitted: name, duration, thumbnail, watch URL,
 * and publisher.
 */
const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Featured episodes",
  itemListElement: featuredVideos.map((video, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "VideoObject",
      name: video.title,
      description:
        "Immersive, canon-conscious Warhammer 40K POV storytelling from GrimdarkAscent.",
      duration: toIsoDuration(video.duration),
      thumbnailUrl: [thumbnailUrl(video.id)],
      url: watchUrl(video.id),
      publisher: {
        "@type": "Organization",
        name: "GrimdarkAscent",
      },
    },
  })),
};

export default function Home() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[2px] focus:bg-blood focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-[0.18em] focus:text-primary-foreground"
      >
        SKIP TO CONTENT
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <DescriptorStrip />
        <FeaturedEpisodes />
        <ChooseYourPath />
        <Manifesto />
        <CanonMethod />
        <EpisodeArchive />
        <FinalCTA />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
