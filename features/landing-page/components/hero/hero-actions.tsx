import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayLink } from "./play-link";

type Cta = { label: string; href: string };

export function HeroActions({ primary, secondary }: { primary: Cta; secondary: Cta }) {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
      <Button asChild size="cta-lg">
        <a href={primary.href}>
          {primary.label}
          <ArrowRightIcon data-icon="inline-end" />
        </a>
      </Button>
      <PlayLink {...secondary} />
    </div>
  );
}
