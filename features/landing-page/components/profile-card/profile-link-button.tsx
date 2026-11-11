import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Round arrow button that opens the full profile page. */
export function ProfileLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild size="icon-lg" className="size-10 rounded-full">
      <a href={href} aria-label={label}>
        <ArrowUpRightIcon />
      </a>
    </Button>
  );
}
