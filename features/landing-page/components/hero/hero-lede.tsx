export function HeroLede({ children }: { children: string }) {
  return <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-[1.75]">{children}</p>;
}
