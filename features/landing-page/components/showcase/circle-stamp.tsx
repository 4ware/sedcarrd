import { cn } from "@/lib/utils";

/** Round coral stamp, e.g. "YOUR NEXT SCENE / starts here". Purely decorative; no shadcn equivalent. */
export function CircleStamp({ top, bottom, className }: { top: string; bottom: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex size-28 flex-col items-center justify-center rounded-full bg-coral-deep text-center text-paper shadow-lg sm:size-36",
        className,
      )}
    >
      <span className="max-w-[6rem] text-[10px] uppercase leading-tight tracking-wide sm:text-xs">{top}</span>
      <span className="mt-1 font-serif text-xl italic sm:text-3xl">{bottom}</span>
    </div>
  );
}
