type HeroHeadlineProps = {
  lines: readonly string[];
  /** Final, italic, green emphasis line. */
  accent: string;
};

export function HeroHeadline({ lines, accent }: HeroHeadlineProps) {
  return (
    <h1 className="font-serif text-6xl font-semibold leading-[0.95] tracking-[-0.04em] text-foreground sm:text-8xl lg:text-[5.5rem] xl:text-[6.75rem]">
      {lines.map((line) => (
        <span key={line} className="block sm:whitespace-nowrap">
          {line}
        </span>
      ))}
      <em className="block font-medium text-primary sm:whitespace-nowrap">{accent}</em>
    </h1>
  );
}
