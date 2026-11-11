import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Small uppercase, letter-spaced monospace text used for eyebrows and meta lines. */
export function MonoLabel({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("font-mono text-xs uppercase tracking-[0.2em]", className)} {...props} />;
}
