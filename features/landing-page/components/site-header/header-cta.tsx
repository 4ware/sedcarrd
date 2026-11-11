import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeaderCta({ label, href }: { label: string; href: string }) {
  return (
    <Button asChild size="cta" className="hidden sm:inline-flex">
      <a href={href}>
        {label}
        <ArrowRightIcon data-icon="inline-end" />
      </a>
    </Button>
  );
}
