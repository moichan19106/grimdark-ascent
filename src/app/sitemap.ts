import type { MetadataRoute } from "next";
import { siteConfig, isPlaceholder } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (isPlaceholder(siteConfig.siteUrl)) {
    // No deployed domain configured yet; skip sitemap output.
    return [];
  }
  return [
    {
      url: siteConfig.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
