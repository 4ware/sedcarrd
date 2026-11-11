"use client";

import { useTranslations } from "next-intl";
import { createContext, type ReactNode, useContext } from "react";
import type { PersonSectionKey } from "@/features/people";
import type { ProfileSectionKey } from "@/features/themes";
import { cn } from "@/lib/utils";

type EditorSectionsState = {
  /** The section open in the drawer, if any. */
  selected: PersonSectionKey | null;
  onEdit: (section: PersonSectionKey, trigger: HTMLButtonElement) => void;
};

export const EditorSectionsContext = createContext<EditorSectionsState | null>(null);

/**
 * The editor's Section slot for themes: makes a block clickable. A transparent button covers the
 * block (content stays real headings/lists); hover shows a dashed outline, selection a solid one,
 * both in the theme's accent colour (`--theme-accent`) so they work on light and dark themes.
 */
export function EditableSection({
  section,
  className,
  children,
}: {
  section: ProfileSectionKey;
  className?: string;
  children: ReactNode;
}) {
  const state = useContext(EditorSectionsContext);
  const t = useTranslations("Editor.canvas");
  const tPeople = useTranslations("People");
  if (!state) throw new Error("EditableSection needs EditorSectionsContext");

  const title = tPeople(`sections.${section}`);
  const selected = state.selected === section;

  return (
    <div
      data-selected={selected || undefined}
      className={cn(
        "group/element relative rounded-sm outline-2 outline-offset-8 outline-transparent transition-[outline-color]",
        "not-data-selected:hover:outline-dashed not-data-selected:hover:outline-(--theme-accent)/70",
        "has-focus-visible:outline-solid has-focus-visible:outline-(--theme-accent) data-selected:outline-solid data-selected:outline-(--theme-accent)",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-9 left-0 z-20 rounded-sm bg-(--theme-accent) px-1.5 py-0.5 font-sans text-[0.65rem] font-semibold tracking-wide text-(--theme-on-accent) uppercase opacity-0 transition-opacity group-hover/element:opacity-100 group-has-focus-visible/element:opacity-100 group-data-selected/element:opacity-100"
      >
        {title}
      </span>
      {children}
      <button
        type="button"
        aria-label={t("edit", { section: title })}
        aria-expanded={selected}
        onClick={(event) => state.onEdit(section, event.currentTarget)}
        className="absolute inset-0 z-10 cursor-pointer rounded-sm focus-visible:outline-none"
      />
    </div>
  );
}
