type HeroHeadlineProps = {
  lines: readonly string[];
  /** Final, italic, green emphasis line. */
  accent: string;
};

/** id of the hero heading; names the hero section (aria-labelledby). */
export const HERO_HEADLINE_ID = "hero-headline";

export function HeroHeadline({ lines, accent }: HeroHeadlineProps) {
  return (
    <h1 id={HERO_HEADLINE_ID} className="font-serif text-6xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-8xl lg:text-[5.5rem] xl:text-[6.75rem]">
      {lines.map((line) => (
        <span key={line} className="block sm:whitespace-nowrap">
          {line}
        </span>
      ))}
      <em className="block font-medium text-primary sm:whitespace-nowrap">{accent}</em>
    </h1>
  );
}
