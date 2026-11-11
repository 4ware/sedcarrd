import { ClapperboardIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function BrandLogo({ label }: { label: string }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label={label}>
      <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <ClapperboardIcon className="size-5" />
      </span>
      <span className="font-serif text-3xl tracking-tight text-foreground">sedcarrd</span>
    </Link>
  );
}
