import type { ReactNode } from "react";
import { Reveal } from "@/components/site/reveal";

interface SectionHeadingProps {
  title: ReactNode;
  supporting?: ReactNode;
  as?: "h2" | "h3";
}

/** Colors the trailing period of a display headline in the blood accent. */
function accentPeriod(title: ReactNode): ReactNode {
  if (typeof title === "string" && title.endsWith(".")) {
    return (
      <>
        {title.slice(0, -1)}
        <span className="text-blood">.</span>
      </>
    );
  }
  return title;
}

/**
 * Stacked section header: display headline on top, short supporting line below.
 * Deliberately avoids the split left-headline / right-paragraph pattern.
 */
export function SectionHeading({
  title,
  supporting,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <Reveal>
      {/* Short blood rule above the headline: a print-style register mark
          that keeps the section rhythm consistent down the page. */}
      <span
        aria-hidden="true"
        className="mb-6 block h-[3px] w-10 bg-blood"
      />
      <Tag className="font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight text-foreground sm:text-5xl">
        {accentPeriod(title)}
      </Tag>
      {supporting ? (
        <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg">
          {supporting}
        </p>
      ) : null}
    </Reveal>
  );
}
