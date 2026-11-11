import { MonoLabel } from "@/components/mono-label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Paper note showing a profile's public address. */
export function LinkNote({ label, url, className }: { label: string; url: string; className?: string }) {
  return (
    <Card size="sm" className={cn("shadow-lg ring-0", className)}>
      <CardContent className="flex flex-col gap-1 px-5">
        <MonoLabel className="text-[9px] text-muted-foreground sm:text-[10px]">{label}</MonoLabel>
        <span className="font-serif text-base text-primary sm:text-2xl">{url}</span>
      </CardContent>
    </Card>
  );
}
