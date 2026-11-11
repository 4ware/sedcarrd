export function ProfileQuote({ children }: { children: string }) {
  return (
    <blockquote className="font-serif text-lg leading-snug text-card-foreground sm:text-2xl">
      <p>“{children}”</p>
    </blockquote>
  );
}
