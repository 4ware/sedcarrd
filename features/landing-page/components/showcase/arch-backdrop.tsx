import { cn } from "@/lib/utils";

/** Dark olive arch the profile card leans against. Purely decorative; no shadcn equivalent. */
export function ArchBackdrop({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("rounded-t-full bg-gradient-to-b from-olive to-[#26302a]", className)} />;
}
