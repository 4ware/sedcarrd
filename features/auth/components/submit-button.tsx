import { LoaderCircleIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/** Full-width primary submit button with a spinner while the form is pending. */
export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <Button type="submit" size="cta" className="w-full" disabled={pending} aria-busy={pending}>
      {pending ? <LoaderCircleIcon className="animate-spin" data-icon="inline-start" aria-hidden="true" /> : null}
      {children}
    </Button>
  );
}
