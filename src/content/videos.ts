export type VideoCategory =
  | "POV Life"
  | "Ranks & Hierarchy"
  | "Faction Experience"
  | "Transformation"
  | "Worlds & Survival";

export interface VideoEntry {
  /** YouTube video ID. Thumbnails are derived from this. */
  id: string;
  title: string;
  /** Display duration, e.g. "1:04:05". */
  duration: string;
  category: VideoCategory;
}

export interface FeaturedVideo extends VideoEntry {
  featured: true;
}

/**
 * FEATURED EPISODES
 * The three strongest doors into the channel.
 */
export const featuredVideos: FeaturedVideo[] = [
  {
    id: "8fmUTSQtlTc",
    title:
      "From Psyker to Supreme Grand Master: Your Life as a Grey Knight | Warhammer 40K",
    duration: "1:04:05",
    category: "Transformation",
    featured: true,
  },
  {
    id: "Bpe7s3Uwk4c",
    title:
      "Every Level of a World Eater: From War Hound to Daemon Prince | Warhammer 40K",
    duration: "1:06:52",
    category: "Ranks & Hierarchy",
    featured: true,
  },
  {
    id: "t0Rul-EBtrk",
    title: "POV: Your Life as a Carcharodon Space Marine | Warhammer 40K",
    duration: "50:48",
    category: "POV Life",
    featured: true,
  },
];

/**
 * EPISODE ARCHIVE
 * Recent lives from across the 41st Millennium.
 * The first entry occupies the large cell in the archive grid.
 */
export interface ArchiveVideo extends VideoEntry {
  isLatest?: boolean;
}

export const archiveVideos: ArchiveVideo[] = [
  {
    id: "Z-lkyZ062pc",
    title: "POV: Your Life as an Ultramarine Space Marine",
    duration: "54:31",
    category: "POV Life",
    isLatest: true,
  },
  {
    id: "PggxwWHyIyo",
    title: "POV: Your Life in the Death Korps of Krieg | Warhammer 40K",
    duration: "52:00",
    category: "POV Life",
  },
  {
    id: "Od0q5u4S3XE",
    title: "What It Feels Like to Become a Space Wolf | Warhammer 40K",
    duration: "53:59",
    category: "Transformation",
  },
  {
    id: "4LBmL4RcwLI",
    title:
      "Every Single Imperial Navy Ranks Explained: How the Hierarchy Actually Works | Warhammer 40K",
    duration: "1:05:17",
    category: "Ranks & Hierarchy",
  },
  {
    id: "lwAWBpE-Q1U",
    title: "POV: Your Life Through the Black Legion Hierarchy | Warhammer 40K",
    duration: "52:45",
    category: "Ranks & Hierarchy",
  },
  {
    id: "GiYV9i374i8",
    title: "POV: What It's Like to Live on Catachan | Warhammer 40K",
    duration: "54:48",
    category: "Worlds & Survival",
  },
];

/** The newest configured episode. The hero primary CTA links here. */
export const latestVideo: ArchiveVideo =
  archiveVideos.find((video) => video.isLatest) ?? archiveVideos[0];


/** YouTube watch URL for a video ID. */
export function watchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/** YouTube thumbnail URL for a video ID (1280x720 when available). */
export function thumbnailUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

/**
 * Converts a display duration like "1:04:05" or "50:48" into total seconds.
 * Returns 0 for malformed input so callers can treat it as "unknown length".
 */
export function toSeconds(duration: string): number {
  const parts = duration.split(":").map((part) => parseInt(part, 10));
  if (parts.some((part) => Number.isNaN(part))) return 0;
  const [hours, minutes, seconds] =
    parts.length === 3 ? parts : ([0, ...parts] as const);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Converts a display duration like "1:04:05" or "50:48" into an ISO 8601
 * duration for schema.org VideoObject markup ("PT1H4M5S"). Zero-padded
 * components are dropped, so no fabricated precision is introduced.
 */
export function toIsoDuration(duration: string): string {
  const parts = duration.split(":").map((part) => parseInt(part, 10));
  if (parts.some((part) => Number.isNaN(part))) return "";
  const [hours, minutes, seconds] =
    parts.length === 3 ? parts : ([0, ...parts] as const);
  let iso = "PT";
  if (hours) iso += `${hours}H`;
  if (minutes) iso += `${minutes}M`;
  if (seconds) iso += `${seconds}S`;
  return iso;
}
