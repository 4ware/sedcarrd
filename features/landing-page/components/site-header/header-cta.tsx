import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Primary header action (sign up, or "go to dashboard" for signed-in visitors). */
export function HeaderCta({ label, href, className }: { label: string; href: string; className?: string }) {
  return (
    <Button asChild size="cta" className={cn("hidden sm:inline-flex", className)}>
      <Link href={href}>
        {label}
        <ArrowRightIcon data-icon="inline-end" />
      </Link>
    </Button>
  );
}
