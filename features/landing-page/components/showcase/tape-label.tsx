import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Coral strip of "tape" with a short note. */
export function TapeLabel({ children, className }: { children: string; className?: string }) {
  return (
    <Badge
      className={cn(
        "h-auto bg-accent px-5 py-3 text-xs font-semibold tracking-wider text-accent-foreground shadow-md sm:text-sm",
        className,
      )}
    >
      {children}
    </Badge>
  );
}
