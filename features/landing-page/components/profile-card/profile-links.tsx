import { MonoLabel } from "@/components/mono-label";

/** Dot-separated list of the sections a profile holds, e.g. "REEL · CREDITS · CONTACT". */
export function ProfileLinks({ links }: { links: string[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-2 text-muted-foreground">
      {links.map((link, index) => (
        <li key={link} className="flex items-center gap-2">
          {index > 0 ? <span aria-hidden="true">·</span> : null}
          <MonoLabel className="text-[10px]">{link}</MonoLabel>
        </li>
      ))}
    </ul>
  );
}
