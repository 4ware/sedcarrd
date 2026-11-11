"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EditableSectionProps = {
  /** Small tag shown on hover/selection, e.g. "Name". */
  tag: string;
  /** Accessible name of the edit button, e.g. "Edit name". */
  editLabel: string;
  selected: boolean;
  onEdit: (trigger: HTMLButtonElement) => void;
  className?: string;
  children: ReactNode;
};

/**
 * An element of the live page that opens its fields in the drawer. A transparent button covers the
 * whole block (content stays real headings/lists); hover shows a dashed outline, selection a solid one.
 */
export function EditableSection({ tag, editLabel, selected, onEdit, className, children }: EditableSectionProps) {
  return (
    <div
      data-selected={selected || undefined}
      className={cn(
        "group/element relative rounded-sm outline-2 outline-offset-8 outline-transparent transition-[outline-color]",
        "not-data-selected:hover:outline-dashed not-data-selected:hover:outline-primary/60",
        "has-focus-visible:outline-solid has-focus-visible:outline-primary data-selected:outline-solid data-selected:outline-primary",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-9 left-0 rounded-sm bg-primary px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-wide text-primary-foreground uppercase opacity-0 transition-opacity group-hover/element:opacity-100 group-has-focus-visible/element:opacity-100 group-data-selected/element:opacity-100"
      >
        {tag}
      </span>
      {children}
      <button
        type="button"
        aria-label={editLabel}
        aria-expanded={selected}
        onClick={(event) => onEdit(event.currentTarget)}
        className="absolute inset-0 z-10 cursor-pointer rounded-sm focus-visible:outline-none"
      />
    </div>
  );
}
