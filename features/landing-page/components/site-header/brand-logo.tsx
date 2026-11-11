import { ClapperboardIcon } from "lucide-react";

export function BrandLogo() {
  return (
    <a href="/" className="flex items-center gap-3" aria-label="sedcarrd home">
      <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <ClapperboardIcon className="size-5" />
      </span>
      <span className="font-serif text-3xl tracking-tight text-foreground">sedcarrd</span>
    </a>
  );
}
