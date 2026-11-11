import { MonoLabel } from "@/components/mono-label";
import { Separator } from "@/components/ui/separator";

export function HeroEyebrow({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-4">
      <Separator className="w-11! bg-coral-deep" />
      <MonoLabel className="text-primary">{children}</MonoLabel>
    </div>
  );
}
