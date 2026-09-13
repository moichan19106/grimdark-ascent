import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig, isPlaceholder } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = isPlaceholder(siteConfig.siteUrl)
  ? "https://grimdarkascent.com"
  : siteConfig.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: "GrimdarkAscent | Immersive Warhammer 40K Stories",
  description:
    "Immersive, canon-conscious Warhammer 40K stories exploring the lives, ranks, factions and fates of the 41st Millennium.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "GrimdarkAscent | Immersive Warhammer 40K Stories",
    description:
      "Immersive, canon-conscious Warhammer 40K stories exploring the lives, ranks, factions and fates of the 41st Millennium.",
    type: "website",
    siteName: siteConfig.name,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "GrimdarkAscent: Wake up in the 41st Millennium.",
      },
    ],
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "GrimdarkAscent | Immersive Warhammer 40K Stories",
    description:
      "Immersive, canon-conscious Warhammer 40K stories exploring the lives, ranks, factions and fates of the 41st Millennium.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0d0f",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  description:
    "Immersive, canon-conscious Warhammer 40K stories exploring the lives, ranks, factions and fates of the 41st Millennium.",
  ...(siteUrl ? { url: siteUrl } : {}),
  sameAs: [siteConfig.youtubeUrl],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${barlowCondensed.variable} font-sans antialiased bg-background text-foreground`}
      >
        {/* Episode thumbnails come from the YouTube CDN; warm the connection early */}
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <div className="grain-overlay" aria-hidden="true" />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
