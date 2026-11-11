import { PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlayLink({ label, href }: { label: string; href: string }) {
  return (
    <Button asChild variant="link" className="h-auto gap-3 px-0 text-base">
      <a href={href}>
        <PlayIcon className="fill-current" data-icon="inline-start" />
        {label}
      </a>
    </Button>
  );
}
