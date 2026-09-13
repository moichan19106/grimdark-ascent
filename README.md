# GrimdarkAscent | The Grimdark Archive

The official creator landing page for **GrimdarkAscent**, an unofficial fan-made Warhammer 40,000 channel publishing immersive POV stories: "Wake up in the 41st Millennium."

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and Motion. Zero backend, zero database, zero authentication, and zero YouTube API keys required. Every episode thumbnail directly connects viewers to the official YouTube channel.

---

## EDIT THESE BEFORE DEPLOYING

Open:

```
src/config/site.ts
```

You will find these values:

```ts
export const siteConfig = {
  name: "GrimdarkAscent",
  youtubeUrl: "https://www.youtube.com/@grimdarkascent40k",
  youtubeVideosUrl: "https://www.youtube.com/@grimdarkascent40k/videos",
  xUrl: "REPLACE_WITH_X_URL",
  businessEmail: "chonosuke19106@gmail.com",
  siteUrl: "REPLACE_WITH_DEPLOYED_SITE_URL",
} as const;
```

1. **YouTube URL**: Already pre-configured with the official channel link (`https://www.youtube.com/@grimdarkascent40k`).
2. **Business Email**: Already configured with your contact email (`chonosuke19106@gmail.com`).
3. **X URL**: Replace `"REPLACE_WITH_X_URL"` with your real X/Twitter profile link (e.g., `https://x.com/grimdarkascent`).
4. **Deployed Domain**: Replace `"REPLACE_WITH_DEPLOYED_SITE_URL"` with your live domain (e.g., `https://grimdarkascent.com`).

> **Placeholder Safety**: While values begin with `REPLACE_WITH`, the site automatically hides those links so no broken links or empty mailto links are ever rendered to visitors. As soon as you fill them in, the links appear in the footer.

---

## Install

From the project root:

```bash
npm install
```

---

## Development

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

Compile and test the production build:

```bash
npm run build
```

Run the compiled production server locally:

```bash
npm run start
```

---

## Deploy

This project is a standard Next.js application that can be deployed anywhere:
- **Vercel**: Push to a GitHub repository and import into Vercel. Zero configuration required.
- **Node.js Server**: Run `npm run build` followed by `npm run start`.
- **Docker / Container**: Deploy with any standard Node.js Next.js container.

---

## Updating Videos

All episode definitions are stored in a single, easily editable configuration file:

```
src/content/videos.ts
```

### 1. Featured Doors (`featuredVideos`)
The three primary video entries displayed in the hero "Start with a fate" section:
- The first entry is the dominant 7-column feature.
- The next two entries stack in the 5-column secondary column.

### 2. Archive Mosaic (`archiveVideos`)
The six recent episodes displayed in the editorial mosaic grid:

```ts
{
  id: "Z-lkyZ062pc",              // YouTube video ID (from youtube.com/watch?v=...)
  title: "POV: Your Life as an Ultramarine Space Marine",
  duration: "54:31",              // Display duration
  category: "POV Life",           // Category label
  isLatest: true,                 // Optional: marks the latest episode for the hero CTA
}
```

* **Automatic Thumbnails**: YouTube thumbnails are loaded directly from YouTube CDN (`https://i.ytimg.com/vi/<id>/maxresdefault.jpg`). No manual image uploading required.
* **Direct Links**: Clicking any thumbnail or title opens the video directly on YouTube.

---

## Replacing Custom Artwork

All custom illustrations live in:

```
public/art/
```

The site uses a unified 2D cel-animated graphic novel aesthetic with clean black ink outlines, two-level cel shading, and a dark grimdark palette:

| File | Section | Description & Proportions |
|---|---|---|
| `hero-fates.png` | Hero | Wide 16:9 canvas composition showing four distinct lives across a battlefield. Left 35% is dark negative space for headline typography. |
| `path-pov.png` | Fate Gate 1 | Vertical 3:4 panel: Lone Death Korps trench infantryman advancing through gothic rubble. |
| `path-hierarchy.png` | Fate Gate 2 | Vertical 3:4 panel: Imperial Naval hierarchy (enlisted, commander, admiral). |
| `path-transformation.png` | Fate Gate 3 | Vertical 3:4 panel: One subject across 3 stages of Space Marine transformation. |
| `path-worlds.png` | Fate Gate 4 | Vertical 3:4 panel: Lone survivor overlooking a lethal alien death world. |
| `fate-portraits.png` | Manifesto | Wide panoramic strip showing six circular medal bust portraits on a dark neutral background. |
| `canon-method.png` | Method | Asymmetric dossier artifact: Imperial archive desk with parchment, star-charts, and candlelight. |
| `final-transmission.png` | Final CTA | Wide 16:9 cinematic dusk horizon over ruined gothic spires with silhouetted warriors on the ridge. |

To replace artwork, simply drop new images with matching filenames into `public/art/`.

---

## Project Structure

```
├── public/
│   ├── art/                   # Custom 2D animated illustrations
│   ├── icons/                 # PWA application icons
│   ├── favicon.ico
│   ├── icon.svg
│   └── og.jpg                 # OpenGraph social card image
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind v4 theme and locked color system
│   │   ├── layout.tsx         # Root layout, fonts, and SEO metadata
│   │   ├── not-found.tsx      # Branded 404 error page
│   │   ├── page.tsx           # Single-page editorial landing layout
│   │   └── sitemap.ts         # Dynamic sitemap generator
│   ├── components/
│   │   └── site/
│   │       ├── header.tsx           # Minimal sticky navigation
│   │       ├── hero.tsx             # Off-grid image-as-canvas hero
│   │       ├── descriptor-strip.tsx # 3-item format descriptor rail
│   │       ├── featured-episodes.tsx# 12-column editorial featured grid
│   │       ├── choose-your-path.tsx # The Four Fate Gates interactive panels
│   │       ├── manifesto.tsx        # 3-line staggered brand manifesto
│   │       ├── canon-method.tsx     # Asymmetric dossier archive layout
│   │       ├── episode-archive.tsx  # 12-column editorial mosaic archive
│   │       ├── final-cta.tsx        # Cinematic transmission CTA
│   │       ├── footer.tsx           # Clean creator footer
│   │       ├── back-to-top.tsx      # Smooth scroll-to-top utility
│   │       ├── reveal.tsx           # Scroll reveal animation wrapper
│   │       └── section-heading.tsx  # Editorial section header primitive
│   ├── config/
│   │   └── site.ts            # Central site and contact configuration
│   ├── content/
│   │   └── videos.ts          # Central YouTube episode content list
│   └── lib/
│       └── utils.ts           # Classnames helper (cn)
├── next.config.ts             # Next.js configuration
├── package.json               # Cleaned dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

---

## License & Disclaimer

GrimdarkAscent is an unofficial fan-made channel and website. Warhammer 40,000 and related marks, names, and images belong to Games Workshop Limited.
