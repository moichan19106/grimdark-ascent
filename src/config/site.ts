export const siteConfig = {
  name: "GrimdarkAscent",
  youtubeUrl: "https://www.youtube.com/@grimdarkascent40k",
  youtubeVideosUrl: "https://www.youtube.com/@grimdarkascent40k/videos",
  xUrl: "REPLACE_WITH_X_URL",
  businessEmail: "chonosuke19106@gmail.com",
  siteUrl: "https://grimdarkascent40k.vercel.app",
} as const;

/**
 * Returns true when a configured value is still an unfilled placeholder.
 * Placeholder links are never rendered into the page.
 */
export function isPlaceholder(value: string): boolean {
  return value.startsWith("REPLACE_WITH");
}

export const disclaimer =
  "GrimdarkAscent is an unofficial fan-made channel. Warhammer 40,000 and related names and marks belong to their respective owners.";
