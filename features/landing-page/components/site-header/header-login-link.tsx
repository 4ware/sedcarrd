import { LogInIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/** Quiet log-in link next to the primary CTA. Icon-only on phones (the label stays for screen readers). */
export function HeaderLoginLink({ label, href }: { label: string; href: string }) {
  return (
    <Button asChild variant="ghost" size="lg" className="px-2 text-[15px] sm:px-2.5">
      <Link href={href} aria-label={label}>
        <LogInIcon data-icon="inline-start" aria-hidden="true" />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    </Button>
  );
}
