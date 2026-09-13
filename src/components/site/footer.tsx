import Image from "next/image";
import {
  EnvelopeSimple,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { disclaimer, isPlaceholder, siteConfig } from "@/config/site";

export function Footer() {
  const xConfigured = !isPlaceholder(siteConfig.xUrl);
  const emailConfigured = !isPlaceholder(siteConfig.businessEmail);

  const linkClass =
    "relative inline-flex items-center gap-2 self-start font-mono text-xs tracking-[0.22em] text-muted-foreground transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-blood after:transition-all after:duration-300 hover:text-foreground hover:after:w-full";

  return (
    <footer className="mt-auto border-t border-border bg-surface/50">
      <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-blood via-blood/30 to-transparent" />
      <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand & Tagline with Logo */}
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[2px] border border-border bg-surface">
              <Image
                src="/logo.png"
                alt="GrimdarkAscent logo"
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
                GRIMDARK
                <span className="text-blood">ASCENT</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Every Rank. Every Faction. Every Fate.
              </p>
            </div>
          </div>

          {/* Contact / Links: YouTube, X (if filled), Business Email (if filled) */}
          <nav aria-label="Footer" className="flex flex-col gap-3.5">
            <a
              href={siteConfig.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              <YoutubeLogo size={18} aria-hidden="true" />
              YOUTUBE
            </a>
            {xConfigured ? (
              <a
                href={siteConfig.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <XLogo size={18} aria-hidden="true" />
                X
              </a>
            ) : null}
            {emailConfigured ? (
              <a
                href={`mailto:${siteConfig.businessEmail}`}
                className={linkClass}
              >
                <EnvelopeSimple size={18} aria-hidden="true" />
                {siteConfig.businessEmail}
              </a>
            ) : null}
          </nav>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="mt-12 border-t border-border pt-6">
          <p className="max-w-[72ch] text-xs leading-relaxed text-steel">
            {disclaimer}
          </p>
          <p className="mt-2 font-mono text-xs text-steel">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
