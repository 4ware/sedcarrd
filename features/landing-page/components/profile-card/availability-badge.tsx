import { Badge } from "@/components/ui/badge";

export function AvailabilityBadge({ children }: { children: string }) {
  return (
    <Badge
      variant="outline"
      className="h-6 rounded-full border-paper/60 bg-black/20 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper backdrop-blur-sm"
    >
      {children}
    </Badge>
  );
}
