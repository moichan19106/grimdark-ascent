import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Lost in the warp | GrimdarkAscent",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center px-5 md:px-8">
          <Link
            href="/"
            className="font-display text-xl font-bold uppercase tracking-wide"
            aria-label="GrimdarkAscent, back to home"
          >
            GRIMDARK<span className="text-blood">ASCENT</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-5 py-24 md:px-8">
        <p className="font-mono text-xs tracking-[0.28em] text-steel">
          404 <span className="text-blood">/</span> SIGNAL LOST
        </p>
        <h1 className="mt-6 font-display text-[clamp(3rem,8vw,6rem)] font-bold uppercase leading-[0.95] tracking-tight">
          This fate does not exist<span className="text-blood">.</span>
        </h1>
        <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-muted-foreground md:text-lg">
          The page you seek was lost somewhere in the warp. The archive, however, still stands.
        </p>
        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-blood px-7 py-3.5 font-mono text-sm font-semibold tracking-[0.18em] text-primary-foreground transition-colors duration-300 hover:bg-blood-strong active:translate-y-[1px]"
          >
            <ArrowLeft size={16} weight="bold" aria-hidden="true" />
            RETURN TO THE ARCHIVE
          </Link>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-5 py-6 md:px-8">
          <p className="text-xs text-steel">
            GrimdarkAscent is an unofficial fan-made channel. Warhammer 40,000 and related names and marks belong to their respective owners.
          </p>
        </div>
      </footer>
    </div>
  );
}
