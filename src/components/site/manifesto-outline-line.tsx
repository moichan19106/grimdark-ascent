interface ManifestoOutlineLineProps {
  line: string;
}

/**
 * Outlined middle line of the brand manifesto.
 * Renders with high-contrast bone stroke on transparent text.
 */
export function ManifestoOutlineLine({ line }: ManifestoOutlineLineProps) {
  return (
    <p className="pl-4 sm:pl-[6vw] font-display text-[clamp(2.5rem,9vw,8.5rem)] font-bold uppercase leading-[0.93] tracking-tight text-transparent [-webkit-text-stroke:2px_#e8e3d9] sm:[-webkit-text-stroke:2.5px_#e8e3d9]">
      {line}
    </p>
  );
}
