export function ProfileName({ children, id }: { children: string; id?: string }) {
  return (
    <h2 id={id} className="font-serif text-3xl text-paper sm:text-5xl">
      {children}
    </h2>
  );
}
